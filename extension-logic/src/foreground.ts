import ContextMenuElement from "./model/htmlElements/contextMenuElement";
import Task from "./model/task";
import User from "./model/user";
import { ChromeMessages, ContextMenuType, MarkingType, TaskType } from "./model/enums";
import messageService from "./service/messageService";
import MessageService, { sendLinkForTimingTask } from "./service/messageService";
import MarkElementsCollection from "./model/marks/markElementsCollection";
import { GlobalEvents, Ids, URL_GAME, WEBSOCKETS_BASE } from "./model/constants";
import eventEmitter from "./model/EventManger";
import MarkingData from "./model/marks/markingData";
import MarkingTaskData from "./model/marks/markingTaskData";
import apiService, { fetchMarkedTexts } from "./service/apiService";
import RatingData from "./model/ratingData";
import SemanticTag from "./model/semanticTag";
import SemanticData from "./model/semanticData";
import InfoElement from "./model/htmlElements/infoElement";
import * as signalR from "@microsoft/signalr";
import Browser from "webextension-polyfill";

declare global {
  interface Window {
    hasRun: boolean;
  }
}

// Avoid loading of script if an instance is already running on the window
if (!window.hasRun) {
  window.hasRun = true;
  runScript();
}

function runScript() {
  const windowUrl: string = window.location.href;

  const markingContextMenu: ContextMenuElement = new ContextMenuElement(ContextMenuType.Marking);
  const semanticContextMenu: ContextMenuElement = new ContextMenuElement(ContextMenuType.Semantic);
  const deleteContextMenu: ContextMenuElement = new ContextMenuElement(ContextMenuType.Deleting);
  const ratingContextMenu: ContextMenuElement = new ContextMenuElement(ContextMenuType.Rating);

  const infoElement: InfoElement = new InfoElement();

  let markingElementsCollections: MarkElementsCollection[] = [];
  const markingTaskData: MarkingData = new MarkingData();
  const semanticTaskData: SemanticData = new SemanticData();

  let activeTask: Task | undefined = undefined;
  let currentUser: User | undefined = undefined;
  let highlightedCollectionId: string = "";

  //#region Firefox 
  // Firefox does not allow for the sending of external messages via the BrowserAPI
  // The injected Script will listen for those Events and relay them to the Extension.
  if (navigator.userAgent.includes("Firefox")) {
    window.addEventListener(ChromeMessages.SetActiveTask, async (event: any) => {
      await messageService.setActiveTaskByTaskType(event.detail.taskType, event.detail.startUrl);
      window.location.replace(event.detail.target);
    });
  }
  //#endregion Firefox

  // Connect signal R to the API
  const connection = new signalR.HubConnectionBuilder().withUrl(`${WEBSOCKETS_BASE}/userHub`).build();

  // Start connection
  connection.start().then(() => {
    connection.invoke("JoinWebsiteGroup", windowUrl);
  });

  // Listen to server Updates for the current URL
  connection.on("MarkUpdates", () => {
    if (activeTask?.taskType == TaskType.MarkingTask) return;
    updateMarkings();
  });

  function removeById(id: string) {
    var elem = document.getElementById(id);
    if (!elem) return;
    elem.parentNode?.removeChild(elem);
  }

  function updateMarkings() {
    if (!currentUser) return;

    fetchMarkedTexts(currentUser.uid, windowUrl).then((marks: MarkingTaskData[]) => {
      marks.forEach((mark: MarkingTaskData) => {
        try {
          const collectionFound = markingElementsCollections.find((x) => x.id == mark.id);

          // If created by self the marking should not be ratable
          let isRatable: boolean = mark.userId != currentUser?.uid;

          // If user already rated an marking should not be ratable
          if (isRatable && mark.userIds != null) {
            mark.userIds.forEach((id) => {
              if (id == currentUser?.uid) isRatable = false;
            });
          }

          if (collectionFound) {
            collectionFound.updateMarkColors(!isRatable && activeTask?.taskType == TaskType.RatingTask);
            return;
          }

          const collection = new MarkElementsCollection(true, isRatable, activeTask?.taskType == TaskType.RatingTask);
          collection.createMarksFromMarkingTaskDataEntry(mark);
          markingElementsCollections.push(collection);
        } catch (error) {
          apiService.updateLoadFail(mark.id);
          console.warn(error);
        }
      });

      setTimeout(() => {
        window.getSelection()?.removeAllRanges();
        window.scrollTo(0, 0);
      }, 100);
    });
  }

  function displaySemanticTag(semanticTag: SemanticTag) {
    const div = document.createElement("div");
    div.classList.add("context-menu", "my-custom-fonting-bonobo", "dragable");
    const header = createHeader(`Der zu Suchende Tag lautet: ${semanticTag.tag}`);
    const label = document.createElement("label");
    label.textContent = semanticTag.tagDescription;

    div.appendChild(header);
    div.appendChild(label);

    div.style.left = "1em";
    div.style.top = "232px";
    div.id = "semantic-tag-container";

    if (windowUrl.includes(URL_GAME) || windowUrl.includes("localhost")) return;

    function handleDrag(elem: HTMLElement) {
      let offsetX = 0;
      let offsetY = 0;
      let isDragging = false;

      // Function to handle mouse down event
      const handleMouseDown = (event: MouseEvent) => {
        isDragging = true;
        offsetX = event.clientX - elem.getBoundingClientRect().left;
        offsetY = event.clientY - elem.getBoundingClientRect().top;
      };

      // Function to handle mouse move event
      const handleMouseMove = (event: MouseEvent) => {
        if (isDragging) {
          elem.style.left = event.clientX - offsetX + "px";
          elem.style.top = event.clientY - offsetY + "px";
        }
      };

      // Function to handle mouse up event
      const handleMouseUp = () => {
        isDragging = false;
      };

      // Add event listeners
      elem.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    handleDrag(div);

    document.body.appendChild(div);
    semanticTaskData.tag = semanticTag;
  }

  let updateId = -1;
  function updateActiveTask() {
    window.clearTimeout(updateId);
    updateId = window.setTimeout(() => {
      messageService.getActiveTask().then(async (res: Task | undefined) => {
        activeTask = res;

        //Should user not be defined return.
        if (!currentUser) return;
        if (activeTask?.taskType) {
          removeById("select-task-container");
          removeById("semantic-tag-container");
        }

        if (windowUrl.includes(URL_GAME) || windowUrl.includes("localhost")) return;
        infoElement.updateContent(activeTask?.taskType);

        switch (activeTask?.taskType) {
          case TaskType.TimingTask:
            sendLinkForTimingTask("none", windowUrl);
            break;
          case TaskType.ExploringTask:
            messageService.sendLinkForExplorationTask("none", windowUrl);
            break;
          case TaskType.ScoutingTask:
          case TaskType.SemanticTask:
            messageService.getCurrentSemanticTag().then((res: SemanticTag) => displaySemanticTag(res));
            break;
          case TaskType.MarkingTask:
          case TaskType.RatingTask:
            updateMarkings();
            break;
          default:
            const formElem = document.getElementById("select-task-container");
            removeById("info-element-container");
            removeById("semantic-tag-container");

            if (windowUrl.includes(URL_GAME) || windowUrl.includes("localhost")) return;

            if (res == undefined && !formElem) {
              document.body.appendChild(form);

              setTimeout(() => {
                form.reset();
              }, 200);
            }

            updateMarkings();
            break;
        }
      });
    }, 300);
  }

  messageService.getUser().then((res: User) => {
    currentUser = res;
    updateActiveTask();
  });

  function markArea(markingType: MarkingType): void {
    markingContextMenu.hideContextMenu();
    semanticContextMenu.hideContextMenu();

    const collection: MarkElementsCollection = new MarkElementsCollection();
    const res: MarkingTaskData = collection.createMarksFromSelection(markingType);

    if (activeTask?.taskType == TaskType.MarkingTask) {
      markingTaskData.addMarkingData(res);
      markingElementsCollections.push(collection);
      // Push changes to background service
      messageService.pushMarkingData(res);
    }

    if (activeTask?.taskType == TaskType.SemanticTask || activeTask?.taskType == TaskType.ScoutingTask) {
      semanticTaskData.addMarkingData(res);
      markingElementsCollections.push(collection);
      // Push changes to background service
      messageService.pushSemanticData(res);
    }
  }

  document.addEventListener("contextmenu", (event: MouseEvent) => {
    markingContextMenu.hideContextMenu();
    semanticContextMenu.hideContextMenu();

    if (!activeTask) return;

    if (activeTask.taskType == TaskType.TimingTask) return;
    if (activeTask.taskType == TaskType.RatingTask) return;
    if (activeTask.taskType == TaskType.ExploringTask) return;

    //Check if there is selected Text
    const selectedText: string | undefined = window.getSelection()?.toString().trim();
    if (!selectedText) return;
    if (selectedText.length <= 0) return;

    event.preventDefault();
    if (activeTask.taskType == TaskType.SemanticTask || activeTask.taskType == TaskType.ScoutingTask)
      semanticContextMenu.showContextMenu();

    if (activeTask.taskType == TaskType.MarkingTask)
      markingContextMenu.showContextMenu();
  });

  let selectedElement: HTMLElement | null = null;
  let initialX = 0;
  let initialY = 0;

  document.addEventListener("mousedown", (event: any) => {
    let formElement = event.target.closest("#select-task-container");
    if (formElement) {
      selectedElement = formElement;
      initialX = event.clientX;
      initialY = event.clientY;
    }
  });

  document.addEventListener("mouseup", (event: any) => {
    // Reset the selected element
    selectedElement = null;
  });

  document.addEventListener("mousemove", (event: any) => {
    if (selectedElement) {
      let dx = event.clientX - initialX;
      let dy = event.clientY - initialY;
      selectedElement.style.left = `${selectedElement.offsetLeft + dx}px`;
      selectedElement.style.top = `${selectedElement.offsetTop + dy}px`;
      initialX = event.clientX;
      initialY = event.clientY;
    }
  });

  document.addEventListener("click", (event) => {
    setTimeout(() => {
      deleteContextMenu.hideContextMenu();
      markingContextMenu.hideContextMenu();
    }, 0);

    markingElementsCollections.forEach((collection) => collection.deactivateHighlights());

    if (!activeTask) return;
    const elem: HTMLElement | null = event.target as HTMLElement;
    if (activeTask.taskType == TaskType.TimingTask) {
      sendLinkForTimingTask(elem ? elem.innerText : "none", window.location.href);
    }

    if (activeTask.taskType == TaskType.ExploringTask) {
      messageService.sendLinkForExplorationTask(elem ? elem.innerText : "none", window.location.href);
    }
  });

  eventEmitter.addListener(GlobalEvents.ButtonClicked, (id: string) => {
    if (id.includes(Ids.DeleteButton)) removeCollection();
    if (id.includes(Ids.RatingButton)) handleRatingClick(id);

    if (id.includes(Ids.WellFormulatedButton)) markArea(MarkingType.WellFormulated);
    if (id.includes(Ids.BadlyFormulatedButton)) markArea(MarkingType.NotUnderstandable);
    if (id.includes(Ids.SemanticMarkButton)) markArea(MarkingType.Semantic);

    setTimeout(() => {
      ratingContextMenu.hideContextMenu();
      deleteContextMenu.hideContextMenu();
      markingContextMenu.hideContextMenu();
    }, 0);
  });

  let lastCollectionClicked = "";
  eventEmitter.addListener(
    GlobalEvents.CollectionClicked,
    (args: { htmlId: string; id: string; isRating: boolean; markType: MarkingType; tag: string | undefined }) => {
      const splitId = args.htmlId.split("-");
      if (splitId.length == 4) {
        lastCollectionClicked = `${splitId[1]}-${splitId[2]}`;
      }

      if (args.isRating && activeTask?.taskType == TaskType.RatingTask) {
        highlightedCollectionId = args.id;
        ratingContextMenu.hideContextMenu();
        ratingContextMenu.showContextMenu(args.htmlId, args.markType, args.tag);
        return;
      }
      deleteContextMenu.hideContextMenu();
      deleteContextMenu.showContextMenu(args.htmlId);
    }
  );

  function removeCollection(collectionId?: string) {
    // Use last id if collectionId = undefined
    const idToUse = collectionId == undefined ? lastCollectionClicked : collectionId;

    // Delete from background script
    if (collectionId != undefined) {
      const elem = markingElementsCollections.find((x) => x.id == idToUse);
      elem?.removeElements();
      markingElementsCollections = markingElementsCollections.filter((item) => item.id !== idToUse);

      return;
    }

    // Delete from foreground script
    messageService.removeMarkingDataById(idToUse).then(() => {
      const elem = markingElementsCollections.find((x) => x.id == idToUse);
      elem?.removeElements();

      markingElementsCollections = markingElementsCollections.filter((item) => item.id !== idToUse);
    });
  }

  function handleRatingClick(id: string) {
    const rating = id.replaceAll("rating-button-", "").replaceAll("-text", "");

    const ratingData = new RatingData(
      highlightedCollectionId,
      currentUser?.uid ?? "",
      currentUser?.username ?? "",
      parseInt(rating ?? "-2") + 1
    );

    MessageService.addRatingData(ratingData).then(() => {
      const res = markingElementsCollections.find((x) => x.id == lastCollectionClicked);
      if (res == undefined) return;

      const lastElem = res.markElements[res.markElements.length - 1];
      const lastDocElem = document.getElementById(lastElem.id);

      const symbol = document.createElement("span");
      symbol.innerHTML = "★";
      symbol.style.color = "blue";
      symbol.style.borderRadius = "25%";
      symbol.style.position = "absolute";
      symbol.style.top = "-1.25em";
      symbol.style.right = "0";
      symbol.title = "Bereits bewertet";

      if (!lastDocElem) return;

      lastDocElem.style.position = "relative";
      lastDocElem.appendChild(symbol);
    });
  }

  Browser.runtime.onMessage.addListener((request: { message: ChromeMessages, data: any }) => {
    switch (request.message) {
      case ChromeMessages.RemoveMarkingTaskEntry: {
        if (!request.data) return;
        //Remove the element that matches the received ID.
        removeCollection(request.data);
        break;
      }

      case ChromeMessages.SetActiveTask: {
        activeTask = request.data;
        updateActiveTask();

        switch (activeTask?.taskType) {
          case TaskType.TimingTask:
            sendLinkForTimingTask("none", window.location.href);
            break;
          case TaskType.RatingTask:
          case TaskType.SemanticTask:
          case TaskType.MarkingTask:
          default:
            break;
        }
      }
    }
  });

  // Function to create a radio button with a label
  function createRadioButton(id: string, name: string, labelText: string) {
    const container = document.createElement("div");
    container.classList.add("radio-container");

    const input = document.createElement("input");
    input.type = "radio";
    input.id = id;
    input.value = id;
    input.name = name;

    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;

    container.appendChild(input);
    container.appendChild(label);

    return container;
  }

  function createHeader(content: string) {
    const header = document.createElement("div");
    header.innerText = content;
    header.classList.add("context-header");

    return header;
  }

  // Get the form element by its ID
  const form = document.createElement("form");
  const header = createHeader("Aufgabe Auswählen (Stellen Sie bitte sicher, dass die Internetseite auf Deutsch gestellt ist.)");

  // Add radio buttons to the form
  form.appendChild(header);
  form.appendChild(createRadioButton("erreichbarkeit", "options", "Erreichbarkeit prüfen"));
  form.appendChild(createRadioButton("markieren", "options", "Markieren"));
  form.appendChild(createRadioButton("bewerten", "options", "Bewerten"));
  form.appendChild(createRadioButton("semantisch-markieren", "options", "Semantisch (Markieren)"));
  form.appendChild(createRadioButton("semantisch-finden", "options", "Semantisch (Finden)"));
  form.classList.add("context-menu", "my-custom-fonting-bonobo", "dragable");

  const button = document.createElement("button");
  button.innerText = "Schließen";
  button.classList.add("my-button");
  button.type = "button";
  button.onclick = () => {
    removeById("select-task-container");
  };

  form.appendChild(button);
  form.id = "select-task-container";
  form.style.left = "1em";
  form.style.top = "1em";

  let formControls = form.elements;
  for (let i = 0; i < formControls.length; i++) {
    formControls[i].addEventListener("change", async (event: any) => {
      console.log(event.target.value);
      const value = event.target.value;
      switch (value) {
        case "erreichbarkeit":
          await messageService.setActiveTaskByTaskType(TaskType.TimingTask);
          window.location.replace(window.location.origin);
          (document.getElementById("markieren") as any).checked = false;
          break;
        case "markieren":
          await messageService.setActiveTaskByTaskType(TaskType.MarkingTask);
          (document.getElementById("markieren") as any).checked = false;
          break;
        case "bewerten":
          await messageService.setActiveTaskByTaskType(TaskType.RatingTask);
          (document.getElementById("bewerten") as any).checked = false;
          break;
        case "semantisch-markieren":
          await messageService.setActiveTaskByTaskType(TaskType.SemanticTask);
          (document.getElementById("semantisch-markieren") as any).checked = false;
          break;
        case "semantisch-finden":
          await messageService.setActiveTaskByTaskType(TaskType.ScoutingTask);
          (document.getElementById("semantisch-finden") as any).checked = false;
          break;
      }
      updateActiveTask();
      form.reset();
    });
  }

  if (windowUrl.includes(URL_GAME) || windowUrl.includes("localhost")) return;
  document.body.append(form);
}

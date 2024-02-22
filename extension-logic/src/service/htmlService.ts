import {Ids} from "../model/constants";

export default class HtmlService {
    updateUiWithUserCount = (userCount: number) => {
        const countElement = document.getElementById(Ids.UserCountElement);
        if (countElement != null) countElement.textContent = `Anzahl an aktiven Nutzern: ${userCount}`;
    }

}

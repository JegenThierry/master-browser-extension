export enum ChromeMessages {
	SetActiveTask = "SetActiveTask",
	GetActiveTask = "GetActiveTask",
	AddTimingTaskEntry = "AddTimingTaskEntry",
	GetTimingTaskData = "GetTimingTaskData",
	GetTimingTaskStartTimestamp = "GetTimingTaskStartTimestamp",
	GetRatingData = "GetRatingData",
	AddRatingData = "AddRatingData",
	AddMarkingTaskEntry = "AddMarkingTaskEntry",
	GetMarkingData = "GetMarkingData",
	RemoveMarkingTaskEntry = "RemoveMarkingTaskEntry",
	SetUser = "SetUser",
	GetUser = "GetUser",
	ResponseSuccess = "ResponseSuccess",
	ResponseFailure = "ResponseFailure",
	GetExtensionId = "GetExtensionId",
	ResetData = "ResetData",
	GetCurrentSemanticTag = "GetCurrentSemanticTag",
	GetSemanticData = "GetSemanticData",
	AddMarkingToSemanticData = "AddMarkingToSemanticData",
	SetActiveTaskByTaskType = "SetActiveTaskByTaskType",
	AddExplorationTaskEntry = "AddExplorationTaskEntry",
	GetExplorationTaskData = "GetExplorationTaskData",
}

export enum Teams {
	Wizards,
	Glitch,
	Neutral,
}

export enum Phase {
	Baseline = "Baseline",
	GameOnly = "GameOnly",
	GamificationAll = "GamificationAll",
	GamificationCustomization = "GamificationCustomization",
	GamificationPersonalization = "GamificationPersonalization",
}

export enum TaskType {
	MarkingTask = "MarkingTask",
	TimingTask = "TimingTask",
	ExploringTask = "ExploringTask",
	RatingTask = "RatingTask",
	SemanticTask = "SemanticTask",
	ScoutingTask = "ScoutingTask",
}

export enum MarkingType {
	WellFormulated = "WellFormulated",
	NotUnderstandable = "NotUnderstandable",
	Semantic = "Semantic",
}

export enum ContextMenuType {
	Marking,
	Rating,
	Deleting,
	Semantic,
}

export enum IconType {
	Marker,
	Delete,
}

export enum ButtonType {
	MarkingButtonWellFormulated,
	MarkingButtonBadlyFormulated,
	DeleteButton,
	RatingButton,
}

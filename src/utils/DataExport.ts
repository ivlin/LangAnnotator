import { MarkableTextItem, Annotation } from '../components/MarkableTextElement';

export type AppState = {
	content: MarkableTextItem[],
	annotations: Annotation[]
}

export const getAppState = function(appState: AppState) {
	return JSON.stringify({
		"content": appState.content,
		"annotations": appState.annotations
	});
}

export const getUrlForString = function(newJsonData: string, textFile: string) {
	if (newJsonData === "") { return ""; }

	var data: Blob = new Blob([newJsonData], {type: 'text/json'});
	if (textFile !== null) {
	  window.URL.revokeObjectURL(textFile);
	}
	textFile = window.URL.createObjectURL(data);
	return textFile;
};

export const loadDataFromJson = function(jsonString: string) {
	const appState: AppState = JSON.parse(jsonString);
	const annotationMap = new Map<string, Annotation>();
	appState.content.forEach(
		(contentItem: MarkableTextItem) => {
			const annotationSubscription: Annotation[] = [];
			contentItem.annotations.forEach(
				(annotation: Annotation) => {
					if (!annotationMap.has(annotation.key)) {
						annotationMap.set(annotation.key, new Annotation(annotation.annotationClass, annotation.comment));
					}
					annotationSubscription.push(annotationMap.get(annotation.key)!);
				});
			contentItem.annotations = annotationSubscription;
		});
	return appState;
}

export const getContentFromFile = function(file: File, successCallback: (fileContent: string) => void) {
	var reader = new FileReader();
	reader.readAsText(file,'UTF-8');
	reader.onload = readerEvent => {
		var content = readerEvent.target?.result;
		if (content) { successCallback(content as string) }
	}
}
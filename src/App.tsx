import React, { useState, useCallback, createContext } from 'react';
import './App.css';

import { TextInputController } from './components/TextInputController';
import { TextDisplay } from './components/TextDisplay';
import { Color, MarkableTextElement, MarkableTextItem, Annotation } from './components/MarkableTextElement';
import { AnnotationManager } from './components/AnnotationManager';
import { TopNavigator } from './components/TopNavigator';
import { ConfigModal } from './components/ConfigModal';
import { HelpModal } from './components/HelpModal';
import { AppState } from './utils/DataExport';
import { getContentItemKey } from './utils/KeyGlobals';

function getAnnotationByKey(items: MarkableTextItem[], key: string) {
  const result = items.filter(item => item.key === key);
  if (result.length === 0) { return; }
  return result[0];
}

function hasMatchingAnnotations(annotation1: Annotation[], annotation2: Annotation[]) {
  const annotationSet1 = new Set(annotation1);
  const annotationSet2 = new Set(annotation2);
  let matching = annotationSet1.size === annotationSet2.size;
  annotationSet1.forEach((annotation) => { 
    matching = matching && annotationSet2.has(annotation);
  });
  return matching;
}

function App() {
  // State
  const [content, setContent] = useState<MarkableTextItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [modalAnnotation, setModalAnnotation] = useState<Annotation>();
  const [configVisibility, setConfigVisibility] = useState(false);
  const [helpVisibility, setHelpVisibility] = useState(false);
  const baseAnnotation = new Annotation(Color.White, "");

  // Callbacks
  // Create a new element
  const appendContent = useCallback((suffix: string) => {
    // Merge into previous
    if (content.length > 0 && content[content.length - 1].annotations.length == 1) {
      content[content.length - 1].content += suffix;
      setContent( [...content] );
      return;
    }
    // Append as new
    const appendContentElement: MarkableTextItem = {
      key: getContentItemKey(),
      content: suffix,
      annotations: [baseAnnotation]
    }

    setContent( content.concat(appendContentElement) );
  }, [content]);

  const deleteAnnotationHandler = useCallback((deleted: Annotation) => {
    const reducedContents: MarkableTextItem[] = [];
    content.forEach(item => {
      if (reducedContents.length == 0) {
        reducedContents.push(item);
        return;
      }
      // Check for a merge
      item.annotations = item.annotations.filter(annotation => annotation !== deleted);

      const canMerge = hasMatchingAnnotations(item.annotations, 
        reducedContents[reducedContents.length - 1].annotations);
      if (canMerge) {
        reducedContents[reducedContents.length - 1].content += item.content;
      } 
      else {
        reducedContents.push(item);
      }
    });
    setContent(reducedContents);
    setModalAnnotation(undefined);
  }, [content]);

  const splitContent = useCallback(() => {
    const selection = window.getSelection();
    if (selection === null || editMode) {
      return;
    }

    const startNode = selection.anchorNode;
    const startKey = startNode?.parentElement?.dataset?.key;
    const endNode = selection.focusNode;
    const endKey = endNode?.parentElement?.dataset?.key;

    if (startKey === endKey && selection.anchorOffset === selection.focusOffset){
      const keyedItem = getAnnotationByKey(content, startKey!);
      if (keyedItem && keyedItem.annotations.length > 1) {
        setModalAnnotation(keyedItem.annotations[0]);
      }
      return;
    }

    const newAnnotation = new Annotation(Color.Pink, "");
    const updatedContent: MarkableTextItem[] = [];
    let start = false;
    let end = false;

    content.forEach((itm) => {
      const contentLength = itm.content.length;
      const startOffset = itm.key === startKey ? selection.anchorOffset : 0;
      const endOffset = itm.key === endKey ? selection.focusOffset : itm.content.length;

      start = start || itm.key === startKey;
      if (startOffset > 0) {
        updatedContent.push({
          key: getContentItemKey(),
          content: itm.content.substr(0, startOffset),
          annotations: [...itm.annotations]
        });
      }
      
      const updatedAnnotations = [...itm.annotations];
      if (start && !end) {
        updatedAnnotations.unshift(newAnnotation);
      }
      updatedContent.push({
          key: itm.key,
          content: itm.content.substr(startOffset, endOffset - startOffset),
          annotations: updatedAnnotations
        });

      end = end || itm.key === endKey;
      if (endOffset < contentLength) {
        updatedContent.push({
          key: getContentItemKey(),
          content: itm.content.substr(endOffset),
          annotations: [...itm.annotations]
        });
      }
    });

    setContent(updatedContent);
    setModalAnnotation(newAnnotation);
  }, [content, editMode, modalAnnotation]);

  const updateAppStateCallback = useCallback((appState: AppState) => {
    setContent(appState.content);
  }, [content]);

  const toggleEditModeCallback = useCallback(() => setEditMode(!editMode), [editMode]);
  const toggleConfigVisibility = useCallback(() => setConfigVisibility(!configVisibility), [configVisibility])
  const toggleHelpVisibility = useCallback(() => setHelpVisibility(!helpVisibility), [helpVisibility]);
  const hideAnnotationCallback = useCallback(() => setModalAnnotation(undefined), [modalAnnotation]);
  
  const appState: AppState = {content: content, annotations: []};
  return (
    <div className="App">
      <header className="App-header">
        <TextInputController appendHandler={appendContent} editMode={editMode} 
          toggleEditModeHandler={toggleEditModeCallback} toggleConfigModal={toggleConfigVisibility} 
          toggleHelpModal={toggleHelpVisibility} />
      </header>
      <div className="App-body">
        <TextDisplay content={content} highlightCallback={splitContent} editMode={editMode} />
        { modalAnnotation && <AnnotationManager annotation={modalAnnotation} 
            hideAnnotationHandler={hideAnnotationCallback}
            deleteHandler={deleteAnnotationHandler} /> }
        { configVisibility && <ConfigModal hideConfigHandler={toggleConfigVisibility} appState={appState} 
            resetAppState={updateAppStateCallback}/> }
        { helpVisibility && <HelpModal hideHelpHandler={toggleHelpVisibility} /> }
      </div>
    </div>
  );
}

export default App;

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
import {OptionsMenu } from "./components/OptionsMenu"
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
  const [modalAnnotations, setModalAnnotations] = useState<Annotation[]>([]);
  const [configVisibility, setConfigVisibility] = useState(false);
  const [helpVisibility, setHelpVisibility] = useState(false);
  const baseAnnotation = new Annotation(Color.White, 0, "");

  // Callbacks
  // Create a new element
  const appendContent = useCallback((suffix: string) => {
    if (content.length > 0) { suffix = "\n" + suffix }
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
      item.annotations = item.annotations.filter(annotation => annotation !== deleted);

      if (reducedContents.length == 0) {
        reducedContents.push(item);
        return;
      }

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
    setModalAnnotations([]);
  }, [content]);

  const splitContent = useCallback(() => {
    const selection = window.getSelection();
    if (selection === null || editMode) {
      return;
    }

    let startNode = selection.anchorNode;
    let startOffset = selection.anchorOffset;
    let startKey = startNode?.parentElement?.dataset?.key;
    let endNode = selection.focusNode;
    let endOffset = selection.focusOffset;
    let endKey = endNode?.parentElement?.dataset?.key;

    if (startKey === endKey && startOffset === endOffset) {
      return;
    }
    else if (content.findIndex(itm => itm.key === startKey) > content.findIndex(itm => itm.key === endKey) || 
      (content.findIndex(itm => itm.key === startKey) === content.findIndex(itm => itm.key === endKey) && startOffset > endOffset)) {
      [startNode, startOffset, startKey, endNode, endOffset, endKey] = [endNode, endOffset, endKey, startNode, startOffset, startKey]  
    }

    const newAnnotation = new Annotation(Color.Red, 1, "");
    const updatedContent: MarkableTextItem[] = [];
    let start = false;
    let end = false;
    let overlappingAnnotationHeights = new Set();

    content.forEach((itm) => {
      const contentLength = itm.content.length;
      const startItemOffset = itm.key === startKey ? startOffset : 0;
      const endItemOffset = itm.key === endKey ? endOffset : itm.content.length;

      start = start || itm.key === startKey;
      if (startItemOffset > 0) {
        updatedContent.push({
          key: getContentItemKey(),
          content: itm.content.substr(0, startItemOffset),
          annotations: [...itm.annotations]
        });
      }
      
      const updatedAnnotations = [...itm.annotations];
      if (start && !end) {
        updatedAnnotations.forEach(annotation => { overlappingAnnotationHeights.add(annotation.annotationHeight ); });
        updatedAnnotations.unshift(newAnnotation);
      }
      updatedContent.push({
          key: itm.key,
          content: itm.content.substr(startItemOffset, endItemOffset - startItemOffset),
          annotations: updatedAnnotations
        });

      end = end || itm.key === endKey;
      if (endItemOffset < contentLength) {
        updatedContent.push({
          key: getContentItemKey(),
          content: itm.content.substr(endItemOffset),
          annotations: [...itm.annotations]
        });
      }
    });

    while (overlappingAnnotationHeights.has(newAnnotation.annotationHeight)) {
      newAnnotation.annotationHeight += 1;
    }
    setContent(updatedContent);
    setModalAnnotations([newAnnotation]);
  }, [content, editMode, modalAnnotations]);

  const updateAppStateCallback = useCallback((appState: AppState) => {
    setContent(appState.content);
  }, [content]);

  const toggleHighlightModeCallback = useCallback(() => setEditMode(false), [editMode]);
  const toggleEditModeCallback = useCallback(() => setEditMode(true), [editMode]);
  const toggleConfigVisibility = useCallback(() => setConfigVisibility(!configVisibility), [configVisibility])
  const toggleHelpVisibility = useCallback(() => setHelpVisibility(!helpVisibility), [helpVisibility]);
  const hideAnnotationCallback = useCallback(() => setModalAnnotations([]), [modalAnnotations]);
  const openAnnotationCallback = useCallback((annotations: Annotation[]) => setModalAnnotations(annotations), [modalAnnotations]);

  const appState: AppState = {content: content, annotations: []};
  return (
    <div className="App">
      <header className="App-header">
        <OptionsMenu editMode={editMode} 
          toggleHighlightModeCallback={toggleHighlightModeCallback}
          toggleEditModeCallback={toggleEditModeCallback} 
          toggleConfigVisibility={toggleConfigVisibility} 
          toggleHelpVisibility={toggleHelpVisibility} />
      </header>
      <div className="App-body">
        <TextDisplay content={content} openAnnotationCallback={openAnnotationCallback} highlightCallback={splitContent} editMode={editMode} />
        <TextInputController appendHandler={appendContent} />
        { modalAnnotations.length > 0 && <AnnotationManager annotations={modalAnnotations} 
            hideAnnotationHandler={hideAnnotationCallback}
            deleteHandler={deleteAnnotationHandler} /> }
        { configVisibility && <ConfigModal hideConfigHandler={toggleConfigVisibility} appState={appState} 
            resetAppState={updateAppStateCallback}/> }
        { helpVisibility && <HelpModal hideHelpHandler={toggleHelpVisibility} /> }
      </div>
      <div className="appFooter">
        LangAnnotator
      </div>
    </div>
  );
}

export default App;

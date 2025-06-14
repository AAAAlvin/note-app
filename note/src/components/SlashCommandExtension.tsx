'use client';

import { Editor, Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance } from 'tippy.js';

import SlashCommandList from './SlashCommandList';

export interface SlashCommandOptions {
  char: string;
}

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return {
      char: '/',
    };
  },

  addProseMirrorPlugins() {
    let component: ReactRenderer | null = null;
    let popup: Instance | null = null;

    return [
      new Plugin({
        key: new PluginKey('slashCommand'),
        
        view() {
          return {
            update: (view) => {
              const { state } = view;
              const { doc, selection } = state;
              const { from, to } = selection;

              // 현재 커서 위치의 텍스트 확인
              const currentText = doc.textBetween(from - 1, to, '');
              const currentChar = currentText && currentText.charAt(0);

              // 슬래시 명령어 시작 또는 취소 처리
              if (currentChar === '/') {
                // 이미 팝업이 열려있다면 업데이트만
                if (component && popup) {
                  component.updateProps({
                    editor: this.editor,
                    query: '',
                  });
                  return;
                }

                // 팝업 생성
                component = new ReactRenderer(SlashCommandList, {
                  props: {
                    editor: this.editor,
                    query: '',
                    onCommand: (command: { command: (arg0: { editor: Editor }) => void }) => {
                      command.command({ editor: this.editor });
                      if (popup) {
                        popup.hide();
                      }
                    },
                  },
                  editor: this.editor,
                });

                // Tippy.js로 팝업 생성
                const { element } = component;
                const editorElement = view.dom;

                if (!editorElement) return;

                popup = tippy(editorElement, {
                  getReferenceClientRect: () => {
                    const { from } = view.state.selection;
                    return view.coordsAtPos(from) as DOMRect;
                  },
                  appendTo: () => document.body,
                  content: element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                });
              } else {
                // 다른 키를 눌렀을 때 팝업 닫기
                if (popup) {
                  popup.hide();
                  popup.destroy();
                  popup = null;
                  component?.destroy();
                  component = null;
                }
              }
            },
            destroy: () => {
              if (popup) {
                popup.destroy();
                popup = null;
              }
              if (component) {
                component.destroy();
                component = null;
              }
            }
          };
        },
      }),
    ];
  },
}); 
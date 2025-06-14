import { Extension } from '@tiptap/core';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export interface UniqueIDOptions {
  types: string[];
  attributeName: string;
  generateID: () => string;
}

export const UniqueID = Extension.create<UniqueIDOptions>({
  name: 'uniqueID',

  addOptions() {
    return {
      types: ['heading', 'paragraph', 'bulletList', 'orderedList', 'blockquote', 'codeBlock'],
      attributeName: 'id',
      generateID: () => `id-${Math.random().toString(36).substr(2, 9)}`,
    };
  },

  addGlobalAttributes() {
    return this.options.types.map(type => ({
      types: [type],
      attributes: {
        [this.options.attributeName]: {
          default: null,
          parseHTML: element => element.getAttribute(`data-${this.options.attributeName}`),
          renderHTML: attributes => {
            if (!attributes[this.options.attributeName]) {
              return {};
            }

            return {
              [`data-${this.options.attributeName}`]: attributes[this.options.attributeName],
            };
          },
        },
      },
    }));
  },

  addProseMirrorPlugins() {
    const attributeName = this.options.attributeName;
    const generateID = this.options.generateID;
    const types = this.options.types;

    return [
      new Plugin({
        key: new PluginKey('uniqueID'),
        appendTransaction: (transactions, oldState, newState) => {
          // This is called when the document changes
          const docChanged = transactions.some(transaction => transaction.docChanged);
          const { tr } = newState;

          if (!docChanged) {
            return;
          }

          // Check which nodes need IDs
          newState.doc.descendants((node: ProseMirrorNode, pos: number) => {
            if (!types.includes(node.type.name)) {
              return;
            }

            // If a node doesn't have an ID, add one
            if (node.attrs[attributeName] === null) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                [attributeName]: generateID(),
              });
            }
          });

          return tr.steps.length ? tr : null;
        },
      }),
    ];
  },
});

export default UniqueID; 
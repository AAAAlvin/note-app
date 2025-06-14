import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import GridBlockView from '../GridBlockView';

export interface GridBlockOptions {
  rows: number;
  cols: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    gridBlock: {
      /**
       * 그리드 블록 추가
       */
      insertGridBlock: (options?: { rows?: number; cols?: number }) => ReturnType;
    };
  }
}

export const GridBlock = Node.create<GridBlockOptions>({
  name: 'gridBlock',
  
  group: 'block',
  
  content: 'block+',
  
  isolating: true,
  
  addOptions() {
    return {
      rows: 3,
      cols: 3,
    };
  },
  
  addAttributes() {
    return {
      rows: {
        default: 3,
        parseHTML: element => parseInt(element.getAttribute('data-rows') || '3', 10),
        renderHTML: attributes => {
          return {
            'data-rows': attributes.rows,
          };
        },
      },
      cols: {
        default: 3,
        parseHTML: element => parseInt(element.getAttribute('data-cols') || '3', 10),
        renderHTML: attributes => {
          return {
            'data-cols': attributes.cols,
          };
        },
      },
      cells: {
        default: [],
        parseHTML: element => {
          try {
            return JSON.parse(element.getAttribute('data-cells') || '[]');
          } catch (e) {
            return [];
          }
        },
        renderHTML: attributes => {
          return {
            'data-cells': JSON.stringify(attributes.cells),
          };
        },
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="grid-block"]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'grid-block', class: 'grid-block' }), 0];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(GridBlockView);
  },
  
  addCommands() {
    return {
      insertGridBlock: (options = {}) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { 
            rows: options.rows || this.options.rows,
            cols: options.cols || this.options.cols,
            cells: Array(options.rows || this.options.rows).fill(null).map(() => 
              Array(options.cols || this.options.cols).fill(null).map(() => ({
                content: '',
              }))
            ),
          },
        });
      },
    };
  },
});

export default GridBlock; 
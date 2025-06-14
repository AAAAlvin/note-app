import { Extension } from '@tiptap/core';

export interface CustomDragHandleOptions {
  dragHandleWidth: number;
}

export const CustomDragHandle = Extension.create<CustomDragHandleOptions>({
  name: 'customDragHandle',

  addOptions() {
    return {
      dragHandleWidth: 24,
    };
  },

  addProseMirrorPlugins() {
    let dragHandleElement: HTMLElement | null = null;

    const createDragHandle = () => {
      // 이미 생성된 드래그 핸들이 있다면 제거
      if (dragHandleElement) {
        document.body.removeChild(dragHandleElement);
      }

      // 새 드래그 핸들 생성
      dragHandleElement = document.createElement('div');
      dragHandleElement.classList.add('notion-drag-handle');
      dragHandleElement.innerHTML = `
        <div class="notion-drag-handle-btn">
          <div class="notion-drag-handle-bullet"></div>
          <div class="notion-drag-handle-bullet"></div>
          <div class="notion-drag-handle-bullet"></div>
          <div class="notion-drag-handle-bullet"></div>
          <div class="notion-drag-handle-bullet"></div>
          <div class="notion-drag-handle-bullet"></div>
        </div>
      `;
      document.body.appendChild(dragHandleElement);
      return dragHandleElement;
    };

    return [
      {
        key: 'customDragHandle',
        view: () => {
          const dragHandle = createDragHandle();
          
          return {
            update: (view) => {
              if (!view || !view.dom) return;

              const dom = view.dom;
              // 블록 타입 요소 선택
              const blocks = dom.querySelectorAll('p, h1, h2, h3, ul, ol, pre, blockquote');
              
              if (!blocks.length) {
                dragHandle.style.display = 'none';
                return;
              }

              // 모든 블록에 대해 이벤트 리스너 추가
              blocks.forEach((block) => {
                // 마우스 오버 시 드래그 핸들 표시
                block.addEventListener('mouseover', (e) => {
                  const rect = block.getBoundingClientRect();
                  dragHandle.style.display = 'block';
                  dragHandle.style.top = `${rect.top + window.scrollY}px`;
                  dragHandle.style.left = `${rect.left + window.scrollX - this.options.dragHandleWidth - 8}px`;
                  dragHandle.style.height = `${rect.height}px`;
                });

                // 마우스 아웃 시 드래그 핸들 숨김
                block.addEventListener('mouseout', (e) => {
                  // 핸들로 이동하는 경우 제외
                  if (e.relatedTarget && dragHandle.contains(e.relatedTarget as Node)) {
                    return;
                  }
                  dragHandle.style.display = 'none';
                });
              });
            },
            destroy: () => {
              if (dragHandleElement) {
                document.body.removeChild(dragHandleElement);
                dragHandleElement = null;
              }
            },
          };
        },
      },
    ];
  },
});

export default CustomDragHandle; 
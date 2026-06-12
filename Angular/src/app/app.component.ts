import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxTreeListComponent, DxTreeListModule } from 'devextreme-angular/ui/tree-list';
import dxTreeList from 'devextreme/ui/tree_list';
import { Node } from 'devextreme/ui/tree_list';
import { Employee, employees } from './data';

type EmployeeNode = Node<Employee, number>;

@Component({
    selector: 'app-root',
    imports: [DxTreeListModule, DxButtonModule],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(DxTreeListComponent, { static: false })
  treeList!: DxTreeListComponent;

  employees = employees;

  expandedRowKeys = [1, 2, 10];

  selectedText = '';

  onButtonClick(): void {
    const treeList = this.treeList.instance as dxTreeList<Employee, number>;
    const selectedRowKeys = treeList.getSelectedRowKeys();
    const names = this.getAllSelectedNodes(treeList, selectedRowKeys)
      .map((node) => node.data?.Full_Name)
      .join(', ');

    this.selectedText = `Selected row keys: ${names}`;
  }

  private getAllSelectedNodes(
    treeListInstance: dxTreeList<Employee, number>,
    parentKeys: number[],
    skipParent?: boolean,
  ): EmployeeNode[] {
    let result: EmployeeNode[] = [];

    parentKeys.forEach((key) => {
      const insertIndex = result.length;
      const node = treeListInstance.getNodeByKey(key);
      let parentNode: EmployeeNode | undefined = node.parent;
      const childKeys = (node.children ?? []).map((child) => child.key);

      while (parentNode && parentNode.level >= 0 && !skipParent) {
        const currentParent = parentNode;
        const isCollected = result.some((nodeItem) => nodeItem.key === currentParent.key);
        if (!isCollected && treeListInstance.isRowSelected(currentParent.key)) {
          result.splice(insertIndex, 0, currentParent);
          parentNode = currentParent.parent;
        } else {
          break;
        }
      }

      result.push(node);
      result = result.concat(this.getAllSelectedNodes(treeListInstance, childKeys, true));
    });

    return result;
  }
}

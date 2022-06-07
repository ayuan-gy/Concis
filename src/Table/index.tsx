import React, { FC, useEffect, useCallback, useState } from 'react';
import { PlusOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { tableProps } from './interface';
import CheckBox from '../CheckBox';
import './style/index.module.less';

const Table: FC<tableProps> = (props) => {
  const {
    titleParams,
    tableData,
    align,
    expandedRowRender,
    radio,
    checked,
    radioSelectCallback,
    checkedSelectCallback,
    avableSort,
  } = props;

  const [doColumnData, setDoColumnData] = useState(titleParams); //表头数据
  const [doTableData, setDoTableData] = useState(tableData); //表数据
  const [radioRow, setRadioRow] = useState({}); //单选选中行
  const [checkedRow, setCheckedRow] = useState<Array<object>>([]); //单选选中行

  useEffect(() => {
    const newDoTableData = [...doTableData];
    if (expandedRowRender) {
      //展开行处理
      newDoTableData.forEach((item: any) => {
        item.openLine = '';
      });
    }
    if (avableSort) {
      //排序处理
      setDoColumnData((old) => {
        old.forEach((item: any) => {
          if (Array.isArray(item.sorter)) {
            item.sorter = item.sorter.map((s: any) => {
              return {
                fn: s,
                sorted: false,
              };
            });
          }
        });
        return [...old];
      });
    }
    setDoTableData(newDoTableData);
  }, []);
  const tableStyle = useCallback(
    (thData: any) => {
      //表头样式
      const styleResult = {
        width: 'auto',
        textAlign: 'left',
      };
      if (thData?.width) {
        styleResult.width = `${thData.width}px`;
      }
      if (align) {
        styleResult.textAlign = align;
      }
      return styleResult;
    },
    [titleParams],
  );
  const openRow = (row: object, key: number): void => {
    //展开列表
    if (expandedRowRender) {
      expandedRowRender(row);
      const newTableData = [...doTableData];
      if (newTableData[key].openLine) {
        newTableData[key].openLine = '';
      } else {
        if (expandedRowRender(row)) {
        }
        newTableData[key]['openLine'] = expandedRowRender(row);
      }
      setDoTableData(newTableData);
    }
  };
  const radioSelectRow = (row: object): void => {
    //单选行
    setRadioRow(row);
    radioSelectCallback && radioSelectCallback(row);
  };
  const checkedSelectRow = (checked: boolean, row: object): void => {
    //多选单行
    setCheckedRow((old: any) => {
      if (checked) {
        old.push(row);
      } else {
        const delIndex = old.findIndex((s: object) => s == row);
        old.splice(delIndex, 1);
      }
      checkedSelectCallback && checkedSelectCallback(old);
      return [...old];
    });
  };
  const checkAll = (checked: boolean): void => {
    // 全部选中
    setCheckedRow((old: Array<object>) => {
      if (checked) {
        //全选
        old = doTableData;
      } else {
        //全不选
        old = [];
      }
      checkedSelectCallback && checkedSelectCallback(old);
      return [...old];
    });
  };
  const sortColumn = (index: number, row: any, sortType: number) => {
    //表格单列排序  -> 2为升序 3为降序
    const sortKey = row.dataIndex;
    const newTableData = [...doTableData];
    if (Array.isArray(row.sorter) && typeof row.sorter[0] == 'object') {
      //自定义排序
      newTableData.sort(row.sorter[sortType - 2].fn);
      setDoTableData(newTableData);
      setDoColumnData((old: Array<any>): Array<any> => {
        if (sortType == 2) {
          old[index].sorter[0].sorted = true;
          old[index].sorter[1].sorted = false;
        } else {
          old[index].sorter[0].sorted = false;
          old[index].sorter[1].sorted = true;
        }

        return [...old];
      });
    } else {
      //默认排序
      newTableData.sort((a, b) => {
        return sortType == 2 ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
      });
      setDoTableData(newTableData);
      setDoColumnData((old) => {
        old[index].sorter = sortType;
        return [...old];
      });
    }
  };

  const renderContentTd = (rowData: object) => {
    //渲染正文行
    return Object.entries(rowData).map((value: any, key) => {
      if (value[0] !== 'openLine') {
        return (
          <td key={key} style={{ textAlign: align ? (align as any) : 'left' }}>
            {value[1]}
          </td>
        );
      }
    });
  };
  const sortIconStyle = useCallback(
    (thRow: any, iconType: number) => {
      //表头排序按钮样式
      if (typeof thRow.sorter == 'number' || typeof thRow.sorter == 'boolean') {
        //默认排序
        if (iconType == 0) {
          //升序箭头
          return {
            color: thRow.sorter == 2 ? '#1890ff' : '#a9adb2',
          };
        } else {
          //降序箭头
          return {
            color: thRow.sorter == 3 ? '#1890ff' : '#a9adb2',
          };
        }
      } else {
        //自定义排序
        if (iconType == 0) {
          //升序箭头
          return {
            color: thRow.sorter[0].sorted ? '#1890ff' : '#a9adb2',
          };
        } else {
          //降序箭头
          return {
            color: thRow.sorter[1].sorted ? '#1890ff' : '#a9adb2',
          };
        }
      }
    },
    [titleParams, doColumnData],
  );
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            {(expandedRowRender || radio) && <th style={{ textAlign: (align as any) || 'left' }} />}
            {checked && (
              <th style={{ textAlign: (align as any) || 'left' }}>
                <CheckBox
                  checked={checkedRow.length == doTableData.length}
                  checkCallback={(checked: boolean) => checkAll(checked)}
                />
              </th>
            )}
            {doColumnData.map((t, key) => {
              return (
                <th key={key} style={tableStyle(t) as any} className="tableHead">
                  <span>{t.title}</span>
                  {t.sorter && avableSort && (
                    <div className="sort-icon">
                      <CaretUpOutlined
                        onClick={() => sortColumn(key, t, 2)}
                        style={sortIconStyle(t, 0)}
                      />
                      <CaretDownOutlined
                        onClick={() => sortColumn(key, t, 3)}
                        style={sortIconStyle(t, 1)}
                      />
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {doTableData?.map((t, key) => {
            return (
              <>
                <tr key={key}>
                  {
                    //展开行
                    expandedRowRender && (
                      <td
                        style={{ textAlign: (align as any) || 'left', cursor: 'pointer' }}
                        onClick={() => openRow(t, key)}
                      >
                        <PlusOutlined />
                      </td>
                    )
                  }
                  {
                    //单选
                    radio && (
                      <td style={{ textAlign: (align as any) || 'left', cursor: 'pointer' }}>
                        <input
                          className="radioBox"
                          type="radio"
                          checked={radioRow == t ? true : false}
                          onClick={() => radioSelectRow(t)}
                        ></input>
                      </td>
                    )
                  }
                  {
                    //多选
                    checked && (
                      <td style={{ textAlign: (align as any) || 'left', cursor: 'pointer' }}>
                        <CheckBox
                          checked={checkedRow.indexOf(t) == -1 ? false : true}
                          checkCallback={(check: boolean) => checkedSelectRow(check, t)}
                        >
                          {checkedRow.indexOf(t) == -1}
                        </CheckBox>
                      </td>
                    )
                  }
                  {renderContentTd(t)}
                </tr>
                {t.openLine && (
                  <tr>
                    <td
                      style={{ textAlign: (align as any) || 'left' }}
                      colSpan={Object.keys(doTableData[0]).length + 1}
                    >
                      {t.openLine}
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
// Table.Group = Group;

export default Table;
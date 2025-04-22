import { useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './App.css'

// 使用WidthProvider包装Responsive组件，自动计算宽度
const ResponsiveGridLayout = WidthProvider(Responsive)

// 定义可用的表单组件
const componentList = [
  { id: 'input', title: '输入框', icon: '📝' },
  { id: 'select', title: '下拉选择', icon: '🔽' },
  { id: 'checkbox', title: '复选框', icon: '☑️' },
  { id: 'radio', title: '单选框', icon: '⚪' },
  { id: 'textarea', title: '文本域', icon: '📄' },
  { id: 'date', title: '日期选择', icon: '📅' }
]

// 渲染表单组件
const renderFormComponent = (component) => {
  switch (component.id) {
    case 'input':
      return (
        <div className="form-item">
          <label>输入框</label>
          <input type="text" placeholder="请输入" />
        </div>
      )
    case 'select':
      return (
        <div className="form-item">
          <label>下拉选择</label>
          <select>
            <option>选项1</option>
            <option>选项2</option>
            <option>选项3</option>
          </select>
        </div>
      )
    case 'checkbox':
      return (
        <div className="form-item">
          <label>复选框</label>
          <div>
            <input type="checkbox" id="cb1" /><label htmlFor="cb1">选项1</label>
            <input type="checkbox" id="cb2" /><label htmlFor="cb2">选项2</label>
          </div>
        </div>
      )
    case 'radio':
      return (
        <div className="form-item">
          <label>单选框</label>
          <div>
            <input type="radio" name="radio" id="r1" /><label htmlFor="r1">选项1</label>
            <input type="radio" name="radio" id="r2" /><label htmlFor="r2">选项2</label>
          </div>
        </div>
      )
    case 'textarea':
      return (
        <div className="form-item">
          <label>文本域</label>
          <textarea placeholder="请输入多行文本"></textarea>
        </div>
      )
    case 'date':
      return (
        <div className="form-item">
          <label>日期选择</label>
          <input type="date" />
        </div>
      )
    default:
      return <div>未知组件</div>
  }
}

function App() {
  // 存储当前表单中的组件
  const [formItems, setFormItems] = useState([])
  
  // 处理从组件列表拖拽到设计区
  const onDragStart = (e, component) => {
    e.dataTransfer.setData('component', JSON.stringify(component))
  }
  
  // 处理拖拽放置
  const onDrop = (e) => {
    e.preventDefault()
    const componentData = JSON.parse(e.dataTransfer.getData('component'))
    
    // 计算当前最大的 y 坐标
    const maxY = formItems.reduce((max, item) => {
      return Math.max(max, item.y)
    }, -1)
    
    // 创建新的表单项
    const newItem = {
      i: `item-${Date.now()}`, // 唯一ID
      x: 0,
      y: maxY + 1, // 放在最后一个组件的下方
      w: 6,
      h: 2,
      component: componentData
    }
    
    setFormItems([...formItems, newItem])
  }
  
  // 允许放置
  const onDragOver = (e) => {
    e.preventDefault()
  }
  
  // 布局变化时更新状态
  const onLayoutChange = (layout) => {
    const updatedItems = formItems.map(item => {
      const layoutItem = layout.find(l => l.i === item.i)
      return layoutItem ? { ...item, ...layoutItem } : item
    })
    setFormItems(updatedItems)
  }
  
  // 删除组件
  const removeItem = (itemId) => {
    setFormItems(formItems.filter(item => item.i !== itemId))
  }

  return (
    <div className="form-designer">     
      <div className="designer-container">
        {/* 左侧组件列表 */}
        <div className="component-list">
          <h3>组件列表</h3>
          {componentList.map(component => (
            <div 
              key={component.id}
              className="component-item"
              draggable
              onDragStart={(e) => onDragStart(e, component)}
            >
              <span className="component-icon">{component.icon}</span>
              <span>{component.title}</span>
            </div>
          ))}
        </div>
        
        {/* 右侧设计区域 */}
        <div 
          className="design-area"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <h3>设计区域</h3>
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: formItems }}
            // verticalCompact={false}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            onLayoutChange={onLayoutChange}
          >
            {formItems.map(item => (
              <div key={item.i} className="grid-item">
                <div className="item-header">
                  <span>{item.component.title}</span>
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.i)}
                  >
                    ×
                  </button>
                </div>
                <div className="item-content">
                  {renderFormComponent(item.component)}
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  )
}

export default App

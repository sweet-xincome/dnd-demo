import { useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './App.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const componentList = [
  { id: 'input', title: '输入框', icon: '📝' },
  { id: 'select', title: '下拉选择', icon: '🔽' },
  { id: 'checkbox', title: '复选框', icon: '☑️' },
  { id: 'radio', title: '单选框', icon: '⚪' },
  { id: 'textarea', title: '文本域', icon: '📄' },
  { id: 'date', title: '日期选择', icon: '📅' }
]

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
  const [formItems, setFormItems] = useState([])
  
  const onDragStart = (e, component) => {
    e.dataTransfer.setData('component', JSON.stringify(component))
  }
  
  const onDrop = (e) => {
    e.preventDefault()
    const componentData = JSON.parse(e.dataTransfer.getData('component'))
    
    const newItem = {
      i: `item-${Date.now()}`, 
      x: 0,
      y: Infinity, 
      w: 6,
      h: 2,
      component: componentData
    }
    
    setFormItems([...formItems, newItem])
  }
  
  const onDragOver = (e) => {
    e.preventDefault()
  }
  
  const onLayoutChange = (layout) => {
    const updatedItems = formItems.map(item => {
      const layoutItem = layout.find(l => l.i === item.i)
      return layoutItem ? { ...item, ...layoutItem } : item
    })
    setFormItems(updatedItems)
  }
  
  // // 删除组件
  // const removeItem = (itemId) => {
  //   setFormItems(formItems.filter(item => item.i !== itemId))
  // }

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
            verticalCompact={false}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            onLayoutChange={onLayoutChange}
            autoSize={true}
          >
            {formItems.map(item => (
              <div key={item.i} className="grid-item">
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

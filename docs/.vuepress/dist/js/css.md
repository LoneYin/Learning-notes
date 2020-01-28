
# BFC(块级格式化上下文)

- **BFC的渲染规则**
  - BFC内部的子元素，在垂直方向，外边距（两个相邻的元素）会发生重叠
  - BFC是一个独立的布局环境，其内的元素布局不受外界影响，同样不会作用于外界
  - BFC区域不与旁边的浮动区域重叠（两个float不会相互重叠）
  - BFC容器可以包含浮动子元素，在新BFC中浮动元素又回归到了页面的常规流之中，浮动元素的高度参与BFC容器高度的计算
- **如何生成BFC**
  - overflow属性不为`visible`，即`overflow: hidden`或`auto`
  - float属性不为none，只要设置了浮动，元素就会生成BFC
  - position属性不为`static`或`relative`，可以是`absolute`或`fixed`
  - display为`inline-block`, `table-cell`, `table-caption`, `flex`, `inline-flex`
- **BFC的应用**
  - 避免外边距重叠，处于两个BFC中的元素不会发生外边距重叠
  - 清除BFC内部的浮动
  - 避免元素被浮动元素覆盖
  - 多列布局
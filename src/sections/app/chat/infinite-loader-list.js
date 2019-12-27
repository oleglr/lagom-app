import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

export const InfiniteLoaderList = ({
  items,
  is_loading_more_items,
  loadMore,
  has_more_items_to_load,
  item_size,
  RenderComponent,
  RowLoader,
  height: initial_height,
}) => {
  const RowRenderer = ({ index, style }) => {
    const is_loading = index === items.length

    if (is_loading) {
      return (
        <div style={style}>
          {/* <RowLoader /> */}
          loading...
        </div>
      )
    }

    return <RenderComponent data={items[index]} num={index} style={style} />
  }

  const item_count = has_more_items_to_load ? items.length + 1 : items.length

  return (
    <InfiniteLoader
      isItemLoaded={index => index < items.length}
      itemCount={item_count}
      loadMoreItems={loadMore}
    >
      {({ onItemsRendered, ref }) => (
        <AutoSizer disableHeight>
          {({ height, width }) => (
            <List
              height={height || 400}
              width={width}
              itemCount={item_count}
              itemSize={item_size || 58}
              onItemsRendered={onItemsRendered}
              ref={ref}
            >
              {RowRenderer}
            </List>
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  )
}

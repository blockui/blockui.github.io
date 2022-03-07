import React from 'react'
import cls from 'classnames'
import PropTypes from "prop-types";

const WeLoadMore = ({className, loading, tips, onClick, style}) => {
  const classNames = cls(
    "weui-loadmore-wrap",
    className
  )
  return (
    <div className={classNames} style={style}>
      <div className={"weui-loadmore"}>
        {
          (loading !== undefined && loading) &&
          <span className="weui-primary-loading">
                        <i className="weui-primary-loading__dot"/>
                    </span>
        }
        {
          !loading &&
          <div className="weui-loadmore__tips">
            <div className="weui-loadmore__line"/>
            {
              tips ?
                <span onClick={onClick}>
                                    {tips}
                                </span> :
                <div className={"weui-loadmore__tips-dot"}/>
            }
            <div className="weui-loadmore__line"/>
          </div>
        }
      </div>

    </div>
  )
}

WeLoadMore.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  tips: PropTypes.string,
  style: PropTypes.object
}

export default WeLoadMore;

import React, {Component} from 'react'
import PropTypes from "prop-types"
import {setStoreState} from "./core/App";
import BDApp from "shared/BD/BDApp";
import {checkSupportTouch} from "shared/functions/common";

class GesturesUnlockView extends Component {
  constructor(props) {
    super(props);
    this.canvasHeight = props.height || 300
    this.canvasWidth = props.width || 300
    this.dom = React.createRef()

    this.radius = 20; // 圆的半径
    this.arcColor = '#fa9d3b'; // 圆的颜色
    this.arcDidColor = '#10aeff'; // 手指触摸圆的颜色
    this.arcLineWidth = 2; // 圆的粗细
    this.touchColor = '#10aeff'; // 手指触摸的线条颜色
    this.touchLineWidth = 5; // 手指触摸的线条粗细
    this.pwdResult = ''; // 密码结果
    this.supportTouch = checkSupportTouch()

    // 以下是私有变量
    this._tempPoint = {}; // 临时点
    this._tempImageData = ''; // 临时绘制数据
    this._ninePointArcImageData = ''; // 9个初始点位圆的绘制数据
    this.pointArr = []//9个点的全部坐标
    this._leftSpace = 0;
    this._topSpace = 0;
    this._guaWidth = 0;
    this._guaHeight = 0;
    this._ctx = null;
  }

  componentWillUnmount() {
    this.removeEvt()
  }

  removeEvt() {
    const canvas = this.dom.current
    this.started = false
    if (canvas) {
      canvas.removeEventListener(this.supportTouch ? 'touchstart' : 'mousedown', this.onTouchStart.bind(this));
      canvas.removeEventListener(this.supportTouch ? 'touchend' : "mouseup", this.onTouchEnd.bind(this));
      canvas.removeEventListener(this.supportTouch ? 'touchmove' : "mousemove", this.onTouchMove.bind(this));
    }
  }

  componentDidMount() {
    this.init()
  }

  ninePoint() {
    const canvas = this.dom.current
    // 获取画布宽高
    const _guaWidth = canvas.width;
    const _guaHeight = canvas.height;
    // 获取画布中9个坐标点
    // 9个点的横坐标分别是
    const point_1_X = (_guaWidth / 3) / 2;
    const point_2_X = (_guaWidth / 3) + point_1_X;
    const point_3_X = (_guaWidth / 3) + point_2_X;
    // 9个点的纵坐标分别是
    const point_1_Y = (_guaHeight / 3) / 2;
    const point_2_Y = (_guaHeight / 3) + point_1_Y;
    const point_3_Y = (_guaHeight / 3) + point_2_Y;

    // 9个点的全部坐标
    return [
      {x: point_1_X, y: point_1_Y, pwd: '1'},
      {x: point_2_X, y: point_1_Y, pwd: '2'},
      {x: point_3_X, y: point_1_Y, pwd: '3'},
      {x: point_1_X, y: point_2_Y, pwd: '4'},
      {x: point_2_X, y: point_2_Y, pwd: '5'},
      {x: point_3_X, y: point_2_Y, pwd: '6'},
      {x: point_1_X, y: point_3_Y, pwd: '7'},
      {x: point_2_X, y: point_3_Y, pwd: '8'},
      {x: point_3_X, y: point_3_Y, pwd: '9'}
    ];
  }

  onTouchStart(e) {
    // 取消页面的触摸移动默认动作
    e.preventDefault();
    const {clientX, clientY} = this.supportTouch ? e.targetTouches[0] : e
    const touchX = clientX - this._leftSpace;
    const touchY = clientY - this._topSpace;
    const {pointArr} = this;
    // console.log(clientX,screenX,clientY,screenY)
    for (let key in this.pointArr) {
      if (
        touchX > (pointArr[key].x - this.radius) &&
        touchX < (pointArr[key].x + this.radius) &&
        touchY > (pointArr[key].y - this.radius) &&
        touchY < (pointArr[key].y + this.radius)
      ) {
        this.started = true
        // 如果在点位之内，那么绘制一个覆盖色的圆，再监听手指移动事件
        this.pointArc(this._ctx, pointArr[key].x, pointArr[key].y, this.radius, this.arcDidColor, this.arcLineWidth);
        // 把密码值加入密码结果
        this.pwdResult = pointArr[key].pwd;
        this._tempPoint = {x: pointArr[key].x, y: pointArr[key].y};
        this.reNewLine(this._ctx);
      }
    }

  }

  onTouchMove(e) {
    e.preventDefault();
    if (!this.started) return;
    const {pointArr, _leftSpace, _topSpace, _guaWidth, _guaHeight} = this

    // 取消页面的触摸移动默认动作
    // 触点位置坐标减去偏移量
    const {clientX, clientY} = this.supportTouch ? e.targetTouches[0] : e
    const touchX = clientX - _leftSpace;
    const touchY = clientY - _topSpace;
    // console.log("re",touchY)
    // 清空画布
    this._ctx.clearRect(0, 0, _guaWidth, _guaHeight);
    // 因为被擦除，重新绘制9个点位圆和覆盖圆
    // 把存住的9个白色点位圆放到画布上
    this._ctx.putImageData(this._ninePointArcImageData, 0, 0);
    // 绘制刚被选中的圆
    this.pointArc(this._ctx, this._tempPoint.x, this._tempPoint.y, this.radius, this.arcDidColor, this.arcLineWidth);
    // 如果临时绘制数据存在值则把他放到画布上
    if (this._tempImageData) {
      this._ctx.putImageData(this._tempImageData, 0, 0);
    }

    for (let key in pointArr) {
      // 如果是点位圆的坐标
      if (touchX > (pointArr[key].x - this.radius) && touchX < (pointArr[key].x + this.radius) && touchY > (pointArr[key].y - this.radius) && touchY < (pointArr[key].y + this.radius)) {
        // 如果选中的是当前点则跳过
        if (this._tempPoint.x === pointArr[key].x && this._tempPoint.y === pointArr[key].y) {

        }
        // 如果选中的是已经选过得点，跳过
        else if (this.pwdResult.indexOf(pointArr[key].pwd) >= 0) {

        }
        // 绘制区域
        else {
          // 清除画布区域 (防止第一次绘制时保存绘制数据时出现多余的线条)
          this._ctx.clearRect(0, 0, _guaWidth, _guaHeight);
          // 把存住的9个白色点位圆放到画布上 (因为上一步清空画布了)
          this._ctx.putImageData(this._ninePointArcImageData, 0, 0);
          // 绘制上一个圆 （把刚刚选中的圆绘制一遍）
          this.pointArc(this._ctx, this._tempPoint.x, this._tempPoint.y, this.radius, this.arcDidColor, this.arcLineWidth);
          // 如果临时绘制数据存在值则把他放到画布上
          if (this._tempImageData) {
            this._ctx.putImageData(this._tempImageData, 0, 0);
          }
          // 绘制上一个点位圆和这个点位圆之间的连线
          this.drawLine(this._ctx, this._tempPoint.x, this._tempPoint.y, pointArr[key].x, pointArr[key].y, this.touchColor, this.touchLineWidth);
          // 再绘制第二个圆
          this.pointArc(this._ctx, pointArr[key].x, pointArr[key].y, this.radius, this.arcDidColor, this.arcLineWidth);
          // 把这张图的效果保存住
          this._tempImageData = this._ctx.getImageData(0, 0, _guaWidth, _guaHeight);
          // 设置临时点
          this._tempPoint = {x: pointArr[key].x, y: pointArr[key].y};
          this.pwdResult += pointArr[key].pwd;
          //console.log(456);
        }
      }
      // 如果不是点位圆的坐标,则线段跟着手指移动
      else {
        this.drawLine(this._ctx, this._tempPoint.x, this._tempPoint.y, touchX, touchY, this.touchColor, this.touchLineWidth);
      }
    }
  }

  onTouchEnd() {
    if (this.pwdResult) {
      const {onResult} = this.props
      // _debug("pwdResult", this.pwdResult)
      onResult && onResult(this.pwdResult)
      this.started = false
      this.removeEvt()
      this.init();
    }
  }

  /**
   * 画圆方法
   * 参数说明：
   * ctx : 画布引擎
   * x :    圆心坐标X轴
   * y : 圆心坐标Y轴
   * radius : 半径
   * color : 颜色
   * lineWidth : 线宽（如果存在该参数，则画空心圆，否则画实心圆）
   */
  drawArc(ctx, x, y, radius, color, lineWidth) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, (Math.PI) * 2, false);
    if (!lineWidth) {
      ctx.fillStyle = color;
      ctx.fill();
    } else {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  }

  /**
   * 绘制完整的点位圆 (空心加实心圆)
   * 参数说明：
   * ctx : 画布引擎
   * x :    圆心坐标X轴
   * y : 圆心坐标Y轴
   * radius : 半径
   * color : 颜色
   * lineWidth : 外圆线宽
   */
  pointArc(ctx, x, y, radius, color, lineWidth) {
    this.drawArc(ctx, x, y, radius, color, lineWidth);
    this.drawArc(ctx, x, y, radius / 3, color);
  }

  /**
   * 绘制9个点位圆
   * 参数说明：
   * ctx : 画布引擎
   */
  ninePointArc(ctx) {
    // 9个点的全部坐标
    const pointArr = this.ninePoint();
    this.pointArr = pointArr
    // 对九个点画实心圆和空心圆
    for (let key in pointArr) {
      // 画大空心圆
      this.pointArc(ctx, pointArr[key].x, pointArr[key].y, this.radius, this.arcColor, this.arcLineWidth);
    }
  }

  /**
   * 画线方法
   * 参数说明：
   * ctx:画布引擎
   * x1: 起始坐标x
   * x2: 起始坐标y
   * x2: 终点坐标x
   * y2: 重点坐标y
   * color:线条颜色
   * lineWidth: 线条宽度
   */
  drawLine(ctx, x1, y1, x2, y2, color, lineWidth) {
    ctx.beginPath(); // 开始路径绘制
    ctx.moveTo(x1, y1); // 设置路径起点，坐标为(20,20)
    ctx.lineTo(x2, y2); // 绘制一条到(200,20)的直线
    ctx.lineWidth = lineWidth; // 设置线宽
    ctx.strokeStyle = color; // 设置线的颜色
    ctx.stroke();
  }

  /**
   * 监听手指移动事件如果覆盖到点位坐标，则把起始点重新放在覆盖到的点位坐标上
   * 参数说明：
   * ctx : 画布引擎
   */
  reNewLine() {
    const canvas = this.dom.current
    canvas.addEventListener(this.supportTouch ? 'touchmove' : "mousemove", this.onTouchMove.bind(this), null);
  }

  init() {
    const canvas = this.dom.current
    if (!canvas) return;
    this._guaWidth = canvas.width;
    this._guaHeight = canvas.height;
    // 获取画布距离页面顶端和左端的距离
    this._leftSpace = canvas.getBoundingClientRect().left;
    this._topSpace = canvas.getBoundingClientRect().top + window.scrollY;
    if (canvas.getContext) {
      // 获取2D引擎
      this._ctx = canvas.getContext('2d');
      // 初始化全部变量
      this.pwdResult = '';
      this._tempPoint = {};
      this._tempImageData = '';
      this._ninePointArcImageData = '';
      this._ctx.clearRect(0, 0, this._guaWidth, this._guaHeight);
      // 绘制9个点位圆
      this.ninePointArc(this._ctx);
      // 把这个初始的9个点位圆存入9个点位圆数据
      this._ninePointArcImageData = this._ctx.getImageData(0, 0, this._guaWidth, this._guaHeight);
      // 判断触摸点是否在点位之内
      canvas.addEventListener(this.supportTouch ? 'touchstart' : 'mousedown', this.onTouchStart.bind(this), null);
      // 监听手指离开事件获取结果
      canvas.addEventListener(this.supportTouch ? 'touchend' : "mouseup", this.onTouchEnd.bind(this), null);
    }
  }

  render() {
    const {style, title, hideLogout} = this.props
    return (
      <div className={"gestures-unlock-view"} style={style}>
        {
          title &&
          <div className="title">{title}</div>
        }
        <canvas className={"gesturesUnlock"} ref={this.dom} width={this.canvasWidth}
                height={this.canvasHeight}/>

        {
          !hideLogout &&
          <span onClick={() => {
            setStoreState("global", {
              passwordInputHandler: false
            })
            BDApp.logout()
          }} className={"a btn_active logout-block"}>退出登录</span>
        }

      </div>
    )
  }
}

GesturesUnlockView.propTypes = {
  onResult: PropTypes.func,
  hideLogout: PropTypes.bool,
  title: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  style: PropTypes.object,
}

export default GesturesUnlockView;

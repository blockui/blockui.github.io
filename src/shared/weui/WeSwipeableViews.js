import React from 'react'
import cls from 'classnames'
import MobileStepper from '@material-ui/core/MobileStepper';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = {
  root: {
    width: "100%",
    flexGrow: 1,
    marginBottom: 4
  },
  step: {
    display: "flex",
    justifyContent: "center"
  },
  img: {
    height: 160,
    display: 'block',
    overflow: 'hidden',
    width: '100%',
  },
};


const View = ({title, className, items, imgStyle, hideSteppers, onClick, ...props}) => {
  const classNames = cls(
    className
  )

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = items.length;
  const handleItemChange = (item) => {
    setActiveStep(item);
  };
  return (
    <div className={classNames} style={styles.root} {...props}>
      <AutoPlaySwipeableViews
        index={activeStep}
        onChangeIndex={handleItemChange}
        enableMouseEvents>
        {items.map((item, index) => (
          <div key={item.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <img onClick={() => {
                onClick && onClick(item)
              }}
                   draggable={false}
                   style={{...styles.img, ...imgStyle}}
                   src={item.imgPath}
                   alt={item.label}/>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      {
        !hideSteppers && <MobileStepper
          style={styles.step}
          steps={maxSteps}
          position="static"
          variant="dots"
          activeStep={activeStep}
        />
      }
    </div>
  );
}
export default View;

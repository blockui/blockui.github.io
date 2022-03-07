import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
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
}));

function SwipeableTextMobileStepper({steps, hideSteppers}) {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  return (
    <div className={classes.root}>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {steps.map((step, index) => (
          <div key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <img onClick={() => {
              }} draggable={false} className={classes.img} src={step.imgPath} alt={step.label}/>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      {
        !hideSteppers && <MobileStepper
          className={classes.step}
          steps={maxSteps}
          position="static"
          variant="dots"
          activeStep={activeStep}
        />
      }

    </div>
  );
}


export default SwipeableTextMobileStepper;

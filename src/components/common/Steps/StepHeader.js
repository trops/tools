import React from "react";

class StepHeader extends React.Component {

  renderSteps = () => {
    const { steps, step } = this.props;
    const numSteps = Object.keys(steps).length;
    return Object.keys(steps).map(stepNumber => {
      const currentStep = parseInt(step, 10);
      const compareStep = parseInt(stepNumber, 10);
      //console.log(currentStep, compareStep);
        if (compareStep === currentStep) return this.renderCurrentStep(compareStep, steps[compareStep].name, numSteps);
        if (compareStep < currentStep) return this.renderCompleteStep(compareStep, steps[compareStep].name, numSteps);
        if (compareStep > currentStep) return this.renderIncompleteStep(compareStep, steps[compareStep].name, numSteps);
        return null;
    });
  }

  renderCompleteStep = (stepNumber, stepName, numberSteps) => {
    return (
      <li className="relative md:flex-1 md:flex" key={`step_${stepNumber}`}>
        <div className="group flex items-center w-full">
          <span className="px-4 py-4 flex items-center text-xl font-medium">
            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-600 rounded-full">
                <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>  
            </span>
            <span className="ml-4 text-sm font-medium text-gray-100">{stepName}</span>
          </span>
        </div>
        {stepNumber < numberSteps && this.renderArrowSeparator()}
      </li>
    )
  }

  renderIncompleteStep = (stepNumber, stepName, numberSteps) => {
    return (
      <li className="relative md:flex-1 md:flex" key={`step_${stepNumber}`}>
        <div className="group flex items-center">
          <span className="px-6 py-4 flex items-center text-sm font-medium">
            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-500 rounded-full group-hover:border-gray-400">
              <span className="text-gray-500">{stepNumber}</span>
            </span>
            <span className="ml-4 text-sm font-medium text-gray-500">{stepName}</span>
            {stepNumber < numberSteps && this.renderArrowSeparator()}
          </span>
        </div>
      </li>
    );
  }

  renderArrowSeparator = () => {
    return (
      <div className="hidden md:block absolute top-0 right-0 h-full w-5" aria-hidden="true">
        <svg className="h-full w-full text-gray-700" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
          <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  renderCurrentStep = (stepNumber, stepName, numberSteps) => {
    return (
      <li className="relative md:flex-1 md:flex" key={`step_${stepNumber}`}>
        <div className="px-6 py-4 flex items-center text-sm font-medium" aria-current="step">
          <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-indigo-600 bg-indigo-600 rounded-full">
            <span className="text-white">{stepNumber}</span>
          </span>
          <span className="ml-4 text-sm font-medium text-gray-100">{stepName}</span>
          {stepNumber < numberSteps && this.renderArrowSeparator()}
        </div>
      </li>
    )
  }

  render() {
    return (      
      <div className="flex w-full bg-gray-800 rounded-md">
        <ol className="border border-gray-700 rounded-md divide-y divide-gray-700 md:flex md:divide-y-0 w-full text-gray-100">
          {this.renderSteps()}
        </ol>
      </div>
    )
  }
}

StepHeader.defaultProps = {
  step: 1,
  steps: {},
  onClick(){}
}

export default StepHeader;
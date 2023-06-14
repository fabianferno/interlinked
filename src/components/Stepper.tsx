import React from 'react'
import {
    Box,
    Step,
    StepDescription,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    StepIcon
} from '@chakra-ui/react'

import { useSteps } from '@chakra-ui/stepper'

function CustomStepper() {

    const steps = [
        { title: 'Send tokens', description: 'Securely stored in Escrow contract on any chain' },
        { title: 'Claim tokens', description: 'Seamlessly claim assets from the Escrow on any chain' },
        { title: 'Revert Assets', description: 'Revert allocated funds back to you wallet on the any chain' },
    ]
    const { activeStep } = useSteps({
        index: 1,
        count: steps.length,
    })

    return (
        <Stepper colorScheme='green' textAlign={"left"} index={activeStep}>
            {steps.map((step, index) => (
                <Step key={index}>
                    <StepIndicator >
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>

                    <Box flexShrink='0' width={"200px"}>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription >{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                </Step>
            ))
            }
        </Stepper >
    )
}

export default CustomStepper;

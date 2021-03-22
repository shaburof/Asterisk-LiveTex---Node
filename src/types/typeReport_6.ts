export type typeReport_6 = {
    $abandonedCalls_4: number,
    $averageNumberOfCallPerHour_20: number,
    $averagePostCallTime_13: number,
    $averageResponseRate_6: number,
    $averageServiceTime_10: number,
    $averageTalkTime_11: number,
    $averageTimeToAbandon_9: number,
    $datetimeOfCallsPerBusyHour_nn1: {
        date: string,
        finish: string,
        start: string
    },
    $maximumResponseDelay_7: number,
    $numberOfCallsPerBusyHour_21: number,
    $numberOfCustomersWaitingForTheOperatorResponse_nn2: number,
    $percentageOfImmediateResponse_22: number,
    $servedCalls_2: number,
    $serviceLevel_5: number,
    $queueName: string
}

export type bestTimeType = { $numberOfCallsPerBusyHour_21: number, $datetimeOfCallsPerBusyHour_nn1: { date: string, start: string, finish: string } };
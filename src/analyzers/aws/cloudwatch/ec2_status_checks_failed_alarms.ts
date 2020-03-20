import {
    CheckAnalysisType, ICheckAnalysisResult, IDictionary,
    IResourceAnalysisResult, SeverityStatus,
} from "../../../types";
import { ResourceUtil } from "../../../utils";
import { BaseAnalyzer } from "../../base";

export class EC2InstanceSystemChecksAlarmsAnalyzer extends BaseAnalyzer {

    public analyze(params: any, fullReport?: any): any {
        const allAlarms: any[] = params.alarms;
        if (!allAlarms || !fullReport["aws.ec2"] || !fullReport["aws.ec2"].instances) {
            return undefined;
        }
        const allInstances: any[] = fullReport["aws.ec2"].instances;

        const ec2_instance_system_checks_alarms: ICheckAnalysisResult = {
            type: CheckAnalysisType.OperationalExcellence,
        };
        ec2_instance_system_checks_alarms.what = "Are alarms are enabled for EC2 instance System checks?";
        ec2_instance_system_checks_alarms.why = `It is important to set alarms for EC2 systems checks as
        otherwise suddenly your applications might be down.`;
        ec2_instance_system_checks_alarms.recommendation = `Recommended to set alarm for EC2
        system checks to take appropriative action.`;
        const allRegionsAnalysis: IDictionary<IResourceAnalysisResult[]> = {};
        for (const region in allInstances) {
            const regionInstances = allInstances[region];
            const regionAlarms = allAlarms[region] || [];
            const alarmsMapByInstance = this.mapAlarmsByInstance(regionAlarms);
            allRegionsAnalysis[region] = [];
            for (const instance of regionInstances) {
                if (instance.State.Name !== "running") {
                    continue;
                }

                const alarmAnalysis: IResourceAnalysisResult = {};
                const instanceAlarms = alarmsMapByInstance[instance.InstanceId];
                alarmAnalysis.resource = { instance, alarms: instanceAlarms };
                alarmAnalysis.resourceSummary = {
                    name: "Instance",
                    value: `${ResourceUtil.getNameByTags(instance)} | ${instance.InstanceId}`,
                };

                if (this.isSystemChecksAlarmPresent(instanceAlarms)) {
                    alarmAnalysis.severity = SeverityStatus.Good;
                    alarmAnalysis.message = "StatusCheckFailed alarm is enabled";
                } else {
                    alarmAnalysis.severity = SeverityStatus.Failure;
                    alarmAnalysis.message = "StatusCheckFailed alarm is not enabled";
                    alarmAnalysis.action = "Set StatusCheckFailed alarm";
                }
                allRegionsAnalysis[region].push(alarmAnalysis);
            }
        }
        ec2_instance_system_checks_alarms.regions = allRegionsAnalysis;
        return { ec2_instance_system_checks_alarms };
    }

    private mapAlarmsByInstance(alarms: any[]): IDictionary<any[]> {
        return alarms.reduce((alarmsMap, alarm) => {
            if (alarm.Namespace === "AWS/EC2" && alarm.Dimensions) {
                const instanceDimension = alarm.Dimensions.find((dimension) => {
                    return dimension.Name === "InstanceId";
                });
                if (instanceDimension && instanceDimension.Value) {
                    alarmsMap[instanceDimension.Value] = alarmsMap[instanceDimension.Value] || [];
                    alarmsMap[instanceDimension.Value].push(alarm);

                }
            }
            return alarmsMap;
        }, {});
    }

    private isSystemChecksAlarmPresent(alarms) {
        return alarms && alarms.some((alarm) => {
            return alarm.ActionsEnabled &&
                alarm.AlarmActions &&
                alarm.AlarmActions.length &&
                (alarm.MetricName === "StatusCheckFailed_System" ||
                    alarm.MetricName === "StatusCheckFailed");
        });
    }
}

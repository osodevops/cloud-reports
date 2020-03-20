import * as AWS from "aws-sdk";
import { CommonUtil } from "../../../utils";
import { AWSErrorHandler } from "../../../utils/aws";
import { BaseCollector } from "../../base";

import { IDictionary } from "../../../types";

export class SubnetsCollector extends BaseCollector {
  private context: IDictionary<any> = {};
  public getContext() {
    return this.context;
  }

  public async collect() {
    const serviceName = "EC2";
    const ec2Regions = this.getRegions(serviceName);
    const self = this;
    const subnets = {};
    for (const region of ec2Regions) {
      try {
        const ec2 = self.getClient(serviceName, region) as AWS.EC2;
        const subnetsResponse: AWS.EC2.DescribeSubnetsResult = await ec2
          .describeSubnets()
          .promise();
        subnets[region] = subnetsResponse.Subnets;
        await CommonUtil.wait(200);
      } catch (error) {
        AWSErrorHandler.handle(error);
        continue;
      }
    }
    return { subnets };
  }
}

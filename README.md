[<img src="https://osodevops.io/assets/images/logo-purple-b3af53cc.svg" width="250"/>](https://osodevops.io)

# Cloud Reports
Collects info about various cloud resources and analyzes them against best practices and give a JSON, CSV, HTML, or PDF reports.

<p align="center"> 
<img src="https://user-images.githubusercontent.com/33080863/54195436-a734d300-44e4-11e9-952e-482eac08f345.png">
</p>

## Modules
### [Collectors](https://github.com/tensult/cloud-reports/tree/master/src/collectors)
These collect the information about various cloud resources from the cloud provider. This information later used by [Analyzers](https://github.com/tensult/cloud-reports/tree/master/src/analyzers) to analyze.
### [Analyzers](https://github.com/tensult/cloud-reports/tree/master/src/analyzers)
Analyzers are the codified best practices for the cloud and these analyzes each best practice against the collected information and generates report which then consumed by [Reporters](https://github.com/tensult/cloud-reports/tree/master/src/reporters) to generate reports in a desired format.
### [Reporters](https://github.com/tensult/cloud-reports/tree/master/src/reporters)
These are for generating reports in various formats and currently supported formats are JSON, HTML and PDF.
### AWS (Amazon Web Services)
We are implementing checks based on [AWS Well Architected](https://aws.amazon.com/architecture/well-architected/) best practices. 
* [AWS Collectors](https://github.com/tensult/cloud-reports/tree/master/src/collectors/aws): Collects information from various AWS services.
* [AWS Analyzers](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws): Analyzes the information collected.
* Currently supported AWS service modules:
* * acm: [AWS Certificate Manager](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/acm)
* * apigateway: [Amazon APIGateway](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/apigateway)
* * cloudfront: [AWS CloudFront](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/cloudfront)
* * cloudwatch: [AWS CloudWatch](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/cloudwatch)
* * dynamodb: [AWS DynamoDB](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/dynamodb)
* * ebs: [AWS Elastic Block Storage](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/ebs)
* * ec2: [AWS Elastic Cloud Computing](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/ec2)
* * elasticsearch: [AWS Elasticsearch Service](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/elasticsearch)
* * elb: [AWS Elastic Load Balancer](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/elb)
* * iam: [AWS Identity and Access Management](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/iam)
* * lambda: [Amazon Lambda](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/lambda)
* * rds: [AWS Relational Databases](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/rds)
* * redshift: [AWS Redshift](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/redshift)
* * resourcegroups: [AWS Resource Groups](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/resourcegroups)
* * route53: [AWS Route 53](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/route53)
* * s3: [AWS Simple Storage Service](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/s3)
* * sns: [AWS Simple Notification Service](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/sns)
* * sqs: [AWS Simple Queue Service](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/sqs)
* * route53: [AWS Elastic Load Balancer](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/elb)
* * trails: [AWS CloudTrails](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/trails)
* * vpc: [AWS Virtual Private Cloud](https://github.com/tensult/cloud-reports/tree/master/src/analyzers/aws/vpc)

### Install NodeJS
This package is based on NodeJS framework so you can it install from [here](https://nodejs.org/en/).
### Installing cloud-reports from source
#### Download

    git clone https://github.com/osodevops/cloud-reports.git

#### To get updates
If you have already cloned this repository before then for getting new updates, change directory to the cloud-reports directory and then do git pull.
```
git pull
```

#### Installing and Building
*Make sure you are in the cloud-reports directory.*

To convert typescript to javascript

    npm run build 
#### Scan
This collects and analyzes information about your AWS cloud and stores as a report file with name **scan_report.pdf**.
* To run for all modules
```
npm run scan -- --profile Your-AWS-profile
```
* To run on an EC2 instance
  * It is recommended not to keep the hard coded credentials on the instance so make sure to configure IAM EC2 instance profile role with Read access to AWS account.
  * Kindly make sure the machine has minimum 2 GB RAM available and the IAM role has atleast ReadOnly access to the AWS account.
  * Once the above conditions are met, CloudReports can run on the instance using instance profile role so no need to pass the profile parameter.

```
npm run scan -- -m s3,acm
```
* To run for specific module
```
npm run scan -- --profile Your-AWS-profile -m s3,acm
```
* To run for single module
```
npm run scan -- --profile Your-AWS-profile  -m s3
```
* To run for specific regions
```
npm run scan -- --profile Your-AWS-profile -m s3,acm -r ap-south-1,ap-southeast-1
```
* We can generate report in following formats: 
* To generate HTML report file
```
npm run scan -- --profile Your-AWS-profile  -f html
```
* To generate PDF report file
```
npm run scan -- --profile Your-AWS-profile  -f pdf
npm run scan -- --profile Your-AWS-profile  -f pdf -i # This will only report issues
```
* To generate CSV report file
```
npm run scan -- --profile Your-AWS-profile  -f csv
npm run scan -- --profile Your-AWS-profile  -f csv -i # This will only report issues
```
* To generate JSON report file
```
npm run scan -- --profile Your-AWS-profile  -f json
```
* To generate report with custom name
```
npm run scan -- --profile Your-AWS-profile  -f json -o my-dev-account
```
#### [Sample reports](https://github.com/tensult/cloud-reports/tree/master/sample-reports)

### Debugging
You can run this tool in debug mode to generate intermediate reports: collector_report.json and analyzer_report.json
```
npm run scan -- --profile Your-AWS-profile  -f pdf -d
```
#### Reusing Collector report
When we are working on analyzers, we will be testing them multiple times and every time collecting data will cause delays, to avoid such delays you can use the following command to reuse already collected collector report.
```
npm run scan -- --profile Your-AWS-profile  -f pdf -d -u
```
### Install as npm module to an existing package
#### Install cloud-reports npm module
```
npm install -S cloud-reports
```
#### Usage
Make sure you have initialized [AWS.config](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/global-config-object.html), otherwise this will use default AWS profile.
```js
    const cloudReporter = require('cloud-reports');
    // To collect for all modules
    const collectionPromise = cloudReporter.collect()
    // To collect for specific modules
    // const collectedJson = cloudReporter.collect(['s3', 'iam']);
    // const collectedJson = cloudReporter.collect('vpc');
    const analysisPromise = collectionPromise.then((collectedJson) => cloudReporter.analyze(collectedJson));
    analysisPromise.then((analysisJson) => console.log(JSON.stringify(analysisJson, null, 2)));
```
#### Multiple credentials support
You may want to run the report for multiple accounts with different set of credentials at once, then in that case you can pass different credentials to collect method.
```js
    const cloudReporter = require('cloud-reports');
    const account1CollectionPromise = cloudReporter.collect(all, credentials1);
    const account2CollectionPromise = cloudReporter.collect(all, credentials2);

    const analysisPromise = Promise.all([account1CollectionPromise, account2CollectionPromise])
                                   .then((collectedJsons) => {
                                       return collectedJsons.map((collectedJson) => {
                                           return cloudReporter.analyze(collectedJson);
                                       });
                                    });
    analysisPromise.then((analysisJsons) => console.log(JSON.stringify(analysisJsons, null, 2)));
```
### Update service regions[Broken as AWS changed the documentation UI]
We have written a [script](https://github.com/osodevops/cloud-reports/blob/master/src/scripts/updateAwsServiceRegionsData.js) which updates the [AWS regions data](https://github.com/osodevops/cloud-reports/blob/master/src/utils/aws/regions_data.ts)
```
node src/scripts/updateAwsServiceRegionsData.js
```

## Disclaimer
This product was originaly developed by [Tensult](https://www.tensult.com) we have forked the codebase and will continue to develop the solution going forwards. The original repo by Tensult has been archived.

## Trademarks

All other trademarks referenced herein are the property of their respective owners.

## About

[<img src="https://osodevops.io/assets/images/logo-purple-b3af53cc.svg" width="250"/>](https://osodevops.io)

We are a cloud consultancy specialising in transforming technology organisations through DevOps practices. 
We help organisations accelerate their capabilities for application delivery and minimize the time-to-market for software-driven innovation. 

Check out [our other projects][github], [follow us on twitter][twitter], or [hire us][hire] to help with your cloud strategy and implementation.

  [logo]: https://osodevops.io/assets/images/logo-purple-b3af53cc.svg
  [website]: https://osodevops.io/
  [github]: https://github.com/orgs/osodevops/
  [hire]: https://osodevops.io/contact/
  [linkedin]: https://www.linkedin.com/company/oso-devops
  [twitter]: https://twitter.com/osodevops
  [email]: https://www.osodevops.io/contact/



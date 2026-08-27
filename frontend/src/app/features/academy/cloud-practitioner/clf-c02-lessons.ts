export interface ClfLesson {
  day: number;
  title: string;
  domain: string;
  technology: string;
  intro: string;
  scenario: string;
  definition: string;
  why: string;
  problem: string;
  mentalModel: string;
  kid: string;
  concepts: { name: string; explanation: string; ticketforge: string }[];
  task: string;
  steps: string[];
  proof: string;
  question: string;
  options: [string, string, string];
  correct: 'a' | 'b' | 'c';
  answer: string;
}

export const CLF_C02_LESSONS: ClfLesson[] = [
  {
    day: 3, title: 'Choose compute for TicketForge', domain: 'Cloud Technology & Services', technology: 'Amazon EC2 and compute pricing',
    intro: 'Learn how virtual servers run applications and how traffic patterns change the price you should pay.',
    scenario: 'TicketForge has steady weekday traffic, but a concert announcement can create a large spike for two hours. The API needs reliable baseline capacity and temporary extra capacity.',
    definition: 'Amazon EC2 provides virtual servers called instances. An AMI defines the starting machine image, EBS provides persistent block storage, security groups filter traffic, and Auto Scaling changes the number of instances.',
    why: 'TicketForge needs compute capacity for its API and workers. EC2 gives the team operating-system control, many instance sizes, and several purchasing models.',
    problem: 'EC2 replaces physical server purchasing with programmable capacity, but the team still manages the operating system, scaling rules, and instance security.',
    mentalModel: 'An EC2 instance is a rented computer. The AMI is its setup template, EBS is its disk, the security group is its door policy, and Auto Scaling hires or releases computers as demand changes.',
    kid: 'Imagine renting game consoles for a party. Keep enough consoles for normal days, rent more for the big party, and return the extras afterward.',
    concepts: [
      { name: 'On-Demand', explanation: 'Pay for capacity without a long commitment.', ticketforge: 'Use it for uncertain baseline demand or short experiments.' },
      { name: 'Savings Plans / Reserved capacity', explanation: 'Commit to predictable usage for a lower effective price.', ticketforge: 'Use commitment only after measuring the API baseline.' },
      { name: 'Spot', explanation: 'Use discounted spare capacity that AWS may interrupt.', ticketforge: 'Use it for retryable analytics workers, not the only reservation API instance.' },
    ],
    task: 'Choose compute and pricing for the TicketForge API and analytics worker.',
    steps: ['State the availability and interruption requirements for each workload.', 'Choose an EC2 purchasing model for baseline, burst, and retryable work.', 'Explain how a load balancer and Auto Scaling group respond to the concert spike.'],
    proof: 'Produce a short decision table that maps each TicketForge workload to a purchasing model and explains interruption tolerance.',
    question: 'Which workload is the best first candidate for EC2 Spot Instances?',
    options: ['The only TicketForge reservation API instance', 'A retryable analytics worker that reads durable events', 'The primary transactional database'], correct: 'b',
    answer: 'Spot capacity can be interrupted. A retryable worker can resume, while the only API instance or primary database cannot accept that interruption boundary.',
  },
  {
    day: 4, title: 'Compare containers and serverless compute', domain: 'Cloud Technology & Services', technology: 'Lambda, ECS, Fargate, and EKS',
    intro: 'Choose compute by deciding how much runtime control and operational responsibility TicketForge actually needs.',
    scenario: 'TicketForge has a long-running Spring Boot API, a containerized email worker, and a small image-processing task that runs only after an upload.',
    definition: 'Lambda runs event-triggered functions. ECS schedules containers, Fargate supplies serverless container capacity, and EKS provides managed Kubernetes control planes.',
    why: 'Different TicketForge workloads have different lifetimes, scaling patterns, portability needs, and operations budgets.',
    problem: 'These services let the team avoid managing some infrastructure, but more abstraction can also reduce control or introduce platform-specific limits.',
    mentalModel: 'Lambda is a helper called for one job. ECS is a container dispatcher. Fargate supplies the rooms. EKS is a full container city with Kubernetes rules.',
    kid: 'For one quick chore, call a helper. For packed lunchboxes that run all day, use a delivery manager. Build a whole city only when you truly need its rules.',
    concepts: [
      { name: 'Lambda', explanation: 'Runs short event-driven code and scales per invocation.', ticketforge: 'Process an uploaded event image without keeping a server idle.' },
      { name: 'ECS with Fargate', explanation: 'Runs containers without managing EC2 worker nodes.', ticketforge: 'Run the API or email worker with less cluster administration.' },
      { name: 'EKS', explanation: 'Runs Kubernetes workloads using an AWS-managed control plane.', ticketforge: 'Use it when Kubernetes portability and ecosystem value justify its complexity.' },
    ],
    task: 'Place three TicketForge workloads on suitable compute services.', steps: ['List execution duration, trigger, scaling pattern, and portability needs.', 'Choose Lambda, ECS/Fargate, or EKS for each workload.', 'Name the operational responsibility your choice removes and the limitation it adds.'],
    proof: 'Explain why using EKS for one tiny image function would add more platform than the requirement needs.',
    question: 'Which service best fits a short image task triggered by an S3 upload?', options: ['Lambda', 'A permanently running EC2 instance only', 'Redshift'], correct: 'a', answer: 'Lambda is designed for event-triggered, short-lived work. The task does not require an always-running server.',
  },
  {
    day: 5, title: 'Choose the correct storage type', domain: 'Cloud Technology & Services', technology: 'Amazon S3, EBS, and EFS',
    intro: 'Learn why object, block, and file storage solve different application problems.',
    scenario: 'TicketForge must store event images, PostgreSQL database files, and a shared directory read by several legacy application instances.',
    definition: 'S3 stores objects through an API. EBS provides block volumes to compute instances. EFS provides a shared network file system for multiple clients.',
    why: 'Choosing storage by habit can create poor performance, broken sharing assumptions, or unnecessary cost.',
    problem: 'AWS storage services separate durable objects, attached disks, and shared files so each workload receives the access pattern it needs.',
    mentalModel: 'S3 is a labeled warehouse, EBS is one computer’s disk, and EFS is a shared office filing cabinet.',
    kid: 'Photos go in a big labeled toy bin, one computer gets its own notebook, and several helpers share one cabinet when they need the same files.',
    concepts: [
      { name: 'S3', explanation: 'Durable regional object storage with versioning, lifecycle, and storage classes.', ticketforge: 'Store event images, exports, backups, and static assets.' },
      { name: 'EBS', explanation: 'Low-latency block storage attached within an Availability Zone.', ticketforge: 'Provide a disk to an EC2-hosted database or server.' },
      { name: 'EFS', explanation: 'Elastic shared file storage mounted by multiple clients.', ticketforge: 'Support a legacy shared-file requirement across several instances.' },
    ],
    task: 'Map TicketForge data to storage services.', steps: ['Identify whether each workload needs an object API, attached blocks, or shared file paths.', 'Add encryption and recovery requirements.', 'Choose a lifecycle rule for old event images and prove cleanup after a lab bucket.'],
    proof: 'Create a three-row storage decision table and explain why S3 is not mounted like an EBS database disk.',
    question: 'Where should TicketForge store public event images?', options: ['S3 objects', 'An EBS volume attached to one API instance only', 'A security group'], correct: 'a', answer: 'Event images are durable objects and can be delivered independently from any one API instance.',
  },
  {
    day: 6, title: 'Review week one decisions', domain: 'Review', technology: 'Cloud foundations review',
    intro: 'Use new scenarios to confirm that you understand the boundaries from days one through five.',
    scenario: 'A TicketForge design uses root credentials, two servers in one Availability Zone, Spot for the database, and EBS for public images. You must identify and correct the risks.',
    definition: 'A review combines several concepts in one architecture and asks whether each choice satisfies the stated requirement.',
    why: 'Certification questions rarely announce the service category. You must extract availability, security, cost, and access-pattern requirements from the scenario.',
    problem: 'Review exposes memorized definitions that have not yet become usable decisions.', mentalModel: 'A review is a building inspection: check every room against the plan, not whether the labels look familiar.',
    kid: 'Look at the whole treehouse and find every unsafe choice instead of answering one tiny question at a time.',
    concepts: [
      { name: 'Requirement', explanation: 'A measurable need such as surviving one AZ failure.', ticketforge: 'Translate “ticket sales must continue” into an availability boundary.' },
      { name: 'Service boundary', explanation: 'The problem a service solves and the responsibility it leaves behind.', ticketforge: 'EC2 provides servers but does not manage the application for you.' },
      { name: 'Tradeoff', explanation: 'A benefit accepted with a cost or limitation.', ticketforge: 'More Availability Zones improve resilience and increase cost.' },
    ],
    task: 'Review the flawed TicketForge design.', steps: ['List each decision and the requirement it violates.', 'Replace it with a better choice.', 'Write one new question that distinguishes two services.'], proof: 'Explain all four corrections without reading notes.',
    question: 'What is the most direct problem with two API instances in one Availability Zone?', options: ['They cannot share an AMI', 'They still share one Availability Zone failure domain', 'They must use S3 as a database'], correct: 'b', answer: 'Two instances reduce instance failure risk, but both remain unavailable if their shared Availability Zone fails.',
  },
  {
    day: 7, title: 'Repair a weak concept', domain: 'Review', technology: 'Targeted review and correction',
    intro: 'Use your mistakes to choose what to study next instead of rereading everything.',
    scenario: 'Your week-one results show that you confuse elasticity with high availability. TicketForge can add servers during a spike, but all servers still run in one Availability Zone.',
    definition: 'Targeted review classifies a mistake, studies the missing boundary, and tests it again with a different scenario.',
    why: 'A total score does not tell you what mental model failed.', problem: 'Without classification, learners repeat questions and memorize answers instead of correcting reasoning.',
    mentalModel: 'Do not repaint the whole house when one pipe leaks. Find the pipe, repair it, and test the water again.', kid: 'If you miss one kind of math problem, practice that kind with new numbers instead of copying the old answer.',
    concepts: [
      { name: 'Knowledge gap', explanation: 'The service or term is unfamiliar.', ticketforge: 'You cannot define an Availability Zone.' },
      { name: 'Boundary gap', explanation: 'You know definitions but choose the wrong service.', ticketforge: 'You think Auto Scaling automatically creates multi-AZ resilience.' },
      { name: 'Reading gap', explanation: 'You missed a requirement or qualifier.', ticketforge: 'The question asked for interruptible work, but you ignored that word.' },
    ],
    task: 'Correct one real week-one mistake.', steps: ['Classify the mistake as knowledge, boundary, or reading.', 'Write the corrected rule in one sentence.', 'Test the rule against a new TicketForge scenario.'], proof: 'Explain why elasticity and high availability are independent properties.',
    question: 'TicketForge adds more servers, but all are in one AZ. What improved?', options: ['Scalability, but not AZ resilience', 'Regional disaster recovery', 'Data encryption'], correct: 'a', answer: 'More servers can increase capacity. They do not create a second failure domain when all servers remain in one Availability Zone.',
  },
  {
    day: 8, title: 'Trace traffic through an AWS network', domain: 'Cloud Technology & Services', technology: 'Amazon VPC networking',
    intro: 'Follow a customer request from the internet to a private TicketForge API.',
    scenario: 'Customers must reach TicketForge through a public load balancer, but the API and database must not accept direct inbound internet traffic.',
    definition: 'A VPC is an isolated virtual network. Subnets divide address space, route tables choose paths, gateways connect networks, and security controls filter traffic.',
    why: 'TicketForge needs explicit network boundaries between public entry points, private application capacity, and protected data.', problem: 'VPC components provide routing and traffic controls without requiring the team to own physical routers.',
    mentalModel: 'The VPC is a property, subnets are rooms, routes are road signs, gateways are exits, and security groups are door guards.', kid: 'Visitors enter through the front desk. They cannot walk directly into the private office or locked records room.',
    concepts: [
      { name: 'Private subnet', explanation: 'Has no direct inbound route from the internet.', ticketforge: 'Run API instances and databases behind the load balancer.' },
      { name: 'Security group', explanation: 'A stateful virtual firewall attached to resources.', ticketforge: 'Allow API traffic only from the load balancer security group.' },
      { name: 'NAT gateway', explanation: 'Lets private-subnet workloads initiate outbound internet connections without accepting inbound internet sessions.', ticketforge: 'Let a private API download an update while keeping it unreachable from the public internet.' },
    ],
    task: 'Draw the TicketForge request path.', steps: ['Place the load balancer, API, and database in appropriate subnets.', 'Add the route and security-group relationships.', 'Explain when a private workload needs a NAT gateway and what cost it introduces.'], proof: 'Trace both the request and response and state which component is publicly reachable.',
    question: 'What should accept inbound HTTPS from customers?', options: ['The public load balancer', 'The private database', 'Every API instance directly'], correct: 'a', answer: 'The public load balancer is the controlled entry point. It forwards allowed traffic to private API targets.',
  },
  {
    day: 9, title: 'Choose databases by workload', domain: 'Cloud Technology & Services', technology: 'RDS, Aurora, DynamoDB, ElastiCache, and Redshift',
    intro: 'Choose a data service from the access pattern instead of selecting one database for every job.',
    scenario: 'TicketForge needs transactional reservations, fast repeated event reads, session-like temporary data, and long-term sales analytics.',
    definition: 'RDS and Aurora provide relational databases, DynamoDB provides managed key-value and document storage, ElastiCache provides in-memory caching, and Redshift provides analytics warehousing.',
    why: 'TicketForge data has different consistency, query, latency, scale, and retention needs.', problem: 'Managed data services reduce infrastructure work while preserving distinct database models and operational tradeoffs.',
    mentalModel: 'Use a ledger for transactions, an index card for key lookups, a whiteboard for fast temporary copies, and a warehouse for large analysis.', kid: 'Do not keep money records, quick reminders, and years of reports in the same kind of notebook.',
    concepts: [
      { name: 'Multi-AZ', explanation: 'Improves database availability with standby capacity.', ticketforge: 'Protect the reservation database from an AZ failure.' },
      { name: 'Read replica', explanation: 'Adds read capacity and can support read-heavy workloads.', ticketforge: 'Scale event browsing without treating the replica as the same goal as Multi-AZ standby.' },
      { name: 'ElastiCache', explanation: 'Stores frequently accessed data in memory.', ticketforge: 'Cache event details while PostgreSQL remains the system of record.' },
    ],
    task: 'Separate TicketForge transactional, cache, key-value, and analytics needs.', steps: ['State consistency and query requirements.', 'Choose a service for each workload.', 'Explain Multi-AZ versus read replicas.'], proof: 'Defend why the cache is not the reservation system of record.',
    question: 'Which feature directly targets relational database availability across AZs?', options: ['Multi-AZ deployment', 'A larger S3 object', 'CloudFront caching'], correct: 'a', answer: 'Multi-AZ maintains database capacity in another Availability Zone for availability. Read replicas primarily address read scaling.',
  },
  {
    day: 10, title: 'Decouple TicketForge services', domain: 'Cloud Technology & Services', technology: 'SQS, SNS, EventBridge, and Step Functions',
    intro: 'Choose queues, notifications, event routing, and workflows based on how consumers should receive work.',
    scenario: 'After a reservation, TicketForge must send email, update analytics, and run a multi-step refund process without making the checkout request wait for every downstream system.',
    definition: 'SQS buffers messages for consumers, SNS pushes one message to many subscribers, EventBridge routes events by rules, and Step Functions coordinates multi-step workflows.',
    why: 'TicketForge should continue accepting reservations even when email or analytics is temporarily slow.', problem: 'Integration services reduce direct dependencies and give asynchronous work durable boundaries.',
    mentalModel: 'SQS is a work line, SNS is a loudspeaker, EventBridge is a mail sorter, and Step Functions is a checklist coordinator.', kid: 'Put chores in a line, announce news to many helpers, sort notes by rules, and use a checklist when steps must happen in order.',
    concepts: [
      { name: 'SQS', explanation: 'A consumer pulls and processes messages from a durable queue.', ticketforge: 'Buffer email jobs and retry them independently.' },
      { name: 'SNS / EventBridge', explanation: 'Fan out or route messages to multiple interested targets.', ticketforge: 'Notify email and analytics about a reservation event.' },
      { name: 'Step Functions', explanation: 'Coordinates state, retries, branches, and errors across steps.', ticketforge: 'Run a refund workflow that validates, refunds, and notifies.' },
    ],
    task: 'Design the post-reservation flow.', steps: ['Separate commands from facts that happened.', 'Choose queue, fan-out, routing, or workflow coordination.', 'Describe retries and duplicate-message handling.'], proof: 'Explain why checkout should not call email synchronously.',
    question: 'Which service best buffers email jobs for workers to process?', options: ['SQS', 'Route 53', 'EBS'], correct: 'a', answer: 'SQS decouples producers and consumers with a durable queue so a slow email worker does not block checkout.',
  },
  {
    day: 11, title: 'Route users and deliver content', domain: 'Cloud Technology & Services', technology: 'Route 53, CloudFront, and Global Accelerator',
    intro: 'Learn how users find TicketForge and how AWS can serve content closer to them.', scenario: 'TicketForge customers in several countries need reliable DNS and fast event images, while API traffic must reach a healthy regional endpoint.',
    definition: 'Route 53 provides DNS and health-aware routing. CloudFront caches HTTP content at edge locations. Global Accelerator uses the AWS global network to improve paths to regional applications.',
    why: 'Users need a stable name, low-latency content, and healthy destinations.', problem: 'These services separate name resolution, content caching, and global network acceleration.',
    mentalModel: 'DNS is the address book, CloudFront is a nearby copy desk, and Global Accelerator is a fast private highway to the application.', kid: 'Find the shop in a phone book, pick up popular pictures nearby, and take the fastest road to the real counter.',
    concepts: [
      { name: 'Route 53', explanation: 'Answers DNS queries and can route using health, latency, weight, or geography.', ticketforge: 'Send ticketforge.example to a healthy endpoint.' },
      { name: 'CloudFront', explanation: 'Caches static and dynamic HTTP content at edge locations.', ticketforge: 'Serve event images close to customers and reduce origin load.' },
      { name: 'Global Accelerator', explanation: 'Provides static anycast IPs and optimized network paths to regional endpoints.', ticketforge: 'Improve global application traffic that should not be cached.' },
    ],
    task: 'Trace a user opening the TicketForge events page.', steps: ['Show DNS resolution.', 'Separate cached image delivery from API requests.', 'Choose a failover behavior when the origin is unhealthy.'], proof: 'Explain why DNS, caching, and network acceleration are not the same function.',
    question: 'Which service should cache TicketForge event images near users?', options: ['CloudFront', 'IAM', 'EBS'], correct: 'a', answer: 'CloudFront delivers cached HTTP content from edge locations. IAM controls access and EBS provides block storage.',
  },
  {
    day: 12, title: 'Observe and govern AWS', domain: 'Security & Compliance', technology: 'CloudWatch, CloudTrail, Config, and governance services',
    intro: 'Choose the service that answers a specific operations or governance question.', scenario: 'TicketForge latency increased, a security group changed overnight, and the architect must know whether current resources still follow policy.',
    definition: 'CloudWatch handles metrics, logs, alarms, and dashboards. CloudTrail records AWS API activity. Config evaluates resource configuration. Organizations and Control Tower govern multiple accounts.',
    why: 'Operating TicketForge requires signals about application health, actor activity, configuration drift, and account boundaries.', problem: 'No single monitoring service answers every operational and governance question.',
    mentalModel: 'CloudWatch is the instrument panel, CloudTrail is the security-camera log, Config is the building inspector, and Organizations is the campus administration.', kid: 'One helper watches gauges, one writes down who touched a switch, and one checks whether the room still follows the rules.',
    concepts: [
      { name: 'CloudWatch', explanation: 'Collects operational telemetry and triggers alarms.', ticketforge: 'Alarm when API error rate or latency rises.' },
      { name: 'CloudTrail', explanation: 'Records API calls and the identity that made them.', ticketforge: 'Find who changed a security group.' },
      { name: 'AWS Config', explanation: 'Tracks resource configuration and evaluates rules.', ticketforge: 'Detect a bucket that no longer meets encryption policy.' },
    ],
    task: 'Match three TicketForge incidents to AWS services.', steps: ['Identify whether the question asks about health, actor history, or current compliance.', 'Choose the matching service.', 'State the alarm or rule you would configure.'], proof: 'Explain the difference between an application log and an AWS API audit record.',
    question: 'Which service shows who changed a TicketForge security group?', options: ['CloudTrail', 'CloudFront', 'Savings Plans'], correct: 'a', answer: 'CloudTrail records AWS API activity and the calling identity. CloudWatch may show effects, but it is not the primary API audit history.',
  },
  {
    day: 13, title: 'Review an AWS architecture', domain: 'Review', technology: 'Service selection from requirements',
    intro: 'Practice turning business statements into service decisions and rejecting plausible alternatives.', scenario: 'TicketForge must survive one AZ outage, process email asynchronously, store images cheaply, and report which identity changed infrastructure.',
    definition: 'An architecture review tests whether every component satisfies a stated requirement and whether the design has avoidable risk or complexity.', why: 'A service list is not an architecture until each service is connected to a requirement.', problem: 'Reviews catch choices based on familiarity instead of measurable needs.',
    mentalModel: 'Every architecture box needs a receipt showing which requirement paid for it.', kid: 'Every tool in the backpack must have a job. If you cannot say why it is there, take it out.',
    concepts: [
      { name: 'Functional requirement', explanation: 'Describes behavior the system must provide.', ticketforge: 'Send a confirmation after a reservation.' },
      { name: 'Non-functional requirement', explanation: 'Describes quality such as availability, latency, security, or cost.', ticketforge: 'Continue checkout through one AZ outage.' },
      { name: 'Constraint', explanation: 'Limits the possible solution.', ticketforge: 'The team can operate managed containers but not Kubernetes.' },
    ],
    task: 'Review the provided TicketForge requirements.', steps: ['Underline the requirement in each sentence.', 'Choose one AWS service or pattern.', 'Reject one alternative using the same requirement.'], proof: 'Present the design in two minutes without naming a service before naming its requirement.',
    question: 'What should come first in a defensible service decision?', options: ['The requirement', 'The newest AWS service', 'The longest architecture diagram'], correct: 'a', answer: 'The requirement defines success. Services and patterns are evaluated against it.',
  },
  {
    day: 14, title: 'Correct service confusion', domain: 'Review', technology: 'Service comparison and targeted review',
    intro: 'Repair the service boundaries that your week-two scenarios exposed.', scenario: 'You selected CloudWatch when asked who changed a resource and selected SNS when one worker must process each job once. These answers reveal two boundary gaps.',
    definition: 'Targeted review compares commonly confused services using trigger, consumer model, stored data, and question answered.', why: 'Many exam distractors are real AWS services that solve a neighboring problem.', problem: 'Memorizing service names does not teach where one service stops and another begins.',
    mentalModel: 'Compare tools side by side: a hammer and screwdriver are both tools, but the shape of the fastener decides.', kid: 'Two helpers may wear the same uniform, but ask what job each one actually does.',
    concepts: [
      { name: 'CloudWatch vs CloudTrail', explanation: 'Operational telemetry versus AWS API audit history.', ticketforge: 'Latency alarm versus identity that changed a route.' },
      { name: 'SQS vs SNS', explanation: 'Work queue versus push fan-out.', ticketforge: 'One email job worker versus notifying several downstream systems.' },
      { name: 'Multi-AZ vs read replica', explanation: 'Availability versus read scaling as the primary goal.', ticketforge: 'Database failover versus more event-browse reads.' },
    ],
    task: 'Create three service-pair comparison cards.', steps: ['Write the question each service answers.', 'Add one TicketForge use case for each.', 'Write a new scenario where only one option fits.'], proof: 'Answer the new scenarios without using product taglines.',
    question: 'One email job must be processed by one worker. Which service fits?', options: ['SQS', 'SNS fan-out only', 'Route 53'], correct: 'a', answer: 'SQS is a work queue. Competing consumers can process messages without every subscriber receiving the same job.',
  },
  {
    day: 15, title: 'Choose AWS security services', domain: 'Security & Compliance', technology: 'AWS security and compliance services',
    intro: 'Map each security service to prevention, protection, detection, investigation, or compliance.', scenario: 'TicketForge must encrypt payment-related data, keep database passwords out of source code, detect suspicious API behavior, block common web attacks, and obtain AWS compliance reports.',
    definition: 'AWS provides focused services for keys, secrets, threat detection, vulnerability findings, sensitive-data discovery, web protection, security aggregation, and compliance artifacts.', why: 'Security controls solve different stages of risk and should not be treated as interchangeable.', problem: 'The service catalog becomes manageable when each service is connected to the signal or control it owns.',
    mentalModel: 'Keys lock data, a safe stores secrets, guards detect intruders, shields block attacks, and auditors provide reports.', kid: 'Use the right helper: one locks the treasure, one hides the password, one watches for trouble, and one checks the front gate.',
    concepts: [
      { name: 'KMS / Secrets Manager', explanation: 'Manage encryption keys and application secrets.', ticketforge: 'Encrypt data and rotate the database credential.' },
      { name: 'GuardDuty / Inspector / Macie', explanation: 'Detect threats, workload vulnerabilities, and sensitive S3 data.', ticketforge: 'Investigate suspicious AWS behavior and exposed workload risk.' },
      { name: 'WAF / Shield / Artifact', explanation: 'Filter web requests, protect against DDoS, and provide compliance documents.', ticketforge: 'Block common web attacks and retrieve AWS reports.' },
    ],
    task: 'Build a TicketForge security-service map.', steps: ['Name the threat or compliance need.', 'Choose the service that produces the control or finding.', 'State what the TicketForge team must still do after enabling it.'], proof: 'Explain why GuardDuty does not replace WAF or least-privilege IAM.',
    question: 'Where should TicketForge store and rotate a database password?', options: ['Secrets Manager', 'CloudFront', 'Route 53'], correct: 'a', answer: 'Secrets Manager stores, retrieves, and can rotate secrets. The other services solve content delivery and DNS.',
  },
  {
    day: 16, title: 'Choose a pricing model', domain: 'Billing, Pricing & Support', technology: 'AWS pricing models',
    intro: 'Match price discounts to commitment and interruption tolerance.', scenario: 'TicketForge has a steady database, a predictable API baseline, a two-hour concert spike, and nightly analytics jobs that can retry.',
    definition: 'AWS pricing ranges from flexible On-Demand usage to commitment discounts and interruptible Spot capacity. Data transfer and managed-service dimensions also affect cost.', why: 'The cheapest unit price may violate availability or flexibility requirements.', problem: 'Pricing models make cost an architecture decision tied to workload behavior.',
    mentalModel: 'Pay full price for flexibility, buy a pass for steady use, and accept possible cancellation for a deep discount.', kid: 'Rent a bike today, buy a monthly pass when you ride every day, or take a cheap standby seat when waiting is okay.',
    concepts: [
      { name: 'On-Demand', explanation: 'Flexible usage without commitment.', ticketforge: 'Cover uncertain or temporary capacity.' },
      { name: 'Savings Plans / Reservations', explanation: 'Discount predictable committed usage.', ticketforge: 'Discount measured baseline compute or database demand.' },
      { name: 'Spot', explanation: 'Deeply discounted interruptible compute.', ticketforge: 'Run retryable analytics or batch work.' },
    ],
    task: 'Price four TicketForge workload shapes.', steps: ['State whether usage is steady, temporary, or interruptible.', 'Choose a pricing model.', 'Name the risk created by the choice.'], proof: 'Explain why a production database and retryable batch worker should not automatically use the same model.',
    question: 'Which workload best matches Spot pricing?', options: ['Retryable nightly analytics', 'The only production database', 'A required root-user task'], correct: 'a', answer: 'Retryable analytics can tolerate interruption and resume later.',
  },
  {
    day: 17, title: 'Estimate and monitor AWS cost', domain: 'Billing, Pricing & Support', technology: 'AWS cost management tools',
    intro: 'Use the right tool for future estimates, historical analysis, threshold alerts, and account organization.', scenario: 'Before deploying TicketForge, the architect needs an estimate. After deployment, finance needs actual trends and an alert when spending passes a limit.',
    definition: 'Pricing Calculator estimates planned designs, Cost Explorer analyzes actual and forecast cost, Budgets alerts on thresholds, and cost-allocation tags group spending.', why: 'Planning, observing, and alerting are different jobs.', problem: 'Cost tools make cloud spending visible, but alerts do not automatically stop every charge.',
    mentalModel: 'A quote predicts the bill, a statement shows past spending, and an alarm warns when a line is crossed.', kid: 'Plan what your shopping cart may cost, check the receipt later, and ask for a warning when you spend too much.',
    concepts: [
      { name: 'Pricing Calculator', explanation: 'Models the expected cost of a proposed design.', ticketforge: 'Estimate API, database, storage, and transfer before deployment.' },
      { name: 'Cost Explorer', explanation: 'Analyzes actual cost and usage over time.', ticketforge: 'Find which TicketForge service caused last month’s increase.' },
      { name: 'Budgets', explanation: 'Sends alerts when actual or forecast values cross thresholds.', ticketforge: 'Warn the learning account before spend exceeds its limit.' },
    ],
    task: 'Choose a cost tool for four questions.', steps: ['Separate future, past, forecast, and ownership questions.', 'Choose the matching tool.', 'State the action a human or automation takes after an alert.'], proof: 'Explain why a Budget notification is not a guaranteed spending brake.',
    question: 'Which tool estimates TicketForge before resources exist?', options: ['AWS Pricing Calculator', 'CloudTrail', 'GuardDuty'], correct: 'a', answer: 'Pricing Calculator models planned services. It does not report actual historical charges.',
  },
  {
    day: 18, title: 'Review TicketForge with six pillars', domain: 'Cloud Concepts', technology: 'AWS Well-Architected Framework',
    intro: 'Use six consistent perspectives to find risk and improvement opportunities.', scenario: 'TicketForge works today, but the team needs a structured review of operations, security, reliability, performance, cost, and environmental efficiency.',
    definition: 'The AWS Well-Architected Framework organizes architecture guidance into six pillars: operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability.', why: 'A design can be fast but insecure, reliable but unaffordable, or cheap but impossible to operate.', problem: 'The pillars prevent one quality from becoming the only definition of good architecture.',
    mentalModel: 'Inspect the same building for operations, locks, emergency exits, speed, price, and waste.', kid: 'A good treehouse must be easy to fix, safe, strong, useful, affordable, and not waste materials.',
    concepts: [
      { name: 'Operational excellence / Security', explanation: 'Run, improve, and protect the workload.', ticketforge: 'Automate deployment and enforce identity boundaries.' },
      { name: 'Reliability / Performance', explanation: 'Recover from failure and use resources efficiently for demand.', ticketforge: 'Use multiple AZs and measure reservation latency.' },
      { name: 'Cost / Sustainability', explanation: 'Avoid unnecessary spend and resource waste.', ticketforge: 'Scale down idle capacity and choose efficient services.' },
    ],
    task: 'Perform a six-pillar TicketForge review.', steps: ['Write one current strength per pillar.', 'Write one risk per pillar.', 'Prioritize one improvement using impact and effort.'], proof: 'Present the chosen improvement and explain which other pillars it affects.',
    question: 'Which pillar asks how TicketForge recovers from failure?', options: ['Reliability', 'Cost Optimization only', 'Sustainability only'], correct: 'a', answer: 'Reliability covers recovery, capacity, and failure handling, although changes may affect several pillars.',
  },
  {
    day: 19, title: 'Take a timed practice exam', domain: 'Assessment', technology: 'Timed assessment and mistake analysis',
    intro: 'Measure your current decision speed and identify the reasoning patterns that still fail.', scenario: 'You know many service definitions, but the real question is whether you can choose correctly under exam time without hints.',
    definition: 'A timed practice exam is a controlled assessment completed without interruptions, followed by classification and review of every incorrect or uncertain answer.', why: 'Untimed study can hide slow recall and overreliance on notes.', problem: 'A score becomes useful only when missed answers are converted into specific learning work.',
    mentalModel: 'Run the fire drill under realistic conditions, then inspect every place where the process slowed or failed.', kid: 'Play the whole practice game with the real clock, then review every move you guessed.',
    concepts: [
      { name: 'Timed attempt', explanation: 'Uses realistic pacing and no mid-exam lookup.', ticketforge: 'Treat it like an architecture review with a fixed decision window.' },
      { name: 'Confidence', explanation: 'Record whether correct answers were known or guessed.', ticketforge: 'A lucky guess is not yet a dependable decision.' },
      { name: 'Error category', explanation: 'Classify knowledge, boundary, reading, or time errors.', ticketforge: 'Turn each miss into targeted review.' },
    ],
    task: 'Complete one full timed CLF-C02 practice exam.', steps: ['Remove interruptions and use the real time limit.', 'Record score and uncertain answers.', 'Classify every miss before reviewing the explanation.'], proof: 'Produce a score plus a count of misses by error category; do not copy proprietary question text.',
    question: 'What should you do first after scoring the exam?', options: ['Classify why each miss happened', 'Memorize the answer letters', 'Retake the identical questions immediately'], correct: 'a', answer: 'Classification reveals what to repair. Memorizing letters or repeating identical questions can create false confidence.',
  },
  {
    day: 20, title: 'Close the remaining gaps', domain: 'Review', technology: 'Evidence-based exam remediation',
    intro: 'Study only the domains and service boundaries that the timed assessment showed are weak.', scenario: 'Your score is 76%. Most misses involve CloudTrail versus CloudWatch and Savings Plans versus Spot, while storage questions are already strong.',
    definition: 'Remediation converts assessment evidence into a small study plan, new scenarios, and a fresh validation attempt.', why: 'Equal review time wastes effort on topics already mastered.', problem: 'Focused correction raises readiness without confusing familiarity with improvement.',
    mentalModel: 'Use the test report as a map and repair the two broken bridges instead of repaving every road.', kid: 'Practice the two songs you missed, not the eight songs you already play well.',
    concepts: [
      { name: 'Prioritize', explanation: 'Start with high-weight domains and repeated boundary errors.', ticketforge: 'Fix service decisions that would also create architecture risk.' },
      { name: 'New scenario', explanation: 'Test the rule with different wording and requirements.', ticketforge: 'Apply CloudTrail versus CloudWatch to a new incident.' },
      { name: 'Fresh assessment', explanation: 'Validate with unseen questions.', ticketforge: 'Avoid inflated scores caused by memorizing a question bank.' },
    ],
    task: 'Create and execute a one-day remediation plan.', steps: ['Select the top two error patterns.', 'Write the corrected boundary and a TicketForge example.', 'Take a fresh assessment and compare results.'], proof: 'Reach at least 80% on fresh questions and explain the previously confused service pairs.',
    question: 'Which result best demonstrates improvement?', options: ['A higher score on fresh scenarios', 'Remembering the previous answer order', 'Reading every chapter again without testing'], correct: 'a', answer: 'Fresh scenarios test the corrected mental model rather than memory of prior questions.',
  },
  {
    day: 21, title: 'Make the exam decision', domain: 'Assessment', technology: 'Certification readiness review',
    intro: 'Use your recorded results to make a clear go or no-go decision.', scenario: 'You want to schedule CLF-C02. TicketForge shows completed lessons, but you must also evaluate practice scores, weak areas, lab understanding, and your ability to explain service choices.',
    definition: 'A readiness review compares current evidence with explicit criteria and records the reason for scheduling or delaying the exam.', why: 'Completing a calendar does not prove mastery.', problem: 'A defined decision prevents optimism, anxiety, or checklist completion from replacing evidence.',
    mentalModel: 'A pilot checks instruments, weather, fuel, and skill before takeoff; finishing the training calendar alone is not clearance.', kid: 'Before the big game, check that you know the rules, practiced under the clock, fixed mistakes, and can explain the plays.',
    concepts: [
      { name: 'Coverage', explanation: 'Every official domain has been studied and tested.', ticketforge: 'No architecture area is completely unknown.' },
      { name: 'Consistency', explanation: 'Multiple fresh assessments meet the target.', ticketforge: 'One lucky score is not the whole decision.' },
      { name: 'Explanation', explanation: 'You can defend choices without answer cues.', ticketforge: 'Explain why each AWS service fits a requirement.' },
    ],
    task: 'Complete the CLF-C02 readiness review.', steps: ['Confirm all domains and required labs are complete.', 'Review fresh timed scores and unresolved weak areas.', 'Record GO or NO-GO with the next action and date.'], proof: 'State the decision in one paragraph using completion, score, and explanation evidence.',
    question: 'You completed every lesson but score 68% on fresh timed exams. What is the best decision?', options: ['NO-GO: remediate weak domains and reassess', 'GO because completion alone is enough', 'Schedule without reviewing mistakes'], correct: 'a', answer: 'Lesson completion is necessary but does not replace demonstrated performance and corrected weak areas.',
  },
];

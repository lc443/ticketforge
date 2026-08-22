import { Component, computed, input, signal } from '@angular/core';

type OptionId = 'a' | 'b' | 'c';

const KID_EXPLANATIONS: Record<string, string> = {
  'Requirements and architecture decisions': 'Before building a treehouse, everyone agrees how many kids it must hold, how high it can be, and that it must be safe. Then you draw the plan and write down why you chose stairs instead of a ladder.',
  'Modular monolith': 'Imagine one school building with separate classrooms. Math, art, and music each have their own room and supplies, but everyone can still walk through the same building without taking a bus across town.',
  'Authentication, JWT, and authorization': 'At a school dance, you show your ID so the teacher knows who you are. Then your wristband says which rooms you may enter. Knowing your name does not mean you are allowed everywhere.',
  'Load testing with k6': 'Before opening a water slide, you test it with a big pretend crowd. You watch whether the line moves, whether anyone gets stuck, and whether the slide stays safe when lots of people arrive.',
  'Horizontal scaling and load balancing': 'If one lemonade stand has a huge line, you open two more stands. A helper points each customer to an open stand, and if one closes, the other stands keep serving lemonade.',
  'Redis caching': 'Instead of walking to the library every time someone asks the same question, you keep the answer on a nearby whiteboard. When the library book changes, you must erase or fix the whiteboard too.',
  'Distributed rate limiting': 'A ride has a jar of tickets. Every rider uses one ticket, and new tickets appear slowly. When the jar is empty, people wait so too many riders do not break the ride.',
  'Database transactions and concurrency control': 'Two kids reach for the last cookie. If both only look and see it, they may both promise it to themselves. A rule lets one kid hold the cookie while deciding, so the other sees the real answer afterward.',
  'Distributed locking': 'Several classrooms share one special key. The key desk gives it to only one teacher at a time. Everyone must use the same desk, because a pretend key in one classroom cannot stop another teacher.',
  'Apache Kafka event streaming': 'Think of a strong conveyor belt carrying numbered notes. Different teams read the notes at their own speed and remember where they stopped. If someone falls behind, the notes are still there to read later.',
  'Docker, Compose, and NGINX': 'Docker packs the app and everything it needs into a labelled lunchbox. Compose arranges all the lunchboxes on one table, and NGINX is the helper who sends each request to the right box.',
  'REST resource lifecycle and API evolution': 'An event is like a library book record. You cannot simply erase it after someone borrowed the book. You mark what happened, keep the history, and make sure old library cards still work.',
  'CI/CD and software supply-chain controls': 'Every code change travels through a robot obstacle course. The robots check that it works, is safe, and came from the right place before sealing it in a box that may go to production.',
  'Kubernetes orchestration': 'You tell a robot caretaker that three app helpers must always be working. If one helper disappears, the caretaker notices and starts another until there are three again.',
  'Production Kubernetes lifecycle controls': 'Before replacing a playground helper, you make sure another helper is ready, let the first finish helping the current child, and keep the important sign-up notebook somewhere it will not disappear.',
  'Kubernetes Services, Gateway API, and NetworkPolicy': 'Pods are kids who keep changing seats. A Service is the classroom name you can always call, the Gateway is the front door, routes are hallway signs, and NetworkPolicy says which doors each badge can open.',
  'Horizontal Pod Autoscaler': 'A store opens more checkout lanes when lines grow and closes them slowly when the store becomes quiet. It also has a rule saying the smallest and largest number of lanes allowed.',
  'Helm': 'A chart is one LEGO instruction book, while values choose colors and how many pieces to use for each model. You reuse the instructions instead of drawing a new book for every room.',
  'Terraform infrastructure as code': 'You give a builder a blueprint and a list of what is already built. The builder checks the real site, tells you exactly what it wants to add or remove, and waits for approval before changing anything.',
  'Terraform state and remote backends': 'The blueprint calls a room “Kitchen,” but the builder needs a registry that says which real room that name means. The registry office lets only one builder change the book at a time and keeps old pages in case someone writes the wrong thing.',
};

@Component({
  selector: 'app-technology-brief',
  standalone: true,
  templateUrl: './technology-brief.html',
  styleUrl: './technology-brief.scss',
})
export class TechnologyBrief {
  readonly technology = input.required<string>();
  readonly scenario = input.required<string>();
  readonly definition = input.required<string>();
  readonly why = input.required<string>();
  readonly problem = input.required<string>();
  readonly mentalModel = input.required<string>();
  readonly kidExplanation = computed(() => KID_EXPLANATIONS[this.technology()] ?? 'Start with a real problem, choose one helper for that problem, and check that the helper behaves the way you expected.');
  readonly question = input.required<string>();
  readonly optionA = input.required<string>();
  readonly optionB = input.required<string>();
  readonly optionC = input.required<string>();
  readonly correctOption = input.required<OptionId>();
  readonly explanation = input.required<string>();
  readonly selected = signal<OptionId | null>(null);

  choose(option: OptionId): void { this.selected.set(option); }
  isCorrect(): boolean { return this.selected() === this.correctOption(); }
}

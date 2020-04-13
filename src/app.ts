// validation
interface Validatable {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

function validate(validatableInput: Validatable) {
	let isValid = true;
	if (validatableInput.required) {
		isValid = isValid && validatableInput.value.toString().trim().length !== 0;
	}

	if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
		isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
	}

	if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
		isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
	}

	if (validatableInput.min != null && typeof validatableInput.value === 'number') {
		isValid = isValid && validatableInput.value >= validatableInput.min;
	}

	if (validatableInput.max != null && typeof validatableInput.value === 'number') {
		isValid = isValid && validatableInput.value <= validatableInput.max;
	}

	return isValid;
}

// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
	const originMethod = descriptor.value;
	const adjDescriptor: PropertyDescriptor = {
		configurable: true,
		get() {
			const bounFn = originMethod.bind(this);
			return bounFn;
		}
	};
	return adjDescriptor;
}

class ProjectState {
	private listners: any[] = [];
	private projects: any[] = [];
	private static instance: ProjectState;

	private constructor() {}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addListners(listnerFn: Function) {
		this.listners.push(listnerFn);
	}

	addProject(title: string, description: string, people: number) {
		const project = {
			id: Math.random.toString(),
			title,
			description,
			people
		};
		this.projects.push(project);
		for (const listnerFn of this.listners) {
			listnerFn(this.projects.slice());
		}
	}
}

const projectState = ProjectState.getInstance();

class ProjectList {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	sectionElement: HTMLElement;
	assignedProjects: any[];

	constructor(private type: 'active' | 'finished') {
		this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
		this.hostElement = document.getElementById('app')! as HTMLDivElement;

		const importedNode = document.importNode(this.templateElement.content, true);
		this.sectionElement = importedNode.firstElementChild as HTMLElement;
		this.sectionElement.id = `${this.type}-projects`;
		this.assignedProjects = [];

		projectState.addListners((projects: any[]) => {
			this.assignedProjects = projects;
			this.rednerProjects();
		});

		this.attach();
		this.renderContent();
	}

	private rednerProjects() {
		const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
		for (const projectItems of this.assignedProjects) {
			const listItem = document.createElement('li');
			listItem.textContent = projectItems.title;
			listEl.appendChild(listItem);
		}
	}

	private renderContent() {
		const listId = `${this.type}-projects-list`;
		this.sectionElement.querySelector('ul')!.id = listId;
		this.sectionElement.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
	}

	private attach() {
		this.hostElement.insertAdjacentElement('beforeend', this.sectionElement);
	}
}

class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	formElement: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
		this.hostElement = document.getElementById('app')! as HTMLDivElement;

		const importedNode = document.importNode(this.templateElement.content, true);
		this.formElement = importedNode.firstElementChild as HTMLFormElement;
		this.formElement.id = 'user-input';

		this.titleInputElement = this.formElement.querySelector('#title') as HTMLInputElement;
		this.descriptionInputElement = this.formElement.querySelector('#description') as HTMLInputElement;
		this.peopleInputElement = this.formElement.querySelector('#people') as HTMLInputElement;

		this.configure();

		this.attach();
	}

	private gatherUserInput(): [string, string, number] | void {
		const enteredTitle = this.titleInputElement.value;
		const enteredDescription = this.descriptionInputElement.value;
		const enteredPeople = this.peopleInputElement.value;

		const titleValidatable: Validatable = { value: enteredTitle, required: true };
		const descriptionValidatable: Validatable = {
			value: enteredDescription,
			required: true,
			minLength: 5
		};
		const peopleValidatable: Validatable = { value: +enteredPeople, required: true, min: 1, max: 5 };

		if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
			alert('Invalid input, please try again!');
			return;
		} else {
			return [ enteredTitle, enteredDescription, +enteredPeople ];
		}
	}

	@autobind
	private submitHandler(event: Event) {
		event.preventDefault();
		const userInput = this.gatherUserInput();

		if (Array.isArray(userInput)) {
			const [ title, desc, people ] = userInput;
			projectState.addProject(title, desc, people);
			this.clearInputs();
		}
	}

	private clearInputs() {
		this.titleInputElement.value = '';
		this.descriptionInputElement.value = '';
		this.peopleInputElement.value = '';
	}

	private configure() {
		this.formElement.addEventListener('submit', this.submitHandler);
	}

	private attach() {
		this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
	}
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');

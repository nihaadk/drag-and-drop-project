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

	@autobind
	private submitHandler(event: Event) {
		event.preventDefault();
		console.log(this.titleInputElement.value);
	}

	private configure() {
		this.formElement.addEventListener('submit', this.submitHandler);
	}

	private attach() {
		this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
	}
}

const prjInput = new ProjectInput();

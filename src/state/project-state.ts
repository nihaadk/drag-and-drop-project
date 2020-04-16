import { Project } from "../model/project";

export enum ProjectStatus {
	Active,
	Finished
}



type Listner<T> = (items: T[]) => void;

class State<T> {
	protected listners: Listner<T>[] = [];

	addListners(listnerFn: Listner<T>) {
		this.listners.push(listnerFn);
	}
}

export class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addProject(title: string, description: string, people: number) {
		const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
		this.projects.push(newProject);
		this.updateListners();
	}

	moveProject(projectId: string, newStatus: ProjectStatus) {
		const resultProject = this.projects.find((prj) => prj.id === projectId);
		if (resultProject && resultProject.status !== newStatus) {
			resultProject.status = newStatus;
			this.updateListners();
		}
	}

	private updateListners() {
		for (const listnerFn of this.listners) {
			listnerFn(this.projects.slice());
		}
	}
}

export const projectState = ProjectState.getInstance();
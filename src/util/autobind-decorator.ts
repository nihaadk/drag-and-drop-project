export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
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
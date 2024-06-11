export function setupRunningField() {
	Array.from(document.querySelectorAll("[data-running-field]")).forEach(
	  (field) => {
		(field as HTMLElement).style.width = `${Array.from(field.children).reduce(
		  (result, child) => (result += (child as HTMLElement).offsetWidth),
		  0,
		)}px`;
  
		const childrenCount = field.children.length;
  
		for (let i = 0; i < childrenCount; i++) {
		  field.insertAdjacentElement(
			"beforeend",
			field.children[i].cloneNode(true) as Element,
		  );
		}
	  },
	);
  }
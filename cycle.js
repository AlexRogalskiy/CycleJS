const {h, h1, span, makeDOMDriver} = CycleDOM;

//Logic (functional)
function main(sources) {
	
	const mouseover$ = sources.DOM.select('span').events('mouseover');
	const sinks = {
		DOM: mouseover$
				.startWith(null)
				.flatMapLatest(() => Rx.Observable.timer(0, 1000)
				.map(i =>
					h1({style: {background: 'red'}}, [
						span([
								`Seconds elapsed ${i}`
							])
						]
					)
				)
			),
		Log: Rx.Observable.timer(0, 2000).map(i => 2*i)
	};
	return sinks;
};

//Effects (imperative)
/*function makeDOMDriver(mountSelector) {

	return function DOMDriver(obj$) {
		
		function createElement(obj) {
			const element = document.createElement(obj.tagName);
			obj.children
				.filter(c => typeof c === 'object')
				.map(createElement)
				.forEach(c => element.appendChild(c));
			obj.children
				.filter(c => typeof c === 'string')
				.forEach(c => element.innerHTML += c);
			return element;
		};
		
		obj$.subscribe(obj => {
			const container = document.querySelector(mountSelector);
			container.innerHTML = '';
			const element = createElement(obj);
			container.appendChild(element);
			//container.textContent = obj;
		});
		const DOMSource = {
			selectEvents: function(tagName, eventType) {
				return Rx.Observable.fromEvent(document, eventType)
							.filter(ev => ev.target.tagName === tagName.toUpperCase());
			}
		};
		return DOMSource;
	};
};*/

function consoleLogDriver(msg$) {
	msg$.subscribe(msg => console.log(msg));
};

/*function run(mainFn, drivers) {
	const proxySources = {};
	Object.keys(drivers).forEach(key => {
		proxySources[key] = new Rx.Subject();
	});
	const sinks = mainFn(proxySources);
	Object.keys(drivers).forEach(key => {
		const source = drivers[key](sinks[key]);
		source != null && source.subscribe(x => proxySources[key].onNext(x));
	});
};*/

const drivers = {
	DOM: makeDOMDriver('#app'),
	Log: consoleLogDriver
};

Cycle.run(main, drivers);
//run(main, drivers);


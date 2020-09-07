class ACFOC {

	DEFAULT_TIMEOUT = 30000;
	DEFAULT_SCORE = 0.1;
	VERSION = 'acfoc-0.0.0'

	constructor(opt = {}) {
		const {
			idleTimeout,
			scores,
			allowCopy,
			allowPaste
		} = opt;
		this.penalties = [];
		this._idleTimeout = idleTimeout || this.DEFAULT_TIMEOUT;
		this._scores = scores;
		this._idleWatcher = null;
		this._allowCopy = allowCopy;
		this._allowPaste = allowPaste;
	}

	initialize = () => {
		console.log(`%c ${'\n'.repeat(100)}`, 'color: orange; font-size: 1rem; font-weight: bold; text-shadow: 1px 1px 0px black, 2px 2px 0px white')
		console.log(`%c This document is protected by ACFOC (Anti-Cheating For Online Classes)`, 'color: orange; font-size: 1rem; font-weight: bold; text-shadow: 1px 1px 0px black, 2px 2px 0px white')


		this._addEventPenalty('load', this._resetIdle)
			._addEventPenalty('mousemove', this._resetIdle)
			._addEventPenalty('mousedown', this._resetIdle)
			._addEventPenalty('touchstart', this._resetIdle)
			._addEventPenalty('click', this._resetIdle)
			._addEventPenalty('keydown', this._resetIdle);

		if(!this._allowCopy) {
			this._addEventPenalty('copy', e => {
				this.addPenalty('COPY', this.getscoreFor('copy'));
				e.preventDefault();
			});
		}

		if(!this._allowPaste) {
			this._addEventPenalty('paste', e => {
				this.addPenalty('PASTE', this.getscoreFor('paste'));
				e.preventDefault();
			});
		}

		this._addEventPenalty('blur', e => {
			this.addPenalty('CHANGE_FOCUS', this.getscoreFor('changeFocus'));
		});

		return this;
	}

	addPenalty = (reason, score = this.DEFAULT_SCORE) => {	
		this.penalties = [...this.penalties, {
			reason,
			score: score || this.DEFAULT_score
		}];
		return this;
	}

	getscoreFor = event => {
		return this._scores[event]
	}

	_resetIdle = () => {
		clearTimeout(this._idleWatcher);
		this._idleWatcher = setTimeout(() => this.addPenalty('IDLE', this.getscoreFor('idle')), this._idleTimeout);
		return this;
	}

	_addEventPenalty(evt, cb) {
		window.addEventListener(evt, cb);
		return this;
	}

}

const acfoc = new ACFOC({
	scores: {
		
	},
	allowCopy: true
});
acfoc.initialize();
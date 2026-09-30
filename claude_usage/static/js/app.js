//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = Array.isArray, u = Array.prototype.indexOf, d = Array.prototype.includes, f = Array.from, p = Object.defineProperty, m = Object.getOwnPropertyDescriptor, h = Object.getOwnPropertyDescriptors, g = Object.prototype, _ = Array.prototype, v = Object.getPrototypeOf, y = Object.isExtensible, b = () => {};
function x(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function S() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/constants.js
var ee = 1 << 24, C = 1024, w = 2048, te = 4096, ne = 8192, re = 16384, ie = 32768, T = 1 << 25, ae = 65536, E = 1 << 19, oe = 1 << 20, D = 1 << 25, se = 1 << 21, ce = 1 << 22, le = 1 << 23, ue = Symbol("$state"), de = Symbol("component"), fe = Symbol("legacy props"), pe = Symbol(""), me = Symbol("attributes"), he = Symbol("class"), ge = Symbol("style"), _e = Symbol("text"), ve = Symbol("form reset"), ye = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), be = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), xe = {}, O = Symbol("uninitialized"), Se = "http://www.w3.org/1999/xhtml", Ce = "http://www.w3.org/2000/svg", we = "http://www.w3.org/1998/Math/MathML";
function Te() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ee(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function De() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Oe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var k = !1;
function ke(e) {
	k = e;
}
var Ae;
function je(e) {
	if (e === null) throw Ee(), xe;
	return Ae = e;
}
function Me() {
	return je(/* @__PURE__ */ xn(Ae));
}
function A(e) {
	if (k) {
		if (/* @__PURE__ */ xn(Ae) !== null) throw Ee(), xe;
		Ae = e;
	}
}
function Ne(e = 1) {
	if (k) {
		for (var t = e, n = Ae; t--;) n = /* @__PURE__ */ xn(n);
		Ae = n;
	}
}
function Pe(e = !0) {
	for (var t = 0, n = Ae;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ xn(n);
		e && n.remove(), n = i;
	}
}
function Fe(e) {
	if (!e || e.nodeType !== 8) throw Ee(), xe;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ie(e) {
	return e === this.v;
}
function Le(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Re(e) {
	return !Le(e, this.v);
}
function ze(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Be() {
	throw Error("https://svelte.dev/e/missing_context");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Ve() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function He(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Ue(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function We() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ge(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Ke() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function qe(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Je() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ye() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Xe() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ze() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/shared/context.js
function Qe(e, t, n) {
	let r = {};
	return [
		() => (n(r) || Be(), e(r)),
		(e) => t(r, e),
		() => n(r)
	];
}
function $e(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function et(e, t) {
	return e === null && ze(t), e.c ??= new Map($e(e) || void 0);
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var tt = null;
function nt(e) {
	tt = e;
}
function rt() {
	return Qe(it, at, ot);
}
function it(e) {
	return et(tt, "getContext").get(e);
}
function at(e, t) {
	return et(tt, "setContext").set(e, t), t;
}
function ot(e) {
	return et(tt, "hasContext").has(e);
}
function j(e, t = !1, n) {
	tt = {
		p: tt,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: lr,
		l: null
	};
}
function M(e) {
	var t = tt, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Ln(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, tt = t.p, st(e);
}
function st(e = {}) {
	return p(e, de, { value: !0 }), e;
}
function ct() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var lt = [];
function ut() {
	var e = lt;
	lt = [], x(e);
}
function dt(e) {
	if (lt.length === 0 && !Rt) {
		var t = lt;
		queueMicrotask(() => {
			t === lt && ut();
		});
	}
	lt.push(e);
}
function ft() {
	for (; lt.length > 0;) ut();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var pt = ~(w | te | C);
function mt(e, t) {
	e.f = e.f & pt | t;
}
function ht(e) {
	e.f & 512 || e.deps === null ? mt(e, C) : mt(e, te);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function gt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), mt(e, C);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
var _t = !1;
function vt() {
	_t || (_t = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ve]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function yt(e) {
	var t = or, n = lr;
	cr(null), ur(null);
	try {
		return e();
	} finally {
		cr(t), ur(n);
	}
}
function bt(e, t, n, r = n) {
	e.addEventListener(t, () => yt(n));
	let i = e[ve];
	e[ve] = i ? () => {
		i(), r(!0);
	} : () => r(!0), vt();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function xt(e, t, n, r) {
	let i = ct() ? Tt : Ot;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = lr, c = St(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				An(e, s);
			}
			Ct();
		}
	}
	var d = wt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Dt(e))).then(u).catch((e) => An(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), Ct();
	}) : f();
}
function St() {
	var e = lr, t = or, n = tt, r = P;
	return function(i = !0) {
		ur(e), cr(t), nt(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function Ct(e = !0) {
	ur(null), cr(null), nt(null), e && P?.deactivate();
}
function wt() {
	var e = lr, t = e.b, n = P, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Tt(e) {
	var t = 2 | w;
	return lr !== null && (lr.f |= E), {
		ctx: tt,
		deps: null,
		effects: null,
		equals: Ie,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: O,
		wv: 0,
		parent: lr,
		ac: null
	};
}
var Et = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Dt(e, t, n) {
	let r = lr;
	r === null && Ve();
	var i = void 0, a = tn(O), o = !or, s = /* @__PURE__ */ new Set();
	return Bn(() => {
		var t = lr, n = S();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ye && n.reject(e);
			}).finally(Ct);
		} catch (e) {
			n.reject(e), Ct();
		}
		var c = P;
		if (o) {
			if (t.f & 32768) var l = wt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(Et);
			else for (let e of s.values()) e.reject(Et);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== Et && (c.activate(), t ? (a.f |= le, on(a, t)) : (a.f & 8388608 && (a.f ^= le), on(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Fn(() => {
		for (let e of s) e.reject(Et);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function N(e) {
	let t = /* @__PURE__ */ Tt(e);
	return fr(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Ot(e) {
	let t = /* @__PURE__ */ Tt(e);
	return t.equals = Re, t;
}
function kt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Jn(t[n]);
	}
}
function At(e) {
	var t, n = lr, r = e.parent;
	if (!ir && r !== null && e.v !== O && r.f & 24576) return Te(), e.v;
	ur(r);
	try {
		kt(e), t = wr(e);
	} finally {
		ur(n);
	}
	return t;
}
function jt(e) {
	var t = At(e);
	if (!e.equals(t) && (e.wv = xr(), (!P?.is_fork || e.deps === null) && (P === null ? e.v = t : (P.capture(e, t, !0), Ft?.capture(e, t, !0)), e.deps === null))) {
		mt(e, C);
		return;
	}
	ir || (It === null ? ht(e) : (Pn() || P?.is_fork) && It.set(e, t));
}
function Mt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && yt(() => {
		t.ac.abort(ye), t.ac = null;
	}), t.fn !== null && (t.teardown = b), Dr(t, 0), Kn(t));
}
function Nt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Or(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Pt = null, P = null, Ft = null, It = null, Lt = null, Rt = !1, zt = !1, Bt = null, Vt = null, Ht = 0, Ut = 1, Wt = class e {
	id = Ut++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		Pt === null ? Pt = this : (Pt.#n = this, this.#t = Pt), Pt = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) mt(r, w), t(r);
			for (r of n.m) mt(r, te), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		var e = [];
		for (let i of this.#c) if (!(i.f & 16384 || !(i.f & 6144))) {
			for (var t = i, n = !1; t.parent !== null;) {
				t = t.parent;
				var r = t.f;
				if (r & 96) {
					if (!(r & 1024)) {
						n = !0;
						break;
					}
					t.f ^= C;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), mt(e, w), this.schedule(e);
		for (let e of this.#d) mt(e, te), this.schedule(e);
		this.apply();
		for (var t = Bt = [], n = [], r = Vt = []; this.#c.length > 0;) {
			Ht++ > 1e3 && (this.#S(), Kt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Zt(e), this.#h() || this.discard(), t;
			}
		}
		if (P = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Bt = null, Vt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Xt(e, t);
			r.length > 0 && P.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Ft = this, Jt(n), Jt(t), Ft = null, this.#s?.resolve();
		var o = P;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && ($t.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= C;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= C : i & 4 ? t.push(r) : Sr(r) && (i & 16 && this.#d.add(r), Or(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#y() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#b(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), mt(i, w), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), P = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) gt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== O && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), It?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		P = this;
	}
	deactivate() {
		P = null, It = null;
	}
	flush() {
		try {
			zt = !0, P = this, this.#_();
		} finally {
			Ht = 0, Lt = null, Bt = null, Vt = null, zt = !1, P = null, It = null, $t.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Et);
		this.#S(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, dt(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= S()).promise;
	}
	static ensure() {
		if (P === null) {
			let t = P = new e();
			!zt && !Rt && dt(() => {
				t.#e || t.flush();
			});
		}
		return P;
	}
	apply() {
		It = null;
	}
	schedule(e) {
		if (Lt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Pt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Gt(e) {
	var t = Rt;
	Rt = !0;
	try {
		var n;
		for (e && (P !== null && !P.is_fork && P.flush(), n = e());;) {
			if (ft(), P === null) return n;
			P.flush();
		}
	} finally {
		Rt = t;
	}
}
function Kt() {
	try {
		Ke();
	} catch (e) {
		An(e, Lt);
	}
}
var qt = null;
function Jt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Sr(r) && (qt = /* @__PURE__ */ new Set(), Or(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Xn(r), qt?.size > 0)) {
				$t.clear();
				for (let e of qt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) qt.has(n) && (qt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Or(n);
					}
				}
				qt.clear();
			}
		}
		qt = null;
	}
}
function Yt(e) {
	P.schedule(e);
}
function Xt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), mt(e, C);
		for (var n = e.first; n !== null;) Xt(n, t), n = n.next;
	}
}
function Zt(e) {
	mt(e, C);
	for (var t = e.first; t !== null;) Zt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Qt = /* @__PURE__ */ new Set(), $t = /* @__PURE__ */ new Map(), en = !1;
function tn(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ie,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function F(e, t) {
	let n = tn(e, t);
	return fr(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function nn(e, t = !1, n = !0) {
	let r = tn(e);
	return t || (r.equals = Re), r;
}
function I(e, t, n = !1) {
	return or !== null && (!sr || or.f & 131072) && ct() && or.f & 4325394 && (dr === null || !dr.has(e)) && Xe(), on(e, n ? un(t) : t, Vt);
}
var rn = null, an = 0;
function on(e, t, n = null) {
	if (!e.equals(t)) {
		ir ? $t.set(e, t) : $t.has(e) || $t.set(e, e.v);
		var r = Wt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && At(t), It === null && ht(t);
		}
		e.wv = xr(), rn = null, an = 0, ln(e, w, n), rn = null, ct() && lr !== null && lr.f & 1024 && !(lr.f & 96) && (hr === null ? gr([e]) : hr.push(e)), !r.is_fork && Qt.size > 0 && !en && sn();
	}
	return t;
}
function sn() {
	en = !1;
	for (let e of Qt) {
		e.f & 1024 && mt(e, te);
		let t;
		try {
			t = Sr(e);
		} catch {
			t = !0;
		}
		t && Or(e);
	}
	Qt.clear();
}
function cn(e) {
	I(e, e.v + 1);
}
function ln(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = ct(), a = r.length;
		if (an += a, an > 1e5 && rn === null && (rn = /* @__PURE__ */ new Set()), rn !== null) {
			if (rn.has(e)) return;
			rn.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== lr) {
				var l = (c & w) === 0;
				if (l && mt(s, t), c & 131072) Qt.add(s);
				else if (c & 2) {
					var u = s;
					It?.delete(u), ln(u, te, n);
				} else if (l) {
					var d = s;
					c & 16 && qt !== null && qt.add(d), n === null ? Yt(d) : n.push(d);
				}
			}
		}
	}
}
function un(e) {
	if (typeof e != "object" || !e || ue in e || de in e) return e;
	let t = v(e);
	if (t !== g && t !== _) return e;
	var n = /* @__PURE__ */ new Map(), r = l(e), i = /* @__PURE__ */ F(0), a = null, o = yr, s = (e) => {
		if (yr === o) return e();
		var t = or, n = yr;
		cr(null), br(o);
		var r = e();
		return cr(t), br(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ F(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && Je();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ F(r.value, a);
				return n.set(t, e), e;
			}) : I(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ F(O, a));
					n.set(t, e), cn(i);
				}
			} else I(r, O), cn(i);
			return !0;
		},
		get(t, r, i) {
			if (r === ue) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || m(t, r)?.writable) && (o = s(() => /* @__PURE__ */ F(un(c ? t[r] : O), a)), n.set(r, o)), o !== void 0) {
				var l = H(o);
				return l === O ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var r = Reflect.getOwnPropertyDescriptor(e, t), i = n.get(t);
			if (i !== void 0) {
				var a = H(i);
				if (a === O) return;
				if (r && "value" in r) r.value = a;
				else return {
					enumerable: !0,
					configurable: !0,
					value: a,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === ue) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== O || Reflect.has(e, t);
			return (r !== void 0 || lr !== null && (!i || m(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ F(i ? un(e[t]) : O, a)), n.set(t, r)), H(r) === O) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ F(O, a)), n.set(d + "", f)) : I(f, O);
			}
			if (l === void 0) (!u || m(e, t)?.writable) && (l = s(() => /* @__PURE__ */ F(void 0, a)), I(l, un(o)), n.set(t, l));
			else {
				u = l.v !== O;
				var p = s(() => un(o));
				I(l, p);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var g = n.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && I(g, _ + 1);
				}
				cn(i);
			}
			return !0;
		},
		ownKeys(e) {
			H(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== O;
			});
			for (var [r, a] of n) a.v !== O && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			Ye();
		}
	});
}
function dn(e) {
	try {
		if (typeof e == "object" && e && ue in e) return e[ue];
	} catch {}
	return e;
}
function fn(e, t) {
	return Object.is(dn(e), dn(t));
}
var pn, mn, hn, gn, _n;
function vn() {
	if (pn === void 0) {
		pn = window, mn = document, hn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		gn = m(t, "firstChild").get, _n = m(t, "nextSibling").get, y(e) && (e[he] = void 0, e[me] = null, e[ge] = void 0, e.__e = void 0), y(n) && (n[_e] = void 0);
	}
}
function yn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function bn(e) {
	return gn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function xn(e) {
	return _n.call(e);
}
function L(e, t) {
	if (!k) return /* @__PURE__ */ bn(e);
	var n = /* @__PURE__ */ bn(Ae);
	if (n === null) n = Ae.appendChild(yn());
	else if (t && n.nodeType !== 3) {
		var r = yn();
		return n?.before(r), je(r), r;
	}
	return t && On(n), je(n), n;
}
function R(e, t = !1) {
	if (!k) {
		var n = /* @__PURE__ */ bn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ xn(n) : n;
	}
	if (t) {
		if (Ae?.nodeType !== 3) {
			var r = yn();
			return Ae?.before(r), je(r), r;
		}
		On(Ae);
	}
	return Ae;
}
function z(e, t = !1) {
	if (!k) return /* @__PURE__ */ bn(e);
	var n = L(e, t);
	return A(e), n;
}
function B(e, t = 1, n = !1) {
	let r = k ? Ae : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ xn(r);
	if (!k) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = yn();
			return r === null ? i?.after(a) : r.before(a), je(a), a;
		}
		On(r);
	}
	return je(r), r;
}
function Sn(e) {
	e.textContent = "";
}
function Cn() {
	return !1;
}
function wn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Tn() {
	return document.createDocumentFragment();
}
function En(e = "") {
	return document.createComment(e);
}
function Dn(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function On(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function kn(e) {
	var t = lr;
	if (t === null) return or.f |= le, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	An(e, t);
}
function An(e, t) {
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128 && !(t.f & 33570816)) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function jn(e) {
	lr === null && (or === null && Ge(e), We()), ir && Ue(e);
}
function Mn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Nn(e, t) {
	var n = lr;
	n !== null && n.f & 8192 && (e |= ne);
	var r = {
		ctx: tt,
		deps: null,
		nodes: null,
		f: e | w | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	P?.register_created_effect(r);
	var i = r;
	if (e & 4) Bt === null ? Wt.ensure().schedule(r) : Bt.push(r);
	else if (t !== null) {
		try {
			Or(r);
		} catch (e) {
			throw Jn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ae));
	}
	if (i !== null && (i.parent = n, n !== null && Mn(i, n), or !== null && or.f & 2 && !(e & 64))) {
		var a = or;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Pn() {
	return or !== null && !sr;
}
function Fn(e) {
	let t = Nn(8, null);
	return mt(t, C), t.teardown = e, t;
}
function In(e) {
	jn("$effect");
	var t = lr.f;
	if (!or && t & 32 && tt !== null && !tt.i) {
		var n = tt;
		(n.e ??= []).push(e);
	} else return Ln(e);
}
function Ln(e) {
	return Nn(4 | oe, e);
}
function Rn(e) {
	Wt.ensure();
	let t = Nn(64 | E, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Zn(t, () => {
			Jn(t), n(void 0);
		}) : (Jn(t), n(void 0));
	});
}
function zn(e) {
	return Nn(4, e);
}
function Bn(e) {
	return Nn(ce | E, e);
}
function Vn(e, t = 0) {
	return Nn(8 | t, e);
}
function V(e, t = [], n = [], r = []) {
	xt(r, t, n, (t) => {
		Nn(8, () => {
			e(...t.map(H));
		});
	});
}
function Hn(e, t = 0) {
	return Nn(16 | t, e);
}
function Un(e, t = 0) {
	return Nn(ee | t, e);
}
function Wn(e) {
	return Nn(32 | E, e);
}
function Gn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = ir, r = or;
		ar(!0), cr(null);
		try {
			t.call(null);
		} catch (t) {
			An(t, e.parent);
		} finally {
			ar(n), cr(r);
		}
	}
}
function Kn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && yt(() => {
			e.abort(ye);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Jn(n, t), n = r;
	}
}
function qn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Jn(t), t = n;
	}
}
function Jn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Yn(e.nodes.start, e.nodes.end), n = !0), e.f |= T, Kn(e, t && !n), Dr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Gn(e), e.f ^= T, e.f |= re;
	var i = e.parent;
	i !== null && i.first !== null && Xn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Yn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ xn(e);
		e.remove(), e = n;
	}
}
function Xn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Zn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Qn(e, r, !0);
	var i = () => {
		n && Jn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Qn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ne;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Qn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function $n(e) {
	e.f &= -257, er(e, !0);
}
function er(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ne, e.f & 1024 || (mt(e, w), Wt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			er(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function tr(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ xn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var nr = null, rr = !1, ir = !1;
function ar(e) {
	ir = e;
}
var or = null, sr = !1;
function cr(e) {
	or = e;
}
var lr = null;
function ur(e) {
	lr = e;
}
var dr = null;
function fr(e) {
	or !== null && (or.f & 2097152 || or.f & 2) && (dr ??= /* @__PURE__ */ new Set()).add(e);
}
var pr = null, mr = 0, hr = null;
function gr(e) {
	hr = e;
}
var _r = 1, vr = 0, yr = vr;
function br(e) {
	yr = e;
}
function xr() {
	return ++_r;
}
function Sr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Sr(a) && jt(a), a.wv > e.wv) return !0;
		}
		t & 512 && It === null && mt(e, C);
	}
	return !1;
}
function Cr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(dr !== null && dr.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Cr(a, t, !1) : t === a && (n ? mt(a, w) : a.f & 1024 && mt(a, te), Yt(a));
	}
}
function wr(e) {
	var t = pr, n = mr, r = hr, i = or, a = dr, o = tt, s = sr, c = yr, l = e.f;
	pr = null, mr = 0, hr = null, or = l & 96 ? null : e, dr = null, nt(e.ctx), sr = !1, yr = ++vr, e.ac !== null && (yt(() => {
		e.ac.abort(ye);
	}), e.ac = null);
	try {
		e.f |= se;
		var u = e.fn, d = u();
		e.f |= ie;
		var f = Tr(e);
		if (ct() && hr !== null && !sr && f !== null && !(e.f & 6146)) for (var p = 0; p < hr.length; p++) Cr(hr[p], e);
		if (i !== null && i !== e) {
			if (vr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = vr;
			if (t !== null) for (let e of t) e.rv = vr;
			hr !== null && (r === null ? r = hr : r.push(...hr));
		}
		return e.f & 8388608 && (e.f ^= le), d;
	} catch (t) {
		return Tr(e), kn(t);
	} finally {
		e.f ^= se, pr = t, mr = n, hr = r, or = i, dr = a, nt(o), sr = s, yr = c;
	}
}
function Tr(e) {
	var t = e.deps, n = P?.is_fork;
	if (pr !== null) {
		var r;
		if (n || Dr(e, mr), t !== null && mr > 0) for (t.length = mr + pr.length, r = 0; r < pr.length; r++) t[mr + r] = pr[r];
		else e.deps = t = pr;
		if (Pn() && e.f & 512) for (r = mr; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && mr < t.length && (Dr(e, mr), t.length = mr);
	return t;
}
function Er(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = u.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (pr === null || !d.call(pr, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512), a.v !== O && ht(a), a.ac !== null && yt(() => {
			a.ac.abort(ye), a.ac = null, mt(a, w);
		}), Mt(a), Dr(a, 0);
	}
}
function Dr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Er(e, n[r]);
}
function Or(e) {
	var t = e.f;
	if (!(t & 16384)) {
		mt(e, C);
		var n = lr, r = rr;
		lr = e, rr = !(t & 96);
		try {
			t & 16777232 ? qn(e) : Kn(e), Gn(e);
			var i = wr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = _r;
		} finally {
			rr = r, lr = n;
		}
	}
}
async function kr() {
	await Promise.resolve(), Gt();
}
function H(e) {
	var t = !!(e.f & 2);
	if (nr?.add(e), or !== null && !sr && !(lr !== null && lr.f & 16384) && (dr === null || !dr.has(e))) {
		var n = or.deps;
		if (or.f & 2097152) e.rv < vr && (e.rv = vr, pr === null && n !== null && n[mr] === e ? mr++ : pr === null ? pr = [e] : pr.push(e));
		else {
			or.deps ??= [], d.call(or.deps, e) || or.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [or] : d.call(r, or) || r.push(or);
		}
	}
	if (ir && $t.has(e)) return $t.get(e);
	if (t) {
		var i = e;
		if (ir) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || jr(i)) && (a = At(i)), $t.set(i, a), a;
		}
		var o = !(i.f & 512) && !sr && or !== null && (rr || !!(or.f & 512)), s = (i.f & ie) === 0;
		Sr(i) && (o && (i.f |= 512), jt(i)), o && !s && (Nt(i), Ar(i));
	}
	if (It?.has(e)) return It.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Ar(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Nt(t), Ar(t));
}
function jr(e) {
	if (e.v === O) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if ($t.has(t) || t.f & 2 && jr(t)) return !0;
	return !1;
}
function Mr(e) {
	var t = sr;
	try {
		return sr = !0, e();
	} finally {
		sr = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Nr = ["touchstart", "touchmove"];
function Pr(e) {
	return Nr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var Fr = Symbol("events"), Ir = /* @__PURE__ */ new Set(), Lr = /* @__PURE__ */ new Set();
function Rr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Wr.call(t, e), !e.cancelBubble) return yt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, dt(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function zr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Rr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Fn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Br(e, t, n) {
	(t[Fr] ??= {})[e] = n;
}
function Vr(e) {
	for (var t = 0; t < e.length; t++) Ir.add(e[t]);
	for (var n of Lr) n(e);
}
var Hr = null, Ur = !1;
function Wr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Hr = e, Ur || (Ur = !0, setTimeout(() => {
		Ur = !1, Hr = null;
	}));
	var o = 0, s = Hr === e && e[Fr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Fr] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		p(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = or, d = lr;
		cr(null), ur(null);
		try {
			for (var f, m = []; a !== null && a !== t;) {
				try {
					var h = a[Fr]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
				} catch (e) {
					f ? m.push(e) : f = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (f) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw f;
			}
		} finally {
			e[Fr] = t, delete e.currentTarget, cr(u), ur(d);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var Gr = be ? "template" : "TEMPLATE";
function Kr(e, t) {
	var n = lr;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function qr(e, t) {
	var n = Tn();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(yn(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(En(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, o, ...s] = r, c = e === "svg" ? Ce : e === "math" ? we : t;
		var i = wn(e, c, o?.is);
		for (var a in o) Dn(i, a, o[a]);
		s.length > 0 && (i.nodeName === Gr ? i.content : i).append(qr(s, i.nodeName === "foreignObject" ? void 0 : c)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function U(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (k) return Kr(Ae, null), Ae;
		i === void 0 && (i = qr(e, t & 4 ? Ce : t & 8 ? we : void 0), n || (i = /* @__PURE__ */ bn(i)));
		var a = r || hn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ bn(a), s = a.lastChild;
			Kr(o, s);
		} else Kr(a, a);
		return a;
	};
}
function Jr(e = "") {
	if (!k) {
		var t = yn(e + "");
		return Kr(t, t), t;
	}
	var n = Ae;
	return n.nodeType === 3 ? On(n) : (n.before(n = yn()), je(n)), Kr(n, n), n;
}
function W() {
	if (k) return Kr(Ae, null), Ae;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = yn();
	return e.append(t, n), Kr(t, n), e;
}
function G(e, t) {
	if (k) {
		var n = lr;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = Ae), Me();
		return;
	}
	e !== null && e.before(t);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Yr(e) {
	let t = 0, n = tn(0), r;
	return () => {
		Pn() && (H(n), Vn(() => (t === 0 && (r = Mr(() => e(() => cn(n)))), t += 1, () => {
			dt(() => {
				--t, t === 0 && (r?.(), r = void 0, cn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Xr = ae | E;
function Zr(e, t, n, r) {
	new Qr(e, t, n, r);
}
var Qr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = k ? Ae : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = Yr(() => (this.#m = tn(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = lr;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = lr.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Hn(() => {
			if (k) {
				let e = this.#t;
				Me();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Xr), k && (this.#e = Ae);
	}
	#g() {
		try {
			this.#a = Wn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		dt(r), t && (this.#s = Wn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Oe();
				return;
			}
			t = !0, n && Ze(), this.#s !== null && Zn(this.#s, () => {
				this.#s = null;
			}), this.#S(() => {
				this.#b();
			});
		};
		return {
			reset: r,
			invoke_onerror: () => {
				try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					An(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Wn(() => e(this.#e)), dt(() => {
			var e = this.#c = document.createDocumentFragment(), t = yn(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return Wn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						An(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(P);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Zn(this.#o, () => {
				this.#o = null;
			}), this.#x(P));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Wn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				tr(this.#a, e);
				let t = this.#n.pending;
				this.#o = Wn(() => t(this.#e));
			} else this.#x(P);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		gt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = lr, n = or, r = tt;
		ur(this.#i), cr(this.#i), nt(this.#i.ctx);
		try {
			return Wt.ensure(), e();
		} finally {
			ur(t), cr(n), nt(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Zn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, dt(() => {
			this.#d = !1, this.#m && on(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), H(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		P?.is_fork ? (this.#a && P.skip_effect(this.#a), this.#o && P.skip_effect(this.#o), this.#s && P.skip_effect(this.#s), P.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Jn(this.#a), null), this.#o &&= (Jn(this.#o), null), this.#s &&= (Jn(this.#s), null), k && (je(this.#t), Ne(), je(Pe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Wn(() => {
						var r = lr;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return An(e, this.#i.parent), null;
				}
			}));
		};
		dt(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				An(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => An(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function K(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[_e] ??= e.nodeValue) && (e[_e] = n, e.nodeValue = `${n}`);
}
function $r(e, t) {
	return ti(e, t);
}
var ei = /* @__PURE__ */ new Map();
function ti(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	vn();
	var c = void 0, l = Rn(() => {
		var o = n ?? t.appendChild(yn());
		Zr(o, { pending: () => {} }, (t) => {
			j({});
			var n = tt;
			if (a && (n.c = a), i && (r.$$events = i), k && Kr(t, null), c = e(t, r) || st(), k && (lr.nodes.end = Ae, Ae === null || Ae.nodeType !== 8 || Ae.data !== "]")) throw Ee(), xe;
			M();
		}, s);
		var l = /* @__PURE__ */ new Set(), u = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!l.has(r)) {
					l.add(r);
					var i = Pr(r);
					for (let e of [t, document]) {
						var a = ei.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ei.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Wr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return u(f(Ir)), Lr.add(u), () => {
			for (var e of l) for (let n of [t, document]) {
				var r = ei.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Wr), r.delete(e), r.size === 0 && ei.delete(n)) : r.set(e, i);
			}
			Lr.delete(u), o !== n && o.parentNode?.removeChild(o);
		};
	});
	return ni.set(c, l), c;
}
var ni = /* @__PURE__ */ new WeakMap(), ri = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) $n(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && ($n(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Jn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						tr(r, t), t.append(yn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Jn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Zn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Jn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = P, r = Cn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = yn();
				i.append(a), this.#n.set(e, {
					effect: Wn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Wn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else k && (this.anchor = Ae), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function q(e, t, n = !1) {
	var r;
	k && (r = Ae, Me());
	var i = new ri(e), a = n ? ae : 0;
	function o(e, t) {
		if (k) {
			var n = Fe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Pe();
				je(a), i.anchor = a, ke(!1), i.ensure(e, t), ke(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Hn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var ii = Symbol("NaN");
function ai(e, t, n) {
	k && Me();
	var r = new ri(e), i = !ct();
	Hn(() => {
		var e = t();
		e !== e && (e = ii), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function oi(e, t) {
	return t;
}
function si(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Zn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					ci(e, f(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, u = l.parentNode;
			Sn(u), u.append(l), e.items.clear();
		}
		ci(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function ci(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= D, tr(a, document.createDocumentFragment())) : Jn(t[i], n);
	}
}
var li;
function J(e, t, n, r, i, a = null) {
	var o = e, s = /* @__PURE__ */ new Map();
	if (t & 4) {
		var c = e;
		o = k ? je(/* @__PURE__ */ bn(c)) : c.appendChild(yn());
	}
	k && Me();
	var u = null, d = /* @__PURE__ */ Ot(() => {
		var e = n();
		return l(e) ? e : e == null ? [] : f(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = u, di(v, p, o, t, r), u !== null && (p.length === 0 ? u.f & 33554432 ? (u.f ^= D, pi(u, null, o)) : $n(u) : Zn(u, () => {
			u = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Hn(() => {
			p = H(d);
			var e = p.length;
			let c = !1;
			k && Fe(o) === "[!" != (e === 0) && (o = Pe(), je(o), ke(!1), c = !0);
			for (var l = /* @__PURE__ */ new Set(), f = P, v = Cn(), y = 0; y < e; y += 1) {
				k && Ae.nodeType === 8 && Ae.data === "]" && (o = Ae, c = !0, ke(!1));
				var b = p[y], x = r(b, y), S = h ? null : s.get(x);
				S ? (S.v && on(S.v, b), S.i && on(S.i, y), v && f.unskip_effect(S.e)) : (S = fi(s, h ? o : li ??= yn(), b, x, y, i, t, n), h || (S.e.f |= D), s.set(x, S)), l.add(x);
			}
			if (e === 0 && a && !u && (h ? u = Wn(() => a(o)) : (u = Wn(() => a(li ??= yn())), u.f |= D)), e > l.size && He("", "", ""), k && e > 0 && je(Pe()), !h) {
				if (m.set(f, l), v) {
					for (let [e, t] of s) l.has(e) || f.skip_effect(t.e);
					f.oncommit(g), f.ondiscard(_);
				} else g(f);
			}
			c && ke(!0), H(d);
		}),
		flags: t,
		items: s,
		pending: m,
		outrogroups: null,
		fallback: u
	};
	h = !1, k && (o = Ae);
}
function ui(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function di(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = ui(e.effect.first), l, u = null, d, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (d ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && ($n(_), a && (_.nodes?.a?.unfix(), (d ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= D, _ === c) pi(_, null, n);
			else {
				var y = u ? u.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), mi(e, u, _), mi(e, _, y), pi(_, y, n), u = _, p = [], m = [], c = ui(u.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					u = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) pi(p[x], b, n);
					for (x = 0; x < m.length; x += 1) l.delete(m[x]);
					mi(e, S.prev, ee.next), mi(e, u, S), mi(e, ee, b), c = b, u = ee, --v, p = [], m = [];
				} else l.delete(_), pi(_, c, n), mi(e, _.prev, _.next), mi(e, _, u === null ? e.effect.first : u.next), mi(e, u, _), u = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = ui(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), u = _, c = ui(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (ci(e, f(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var C = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || C.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && C.push(c), c = ui(c.next);
		var w = C.length;
		if (w > 0) {
			var te = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < w; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < w; v += 1) C[v].nodes?.a?.fix();
			}
			si(e, C, te);
		}
	}
	a && dt(() => {
		if (d !== void 0) for (_ of d) _.nodes?.a?.apply();
	});
}
function fi(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? tn(n) : /* @__PURE__ */ nn(n, !1, !1) : null, l = o & 2 ? tn(i) : null;
	return {
		v: c,
		i: l,
		e: Wn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function pi(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ xn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function mi(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function hi(e, t, ...n) {
	var r = new ri(e);
	Hn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, ae);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function gi(e, t) {
	var n = void 0, r;
	Un(() => {
		n !== (n = t()) && (r &&= (Jn(r), null), n && (r = Wn(() => {
			zn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function _i(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = _i(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function vi() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = _i(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function yi(e) {
	return typeof e == "object" ? vi(e) : e ?? "";
}
var bi = [..." 	\n\r\f\xA0\v﻿"];
function xi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || bi.includes(r[o - 1])) && (s === r.length || bi.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Si(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Ci(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function wi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Ci)), i && c.push(...Object.keys(i).map(Ci));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Ci(e.substring(l, u).trim());
							if (!c.includes(p)) {
								f !== ";" && d++;
								var m = e.substring(l, d).trim();
								n += " " + m + ";";
							}
						}
						l = d + 1, u = -1;
					}
				}
			}
		}
		return r && (n += Si(r)), i && (n += Si(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Ti(e, t, n, r, i, a) {
	var o = e[he];
	if (k || o !== n || o === void 0) {
		var s = xi(n, r, a);
		(!k || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[he] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function Ei(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Di(e, t, n, r) {
	var i = e[ge];
	if (k || i !== t) {
		var a = wi(t, r);
		(!k || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ge] = t;
	} else r && (Array.isArray(r) ? (Ei(e, n?.[0], r[0]), Ei(e, n?.[1], r[1], "important")) : Ei(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Oi(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function ki(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || l(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var s of e.options) {
			var c = Ni(s);
			Oi(s, r ? i.includes(c) : fn(c, n));
		}
		if (t) {
			if (o !== null) for (s of e.options) {
				var u = o.has(s);
				s.selected !== u && (s.selected = u);
			}
			else e.selectedIndex !== a && (e.selectedIndex = a);
		}
	}
}
function Ai(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!l(t)) return De();
		for (var r of e.options) r.selected = t.includes(Ni(r));
		return;
	}
	for (r of e.options) if (fn(Ni(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function ji(e) {
	var t = new MutationObserver((t) => {
		t.every(Pi) || ("__defaultValue" in e && ki(e, !1), "__value" in e && Ai(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), Fn(() => {
		t.disconnect();
	});
}
function Mi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	bt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), Ni);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && Ni(o);
		}
		n(a), e.__value = a, P !== null && r.add(P);
	}), zn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = P;
			if (r.has(o)) return;
		}
		if (Ai(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = Ni(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function Ni(e) {
	return "__value" in e ? e.__value : e.value;
}
function Pi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Fi = Symbol("is custom element"), Ii = Symbol("is html"), Li = be ? "link" : "LINK", Ri = be ? "progress" : "PROGRESS";
function zi(e) {
	if (k) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Y(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Y(e, "checked", null), e.checked = r;
				}
			}
		};
		e[ve] = n, dt(n), vt();
	}
}
function Bi(e, t) {
	var n = Vi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Ri) && (e.value = t ?? "");
}
function Y(e, t, n, r) {
	var i = Vi(e);
	k && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Li) || i[t] !== (i[t] = n) && (t === "loading" && (e[pe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ui(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Vi(e) {
	return e[me] ??= {
		[Fi]: e.nodeName.includes("-"),
		[Ii]: e.namespaceURI === Se
	};
}
var Hi = /* @__PURE__ */ new Map();
function Ui(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Hi.get(t);
	if (n) return n;
	Hi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = h(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = v(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Wi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	bt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Gi(e) ? Ki(a) : a, n(a), P !== null && r.add(P), await kr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (k && e.defaultValue !== e.value || Mr(t) == null && e.value) && (n(Gi(e) ? Ki(e.value) : e.value), P !== null && r.add(P)), Vn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = P;
			if (r.has(i)) return;
		}
		Gi(e) && n === Ki(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Gi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Ki(e) {
	return e === "" ? null : +e;
}
var qi = /* @__PURE__ */ new class e {
	#e = /* @__PURE__ */ new WeakMap();
	#t;
	#n;
	static entries = /* @__PURE__ */ new WeakMap();
	constructor(e) {
		this.#n = e;
	}
	observe(e, t) {
		var n = this.#e.get(e) || /* @__PURE__ */ new Set();
		return n.add(t), this.#e.set(e, n), this.#r().observe(e, this.#n), () => {
			var n = this.#e.get(e);
			n.delete(t), n.size === 0 && (this.#e.delete(e), this.#t.unobserve(e));
		};
	}
	#r() {
		return this.#t ??= new ResizeObserver((t) => {
			for (var n of t) {
				e.entries.set(n.target, n);
				for (var r of this.#e.get(n.target) || []) r(n);
			}
		});
	}
}({ box: "border-box" });
function Ji(e, t, n) {
	var r = qi.observe(e, () => n(e[t]));
	zn(() => (Mr(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Yi(e, t) {
	return e === t || e?.[ue] === t;
}
function Xi(e = st(), t, n, r) {
	var i = tt.r, a = lr;
	return zn(() => {
		var o, s;
		return Vn(() => {
			o = s, s = r?.() || [], Mr(() => {
				Yi(n(...s), e) || (t(e, ...s), o && Yi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Yi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var Zi = !1;
function Qi(e) {
	var t = Zi;
	try {
		return Zi = !1, [e(), Zi];
	} finally {
		Zi = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $i(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ Tt(r), H(l)) : (c && (c = !1, s = o ? Mr(r) : r), s);
	let d;
	if (a) {
		var f = ue in e || fe in e;
		d = m(e, t)?.set ?? (f && t in e ? (n) => e[t] = n : void 0);
	}
	var p, h = !1;
	a ? [p, h] = Qi(() => e[t]) : p = e[t], p === void 0 && r !== void 0 && (p = u(), d && (i && qe(t), d(p)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? u() : (c = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (s = void 0), n === void 0 ? s : n;
	};
	if (i && !(n & 4)) return g;
	if (d) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && d(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? Tt : Ot)(() => (v = !1, g()));
	a && H(y);
	var b = lr;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && a ? un(e) : e;
			return I(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return ir && v || b.f & 16384 ? y.v : H(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region node_modules/svelte/src/reactivity/map.js
var ea = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ F(0);
	#n = /* @__PURE__ */ F(0);
	#r = yr || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return yr === this.#r ? /* @__PURE__ */ F(e) : tn(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return H(this.#t), !1;
		}
		return H(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				H(this.#t);
				return;
			}
		}
		return H(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), I(this.#n, super.size), cn(o);
		else if (i !== t) {
			cn(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && cn(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), I(n, -1)), r && (I(this.#n, super.size), cn(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			I(this.#n, 0);
			for (var t of e.values()) I(t, -1);
			cn(this.#t), e.clear();
		}
	}
	#a() {
		H(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) H(n);
	}
	keys() {
		return H(this.#t), super.keys();
	}
	values() {
		return this.#a(), super.values();
	}
	entries() {
		return this.#a(), super.entries();
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	get size() {
		return H(this.#n), super.size;
	}
}, ta = class {
	#e = new ea();
	#t = /* @__PURE__ */ N(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return H(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, na = class {
	#e = new ea();
	first(e) {
		return this.#e.get(e) ?? 0;
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	forget(e) {
		this.#e.delete(e);
	}
}, ra = class {
	#e = /* @__PURE__ */ F(null);
	#t = /* @__PURE__ */ F(!1);
	#n = /* @__PURE__ */ F(!1);
	#r = /* @__PURE__ */ F(null);
	#i = /* @__PURE__ */ F(!1);
	#a = /* @__PURE__ */ F(null);
	#o = /* @__PURE__ */ F(null);
	#s = new ea();
	get summary() {
		return H(this.#e);
	}
	get summaryFailed() {
		return H(this.#t);
	}
	get summaryLoading() {
		return H(this.#n);
	}
	get live() {
		return H(this.#r);
	}
	get liveFailed() {
		return H(this.#i);
	}
	get liveAt() {
		return H(this.#a);
	}
	get session() {
		return H(this.#o);
	}
	liveState(e) {
		return this.#s.get(e);
	}
	setLiveState(e, t) {
		this.#s.set(e, t);
	}
	keepLiveStates(e) {
		let t = [...e];
		for (let e of [...this.#s.keys()]) t.includes(e) || this.#s.delete(e);
	}
	set(e) {
		e.summary !== void 0 && (I(this.#e, e.summary), I(this.#t, !1)), e.summaryFailed !== void 0 && I(this.#t, e.summaryFailed, !0), e.summaryLoading !== void 0 && I(this.#n, e.summaryLoading, !0), e.live !== void 0 && (I(this.#r, e.live), I(this.#i, !1)), e.liveFailed !== void 0 && I(this.#i, e.liveFailed, !0), e.liveAt !== void 0 && I(this.#a, e.liveAt, !0), e.session !== void 0 && I(this.#o, e.session);
	}
}, ia = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function aa(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of ia.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !ia.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var oa = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function sa(e) {
	let t = oa.indexOf(e);
	return t === -1 ? oa.length : t;
}
function ca(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function la(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var ua = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, da = {
	background: 1,
	ultracode: 4
}, fa = {
	background: -45,
	ultracode: 45
};
function pa(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function ma(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function ha(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? ma(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function ga(e, t) {
	return ha(e, pa(ua, t) ?? 0);
}
function _a(e, t) {
	let n = pa(da, t);
	return n ? ha(e, n) : null;
}
function va(e) {
	return pa(fa, e);
}
function ya(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var ba = "–", xa = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), Sa = new Intl.NumberFormat("en"), Ca = {
	month: "short",
	day: "numeric"
}, wa = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, Ta = {
	hour: "2-digit",
	minute: "2-digit"
};
function X(e) {
	return e == null ? ba : xa.format(e);
}
function Ea(e) {
	return e < 0 ? `−${X(-e)}` : `+${X(e)}`;
}
function Z(e) {
	return e == null ? ba : Sa.format(e);
}
function Q(e) {
	return e == null ? ba : Math.abs(e) >= 1e3 ? "$" + xa.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function Da(e, t) {
	if (!t) return ba;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function Oa(e) {
	if (e == null) return ba;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function ka(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function Aa(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function ja(e, t) {
	return ka(e).toLocaleDateString(t, Ca);
}
function Ma(e, t) {
	return ka(e).toLocaleDateString(t, wa);
}
function Na(e) {
	let [t = "", n = "0"] = e.split("T"), r = ka(t);
	return r.setHours(Number(n)), r;
}
function Pa(e, t) {
	return Na(e).toLocaleTimeString(t, Ta);
}
function Fa(e, t) {
	let n = Na(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, Ta);
	return `${n.toLocaleDateString(t, wa)}, ${i(n)}–${i(r)}`;
}
function Ia(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...Ca,
		...Ta
	}) : ba;
}
function La(e, t = Date.now(), n) {
	if (!e) return ba;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : Ia(e, n);
}
//#endregion
//#region src/lib/charts.ts
function Ra(e) {
	return e.new_input + e.cache_write + e.cache_read;
}
function za(e) {
	if (e <= 0) return 1;
	let t = 10 ** Math.floor(Math.log10(e));
	for (let n of [
		1,
		2,
		2.5,
		5,
		10
	]) if (e <= n * t) return n * t;
	return 10 * t;
}
function Ba(e, t) {
	return Array.from({ length: t + 1 }, (n, r) => e * r / t);
}
function Va(e) {
	return Math.max(2, Math.ceil(za(e) / 2) * 2);
}
function Ha(e, t, n) {
	let r = e - 1;
	return (e) => r > 0 ? t + (n - t) * e / r : (t + n) / 2;
}
function Ua(e, t, n) {
	return (r) => n > 1 ? Math.round((r - e) / (t - e) * (n - 1)) : 0;
}
function Wa(e, t) {
	return (n) => Math.floor((n - e) / t);
}
function Ga(e, t = 24) {
	return Math.max(2, Math.min(t, e * .6));
}
function Ka(e, t, n, r, i, a = 4) {
	let o = i ? Math.min(a, n / 2, r) : 0;
	return `M${e},${t + r}V${t + o}` + (o ? `Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}` : `H${e + n}`) + `V${t + r}Z`;
}
function qa(e) {
	return e.indexOf(Math.max(...e));
}
function Ja(e, t = /* @__PURE__ */ new Date()) {
	let n = [];
	for (let r = ka(e); r <= t; r.setDate(r.getDate() + 1)) n.push(Aa(r));
	return n;
}
function Ya(e, t = /* @__PURE__ */ new Date()) {
	if (e.days !== 1 || !e.hour_model) return {
		keys: Ja(e.since, t),
		unit: "day",
		heading: "Day",
		short: ja,
		long: Ma,
		keyOf: (e) => e.day ?? ""
	};
	let n = e.since === Aa(t) ? t.getHours() : 23, r = [];
	for (let t = 0; t <= n; t += 1) r.push(`${e.since}T${String(t).padStart(2, "0")}`);
	return {
		keys: r,
		unit: "hour",
		heading: "Hour",
		short: Pa,
		long: Fa,
		keyOf: (e) => e.hour ?? ""
	};
}
var Xa = {
	cost: 0,
	input: 0,
	output: 0
};
function Za(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			cost: 0,
			input: 0,
			output: 0
		};
		i.cost += r.cost || 0, i.input += Ra(r), i.output += r.output, n.set(e, i);
	}
	return n;
}
function Qa(e, t, n) {
	let r = aa([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${ca(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: ga(e, a.effort),
			hatch: _a(e, a.effort),
			turn: va(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : sa(e);
	return [...i.values()].sort((e, t) => (e.slot ?? 8) - (t.slot ?? 8) || e.model.localeCompare(t.model) || a(e.effort) - a(t.effort) || String(e.effort).localeCompare(String(t.effort)));
}
function $a(e) {
	let t = [];
	for (let n of e) {
		let e = t[t.length - 1];
		e?.model !== n.model && (e = {
			model: n.model,
			entries: []
		}, t.push(e)), e.entries.push(n);
	}
	return t;
}
function eo(e, t) {
	return t.map((t) => e.reduce((e, n) => e + (n.values.get(t) ?? 0), 0));
}
function to(e, t, n, r = 2, i = 4) {
	let a = [], o = n;
	return t.forEach((n, s) => {
		let c = s === 0 ? 0 : e[s - 1] === e[s] ? r : i, l = n - (n > c ? c : 0);
		l > 0 && a.push({
			position: s,
			y: o - n,
			height: l,
			top: s === t.length - 1
		}), o -= n;
	}), a;
}
var no = {
	five_hour: "5-hour limit",
	seven_day: "weekly limit",
	seven_day_opus: "weekly Opus limit"
};
function ro(e) {
	return e ? Object.hasOwn(no, e) ? no[e] ?? e : e.replaceAll("_", " ") : "–";
}
function io(e) {
	let t = e.status ? ` (${e.status})` : "";
	return e.error === "rate_limit" ? `⚠ Rate limit${t}` : `${e.error.replaceAll("_", " ")}${t}`;
}
function ao(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			limits: 0,
			other: 0
		};
		r.error === "rate_limit" ? i.limits += r.count : i.other += r.count, n.set(e, i);
	}
	return (e) => n.get(e) ?? {
		limits: 0,
		other: 0
	};
}
function oo(e) {
	return Date.parse(e.first_hit) - Date.parse(e.start);
}
function so(e, t) {
	let n = new Date(e.start), r = new Date(e.resets_at), i = n.toDateString() === r.toDateString() ? r.toLocaleTimeString(t, {
		hour: "2-digit",
		minute: "2-digit"
	}) : Ia(e.resets_at, t);
	return `${Ia(e.start, t)} – ${i}`;
}
function co(e) {
	let t = e.cost_parts.cache_read;
	return {
		cacheRead: t,
		rest: Math.max(0, (e.cost || 0) - t)
	};
}
function lo(e) {
	return Math.max(0, ...e.map((e) => e.cost || 0)) || 1;
}
function uo(e, t) {
	return 100 * (e || 0) / t;
}
//#endregion
//#region src/lib/tables.ts
var fo = [
	10,
	25,
	50
];
function po(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function mo(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function ho(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function go(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function _o(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function vo(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
var yo = [
	{ label: "Last activity" },
	{ label: "Session" },
	{
		label: "Subagents",
		numeric: !0
	},
	{
		label: "Turns",
		numeric: !0
	},
	{
		label: "Avg context",
		numeric: !0
	},
	{
		label: "Peak context",
		numeric: !0
	},
	{
		label: "Output",
		numeric: !0
	},
	{
		label: "Cost",
		numeric: !0
	}
];
function bo(e) {
	return [
		Ia(e.last_ts),
		Z(e.subagents),
		Z(e.turns),
		X(e.context_avg),
		X(e.context_peak),
		X(e.output),
		Q(e.cost)
	];
}
function xo(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var So = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function Co(e) {
	return e.flatMap((e) => {
		let t = e.agent_id ?? "";
		return e.tool_kinds ? e.tool_kinds.map((n) => {
			let r = [
				n.tool,
				n.kind,
				n.detail,
				n.options
			], i = r.findLastIndex((e) => e !== null), a = (e) => JSON.stringify([t, ...e]), o = r.map((e, t) => t === i ? null : e), s = a(r), c = i > 1 ? a(o) : null;
			return {
				...n,
				key: s,
				agent: e.agent_type,
				sub: i > 0,
				fold: s,
				parent: c
			};
		}) : e.tools.map((n) => ({
			key: JSON.stringify([
				t,
				n.tool,
				"stored"
			]),
			agent: e.agent_type,
			tool: n.tool,
			kind: null,
			detail: null,
			options: null,
			fold: null,
			parent: null,
			sub: !1,
			calls: n.calls,
			errors: null,
			result_chars: n.result_chars,
			result_median: null,
			result_p90: null,
			input_median: null,
			calls_after_median: null,
			carried: null,
			input_cost: null
		}));
	});
}
function wo(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function To(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var Eo = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, Do = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function Oo(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn(Do, e.tool) && Do[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(Eo, n) && Eo[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function ko(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function Ao(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: wo(e, So)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || To(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function jo(e) {
	let t = /* @__PURE__ */ new Map(), n = e.map((e, n) => {
		let r = e.parent === null ? void 0 : t.get(e.parent), i = e.parent !== null && r ? [...r.above, e.parent] : [];
		return r && (r.members += 1), e.fold && t.set(e.fold, {
			above: i,
			row: n,
			members: 0
		}), i;
	}), r = [];
	for (let [n, { row: i, members: a }] of t) {
		let t = e[i];
		a && t && r.push({
			fold: n,
			row: i,
			members: a,
			label: `${Z(a)} ${Oo(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function Mo(e, t) {
	return e.every((e) => t.has(e));
}
function No(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function Po(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function Fo(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return No(e, t).map((e) => ({
		key: Po(e, n.get(e) ?? 0),
		entry: e
	}));
}
function Io(e, t) {
	return (t.cost ?? -1) - (e.cost ?? -1) || t.turns - e.turns;
}
var Lo = [
	{
		label: "Turns",
		numeric: !0
	},
	{
		label: "Input",
		numeric: !0
	},
	{
		label: "Cache read %",
		numeric: !0
	},
	{
		label: "Output",
		numeric: !0
	},
	{
		label: "Cost",
		numeric: !0
	}
];
function Ro(e) {
	let t = Ra(e);
	return [
		Z(e.turns),
		X(t),
		Da(e.cache_read, t),
		X(e.output),
		Q(e.cost)
	];
}
//#endregion
//#region src/lib/themes.ts
var zo = [
	"light",
	"dark",
	"hacker",
	"startup",
	"rgb"
], Bo = { techbro: "rgb" }, Vo = {
	hacker: {
		"Claude usage": "claude-usage --watch",
		"Estimated cost": "burn_rate",
		"Input tokens": "context_window.log",
		Turns: "requests",
		"API calls with usage": "200 OK, all of them",
		"Output tokens": "tokens >> /dev/prod",
		Processed: "cache_miss",
		"From cache": "cache_hit",
		"Live sessions": "ps aux | grep claude",
		"Over time": "git log --graph",
		"Per day, by model": "top -o model",
		"Per day, by model and effort": "top -o model,effort",
		"Per hour, by model and effort": "top -o model,effort",
		"Cost per session": "sort -rn cost | head",
		"By agent type": "kubectl get agents",
		"By model": "model --benchmark",
		"By project": "ls ~/repos",
		Sessions: "history | tail",
		"Session time": "uptime",
		"Waiting on the API": "await api.response()",
		"Running tools": "time ./tools.sh",
		"Lines changed": "git diff --stat",
		"Rate limits": "grep 429 access.log",
		"5-hour windows that hit the limit": "ulimit -t 18000",
		"Latest API errors": "tail -f error.log",
		"Rate limits and API errors": "tail -f error.log",
		"By skill": "ls ~/.claude/skills",
		"By MCP server": "netstat --mcp",
		Conversation: "less session.jsonl",
		footer: " Works on my machine ¯\\_(ツ)_/¯"
	},
	startup: {
		"Claude usage": "Claude usage — Series A ready",
		"Estimated cost": "Infra spend",
		"Input tokens": "Context throughput",
		Turns: "Inference calls",
		"API calls with usage": "p99 < vibes",
		"Output tokens": "Tokens shipped",
		Processed: "Compute",
		"From cache": "Cached (efficient)",
		"Live sessions": "Shipping now",
		"Over time": "Growth",
		"Per day, by model": "Model mix",
		"Per day, by model and effort": "Model × effort mix",
		"Per hour, by model and effort": "Model × effort mix",
		"Cost per session": "Burn per sprint",
		"By agent type": "Team",
		"By model": "Stack",
		"By project": "Portfolio",
		Sessions: "Changelog",
		"Session time": "Time to value",
		"Waiting on the API": "Vendor latency",
		"Running tools": "Automation hours",
		"Lines changed": "Velocity (LoC)",
		"Rate limits": "Hypergrowth friction",
		"5-hour windows that hit the limit": "Burn rate before the wall",
		"Latest API errors": "Incident postmortems",
		"Rate limits and API errors": "Incident postmortems",
		"By skill": "Core competencies",
		"By MCP server": "Integrations",
		Conversation: "Standup notes",
		footer: " We're hiring. (We're not.)"
	},
	rgb: {
		"Claude usage": "Claude usage // battlestation",
		"Estimated cost": "💸 Damage dealt",
		"Input tokens": "🧠 Context loaded",
		Turns: "⚡ APM (API calls)",
		"API calls with usage": "no lag, every frame",
		"Output tokens": "🚀 Tokens fragged",
		Processed: "Raw render",
		"From cache": "Cached frames",
		"Live sessions": "🔴 Live on stream",
		"Over time": "📈 K/D over time",
		"Per day, by model": "🎮 Loadout per day",
		"Per day, by model and effort": "🎮 Loadout × difficulty per day",
		"Per hour, by model and effort": "🎮 Loadout × difficulty per hour",
		"Cost per session": "💀 Boss fights",
		"By agent type": "🕹️ Squad",
		"By model": "🏆 Tier list",
		"By project": "🗺️ Maps",
		Sessions: "🎬 Match history",
		"Session time": "⏱️ Playtime",
		"Waiting on the API": "📡 Ping",
		"Running tools": "🛠️ Crafting time",
		"Lines changed": "⚔️ Combo counter",
		"Rate limits": "🧊 Cooldowns",
		"5-hour windows that hit the limit": "🔋 Stamina drained",
		"Latest API errors": "💥 Crash log",
		"Rate limits and API errors": "💥 Crash log",
		"By skill": "🎯 Skill tree",
		"By MCP server": "🔌 Mods",
		Conversation: "🎙️ Voice chat",
		footer: " GG. RGB adds +15% performance."
	}
};
function Ho(e) {
	if (e == null) return null;
	let t = (Object.hasOwn(Bo, e) ? Bo[e] : e) ?? e;
	return zo.includes(t) ? t : null;
}
function Uo(e) {
	return e !== null && Object.hasOwn(Vo, e) ? Vo[e] ?? {} : {};
}
function Wo(e, t) {
	let n = Uo(e);
	return Object.hasOwn(n, t) ? n[t] ?? t : t;
}
function Go(e) {
	return Uo(e).footer ?? "";
}
//#endregion
//#region src/lib/prefs.svelte.ts
function Ko(e) {
	try {
		return localStorage.getItem(`claude-usage.${e}`);
	} catch {
		return null;
	}
}
function qo(e, t) {
	try {
		localStorage.setItem(`claude-usage.${e}`, String(t));
	} catch {}
}
var Jo = class {
	#e = /* @__PURE__ */ F(un(Ho(Ko("theme"))));
	#t = /* @__PURE__ */ F(un(go(Ko("page_size"), fo, 25)));
	#n = /* @__PURE__ */ F(Ko("chat-oldest-first") === "true");
	get theme() {
		return H(this.#e);
	}
	set theme(e) {
		let t = Ho(e);
		I(this.#e, t, !0), qo("theme", t ?? "auto");
	}
	get pageSize() {
		return H(this.#t);
	}
	set pageSize(e) {
		fo.includes(e) && (I(this.#t, e, !0), qo("page_size", String(e)));
	}
	get oldestFirst() {
		return H(this.#n);
	}
	set oldestFirst(e) {
		I(this.#n, e, !0), qo("chat-oldest-first", String(e));
	}
}, Yo = [
	{
		days: 1,
		label: "Daily"
	},
	{
		days: 7,
		label: "7 days"
	},
	{
		days: 30,
		label: "30 days"
	},
	{
		days: 90,
		label: "90 days"
	},
	{
		days: 365,
		label: "1 year"
	}
];
function Xo(e) {
	return Yo.some((t) => t.days === e) ? e : null;
}
function Zo(e) {
	return e ? Yo.filter((t) => t.days <= e) : Yo;
}
function Qo(e, t) {
	return `days=${e}` + (e === 1 && t !== null ? `&until=${t}` : "");
}
function $o(e, t, n) {
	let r = t ?? n;
	return e && e.days === 1 && e.until === r ? e : null;
}
function es(e) {
	return e === null ? "Today" : Ma(e);
}
function ts(e, t, n) {
	let r = e?.[t];
	if (r) return r === n ? null : r;
}
//#endregion
//#region src/lib/range.svelte.ts
function ns() {
	return Xo(Number(Ko("days"))) ?? 30;
}
var rs = class {
	#e = /* @__PURE__ */ F(un(ns()));
	#t = /* @__PURE__ */ F(null);
	onchange = null;
	get days() {
		return H(this.#e);
	}
	get day() {
		return H(this.#t);
	}
	select(e) {
		Xo(e) !== null && (I(this.#e, e, !0), I(this.#t, null), qo("days", e), this.onchange?.());
	}
	step(e, t) {
		let n = Aa(/* @__PURE__ */ new Date()), r = ts($o(t, H(this.#t), n), e, n);
		r !== void 0 && (I(this.#t, r, !0), this.onchange?.());
	}
	fit(e) {
		e.days >= H(this.#e) || (I(this.#e, e.days, !0), qo("days", e.days));
	}
}, is = class {
	payload = new ra();
	range = new rs();
	preferences = new Jo();
	pages = new na();
	messages = new ta();
	hype = (e) => Wo(this.preferences.theme, e);
	footerCopy = () => Go(this.preferences.theme);
	shownWindow = (e, t) => {
		let { pageSize: n } = this.preferences;
		return mo(t, n, Math.floor(this.pages.first(e) / n));
	};
}, [as, os] = rt();
//#endregion
//#region src/lib/scroll.ts
function ss(e) {
	for (let t of e) {
		let e = t.getBoundingClientRect();
		if (e.bottom > 0) return {
			node: t,
			top: e.top
		};
	}
	return null;
}
function cs(e, t) {
	e && t && t.isConnected && window.scrollBy(0, t.getBoundingClientRect().top - e.top);
}
//#endregion
//#region src/lib/kept.ts
var ls = "a[href], button, select, summary, [tabindex]";
function us(e) {
	let t = document.activeElement, n = t instanceof HTMLElement && e.contains(t) ? t : null, r = ss([...e.children]);
	return {
		active: n,
		activeId: n?.id ?? "",
		activeIndex: n ? [...e.querySelectorAll(ls)].indexOf(n) : -1,
		anchor: r,
		anchorIndex: r ? [...e.children].indexOf(r.node) : -1
	};
}
function ds(e, t) {
	let n = t.anchor?.node.isConnected ? t.anchor.node : e.children[t.anchorIndex];
	cs(t.anchor, n), t.active && ((t.active.isConnected ? t.active : null) ?? (t.activeId ? document.getElementById(t.activeId) : null) ?? e.querySelectorAll(ls)[t.activeIndex] ?? document.getElementById("drilldown-title"))?.focus({ preventScroll: !0 });
}
function fs(e) {
	let t = document.getElementById("drilldown"), n = t ? us(t) : null;
	e(), Gt(), t && n && ds(t, n);
}
//#endregion
//#region src/lib/http.ts
async function ps(e) {
	let t = await fetch(e, { cache: "no-store" }), n;
	try {
		n = await t.json();
	} catch {
		throw Error(`${e}: HTTP ${t.status}, not JSON`);
	}
	if (t.status === 403) throw Error(n.error || "HTTP 403");
	if (!t.ok) throw Error(`${e}: ${n.error || `HTTP ${t.status}`}`);
	return n;
}
//#endregion
//#region src/lib/compact.ts
var ms = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function hs(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function gs(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function _s(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${Z(t.pays_later_in)} replies`;
		return `${ms.later}: growing at its recent pace, the context reaches about ${X(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = Z(Math.round(t.calls_ahead));
	return `${ms[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function vs(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${Q(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${Z(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : Z(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${Z(e.breakeven_low)} replies)` : `would pay off after about ${Z(e.breakeven_calls)} replies` + hs(r(e.breakeven_low), r(e.breakeven_high));
}
function ys(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function bs(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function xs(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function Ss(e) {
	let t = e.map((e) => e.versus_keeping).filter((e) => e !== null && e.verdict !== "forced");
	if (!t.length) return null;
	let n = t.map((e) => e.net).filter((e) => e !== null);
	return {
		net: n.reduce((e, t) => e + t, 0),
		compactions: n.length,
		unknown: t.length - n.length
	};
}
var Cs = {
	model: "the model changed",
	idle: "the cache expired while idle",
	prefix: "something early in the context changed"
}, ws = {
	saved: "saved",
	cost_more: "cost more",
	even: "about even",
	forced: "forced: keeping would have auto-compacted",
	open: "not paid off by the last call",
	unknown: "unknown without an output speed or duration"
}, Ts = "Compared with keeping the context: the same later calls, each reading the dropped tokens again from the cache, at API list prices. ~ marks the summary call's output, estimated from its duration at your output speed; ▲ + (saved, green) holds even at your fastest, ▼ − (cost more, red) even without the summary, or so far for the stretch still running. Re-reading files after compacting isn't counted.";
function Es(e) {
	let { verdict: t, net: n, net_high: r } = e;
	return t === "saved" ? `▲ +${Q(n)}` : t === "cost_more" ? n === null ? `▼ −${Q(-r)} or more` : `▼ −${Q(-n)}` : t === "open" && n !== null ? n < 0 ? `▼ −${Q(-n)} so far` : "about even so far" : t === "unknown" && r > 0 ? `saved at most ${Q(r)}, the summary call unknown` : ws[t];
}
function Ds(e) {
	let t = xs(e);
	return t === "gain" ? "Saved against keeping the context" : e.verdict === "open" ? "Not paid off by the last call: cost more than keeping the context so far" : t === "loss" ? "Cost more than keeping the context" : null;
}
function Os(e) {
	return e.verdict === "forced" ? null : e.breakeven_call === null ? "never" : `${e.breakeven_at_least ? "≥ " : ""}call ${Z(e.breakeven_call)}`;
}
function ks(e) {
	let t = Os(e);
	return t === null ? null : t === "never" ? "never pays off" : e.breakeven_at_least ? `pays off at call ${Z(e.breakeven_call)} or later` : (e.breakeven_call ?? 0) > e.calls_after ? `would pay off at ${t}` : `paid off at ${t}`;
}
function As(e) {
	return e.one_time === null ? `≥ ${Q(e.call_low + e.rewrite)}` : `~${Q(e.one_time)}`;
}
function js(e) {
	let t = e.summary_tokens === null ? "its summary unknown" : `a summary of about ${X(e.summary_tokens)} tokens, at most ${X(e.summary_high)}`, n = e.cache_warm ? "warm" : "cold";
	return `The summary call ${e.call_cost === null ? "" : `~${Q(e.call_cost)} `}(${t}; input ${Q(e.call_low)}, cache ${n}) and rewriting the next call's context ` + Q(e.rewrite);
}
function Ms(e) {
	let t = [];
	return e.rework_margin !== null && t.push(`Re-reading about ${X(e.rework_margin)} tokens after compacting would cancel the saving`), e.capped_at !== null && t.push(`The kept session would have auto-compacted at call ${Z(e.capped_at)}`), t.join(". ") || null;
}
//#endregion
//#region src/lib/live.ts
function Ns(e, t) {
	return e.days === 1 && e.until && e.until !== t ? e.until : null;
}
function Ps(e, t) {
	let n = Ns(e, t), r = e.agent_minutes > e.minutes ? ` (${e.agent_minutes} min while agents work)` : "", i = e.sessions.some((e) => e.waiting) ? " or waiting for you" : "", a = n ? `, active on ${Ma(n)}` : "";
	return `· changed in the last ${e.minutes} min${r}${i}${a}`;
}
function Fs(e, t) {
	let n = Ns(e, t);
	return n ? `No live session was active on ${Ma(n)}.` : `No session active in the last ${e.minutes} minutes.`;
}
function Is(e) {
	if (!e) return null;
	let t = ` since ${Ia(e.since)}`;
	if (e.kind === "permission") {
		let n = e.agent_type ? ` (a ${e.agent_type} subagent)` : "";
		return {
			kind: "permission",
			tone: "waiting",
			text: `Waiting for your permission to use ${e.tool}${n}${t}`
		};
	}
	return {
		kind: "waiting",
		tone: "waiting",
		text: `Waiting for ${e.tool === "ExitPlanMode" ? "you to approve the plan" : "your answer"}${t}`
	};
}
function Ls(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${Z(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${Z(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function Rs(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${X(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = gs(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if (ys({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${Q(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${Z(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${ms[l]}: compacting now ${m}, ~${Z(Math.round(f))} ahead on average.`);
}
function zs(e, t) {
	return [Ls(e.secrets), Rs(e.current, t)].filter((e) => e !== null);
}
function Bs(e, t) {
	let n = Is(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : Is(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function Vs(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/lib/loader.ts
var Hs = 5e3, Us = 6e4, Ws = /^#session\/([A-Za-z0-9_-]{1,128})$/;
function Gs(e) {
	return e instanceof Error ? e.message : String(e);
}
function Ks(e) {
	let t = /* @__PURE__ */ new Date();
	return `${Aa(t)}T${t.getHours()} ${JSON.stringify(e)}`;
}
var qs = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a = 0;
	#o = null;
	#s = 0;
	#c = null;
	#l = 0;
	#u = null;
	#d = /* @__PURE__ */ new Set();
	#f;
	#p;
	#m;
	constructor(e, t = {}) {
		this.#e = e, this.#t = t.fetchJson ?? ps, this.#n = t.hidden ?? (() => document.hidden), this.#r = t.hash ?? (() => location.hash), this.#i = t.keep ?? ((e) => e());
	}
	start() {
		this.#e.range.onchange = () => this.loadRange(), Mr(() => {
			this.loadSession(), this.visibilityChanged();
		});
	}
	stop() {
		this.#h(), this.#a++, this.#s++, this.#l++, this.#e.range.onchange = null;
	}
	visibilityChanged() {
		this.#h(), !this.#n() && (this.#y(), this.#b(), this.#e.payload.session && this.refreshSession());
	}
	hashChanged() {
		this.loadSession();
	}
	loadRange() {
		this.loadSummary(), this.loadLive();
	}
	#h() {
		clearTimeout(this.#f), clearTimeout(this.#p), clearTimeout(this.#m);
	}
	#g(e) {
		let t = e.scan_errors ?? [], n = t.length > 1 ? ` (and ${t.length - 1} more, see the server's log)` : "";
		this.#e.messages.show("scan", t.length ? `Scan: ${t[0]}${n}` : "");
	}
	async loadSummary() {
		let { payload: e, messages: t, range: n } = this.#e;
		e.set({ summaryLoading: !0 });
		let r = ++this.#a;
		try {
			let i = await this.#t(`/api/summary?${Qo(n.days, n.day)}`);
			if (r !== this.#a) return;
			t.show("summary", ""), this.#g(i), n.fit(i);
			let a = Ks(i);
			a !== this.#o && (this.#o = a, e.set({ summary: i }));
		} catch (n) {
			if (r !== this.#a) return;
			t.show("summary", Gs(n)), e.summary || e.set({ summaryFailed: !0 });
		} finally {
			r === this.#a && e.set({ summaryLoading: !1 });
		}
	}
	async loadLive() {
		let { payload: e, messages: t, range: n } = this.#e, r = ++this.#s;
		try {
			let i = await this.#t(`/api/live?${Qo(n.days, n.day)}`);
			if (r !== this.#s) return !1;
			t.show("live", ""), this.#g(i);
			let a = JSON.stringify(i);
			if (a !== this.#c) {
				this.#c = a, e.set({
					live: i,
					liveAt: Date.now()
				});
				let t = e.session;
				t && this.#x() && Vs(t, i.sessions) && this.refreshSession();
			} else e.set({ liveAt: Date.now() });
			return this.#_(i.sessions), !0;
		} catch (n) {
			return r === this.#s && (t.show("live", Gs(n)), this.#c === null && e.set({ liveFailed: !0 }), !1);
		}
	}
	#_(e) {
		let t = new Set(e.map((e) => e.session_id));
		this.#e.payload.keepLiveStates(t);
		for (let e of t) this.#v(e);
	}
	async #v(e) {
		if (!this.#d.has(e)) {
			this.#d.add(e);
			try {
				this.#e.payload.setLiveState(e, await this.#t(`/api/session/${encodeURIComponent(e)}/state`));
			} catch {} finally {
				this.#d.delete(e);
			}
		}
	}
	async #y() {
		await this.loadLive() && this.#e.messages.has("summary") && this.#b(), clearTimeout(this.#f), this.#n() || (this.#f = setTimeout(() => void this.#y(), Hs));
	}
	async #b() {
		await this.loadSummary(), clearTimeout(this.#p), this.#n() || (this.#p = setTimeout(() => void this.#b(), Us));
	}
	async loadSession() {
		let { payload: e, messages: t } = this.#e, n = ++this.#l;
		clearTimeout(this.#m);
		let r = this.#r(), i = r.match(Ws);
		if (!i) {
			t.show("session", r.startsWith("#session/") ? "Not a session link." : ""), e.set({ session: null });
			return;
		}
		try {
			let r = await this.#t(`/api/session/${encodeURIComponent(i[1])}`);
			if (n !== this.#l) return;
			t.show("session", ""), this.#u = Ks(r), e.set({ session: r }), this.#S();
		} catch (e) {
			n === this.#l && t.show("session", Gs(e));
		}
	}
	#x() {
		let e = this.#r().match(Ws), t = this.#e.payload.session;
		return !!(t && e && e[1] === t.session_id);
	}
	#S() {
		clearTimeout(this.#m);
		let e = this.#e.payload.session;
		this.#n() || e === null || (this.#m = setTimeout(() => void this.refreshSession(), e.live ? Hs : Us));
	}
	async refreshSession() {
		let { payload: e, messages: t } = this.#e, n = e.session;
		if (!n) return;
		let r = ++this.#l;
		try {
			let i = await this.#t(`/api/session/${encodeURIComponent(n.session_id)}`);
			if (r !== this.#l) return;
			t.show("session", "");
			let a = Ks(i);
			a !== this.#u && (this.#u = a, this.#i(() => e.set({ session: i })));
		} catch (e) {
			if (r !== this.#l) return;
			t.show("session", Gs(e));
		}
		this.#S();
	}
};
//#endregion
//#region src/lib/page.ts
function Js(e) {
	return e ? `· ${e.project_filter ? `project ${e.project_filter}` : "all projects"}` : "";
}
function Ys(e) {
	return e === null ? "" : `updated ${new Date(e).toLocaleTimeString()}`;
}
function Xs(e, t) {
	return e ? "Estimated cost at Claude API list prices" + (e.prices_checked ? ` (checked ${e.prices_checked})` : "") + ". “(background)” is usage Claude Code counted but no transcript shows (e.g. Haiku for titles), taken from the cost records it writes during and at the end of a session: it has no turns, is filed under the time of the record that first counted it, and is hatched in the chart." + t : "";
}
//#endregion
//#region src/components/Banner.svelte
var Zs = /* @__PURE__ */ U([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function Qs(e, t) {
	j(t, !0);
	var n = Zs(), r = z(n, !0);
	V(() => K(r, t.messages.text)), G(e, n), M();
}
var $s = 12;
function ec(e) {
	return Math.max(320, e);
}
function tc(e, t) {
	return e && t ? e / t : 1;
}
function nc(e, t, n, r) {
	return (e - t) * r / (n || r);
}
function rc(e, t, n) {
	let r = Math.max(1, Math.round(n / 10)), i = {
		ArrowLeft: -1,
		ArrowDown: -1,
		ArrowRight: 1,
		ArrowUp: 1,
		PageUp: -r,
		PageDown: r
	}, a = n - 1;
	if (e === "Home") return 0;
	if (e === "End") return a;
	let o = i[e];
	return o === void 0 ? null : Math.min(Math.max(0, t + o), a);
}
function ic(e, t, n) {
	return Math.max(0, Math.min(e + $s, n - t));
}
function ac(e, t = 8) {
	let n = Math.max(1, Math.ceil(e / t));
	return Array.from({ length: Math.ceil(e / n) }, (e, t) => t * n);
}
function oc(e) {
	return Math.round(e) + .5;
}
//#endregion
//#region src/lib/bymodel.ts
var sc = {
	cost: {
		label: "Estimated cost",
		value: (e) => e.cost || 0,
		format: Q
	},
	output: {
		label: "Output tokens",
		value: (e) => e.output,
		format: X
	},
	input: {
		label: "Input tokens",
		value: Ra,
		format: X
	}
}, cc = Object.keys(sc);
function lc(e) {
	return cc.find((t) => t === e) ?? "cost";
}
var uc = 248;
function dc(e, t, n = /* @__PURE__ */ new Date()) {
	let r = sc[t], i = Ya(e, n), a = Qa(i.unit === "hour" ? e.hour_model_effort : e.day_model_effort, i.keyOf, r.value);
	return {
		buckets: i,
		series: a,
		totals: eo(a, i.keys),
		metric: r
	};
}
function fc(e, t) {
	let n = e - 8, r = (n - 56) / t;
	return {
		right: n,
		band: r,
		barWidth: Ga(r, 24)
	};
}
function pc(e, t) {
	return Wa(56, fc(e, t).band);
}
function mc(e, t, n) {
	let { band: r, barWidth: i } = fc(e, t);
	return 56 + r * n + (r - i) / 2;
}
function hc(e, t, n) {
	let r = e.filter((e) => (e.values.get(t) ?? 0) > 0), i = r.map((e) => 220 * (e.values.get(t) ?? 0) / n);
	return to(r.map((e) => e.model), i, 220, 2, 4).map((e) => ({
		entry: r[e.position],
		segment: e
	}));
}
function gc(e) {
	let t = e.filter((e) => e.hatch).map((e, t) => ({
		id: `model-hatch-${t}`,
		entry: e
	})), n = new Map(t.map((e) => [e.entry, e.id]));
	return {
		patterns: t,
		fill: (e) => n.has(e) ? `url(#${n.get(e)})` : e.color
	};
}
function _c(e, t) {
	return `${e.label} per ${t} by model and effort level; table view available`;
}
function vc(e, t) {
	return `${e.label} per ${t}; arrow keys step through them`;
}
function yc(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${e.metric.format(e.totals[t] ?? 0)}`;
}
function bc(e) {
	return $a(e).map((e) => ({
		model: e.model,
		entries: e.entries.map((e) => ({
			entry: e,
			text: la(e.effort)
		}))
	}));
}
function xc(e, t) {
	return $a(e.filter((e) => e.values.get(t))).map((e) => ({
		model: e.model,
		value: e.entries.reduce((e, n) => e + (n.values.get(t) ?? 0), 0),
		efforts: e.entries.slice().reverse().map((e) => ({
			entry: e,
			text: la(e.effort),
			value: e.values.get(t) ?? 0
		}))
	}));
}
function Sc(e) {
	let { buckets: t, series: n, metric: r } = e, i = t.keys.slice().reverse().map((e) => {
		let i = n.map((t) => t.values.get(e) ?? 0);
		return {
			key: e,
			cells: [
				t.short(e),
				...i.map((e) => e ? r.format(e) : "–"),
				r.format(i.reduce((e, t) => e + t, 0))
			]
		};
	});
	return {
		head: [
			t.heading,
			...n.map((e) => e.key),
			"Total"
		],
		rows: i
	};
}
//#endregion
//#region src/components/ChartTooltip.svelte
var Cc = /* @__PURE__ */ U([[
	"div",
	{ class: "tooltip" },
	,
]]);
function wc(e, t) {
	j(t, !0);
	let n = $i(t, "top", 3, 8);
	function r(e) {
		let r = e.parentElement?.clientWidth ?? 0;
		e.style.left = `${ic(t.anchor, e.offsetWidth, r)}px`, e.style.top = `${n()}px`;
	}
	var i = Cc();
	hi(L(i), () => t.children), A(i), gi(i, () => r), G(e, i), M();
}
//#endregion
//#region src/components/Chart.svelte
var Tc = /* @__PURE__ */ U([["rect", {
	class: "hit",
	tabindex: "0",
	role: "slider",
	"aria-valuemin": "1"
}]], 4), Ec = /* @__PURE__ */ U([[
	"svg",
	null,
	[
		"g",
		{ role: "img" },
		,
		,
	],
	,
], ,], 5);
function Dc(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => (t.cursor?.count ?? 0) - 1), r = /* @__PURE__ */ F(null), i = /* @__PURE__ */ N(() => H(r) === null ? H(n) : Math.min(H(r), H(n))), a = /* @__PURE__ */ F(null), o = /* @__PURE__ */ N(() => H(a) === null || H(n) < 0 ? null : Math.min(H(a), H(n))), s = /* @__PURE__ */ N(() => t.cursor?.area(t.width));
	function c(e) {
		I(r, Math.min(Math.max(0, e), H(n)), !0), I(a, H(r), !0);
	}
	function l(e) {
		let n = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
		t.cursor && n && c(t.cursor.indexAt(t.width)(nc(e.clientX, n.left, n.width, t.width)));
	}
	function u(e) {
		if (!t.cursor) return;
		let n = rc(e.key, H(i), t.cursor.count);
		n !== null && (c(n), e.preventDefault());
	}
	var d = Ec(), f = R(d), p = L(f), m = L(p);
	hi(m, () => t.plot, () => t.width);
	var h = B(m), g = (e) => {
		var n = W();
		hi(R(n), () => t.marks ?? b, () => t.width, () => H(o)), G(e, n);
	};
	q(h, (e) => {
		H(o) !== null && e(g);
	}), A(p);
	var _ = B(p), v = (e) => {
		var n = Tc();
		V((e, r) => {
			Y(n, "x", H(s).x), Y(n, "y", H(s).y), Y(n, "width", e), Y(n, "height", H(s).height), Y(n, "aria-label", t.cursor.label), Y(n, "aria-valuemax", t.cursor.count), Y(n, "aria-valuenow", H(i) + 1), Y(n, "aria-valuetext", r);
		}, [() => Math.max(1, H(s).width), () => t.cursor.valueText(H(i))]), Br("pointermove", n, l), zr("focus", n, () => c(H(i))), Br("keydown", n, u), zr("pointerleave", n, () => I(a, null)), zr("blur", n, () => I(a, null)), G(e, n);
	};
	q(_, (e) => {
		t.cursor && H(s) && H(n) >= 0 && e(v);
	}), A(f);
	var y = B(f), x = (e) => {
		{
			let n = /* @__PURE__ */ N(() => t.cursor.tipX(t.width, H(o)) * tc(t.containerWidth, t.width));
			wc(e, {
				get anchor() {
					return H(n);
				},
				get top() {
					return t.tipTop;
				},
				children: (e, n) => {
					var r = W();
					hi(R(r), () => t.tip, () => H(o)), G(e, r);
				},
				$$slots: { default: !0 }
			});
		}
	};
	q(y, (e) => {
		t.cursor && H(o) !== null && t.tip && e(x);
	}), V(() => {
		Y(f, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), Y(f, "height", t.height), Y(p, "aria-label", t.label);
	}), G(e, d), M();
}
Vr(["pointermove", "keydown"]);
//#endregion
//#region src/components/ChartCard.svelte
var Oc = /* @__PURE__ */ U([[
	"span",
	{ class: "muted" },
	" "
]]), kc = /* @__PURE__ */ U([[
	"section",
	{ class: "card" },
	[
		"div",
		{ class: "chart-head" },
		[
			"h2",
			null,
			" "
		],
		" ",
		,
		" ",
		,
		" ",
		["span", { class: "spacer" }],
		" ",
		[
			"button",
			{ type: "button" },
			"Table view"
		]
	],
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
]]);
function Ac(e, t) {
	let n = /* @__PURE__ */ F(!1);
	var r = kc(), i = L(r), a = L(i), o = z(a, !0), s = B(a, 2), c = (e) => {
		var n = Oc(), r = z(n, !0);
		V(() => K(r, t.note)), G(e, n);
	};
	q(s, (e) => {
		t.note && e(c);
	});
	var l = B(s, 2);
	hi(l, () => t.controls ?? b);
	var u = B(l, 4);
	A(i);
	var d = B(i, 2);
	hi(d, () => t.legend ?? b);
	var f = B(d, 2);
	hi(f, () => t.chart);
	var p = B(f, 2), m = (e) => {
		var n = W();
		hi(R(n), () => t.table), G(e, n);
	};
	q(p, (e) => {
		H(n) && e(m);
	}), hi(B(p, 2), () => t.extra ?? b), A(r), V(() => {
		Y(r, "aria-labelledby", `${t.id ?? ""}-title`), Y(a, "id", `${t.id ?? ""}-title`), K(o, t.title), Y(u, "id", `${t.id ?? ""}-table-toggle`), Y(u, "aria-pressed", H(n));
	}), Br("click", u, () => I(n, !H(n))), G(e, r);
}
Vr(["click"]);
//#endregion
//#region src/components/Swatch.svelte
var jc = /* @__PURE__ */ U([["span", { class: "swatch" }]]);
function Mc(e, t) {
	var n = jc();
	let r;
	V(() => r = Di(n, "", r, { background: t.fill })), G(e, n);
}
//#endregion
//#region src/components/Pager.svelte
var Nc = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), Pc = /* @__PURE__ */ U([[
	"div",
	{
		class: "pager",
		role: "group",
		"aria-label": "Pages"
	},
	["select"],
	" ",
	[
		"button",
		{ type: "button" },
		"‹ Previous"
	],
	" ",
	[
		"span",
		{
			class: "muted",
			"aria-live": "polite"
		},
		" "
	],
	" ",
	[
		"button",
		{ type: "button" },
		"Next ›"
	]
]]);
function Fc(e, t) {
	j(t, !0);
	let { pages: n, preferences: r, shownWindow: i } = as(), a = /* @__PURE__ */ N(() => (t.units.at(-1) ?? -1) + 1), o = /* @__PURE__ */ N(() => i(t.key, H(a))), s = /* @__PURE__ */ N(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function c() {
		n.first(t.key) !== H(o).first && n.set(t.key, H(o).first);
	}
	c();
	function l(e, i) {
		let o = e.closest(".pager"), s = ss(o ? [o] : []);
		n.set(t.key, mo(H(a), r.pageSize, i).first), Gt(), cs(s, o);
	}
	function u(e, t) {
		let n = e.closest(".pager"), i = ss(n ? [n] : []);
		r.pageSize = t, Gt(), cs(i, n);
	}
	var d = Pc(), f = L(d);
	J(f, 20, () => fo, (e) => e, (e, n) => {
		var r = Nc(), i = z(r), a = {};
		V(() => {
			K(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), G(e, r);
	}), A(f);
	var p;
	ji(f);
	var m = B(f, 2), h = B(m, 2), g = z(h, !0), _ = B(h, 2);
	A(d), V((e) => {
		Y(f, "id", `pager-${t.key ?? ""}-size`), Y(f, "aria-label", `${H(s) ?? ""} per page`), p !== (p = r.pageSize) && (f.value = (f.__value = p) ?? "", Ai(f, p)), Y(m, "id", `pager-${t.key ?? ""}-previous`), m.disabled = H(o).page === 0, K(g, e), Y(_, "id", `pager-${t.key ?? ""}-next`), _.disabled = H(o).page === H(o).pages - 1;
	}, [() => ho(H(o), H(a), t.noun)]), Br("change", f, (e) => u(e.currentTarget, Number(e.currentTarget.value))), Br("click", m, (e) => l(e.currentTarget, H(o).page - 1)), Br("click", _, (e) => l(e.currentTarget, H(o).page + 1)), G(e, d), M();
}
Vr(["change", "click"]);
//#endregion
//#region src/components/TableView.svelte
var Ic = /* @__PURE__ */ U([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), Lc = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), Rc = /* @__PURE__ */ U([[
	"th",
	{ scope: "col" },
	" "
]]), zc = /* @__PURE__ */ U([[
	"tr",
	null,
	,
]]), Bc = /* @__PURE__ */ U([[
	"table",
	null,
	[
		"thead",
		null,
		["tr"]
	],
	["tbody"]
]]), Vc = /* @__PURE__ */ U([
	,
	,
	" ",
	,
	" ",
	[
		"div",
		{ class: "table-wrap" },
		,
		" ",
		,
	]
], 1);
function Hc(e, t) {
	j(t, !0);
	let n = (e) => {
		var n = W(), r = R(n), s = (e) => {
			Fc(e, {
				get key() {
					return t.key;
				},
				get noun() {
					return i();
				},
				get units() {
					return H(a);
				}
			});
		};
		q(r, (e) => {
			H(o) > fo[0] && e(s);
		}), G(e, n);
	}, { shownWindow: r } = as(), i = $i(t, "noun", 3, "rows"), a = /* @__PURE__ */ N(() => po(t.rows.map((e) => t.sub?.(e) ?? !1))), o = /* @__PURE__ */ N(() => (H(a).at(-1) ?? -1) + 1), s = /* @__PURE__ */ N(() => r(t.key, H(o))), c = /* @__PURE__ */ N(() => t.rows.filter((e, t) => {
		let n = H(a)[t] ?? 0;
		return n >= H(s).first && n < H(s).last;
	}));
	var l = Vc(), u = R(l), d = (e) => {
		var r = W(), i = R(r), a = (e) => {
			var r = Ic(), i = L(r);
			hi(i, () => t.heading);
			var a = B(i, 2);
			n(a), A(r), G(e, r);
		}, s = (e) => {
			var n = W();
			hi(R(n), () => t.heading), G(e, n);
		};
		q(i, (e) => {
			H(o) > fo[0] ? e(a) : e(s, -1);
		}), G(e, r);
	};
	q(u, (e) => {
		t.heading && e(d);
	});
	var f = B(u, 2);
	hi(f, () => t.intro ?? b);
	var p = B(f, 2), m = L(p), h = (e) => {
		n(e);
	};
	q(m, (e) => {
		t.heading || e(h);
	});
	var g = B(m, 2), _ = (e) => {
		var n = Lc(), r = z(n, !0);
		V(() => K(r, t.empty)), G(e, n);
	}, v = (e) => {
		var n = Bc(), r = L(n), i = L(r);
		J(i, 21, () => t.columns, (e) => e.label, (e, t) => {
			var n = Rc(), r = z(n, !0);
			V(() => {
				Ti(n, 1, yi(H(t).numeric ? "num" : void 0)), Y(n, "title", H(t).title), K(r, H(t).label);
			}), G(e, n);
		}), A(i), A(r);
		var a = B(r);
		J(a, 21, () => H(c), (e) => t.rowKey(e), (e, n) => {
			var r = zc();
			hi(L(r), () => t.cells, () => H(n)), A(r), V((e) => Ti(r, 1, e), [() => yi([t.sub?.(H(n)) ? "sub-row" : t.group?.(H(n)) ? "group-row" : void 0, t.rowClass?.(H(n))])]), G(e, r);
		}), A(a), A(n), V(() => Y(n, "aria-labelledby", t.labelledby)), G(e, n);
	};
	q(g, (e) => {
		t.rows.length === 0 && t.empty !== void 0 ? e(_) : e(v, -1);
	}), A(p), V(() => Y(p, "id", t.id)), G(e, l), M();
}
//#endregion
//#region src/components/XLabels.svelte
var Uc = /* @__PURE__ */ U([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4);
function Wc(e, t) {
	j(t, !0);
	var n = W();
	J(R(n), 16, () => ac(t.count, t.most), (e) => e, (e, n) => {
		var r = Uc(), i = z(r, !0);
		V((e, n) => {
			Y(r, "x", e), Y(r, "y", t.y), K(i, n);
		}, [() => t.xOf(n), () => t.text(n)]), G(e, r);
	}), G(e, n), M();
}
//#endregion
//#region src/components/YAxis.svelte
var Gc = /* @__PURE__ */ U([["line", { "stroke-width": "1" }], [
	"text",
	{
		"text-anchor": "end",
		class: "axis-text"
	},
	" "
]], 5);
function Kc(e, t) {
	j(t, !0);
	var n = W();
	J(R(n), 18, () => t.values, (e) => e, (e, n, r) => {
		let i = /* @__PURE__ */ N(() => oc(t.yOf(n)));
		var a = Gc(), o = R(a), s = B(o), c = z(s, !0);
		V((e) => {
			Y(o, "x1", t.left), Y(o, "x2", t.right), Y(o, "y1", H(i)), Y(o, "y2", H(i)), Y(o, "stroke", H(r) === 0 ? "var(--axis)" : "var(--grid)"), Y(s, "x", t.left - 8), Y(s, "y", H(i) + 4), K(c, e);
		}, [() => t.format(n)]), G(e, a);
	}), G(e, n), M();
}
//#endregion
//#region src/components/ByModel.svelte
var qc = /* @__PURE__ */ U([[
	"button",
	{ type: "button" },
	" "
]]), Jc = /* @__PURE__ */ U([["div", {
	class: "segmented",
	role: "group",
	"aria-label": "Metric"
}]]), Yc = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), Xc = /* @__PURE__ */ U([[
	"span",
	{ class: "legend-group" },
	[
		"strong",
		null,
		" "
	],
	" ",
	,
]]), Zc = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), Qc = /* @__PURE__ */ U([[
	"pattern",
	{
		width: "6",
		height: "6",
		patternUnits: "userSpaceOnUse"
	},
	["rect", {
		width: "6",
		height: "6"
	}],
	["rect", {
		width: "2",
		height: "6"
	}]
]], 4), $c = /* @__PURE__ */ U([["defs"]], 4), el = /* @__PURE__ */ U([["path"]], 4), tl = /* @__PURE__ */ U([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), nl = /* @__PURE__ */ U([
	,
	,
	,
], 5), rl = /* @__PURE__ */ U([
	,
	,
	,
	,
	,
], 5), il = /* @__PURE__ */ U([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), al = /* @__PURE__ */ U([[
	"div",
	{ class: "tip-line tip-effort" },
	[
		"span",
		null,
		,
		" "
	],
	" ",
	[
		"span",
		{ class: "tip-value" },
		" "
	]
]]), ol = /* @__PURE__ */ U([
	[
		"div",
		{ class: "tip-line tip-model" },
		[
			"span",
			null,
			" "
		],
		[
			"span",
			{ class: "tip-value" },
			" "
		]
	],
	" ",
	,
], 1), sl = /* @__PURE__ */ U([[
	"div",
	{ class: "name" },
	"No usage"
]]), cl = /* @__PURE__ */ U([[
	"div",
	{ class: "tip-line tip-total" },
	[
		"span",
		null,
		"Total"
	],
	[
		"span",
		{ class: "tip-value" },
		" "
	]
]]), ll = /* @__PURE__ */ U([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	,
], 1), ul = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), dl = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), fl = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function pl(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = Jc();
		J(t, 20, () => cc, (e) => e, (e, t) => {
			var n = qc(), r = z(n, !0);
			V(() => {
				Y(n, "aria-pressed", H(l) === t), K(r, sc[t].label);
			}), Br("click", n, () => y(t)), G(e, n);
		}), A(t), G(e, t);
	}, r = (e) => {
		var t = Zc(), n = L(t), r = (e) => {
			var t = W();
			J(R(t), 17, () => bc(H(u).series), (e) => e.model, (e, t) => {
				var n = Xc(), r = L(n), i = z(r, !0);
				J(B(r, 2), 17, () => H(t).entries, ({ entry: e, text: t }) => e.key, (e, t) => {
					let n = () => H(t).entry, r = () => H(t).text;
					var i = Yc(), a = L(i);
					{
						let e = /* @__PURE__ */ N(() => ya(n().color, n().hatch, n().turn));
						Mc(a, { get fill() {
							return H(e);
						} });
					}
					var o = B(a, 1, !0);
					A(i), V(() => K(o, r())), G(e, i);
				}), A(n), V(() => K(i, H(t).model)), G(e, n);
			}), G(e, t);
		};
		q(n, (e) => {
			H(u) && e(r);
		}), A(t), G(e, t);
	}, i = (e) => {
		var t = ul(), n = L(t), r = (e) => {
			let t = (e, t = b) => {
				let n = /* @__PURE__ */ N(() => fc(t(), H(a).length)), r = /* @__PURE__ */ N(() => qa(H(u).totals));
				var s = rl(), c = R(s), l = (e) => {
					var t = $c();
					J(t, 21, () => H(f).patterns, ({ id: e, entry: t }) => e, (e, t) => {
						let n = () => H(t).id, r = () => H(t).entry;
						var i = Qc(), a = L(i), o = B(a);
						A(i), V(() => {
							Y(i, "id", n()), Y(i, "patternTransform", `rotate(${r().turn ?? ""})`), Y(a, "fill", r().color), Y(o, "fill", r().hatch);
						}), G(e, i);
					}), A(t), G(e, t);
				};
				q(c, (e) => {
					H(f).patterns.length && e(l);
				});
				var d = B(c);
				{
					let e = /* @__PURE__ */ N(() => Ba(H(m), 4));
					Kc(d, {
						get left() {
							return 56;
						},
						get right() {
							return H(n).right;
						},
						get values() {
							return H(e);
						},
						yOf: (e) => 220 - 220 * e / H(m),
						get format() {
							return H(o);
						}
					});
				}
				var p = B(d);
				{
					let e = /* @__PURE__ */ N(() => 238);
					Wc(p, {
						get count() {
							return H(a).length;
						},
						xOf: (e) => 56 + H(n).band * (e + .5),
						get y() {
							return H(e);
						},
						text: (e) => H(i).short(H(a)[e] ?? "")
					});
				}
				J(B(p), 18, () => H(a), (e) => e, (e, i, s) => {
					let c = /* @__PURE__ */ N(() => mc(t(), H(a).length, H(s)));
					var l = nl(), d = R(l);
					J(d, 17, () => hc(H(u).series, i, H(m)), ({ entry: e, segment: t }) => e.key, (e, t) => {
						let r = () => H(t).entry, i = () => H(t).segment;
						var a = el();
						V((e, t) => {
							Y(a, "d", e), Y(a, "fill", t);
						}, [() => Ka(H(c), i().y, H(n).barWidth, i().height, i().top), () => H(f).fill(r())]), G(e, a);
					});
					var p = B(d), h = (e) => {
						let t = /* @__PURE__ */ N(() => H(u).totals[H(s)] ?? 0);
						var r = tl(), i = z(r, !0);
						V((e) => {
							Y(r, "x", H(c) + H(n).barWidth / 2), Y(r, "y", 220 - 220 * H(t) / H(m) - 6), K(i, e);
						}, [() => H(o)(H(t))]), G(e, r);
					};
					q(p, (e) => {
						H(s) === H(r) && (H(u).totals[H(s)] ?? 0) > 0 && e(h);
					}), G(e, l);
				}), G(e, s);
			}, n = (e, t = b, n = b) => {
				let r = /* @__PURE__ */ N(() => fc(t(), H(a).length).band);
				var i = il();
				V(() => {
					Y(i, "x", 56 + H(r) * n()), Y(i, "width", H(r)), Y(i, "height", 220);
				}), G(e, i);
			}, r = (e, t = b) => {
				let n = /* @__PURE__ */ N(() => H(a)[t()] ?? ""), r = /* @__PURE__ */ N(() => xc(H(u).series, H(n)));
				var s = ll(), c = R(s), l = z(c, !0), d = B(c, 2);
				J(d, 17, () => H(r), (e) => e.model, (e, t) => {
					var n = ol(), r = R(n), i = L(r), a = z(i, !0), s = z(B(i), !0);
					A(r), J(B(r, 2), 17, () => H(t).efforts, ({ entry: e, text: t, value: n }) => e.key, (e, t) => {
						let n = () => H(t).entry, r = () => H(t).text, i = () => H(t).value;
						var a = al(), s = L(a), c = L(s);
						{
							let e = /* @__PURE__ */ N(() => ya(n().color, n().hatch, n().turn));
							Mc(c, { get fill() {
								return H(e);
							} });
						}
						var l = B(c, 1, !0);
						A(s);
						var u = z(B(s, 2), !0);
						A(a), V((e) => {
							K(l, r()), K(u, e);
						}, [() => H(o)(i())]), G(e, a);
					}), V((e) => {
						K(a, H(t).model), K(s, e);
					}, [() => H(o)(H(t).value)]), G(e, n);
				}, (e) => {
					G(e, sl());
				});
				var f = B(d, 2), p = (e) => {
					var n = cl(), r = z(B(L(n)), !0);
					A(n), V((e) => K(r, e), [() => H(o)(H(u).totals[t()] ?? 0)]), G(e, n);
				};
				q(f, (e) => {
					H(r).length > 1 && e(p);
				}), V((e) => K(l, e), [() => H(i).long(H(n))]), G(e, s);
			}, i = /* @__PURE__ */ N(() => H(u).buckets), a = /* @__PURE__ */ N(() => H(i).keys), o = /* @__PURE__ */ N(() => H(u).metric.format);
			{
				let i = /* @__PURE__ */ N(() => _c(H(u).metric, H(d)));
				Dc(e, {
					get height() {
						return uc;
					},
					get label() {
						return H(i);
					},
					get width() {
						return H(_);
					},
					get containerWidth() {
						return H(g);
					},
					get cursor() {
						return H(v);
					},
					get plot() {
						return t;
					},
					get marks() {
						return n;
					},
					get tip() {
						return r;
					}
				});
			}
		};
		q(n, (e) => {
			H(u) && H(f) && e(r);
		}), A(t), Ji(t, "clientWidth", (e) => I(g, e)), G(e, t);
	}, a = (e) => {
		var t = W(), n = R(t), r = (e) => {
			let t = (e, t = b) => {
				var r = fl(), i = R(r), a = z(i, !0);
				J(B(i, 2), 18, () => H(n).others, (e) => e, (e, n, r) => {
					var i = dl(), a = z(i, !0);
					V(() => K(a, t().cells[H(r) + 1])), G(e, i);
				}), V(() => K(a, t().cells[0])), G(e, r);
			}, n = /* @__PURE__ */ N(() => {
				let [e = "", ...t] = H(h).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let r = /* @__PURE__ */ N(() => [{ label: H(n).first }, ...H(n).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				Hc(e, {
					key: "chart-table",
					labelledby: "chart-title",
					get columns() {
						return H(r);
					},
					get rows() {
						return H(h).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return t;
					}
				});
			}
		};
		q(n, (e) => {
			H(h) && e(r);
		}), G(e, t);
	}, { payload: o, hype: s } = as(), c = /* @__PURE__ */ N(() => o.summary), l = /* @__PURE__ */ F(un(lc(Ko("metric")))), u = /* @__PURE__ */ N(() => H(c) ? dc(H(c), H(l)) : null), d = /* @__PURE__ */ N(() => H(u)?.buckets.unit ?? "day"), f = /* @__PURE__ */ N(() => H(u) ? gc(H(u).series) : null), p = /* @__PURE__ */ N(() => H(c) ? H(d) === "hour" ? s("Per hour, by model and effort") : s("Per day, by model and effort") : s("Per day, by model")), m = /* @__PURE__ */ N(() => za(Math.max(...H(u)?.totals ?? [], 0))), h = /* @__PURE__ */ N(() => H(u) ? Sc(H(u)) : null), g = /* @__PURE__ */ F(0), _ = /* @__PURE__ */ N(() => ec(H(g))), v = /* @__PURE__ */ N(() => H(u) ? {
		count: H(u).buckets.keys.length,
		label: vc(H(u).metric, H(d)),
		valueText: (e) => yc(H(u), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: fc(e, H(u).buckets.keys.length).right - 56,
			height: 220
		}),
		indexAt: (e) => pc(e, H(u).buckets.keys.length),
		tipX: (e, t) => 56 + fc(e, H(u).buckets.keys.length).band * (t + .5)
	} : null);
	function y(e) {
		I(l, e, !0), qo("metric", e);
	}
	Ac(e, {
		id: "chart",
		get title() {
			return H(p);
		},
		get controls() {
			return n;
		},
		get legend() {
			return r;
		},
		get chart() {
			return i;
		},
		get table() {
			return a;
		}
	}), M();
}
Vr(["click"]);
//#endregion
//#region src/lib/costly.ts
var ml = [{
	label: "Cache reads",
	color: "var(--split-soft)",
	value: (e) => co(e).cacheRead
}, {
	label: "Everything else",
	color: "var(--split-strong)",
	note: "new input, cache writes, output and web searches",
	value: (e) => co(e).rest
}];
function hl(e) {
	return e.note ? `${e.label} (${e.note})` : e.label;
}
function gl(e) {
	return e.title || "Untitled session";
}
function _l(e) {
	return `#session/${encodeURIComponent(e.session_id)}`;
}
function vl(e) {
	let t = lo(e);
	return e.map((e) => {
		let n = gl(e), r = ml.map((t) => ({
			part: t,
			amount: t.value(e)
		})), i = r.map(({ part: e, amount: t }) => `${e.label} ${Q(t)}`).join(", ");
		return {
			session: e,
			title: n,
			href: _l(e),
			detail: `${e.project} · ${Z(e.turns)} turns · avg context ${X(e.context_avg)}`,
			share: uo(e.cost, t),
			cost: Q(e.cost),
			parts: r,
			label: `${n}: ${Q(e.cost)}; ${i}`
		};
	});
}
function yl(e) {
	let { session: t } = e;
	return {
		title: e.title,
		parts: e.parts.map(({ part: e, amount: n }) => ({
			label: e.label,
			color: e.color,
			amount: Q(n),
			share: Da(n, t.cost || 0)
		})),
		total: e.cost,
		context: `${Z(t.turns)} turns · context avg ${X(t.context_avg)}, peak ${X(t.context_peak)}`
	};
}
function bl(e) {
	return {
		head: [
			{ label: "Session" },
			{
				label: "Turns",
				numeric: !0
			},
			{
				label: "Avg context",
				numeric: !0
			},
			{
				label: "Peak context",
				numeric: !0
			},
			...ml.map((e) => ({
				label: e.label,
				numeric: !0
			})),
			{
				label: "Cost",
				numeric: !0
			}
		],
		rows: e.map((e) => ({
			key: e.session_id,
			session: e,
			cells: [
				Z(e.turns),
				X(e.context_avg),
				X(e.context_peak),
				...ml.map((t) => Q(t.value(e))),
				Q(e.cost)
			]
		}))
	};
}
//#endregion
//#region src/components/CostPerSession.svelte
var xl = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), Sl = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), Cl = /* @__PURE__ */ U([["span"]]), wl = /* @__PURE__ */ U([[
	"a",
	{ class: "bar-row" },
	[
		"span",
		{ class: "bar-name" },
		[
			"strong",
			null,
			" "
		],
		[
			"span",
			{ class: "sub" },
			" "
		]
	],
	" ",
	[
		"span",
		{ class: "bar-track" },
		["div", { class: "bar" }]
	],
	" ",
	[
		"span",
		{ class: "bar-value" },
		" "
	]
]]), Tl = /* @__PURE__ */ U([[
	"div",
	{ class: "row" },
	,
	[
		"strong",
		null,
		" "
	],
	[
		"span",
		{ class: "name" },
		" "
	]
]]), El = /* @__PURE__ */ U([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "row" },
		,
		[
			"strong",
			null,
			" "
		],
		[
			"span",
			{ class: "name" },
			"total"
		]
	],
	" ",
	[
		"div",
		{ class: "name" },
		" "
	]
], 1), Dl = /* @__PURE__ */ U([
	["div", { class: "bars" }],
	" ",
	,
], 1), Ol = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	"No sessions in this range."
]]), kl = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), Al = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), jl = /* @__PURE__ */ U([
	[
		"td",
		null,
		[
			"a",
			null,
			" "
		],
		[
			"span",
			{ class: "sub" },
			" "
		]
	],
	" ",
	,
], 1);
function Ml(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = Sl(), n = L(t), r = (e) => {
			var t = W();
			J(R(t), 17, () => ml, (e) => e.label, (e, t) => {
				var n = xl(), r = L(n);
				Mc(r, { get fill() {
					return H(t).color;
				} });
				var i = B(r, 1, !0);
				A(n), V((e) => K(i, e), [() => hl(H(t))]), G(e, n);
			}), G(e, t);
		};
		q(n, (e) => {
			H(s) && e(r);
		}), A(t), G(e, t);
	}, r = (e) => {
		var t = kl(), n = L(t), r = (e) => {
			var t = W(), n = R(t), r = (e) => {
				var t = Dl(), n = R(t);
				J(n, 21, () => H(l), (e) => e.session.session_id, (e, t) => {
					var n = wl(), r = L(n), i = L(r), a = z(i, !0), o = z(B(i), !0);
					A(r);
					var s = B(r, 2), c = L(s);
					let l;
					J(c, 21, () => H(t).parts, ({ part: e, amount: t }) => e.label, (e, t) => {
						let n = () => H(t).part, r = () => H(t).amount;
						var i = W(), a = R(i), o = (e) => {
							var t = Cl();
							let i;
							V(() => i = Di(t, "", i, {
								"flex-grow": r(),
								background: n().color
							})), G(e, t);
						};
						q(a, (e) => {
							r() > 0 && e(o);
						}), G(e, i);
					}), A(c), A(s);
					var u = z(B(s, 2), !0);
					A(n), V((e) => {
						Y(n, "href", H(t).href), Y(n, "aria-label", H(t).label), K(a, H(t).title), K(o, H(t).detail), l = Di(c, "", l, { width: e }), K(u, H(t).cost);
					}, [() => `${H(t).share.toFixed(2) ?? ""}%`]), Br("pointermove", n, (e) => h(e, H(t).session.session_id)), zr("focus", n, (e) => h(e, H(t).session.session_id)), zr("pointerleave", n, g), zr("blur", n, g), G(e, n);
				}), A(n);
				var r = B(n, 2), i = (e) => {
					wc(e, {
						get anchor() {
							return H(f).anchor;
						},
						get top() {
							return H(f).top;
						},
						children: (e, t) => {
							var n = El(), r = R(n), i = z(r, !0), a = B(r, 2);
							J(a, 17, () => H(m).parts, (e) => e.label, (e, t) => {
								var n = Tl(), r = L(n);
								Mc(r, { get fill() {
									return H(t).color;
								} });
								var i = B(r), a = z(i, !0), o = z(B(i));
								A(n), V(() => {
									K(a, H(t).amount), K(o, `${H(t).label ?? ""} · ${H(t).share ?? ""}`);
								}), G(e, n);
							});
							var o = B(a, 2), s = L(o);
							Mc(s, { fill: null });
							var c = z(B(s), !0);
							Ne(), A(o);
							var l = z(B(o, 2), !0);
							V(() => {
								K(i, H(m).title), K(c, H(m).total), K(l, H(m).context);
							}), G(e, n);
						},
						$$slots: { default: !0 }
					});
				};
				q(r, (e) => {
					H(f) && H(m) && e(i);
				}), G(e, t);
			}, i = (e) => {
				G(e, Ol());
			};
			q(n, (e) => {
				H(l).length ? e(r) : e(i, -1);
			}), G(e, t);
		};
		q(n, (e) => {
			H(s) && e(r);
		}), A(t), G(e, t);
	}, i = (e) => {
		var t = W(), n = R(t), r = (e) => {
			let t = (e, t = b) => {
				var r = jl(), i = R(r), a = L(i), o = z(a, !0), s = z(B(a), !0);
				A(i), J(B(i, 2), 19, () => H(n), (e) => e.label, (e, n, r) => {
					var i = Al(), a = z(i, !0);
					V(() => K(a, t().cells[H(r)])), G(e, i);
				}), V((e, n) => {
					Y(a, "href", e), K(o, n), K(s, t().session.project);
				}, [() => _l(t().session), () => gl(t().session)]), G(e, r);
			}, n = /* @__PURE__ */ N(() => H(u).head.slice(1));
			Hc(e, {
				key: "costly-table",
				labelledby: "costly-title",
				get columns() {
					return H(u).head;
				},
				get rows() {
					return H(u).rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return t;
				}
			});
		};
		q(n, (e) => {
			H(s) && e(r);
		}), G(e, t);
	}, { payload: a, hype: o } = as(), s = /* @__PURE__ */ N(() => a.summary), c = /* @__PURE__ */ N(() => H(s)?.costly_sessions ?? []), l = /* @__PURE__ */ N(() => vl(H(c))), u = /* @__PURE__ */ N(() => bl(H(c))), d = /* @__PURE__ */ N(() => o("Cost per session")), f = /* @__PURE__ */ F(null), p = /* @__PURE__ */ N(() => H(f) ? H(l).find((e) => e.session.session_id === H(f)?.id) : void 0), m = /* @__PURE__ */ N(() => H(p) ? yl(H(p)) : null);
	function h(e, t) {
		let n = e.currentTarget, r = n.closest(".chart")?.getBoundingClientRect();
		if (!r) return;
		let i = n.getBoundingClientRect(), a = "clientX" in e ? e.clientX : 0;
		I(f, {
			id: t,
			anchor: a ? a - r.left : i.left - r.left + i.width / 2,
			top: n.offsetTop + n.offsetHeight + 4
		}, !0);
	}
	function g() {
		I(f, null);
	}
	Ac(e, {
		id: "costly",
		get title() {
			return H(d);
		},
		note: "the costliest sessions by what they used in the range, with their subagents",
		get legend() {
			return n;
		},
		get chart() {
			return r;
		},
		get table() {
			return i;
		}
	}), M();
}
Vr(["pointermove"]);
//#endregion
//#region src/components/LiveIcon.svelte
var Nl = /* @__PURE__ */ U([
	["path", {
		d: "M8 10.5V7.8a4 4 0 0 1 8 0v2.7",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linecap": "round"
	}],
	["rect", {
		x: "4.8",
		y: "10.5",
		width: "14.4",
		height: "10",
		rx: "2",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6"
	}],
	["circle", {
		cx: "12",
		cy: "14.6",
		r: "1.4",
		fill: "currentColor"
	}],
	["path", {
		d: "M12 15.4v2.4",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linecap": "round"
	}]
], 5), Pl = /* @__PURE__ */ U([
	["path", {
		d: "M5 3.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8.2L6 20.5v-4H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linejoin": "round"
	}],
	["path", {
		d: "M9.7 8.2a2.3 2.3 0 1 1 3.3 2.1c-.6.3-1 .8-1 1.5v.3",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linecap": "round"
	}],
	["circle", {
		cx: "12",
		cy: "14.4",
		r: "1",
		fill: "currentColor"
	}]
], 5), Fl = /* @__PURE__ */ U([
	["path", {
		d: "M7.2 9.6 8.6 4.4c.2-.8 1-1.2 1.8-1l1.6.4 1.6-.4c.8-.2 1.6.2 1.8 1l1.4 5.2z",
		fill: "currentColor"
	}],
	["path", {
		d: "M2.8 10.4c0-.7 4.1-1.2 9.2-1.2s9.2.5 9.2 1.2-4.1 1.4-9.2 1.4-9.2-.7-9.2-1.4z",
		fill: "currentColor"
	}],
	["rect", {
		x: "6.2",
		y: "13",
		width: "4.8",
		height: "3",
		rx: "1.3",
		fill: "currentColor"
	}],
	["rect", {
		x: "13",
		y: "13",
		width: "4.8",
		height: "3",
		rx: "1.3",
		fill: "currentColor"
	}],
	["path", {
		d: "M11 14h2",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.4"
	}],
	["path", {
		d: "M4 22.8c.5-2.9 3.6-4.6 8-4.6s7.5 1.7 8 4.6zM10.4 18.4l1.6 2.8 1.6-2.8z",
		fill: "currentColor",
		"fill-rule": "evenodd"
	}]
], 5), Il = /* @__PURE__ */ U([
	["rect", {
		x: "3.5",
		y: "2.5",
		width: "17",
		height: "19",
		rx: "2",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6"
	}],
	["path", {
		d: "M12 2.5v5.3M9.5 11.6l2.5 1.6 2.5-1.6",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.5",
		"stroke-linecap": "round",
		"stroke-linejoin": "round"
	}],
	["rect", {
		x: "6",
		y: "7.8",
		width: "12",
		height: "2.3",
		rx: "0.6",
		fill: "currentColor"
	}],
	["path", {
		d: "M6 19h12v-4.2l-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3z",
		fill: "currentColor"
	}]
], 5), Ll = /* @__PURE__ */ U([[
	"span",
	{ role: "img" },
	[
		"svg",
		{
			viewBox: "0 0 24 24",
			"aria-hidden": "true",
			focusable: "false"
		},
		,
	]
]]);
function Rl(e, t) {
	j(t, !0);
	var n = Ll(), r = L(n), i = L(r), a = (e) => {
		var t = Nl();
		Ne(3), G(e, t);
	}, o = (e) => {
		var t = Pl();
		Ne(2), G(e, t);
	}, s = (e) => {
		var t = Fl();
		Ne(5), G(e, t);
	}, c = (e) => {
		var t = Il();
		Ne(3), G(e, t);
	};
	q(i, (e) => {
		t.badge.kind === "permission" ? e(a) : t.badge.kind === "waiting" ? e(o, 1) : t.badge.kind === "secret" ? e(s, 2) : e(c, -1);
	}), A(r), A(n), V(() => {
		Ti(n, 1, yi([
			"live-icon",
			`live-icon-${t.badge.kind}`,
			t.badge.tone && `live-icon-${t.badge.tone}`
		])), Y(n, "aria-label", t.badge.text), Y(n, "title", t.badge.text);
	}), G(e, n), M();
}
//#endregion
//#region src/components/LiveCard.svelte
var zl = /* @__PURE__ */ U([[
	"div",
	null,
	[
		"span",
		{ class: "label" },
		" "
	],
	[
		"strong",
		null,
		" "
	]
]]), Bl = /* @__PURE__ */ U([[
	"li",
	null,
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "secondary" },
		" "
	],
	[
		"span",
		{ class: "sub muted" },
		" "
	]
]]), Vl = /* @__PURE__ */ U([["ul"]]), Hl = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	"No subagent running"
]]), Ul = /* @__PURE__ */ U([[
	"div",
	{ class: "live-card" },
	[
		"div",
		{ class: "live-head" },
		[
			"div",
			{ class: "title" },
			["span", {
				class: "dot",
				"aria-hidden": "true"
			}],
			[
				"a",
				null,
				" "
			]
		],
		" ",
		,
		" ",
		["div", { class: "live-states" }]
	],
	" ",
	[
		"div",
		{ class: "muted" },
		" "
	],
	" ",
	["div", { class: "numbers" }],
	" ",
	,
]]);
function Wl(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => Is(t.session.waiting)), r = /* @__PURE__ */ N(() => t.sessionState ? zs(t.sessionState, new Date(t.now).toISOString()) : []), i = /* @__PURE__ */ N(() => [
		{
			label: "Turns",
			value: Z(t.session.turns)
		},
		{
			label: "Output",
			value: X(t.session.output)
		},
		{
			label: "Last context",
			value: X(t.session.last_context)
		},
		{
			label: "Cost",
			value: Q(t.session.cost)
		}
	]);
	var a = Ul(), o = L(a), s = L(o), c = B(L(s)), l = z(c, !0);
	A(s);
	var u = B(s, 2), d = (e) => {
		Rl(e, { get badge() {
			return H(n);
		} });
	};
	q(u, (e) => {
		H(n) && e(d);
	});
	var f = B(u, 2);
	J(f, 21, () => H(r), (e) => e.kind, (e, t) => {
		Rl(e, { get badge() {
			return H(t);
		} });
	}), A(f), A(o);
	var p = B(o, 2), m = z(p), h = B(p, 2);
	J(h, 21, () => H(i), (e) => e.label, (e, t) => {
		var n = zl(), r = L(n), i = z(r, !0), a = z(B(r), !0);
		A(n), V(() => {
			K(i, H(t).label), K(a, H(t).value);
		}), G(e, n);
	}), A(h);
	var g = B(h, 2), _ = (e) => {
		var n = Vl();
		J(n, 21, () => t.session.subagents, (e) => e.agent_id, (e, n) => {
			var r = Bl(), i = L(r), a = z(i, !0), o = B(i, 2), s = z(o, !0), c = z(B(o));
			A(r), V((e, t, r) => {
				K(a, H(n).agent_type), K(s, H(n).description || ""), K(c, `${(H(n).model || "–") ?? ""} · ${e ?? ""} turns · context ${t ?? ""} · ${r ?? ""}`);
			}, [
				() => Z(H(n).turns),
				() => X(H(n).last_context),
				() => La(H(n).last_activity, t.now)
			]), G(e, r);
		}), A(n), G(e, n);
	}, v = (e) => {
		G(e, Hl());
	};
	q(g, (e) => {
		t.session.subagents.length ? e(_) : e(v, -1);
	}), A(a), V((e, n, r) => {
		Y(c, "href", e), K(l, n), K(m, `${t.session.project ?? ""}${t.session.git_branch ? ` · ${t.session.git_branch}` : ""} · ${r ?? ""}`);
	}, [
		() => _l(t.session),
		() => gl(t.session),
		() => La(t.session.last_activity, t.now)
	]), G(e, a), M();
}
//#endregion
//#region src/components/LiveSessions.svelte
var Gl = /* @__PURE__ */ U([[
	"h2",
	{ id: "live-title" },
	[
		"span",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	]
]]), Kl = /* @__PURE__ */ U([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), ql = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), Jl = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Yl = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Xl = /* @__PURE__ */ U([["div", { class: "live-grid" }]]), Zl = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), Ql = /* @__PURE__ */ U([
	,
	,
	" ",
	,
	" ",
	,
], 1), $l = /* @__PURE__ */ U([[
	"section",
	{
		class: "card",
		"aria-labelledby": "live-title"
	},
	,
	" ",
	,
]]);
function eu(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = Gl(), n = L(t), r = z(n, !0), a = z(B(n, 2), !0);
		A(t), V((e, t) => {
			K(r, e), K(a, t);
		}, [() => i("Live sessions"), () => H(s) ? Ps(H(s), H(l)) : ""]), G(e, t);
	}, { payload: r, hype: i, shownWindow: a } = as(), o = "live", s = /* @__PURE__ */ N(() => r.live), c = /* @__PURE__ */ N(() => r.liveAt ?? Date.now()), l = /* @__PURE__ */ N(() => Aa(new Date(H(c)))), u = /* @__PURE__ */ N(() => H(s)?.sessions ?? []), d = /* @__PURE__ */ N(() => po(H(u).map(() => !1))), f = /* @__PURE__ */ N(() => H(u).length), p = /* @__PURE__ */ N(() => a(o, H(f))), m = /* @__PURE__ */ N(() => H(u).slice(H(p).first, H(p).last)), h = /* @__PURE__ */ N(() => H(f) > fo[0]);
	var g = $l(), _ = L(g), v = (e) => {
		var t = Kl(), r = L(t);
		n(r), Fc(B(r, 2), {
			key: o,
			noun: "sessions",
			get units() {
				return H(d);
			}
		}), A(t), G(e, t);
	}, y = (e) => {
		n(e);
	};
	q(_, (e) => {
		H(h) ? e(v) : e(y, -1);
	});
	var b = B(_, 2), x = (e) => {
		var t = ql(), n = z(t, !0);
		V(() => K(n, r.liveFailed ? "Could not load the live sessions." : "Loading…")), G(e, t);
	}, S = (e) => {
		var t = Ql(), n = R(t), i = (e) => {
			var t = Jl(), n = z(t);
			V(() => K(n, `Permission prompts can't show here: ${H(s).prompts_unavailable ?? ""}.`)), G(e, t);
		};
		q(n, (e) => {
			H(s).prompts_unavailable && e(i);
		});
		var a = B(n, 2), o = (e) => {
			var t = Yl(), n = z(t);
			V(() => K(n, `Desktop notifications can't show: ${H(s).notifications_unavailable ?? ""}.`)), G(e, t);
		};
		q(a, (e) => {
			H(s).notifications_unavailable && e(o);
		});
		var u = B(a, 2), d = (e) => {
			var t = Xl();
			J(t, 21, () => H(m), (e) => e.session_id, (e, t) => {
				{
					let n = /* @__PURE__ */ N(() => r.liveState(H(t).session_id));
					Wl(e, {
						get session() {
							return H(t);
						},
						get sessionState() {
							return H(n);
						},
						get now() {
							return H(c);
						}
					});
				}
			}), A(t), G(e, t);
		}, f = (e) => {
			var t = Zl(), n = z(t, !0);
			V((e) => K(n, e), [() => Fs(H(s), H(l))]), G(e, t);
		};
		q(u, (e) => {
			H(m).length ? e(d) : e(f, -1);
		}), G(e, t);
	};
	q(b, (e) => {
		H(s) ? e(S, -1) : e(x);
	}), A(g), G(e, g), M();
}
//#endregion
//#region src/lib/trend.ts
var tu = [
	{
		label: "Estimated cost",
		slot: 0,
		value: (e) => e.cost,
		format: Q
	},
	{
		label: "Input tokens",
		slot: 1,
		value: (e) => e.input,
		format: X
	},
	{
		label: "Output tokens",
		slot: 2,
		value: (e) => e.output,
		format: X
	}
];
function nu(e) {
	let t = e * 116 + 22;
	return {
		top: t,
		bottom: t + 76
	};
}
function ru() {
	return nu(tu.length - 1).bottom + 28;
}
function iu(e, t = /* @__PURE__ */ new Date()) {
	let n = Ya(e, t), r = Za(n.unit === "hour" ? e.hour_model : e.day_model, n.keyOf);
	return {
		buckets: n,
		totals: n.keys.map((e) => r.get(e) ?? Xa)
	};
}
function au(e, t) {
	return e.totals.map((e) => t.value(e));
}
function ou(e) {
	return `estimated cost, input and output tokens per ${e}`;
}
function su(e) {
	return `Estimated cost, input tokens and output tokens per ${e}; table view available`;
}
function cu(e) {
	return `Estimated cost, input and output tokens per ${e}; arrow keys step through them`;
}
function lu(e, t) {
	let n = e.totals[t] ?? Xa, r = tu.map((e) => `${e.label} ${e.format(e.value(n))}`).join(", ");
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${r}`;
}
function uu(e) {
	let t = e.buckets.keys.map((t, n) => ({
		key: t,
		cells: [e.buckets.short(t), ...tu.map((t) => t.format(t.value(e.totals[n] ?? Xa)))]
	})).reverse();
	return {
		head: [e.buckets.heading, ...tu.map((e) => e.label)],
		rows: t
	};
}
//#endregion
//#region src/components/AreaLine.svelte
var du = /* @__PURE__ */ U([["path", { "fill-opacity": "0.1" }], ["path", {
	fill: "none",
	"stroke-width": "2",
	"stroke-linejoin": "round",
	"stroke-linecap": "round"
}]], 5);
function fu(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => t.values.map((e, n) => `${t.xOf(n).toFixed(1)},${t.yOf(e).toFixed(1)}`).join("L")), r = /* @__PURE__ */ N(() => `M${t.xOf(0)},${t.bottom}L${H(n)}L${t.xOf(t.values.length - 1)},${t.bottom}Z`);
	var i = W(), a = R(i), o = (e) => {
		var i = du(), a = R(i), o = B(a);
		V(() => {
			Y(a, "d", H(r)), Y(a, "fill", t.color), Y(o, "d", `M${H(n) ?? ""}`), Y(o, "stroke", t.color);
		}), G(e, i);
	};
	q(a, (e) => {
		t.values.length && e(o);
	}), G(e, i), M();
}
//#endregion
//#region src/components/PointDot.svelte
var pu = /* @__PURE__ */ U([["circle", {
	r: "4",
	stroke: "var(--surface)",
	"stroke-width": "2"
}]], 4);
function mu(e, t) {
	var n = pu();
	V(() => {
		Y(n, "cx", t.x), Y(n, "cy", t.y), Y(n, "fill", t.color);
	}), G(e, n);
}
//#endregion
//#region src/components/OverTime.svelte
var hu = (e, t = b) => {
	var n = wu(), r = R(n), i = z(r, !0);
	J(B(r, 2), 19, () => tu, (e) => e.label, (e, n, r) => {
		var i = Cu(), a = z(i, !0);
		V(() => K(a, t().cells[H(r) + 1])), G(e, i);
	}), V(() => K(i, t().cells[0])), G(e, n);
}, gu = /* @__PURE__ */ U([
	,
	,
	[
		"text",
		{ class: "value-text" },
		" "
	]
], 5), _u = /* @__PURE__ */ U([
	["line", {
		"stroke-width": "2",
		"stroke-linecap": "round"
	}],
	[
		"text",
		{ class: "panel-title" },
		" "
	],
	,
	,
	,
], 5), vu = /* @__PURE__ */ U([
	,
	,
	,
], 5), yu = /* @__PURE__ */ U([["line", { class: "crosshair" }], ,], 5), bu = /* @__PURE__ */ U([[
	"div",
	{ class: "row" },
	["span", { class: "key" }],
	" ",
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "name" },
		" "
	]
]]), xu = /* @__PURE__ */ U([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
], 1), Su = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), Cu = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), wu = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function Tu(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = Su(), n = L(t), r = (e) => {
			let t = (e, t = b) => {
				let n = /* @__PURE__ */ N(() => t() - 64), r = /* @__PURE__ */ N(() => Ha(H(a).length, 56, H(n)));
				var o = vu(), s = R(o);
				J(s, 17, () => H(p), ({ panel: e, top: t, bottom: n, color: r, values: i, max: a, yOf: o }) => e.label, (e, t) => {
					let i = () => H(t).panel, a = () => H(t).top, o = () => H(t).bottom, s = () => H(t).color, c = () => H(t).values, l = () => H(t).max, u = () => H(t).yOf;
					var d = _u(), f = R(d), p = B(f), m = z(p, !0), h = B(p);
					{
						let e = /* @__PURE__ */ N(() => Ba(l(), 2));
						Kc(h, {
							get left() {
								return 56;
							},
							get right() {
								return H(n);
							},
							get values() {
								return H(e);
							},
							get yOf() {
								return u();
							},
							get format() {
								return i().format;
							}
						});
					}
					var g = B(h);
					fu(g, {
						get values() {
							return c();
						},
						get xOf() {
							return H(r);
						},
						get yOf() {
							return u();
						},
						get bottom() {
							return o();
						},
						get color() {
							return s();
						}
					});
					var _ = B(g), v = (e) => {
						let t = /* @__PURE__ */ N(() => c().length - 1), n = /* @__PURE__ */ N(() => c()[H(t)] ?? 0);
						var a = gu(), o = R(a);
						{
							let e = /* @__PURE__ */ N(() => H(r)(H(t))), i = /* @__PURE__ */ N(() => u()(H(n)));
							mu(o, {
								get x() {
									return H(e);
								},
								get y() {
									return H(i);
								},
								get color() {
									return s();
								}
							});
						}
						var l = B(o), d = z(l, !0);
						V((e, t, n) => {
							Y(l, "x", e), Y(l, "y", t), K(d, n);
						}, [
							() => H(r)(H(t)) + 9,
							() => u()(H(n)) + 4,
							() => i().format(H(n))
						]), G(e, a);
					};
					q(_, (e) => {
						c().length && e(v);
					}), V(() => {
						Y(f, "x1", 56), Y(f, "x2", 70), Y(f, "y1", a() - 10), Y(f, "y2", a() - 10), Y(f, "stroke", s()), Y(p, "x", 76), Y(p, "y", a() - 6), K(m, i().label);
					}), G(e, d);
				});
				var c = B(s);
				{
					let e = /* @__PURE__ */ N(() => f + 18);
					Wc(c, {
						get count() {
							return H(a).length;
						},
						get xOf() {
							return H(r);
						},
						get y() {
							return H(e);
						},
						text: (e) => H(i).short(H(a)[e] ?? "")
					});
				}
				G(e, o);
			}, n = (e, t = b, n = b) => {
				let r = /* @__PURE__ */ N(() => Ha(H(a).length, 56, t() - 64));
				var i = yu(), o = R(i);
				J(B(o), 17, () => H(p), ({ panel: e, color: t, values: n, yOf: r }) => e.label, (e, t) => {
					let i = () => H(t).color, a = () => H(t).values, o = () => H(t).yOf;
					{
						let t = /* @__PURE__ */ N(() => H(r)(n())), s = /* @__PURE__ */ N(() => o()(a()[n()] ?? 0));
						mu(e, {
							get x() {
								return H(t);
							},
							get y() {
								return H(s);
							},
							get color() {
								return i();
							}
						});
					}
				}), V((e, t) => {
					Y(o, "x1", e), Y(o, "x2", t), Y(o, "y1", 18), Y(o, "y2", f);
				}, [() => H(r)(n()), () => H(r)(n())]), G(e, i);
			}, r = (e, t = b) => {
				var n = xu(), r = R(n), o = z(r, !0);
				J(B(r, 2), 17, () => H(p), ({ panel: e, color: t, values: n }) => e.label, (e, n) => {
					let r = () => H(n).panel, i = () => H(n).color, a = () => H(n).values;
					var o = bu(), s = L(o);
					let c;
					var l = B(s, 2), u = z(l, !0), d = z(B(l, 2), !0);
					A(o), V((e) => {
						c = Di(s, "", c, { background: i() }), K(u, e), K(d, r().label);
					}, [() => r().format(a()[t()] ?? 0)]), G(e, o);
				}), V((e) => K(o, e), [() => H(i).long(H(a)[t()] ?? "")]), G(e, n);
			}, i = /* @__PURE__ */ N(() => H(s).buckets), a = /* @__PURE__ */ N(() => H(i).keys);
			{
				let i = /* @__PURE__ */ N(ru), a = /* @__PURE__ */ N(() => su(H(c)));
				Dc(e, {
					get height() {
						return H(i);
					},
					get label() {
						return H(a);
					},
					get width() {
						return H(d);
					},
					get containerWidth() {
						return H(u);
					},
					get cursor() {
						return H(m);
					},
					get plot() {
						return t;
					},
					get marks() {
						return n;
					},
					get tip() {
						return r;
					}
				});
			}
		};
		q(n, (e) => {
			H(s) && e(r);
		}), A(t), Ji(t, "clientWidth", (e) => I(u, e)), G(e, t);
	}, r = (e) => {
		var t = W(), n = R(t), r = (e) => {
			let t = /* @__PURE__ */ N(() => {
				let [e = "", ...t] = H(l).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let n = /* @__PURE__ */ N(() => [{ label: H(t).first }, ...H(t).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				Hc(e, {
					key: "trend-table",
					labelledby: "trend-title",
					get columns() {
						return H(n);
					},
					get rows() {
						return H(l).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return hu;
					}
				});
			}
		};
		q(n, (e) => {
			H(l) && e(r);
		}), G(e, t);
	}, { payload: i, hype: a } = as(), o = /* @__PURE__ */ N(() => i.summary), s = /* @__PURE__ */ N(() => H(o) ? iu(H(o)) : null), c = /* @__PURE__ */ N(() => H(s)?.buckets.unit ?? "day"), l = /* @__PURE__ */ N(() => H(s) ? uu(H(s)) : null), u = /* @__PURE__ */ F(0), d = /* @__PURE__ */ N(() => ec(H(u))), f = nu(tu.length - 1).bottom, p = /* @__PURE__ */ N(() => H(s) ? tu.map((e, t) => {
		let { top: n, bottom: r } = nu(t), i = au(H(s), e), a = za(Math.max(...i, 0));
		return {
			panel: e,
			top: n,
			bottom: r,
			color: ma(e.slot),
			values: i,
			max: a,
			yOf: (e) => r - 76 * e / a
		};
	}) : []), m = /* @__PURE__ */ N(() => H(s) ? {
		count: H(s).buckets.keys.length,
		label: cu(H(c)),
		valueText: (e) => lu(H(s), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: f
		}),
		indexAt: (e) => Ua(56, e - 64, H(s).buckets.keys.length),
		tipX: (e, t) => Ha(H(s).buckets.keys.length, 56, e - 64)(t)
	} : null);
	{
		let t = /* @__PURE__ */ N(() => a("Over time")), i = /* @__PURE__ */ N(() => ou(H(c)));
		Ac(e, {
			id: "trend",
			get title() {
				return H(t);
			},
			get note() {
				return H(i);
			},
			get chart() {
				return n;
			},
			get table() {
				return r;
			}
		});
	}
	M();
}
//#endregion
//#region src/components/RangeFilter.svelte
var Eu = /* @__PURE__ */ U([[
	"div",
	{
		class: "day-nav",
		role: "group",
		"aria-label": "Day"
	},
	[
		"button",
		{
			type: "button",
			"aria-label": "Previous day"
		},
		"‹"
	],
	" ",
	[
		"output",
		{ "aria-live": "polite" },
		" "
	],
	" ",
	[
		"button",
		{
			type: "button",
			"aria-label": "Next day"
		},
		"›"
	]
]]), Du = /* @__PURE__ */ U([
	[
		"button",
		{ type: "button" },
		" "
	],
	" ",
	,
], 1), Ou = /* @__PURE__ */ U([
	[
		"span",
		{ class: "label" },
		"Range"
	],
	" ",
	["div", { class: "segmented" }]
], 1);
function ku(e, t) {
	j(t, !0);
	let { payload: n, range: r } = as(), i = /* @__PURE__ */ N(() => Zo(n.summary?.retention_days)), a = /* @__PURE__ */ N(() => $o(n.summary, r.day, Aa(/* @__PURE__ */ new Date())));
	var o = Ou(), s = B(R(o), 2);
	J(s, 21, () => H(i), (e) => e.days, (e, t) => {
		var i = Du(), o = R(i), s = z(o, !0), c = B(o, 2), l = (e) => {
			var t = Eu(), i = L(t), o = B(i, 2), s = z(o, !0), c = B(o, 2);
			A(t), V((e) => {
				i.disabled = !H(a)?.previous_day, K(s, e), c.disabled = !H(a)?.next_day;
			}, [() => es(r.day)]), Br("click", i, () => r.step("previous_day", n.summary)), Br("click", c, () => r.step("next_day", n.summary)), G(e, t);
		};
		q(c, (e) => {
			H(t).days === 1 && r.days === 1 && e(l);
		}), V(() => {
			Y(o, "aria-pressed", r.days === H(t).days), K(s, H(t).label);
		}), Br("click", o, () => r.select(H(t).days)), G(e, i);
	}), A(s), G(e, o), M();
}
Vr(["click"]);
var Au = 148, ju = "var(--status-critical)";
function Mu(e, t = /* @__PURE__ */ new Date()) {
	let n = Ya(e, t), r = ao(n.unit === "hour" ? e.api_errors.hour : e.api_errors.day, n.keyOf), i = n.keys.map((e) => r(e).limits), a = n.keys.map((e) => r(e).other), o = i.reduce((e, t) => e + t, 0), s = qa(i);
	return {
		buckets: n,
		limits: i,
		others: a,
		total: o,
		top: Va(Math.max(...i, 0)),
		peak: i[s] ? s : null,
		empty: !i.some(Boolean) && !a.some(Boolean)
	};
}
function Nu(e, t, n, r, i) {
	let { band: a, barWidth: o } = fc(e, t), s = 120 * r / i;
	return {
		x: 56 + a * n + (a - o) / 2,
		y: 120 - s,
		width: o,
		height: s
	};
}
function Pu(e) {
	return `rate-limit hits per ${e}; other API errors are in the tooltip, the table view and the list`;
}
function Fu(e, t) {
	return `Rate-limit hits per ${e}: ${Z(t)} in the range; table view available`;
}
function Iu(e) {
	return `Rate-limit hits per ${e}; arrow keys step through them`;
}
function Lu(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${Z(e.limits[t])} rate-limit hits, ${Z(e.others[t])} other API errors`;
}
function Ru(e, t) {
	return {
		when: e.buckets.long(e.buckets.keys[t] ?? ""),
		limits: Z(e.limits[t]),
		others: Z(e.others[t])
	};
}
function zu(e) {
	let { buckets: t } = e;
	return {
		head: [
			{ label: t.heading },
			{
				label: "Rate-limit hits",
				numeric: !0
			},
			{
				label: "Other API errors",
				numeric: !0
			}
		],
		rows: t.keys.map((n, r) => ({
			key: n,
			cells: [
				t.short(n),
				Z(e.limits[r]),
				Z(e.others[r])
			]
		})).reverse()
	};
}
var Bu = [
	{ label: "Window" },
	{
		label: "Hit after",
		numeric: !0
	},
	{
		label: "Hits",
		numeric: !0
	},
	{
		label: "Turns",
		numeric: !0
	},
	{
		label: "Input",
		numeric: !0
	},
	{
		label: "Cache read %",
		numeric: !0
	},
	{
		label: "Output",
		numeric: !0
	},
	{
		label: "Cost",
		numeric: !0
	}
];
function Vu(e, t) {
	return e.flatMap((e) => {
		let n = `${e.limit_type} ${e.resets_at}`;
		return [{
			key: n,
			kind: "window",
			name: so(e, t),
			cells: [
				Oa(oo(e)),
				Z(e.hits),
				...Ro(e.used)
			],
			sub: !1,
			group: e.models.length > 0
		}, ...e.models.slice().sort(Io).map((e) => ({
			key: `${n} ${e.model}`,
			kind: "model",
			name: e.model,
			cells: [
				"",
				"",
				...Ro(e)
			],
			sub: !0,
			group: !1
		}))];
	});
}
function Hu(e) {
	return e.map((e) => ({
		key: e.record_id,
		when: Ia(e.ts),
		error: io(e),
		quota: ro(e.limit_type),
		resets: Ia(e.resets_at),
		session: {
			href: _l(e),
			name: gl(e),
			project: e.project
		},
		agent: e.agent_type
	}));
}
function Uu(e) {
	return [
		{ label: "When" },
		{ label: "Error" },
		{ label: "Quota" },
		{ label: "Resets" },
		...e ? [{ label: "Session" }] : [],
		{ label: "Agent" }
	];
}
//#endregion
//#region src/components/EventsTable.svelte
var Wu = /* @__PURE__ */ U([[
	"h3",
	null,
	" "
]]), Gu = /* @__PURE__ */ U([[
	"td",
	null,
	[
		"a",
		null,
		" "
	],
	[
		"span",
		{ class: "sub" },
		" "
	]
]]), Ku = /* @__PURE__ */ U([
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	,
	" ",
	[
		"td",
		null,
		" "
	]
], 1);
function qu(e, t) {
	j(t, !0);
	let n = (e) => {
		var n = Wu(), r = z(n, !0);
		V(() => {
			Y(n, "id", `${t.id ?? ""}-title`), K(r, t.title);
		}), G(e, n);
	}, r = (e, t = b) => {
		var n = Ku(), r = R(n), a = z(r, !0), o = B(r, 2), s = z(o, !0), c = B(o, 2), l = z(c, !0), u = B(c, 2), d = z(u, !0), f = B(u, 2), p = (e) => {
			var n = Gu(), r = L(n), i = z(r, !0), a = z(B(r), !0);
			A(n), V(() => {
				Y(r, "href", t().session.href), K(i, t().session.name), K(a, t().session.project);
			}), G(e, n);
		};
		q(f, (e) => {
			i() && e(p);
		});
		var m = z(B(f, 2), !0);
		V(() => {
			K(a, t().when), K(s, t().error), K(l, t().quota), K(d, t().resets), K(m, t().agent);
		}), G(e, n);
	}, i = $i(t, "withSession", 3, !0);
	{
		let a = /* @__PURE__ */ N(() => Uu(i()));
		Hc(e, {
			get key() {
				return t.pagerKey;
			},
			get columns() {
				return H(a);
			},
			get rows() {
				return t.rows;
			},
			rowKey: (e) => e.key,
			get cells() {
				return r;
			},
			get heading() {
				return n;
			},
			get empty() {
				return t.empty;
			},
			get labelledby() {
				return `${t.id ?? ""}-title`;
			}
		});
	}
	M();
}
//#endregion
//#region src/components/RateLimits.svelte
var Ju = (e) => {
	G(e, ld());
}, Yu = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), Xu = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), Zu = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	"No rate limits or API errors in this range."
]]), Qu = /* @__PURE__ */ U([["path"]], 4), $u = /* @__PURE__ */ U([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), ed = /* @__PURE__ */ U([
	,
	,
	,
], 5), td = /* @__PURE__ */ U([
	,
	,
	,
	,
], 5), nd = /* @__PURE__ */ U([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), rd = /* @__PURE__ */ U([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	[
		"div",
		{ class: "row" },
		,
		[
			"strong",
			null,
			" "
		],
		[
			"span",
			{ class: "name" },
			" "
		]
	],
	" ",
	[
		"div",
		{ class: "row" },
		,
		[
			"strong",
			null,
			" "
		],
		[
			"span",
			{ class: "name" },
			"other API errors"
		]
	]
], 1), id = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), ad = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), od = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1), sd = /* @__PURE__ */ U([
	,
	,
	" ",
	,
], 1), cd = /* @__PURE__ */ U([[
	"h3",
	{ id: "limit-windows-title" },
	" "
]]), ld = /* @__PURE__ */ U([[
	"p",
	{ class: "note" },
	"what each window used from its start (its reset less 5 hours) up to its first hit, as the transcripts here show it;\n    the limit also counts what you use elsewhere"
]]), ud = /* @__PURE__ */ U([[
	"span",
	{ class: "window-model" },
	" "
]]), dd = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), fd = /* @__PURE__ */ U([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1);
function pd(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = Xu(), n = L(t), r = (e) => {
			var t = Yu(), n = L(t);
			Mc(n, { get fill() {
				return ju;
			} });
			var r = B(n);
			A(t), V(() => K(r, "⚠ Rate-limit hit")), G(e, t);
		};
		q(n, (e) => {
			H(d) && e(r);
		}), A(t), G(e, t);
	}, r = (e) => {
		var t = id(), n = L(t), r = (e) => {
			var t = W(), n = R(t), r = (e) => {
				G(e, Zu());
			}, i = (e) => {
				let t = (e, t = b) => {
					let n = /* @__PURE__ */ N(() => fc(t(), H(a).length));
					var r = td(), o = R(r);
					{
						let e = /* @__PURE__ */ N(() => Ba(H(d).top, 2));
						Kc(o, {
							get left() {
								return 56;
							},
							get right() {
								return H(n).right;
							},
							get values() {
								return H(e);
							},
							yOf: (e) => 120 - 120 * e / H(d).top,
							get format() {
								return Z;
							}
						});
					}
					var s = B(o);
					{
						let e = /* @__PURE__ */ N(() => 138);
						Wc(s, {
							get count() {
								return H(a).length;
							},
							xOf: (e) => 56 + H(n).band * (e + .5),
							get y() {
								return H(e);
							},
							text: (e) => H(i).short(H(a)[e] ?? "")
						});
					}
					J(B(s), 18, () => H(a), (e) => e, (e, n, r) => {
						let i = /* @__PURE__ */ N(() => H(d).limits[H(r)] ?? 0), o = /* @__PURE__ */ N(() => Nu(t(), H(a).length, H(r), H(i), H(d).top));
						var s = ed(), c = R(s), l = (e) => {
							var t = Qu();
							V((e) => {
								Y(t, "d", e), Y(t, "fill", ju);
							}, [() => Ka(H(o).x, H(o).y, H(o).width, H(o).height, !0)]), G(e, t);
						};
						q(c, (e) => {
							H(o).height > 0 && e(l);
						});
						var u = B(c), f = (e) => {
							var t = $u(), n = z(t, !0);
							V((e) => {
								Y(t, "x", H(o).x + H(o).width / 2), Y(t, "y", H(o).y - 6), K(n, e);
							}, [() => Z(H(i))]), G(e, t);
						};
						q(u, (e) => {
							H(r) === H(d).peak && e(f);
						}), G(e, s);
					}), G(e, r);
				}, n = (e, t = b, n = b) => {
					let r = /* @__PURE__ */ N(() => fc(t(), H(a).length).band);
					var i = nd();
					V(() => {
						Y(i, "x", 56 + H(r) * n()), Y(i, "width", H(r)), Y(i, "height", 120);
					}), G(e, i);
				}, r = (e, t = b) => {
					let n = /* @__PURE__ */ N(() => Ru(H(d), t()));
					var r = rd(), i = R(r), a = z(i, !0), o = B(i, 2), s = L(o);
					Mc(s, { get fill() {
						return ju;
					} });
					var c = B(s), l = z(c, !0), u = z(B(c));
					A(o);
					var f = B(o, 2), p = L(f);
					Mc(p, { fill: null });
					var m = z(B(p), !0);
					Ne(), A(f), V(() => {
						K(a, H(n).when), K(l, H(n).limits), K(u, "⚠ rate-limit hits"), K(m, H(n).others);
					}), G(e, r);
				}, i = /* @__PURE__ */ N(() => H(d).buckets), a = /* @__PURE__ */ N(() => H(i).keys);
				{
					let i = /* @__PURE__ */ N(() => Fu(H(f), H(d).total));
					Dc(e, {
						get height() {
							return Au;
						},
						get label() {
							return H(i);
						},
						get width() {
							return H(y);
						},
						get containerWidth() {
							return H(v);
						},
						get cursor() {
							return H(x);
						},
						get plot() {
							return t;
						},
						get marks() {
							return n;
						},
						get tip() {
							return r;
						}
					});
				}
			};
			q(n, (e) => {
				H(d).empty ? e(r) : e(i, -1);
			}), G(e, t);
		};
		q(n, (e) => {
			H(d) && e(r);
		}), A(t), Ji(t, "clientWidth", (e) => I(v, e)), G(e, t);
	}, i = (e) => {
		var t = W(), n = R(t), r = (e) => {
			let t = (e, t = b) => {
				var r = od(), i = R(r), a = z(i, !0);
				J(B(i, 2), 19, () => H(n), (e) => e.label, (e, n, r) => {
					var i = ad(), a = z(i, !0);
					V(() => K(a, t().cells[H(r) + 1])), G(e, i);
				}), V(() => K(a, t().cells[0])), G(e, r);
			}, n = /* @__PURE__ */ N(() => H(m).head.slice(1));
			Hc(e, {
				key: "limits-table",
				labelledby: "limits-title",
				get columns() {
					return H(m).head;
				},
				get rows() {
					return H(m).rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return t;
				}
			});
		};
		q(n, (e) => {
			H(m) && e(r);
		}), G(e, t);
	}, a = (e) => {
		var t = W(), n = R(t), r = (e) => {
			var t = sd(), n = R(t);
			Hc(n, {
				key: "limit-windows",
				labelledby: "limit-windows-title",
				get columns() {
					return Bu;
				},
				get rows() {
					return H(h);
				},
				rowKey: (e) => e.key,
				get cells() {
					return s;
				},
				sub: (e) => e.sub,
				group: (e) => e.group,
				get heading() {
					return o;
				},
				get intro() {
					return Ju;
				},
				empty: "No 5-hour window hit its limit in this range."
			});
			var r = B(n, 2);
			{
				let e = /* @__PURE__ */ N(() => l("Latest API errors"));
				qu(r, {
					id: "limit-events",
					get title() {
						return H(e);
					},
					get rows() {
						return H(g);
					},
					empty: "No API errors in this range.",
					pagerKey: "limit-events"
				});
			}
			G(e, t);
		};
		q(n, (e) => {
			H(u) && e(r);
		}), G(e, t);
	}, o = (e) => {
		var t = cd(), n = z(t, !0);
		V((e) => K(n, e), [() => l("5-hour windows that hit the limit")]), G(e, t);
	}, s = (e, t = b) => {
		var n = fd(), r = R(n), i = L(r), a = (e) => {
			var n = ud(), r = z(n, !0);
			V(() => K(r, t().name)), G(e, n);
		}, o = (e) => {
			var n = Jr();
			V(() => K(n, t().name)), G(e, n);
		};
		q(i, (e) => {
			t().kind === "model" ? e(a) : e(o, -1);
		}), A(r), J(B(r, 2), 19, () => _, (e) => e.label, (e, n, r) => {
			var i = dd(), a = z(i, !0);
			V(() => K(a, t().cells[H(r)])), G(e, i);
		}), G(e, n);
	}, { payload: c, hype: l } = as(), u = /* @__PURE__ */ N(() => c.summary), d = /* @__PURE__ */ N(() => H(u) ? Mu(H(u)) : null), f = /* @__PURE__ */ N(() => H(d)?.buckets.unit ?? "day"), p = /* @__PURE__ */ N(() => l("Rate limits")), m = /* @__PURE__ */ N(() => H(d) ? zu(H(d)) : null), h = /* @__PURE__ */ N(() => H(u) ? Vu(H(u).api_errors.windows) : []), g = /* @__PURE__ */ N(() => H(u) ? Hu(H(u).api_errors.events) : []), _ = Bu.slice(1), v = /* @__PURE__ */ F(0), y = /* @__PURE__ */ N(() => ec(H(v))), x = /* @__PURE__ */ N(() => H(d) ? {
		count: H(d).buckets.keys.length,
		label: Iu(H(f)),
		valueText: (e) => Lu(H(d), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: fc(e, H(d).buckets.keys.length).right - 56,
			height: 120
		}),
		indexAt: (e) => pc(e, H(d).buckets.keys.length),
		tipX: (e, t) => 56 + fc(e, H(d).buckets.keys.length).band * (t + .5)
	} : null);
	{
		let t = /* @__PURE__ */ N(() => H(d) ? Pu(H(f)) : void 0);
		Ac(e, {
			id: "limits",
			get title() {
				return H(p);
			},
			get note() {
				return H(t);
			},
			get legend() {
				return n;
			},
			get chart() {
				return r;
			},
			get table() {
				return i;
			},
			get extra() {
				return a;
			}
		});
	}
	M();
}
//#endregion
//#region src/components/SessionsList.svelte
var md = /* @__PURE__ */ U([[
	"h2",
	{ id: "sessions-title" },
	[
		"span",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		"what each used in the range"
	]
]]), hd = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), gd = /* @__PURE__ */ U([[
	"div",
	{
		class: "table-filters",
		role: "search",
		"aria-label": "Filter the sessions"
	},
	[
		"select",
		{
			id: "sessions-project",
			"aria-label": "Project"
		},
		[
			"option",
			null,
			"All projects"
		],
		,
	],
	" ",
	["input", {
		type: "search",
		id: "sessions-search",
		"aria-label": "Filter by title, project or session id",
		placeholder: "Title, project or id",
		autocomplete: "off",
		spellcheck: "false"
	}],
	" ",
	[
		"span",
		{
			class: "muted",
			id: "sessions-count",
			"aria-live": "polite"
		},
		" "
	]
]]), _d = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), vd = /* @__PURE__ */ U([
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		null,
		[
			"a",
			null,
			" "
		],
		[
			"span",
			{ class: "sub" },
			" "
		]
	],
	" ",
	,
], 1), yd = /* @__PURE__ */ U([
	,
	,
	" ",
	,
], 1), bd = /* @__PURE__ */ U([[
	"section",
	{
		class: "card",
		"aria-labelledby": "sessions-title"
	},
	,
]]);
function xd(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = md(), n = z(L(t), !0);
		Ne(2), A(t), V((e) => K(n, e), [() => o("Sessions")]), G(e, t);
	}, r = (e) => {
		var t = gd(), n = L(t), r = L(n);
		r.value = r.__value = "", J(B(r), 17, () => H(p), (e) => e.project, (e, t) => {
			var n = hd(), r = z(n), i = {};
			V((e) => {
				K(r, `${H(t).project ?? ""} (${e ?? ""})`), i !== (i = H(t).project) && (n.value = (n.__value = i) ?? "");
			}, [() => Z(H(t).count)]), G(e, n);
		}), A(n), ji(n);
		var i = B(n, 2);
		zi(i);
		var a = z(B(i, 2), !0);
		A(t), V(() => K(a, H(m))), Mi(n, () => H(l), (e) => {
			I(l, e, !0), s.forget(c);
		}), Wi(i, () => H(u), (e) => {
			I(u, e, !0), s.forget(c);
		}), G(e, t);
	}, i = (e, t = b) => {
		let n = /* @__PURE__ */ N(() => bo(t()));
		var r = vd(), i = R(r), a = z(i, !0), o = B(i, 2), s = L(o), c = z(s, !0), l = z(B(s), !0);
		A(o), J(B(o, 2), 19, () => h, (e) => e.label, (e, t, r) => {
			var i = _d(), a = z(i, !0);
			V(() => K(a, H(n)[H(r) + 1])), G(e, i);
		}), V((e, r) => {
			K(a, H(n)[0]), Y(s, "href", e), K(c, r), K(l, t().project);
		}, [() => _l(t()), () => gl(t())]), G(e, r);
	}, { payload: a, hype: o, pages: s } = as(), c = "sessions", l = /* @__PURE__ */ F(""), u = /* @__PURE__ */ F(""), d = /* @__PURE__ */ N(() => a.summary?.sessions ?? null), f = /* @__PURE__ */ N(() => H(d) ? H(d).filter((e) => _o(e, H(l), H(u))) : []), p = /* @__PURE__ */ N(() => vo(H(d) ?? [], H(l))), m = /* @__PURE__ */ N(() => H(d) ? xo(H(f).length, H(d).length) : ""), h = yo.slice(2);
	var g = bd(), _ = L(g), v = (e) => {
		{
			let t = /* @__PURE__ */ N(() => H(d).length ? "No sessions match the filter." : "No sessions in this range.");
			Hc(e, {
				key: c,
				get columns() {
					return yo;
				},
				get rows() {
					return H(f);
				},
				rowKey: (e) => e.session_id,
				get cells() {
					return i;
				},
				get heading() {
					return n;
				},
				get intro() {
					return r;
				},
				get empty() {
					return H(t);
				},
				labelledby: "sessions-title"
			});
		}
	}, y = (e) => {
		var t = yd(), i = R(t);
		n(i);
		var a = B(i, 2);
		r(a), G(e, t);
	};
	q(_, (e) => {
		H(d) ? e(v) : e(y, -1);
	}), A(g), G(e, g), M();
}
//#endregion
//#region src/lib/opening.ts
function Sd() {
	let e = document.activeElement, t = e && e !== document.body ? e : null;
	return {
		href: t?.getAttribute("href") ?? null,
		element: t,
		scroll: window.scrollY
	};
}
function Cd(e) {
	return e.element?.isConnected ? e.element : e.href === null ? null : [...document.querySelectorAll("a[href]")].find((t) => t.getAttribute("href") === e.href) ?? null;
}
function wd(e) {
	return (t) => {
		let n = Sd(), r = [];
		for (let t of e.hide) {
			let e = document.getElementById(t);
			e && (e.hidden = !0, r.push(e));
		}
		return t.scrollIntoView({ block: "start" }), t.querySelector(e.focus)?.focus({ preventScroll: !0 }), () => {
			for (let e of r) e.hidden = !1;
			window.scrollTo(0, n.scroll), Cd(n)?.focus({ preventScroll: !0 });
		};
	};
}
//#endregion
//#region src/lib/session.ts
function Td(e) {
	let t = e.git_branch ? ` · ${e.git_branch}` : "";
	return `${e.project}${t} · ${Ia(e.first_ts)} – ${Ia(e.last_ts)} · ${e.session_id}`;
}
function Ed(e) {
	return e.some((e) => e.web_searches);
}
function Dd(e) {
	return [
		{ label: "Agent" },
		{ label: "Model" },
		{
			label: "Turns",
			numeric: !0
		},
		{
			label: "Context first → last",
			numeric: !0
		},
		{
			label: "Input total",
			numeric: !0
		},
		{
			label: "Cache read %",
			numeric: !0
		},
		{
			label: "Output",
			numeric: !0
		},
		...e ? [{
			label: "Web searches",
			numeric: !0
		}] : [],
		{
			label: "Returned",
			numeric: !0,
			title: "what a subagent handed back: its result's characters"
		},
		{
			label: "Cost",
			numeric: !0
		}
	];
}
function Od(e) {
	return e.models.length ? e.models.map((t) => {
		let n = e.model_efforts.filter((e) => e.model === t).map((e) => e.effort);
		return n.length ? `${t} · ${n.join(", ")}` : t;
	}) : ["–"];
}
function kd(e, t) {
	return [
		Z(e.turns),
		`${X(e.context_first)} → ${X(e.context_last)}`,
		X(e.input_total),
		Da(e.cache_read, e.input_total),
		X(e.output),
		...t ? [Z(e.web_searches)] : [],
		X(e.returned_chars),
		Q(e.cost)
	];
}
function Ad(e, t, n) {
	let r = e.workflow_phase ? ` · ${e.workflow_phase}` : "";
	return {
		key: e.agent_id ?? "main",
		kind: n,
		name: e.agent_type,
		detail: `${e.description || ""}${r}`,
		models: Od(e),
		fold: null,
		cells: kd(e, t)
	};
}
function jd(e, t, n) {
	let r = (e) => t.reduce((t, n) => t + (n[e] || 0), 0), i = t.map((e) => e.cost).filter((e) => e !== null), a = t[0];
	return {
		key: `run:${e}`,
		kind: "run",
		name: `workflow · ${a.workflow_name || e}`,
		detail: "",
		models: [...new Set(t.flatMap((e) => e.models))],
		fold: {
			run: e,
			label: `${Z(t.length)} agents`
		},
		cells: [
			Z(r("turns")),
			"–",
			X(r("input_total")),
			Da(r("cache_read"), r("input_total")),
			X(r("output")),
			...n ? [Z(r("web_searches"))] : [],
			"–",
			i.length ? Q(i.reduce((e, t) => e + t, 0)) : "–"
		]
	};
}
function Md(e, t) {
	let n = Ed(e), r = /* @__PURE__ */ new Map(), i = [];
	for (let t of e) t.workflow_run === null ? i.push(t) : r.has(t.workflow_run) ? r.get(t.workflow_run).push(t) : (r.set(t.workflow_run, [t]), i.push(t.workflow_run));
	return i.flatMap((e) => {
		if (typeof e != "string") return [Ad(e, n, "agent")];
		let i = r.get(e);
		return [jd(e, i, n), ...t.includes(e) ? i.map((e) => Ad(e, n, "member")) : []];
	});
}
function Nd() {
	return [
		{ label: "Agent" },
		{ label: "Tool" },
		{
			label: "Calls",
			numeric: !0
		},
		{
			label: "Errors",
			numeric: !0,
			title: "calls whose result was an error"
		},
		{
			label: "Result characters",
			numeric: !0
		},
		{
			label: "Median",
			numeric: !0,
			title: "a result's characters, the median call"
		},
		{
			label: "p90",
			numeric: !0,
			title: "…and at the 90th percentile"
		},
		{
			label: "Input median",
			numeric: !0,
			title: "the characters of a call's input, which the model wrote"
		},
		{
			label: "Calls after",
			numeric: !0,
			title: "how many later calls carried it in their context, the median call, up to the next compaction"
		},
		{
			label: "~Carried",
			numeric: !0,
			title: "what the later calls paid to have its input and result in their context"
		},
		{
			label: "~Input cost",
			numeric: !0,
			title: "its input at the output price"
		}
	];
}
function Pd(e) {
	return e.some((e) => e.tool_kinds?.length) ? "Bash splits by what a command does, MCP by server. A call’s input and result stay in the context, so every later call up to the next compaction reads them again: ~Carried estimates what that cost, taking a token as 2.3 characters (measured on real transcripts, a heuristic)." : null;
}
function Fd(e, t) {
	let n = Co([...e]), { above: r, folds: i } = jo(n), a = new Set(t), o = new Map(i.map((e) => [e.row, e]));
	return n.flatMap((e, t) => {
		if (!Mo(r[t] ?? [], a)) return [];
		let i = o.get(t);
		return [{
			key: e.key,
			agent: e.sub ? "" : e.agent,
			name: Ao(e),
			fold: i ? {
				fold: i.fold,
				label: i.label,
				open: a.has(i.fold)
			} : null,
			sub: e.sub,
			group: ko(e, n[t + 1]) === "group-row",
			cells: [
				Z(e.calls),
				Z(e.errors),
				X(e.result_chars),
				X(e.result_median),
				X(e.result_p90),
				X(e.input_median),
				Z(e.calls_after_median),
				Q(e.carried),
				Q(e.input_cost)
			]
		}];
	});
}
//#endregion
//#region src/lib/tiles.ts
function Id(e, t = Aa(/* @__PURE__ */ new Date()), n) {
	let r = e.history_since, i = r && r > e.since ? ` (history since ${ja(r, n)})` : "";
	return e.days === 1 ? e.until === t ? "today" : Ma(e.until, n) : `last ${e.days} days${i}`;
}
function Ld(e) {
	let t = [e.unpriced_turns ? `${Z(e.unpriced_turns)} turns of models without a price are not included` : "at API list prices"];
	return e.web_searches && t.push(`incl. ${Z(e.web_searches)} web searches, ${Q(e.cost_parts.web_search)}`), t.join(" · ");
}
var Rd = "Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.";
function zd(e) {
	let t = e.compactions === 1 ? "1 compaction" : `${Z(e.compactions)} compactions`, n = e.unknown ? `${Z(e.unknown)} without an estimate` : null;
	if (!e.compactions) return {
		title: Rd,
		verdict: null,
		amount: null,
		count: `Compacting: ${n}`
	};
	let r = e.net >= 0;
	return {
		title: Rd,
		verdict: r ? "gain" : "loss",
		amount: r ? `▲ compacting saved ~${Q(e.net)} so far` : `▼ compacting cost ~${Q(-e.net)} more so far`,
		count: `(${[t, n].filter(Boolean).join(", ")})`
	};
}
function Bd(e) {
	let t = e.cost_parts;
	return [{
		label: "Processed",
		tokens: e.new_input + e.cache_write,
		cost: t.new_input + t.cache_write,
		color: "var(--split-strong)",
		note: `New input ${X(e.new_input)} + cache writes ${X(e.cache_write)}, billed at full price or more`
	}, {
		label: "From cache",
		tokens: e.cache_read,
		cost: t.cache_read,
		color: "var(--split-soft)",
		note: "Cache reads, billed at a tenth of the input price and not processed again"
	}];
}
function Vd(e, t) {
	let n = Ra(t);
	return e.map((e) => `${e.label} ${Da(e.tokens, n)}`).join(", ");
}
function Hd(e, t) {
	return e?.turns ? `median context ${X(e.median)} per turn (p90 ${X(e.p90)})` + (t ? ` · compact hint at ${X(t)}` : "") : null;
}
function Ud(e, t, n, r) {
	let i = e.api_ms_without_retries === null ? null : e.api_ms - e.api_ms_without_retries, a = "no time lost to retries";
	return i === null ? a = "retries are not in the transcripts" : i > 0 && (a = `${Oa(i)} of it retries`), {
		session: `wall-clock, ${t}`,
		api: a,
		tools: r ? "from each call to its result, incl. waiting for permission" : `${Da(e.tool_ms, e.duration_ms)} of the session time`,
		lines: n === null ? "no lines changed" : `${Q(n)} per 100 lines changed`
	};
}
function Wd(e) {
	return `${Z(e)} ${e === 1 ? "session" : "sessions"} that ended in the range`;
}
function Gd(e) {
	return e === "cost_record" ? "from its cost record" : "estimated from the transcripts";
}
function Kd(e) {
	let t = e.runtime.lines_added + e.runtime.lines_removed;
	return e.cost === null || t === 0 ? null : e.cost / t * 100;
}
//#endregion
//#region src/lib/usage.ts
function qd(e) {
	return [{ label: e }, ...Lo];
}
function Jd(e, t) {
	return e.slice().sort(Io).map((e) => ({
		key: t(e),
		name: t(e),
		kind: "plain",
		swatch: null,
		cells: Ro(e),
		sub: !1,
		group: !1
	}));
}
function Yd(e, t, n) {
	return e.slice().sort(Io).flatMap((e) => [{
		key: e.model,
		name: e.model,
		kind: "model",
		swatch: ma(n.get(e.model) ?? null),
		cells: Ro(e),
		sub: !1,
		group: !0
	}, ...t.filter((t) => t.model === e.model && t.effort !== null).sort((e, t) => sa(e.effort ?? "") - sa(t.effort ?? "") || (e.effort ?? "").localeCompare(t.effort ?? "")).map((t) => ({
		key: `${e.model}\u0000${t.effort}`,
		name: ca(t.effort),
		kind: "effort",
		swatch: null,
		cells: Ro(t),
		sub: !0,
		group: !1
	}))]);
}
//#endregion
//#region src/components/AgentsTable.svelte
var Xd = (e) => {
	G(e, Zd());
}, Zd = /* @__PURE__ */ U([[
	"h3",
	{ id: "session-agents-title" },
	"Main thread and subagents"
]]), Qd = /* @__PURE__ */ U([[
	"span",
	{ class: "sub" },
	[
		"button",
		{
			type: "button",
			class: "link-button"
		},
		" "
	]
]]), $d = /* @__PURE__ */ U([[
	"span",
	{ class: "sub" },
	" "
]]), ef = /* @__PURE__ */ U([[
	"div",
	null,
	" "
]]), tf = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), nf = /* @__PURE__ */ U([
	[
		"td",
		null,
		[
			"strong",
			null,
			" "
		],
		" ",
		,
	],
	" ",
	["td"],
	" ",
	,
], 1);
function rf(e, t) {
	j(t, !0);
	let n = (e, t = b) => {
		var n = nf(), i = R(n), a = L(i), s = z(a, !0), c = B(a, 2), l = (e) => {
			let n = /* @__PURE__ */ N(() => t().fold), i = /* @__PURE__ */ N(() => H(r).includes(H(n).run));
			var a = Qd(), s = L(a), c = z(s, !0);
			A(a), V(() => {
				Y(s, "aria-expanded", H(i)), K(c, H(n).label);
			}), Br("click", s, () => o(H(n).run)), G(e, a);
		}, u = (e) => {
			var n = $d(), r = z(n, !0);
			V(() => K(r, t().detail)), G(e, n);
		};
		q(c, (e) => {
			t().fold ? e(l) : e(u, -1);
		}), A(i);
		var d = B(i, 2);
		J(d, 20, () => t().models, (e) => e, (e, t) => {
			var n = ef(), r = z(n, !0);
			V(() => K(r, t)), G(e, n);
		}), A(d), J(B(d, 2), 17, () => t().cells, oi, (e, t) => {
			var n = tf(), r = z(n, !0);
			V(() => K(r, H(t))), G(e, n);
		}), V(() => K(s, t().name)), G(e, n);
	}, r = /* @__PURE__ */ F(un([])), i = /* @__PURE__ */ N(() => Dd(Ed(t.agents))), a = /* @__PURE__ */ N(() => Md(t.agents, H(r)));
	function o(e) {
		I(r, H(r).includes(e) ? H(r).filter((t) => t !== e) : [...H(r), e], !0);
	}
	Hc(e, {
		get key() {
			return t.pagerKey;
		},
		get columns() {
			return H(i);
		},
		get rows() {
			return H(a);
		},
		rowKey: (e) => e.key,
		get cells() {
			return n;
		},
		sub: (e) => e.kind === "member",
		group: (e) => e.kind === "run",
		rowClass: (e) => e.kind === "member" ? "workflow-member" : void 0,
		get heading() {
			return Xd;
		},
		labelledby: "session-agents-title"
	}), M();
}
Vr(["click"]);
//#endregion
//#region src/lib/clock.svelte.ts
var af = 2 ** 31 - 1, of = 1e3;
function sf(e) {
	let t = (/* @__PURE__ */ new Date()).toISOString(), n = Yr((n) => {
		t = (/* @__PURE__ */ new Date()).toISOString();
		let r = e === null ? NaN : Date.parse(e) - Date.now();
		if (!(r > 0 && r <= af)) return;
		let i = setTimeout(() => {
			t = (/* @__PURE__ */ new Date()).toISOString(), n();
		}, r + of);
		return () => clearTimeout(i);
	});
	return {
		get expired() {
			return n(), e !== null && Date.parse(e) < Date.now();
		},
		get now() {
			return n(), t;
		}
	};
}
//#endregion
//#region src/lib/gauge.ts
function cf(e) {
	return `Before it, the context was ${X(e.context)} of ${X(e.auto_compact)}. The next reply shows the new one: the summary, with the system prompt, tools and CLAUDE.md sent again.`;
}
function lf(e) {
	return `${(e * 100).toFixed(1)}%`;
}
function uf(e) {
	let t = `Latest context, main thread · ${e.model}`;
	if (e.compacted) return {
		kind: "compacted",
		label: t,
		value: "Compacted",
		secondary: `at ${Ia(e.compacted)}, no reply since`,
		note: cf(e)
	};
	let n = e.hint_tokens < e.auto_compact ? e.hint_tokens / e.auto_compact : null, r = e.last_compaction ? `since the last compaction (${Ia(e.last_compaction)})` : "since the session started", i = e.mean_step === null ? "too few turns for an estimate" : e.turns_left === null ? `${Ea(e.mean_step)} per turn, not growing` : `about ${Z(e.turns_left)} turns left at ${Ea(e.mean_step)} per turn (mean of the last 10)`;
	return {
		kind: "meter",
		label: t,
		value: X(e.context),
		secondary: `of ${X(e.auto_compact)} · ${Da(e.context, e.auto_compact)}`,
		meterLabel: `Latest context ${X(e.context)} of the auto-compact point ${X(e.auto_compact)}`,
		max: e.auto_compact,
		now: e.context,
		fill: lf(Math.min(1, e.context / e.auto_compact)),
		hintAt: n === null ? null : lf(n),
		note: [
			`${X(e.headroom)} until auto-compact`,
			n === null ? null : `the mark is the compact hint at ${X(e.hint_tokens)}, a heuristic`,
			`${Z(e.turns_since_compaction)} turns ${r}`,
			i
		].filter(Boolean).join(" · ")
	};
}
function df(e, t) {
	let n = e.cache_warm_until, r = n === null ? null : t ? `The cache has likely expired (${Ia(n)}): the next reply sends it all at the full price, ${Q(e.keep_across_break)} more.` : `The cache stays warm until ${Ia(n)} (${e.cache_ttl_minutes} min after the last request); after that, the next reply costs ${Q(e.keep_across_break)} more.`, i = [`Every reply sends the whole conversation again: ${X(e.before)}, ${Q(e.reread_cost)} each time from the cache.`, r].filter(Boolean).join(" "), a = e.estimate;
	if (!a) {
		let t = e.stored_compactions;
		return {
			exact: i,
			missing: `No estimate of compacting now: ${t ? `your ${Z(t)} stored ${t === 1 ? "compaction carries" : "compactions carry"} no duration or output speed to estimate the summary from` : "no stored compaction to learn from yet"}.`,
			estimate: null
		};
	}
	return {
		exact: i,
		missing: null,
		estimate: ff(e, a, t)
	};
}
function ff(e, t, n) {
	let r = e.cache_warm_until, i = `${Z(t.compactions)} stored ${t.compactions === 1 ? "compaction" : "compactions"}`, a = Z(t.calls_after_low), o = Z(t.calls_after_high), s = t.calls_after_low === null ? "" : `, which were followed by ${a === o ? a : `${a}–${o}`} replies until the next one`, c = gs(t, n), l = [_s(c, t, n), `Learnt from your ${i}${s}.`];
	return t.before_break !== null && !n && r !== null && l.push(`Compacting before a break past ${Ia(r)} saves about ${Q(t.before_break)} at once.`), {
		lead: `If you compacted now, it would shrink to about ${X(t.after)}${hs(X(t.after_low), X(t.after_high))}. ` + (n ? "Compacting " : `That costs ~${Q(t.one_time)} once and `),
		tone: c,
		phrase: vs(t, n),
		rest: `. ${l.filter(Boolean).join(" ")}`
	};
}
function pf(e, t) {
	let n = e.estimate, r = [t ? `The cache has expired, so the next reply sends your whole conversation (${X(e.before)}) again at the full price.` : `Every reply sends your whole conversation again: ${X(e.before)}, ~${Q(e.reread_cost)} each time from the cache.`];
	return n && r.push(`Compacting would shrink it to about ${X(n.after)}` + (t ? ` and ${vs(n, !0)}.` : `. That costs ~${Q(n.one_time)} once and ${vs(n, !1)}.`)), r;
}
function mf(e, t, n) {
	let r = e.compact_now;
	if (!r) return null;
	let i = r.estimate, a = r.cache_warm_until;
	if (t === "cold") return i ? {
		title: "⚠ The cache has expired: compacting now saves money",
		lines: [`The cache has expired, so the next reply sends your whole conversation (${X(r.before)}) again at the full price. Compacting would shrink it to about ${X(i.after)}. Doing it now saves about ${Q(i.cold_saving)} at once.`]
	} : null;
	let o = pf(r, n);
	return !n && i && i.before_break !== null && i.before_break > 0 && a !== null && o.push(`Taking a break past ${Ia(a)}? Compact before it: the cache expires then, and compacting first saves about ${Q(i.before_break)} at the next reply.`), o.push("How many replies still follow can't be predicted, so past your own threshold ([chat] compact_hint_tokens) this shows whatever the estimate says."), {
		title: `⚠ Your context is past your ${X(e.hint_tokens)} compact hint`,
		lines: o
	};
}
function hf(e) {
	let t = e.exploration, n = e.compact_now?.estimate;
	if (!t || !n || n.calls_ahead === null) return null;
	let r = Z(Math.round(n.calls_ahead));
	return {
		title: "Explore in a subagent",
		lines: [`Since the last compaction the main thread has read, searched and listed ${X(t.tokens)} tokens in ${Z(t.calls)} calls. They stay in the context: every reply reads them again, ~${Q(t.reread)} each and ~${Q(t.carried)} so far.`, (n.ahead_from === "longer" ? `After your past compactions, a stretch this long went on for about ${r} more replies on average. ` : `After your past compactions you went on for about ${r} replies on average. `) + "A subagent (such as Explore) reads in its own context and hands back only its summary, so the next search costs less delegated."],
		note: "A heuristic ([chat] delegate_hint_tokens and delegate_calls_ahead): replayed on real sessions, delegating was cheaper in 52 of 53 cases with 60 to 150 calls ahead, and about even with 20 to 60."
	};
}
//#endregion
//#region src/components/CompactCall.svelte
var gf = /* @__PURE__ */ U([[
	"p",
	null,
	" "
]]), _f = /* @__PURE__ */ U(["Copy it from here: ", ["input", {
	type: "text",
	readonly: "",
	"aria-label": "The command to copy",
	class: "compact-call-field"
}]], 1), vf = /* @__PURE__ */ U([[
	"div",
	{
		class: "card compact-call",
		id: "compact-call",
		role: "region",
		"aria-labelledby": "compact-call-title"
	},
	[
		"strong",
		{ id: "compact-call-title" },
		" "
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "compact-call-actions" },
		[
			"button",
			{
				type: "button",
				id: "compact-copy"
			},
			"Copy /compact"
		],
		" ",
		[
			"span",
			{
				class: "compact-call-status",
				role: "status"
			},
			,
		]
	]
]]);
function yf(e, t) {
	j(t, !0);
	let n = "/compact", r = /* @__PURE__ */ F("no");
	async function i() {
		try {
			await navigator.clipboard.writeText(n), I(r, "yes");
		} catch {
			I(r, "by hand");
		}
	}
	function a(e) {
		e.select();
	}
	var o = vf(), s = L(o), c = z(s, !0), l = B(s, 2);
	J(l, 16, () => t.call.lines, (e) => e, (e, t) => {
		var n = gf(), r = z(n, !0);
		V(() => K(r, t)), G(e, n);
	});
	var u = B(l, 2), d = L(u), f = B(d, 2), p = L(f), m = (e) => {
		G(e, Jr("Copied: paste it into Claude Code."));
	}, h = (e) => {
		var t = _f(), r = B(R(t));
		zi(r), Bi(r, n), gi(r, () => a), G(e, t);
	};
	q(p, (e) => {
		H(r) === "yes" ? e(m) : H(r) === "by hand" && e(h, 1);
	}), A(f), A(u), A(o), V(() => K(c, t.call.title)), Br("click", d, i), G(e, o), M();
}
Vr(["click"]);
//#endregion
//#region src/components/DelegateCall.svelte
var bf = /* @__PURE__ */ U([[
	"p",
	null,
	" "
]]), xf = /* @__PURE__ */ U([[
	"div",
	{
		class: "card delegate-call",
		id: "delegate-call",
		role: "region",
		"aria-labelledby": "delegate-call-title"
	},
	[
		"strong",
		{ id: "delegate-call-title" },
		" "
	],
	" ",
	,
	" ",
	[
		"p",
		{ class: "muted" },
		" "
	]
]]);
function Sf(e, t) {
	j(t, !0);
	var n = xf(), r = L(n), i = z(r, !0), a = B(r, 2);
	J(a, 16, () => t.call.lines, (e) => e, (e, t) => {
		var n = bf(), r = z(n, !0);
		V(() => K(r, t)), G(e, n);
	});
	var o = z(B(a, 2), !0);
	A(n), V(() => {
		K(i, t.call.title), K(o, t.call.note);
	}), G(e, n), M();
}
//#endregion
//#region src/components/ContextGauge.svelte
var Cf = /* @__PURE__ */ U([["span", { class: "gauge-hint" }]]), wf = /* @__PURE__ */ U([[
	"div",
	{
		class: "gauge",
		role: "meter",
		"aria-valuemin": "0"
	},
	["span", { class: "gauge-fill" }],
	" ",
	,
]]), Tf = /* @__PURE__ */ U([["span", { "aria-hidden": "true" }]]), Ef = /* @__PURE__ */ U([[
	"p",
	{ class: "compact-estimate" },
	" ",
	,
	[
		"strong",
		null,
		" "
	],
	" "
]]), Df = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Of = /* @__PURE__ */ U([
	[
		"div",
		{ class: "note" },
		" "
	],
	" ",
	,
], 1), kf = /* @__PURE__ */ U([
	,
	,
	" ",
	,
	" ",
	[
		"div",
		{
			class: "card gauge-card",
			id: "current-gauge"
		},
		[
			"div",
			{ class: "label" },
			" "
		],
		" ",
		[
			"div",
			{ class: "tile-value" },
			" ",
			[
				"span",
				{ class: "secondary" },
				" "
			]
		],
		" ",
		,
		" ",
		[
			"div",
			{ class: "note" },
			" "
		],
		" ",
		,
	]
], 1);
function Af(e, t) {
	j(t, !0);
	let { payload: n } = as(), r = /* @__PURE__ */ N(() => n.session), i = /* @__PURE__ */ N(() => H(r)?.current ?? null), a = /* @__PURE__ */ N(() => H(i)?.compact_now?.cache_warm_until ?? null), o = /* @__PURE__ */ N(() => sf(H(a))), s = /* @__PURE__ */ N(() => H(r) ? ys(H(r), H(o).now) : null), c = /* @__PURE__ */ N(() => H(i) && H(s) ? mf(H(i), H(s), H(o).expired) : null), l = /* @__PURE__ */ N(() => H(r) && H(i) && bs(H(r)) ? hf(H(i)) : null), u = /* @__PURE__ */ N(() => H(i) ? uf(H(i)) : null), d = /* @__PURE__ */ N(() => H(u)?.kind === "meter" && H(i)?.compact_now ? df(H(i).compact_now, H(o).expired) : null);
	var f = W(), p = R(f), m = (e) => {
		var t = kf(), n = R(t), r = (e) => {
			yf(e, { get call() {
				return H(c);
			} });
		};
		q(n, (e) => {
			H(c) && e(r);
		});
		var i = B(n, 2), a = (e) => {
			Sf(e, { get call() {
				return H(l);
			} });
		};
		q(i, (e) => {
			H(l) && e(a);
		});
		var o = B(i, 2), s = L(o), f = z(s, !0), p = B(s, 2), m = L(p), h = z(B(m), !0);
		A(p);
		var g = B(p, 2), _ = (e) => {
			var t = wf(), n = L(t);
			let r;
			var i = B(n, 2), a = (e) => {
				var t = Cf();
				let n;
				V(() => n = Di(t, "", n, { left: H(u).hintAt })), G(e, t);
			};
			q(i, (e) => {
				H(u).hintAt !== null && e(a);
			}), A(t), V(() => {
				Y(t, "aria-valuemax", H(u).max), Y(t, "aria-valuenow", H(u).now), Y(t, "aria-label", H(u).meterLabel), r = Di(n, "", r, { width: H(u).fill });
			}), G(e, t);
		};
		q(g, (e) => {
			H(u).kind === "meter" && e(_);
		});
		var v = B(g, 2), y = z(v, !0), b = B(v, 2), x = (e) => {
			var t = Of(), n = R(t), r = z(n, !0), i = B(n, 2), a = (e) => {
				let t = /* @__PURE__ */ N(() => H(d).estimate);
				var n = Ef(), r = L(n, !0), i = B(r), a = (e) => {
					var n = Tf();
					V(() => Ti(n, 1, `payoff-mark payoff-${H(t).tone ?? ""}`)), G(e, n);
				};
				q(i, (e) => {
					H(t).tone && e(a);
				});
				var o = B(i), s = z(o, !0), c = B(o, 1, !0);
				A(n), V(() => {
					K(r, H(t).lead), K(s, H(t).phrase), K(c, H(t).rest);
				}), G(e, n);
			}, o = (e) => {
				var t = Df(), n = z(t, !0);
				V(() => K(n, H(d).missing)), G(e, t);
			};
			q(i, (e) => {
				H(d).estimate ? e(a) : H(d).missing && e(o, 1);
			}), V(() => K(r, H(d).exact)), G(e, t);
		};
		q(b, (e) => {
			H(d) && e(x);
		}), A(o), V(() => {
			K(f, H(u).label), K(m, `${H(u).value ?? ""} `), K(h, H(u).secondary), K(y, H(u).note);
		}), G(e, t);
	};
	q(p, (e) => {
		H(u) && e(m);
	}), G(e, f), M();
}
var jf = [
	{
		field: "cache_read",
		label: "Cache read",
		color: "var(--context-read)"
	},
	{
		field: "cache_write",
		label: "Cache write",
		color: "var(--context-write)"
	},
	{
		field: "new_input",
		label: "New input",
		color: "var(--context-new)"
	}
], Mf = {
	manual: "/compact",
	auto: "auto-compact"
}, Nf = "No turns with usage.", Pf = "No turn grew the context.", Ff = "No compactions.", If = `${Ts} Each compaction is compared over its own stretch, up to the next one; the Estimated cost tile adds up the main thread's.`;
function Lf(e) {
	return e.agent_id ?? "main";
}
function Rf(e) {
	return e.agent_id === null ? "main thread" : e.description ? `${e.agent_type} · ${e.description}` : e.agent_type;
}
function zf(e) {
	return e.filter((e) => e.context_per_turn.length);
}
function Bf(e, t) {
	let n = zf(e);
	return n.find((e) => Lf(e) === t) ?? n[0] ?? null;
}
function Vf(e) {
	let t = zf(e);
	if (t.length < 2) return [];
	let n = [], r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = {
			value: Lf(e),
			label: Rf(e)
		};
		if (e.workflow_run === null) {
			n.push({
				kind: "option",
				...t
			});
			continue;
		}
		let i = r.get(e.workflow_run);
		i || (i = {
			kind: "group",
			key: e.workflow_run,
			label: `workflow · ${e.workflow_name || e.workflow_run}`,
			options: []
		}, r.set(e.workflow_run, i), n.push(i)), i.options.push(t);
	}
	return n;
}
function Hf(e, t) {
	return `${e}-${t ? Lf(t) : "none"}`;
}
function Uf(e) {
	return e ? `${Rf(e)}: every turn sends its whole context again` : "";
}
function Wf(e, t) {
	let n = t.map((e) => e.context), r = n[n.length - 1] ?? 0;
	return `Context per turn of the ${Rf(e)}, by cache read, cache write and new input: ${t.length} turns, peak ${X(Math.max(...n))}, last ${X(r)}; table view available`;
}
var Gf = 206;
function Kf(e) {
	return za(Math.max(0, ...e.map((e) => e.context)));
}
function qf(e) {
	return (t) => 178 - 160 * t / e;
}
function Jf(e, t, n) {
	let r = e.map(() => 0);
	return jf.map((i) => {
		let a = r.map((t, n) => t + (e[n]?.[i.field] ?? 0)), o = (e, r) => `${t(r).toFixed(1)},${n(e).toFixed(1)}`, s = a.map(o), c = r.map(o).reverse(), l = r;
		if (r = a, e.length === 1) {
			let e = n(a[0] ?? 0);
			return {
				part: i,
				kind: "column",
				x: t(0) - 6,
				y: e,
				width: 12,
				height: Math.max(0, n(l[0] ?? 0) - e)
			};
		}
		return {
			part: i,
			kind: "area",
			area: `M${s.join("L")}L${c.join("L")}Z`,
			edge: `M${s.join("L")}`
		};
	});
}
function Yf(e, t, n) {
	return !e || e > t ? null : {
		y: Math.round(n(e)) + .5,
		text: `hint ${X(e)}`
	};
}
function Xf(e, t) {
	if (!t.ts) return -1;
	let n = Date.parse(t.ts);
	return e.findIndex((e) => e.ts && Date.parse(e.ts) > n);
}
function Zf(e, t, n) {
	let r = [], i = -Infinity;
	return e.forEach((e, a) => {
		let o = Xf(t, e);
		if (o < 0) return;
		let s = o > 0 ? (n(o - 1) + n(o)) / 2 : n(0), c = s - i >= 44;
		c && (i = s), r.push({
			key: String(a),
			x: s,
			label: c ? Mf[e.trigger ?? ""] ?? "compaction" : null
		});
	}), r;
}
function Qf(e, t, n, r) {
	let i = e.length - 1, a = qa(e);
	return (a === i ? [i] : [a, i]).map((a) => {
		let o = a === i, s = e[a] ?? 0, c = r.some((e) => e >= t(a) && e - t(a) < 44);
		return {
			key: o ? "last" : "peak",
			x: o ? t(a) + 9 : c ? t(a) - 6 : t(a),
			y: o ? n(s) + 4 : n(s) - 8,
			anchor: o ? "start" : c ? "end" : "middle",
			text: o ? X(s) : `peak ${X(s)}`
		};
	});
}
function $f(e, t) {
	let n = e[t], r = n?.effort ? ` · effort ${n.effort}` : "";
	return `Turn ${Z(t + 1)} of ${Z(e.length)} · ${Ia(n?.ts ?? null)}${r}`;
}
function ep(e) {
	let t = [];
	if (e.growth !== null && t.push(`grew ${Ea(e.growth)} beyond the last reply`), e.rebuild) {
		let n = e.rebuild.extra_cost === null ? "" : `, +${Q(e.rebuild.extra_cost)}`;
		t.push(`cache rebuilt: ${Cs[e.rebuild.cause]} (${X(e.rebuild.lost)}${n})`);
	}
	return t;
}
function tp(e) {
	return [
		`context ${X(e.context)}`,
		...jf.map((t) => `${t.label.toLowerCase()} ${X(e[t.field])}`),
		...ep(e)
	];
}
function np(e, t) {
	let n = e[t];
	return n ? `${$f(e, t)}: ${tp(n).join(", ")}` : "";
}
var rp = [
	{
		label: "Turn",
		numeric: !0
	},
	{ label: "Time" },
	{ label: "Effort" },
	...jf.map((e) => ({
		label: e.label,
		numeric: !0
	})),
	{
		label: "Context",
		numeric: !0
	},
	{
		label: "Growth",
		numeric: !0
	},
	{ label: "Cache rebuild" }
];
function ip(e) {
	let t = /* @__PURE__ */ new Map();
	return e.map((e, n) => {
		let r = t.get(e.message_id) ?? 0;
		return t.set(e.message_id, r + 1), {
			key: r ? `${e.message_id}#${r}` : e.message_id,
			cells: [
				Z(n + 1),
				Ia(e.ts),
				e.effort || "–",
				...jf.map((t) => Z(e[t.field])),
				Z(e.context),
				e.growth === null ? "–" : Ea(e.growth),
				e.rebuild ? `${e.rebuild.cause} · ${X(e.rebuild.lost)}` : "–"
			]
		};
	});
}
function ap(e) {
	let { overhead: t, rebuilds: n } = e, r = Object.entries(Mf).map(([t, n]) => [n, e.compactions.filter((e) => e.trigger === t).length]).filter(([, e]) => e).map(([e, t]) => `${Z(t)} ${e}`), i = e.context_per_turn.map((e) => e.growth).filter((e) => e !== null), a = i.length ? i.reduce((e, t) => e + t, 0) / i.length : null;
	return [
		{
			label: "Fixed overhead",
			value: t ? X(t.tokens) : "–",
			note: t ? `the first call's context (system prompt, tools, CLAUDE.md); reading it again cost ${Q(t.cost)}` : "no turns"
		},
		{
			label: "Cache rebuilds",
			value: Z(n.count),
			note: n.count ? `${X(n.lost)} tokens written again, ${Q(n.cost)} extra` : "every turn read the previous context from the cache"
		},
		{
			label: "Compactions",
			value: Z(e.compactions.length),
			note: r.length ? r.join(", ") : "none"
		},
		{
			label: "Growth per turn",
			value: a === null ? "–" : Ea(Math.round(a)),
			note: "mean of what each turn added beyond the last reply: tool results, prompts, attachments"
		}
	];
}
function op(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.tool) ?? {
			calls: 0,
			chars: 0
		};
		e.calls += 1, e.chars += n.result_chars, t.set(n.tool, e);
	}
	return [...t].map(([e, t]) => `${e}${t.calls > 1 ? ` ×${t.calls}` : ""} ${X(t.chars)}`).join(", ");
}
var sp = [
	{
		label: "Turn",
		numeric: !0
	},
	{ label: "Time" },
	{
		label: "Growth",
		numeric: !0
	},
	{ label: "Tools the call before ran (result characters)" }
];
function cp(e) {
	let t = new Map(e.context_per_turn.map((e, t) => [e.message_id, t + 1]));
	return e.top_growth.map((e) => ({
		key: e.message_id,
		cells: [
			Z(t.get(e.message_id) ?? null),
			Ia(e.ts),
			X(e.growth),
			e.tools.length ? op(e.tools) : "none: a prompt or attachments"
		]
	}));
}
function lp(e) {
	if (!e || !e.compactions) return null;
	let t = e.net >= 0;
	return {
		tone: t ? "gain" : "loss",
		title: "Each compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out" + (e.unknown ? `, ${Z(e.unknown)} without an estimate not summed` : "") + ".",
		text: t ? `▲ saved ~${Q(e.net)} so far` : `▼ cost ~${Q(-e.net)} more so far`
	};
}
function up(e) {
	return lp(Ss(e));
}
var dp = [
	{ label: "Time" },
	{ label: "Trigger" },
	{
		label: "Before",
		numeric: !0
	},
	{
		label: "After",
		numeric: !0
	},
	{
		label: "Took",
		numeric: !0
	},
	{
		label: "Each later call",
		numeric: !0
	},
	{
		label: "Cost once",
		numeric: !0
	},
	{
		label: "Pays off at",
		numeric: !0
	},
	{
		label: "Calls after",
		numeric: !0
	},
	{ label: "Versus keeping" }
];
function fp(e) {
	let t = /* @__PURE__ */ new Map();
	return e.map((e) => {
		let n = `${e.ts}|${e.trigger}`, r = t.get(n) ?? 0;
		t.set(n, r + 1);
		let i = e.versus_keeping, a = {
			text: X(e.next_context ?? e.post_tokens),
			title: `Claude Code reports ${X(e.post_tokens)}: without the system prompt, tools and CLAUDE.md the next call sends again`
		};
		return {
			key: r ? `${n}#${r}` : n,
			time: Ia(e.ts),
			trigger: Mf[e.trigger ?? ""] || e.trigger || "–",
			before: X(e.pre_tokens),
			after: a,
			took: Oa(e.duration_ms),
			versus: i ? {
				each: i.difference > 0 ? `−${X(i.difference)} · ${Q(i.saving_per_call)}` : `+${X(Math.abs(i.difference))} · nothing saved`,
				oneTime: {
					text: As(i),
					title: js(i)
				},
				paysOff: {
					text: Os(i) ?? "–",
					title: (i.breakeven_call ?? 0) > i.calls_after ? "projected past the last call" : null
				},
				callsAfter: {
					text: Z(i.calls_after),
					title: i.last_stretch ? "up to the last call" : "up to the next compaction"
				},
				verdict: {
					text: Es(i),
					tone: xs(i),
					words: Ds(i),
					title: Ms(i)
				}
			} : null
		};
	});
}
//#endregion
//#region src/components/ContextChart.svelte
var pp = /* @__PURE__ */ U([["path"], ["path", {
	fill: "none",
	stroke: "var(--surface)",
	"stroke-width": "2",
	"stroke-linejoin": "round"
}]], 5), mp = /* @__PURE__ */ U([["rect"]], 4), hp = /* @__PURE__ */ U([["line", { class: "reference-line" }], [
	"text",
	{ class: "axis-text" },
	" "
]], 5), gp = /* @__PURE__ */ U([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4), _p = /* @__PURE__ */ U([["line", { class: "compaction-rule" }], ,], 5), vp = /* @__PURE__ */ U([[
	"text",
	{ class: "value-text" },
	" "
]], 4), yp = /* @__PURE__ */ U([
	,
	,
	,
	["line", { stroke: "var(--axis)" }],
	,
	,
	,
	,
], 5), bp = /* @__PURE__ */ U([["line", { class: "crosshair" }], ,], 5), xp = /* @__PURE__ */ U([[
	"div",
	{ class: "row" },
	,
	" ",
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "name" },
		" "
	]
]]), Sp = /* @__PURE__ */ U([[
	"div",
	{ class: "name" },
	" "
]]), Cp = /* @__PURE__ */ U([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "row" },
		["span", { class: "key" }],
		" ",
		[
			"strong",
			null,
			" "
		],
		" ",
		[
			"span",
			{ class: "name" },
			"context"
		]
	],
	" ",
	,
], 1);
function wp(e, t) {
	j(t, !0);
	let n = (e, n = b) => {
		let r = /* @__PURE__ */ N(() => n() - 64), i = /* @__PURE__ */ N(() => Ha(t.turns.length, 56, H(r))), a = /* @__PURE__ */ N(() => Yf(t.hintTokens, H(o), H(s))), l = /* @__PURE__ */ N(() => Zf(t.compactions, t.turns, H(i)));
		var u = yp(), d = R(u);
		{
			let e = /* @__PURE__ */ N(() => Ba(H(o), 4));
			Kc(d, {
				get left() {
					return 56;
				},
				get right() {
					return H(r);
				},
				get values() {
					return H(e);
				},
				get yOf() {
					return H(s);
				},
				get format() {
					return X;
				}
			});
		}
		var f = B(d);
		J(f, 17, () => Jf(t.turns, H(i), H(s)), (e) => e.part.field, (e, t) => {
			var n = W(), r = R(n), i = (e) => {
				var n = pp(), r = R(n), i = B(r);
				V(() => {
					Y(r, "d", H(t).area), Y(r, "fill", H(t).part.color), Y(i, "d", H(t).edge);
				}), G(e, n);
			}, a = (e) => {
				var n = mp();
				V(() => {
					Y(n, "x", H(t).x), Y(n, "y", H(t).y), Y(n, "width", H(t).width), Y(n, "height", H(t).height), Y(n, "fill", H(t).part.color);
				}), G(e, n);
			};
			q(r, (e) => {
				H(t).kind === "area" ? e(i) : e(a, -1);
			}), G(e, n);
		});
		var p = B(f), m = B(p), h = (e) => {
			var t = hp(), n = R(t), i = B(n), o = z(i, !0);
			V(() => {
				Y(n, "x1", 56), Y(n, "x2", H(r)), Y(n, "y1", H(a).y), Y(n, "y2", H(a).y), Y(i, "x", H(r) + 6), Y(i, "y", H(a).y + 4), K(o, H(a).text);
			}), G(e, t);
		};
		q(m, (e) => {
			H(a) && e(h);
		});
		var g = B(m);
		J(g, 17, () => H(l), (e) => e.key, (e, t) => {
			var n = _p(), r = R(n), i = B(r), a = (e) => {
				var n = gp(), r = z(n, !0);
				V(() => {
					Y(n, "x", H(t).x), Y(n, "y", 10), K(r, H(t).label);
				}), G(e, n);
			};
			q(i, (e) => {
				H(t).label && e(a);
			}), V(() => {
				Y(r, "x1", H(t).x), Y(r, "x2", H(t).x), Y(r, "y1", 14), Y(r, "y2", 178);
			}), G(e, n);
		});
		var _ = B(g);
		J(_, 17, () => Qf(H(c), H(i), H(s), H(l).map((e) => e.x)), (e) => e.key, (e, t) => {
			var n = vp(), r = z(n, !0);
			V(() => {
				Y(n, "x", H(t).x), Y(n, "y", H(t).y), Y(n, "text-anchor", H(t).anchor), K(r, H(t).text);
			}), G(e, n);
		});
		var v = B(_);
		{
			let e = /* @__PURE__ */ N(() => 196);
			Wc(v, {
				get count() {
					return t.turns.length;
				},
				get xOf() {
					return H(i);
				},
				get y() {
					return H(e);
				},
				text: (e) => e === 0 ? "turn 1" : String(e + 1),
				most: 6
			});
		}
		V((e, t) => {
			Y(p, "x1", e), Y(p, "x2", t), Y(p, "y1", 178), Y(p, "y2", 178);
		}, [() => H(i)(0), () => H(i)(t.turns.length - 1)]), G(e, u);
	}, r = (e, n = b, r = b) => {
		let i = /* @__PURE__ */ N(() => Ha(t.turns.length, 56, n() - 64)(r()));
		var a = bp(), o = R(a), l = B(o);
		{
			let e = /* @__PURE__ */ N(() => H(s)(H(c)[r()] ?? 0));
			mu(l, {
				get x() {
					return H(i);
				},
				get y() {
					return H(e);
				},
				color: "var(--context-new)"
			});
		}
		V(() => {
			Y(o, "x1", H(i)), Y(o, "x2", H(i)), Y(o, "y1", 18), Y(o, "y2", 178);
		}), G(e, a);
	}, i = (e, n = b) => {
		let r = /* @__PURE__ */ N(() => t.turns[n()]);
		var i = W(), a = R(i), o = (e) => {
			var i = Cp(), a = R(i), o = z(a, !0), s = B(a, 2);
			J(s, 17, () => jf.toReversed(), (e) => e.field, (e, t) => {
				var n = xp(), i = L(n);
				Mc(i, { get fill() {
					return H(t).color;
				} });
				var a = B(i, 2), o = z(a, !0), s = z(B(a, 2), !0);
				A(n), V((e) => {
					K(o, e), K(s, H(t).label);
				}, [() => X(H(r)[H(t).field])]), G(e, n);
			});
			var c = B(s, 2), l = z(B(L(c), 2), !0);
			Ne(2), A(c), J(B(c, 2), 16, () => ep(H(r)), (e) => e, (e, t) => {
				var n = Sp(), r = z(n, !0);
				V(() => K(r, t)), G(e, n);
			}), V((e, t) => {
				K(o, e), K(l, t);
			}, [() => $f(t.turns, n()), () => X(H(r).context)]), G(e, i);
		};
		q(a, (e) => {
			H(r) && e(o);
		}), G(e, i);
	}, a = /* @__PURE__ */ N(() => ec(t.containerWidth)), o = /* @__PURE__ */ N(() => Kf(t.turns)), s = /* @__PURE__ */ N(() => qf(H(o))), c = /* @__PURE__ */ N(() => t.turns.map((e) => e.context)), l = /* @__PURE__ */ N(() => ({
		count: t.turns.length,
		label: "Context per turn by part; arrow keys step through the turns",
		valueText: (e) => np(t.turns, e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: 178
		}),
		indexAt: (e) => Ua(56, e - 64, t.turns.length),
		tipX: (e, n) => Ha(t.turns.length, 56, e - 64)(n)
	}));
	Dc(e, {
		get height() {
			return Gf;
		},
		get label() {
			return t.label;
		},
		get width() {
			return H(a);
		},
		get containerWidth() {
			return t.containerWidth;
		},
		get cursor() {
			return H(l);
		},
		get plot() {
			return n;
		},
		get marks() {
			return r;
		},
		get tip() {
			return i;
		}
	}), M();
}
//#endregion
//#region src/components/StatTile.svelte
var Tp = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Ep = /* @__PURE__ */ U([[
	"div",
	{ class: "card" },
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	[
		"div",
		{ class: "tile-value" },
		" "
	],
	" ",
	,
]]);
function Dp(e, t) {
	j(t, !0);
	let n = $i(t, "note", 3, null), r = $i(t, "themedNote", 3, !1), { hype: i } = as();
	var a = Ep(), o = L(a), s = z(o, !0), c = B(o, 2), l = z(c, !0), u = B(c, 2), d = (e) => {
		var t = Tp(), a = z(t, !0);
		V((e) => K(a, e), [() => r() ? i(n()) : n()]), G(e, t);
	};
	q(u, (e) => {
		n() && e(d);
	}), A(a), V((e) => {
		K(s, e), K(l, t.value);
	}, [() => i(t.label)]), G(e, a), M();
}
//#endregion
//#region src/components/ContextDetails.svelte
var Op = (e) => {
	G(e, jp());
}, kp = (e, t = b) => {
	var n = W();
	J(R(n), 19, () => sp, (e) => e.label, (e, n, r) => {
		var i = Mp(), a = z(i, !0);
		V(() => {
			Ti(i, 1, yi(H(n).numeric ? "num" : void 0)), K(a, t().cells[H(r)]);
		}), G(e, i);
	}), G(e, n);
}, Ap = (e, t = b) => {
	var n = Lp(), r = R(n), i = z(r, !0), a = B(r, 2), o = z(a, !0), s = B(a, 2), c = z(s, !0), l = B(s, 2), u = z(l, !0), d = B(l, 2), f = z(d, !0), p = B(d, 2), m = (e) => {
		let n = /* @__PURE__ */ N(() => t().versus);
		var r = Fp(), i = R(r), a = z(i, !0), o = B(i, 2), s = z(o, !0), c = B(o, 2), l = z(c, !0), u = B(c, 2), d = z(u, !0), f = B(u, 2), p = L(f), m = z(p, !0);
		A(f), V(() => {
			K(a, H(n).each), Y(o, "title", H(n).oneTime.title), K(s, H(n).oneTime.text), Y(c, "title", H(n).paysOff.title), K(l, H(n).paysOff.text), Y(u, "title", H(n).callsAfter.title), K(d, H(n).callsAfter.text), Y(f, "title", H(n).verdict.title), Ti(p, 1, yi(H(n).verdict.tone ? `verdict-${H(n).verdict.tone}` : void 0)), Y(p, "title", H(n).verdict.words), K(m, H(n).verdict.text);
		}), G(e, r);
	}, h = (e) => {
		G(e, Ip());
	};
	q(p, (e) => {
		t().versus ? e(m) : e(h, -1);
	}), V(() => {
		K(i, t().time), K(o, t().trigger), K(c, t().before), Y(l, "title", t().after.title), K(u, t().after.text), K(f, t().took);
	}), G(e, n);
}, jp = /* @__PURE__ */ U([[
	"h3",
	{ id: "growth-title" },
	"Biggest growth steps"
]]), Mp = /* @__PURE__ */ U([[
	"td",
	null,
	" "
]]), Np = /* @__PURE__ */ U([[
	"span",
	null,
	" "
]]), Pp = /* @__PURE__ */ U([[
	"h3",
	{ id: "compactions-title" },
	"Compactions",
	,
]]), Fp = /* @__PURE__ */ U([
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		null,
		[
			"span",
			null,
			" "
		]
	]
], 1), Ip = /* @__PURE__ */ U([[
	"td",
	{
		colspan: "5",
		class: "muted"
	},
	"no call after it, or no price for its model"
]]), Lp = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	,
], 1), Rp = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), zp = /* @__PURE__ */ U([
	["div", { class: "kpis session-kpis" }],
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function Bp(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = Pp(), n = B(L(t)), r = (e) => {
			var t = Np(), n = z(t, !0);
			V(() => {
				Ti(t, 1, `compaction-total verdict-${H(a).tone ?? ""}`), Y(t, "title", H(a).title), K(n, H(a).text);
			}), G(e, t);
		};
		q(n, (e) => {
			H(a) && e(r);
		}), A(t), G(e, t);
	}, r = /* @__PURE__ */ N(() => cp(t.agent)), i = /* @__PURE__ */ N(() => fp(t.agent.compactions)), a = /* @__PURE__ */ N(() => up(t.agent.compactions));
	var o = zp(), s = R(o);
	J(s, 21, () => ap(t.agent), (e) => e.label, (e, t) => {
		Dp(e, {
			get label() {
				return H(t).label;
			},
			get value() {
				return H(t).value;
			},
			get note() {
				return H(t).note;
			}
		});
	}), A(s);
	var c = B(s, 2);
	Hc(c, {
		get key() {
			return `${t.key ?? ""}-growth`;
		},
		labelledby: "growth-title",
		get columns() {
			return sp;
		},
		get rows() {
			return H(r);
		},
		rowKey: (e) => e.key,
		get cells() {
			return kp;
		},
		get heading() {
			return Op;
		},
		get empty() {
			return Pf;
		}
	});
	var l = B(c, 2);
	Hc(l, {
		get key() {
			return `${t.key ?? ""}-compactions`;
		},
		labelledby: "compactions-title",
		get columns() {
			return dp;
		},
		get rows() {
			return H(i);
		},
		rowKey: (e) => e.key,
		get cells() {
			return Ap;
		},
		get heading() {
			return n;
		},
		get empty() {
			return Ff;
		}
	});
	var u = B(l, 2), d = (e) => {
		var t = Rp(), n = z(t, !0);
		V(() => K(n, If)), G(e, t);
	};
	q(u, (e) => {
		H(i).length && e(d);
	}), G(e, o), M();
}
//#endregion
//#region src/components/ContextPerTurn.svelte
var Vp = (e, t = b) => {
	var n = W();
	J(R(n), 19, () => rp, (e) => e.label, (e, n, r) => {
		var i = Hp(), a = z(i, !0);
		V(() => {
			Ti(i, 1, yi(H(n).numeric ? "num" : void 0)), K(a, t().cells[H(r)]);
		}), G(e, i);
	}), G(e, n);
}, Hp = /* @__PURE__ */ U([[
	"td",
	null,
	" "
]]), Up = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), Wp = /* @__PURE__ */ U([["optgroup"]]), Gp = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), Kp = /* @__PURE__ */ U([["select", {
	id: "context-agent",
	"aria-label": "Transcript the context section shows"
}]]), qp = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), Jp = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), Yp = /* @__PURE__ */ U([
	[
		"div",
		{ class: "chart-head" },
		[
			"h3",
			{ id: "context-title" },
			"Context per turn"
		],
		" ",
		[
			"span",
			{
				id: "context-note",
				class: "muted"
			},
			" "
		],
		" ",
		["span", { class: "spacer" }],
		" ",
		,
		" ",
		[
			"button",
			{
				type: "button",
				id: "context-table-toggle"
			},
			"Table view"
		]
	],
	" ",
	[
		"div",
		{ class: "legend" },
		,
		" ",
		[
			"span",
			null,
			["span", { class: "legend-rule" }],
			"compaction"
		]
	],
	" ",
	[
		"div",
		{
			id: "context-chart",
			class: "chart"
		},
		,
	],
	" ",
	,
	" ",
	[
		"div",
		{ id: "context-details" },
		,
	]
], 1);
function Xp(e, t) {
	j(t, !0);
	let { payload: n } = as(), r = /* @__PURE__ */ N(() => n.session), i = /* @__PURE__ */ F("main"), a = /* @__PURE__ */ F(!1), o = /* @__PURE__ */ F(0), s = /* @__PURE__ */ N(() => H(r) ? Bf(H(r).agents, H(i)) : null), c = /* @__PURE__ */ N(() => H(s)?.context_per_turn ?? []), l = /* @__PURE__ */ N(() => H(r) ? Vf(H(r).agents) : []), u = /* @__PURE__ */ N(() => H(r) ? Hf(H(r).session_id, H(s)) : ""), d = /* @__PURE__ */ N(() => ip(H(c)));
	var f = W(), p = R(f), m = (e) => {
		var t = Yp(), n = R(t), f = B(L(n), 2), p = z(f, !0), m = B(f, 4), h = (e) => {
			var t = Kp();
			J(t, 21, () => H(l), (e) => e.kind === "group" ? `group:${e.key}` : e.value, (e, t) => {
				var n = W(), r = R(n), i = (e) => {
					var n = Wp();
					J(n, 21, () => H(t).options, (e) => e.value, (e, t) => {
						var n = Up(), r = z(n, !0), i = {};
						V(() => {
							K(r, H(t).label), i !== (i = H(t).value) && (n.value = (n.__value = i) ?? "");
						}), G(e, n);
					}), A(n), V(() => Y(n, "label", H(t).label)), G(e, n);
				}, a = (e) => {
					var n = Gp(), r = z(n, !0), i = {};
					V(() => {
						K(r, H(t).label), i !== (i = H(t).value) && (n.value = (n.__value = i) ?? "");
					}), G(e, n);
				};
				q(r, (e) => {
					H(t).kind === "group" ? e(i) : e(a, -1);
				}), G(e, n);
			}), A(t), ji(t), Mi(t, () => H(s) ? Lf(H(s)) : H(i), (e) => I(i, e, !0)), G(e, t);
		};
		q(m, (e) => {
			H(l).length && e(h);
		});
		var g = B(m, 2);
		A(n);
		var _ = B(n, 2);
		J(L(_), 17, () => jf.toReversed(), (e) => e.field, (e, t) => {
			var n = qp(), r = L(n);
			Mc(r, { get fill() {
				return H(t).color;
			} });
			var i = B(r, 1, !0);
			A(n), V(() => K(i, H(t).label)), G(e, n);
		}), Ne(2), A(_);
		var v = B(_, 2), y = L(v), b = (e) => {
			{
				let t = /* @__PURE__ */ N(() => Wf(H(s), H(c)));
				wp(e, {
					get turns() {
						return H(c);
					},
					get compactions() {
						return H(s).compactions;
					},
					get hintTokens() {
						return H(r).compact_hint_tokens;
					},
					get label() {
						return H(t);
					},
					get containerWidth() {
						return H(o);
					}
				});
			}
		}, x = (e) => {
			var t = Jp(), n = z(t, !0);
			V(() => K(n, Nf)), G(e, t);
		};
		q(y, (e) => {
			H(s) && H(c).length ? e(b) : e(x, -1);
		}), A(v);
		var S = B(v, 2), ee = (e) => {
			Hc(e, {
				id: "context-table",
				labelledby: "context-title",
				get key() {
					return `${H(u) ?? ""}-turns`;
				},
				get columns() {
					return rp;
				},
				get rows() {
					return H(d);
				},
				rowKey: (e) => e.key,
				get cells() {
					return Vp;
				},
				get empty() {
					return Nf;
				}
			});
		};
		q(S, (e) => {
			H(a) && e(ee);
		});
		var C = B(S, 2), w = L(C), te = (e) => {
			Bp(e, {
				get agent() {
					return H(s);
				},
				get key() {
					return H(u);
				}
			});
		};
		q(w, (e) => {
			H(s) && e(te);
		}), A(C), V((e) => {
			K(p, e), Y(g, "aria-pressed", H(a));
		}, [() => Uf(H(s))]), Br("click", g, () => I(a, !H(a))), Ji(v, "clientWidth", (e) => I(o, e)), G(e, t);
	};
	q(p, (e) => {
		H(r) && e(m);
	}), G(e, f), M();
}
Vr(["click"]);
//#endregion
//#region src/lib/conversation.ts
function Zp(e, t) {
	let n = t ? `?agent=${encodeURIComponent(t)}` : "";
	return `/api/session/${encodeURIComponent(e)}/chat${n}`;
}
function Qp(e) {
	return e ? "Oldest first: click for newest first" : "Newest first: click for oldest first";
}
function $p(e) {
	let t = e.agent_id === null ? "Main thread" : `${e.agent_type}${e.description ? ` · ${e.description}` : ""}`;
	return {
		value: e.agent_id ?? "",
		label: t
	};
}
function em(e) {
	let t = [], n = /* @__PURE__ */ new Map();
	for (let r of e) {
		if (r.agent_type === "(background)") continue;
		if (r.workflow_run === null) {
			t.push($p(r));
			continue;
		}
		let e = n.get(r.workflow_run);
		e || (e = {
			group: `workflow · ${r.workflow_name || r.workflow_run}`,
			options: []
		}, n.set(r.workflow_run, e), t.push(e)), e.options.push($p(r));
	}
	return t;
}
function tm(e) {
	return e?.calls ? `Claude Code's token reminder went with ${Z(e.calls)} calls, ${Z(e.chars)} characters in all; each call's badge counts it (hover the badge).` : null;
}
function nm(e) {
	return e.available ? e.entries.length ? null : "No conversation in this transcript yet." : "The transcript is gone: Claude Code deleted it after its cleanup period. The usage history stays.";
}
function rm(e, t) {
	return JSON.stringify(e) === JSON.stringify(t);
}
function im(e, t) {
	if (!e) return t;
	let n = t.entries.map((t, n) => {
		let r = e.entries[n];
		return r && JSON.stringify(r) === JSON.stringify(t) ? r : t;
	});
	return {
		...t,
		entries: n
	};
}
//#endregion
//#region src/lib/entries.ts
var am = {
	prompt: "You",
	text: "Claude",
	thinking: "Thinking"
};
function om(e) {
	return am[e] ?? e;
}
function sm(e) {
	return e.kind === "prompt" ? "" : [e.model, e.effort ? `effort ${e.effort}` : null].filter(Boolean).join(" · ");
}
function cm(e, t) {
	return t > e.length ? ` · first ${Z(e.length)} of ${Z(t)} characters` : "";
}
var lm = /<command-name>([^<]*)<\/command-name>/, um = /<command-args>([^<]*)<\/command-args>/;
function dm(e) {
	let t = e.match(lm);
	if (t) {
		let n = (e.match(um) ?? [])[1] ?? "";
		return {
			kind: "command",
			text: `${(t[1] ?? "").trim()} ${n.trim()}`.trim()
		};
	}
	let n = fm(e);
	return n === null ? {
		kind: "markdown",
		text: e
	} : {
		kind: "json",
		code: n
	};
}
function fm(e) {
	let t = e.trim();
	if (!t.startsWith("{") && !t.startsWith("[")) return null;
	try {
		return JSON.stringify(JSON.parse(t), null, 2);
	} catch {
		return null;
	}
}
var pm = {
	py: "python",
	js: "javascript",
	mjs: "javascript",
	cjs: "javascript",
	jsx: "javascript",
	ts: "typescript",
	tsx: "typescript",
	json: "json",
	sh: "bash",
	bash: "bash",
	zsh: "bash",
	php: "php",
	rb: "ruby",
	go: "go",
	rs: "rust",
	java: "java",
	kt: "kotlin",
	swift: "swift",
	c: "c",
	h: "c",
	cpp: "cpp",
	hpp: "cpp",
	cs: "csharp",
	css: "css",
	scss: "scss",
	less: "less",
	html: "xml",
	xml: "xml",
	svg: "xml",
	vue: "xml",
	md: "markdown",
	yml: "yaml",
	yaml: "yaml",
	toml: "ini",
	ini: "ini",
	cfg: "ini",
	sql: "sql",
	lua: "lua",
	pl: "perl",
	r: "r",
	graphql: "graphql",
	diff: "diff",
	patch: "diff",
	mk: "makefile"
}, mm = {
	Makefile: "makefile",
	Dockerfile: "bash",
	".bashrc": "bash",
	".zshrc": "bash"
};
function hm(e) {
	if (!e) return null;
	let t = e.split("/").pop() ?? "", n = mm[t];
	if (n) return n;
	let r = t.lastIndexOf(".");
	return r > 0 ? pm[t.slice(r + 1).toLowerCase()] ?? null : null;
}
function gm(e) {
	return e ? pm[e] ?? e : null;
}
function _m(e) {
	return Object.fromEntries((e.tool_fields ?? []).map((e) => [e.name, e]));
}
function vm(e) {
	let t = _m(e).description;
	return (e.tool === "Bash" && t ? t.value : e.summary) ?? "";
}
function ym(e) {
	return e.result === null ? " · no result yet" : e.is_error ? " · ⚠ failed" : "";
}
function bm(e, t) {
	let n = (e) => e ? e.split("\n") : [];
	return [...n(e).map((e) => `- ${e}`), ...n(t).map((e) => `+ ${e}`)].join("\n");
}
function xm(e) {
	return e.map((e) => {
		let t = e.value.includes("\n");
		return {
			name: e.name,
			label: `${e.name}${cm(e.value, e.chars)}`,
			value: e.value,
			shape: e.is_json ? "json" : t ? "block" : "line",
			inline: !t
		};
	});
}
function Sm(e) {
	let t = _m(e), n = e.tool_fields ?? [], r = (e) => xm(n.filter((t) => !e.includes(t.name))), { command: i, description: a, file_path: o, old_string: s, new_string: c, content: l } = t;
	if (e.tool === "Bash" && i) return {
		kind: "bash",
		description: a ? a.value : null,
		label: `Command${cm(i.value, i.chars)}`,
		command: i.value,
		rest: r(["command", "description"])
	};
	if (e.tool === "Edit" && o && (s || c)) {
		let e = s ?? {
			value: "",
			chars: 0
		}, t = c ?? {
			value: "",
			chars: 0
		}, n = e.chars > e.value.length || t.chars > t.value.length;
		return {
			kind: "edit",
			path: o.value,
			label: `Change${n ? " · cut to the first 4,000 characters of each side" : ""}`,
			diff: bm(e.value, t.value),
			rest: r([
				"file_path",
				"old_string",
				"new_string"
			])
		};
	}
	return e.tool === "Write" && o && l ? {
		kind: "write",
		path: o.value,
		label: `Content${cm(l.value, l.chars)}`,
		content: l.value,
		language: hm(o.value),
		rest: r(["file_path", "content"])
	} : {
		kind: "fields",
		label: "Input",
		rest: xm(n)
	};
}
function Cm(e) {
	let t = e.result ?? "";
	if (e.result_chars <= t.length) {
		let e = fm(t);
		if (e !== null) return {
			kind: "code",
			code: e,
			language: "json"
		};
	}
	let n = _m(e).file_path;
	return e.tool === "Read" && n && !e.is_error ? {
		kind: "code",
		code: t,
		language: hm(n.value)
	} : {
		kind: "text",
		text: t
	};
}
function wm(e) {
	return `Result${cm(e.result ?? "", e.result_chars)}`;
}
var Tm = {
	meta: "meta record",
	skill: "skill text",
	summary: "compact summary"
};
function Em(e) {
	return Tm[e] ?? e.replaceAll("_", " ");
}
function Dm(e) {
	let t = e.reduce((e, t) => e + t.chars, 0);
	return `${e.length === 1 ? "1 item" : `${Z(e.length)} items`} · ${Z(t)} characters`;
}
function Om(e) {
	let t = e.compaction ?? {
		trigger: null,
		pre_tokens: null,
		post_tokens: null,
		duration_ms: null
	}, n = [e.text ?? ""];
	if (t.trigger && n.push(t.trigger), t.pre_tokens !== null) {
		let r = e.versus_keeping ? `next call ${X(e.versus_keeping.after)}` : `${X(t.post_tokens)} tokens`;
		n.push(`${X(t.pre_tokens)} → ${r}`);
	}
	return t.duration_ms && n.push(`took ${Oa(t.duration_ms)}`), n.join(" · ");
}
function km(e) {
	return e.kind === "error" ? `⚠ API error: ${e.text ?? ""}` : Om(e);
}
function Am(e) {
	return [
		ks(e),
		`${Z(e.calls_after)} calls after`,
		`cost ${As(e)} once`
	].filter(Boolean).join(" · ");
}
function jm(e) {
	return ` (${Ea(e)})`;
}
function Mm(e) {
	if (e.growth === null || e.growth === void 0) return "";
	if (!e.reply) return jm(e.growth);
	let t = e.growth < 0 ? Ea(e.growth) : X(e.growth);
	return ` (${Ea(e.reply + e.growth)}: reply ${X(e.reply)}, added ${t})`;
}
function Nm(e) {
	let t = [`context ${X(e.context)}${Mm(e)}`, `in ${X(e.new_input)}`];
	return e.cache_write && t.push(`cache write ${X(e.cache_write)}`), e.cache_read && t.push(`cache read ${X(e.cache_read)}`), t.push(`out ${X(e.output)}`), e.web_searches && t.push(`${Z(e.web_searches)} web searches`), e.speed !== "standard" && t.push("fast mode"), t;
}
function Pm(e) {
	return e.cost === null ? "no price" : Q(e.cost);
}
function Fm(e) {
	return e.reminder_chars ? `The context includes Claude Code's token reminder (${Z(e.reminder_chars)} characters)` : null;
}
function Im(e) {
	return e !== void 0 && e.kind.endsWith("_reminder");
}
function Lm(e) {
	return e?.kind === "auto_reminder" ? "chat-usage-remind-auto" : e?.kind === "pays_reminder" ? "chat-usage-remind-pays" : e?.kind === "soft_reminder" ? "chat-usage-remind" : "";
}
function Rm(e) {
	return e.kind === "auto_reminder" ? {
		tone: "compact-chip-auto",
		text: `⚠ ${Da(e.context, e.auto_compact)} of auto-compact (${X(e.auto_compact)})`
	} : e.kind === "pays_reminder" ? {
		tone: "compact-chip-pays",
		text: `⚠ ${X(e.context)} · compacting pays after ~${e.pays_off_in} replies`
	} : e.kind === "soft_reminder" ? {
		tone: "",
		text: `ℹ ${X(e.context)} · ${e.times}× your ${X(e.threshold)} hint`
	} : {
		tone: "",
		text: ""
	};
}
function zm(e) {
	let t = e.extra_cost === null ? "" : ` · +${Q(e.extra_cost)}`;
	return {
		text: `↻ cache rebuilt (${e.cause}) · ${X(e.lost)}${t}`,
		title: `${X(e.lost)} tokens written to the cache again: ${Cs[e.cause]}`
	};
}
function Bm(e) {
	if (e === void 0) return null;
	if (e.kind === "pays") {
		let t = e.ahead_from === "longer" ? `After your past compactions, a stretch this long went on for about ${e.calls_ahead} more on average.` : `After your past compactions you went on for about ${e.calls_ahead} replies on average.`;
		return {
			tone: "compact-pays",
			label: "⚠ Compacting pays on average",
			text: `Context ${X(e.context)}, and every reply reads all of it again. /compact would shrink it to about ${X(e.after)}. That costs ~${Q(e.one_time)} once, and the cheaper replies pay it back within about ${e.pays_off_in} replies. ${t}`
		};
	}
	if (e.kind === "auto") return {
		tone: "compact-auto",
		label: "⚠ Compact soon",
		text: `Context ${X(e.context)}: ${Da(e.context, e.auto_compact)} of the ${X(e.auto_compact)} where Claude Code auto-compacts. /compact now to choose what to keep.`
	};
	if (e.kind !== "soft") return null;
	let t = e.reread_cost ? `: this turn cost ${Q(e.reread_cost)} in cache reads` : "";
	return {
		tone: "",
		label: "ℹ Consider compacting",
		text: `Context ${X(e.context)}, over the ${X(e.threshold)} hint (a heuristic, [chat] compact_hint_tokens in config.toml). Every turn re-reads it${t}. /compact, or /clear when the task changes.`
	};
}
//#endregion
//#region src/components/ChatInjected.svelte
var Vm = /* @__PURE__ */ U([
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	[
		"pre",
		{ class: "code" },
		" "
	]
], 1), Hm = /* @__PURE__ */ U([[
	"details",
	{ class: "chat-tool chat-injected" },
	[
		"summary",
		null,
		[
			"strong",
			null,
			"Added to the context"
		],
		" ",
		[
			"span",
			{ class: "muted" },
			" "
		]
	],
	" ",
	,
]]);
function Um(e, t) {
	j(t, !0);
	var n = Hm(), r = L(n), i = B(L(r)), a = z(B(i), !0);
	A(r), J(B(r, 2), 16, () => t.entry.items, (e) => e, (e, t) => {
		var n = Vm(), r = R(n), i = z(r), a = z(B(r, 2), !0);
		V((e, n) => {
			K(i, `${e ?? ""}${n ?? ""}`), K(a, t.text);
		}, [() => Em(t.kind), () => cm(t.text, t.chars)]), G(e, n);
	}), A(n), V((e, t) => {
		K(i, ` ${e ?? ""} `), K(a, t);
	}, [() => Dm(t.entry.items), () => Ia(t.entry.timestamp)]), G(e, n), M();
}
//#endregion
//#region src/components/ChatMarker.svelte
var Wm = /* @__PURE__ */ U([[
	"div",
	{ class: "muted" },
	"vs keeping: ",
	[
		"span",
		null,
		" "
	],
	" "
]]), Gm = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-marker" },
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	],
	" ",
	,
]]);
function Km(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => t.entry.versus_keeping ?? null), r = /* @__PURE__ */ N(() => H(n) ? xs(H(n)) : null);
	var i = Gm(), a = L(i), o = B(a), s = z(o, !0), c = B(o, 2), l = (e) => {
		var t = Wm(), i = B(L(t)), a = z(i, !0), o = B(i);
		A(t), V((e, n, s) => {
			Y(t, "title", Ts), Ti(i, 1, yi(H(r) ? `verdict-${H(r)}` : void 0)), Y(i, "title", e), K(a, n), K(o, ` · ${s ?? ""}`);
		}, [
			() => Ds(H(n)) ?? void 0,
			() => Es(H(n)),
			() => Am(H(n))
		]), G(e, t);
	};
	q(c, (e) => {
		H(n) && e(l);
	}), A(i), V((e, t) => {
		K(a, `${e ?? ""} `), K(s, t);
	}, [() => km(t.entry), () => Ia(t.entry.timestamp)]), G(e, i), M();
}
//#endregion
//#region node_modules/dompurify/dist/purify.es.mjs
function qm(e, t) {
	this.v = e, this.k = t;
}
function Jm(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Ym(e) {
	if (Array.isArray(e)) return e;
}
function Xm(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function Zm() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function Qm(e, t) {
	return Ym(e) || Xm(e, t) || $m(e, t) || Zm();
}
function $m(e, t) {
	if (e) {
		if (typeof e == "string") return Jm(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Jm(e, t) : void 0;
	}
}
function eh(e) {
	var t, n;
	function r(t, n) {
		try {
			var a = e[t](n), o = a.value, s = o instanceof qm;
			Promise.resolve(s ? o.v : o).then(function(n) {
				if (s) {
					var c = t === "return" && o.k ? t : "next";
					if (!o.k || n.done) return r(c, n);
					n = e[c](n).value;
				}
				i(!!a.done, n);
			}, function(e) {
				r("throw", e);
			});
		} catch (e) {
			i(2, e);
		}
	}
	function i(e, i) {
		e === 2 ? t.reject(i) : t.resolve({
			value: i,
			done: e
		}), (t = t.next) ? r(t.key, t.arg) : n = null;
	}
	this._invoke = function(e, i) {
		return new Promise(function(a, o) {
			var s = {
				key: e,
				arg: i,
				resolve: a,
				reject: o,
				next: null
			};
			n ? n = n.next = s : (t = n = s, r(e, i));
		});
	}, typeof e.return != "function" && (this.return = void 0);
}
eh.prototype[typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
	return this;
}, eh.prototype.next = function(e) {
	return this._invoke("next", e);
}, eh.prototype.throw = function(e) {
	return this._invoke("throw", e);
}, eh.prototype.return = function(e) {
	return this._invoke("return", e);
};
var th = Object.entries, nh = Object.setPrototypeOf, rh = Object.isFrozen, ih = Object.getPrototypeOf, ah = Object.getOwnPropertyDescriptor, oh = Object.freeze, sh = Object.seal, ch = Object.create, lh = typeof Reflect < "u" && Reflect, uh = lh.apply, dh = lh.construct;
oh ||= function(e) {
	return e;
}, sh ||= function(e) {
	return e;
}, uh ||= function(e, t) {
	var n = [...arguments].slice(2);
	return e.apply(t, n);
}, dh ||= function(e) {
	return new e(...[...arguments].slice(1));
};
var fh = Mh(Array.prototype.forEach);
Array.prototype.indexOf;
var ph = Mh(Array.prototype.lastIndexOf), mh = Mh(Array.prototype.pop), hh = Mh(Array.prototype.push);
Array.prototype.slice;
var gh = Mh(Array.prototype.splice), _h = Array.isArray, vh = Mh(String.prototype.toLowerCase), yh = Mh(String.prototype.toString), bh = Mh(String.prototype.match), xh = Mh(String.prototype.replace), Sh = Mh(String.prototype.indexOf), Ch = Mh(String.prototype.trim), wh = Mh(Number.prototype.toString), Th = Mh(Boolean.prototype.toString), Eh = typeof BigInt > "u" ? null : Mh(BigInt.prototype.toString), Dh = typeof Symbol > "u" ? null : Mh(Symbol.prototype.toString), Oh = Mh(Object.prototype.hasOwnProperty), kh = Mh(Object.prototype.toString), Ah = Mh(RegExp.prototype.test), jh = Nh(TypeError);
function Mh(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		var n = [...arguments].slice(1);
		return uh(e, t, n);
	};
}
function Nh(e) {
	return function() {
		return dh(e, [...arguments]);
	};
}
function Ph(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : vh;
	if (nh && nh(e, null), !_h(t)) return e;
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			let e = n(i);
			e !== i && (rh(t) || (t[r] = e), i = e);
		}
		e[i] = !0;
	}
	return e;
}
function Fh(e) {
	for (let t = 0; t < e.length; t++) Oh(e, t) || (e[t] = null);
	return e;
}
function Ih(e) {
	let t = ch(null);
	for (let r of th(e)) {
		var n = Qm(r, 2);
		let i = n[0], a = n[1];
		Oh(e, i) && (t[i] = _h(a) ? Fh(a) : a && typeof a == "object" && a.constructor === Object ? Ih(a) : a);
	}
	return t;
}
function Lh(e) {
	switch (typeof e) {
		case "string": return e;
		case "number": return wh(e);
		case "boolean": return Th(e);
		case "bigint": return Eh ? Eh(e) : "0";
		case "symbol": return Dh ? Dh(e) : "Symbol()";
		case "undefined": return kh(e);
		case "function":
		case "object": {
			if (e === null) return kh(e);
			let t = e, n = Rh(t, "toString");
			if (typeof n == "function") {
				let e = n(t);
				return typeof e == "string" ? e : kh(e);
			}
			return kh(e);
		}
		default: return kh(e);
	}
}
function Rh(e, t) {
	for (; e !== null;) {
		let n = ah(e, t);
		if (n) {
			if (n.get) return Mh(n.get);
			if (typeof n.value == "function") return Mh(n.value);
		}
		e = ih(e);
	}
	function n() {
		return null;
	}
	return n;
}
function zh(e) {
	try {
		return Ah(e, ""), !0;
	} catch {
		return !1;
	}
}
var Bh = oh(/* @__PURE__ */ "a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr".split(".")), Vh = oh(/* @__PURE__ */ "svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern".split(".")), Hh = oh([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]), Uh = oh([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]), Wh = oh(/* @__PURE__ */ "math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts".split(".")), Gh = oh([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]), Kh = oh(["#text"]), qh = oh(/* @__PURE__ */ "accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns".split(".")), Jh = oh(/* @__PURE__ */ "accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.pointer-events.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.vector-effect.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan".split(".")), Yh = oh(/* @__PURE__ */ "accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns".split(".")), Xh = oh([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), Zh = sh(/{{[\w\W]*|^[\w\W]*}}/g), Qh = sh(/<%[\w\W]*|^[\w\W]*%>/g), $h = sh(/\${[\w\W]*/g), eg = sh(/^data-[\-\w.\u00B7-\uFFFF]+$/), tg = sh(/^aria-[\-\w]+$/), ng = sh(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), rg = sh(/^(?:\w+script|data):/i), ig = sh(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), ag = sh(/^html$/i), og = sh(/^[a-z][.\w]*(-[.\w]+)+$/i), sg = sh(/<[/\w!]/g), cg = sh(/<[/\w]/g), lg = sh(/<\/no(script|embed|frames)/i), ug = sh(/\/>/i), dg = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
}, fg = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
], pg = oh(Ph({}, fg)), mg = function() {
	let e = {};
	return fh(fg, (t) => {
		e[t] = sh(RegExp("</" + t + "(?=[\\t\\n\\f\\r />])", "i"));
	}), oh(e);
}(), hg = function() {
	return typeof window > "u" ? null : window;
}, gg = function(e, t) {
	if (typeof e != "object" || typeof e.createPolicy != "function") return null;
	let n = null, r = "data-tt-policy-suffix";
	t && t.hasAttribute(r) && (n = t.getAttribute(r));
	let i = "dompurify" + (n ? "#" + n : "");
	try {
		return e.createPolicy(i, {
			createHTML(e) {
				return e;
			},
			createScriptURL(e) {
				return e;
			}
		});
	} catch {
		return console.warn("TrustedTypes policy " + i + " could not be created."), null;
	}
}, _g = function() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
}, vg = function(e, t, n, r) {
	return Oh(e, t) && _h(e[t]) ? Ph(r.base ? Ih(r.base) : {}, e[t], r.transform) : n;
}, yg = function(e, t, n) {
	let r = Oh(e, t) ? e[t] : void 0;
	return r && typeof r == "object" ? Ih(r) : n();
};
function bg() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : hg(), t = (e) => bg(e);
	if (t.version = "3.4.16", t.removed = [], !e || !e.document || e.document.nodeType !== dg.document || !e.Element) return t.isSupported = !1, t;
	let n = e.document, r = n, i = r.currentScript;
	e.DocumentFragment;
	let a = e.HTMLTemplateElement, o = e.Node, s = e.Element, c = e.NodeFilter;
	e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
	let l = e.DOMParser, u = e.trustedTypes, d = s.prototype, f = Rh(d, "cloneNode"), p = Rh(d, "remove"), m = Rh(d, "removeAttributeNode"), h = Rh(d, "nextSibling"), g = Rh(d, "childNodes"), _ = Rh(d, "parentNode"), v = Rh(d, "shadowRoot"), y = Rh(d, "attributes"), b = o && o.prototype ? Rh(o.prototype, "nodeType") : null, x = o && o.prototype ? Rh(o.prototype, "nodeName") : null, S = o && o.prototype ? Rh(o.prototype, "ownerDocument") : null, ee = function(e) {
		return b ? b(e) : e.nodeType;
	}, C = function(e) {
		return x ? x(e) : e.nodeName;
	};
	if (typeof a == "function") {
		let e = n.createElement("template");
		e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
	}
	let w, te = "", ne, re = !1, ie = 0, T = function() {
		if (ie > 0) throw jh("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	}, ae = function(e) {
		T(), ie++;
		try {
			return w.createHTML(e);
		} finally {
			ie--;
		}
	}, E = function(e) {
		T(), ie++;
		try {
			return w.createScriptURL(e);
		} finally {
			ie--;
		}
	}, oe = function() {
		return re ||= (ne = gg(u, i), !0), ne;
	}, D = n, se = D.implementation, ce = D.createNodeIterator, le = D.createDocumentFragment, ue = D.getElementsByTagName, de = r.importNode, fe = _g();
	t.isSupported = typeof th == "function" && typeof _ == "function" && se && se.createHTMLDocument !== void 0;
	let pe = Zh, me = Qh, he = $h, ge = eg, _e = tg, ve = rg, ye = ig, be = og, xe = ng, O = null, Se = Ph({}, [
		...Bh,
		...Vh,
		...Hh,
		...Wh,
		...Kh
	]), Ce = null, we = Ph({}, [
		...qh,
		...Jh,
		...Yh,
		...Xh
	]), Te = Object.seal(ch(null, {
		tagNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: !1
		}
	})), Ee = null, De = null, Oe = Object.seal(ch(null, {
		tagCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		}
	})), k = !0, ke = !0, Ae = !1, je = !0, Me = !1, A = !0, Ne = !1, Pe = !1, Fe = null, Ie = null, Le = !1, Re = !1, ze = !1, Be = !1, Ve = !0, He = !1, Ue = "user-content-", We = !0, Ge = !1, Ke = {}, qe = null, Je = Ph({}, /* @__PURE__ */ "annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp".split(".")), Ye = null, Xe = Ph({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]), Ze = null, Qe = Ph({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]), $e = "http://www.w3.org/1998/Math/MathML", et = "http://www.w3.org/2000/svg", tt = "http://www.w3.org/1999/xhtml", nt = tt, rt = !1, it = null, at = Ph({}, [
		$e,
		et,
		tt
	], yh), ot = oh([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), j = Ph({}, ot), M = oh(["annotation-xml"]), st = Ph({}, M), ct = Ph({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]), lt = null, ut = ["application/xhtml+xml", "text/html"], dt = null, ft = null, pt = n.createElement("form"), mt = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, ht = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (ft && ft === e) return;
		(!e || typeof e != "object") && (e = {}), e = Ih(e), lt = ut.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? "text/html" : e.PARSER_MEDIA_TYPE, dt = lt === "application/xhtml+xml" ? yh : vh, O = vg(e, "ALLOWED_TAGS", Se, { transform: dt }), Ce = vg(e, "ALLOWED_ATTR", we, { transform: dt }), it = vg(e, "ALLOWED_NAMESPACES", at, { transform: yh }), Ze = vg(e, "ADD_URI_SAFE_ATTR", Qe, {
			transform: dt,
			base: Qe
		}), Ye = vg(e, "ADD_DATA_URI_TAGS", Xe, {
			transform: dt,
			base: Xe
		}), qe = vg(e, "FORBID_CONTENTS", Je, { transform: dt }), Ee = vg(e, "FORBID_TAGS", Ih({}), { transform: dt }), De = vg(e, "FORBID_ATTR", Ih({}), { transform: dt }), Ke = Oh(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? Ih(e.USE_PROFILES) : e.USE_PROFILES : !1, k = e.ALLOW_ARIA_ATTR !== !1, ke = e.ALLOW_DATA_ATTR !== !1, Ae = e.ALLOW_UNKNOWN_PROTOCOLS || !1, je = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Me = e.SAFE_FOR_TEMPLATES || !1, A = e.SAFE_FOR_XML !== !1, Ne = e.WHOLE_DOCUMENT || !1, Re = e.RETURN_DOM || !1, ze = e.RETURN_DOM_FRAGMENT || !1, Be = e.RETURN_TRUSTED_TYPE || !1, Le = e.FORCE_BODY || !1, Ve = e.SANITIZE_DOM !== !1, He = e.SANITIZE_NAMED_PROPS || !1, We = e.KEEP_CONTENT !== !1, Ge = e.IN_PLACE || !1, xe = zh(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : ng, nt = typeof e.NAMESPACE == "string" ? e.NAMESPACE : tt, j = yg(e, "MATHML_TEXT_INTEGRATION_POINTS", () => Ph({}, ot)), st = yg(e, "HTML_INTEGRATION_POINTS", () => Ph({}, M));
		let t = yg(e, "CUSTOM_ELEMENT_HANDLING", () => ch(null));
		if (Te = ch(null), Oh(t, "tagNameCheck") && mt(t.tagNameCheck) && (Te.tagNameCheck = t.tagNameCheck), Oh(t, "attributeNameCheck") && mt(t.attributeNameCheck) && (Te.attributeNameCheck = t.attributeNameCheck), Oh(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (Te.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), sh(Te), Me && (ke = !1), ze && (Re = !0), Ke && (O = Ph({}, Kh), Ce = ch(null), Ke.html === !0 && (Ph(O, Bh), Ph(Ce, qh)), Ke.svg === !0 && (Ph(O, Vh), Ph(Ce, Jh), Ph(Ce, Xh)), Ke.svgFilters === !0 && (Ph(O, Hh), Ph(Ce, Jh), Ph(Ce, Xh)), Ke.mathMl === !0 && (Ph(O, Wh), Ph(Ce, Yh), Ph(Ce, Xh))), Oe.tagCheck = null, Oe.attributeCheck = null, Oh(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? Oe.tagCheck = e.ADD_TAGS : _h(e.ADD_TAGS) && (O === Se && (O = Ih(O)), Ph(O, e.ADD_TAGS, dt))), Oh(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? Oe.attributeCheck = e.ADD_ATTR : _h(e.ADD_ATTR) && (Ce === we && (Ce = Ih(Ce)), Ph(Ce, e.ADD_ATTR, dt))), Oh(e, "ADD_FORBID_CONTENTS") && _h(e.ADD_FORBID_CONTENTS) && (qe === Je && (qe = Ih(qe)), Ph(qe, e.ADD_FORBID_CONTENTS, dt)), We && (O["#text"] = !0), Ne && Ph(O, [
			"html",
			"head",
			"body"
		]), O.table && (Ph(O, ["tbody"]), delete Ee.tbody), e.TRUSTED_TYPES_POLICY) {
			if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw jh("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw jh("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			let t = w;
			w = e.TRUSTED_TYPES_POLICY;
			try {
				te = ae("");
			} catch (e) {
				throw w = t, e;
			}
		} else e.TRUSTED_TYPES_POLICY === null ? (w = void 0, te = "") : (w === void 0 && (w = oe()), w && typeof te == "string" && (te = ae("")));
		oh && oh(e), ft = e;
	}, gt = Ph({}, [
		...Vh,
		...Hh,
		...Uh
	]), _t = Ph({}, [...Wh, ...Gh]), vt = function(e, t, n) {
		return t.namespaceURI === tt ? e === "svg" : t.namespaceURI === $e ? e === "svg" && (n === "annotation-xml" || j[n]) : !!gt[e];
	}, yt = function(e, t, n) {
		return t.namespaceURI === tt ? e === "math" : t.namespaceURI === et ? e === "math" && st[n] : !!_t[e];
	}, bt = function(e, t, n) {
		return t.namespaceURI === et && !st[n] || t.namespaceURI === $e && !j[n] ? !1 : !_t[e] && (ct[e] || !gt[e]);
	}, xt = function(e) {
		let t = _(e);
		(!t || !t.tagName) && (t = {
			namespaceURI: nt,
			tagName: "template"
		});
		let n = vh(e.tagName), r = vh(t.tagName);
		return it[e.namespaceURI] ? e.namespaceURI === et ? vt(n, t, r) : e.namespaceURI === $e ? yt(n, t, r) : e.namespaceURI === tt ? bt(n, t, r) : !!(lt === "application/xhtml+xml" && it[e.namespaceURI]) : !1;
	}, St = function(e) {
		hh(t.removed, { element: e });
		try {
			_(e).removeChild(e);
		} catch {
			if (p(e), !_(e)) throw jh("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, Ct = function(e, t, n) {
		try {
			m(e, t);
		} catch {
			try {
				e.removeAttribute(n);
			} catch {}
		}
	}, wt = function(e) {
		Dt(e);
		let t = g(e);
		if (t) {
			let e = [];
			fh(t, (t) => {
				hh(e, t);
			}), fh(e, (e) => {
				try {
					p(e);
				} catch {}
			});
		}
		let n = y(e);
		if (n) for (let t = n.length - 1; t >= 0; --t) {
			let r = n[t], i = r && r.name;
			typeof i == "string" && Ct(e, r, i);
		}
	}, Tt = function(e, n, r) {
		if (!r) try {
			r = n.getAttributeNode(e);
		} catch {
			r = null;
		}
		hh(t.removed, {
			attribute: r || null,
			from: n
		});
		try {
			r ? m(n, r) : n.removeAttribute(e);
		} catch {
			try {
				n.removeAttribute(e);
			} catch {}
		}
		if (e === "is") {
			if (Re || ze) try {
				St(n);
			} catch {}
			else try {
				n.setAttribute(e, "");
			} catch {}
		}
	}, Et = function(e) {
		let t = y(e);
		if (t) for (let n = t.length - 1; n >= 0; --n) {
			let r = t[n], i = r && r.name;
			typeof i != "string" || Ce[dt(i)] || Ct(e, r, i);
		}
	}, Dt = function(e) {
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop();
			ee(e) === dg.element && Et(e);
			let n = g(e);
			if (n) for (let e = n.length - 1; e >= 0; --e) t.push(n[e]);
		}
	}, N = function(e, t) {
		return A ? e === "patchsrc" || e === "for" && t !== "label" && t !== "output" : !1;
	}, Ot = function(e) {
		if (!A) return;
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop(), n = ee(e);
			if (n === dg.processingInstruction || n === dg.comment && Ah(cg, e.data)) {
				try {
					p(e);
				} catch {}
				continue;
			}
			if (n === dg.element) {
				let t = e, n = dt(C(e));
				try {
					t.hasAttribute && t.hasAttribute("patchsrc") && t.removeAttribute("patchsrc"), t.hasAttribute && t.hasAttribute("for") && N("for", n) && t.removeAttribute("for");
				} catch {}
			}
			let r = g(e);
			if (r) for (let e = r.length - 1; e >= 0; --e) t.push(r[e]);
		}
	}, kt = function(e) {
		let t = null, r = null;
		if (Le) e = "<remove></remove>" + e;
		else {
			let t = bh(e, /^[\r\n\t ]+/);
			r = t && t[0];
		}
		lt === "application/xhtml+xml" && nt === tt && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		let i = w ? ae(e) : e;
		if (nt === tt) try {
			t = new l().parseFromString(i, lt);
		} catch {}
		if (!t || !t.documentElement) {
			t = se.createDocument(nt, "template", null);
			try {
				t.documentElement.innerHTML = rt ? te : i;
			} catch {}
		}
		let a = t.body || t.documentElement;
		return e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null), nt === tt ? ue.call(t, Ne ? "html" : "body")[0] : Ne ? t.documentElement : a;
	}, At = function(e) {
		let t = S ? S(e) : e.ownerDocument;
		return ce.call(t || e, e, c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION, null);
	}, jt = function(e) {
		return e = xh(e, pe, " "), e = xh(e, me, " "), e = xh(e, he, " "), e;
	}, Mt = function(e) {
		e.normalize();
		let t = S ? S(e) : e.ownerDocument, n = ce.call(t || e, e, c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION, null), r = n.nextNode();
		for (; r;) r.data = jt(r.data), r = n.nextNode();
		let i = e.querySelectorAll?.call(e, "template");
		i && fh(i, (e) => {
			Pt(e.content) && Mt(e.content);
		});
	}, Nt = function(e) {
		let t = x ? x(e) : null;
		return typeof t != "string" || dt(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== y(e) || typeof e.removeAttribute != "function" || typeof e.removeAttributeNode != "function" || typeof e.getAttributeNode != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== b(e) || e.childNodes !== g(e);
	}, Pt = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return b(e) === dg.documentFragment;
		} catch {
			return !1;
		}
	}, P = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return typeof b(e) == "number";
		} catch {
			return !1;
		}
	};
	function Ft(e, n, r) {
		e.length !== 0 && fh(e, (e) => {
			e.call(t, n, r, ft);
		});
	}
	let It = function(e, t) {
		return !!(A && e.hasChildNodes() && !P(e.firstElementChild) && Ah(sg, e.textContent) && Ah(sg, e.innerHTML) || A && e.namespaceURI === tt && pg[t] && (P(e.firstElementChild) || typeof e.textContent == "string" && Ah(mg[t], e.textContent)) || e.nodeType === dg.processingInstruction || A && e.nodeType === dg.comment && Ah(cg, e.data));
	}, Lt = function(e, t) {
		return e instanceof RegExp ? Ah(e, t) : e instanceof Function && !!e(t, ...[...arguments].slice(2));
	}, Rt = function(e, t, n) {
		if (!Ee[t] && Wt(t) && Lt(Te.tagNameCheck, t)) return !1;
		if (We && !qe[t]) {
			let t = _(e), r = g(e);
			if (r && t) {
				let i = r.length;
				for (let a = i - 1; a >= 0; --a) {
					let i = e === n ? f(r[a], !0) : r[a];
					t.insertBefore(i, h(e));
				}
			}
		}
		return St(e), !0;
	}, zt = function(e, t, n, r) {
		return e.length === 0 ? t : t === n || t === r ? Ih(t) : t;
	}, Bt = function(e, t) {
		return e === t || _(e) !== null ? !1 : (Ge && Dt(e), !0);
	}, Vt = function(e, n) {
		if (Ft(fe.beforeSanitizeElements, e, null), Bt(e, n)) return !0;
		if (Nt(e)) return St(e), !0;
		let r = dt(C(e));
		if (O = zt(fe.uponSanitizeElement, O, Se, Fe), Ft(fe.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: O
		}), Bt(e, n)) return !0;
		if (It(e, r)) return St(e), !0;
		if (Ee[r] || !(Oe.tagCheck instanceof Function && Oe.tagCheck(r)) && !O[r]) {
			let t = Rt(e, r, n);
			return t === !1 && (Ft(fe.afterSanitizeElements, e, null), Bt(e, n)) ? !0 : t;
		}
		if (ee(e) === dg.element && !xt(e) || (r === "noscript" || r === "noembed" || r === "noframes") && Ah(lg, e.innerHTML)) return St(e), !0;
		if (Me && e.nodeType === dg.text) {
			let n = jt(e.textContent);
			e.textContent !== n && (hh(t.removed, { element: e.cloneNode() }), e.textContent = n);
		}
		return Ft(fe.afterSanitizeElements, e, null), Bt(e, n);
	}, Ht = function(e, t, r) {
		if (De[t] || N(t, e) || Ve && (t === "id" || t === "name") && (r in n || r in pt)) return !1;
		let i = Ce[t] || Oe.attributeCheck instanceof Function && Oe.attributeCheck(t, e);
		return ke && Ah(ge, t) || k && Ah(_e, t) ? !0 : i ? Ze[t] || Ah(xe, xh(r, ye, "")) || (t === "src" || t === "xlink:href" || t === "href") && e !== "script" && Sh(r, "data:") === 0 && Ye[e] || Ae && !Ah(ve, xh(r, ye, "")) ? !0 : !r : Wt(e) && Lt(Te.tagNameCheck, e) && Lt(Te.attributeNameCheck, t, e) || t === "is" && Te.allowCustomizedBuiltInElements && Lt(Te.tagNameCheck, r);
	}, Ut = Ph({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), Wt = function(e) {
		return !Ut[vh(e)] && Ah(be, e);
	}, Gt = function(e, t, n, r) {
		if (w && typeof u == "object" && typeof u.getAttributeType == "function" && !n) switch (u.getAttributeType(e, t)) {
			case "TrustedHTML": return ae(r);
			case "TrustedScriptURL": return E(r);
		}
		return r;
	}, Kt = function(e, t, n, r) {
		try {
			return n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r), !Nt(e) || (St(e), !1);
		} catch {
			return Tt(t, e), !1;
		}
	}, qt = function(e, n) {
		if (Ft(fe.beforeSanitizeAttributes, e, null), Bt(e, n)) return;
		let r = e.attributes;
		if (!r || Nt(e)) return;
		Ce = zt(fe.uponSanitizeAttribute, Ce, we, Ie);
		let i = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: Ce,
			forceKeepAttr: void 0
		}, a = r.length, o = dt(e.nodeName);
		for (; a--;) {
			let n = r[a], s = n.name, c = n.namespaceURI, l = n.value, u = dt(s), d = l, f = s === "value" ? d : Ch(d), p = !1;
			if (i.attrName = u, i.attrValue = f, i.keepAttr = !0, i.forceKeepAttr = void 0, Ft(fe.uponSanitizeAttribute, e, i), f = i.attrValue, He && (u === "id" || u === "name") && Sh(f, Ue) !== 0 && (Tt(s, e, n), f = Ue + f, p = !0), A && Ah(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, f)) {
				Tt(s, e, n);
				continue;
			}
			if (u === "attributename" && bh(f, "href")) {
				Tt(s, e, n);
				continue;
			}
			if (!i.forceKeepAttr) {
				if (!i.keepAttr) {
					Tt(s, e, n);
					continue;
				}
				if (!je && Ah(ug, f)) {
					Tt(s, e, n);
					continue;
				}
				if (Me && (f = jt(f)), !Ht(o, u, f)) {
					Tt(s, e, n);
					continue;
				}
				f = Gt(o, u, c, f), f !== d && Kt(e, s, c, f) && p && mh(t.removed);
			}
		}
		Ft(fe.afterSanitizeAttributes, e, null), Bt(e, n);
	}, Jt = function(e) {
		let t = null, n = At(e);
		for (Ft(fe.beforeSanitizeShadowDOM, e, null); t = n.nextNode();) if (Ft(fe.uponSanitizeShadowNode, t, null), Vt(t, e), qt(t, e), Pt(t.content) && Jt(t.content), ee(t) === dg.element) {
			let e = v(t);
			Pt(e) && (Yt(e), Jt(e));
		}
		Ft(fe.afterSanitizeShadowDOM, e, null);
	}, Yt = function(e) {
		let t = [{
			node: e,
			shadow: null
		}];
		for (; t.length > 0;) {
			let e = t.pop();
			if (e.shadow) {
				Jt(e.shadow);
				continue;
			}
			let n = e.node, r = ee(n) === dg.element, i = g(n);
			if (i) for (let e = i.length - 1; e >= 0; --e) t.push({
				node: i[e],
				shadow: null
			});
			if (r) {
				let e = x ? x(n) : null;
				if (typeof e == "string" && dt(e) === "template") {
					let e = n.content;
					Pt(e) && t.push({
						node: e,
						shadow: null
					});
				}
			}
			if (r) {
				let e = v(n);
				Pt(e) && t.push({
					node: null,
					shadow: e
				}, {
					node: e,
					shadow: null
				});
			}
		}
	};
	return t.sanitize = function(e) {
		let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = null, a = null, o = null, s = null;
		if (rt = !e, rt && (e = "<!-->"), typeof e != "string" && !P(e) && (e = Lh(e), typeof e != "string")) throw jh("dirty is not a string, aborting");
		if (!t.isSupported) return e;
		Pe ? (O = Fe, Ce = Ie) : ht(n), (fe.uponSanitizeElement.length > 0 || fe.uponSanitizeAttribute.length > 0) && (O = Ih(O)), fe.uponSanitizeAttribute.length > 0 && (Ce = Ih(Ce)), t.removed = [];
		let c = Ge && typeof e != "string" && P(e);
		if (c) {
			Ot(e);
			let t = C(e);
			if (typeof t == "string") {
				let n = dt(t);
				if (!O[n] || Ee[n]) throw wt(e), jh("root node is forbidden and cannot be sanitized in-place");
			}
			if (Nt(e)) throw wt(e), jh("root node is clobbered and cannot be sanitized in-place");
			try {
				Yt(e);
			} catch (t) {
				throw wt(e), t;
			}
		} else if (P(e)) i = kt("<!---->"), a = i.ownerDocument.importNode(e, !0), a.nodeType === dg.element && a.nodeName === "BODY" || a.nodeName === "HTML" ? i = a : i.appendChild(a), Yt(i);
		else {
			if (!Re && !Me && !Ne && e.indexOf("<") === -1) return w && Be ? ae(e) : e;
			if (i = kt(e), !i) return Re ? null : Be ? te : "";
		}
		i && Le && St(i.firstChild);
		let l = c ? e : i;
		try {
			let e = At(l);
			for (; o = e.nextNode();) Vt(o, l), qt(o, l), Pt(o.content) && Jt(o.content);
		} catch (n) {
			throw c && (wt(e), fh(t.removed, (e) => {
				e.element && Dt(e.element);
			})), n;
		}
		if (c) {
			let n = !1;
			if (fh(t.removed, (t) => {
				t.element && (t.element === e && (n = !0), Dt(t.element));
			}), n) throw jh("a node selected for removal could not be safely returned; refusing to sanitize in place");
			return Me && Mt(e), e;
		}
		if (Re) {
			if (Me && Mt(i), ze) for (s = le.call(i.ownerDocument); i.firstChild;) s.appendChild(i.firstChild);
			else s = i;
			return (Ce.shadowroot || Ce.shadowrootmode) && (s = de.call(r, s, !0)), s;
		}
		let u = Ne ? i.outerHTML : i.innerHTML;
		return Ne && O["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && Ah(ag, i.ownerDocument.doctype.name) && (u = "<!DOCTYPE " + i.ownerDocument.doctype.name + ">\n" + u), Me && (u = jt(u)), w && Be ? ae(u) : u;
	}, t.setConfig = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		ht(e), Pe = !0, Fe = O, Ie = Ce;
	}, t.clearConfig = function() {
		ft = null, Pe = !1, Fe = null, Ie = null, w = ne, te = "";
	}, t.isValidAttribute = function(e, t, n) {
		ft || ht({});
		let r = dt(e), i = dt(t);
		return Ht(r, i, n);
	}, t.addHook = function(e, t) {
		typeof t == "function" && Oh(fe, e) && hh(fe[e], t);
	}, t.removeHook = function(e, t) {
		if (Oh(fe, e)) {
			if (t !== void 0) {
				let n = ph(fe[e], t);
				return n === -1 ? void 0 : gh(fe[e], n, 1)[0];
			}
			return mh(fe[e]);
		}
	}, t.removeHooks = function(e) {
		Oh(fe, e) && (fe[e] = []);
	}, t.removeAllHooks = function() {
		fe = _g();
	}, t;
}
var xg = bg(), Sg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return e instanceof Map ? e.clear = e.delete = e.set = function() {
			throw Error("map is read-only");
		} : e instanceof Set && (e.add = e.clear = e.delete = function() {
			throw Error("set is read-only");
		}), Object.freeze(e), Object.getOwnPropertyNames(e).forEach((t) => {
			let r = e[t], i = typeof r;
			(i === "object" || i === "function") && !Object.isFrozen(r) && n(r);
		}), e;
	}
	var r = class {
		constructor(e) {
			e.data === void 0 && (e.data = {}), this.data = e.data, this.isMatchIgnored = !1;
		}
		ignoreMatch() {
			this.isMatchIgnored = !0;
		}
	};
	function i(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
	}
	function a(e, ...t) {
		let n = Object.create(null);
		for (let t in e) n[t] = e[t];
		return t.forEach(function(e) {
			for (let t in e) n[t] = e[t];
		}), n;
	}
	var o = "</span>", s = (e) => !!e.scope, c = (e, { prefix: t }) => {
		if (e.startsWith("language:")) return e.replace("language:", "language-");
		if (e.includes(".")) {
			let n = e.split(".");
			return [`${t}${n.shift()}`, ...n.map((e, t) => `${e}${"_".repeat(t + 1)}`)].join(" ");
		}
		return `${t}${e}`;
	}, l = class {
		constructor(e, t) {
			this.buffer = "", this.classPrefix = t.classPrefix, e.walk(this);
		}
		addText(e) {
			this.buffer += i(e);
		}
		openNode(e) {
			if (!s(e)) return;
			let t = c(e.scope, { prefix: this.classPrefix });
			this.span(t);
		}
		closeNode(e) {
			s(e) && (this.buffer += o);
		}
		value() {
			return this.buffer;
		}
		span(e) {
			this.buffer += `<span class="${e}">`;
		}
	}, u = (e = {}) => {
		let t = { children: [] };
		return Object.assign(t, e), t;
	}, d = class e {
		constructor() {
			this.rootNode = u(), this.stack = [this.rootNode];
		}
		get top() {
			return this.stack[this.stack.length - 1];
		}
		get root() {
			return this.rootNode;
		}
		add(e) {
			this.top.children.push(e);
		}
		openNode(e) {
			let t = u({ scope: e });
			this.add(t), this.stack.push(t);
		}
		closeNode() {
			if (this.stack.length > 1) return this.stack.pop();
		}
		closeAllNodes() {
			for (; this.closeNode(););
		}
		toJSON() {
			return JSON.stringify(this.rootNode, null, 4);
		}
		walk(e) {
			return this.constructor._walk(e, this.rootNode);
		}
		static _walk(e, t) {
			return typeof t == "string" ? e.addText(t) : t.children && (e.openNode(t), t.children.forEach((t) => this._walk(e, t)), e.closeNode(t)), e;
		}
		static _collapse(t) {
			typeof t != "string" && t.children && (t.children.every((e) => typeof e == "string") ? t.children = [t.children.join("")] : t.children.forEach((t) => {
				e._collapse(t);
			}));
		}
	}, f = class extends d {
		constructor(e) {
			super(), this.options = e;
		}
		addText(e) {
			e !== "" && this.add(e);
		}
		startScope(e) {
			this.openNode(e);
		}
		endScope() {
			this.closeNode();
		}
		__addSublanguage(e, t) {
			let n = e.root;
			t && (n.scope = `language:${t}`), this.add(n);
		}
		toHTML() {
			return new l(this, this.options).value();
		}
		finalize() {
			return this.closeAllNodes(), !0;
		}
	};
	function p(e) {
		return e ? typeof e == "string" ? e : e.source : null;
	}
	function m(e) {
		return _("(?=", e, ")");
	}
	function h(e) {
		return _("(?:", e, ")*");
	}
	function g(e) {
		return _("(?:", e, ")?");
	}
	function _(...e) {
		return e.map((e) => p(e)).join("");
	}
	function v(e) {
		let t = e[e.length - 1];
		return typeof t == "object" && t.constructor === Object ? (e.splice(e.length - 1, 1), t) : {};
	}
	function y(...e) {
		return "(" + (v(e).capture ? "" : "?:") + e.map((e) => p(e)).join("|") + ")";
	}
	function b(e) {
		return RegExp(e.toString() + "|").exec("").length - 1;
	}
	function x(e, t) {
		let n = e && e.exec(t);
		return n && n.index === 0;
	}
	var S = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
	function ee(e, { joinWith: t }) {
		let n = 0;
		return e.map((e) => {
			n += 1;
			let t = n, r = p(e), i = "";
			for (; r.length > 0;) {
				let e = S.exec(r);
				if (!e) {
					i += r;
					break;
				}
				i += r.substring(0, e.index), r = r.substring(e.index + e[0].length), e[0][0] === "\\" && e[1] ? i += "\\" + String(Number(e[1]) + t) : (i += e[0], e[0] === "(" && n++);
			}
			return i;
		}).map((e) => `(${e})`).join(t);
	}
	var C = /\b\B/, w = "[a-zA-Z]\\w*", te = "[a-zA-Z_]\\w*", ne = "\\b\\d+(\\.\\d+)?", re = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ie = "\\b(0b[01]+)", T = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", ae = (e = {}) => {
		let t = /^#![ ]*\//;
		return e.binary && (e.begin = _(t, /.*\b/, e.binary, /\b.*/)), a({
			scope: "meta",
			begin: t,
			end: /$/,
			relevance: 0,
			"on:begin": (e, t) => {
				e.index !== 0 && t.ignoreMatch();
			}
		}, e);
	}, E = {
		begin: "\\\\[\\s\\S]",
		relevance: 0
	}, oe = {
		scope: "string",
		begin: "'",
		end: "'",
		illegal: "\\n",
		contains: [E]
	}, D = {
		scope: "string",
		begin: "\"",
		end: "\"",
		illegal: "\\n",
		contains: [E]
	}, se = { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, ce = function(e, t, n = {}) {
		let r = a({
			scope: "comment",
			begin: e,
			end: t,
			contains: []
		}, n);
		r.contains.push({
			scope: "doctag",
			begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
			end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
			excludeBegin: !0,
			relevance: 0
		});
		let i = y("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
		return r.contains.push({ begin: _(/[ ]+/, "(", i, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), r;
	}, le = ce("//", "$"), ue = ce("/\\*", "\\*/"), de = ce("#", "$"), fe = /*#__PURE__*/ Object.freeze({
		__proto__: null,
		APOS_STRING_MODE: oe,
		BACKSLASH_ESCAPE: E,
		BINARY_NUMBER_MODE: {
			scope: "number",
			begin: ie,
			relevance: 0
		},
		BINARY_NUMBER_RE: ie,
		COMMENT: ce,
		C_BLOCK_COMMENT_MODE: ue,
		C_LINE_COMMENT_MODE: le,
		C_NUMBER_MODE: {
			scope: "number",
			begin: re,
			relevance: 0
		},
		C_NUMBER_RE: re,
		END_SAME_AS_BEGIN: function(e) {
			return Object.assign(e, {
				"on:begin": (e, t) => {
					t.data._beginMatch = e[1];
				},
				"on:end": (e, t) => {
					t.data._beginMatch !== e[1] && t.ignoreMatch();
				}
			});
		},
		HASH_COMMENT_MODE: de,
		IDENT_RE: w,
		MATCH_NOTHING_RE: C,
		METHOD_GUARD: {
			begin: "\\.\\s*[a-zA-Z_]\\w*",
			relevance: 0
		},
		NUMBER_MODE: {
			scope: "number",
			begin: ne,
			relevance: 0
		},
		NUMBER_RE: ne,
		PHRASAL_WORDS_MODE: se,
		QUOTE_STRING_MODE: D,
		REGEXP_MODE: {
			scope: "regexp",
			begin: /\/(?=[^/\n]*\/)/,
			end: /\/[gimuy]*/,
			contains: [E, {
				begin: /\[/,
				end: /\]/,
				relevance: 0,
				contains: [E]
			}]
		},
		RE_STARTERS_RE: T,
		SHEBANG: ae,
		TITLE_MODE: {
			scope: "title",
			begin: w,
			relevance: 0
		},
		UNDERSCORE_IDENT_RE: te,
		UNDERSCORE_TITLE_MODE: {
			scope: "title",
			begin: te,
			relevance: 0
		}
	});
	function pe(e, t) {
		e.input[e.index - 1] === "." && t.ignoreMatch();
	}
	function me(e, t) {
		e.className !== void 0 && (e.scope = e.className, delete e.className);
	}
	function he(e, t) {
		t && e.beginKeywords && (e.begin = "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e.__beforeBegin = pe, e.keywords = e.keywords || e.beginKeywords, delete e.beginKeywords, e.relevance === void 0 && (e.relevance = 0));
	}
	function ge(e, t) {
		Array.isArray(e.illegal) && (e.illegal = y(...e.illegal));
	}
	function _e(e, t) {
		if (e.match) {
			if (e.begin || e.end) throw Error("begin & end are not supported with match");
			e.begin = e.match, delete e.match;
		}
	}
	function ve(e, t) {
		e.relevance === void 0 && (e.relevance = 1);
	}
	var ye = (e, t) => {
		if (!e.beforeMatch) return;
		if (e.starts) throw Error("beforeMatch cannot be used with starts");
		let n = Object.assign({}, e);
		Object.keys(e).forEach((t) => {
			delete e[t];
		}), e.keywords = n.keywords, e.begin = _(n.beforeMatch, m(n.begin)), e.starts = {
			relevance: 0,
			contains: [Object.assign(n, { endsParent: !0 })]
		}, e.relevance = 0, delete n.beforeMatch;
	}, be = [
		"of",
		"and",
		"for",
		"in",
		"not",
		"or",
		"if",
		"then",
		"parent",
		"list",
		"value"
	], xe = "keyword";
	function O(e, t, n = xe) {
		let r = Object.create(null);
		return typeof e == "string" ? i(n, e.split(" ")) : Array.isArray(e) ? i(n, e) : Object.keys(e).forEach(function(n) {
			Object.assign(r, O(e[n], t, n));
		}), r;
		function i(e, n) {
			t && (n = n.map((e) => e.toLowerCase())), n.forEach(function(t) {
				let n = t.split("|");
				r[n[0]] = [e, Se(n[0], n[1])];
			});
		}
	}
	function Se(e, t) {
		return t ? Number(t) : +!Ce(e);
	}
	function Ce(e) {
		return be.includes(e.toLowerCase());
	}
	var we = {}, Te = (e) => {
		console.error(e);
	}, Ee = (e, ...t) => {
		console.log(`WARN: ${e}`, ...t);
	}, De = (e, t) => {
		we[`${e}/${t}`] || (console.log(`Deprecated as of ${e}. ${t}`), we[`${e}/${t}`] = !0);
	}, Oe = /* @__PURE__ */ Error();
	function k(e, t, { key: n }) {
		let r = 0, i = e[n], a = {}, o = {};
		for (let e = 1; e <= t.length; e++) o[e + r] = i[e], a[e + r] = !0, r += b(t[e - 1]);
		e[n] = o, e[n]._emit = a, e[n]._multi = !0;
	}
	function ke(e) {
		if (Array.isArray(e.begin)) {
			if (e.skip || e.excludeBegin || e.returnBegin) throw Te("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Oe;
			if (typeof e.beginScope != "object" || e.beginScope === null) throw Te("beginScope must be object"), Oe;
			k(e, e.begin, { key: "beginScope" }), e.begin = ee(e.begin, { joinWith: "" });
		}
	}
	function Ae(e) {
		if (Array.isArray(e.end)) {
			if (e.skip || e.excludeEnd || e.returnEnd) throw Te("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Oe;
			if (typeof e.endScope != "object" || e.endScope === null) throw Te("endScope must be object"), Oe;
			k(e, e.end, { key: "endScope" }), e.end = ee(e.end, { joinWith: "" });
		}
	}
	function je(e) {
		e.scope && typeof e.scope == "object" && e.scope !== null && (e.beginScope = e.scope, delete e.scope);
	}
	function Me(e) {
		je(e), typeof e.beginScope == "string" && (e.beginScope = { _wrap: e.beginScope }), typeof e.endScope == "string" && (e.endScope = { _wrap: e.endScope }), ke(e), Ae(e);
	}
	function A(e) {
		function t(t, n) {
			return new RegExp(p(t), "m" + (e.case_insensitive ? "i" : "") + (e.unicodeRegex ? "u" : "") + (n ? "g" : ""));
		}
		class n {
			constructor() {
				this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
			}
			addRule(e, t) {
				t.position = this.position++, this.matchIndexes[this.matchAt] = t, this.regexes.push([t, e]), this.matchAt += b(e) + 1;
			}
			compile() {
				this.regexes.length === 0 && (this.exec = () => null);
				let e = this.regexes.map((e) => e[1]);
				this.matcherRe = t(ee(e, { joinWith: "|" }), !0), this.lastIndex = 0;
			}
			exec(e) {
				this.matcherRe.lastIndex = this.lastIndex;
				let t = this.matcherRe.exec(e);
				if (!t) return null;
				let n = t.findIndex((e, t) => t > 0 && e !== void 0), r = this.matchIndexes[n];
				return t.splice(0, n), Object.assign(t, r);
			}
		}
		class r {
			constructor() {
				this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
			}
			getMatcher(e) {
				if (this.multiRegexes[e]) return this.multiRegexes[e];
				let t = new n();
				return this.rules.slice(e).forEach(([e, n]) => t.addRule(e, n)), t.compile(), this.multiRegexes[e] = t, t;
			}
			resumingScanAtSamePosition() {
				return this.regexIndex !== 0;
			}
			considerAll() {
				this.regexIndex = 0;
			}
			addRule(e, t) {
				this.rules.push([e, t]), t.type === "begin" && this.count++;
			}
			exec(e) {
				let t = this.getMatcher(this.regexIndex);
				t.lastIndex = this.lastIndex;
				let n = t.exec(e);
				if (this.resumingScanAtSamePosition() && !(n && n.index === this.lastIndex)) {
					let t = this.getMatcher(0);
					t.lastIndex = this.lastIndex + 1, n = t.exec(e);
				}
				return n && (this.regexIndex += n.position + 1, this.regexIndex === this.count && this.considerAll()), n;
			}
		}
		function i(e) {
			let t = new r();
			return e.contains.forEach((e) => t.addRule(e.begin, {
				rule: e,
				type: "begin"
			})), e.terminatorEnd && t.addRule(e.terminatorEnd, { type: "end" }), e.illegal && t.addRule(e.illegal, { type: "illegal" }), t;
		}
		function o(n, r) {
			let a = n;
			if (n.isCompiled) return a;
			[
				me,
				_e,
				Me,
				ye
			].forEach((e) => e(n, r)), e.compilerExtensions.forEach((e) => e(n, r)), n.__beforeBegin = null, [
				he,
				ge,
				ve
			].forEach((e) => e(n, r)), n.isCompiled = !0;
			let s = null;
			return typeof n.keywords == "object" && n.keywords.$pattern && (n.keywords = Object.assign({}, n.keywords), s = n.keywords.$pattern, delete n.keywords.$pattern), s ||= /\w+/, n.keywords &&= O(n.keywords, e.case_insensitive), a.keywordPatternRe = t(s, !0), r && (n.begin ||= /\B|\b/, a.beginRe = t(a.begin), !n.end && !n.endsWithParent && (n.end = /\B|\b/), n.end && (a.endRe = t(a.end)), a.terminatorEnd = p(a.end) || "", n.endsWithParent && r.terminatorEnd && (a.terminatorEnd += (n.end ? "|" : "") + r.terminatorEnd)), n.illegal && (a.illegalRe = t(n.illegal)), n.contains ||= [], n.contains = [].concat(...n.contains.map(function(e) {
				return Pe(e === "self" ? n : e);
			})), n.contains.forEach(function(e) {
				o(e, a);
			}), n.starts && o(n.starts, r), a.matcher = i(a), a;
		}
		if (e.compilerExtensions ||= [], e.contains && e.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
		return e.classNameAliases = a(e.classNameAliases || {}), o(e);
	}
	function Ne(e) {
		return e ? e.endsWithParent || Ne(e.starts) : !1;
	}
	function Pe(e) {
		return e.variants && !e.cachedVariants && (e.cachedVariants = e.variants.map(function(t) {
			return a(e, { variants: null }, t);
		})), e.cachedVariants ? e.cachedVariants : Ne(e) ? a(e, { starts: e.starts ? a(e.starts) : null }) : Object.isFrozen(e) ? a(e) : e;
	}
	var Fe = "11.11.2", Ie = class extends Error {
		constructor(e, t) {
			super(e), this.name = "HTMLInjectionError", this.html = t;
		}
	}, Le = i, Re = a, ze = Symbol("nomatch"), Be = 7, Ve = function(e) {
		let t = Object.create(null), i = Object.create(null), a = [], o = !0, s = "Could not find the language '{}', did you forget to load/include a language module?", c = {
			disableAutodetect: !0,
			name: "Plain text",
			contains: []
		}, l = {
			ignoreUnescapedHTML: !1,
			throwUnescapedHTML: !1,
			noHighlightRe: /^(no-?highlight)$/i,
			languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
			classPrefix: "hljs-",
			cssSelector: "pre code",
			languages: null,
			__emitter: f
		};
		function u(e) {
			return l.noHighlightRe.test(e);
		}
		function d(e) {
			let t = e.className + " ";
			t += e.parentNode ? e.parentNode.className : "";
			let n = l.languageDetectRe.exec(t);
			if (n) {
				let t = oe(n[1]);
				return t || (Ee(s.replace("{}", n[1])), Ee("Falling back to no-highlight mode for this block.", e)), t ? n[1] : "no-highlight";
			}
			return t.split(/\s+/).find((e) => u(e) || oe(e));
		}
		function p(e, t, n) {
			let r = "", i = "";
			typeof t == "object" ? (r = e, n = t.ignoreIllegals, i = t.language) : (De("10.7.0", "highlight(lang, code, ...args) has been deprecated."), De("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"), i = e, r = t), n === void 0 && (n = !0);
			let a = {
				code: r,
				language: i
			};
			de("before:highlight", a);
			let o = a.result ? a.result : v(a.language, a.code, n);
			return o.code = a.code, de("after:highlight", o), o;
		}
		function v(e, n, i, a) {
			let c = Object.create(null);
			function u(e, t) {
				return e.keywords[t];
			}
			function d() {
				if (!T.keywords) {
					E.addText(D);
					return;
				}
				let e = 0;
				T.keywordPatternRe.lastIndex = 0;
				let t = T.keywordPatternRe.exec(D), n = "";
				for (; t;) {
					n += D.substring(e, t.index);
					let r = ne.case_insensitive ? t[0].toLowerCase() : t[0], i = u(T, r);
					if (i) {
						let [e, a] = i;
						if (E.addText(n), n = "", c[r] = (c[r] || 0) + 1, c[r] <= Be && (se += a), e.startsWith("_")) n += t[0];
						else {
							let n = ne.classNameAliases[e] || e;
							m(t[0], n);
						}
					} else n += t[0];
					e = T.keywordPatternRe.lastIndex, t = T.keywordPatternRe.exec(D);
				}
				n += D.substring(e), E.addText(n);
			}
			function f() {
				if (D === "") return;
				let e = null;
				if (typeof T.subLanguage == "string") {
					if (!t[T.subLanguage]) {
						E.addText(D);
						return;
					}
					e = v(T.subLanguage, D, !0, ae[T.subLanguage]), ae[T.subLanguage] = e._top;
				} else e = S(D, T.subLanguage.length ? T.subLanguage : null);
				T.relevance > 0 && (se += e.relevance), E.__addSublanguage(e._emitter, e.language);
			}
			function p() {
				T.subLanguage == null ? d() : f(), D = "";
			}
			function m(e, t) {
				e !== "" && (E.startScope(t), E.addText(e), E.endScope());
			}
			function h(e, t) {
				let n = 1, r = t.length - 1;
				for (; n <= r;) {
					if (!e._emit[n]) {
						n++;
						continue;
					}
					let r = ne.classNameAliases[e[n]] || e[n], i = t[n];
					r ? m(i, r) : (D = i, d(), D = ""), n++;
				}
			}
			function g(e, t) {
				return e.scope && typeof e.scope == "string" && E.openNode(ne.classNameAliases[e.scope] || e.scope), e.beginScope && (e.beginScope._wrap ? (m(D, ne.classNameAliases[e.beginScope._wrap] || e.beginScope._wrap), D = "") : e.beginScope._multi && (h(e.beginScope, t), D = "")), T = Object.create(e, { parent: { value: T } }), T;
			}
			function _(e, t, n) {
				let i = x(e.endRe, n);
				if (i) {
					if (e["on:end"]) {
						let n = new r(e);
						e["on:end"](t, n), n.isMatchIgnored && (i = !1);
					}
					if (i) {
						for (; e.endsParent && e.parent;) e = e.parent;
						return e;
					}
				}
				if (e.endsWithParent) return _(e.parent, t, n);
			}
			function y(e) {
				return T.matcher.regexIndex === 0 ? (D += e[0], 1) : (ue = !0, 0);
			}
			function b(e) {
				let t = e[0], n = e.rule, i = new r(n), a = [n.__beforeBegin, n["on:begin"]];
				for (let n of a) if (n && (n(e, i), i.isMatchIgnored)) return y(t);
				return n.skip ? D += t : (n.excludeBegin && (D += t), p(), !n.returnBegin && !n.excludeBegin && (D = t)), g(n, e), n.returnBegin ? 0 : t.length;
			}
			function ee(e) {
				let t = e[0], r = n.substring(e.index), i = _(T, e, r);
				if (!i) return ze;
				let a = T;
				T.endScope && T.endScope._wrap ? (p(), m(t, T.endScope._wrap)) : T.endScope && T.endScope._multi ? (p(), h(T.endScope, e)) : a.skip ? D += t : (a.returnEnd || a.excludeEnd || (D += t), p(), a.excludeEnd && (D = t));
				do
					T.scope && E.closeNode(), !T.skip && !T.subLanguage && (se += T.relevance), T = T.parent;
				while (T !== i.parent);
				return i.starts && g(i.starts, e), a.returnEnd ? 0 : t.length;
			}
			function C() {
				let e = [];
				for (let t = T; t !== ne; t = t.parent) t.scope && e.unshift(t.scope);
				e.forEach((e) => E.openNode(e));
			}
			let w = {};
			function te(t, r) {
				let a = r && r[0];
				if (D += t, a == null) return p(), 0;
				if (w.type === "begin" && r.type === "end" && w.index === r.index && a === "") {
					if (D += n.slice(r.index, r.index + 1), !o) {
						let t = /* @__PURE__ */ Error(`0 width match regex (${e})`);
						throw t.languageName = e, t.badRule = w.rule, t;
					}
					return 1;
				}
				if (w = r, r.type === "begin") return b(r);
				if (r.type === "illegal" && !i) {
					let e = /* @__PURE__ */ Error("Illegal lexeme \"" + a + "\" for mode \"" + (T.scope || "<unnamed>") + "\"");
					throw e.mode = T, e;
				}
				if (r.type === "end") {
					let e = ee(r);
					if (e !== ze) return e;
				}
				if (r.type === "illegal" && a === "") return r.index === n.length || (D += "\n"), 1;
				if (le > 1e5 && le > r.index * 3) throw /* @__PURE__ */ Error("potential infinite loop, way more iterations than matches");
				return D += a, a.length;
			}
			let ne = oe(e);
			if (!ne) throw Te(s.replace("{}", e)), Error("Unknown language: \"" + e + "\"");
			let re = A(ne), ie = "", T = a || re, ae = {}, E = new l.__emitter(l);
			C();
			let D = "", se = 0, ce = 0, le = 0, ue = !1;
			try {
				if (ne.__emitTokens) ne.__emitTokens(n, E);
				else {
					for (T.matcher.considerAll();;) {
						le++, ue ? ue = !1 : T.matcher.considerAll(), T.matcher.lastIndex = ce;
						let e = T.matcher.exec(n);
						if (!e) break;
						let t = te(n.substring(ce, e.index), e);
						ce = e.index + t;
					}
					te(n.substring(ce));
				}
				return E.finalize(), ie = E.toHTML(), {
					language: e,
					value: ie,
					relevance: se,
					illegal: !1,
					_emitter: E,
					_top: T
				};
			} catch (t) {
				if (t.message && t.message.includes("Illegal")) return {
					language: e,
					value: Le(n),
					illegal: !0,
					relevance: 0,
					_illegalBy: {
						message: t.message,
						index: ce,
						context: n.slice(ce - 100, ce + 100),
						mode: t.mode,
						resultSoFar: ie
					},
					_emitter: E
				};
				if (o) return {
					language: e,
					value: Le(n),
					illegal: !1,
					relevance: 0,
					errorRaised: t,
					_emitter: E,
					_top: T
				};
				throw t;
			}
		}
		function b(e) {
			let t = {
				value: Le(e),
				illegal: !1,
				relevance: 0,
				_top: c,
				_emitter: new l.__emitter(l)
			};
			return t._emitter.addText(e), t;
		}
		function S(e, n) {
			n = n || l.languages || Object.keys(t);
			let r = b(e), i = n.filter(oe).filter(se).map((t) => v(t, e, !1));
			i.unshift(r);
			let [a, o] = i.sort((e, t) => {
				if (e.relevance !== t.relevance) return t.relevance - e.relevance;
				if (e.language && t.language) {
					if (oe(e.language).supersetOf === t.language) return 1;
					if (oe(t.language).supersetOf === e.language) return -1;
				}
				return 0;
			}), s = a;
			return s.secondBest = o, s;
		}
		function ee(e, t, n) {
			let r = t && i[t] || n;
			e.classList.add("hljs"), e.classList.add(`language-${r}`);
		}
		function C(e) {
			let t = null, n = d(e);
			if (u(n)) return;
			if (de("before:highlightElement", {
				el: e,
				language: n
			}), e.dataset.highlighted) {
				console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", e);
				return;
			}
			if (e.children.length > 0 && (l.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(e)), l.throwUnescapedHTML)) throw new Ie("One of your code blocks includes unescaped HTML.", e.innerHTML);
			t = e;
			let r = t.textContent, i = n ? p(r, {
				language: n,
				ignoreIllegals: !0
			}) : S(r);
			e.innerHTML = i.value, e.dataset.highlighted = "yes", ee(e, n, i.language), e.result = {
				language: i.language,
				re: i.relevance,
				relevance: i.relevance
			}, i.secondBest && (e.secondBest = {
				language: i.secondBest.language,
				relevance: i.secondBest.relevance
			}), de("after:highlightElement", {
				el: e,
				result: i,
				text: r
			});
		}
		function w(e) {
			l = Re(l, e);
		}
		let te = () => {
			ie(), De("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
		};
		function ne() {
			ie(), De("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
		}
		let re = !1;
		function ie() {
			function e() {
				ie();
			}
			if (document.readyState === "loading") {
				re || window.addEventListener("DOMContentLoaded", e, !1), re = !0;
				return;
			}
			document.querySelectorAll(l.cssSelector).forEach(C);
		}
		function T(n, r) {
			let i = null;
			try {
				i = r(e);
			} catch (e) {
				if (Te("Language definition for '{}' could not be registered.".replace("{}", n)), o) Te(e);
				else throw e;
				i = c;
			}
			i.name || (i.name = n), t[n] = i, i.rawDefinition = r.bind(null, e), i.aliases && D(i.aliases, { languageName: n });
		}
		function ae(e) {
			delete t[e];
			for (let t of Object.keys(i)) i[t] === e && delete i[t];
		}
		function E() {
			return Object.keys(t);
		}
		function oe(e) {
			return e = (e || "").toLowerCase(), t[e] || t[i[e]];
		}
		function D(e, { languageName: t }) {
			typeof e == "string" && (e = [e]), e.forEach((e) => {
				i[e.toLowerCase()] = t;
			});
		}
		function se(e) {
			let t = oe(e);
			return t && !t.disableAutodetect;
		}
		function ce(e) {
			e["before:highlightBlock"] && !e["before:highlightElement"] && (e["before:highlightElement"] = (t) => {
				e["before:highlightBlock"](Object.assign({ block: t.el }, t));
			}), e["after:highlightBlock"] && !e["after:highlightElement"] && (e["after:highlightElement"] = (t) => {
				e["after:highlightBlock"](Object.assign({ block: t.el }, t));
			});
		}
		function le(e) {
			ce(e), a.push(e);
		}
		function ue(e) {
			let t = a.indexOf(e);
			t !== -1 && a.splice(t, 1);
		}
		function de(e, t) {
			let n = e;
			a.forEach(function(e) {
				e[n] && e[n](t);
			});
		}
		function pe(e) {
			return De("10.7.0", "highlightBlock will be removed entirely in v12.0"), De("10.7.0", "Please use highlightElement now."), C(e);
		}
		Object.assign(e, {
			highlight: p,
			highlightAuto: S,
			highlightAll: ie,
			highlightElement: C,
			highlightBlock: pe,
			configure: w,
			initHighlighting: te,
			initHighlightingOnLoad: ne,
			registerLanguage: T,
			unregisterLanguage: ae,
			listLanguages: E,
			getLanguage: oe,
			registerAliases: D,
			autoDetection: se,
			inherit: Re,
			addPlugin: le,
			removePlugin: ue
		}), e.debugMode = function() {
			o = !1;
		}, e.safeMode = function() {
			o = !0;
		}, e.versionString = Fe, e.regex = {
			concat: _,
			lookahead: m,
			either: y,
			optional: g,
			anyNumberOfTimes: h
		};
		for (let e in fe) typeof fe[e] == "object" && n(fe[e]);
		return Object.assign(e, fe), e;
	}, He = Ve({});
	He.newInstance = () => Ve({}), t.exports = He, He.HighlightJS = He, He.default = He;
})), Cg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = t.concat(/[\p{L}_]/u, t.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), r = /[\p{L}0-9._:-]+/u, i = {
			className: "symbol",
			begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
		}, a = {
			begin: /\s/,
			contains: [{
				className: "keyword",
				begin: /#?[a-z_][a-z1-9_-]+/,
				illegal: /\n/
			}]
		}, o = e.inherit(a, {
			begin: /\(/,
			end: /\)/
		}), s = e.inherit(e.APOS_STRING_MODE, { className: "string" }), c = e.inherit(e.QUOTE_STRING_MODE, { className: "string" }), l = {
			endsWithParent: !0,
			illegal: /</,
			relevance: 0,
			contains: [{
				className: "attr",
				begin: r,
				relevance: 0
			}, {
				begin: /=\s*/,
				relevance: 0,
				contains: [{
					className: "string",
					endsParent: !0,
					variants: [
						{
							begin: /"/,
							end: /"/,
							contains: [i]
						},
						{
							begin: /'/,
							end: /'/,
							contains: [i]
						},
						{ begin: /[^\s"'=<>`]+/ }
					]
				}]
			}]
		};
		return {
			name: "HTML, XML",
			aliases: [
				"html",
				"xhtml",
				"rss",
				"atom",
				"xjb",
				"xsd",
				"xsl",
				"plist",
				"wsf",
				"svg"
			],
			case_insensitive: !0,
			unicodeRegex: !0,
			contains: [
				{
					className: "meta",
					begin: /<![a-z]/,
					end: />/,
					relevance: 10,
					contains: [
						a,
						c,
						s,
						o,
						{
							begin: /\[/,
							end: /\]/,
							contains: [{
								className: "meta",
								begin: /<![a-z]/,
								end: />/,
								contains: [
									a,
									o,
									c,
									s
								]
							}]
						}
					]
				},
				e.COMMENT(/<!--/, /-->/, { relevance: 10 }),
				{
					begin: /<!\[CDATA\[/,
					end: /\]\]>/,
					relevance: 10
				},
				i,
				{
					className: "meta",
					end: /\?>/,
					variants: [{
						begin: /<\?xml/,
						relevance: 10,
						contains: [c]
					}, { begin: /<\?[a-z][a-z0-9]+/ }]
				},
				{
					className: "tag",
					begin: /<style(?=\s|>)/,
					end: />/,
					keywords: { name: "style" },
					contains: [l],
					starts: {
						end: /<\/style>/,
						returnEnd: !0,
						subLanguage: ["css", "xml"]
					}
				},
				{
					className: "tag",
					begin: /<script(?=\s|>)/,
					end: />/,
					keywords: { name: "script" },
					contains: [l],
					starts: {
						end: /<\/script>/,
						returnEnd: !0,
						subLanguage: [
							"javascript",
							"handlebars",
							"xml"
						]
					}
				},
				{
					className: "tag",
					begin: /<>|<\/>/
				},
				{
					className: "tag",
					begin: t.concat(/</, t.lookahead(t.concat(n, t.either(/\/>/, />/, /\s/)))),
					end: /\/?>/,
					contains: [{
						className: "name",
						begin: n,
						relevance: 0,
						starts: l
					}]
				},
				{
					className: "tag",
					begin: t.concat(/<\//, t.lookahead(t.concat(n, />/))),
					contains: [{
						className: "name",
						begin: n,
						relevance: 0
					}, {
						begin: />/,
						relevance: 0,
						endsParent: !0
					}]
				}
			]
		};
	}
	t.exports = n;
})), wg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = {}, r = {
			begin: /\$\{/,
			end: /\}/,
			contains: ["self", {
				begin: /:-/,
				contains: [n]
			}]
		};
		Object.assign(n, {
			className: "variable",
			variants: [{ begin: t.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])") }, r]
		});
		let i = {
			className: "subst",
			begin: /\$\(/,
			end: /\)/,
			contains: [e.BACKSLASH_ESCAPE]
		}, a = e.inherit(e.COMMENT(), {
			match: [/(^|\s)/, /#.*$/],
			scope: { 2: "comment" }
		}), o = {
			begin: /<<-?\s*(?=\w+)/,
			starts: { contains: [e.END_SAME_AS_BEGIN({
				begin: /(\w+)/,
				end: /(\w+)/,
				className: "string"
			})] }
		}, s = {
			className: "string",
			begin: /"/,
			end: /"/,
			contains: [
				e.BACKSLASH_ESCAPE,
				n,
				i
			]
		};
		i.contains.push(s);
		let c = { match: /\\"/ }, l = {
			className: "string",
			begin: /'/,
			end: /'/
		}, u = { match: /\\'/ }, d = {
			begin: /\$?\(\(/,
			end: /\)\)/,
			contains: [
				{
					begin: /\d+#[0-9a-f]+/,
					className: "number"
				},
				e.NUMBER_MODE,
				n
			]
		}, f = e.SHEBANG({
			binary: `(${[
				"fish",
				"bash",
				"zsh",
				"sh",
				"csh",
				"ksh",
				"tcsh",
				"dash",
				"scsh"
			].join("|")})`,
			relevance: 10
		}), p = {
			className: "function",
			begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
			returnBegin: !0,
			contains: [e.inherit(e.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
			relevance: 0
		}, m = [
			"if",
			"then",
			"else",
			"elif",
			"fi",
			"time",
			"for",
			"while",
			"until",
			"in",
			"do",
			"done",
			"case",
			"esac",
			"coproc",
			"function",
			"select"
		], h = ["true", "false"], g = { match: /(\/[a-z._-]+)+/ }, _ = [
			"break",
			"cd",
			"continue",
			"eval",
			"exec",
			"exit",
			"export",
			"getopts",
			"hash",
			"pwd",
			"readonly",
			"return",
			"shift",
			"test",
			"times",
			"trap",
			"umask",
			"unset"
		], v = [
			"alias",
			"bind",
			"builtin",
			"caller",
			"command",
			"declare",
			"echo",
			"enable",
			"help",
			"let",
			"local",
			"logout",
			"mapfile",
			"printf",
			"read",
			"readarray",
			"source",
			"sudo",
			"type",
			"typeset",
			"ulimit",
			"unalias"
		], y = /* @__PURE__ */ "autoload.bg.bindkey.bye.cap.chdir.clone.comparguments.compcall.compctl.compdescribe.compfiles.compgroups.compquote.comptags.comptry.compvalues.dirs.disable.disown.echotc.echoti.emulate.fc.fg.float.functions.getcap.getln.history.integer.jobs.kill.limit.log.noglob.popd.print.pushd.pushln.rehash.sched.setcap.setopt.stat.suspend.ttyctl.unfunction.unhash.unlimit.unsetopt.vared.wait.whence.where.which.zcompile.zformat.zftp.zle.zmodload.zparseopts.zprof.zpty.zregexparse.zsocket.zstyle.ztcp".split("."), b = /* @__PURE__ */ "chcon.chgrp.chown.chmod.cp.dd.df.dir.dircolors.ln.ls.mkdir.mkfifo.mknod.mktemp.mv.realpath.rm.rmdir.shred.sync.touch.truncate.vdir.b2sum.base32.base64.cat.cksum.comm.csplit.cut.expand.fmt.fold.head.join.md5sum.nl.numfmt.od.paste.ptx.pr.sha1sum.sha224sum.sha256sum.sha384sum.sha512sum.shuf.sort.split.sum.tac.tail.tr.tsort.unexpand.uniq.wc.arch.basename.chroot.date.dirname.du.echo.env.expr.factor.groups.hostid.id.link.logname.nice.nohup.nproc.pathchk.pinky.printenv.printf.pwd.readlink.runcon.seq.sleep.stat.stdbuf.stty.tee.test.timeout.tty.uname.unlink.uptime.users.who.whoami.yes".split(".");
		return {
			name: "Bash",
			aliases: ["sh", "zsh"],
			keywords: {
				$pattern: /\b[a-z][a-z0-9._-]+\b/,
				keyword: m,
				literal: h,
				built_in: [
					..._,
					...v,
					"set",
					"shopt",
					...y,
					...b
				]
			},
			contains: [
				f,
				e.SHEBANG(),
				p,
				d,
				a,
				o,
				g,
				s,
				c,
				l,
				u,
				n
			]
		};
	}
	t.exports = n;
})), Tg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = e.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] }), r = "[a-zA-Z_]\\w*::", i = "(decltype\\(auto\\)|" + t.optional(r) + "[a-zA-Z_]\\w*" + t.optional("<[^<>]+>") + ")", a = {
			className: "type",
			variants: [{ begin: "\\b[a-z\\d_]*_t\\b" }, { match: /\batomic_[a-z]{3,6}\b/ }]
		}, o = {
			className: "string",
			variants: [
				{
					begin: "(u8?|U|L)?\"",
					end: "\"",
					illegal: "\\n",
					contains: [e.BACKSLASH_ESCAPE]
				},
				{
					begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
					end: "'",
					illegal: "."
				},
				e.END_SAME_AS_BEGIN({
					begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
					end: /\)([^()\\ ]{0,16})"/
				})
			]
		}, s = {
			className: "number",
			variants: [
				{ match: /\b(0b[01']+)/ },
				{ match: /(-?)\b([\d']+(\.[\d']*)?|\.[\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)/ },
				{ match: /(-?)\b(0[xX][a-fA-F0-9]+(?:'[a-fA-F0-9]+)*(?:\.[a-fA-F0-9]*(?:'[a-fA-F0-9]*)*)?(?:[pP][-+]?[0-9]+)?(l|L)?(u|U)?)/ },
				{ match: /(-?)\b\d+(?:'\d+)*(?:\.\d*(?:'\d*)*)?(?:[eE][-+]?\d+)?/ }
			],
			relevance: 0
		}, c = {
			className: "meta",
			begin: /#\s*[a-z]+\b/,
			end: /$/,
			keywords: { keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef elifdef elifndef include" },
			contains: [
				{
					begin: /\\\n/,
					relevance: 0
				},
				e.inherit(o, { className: "string" }),
				{
					className: "string",
					begin: /<.*?>/
				},
				n,
				e.C_BLOCK_COMMENT_MODE
			]
		}, l = {
			className: "title",
			begin: t.optional(r) + e.IDENT_RE,
			relevance: 0
		}, u = t.optional(r) + e.IDENT_RE + "\\s*\\(", d = {
			keyword: /* @__PURE__ */ "asm.auto.break.case.continue.default.do.else.enum.extern.for.fortran.goto.if.inline.register.restrict.return.sizeof.typeof.typeof_unqual.struct.switch.typedef.union.volatile.while._Alignas._Alignof._Atomic._Generic._Noreturn._Static_assert._Thread_local.alignas.alignof.noreturn.static_assert.thread_local._Pragma".split("."),
			type: /* @__PURE__ */ "float.double.signed.unsigned.int.short.long.char.void._Bool._BitInt._Complex._Imaginary._Decimal32._Decimal64._Decimal96._Decimal128._Decimal64x._Decimal128x._Float16._Float32._Float64._Float128._Float32x._Float64x._Float128x.const.static.constexpr.complex.bool.imaginary".split("."),
			literal: "true false NULL",
			built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"
		}, f = [
			c,
			a,
			n,
			e.C_BLOCK_COMMENT_MODE,
			s,
			o
		], p = {
			variants: [
				{
					begin: /=/,
					end: /;/
				},
				{
					begin: /\(/,
					end: /\)/
				},
				{
					beginKeywords: "new throw return else",
					end: /;/
				}
			],
			keywords: d,
			contains: f.concat([{
				begin: /\(/,
				end: /\)/,
				keywords: d,
				contains: f.concat(["self"]),
				relevance: 0
			}]),
			relevance: 0
		}, m = {
			begin: "(" + i + "[\\*&\\s]+)+" + u,
			returnBegin: !0,
			end: /[{;=]/,
			excludeEnd: !0,
			keywords: d,
			illegal: /[^\w\s\*&:<>.]/,
			contains: [
				{
					begin: "decltype\\(auto\\)",
					keywords: d,
					relevance: 0
				},
				{
					begin: u,
					returnBegin: !0,
					contains: [e.inherit(l, { className: "title.function" })],
					relevance: 0
				},
				{
					relevance: 0,
					match: /,/
				},
				{
					className: "params",
					begin: /\(/,
					end: /\)/,
					keywords: d,
					relevance: 0,
					contains: [
						n,
						e.C_BLOCK_COMMENT_MODE,
						o,
						s,
						a,
						{
							begin: /\(/,
							end: /\)/,
							keywords: d,
							relevance: 0,
							contains: [
								"self",
								n,
								e.C_BLOCK_COMMENT_MODE,
								o,
								s,
								a
							]
						}
					]
				},
				a,
				n,
				e.C_BLOCK_COMMENT_MODE,
				c
			]
		};
		return {
			name: "C",
			aliases: ["h"],
			keywords: d,
			disableAutodetect: !0,
			illegal: "</",
			contains: [].concat(p, m, f, [
				c,
				{
					begin: e.IDENT_RE + "::",
					keywords: d
				},
				{
					className: "class",
					beginKeywords: "enum class struct union",
					end: /[{;:<>=]/,
					contains: [{ beginKeywords: "final class struct" }, e.TITLE_MODE]
				}
			]),
			exports: {
				preprocessor: c,
				strings: o,
				keywords: d
			}
		};
	}
	t.exports = n;
})), Eg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = e.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] }), r = "[a-zA-Z_]\\w*::", i = "(?!struct)(decltype\\(auto\\)|" + t.optional(r) + "[a-zA-Z_]\\w*" + t.optional("<[^<>]+>") + ")", a = {
			className: "type",
			begin: "\\b[a-z\\d_]*_t\\b"
		}, o = {
			className: "string",
			variants: [
				{
					begin: "(u8?|U|L)?\"",
					end: "\"",
					illegal: "\\n",
					contains: [e.BACKSLASH_ESCAPE]
				},
				{
					begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
					end: "'",
					illegal: "."
				},
				e.END_SAME_AS_BEGIN({
					begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
					end: /\)([^()\\ ]{0,16})"/
				})
			]
		}, s = {
			className: "number",
			variants: [{ begin: "[+-]?(?:(?:[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)" }, { begin: "[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)" }],
			relevance: 0
		}, c = {
			className: "meta",
			begin: /#\s*[a-z]+\b/,
			end: /$/,
			keywords: { keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include" },
			contains: [
				{
					begin: /\\\n/,
					relevance: 0
				},
				e.inherit(o, { className: "string" }),
				{
					className: "string",
					begin: /<.*?>/
				},
				n,
				e.C_BLOCK_COMMENT_MODE
			]
		}, l = {
			className: "title",
			begin: t.optional(r) + e.IDENT_RE,
			relevance: 0
		}, u = t.optional(r) + e.IDENT_RE + "\\s*\\(", d = /* @__PURE__ */ "alignas.alignof.and.and_eq.asm.atomic_cancel.atomic_commit.atomic_noexcept.auto.bitand.bitor.break.case.catch.class.co_await.co_return.co_yield.compl.concept.const_cast|10.consteval.constexpr.constinit.continue.decltype.default.delete.do.dynamic_cast|10.else.enum.explicit.export.extern.false.final.for.friend.goto.if.import.inline.module.mutable.namespace.new.noexcept.not.not_eq.nullptr.operator.or.or_eq.override.private.protected.public.reflexpr.register.reinterpret_cast|10.requires.return.sizeof.static_assert.static_cast|10.struct.switch.synchronized.template.this.thread_local.throw.transaction_safe.transaction_safe_dynamic.true.try.typedef.typeid.typename.union.using.virtual.volatile.while.xor.xor_eq".split("."), f = [
			"bool",
			"char",
			"char16_t",
			"char32_t",
			"char8_t",
			"double",
			"float",
			"int",
			"long",
			"short",
			"void",
			"wchar_t",
			"unsigned",
			"signed",
			"const",
			"static"
		], p = /* @__PURE__ */ "any.auto_ptr.barrier.binary_semaphore.bitset.complex.condition_variable.condition_variable_any.counting_semaphore.deque.false_type.flat_map.flat_set.future.imaginary.initializer_list.istringstream.jthread.latch.lock_guard.multimap.multiset.mutex.optional.ostringstream.packaged_task.pair.promise.priority_queue.queue.recursive_mutex.recursive_timed_mutex.scoped_lock.set.shared_future.shared_lock.shared_mutex.shared_timed_mutex.shared_ptr.stack.string_view.stringstream.timed_mutex.thread.true_type.tuple.unique_lock.unique_ptr.unordered_map.unordered_multimap.unordered_multiset.unordered_set.variant.vector.weak_ptr.wstring.wstring_view".split("."), m = /* @__PURE__ */ "abort.abs.acos.apply.as_const.asin.atan.atan2.calloc.ceil.cerr.cin.clog.cos.cosh.cout.declval.endl.exchange.exit.exp.fabs.floor.fmod.forward.fprintf.fputs.free.frexp.fscanf.future.invoke.isalnum.isalpha.iscntrl.isdigit.isgraph.islower.isprint.ispunct.isspace.isupper.isxdigit.labs.launder.ldexp.log.log10.make_pair.make_shared.make_shared_for_overwrite.make_tuple.make_unique.malloc.memchr.memcmp.memcpy.memset.modf.move.pow.printf.putchar.puts.realloc.scanf.sin.sinh.snprintf.sprintf.sqrt.sscanf.std.stderr.stdin.stdout.strcat.strchr.strcmp.strcpy.strcspn.strlen.strncat.strncmp.strncpy.strpbrk.strrchr.strspn.strstr.swap.tan.tanh.terminate.to_underlying.tolower.toupper.vfprintf.visit.vprintf.vsprintf".split("."), h = {
			type: f,
			keyword: d,
			literal: [
				"NULL",
				"false",
				"nullopt",
				"nullptr",
				"true"
			],
			built_in: ["_Pragma"],
			_type_hints: p
		}, g = {
			className: "function.dispatch",
			relevance: 0,
			keywords: { _hint: m },
			begin: t.concat(/\b/, `(?!${d.join("|")})`, e.IDENT_RE, t.lookahead(/(<[^<>]+>|)\s*\(/))
		}, _ = [
			g,
			c,
			a,
			n,
			e.C_BLOCK_COMMENT_MODE,
			s,
			o
		], v = {
			variants: [
				{
					begin: /=/,
					end: /;/
				},
				{
					begin: /\(/,
					end: /\)/
				},
				{
					beginKeywords: "new throw return else",
					end: /;/
				}
			],
			keywords: h,
			contains: _.concat([{
				begin: /\(/,
				end: /\)/,
				keywords: h,
				contains: _.concat(["self"]),
				relevance: 0
			}]),
			relevance: 0
		}, y = {
			className: "function",
			begin: "(" + i + "[\\*&\\s]+)+" + u,
			returnBegin: !0,
			end: /[{;=]/,
			excludeEnd: !0,
			keywords: h,
			illegal: /[^\w\s\*&:<>.]/,
			contains: [
				{
					begin: "decltype\\(auto\\)",
					keywords: h,
					relevance: 0
				},
				{
					begin: u,
					returnBegin: !0,
					contains: [l],
					relevance: 0
				},
				{
					begin: /::/,
					relevance: 0
				},
				{
					begin: /:/,
					endsWithParent: !0,
					contains: [o, s]
				},
				{
					relevance: 0,
					match: /,/
				},
				{
					className: "params",
					begin: /\(/,
					end: /\)/,
					keywords: h,
					relevance: 0,
					contains: [
						n,
						e.C_BLOCK_COMMENT_MODE,
						o,
						s,
						a,
						{
							begin: /\(/,
							end: /\)/,
							keywords: h,
							relevance: 0,
							contains: [
								"self",
								n,
								e.C_BLOCK_COMMENT_MODE,
								o,
								s,
								a
							]
						}
					]
				},
				a,
				n,
				e.C_BLOCK_COMMENT_MODE,
				c
			]
		};
		return {
			name: "C++",
			aliases: [
				"cc",
				"c++",
				"h++",
				"hpp",
				"hh",
				"hxx",
				"cxx"
			],
			keywords: h,
			illegal: "</",
			classNameAliases: { "function.dispatch": "built_in" },
			contains: [].concat(v, y, g, _, [
				c,
				{
					begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)",
					end: ">",
					keywords: h,
					contains: ["self", a]
				},
				{
					begin: e.IDENT_RE + "::",
					keywords: h
				},
				{
					match: [
						/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
						/\s+/,
						/\w+/
					],
					className: {
						1: "keyword",
						3: "title.class"
					}
				}
			])
		};
	}
	t.exports = n;
})), Dg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = [
			"bool",
			"byte",
			"char",
			"decimal",
			"delegate",
			"double",
			"dynamic",
			"enum",
			"float",
			"int",
			"long",
			"nint",
			"nuint",
			"object",
			"sbyte",
			"short",
			"string",
			"ulong",
			"uint",
			"ushort"
		], n = [
			"public",
			"private",
			"protected",
			"static",
			"internal",
			"protected",
			"abstract",
			"async",
			"extern",
			"override",
			"unsafe",
			"virtual",
			"new",
			"sealed",
			"partial"
		], r = {
			keyword: (/* @__PURE__ */ "abstract.as.base.break.case.catch.class.const.continue.do.else.event.explicit.extern.finally.fixed.for.foreach.goto.if.implicit.in.interface.internal.is.lock.namespace.new.operator.out.override.params.private.protected.public.readonly.record.ref.return.scoped.sealed.sizeof.stackalloc.static.struct.switch.this.throw.try.typeof.unchecked.unsafe.using.virtual.void.volatile.while".split(".")).concat(/* @__PURE__ */ "add.alias.and.ascending.args.async.await.by.descending.dynamic.equals.file.from.get.global.group.init.into.join.let.nameof.not.notnull.on.or.orderby.partial.record.remove.required.scoped.select.set.unmanaged.value|0.var.when.where.with.yield".split(".")),
			built_in: t,
			literal: [
				"default",
				"false",
				"null",
				"true"
			]
		}, i = e.inherit(e.TITLE_MODE, { begin: "[a-zA-Z](\\.?\\w)*" }), a = {
			className: "number",
			variants: [
				{ begin: "\\b(0b[01']+)" },
				{ begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)" },
				{ begin: "(-?)(\\b0[xX][a-fA-F0-9'_]+|(\\b[\\d'_]+(\\.[\\d'_]*)?|\\.[\\d'_]+)([eE][-+]?[\\d'_]+)?)" }
			],
			relevance: 0
		}, o = {
			className: "string",
			begin: /"""("*)(?!")(.|\n)*?"""\1/,
			relevance: 1
		}, s = {
			className: "string",
			begin: "@\"",
			end: "\"",
			contains: [{ begin: "\"\"" }]
		}, c = e.inherit(s, { illegal: /\n/ }), l = {
			className: "subst",
			begin: /\{/,
			end: /\}/,
			keywords: r
		}, u = e.inherit(l, { illegal: /\n/ }), d = {
			className: "string",
			begin: /\$"/,
			end: "\"",
			illegal: /\n/,
			contains: [
				{ begin: /\{\{/ },
				{ begin: /\}\}/ },
				e.BACKSLASH_ESCAPE,
				u
			]
		}, f = {
			className: "string",
			begin: /\$@"/,
			end: "\"",
			contains: [
				{ begin: /\{\{/ },
				{ begin: /\}\}/ },
				{ begin: "\"\"" },
				l
			]
		}, p = e.inherit(f, {
			illegal: /\n/,
			contains: [
				{ begin: /\{\{/ },
				{ begin: /\}\}/ },
				{ begin: "\"\"" },
				u
			]
		});
		l.contains = [
			f,
			d,
			s,
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			a,
			e.C_BLOCK_COMMENT_MODE
		], u.contains = [
			p,
			d,
			c,
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			a,
			e.inherit(e.C_BLOCK_COMMENT_MODE, { illegal: /\n/ })
		];
		let m = { variants: [
			o,
			f,
			d,
			s,
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE
		] }, h = {
			begin: "<",
			end: ">",
			contains: [{ beginKeywords: "in out" }, i]
		}, g = e.IDENT_RE + "(<" + e.IDENT_RE + "(\\s*,\\s*" + e.IDENT_RE + ")*>)?(\\[\\])?", _ = {
			begin: "@" + e.IDENT_RE,
			relevance: 0
		};
		return {
			name: "C#",
			aliases: ["cs", "c#"],
			keywords: r,
			illegal: /::/,
			contains: [
				e.COMMENT("///", "$", {
					returnBegin: !0,
					contains: [{
						className: "doctag",
						variants: [
							{
								begin: "///",
								relevance: 0
							},
							{ begin: "<!--|-->" },
							{
								begin: "</?",
								end: ">"
							}
						]
					}]
				}),
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				{
					className: "meta",
					begin: "#",
					end: "$",
					keywords: { keyword: "if else elif endif define undef warning error line region endregion pragma checksum" }
				},
				m,
				a,
				{
					beginKeywords: "class interface",
					relevance: 0,
					end: /[{;=]/,
					illegal: /[^\s:,]/,
					contains: [
						{ beginKeywords: "where class" },
						i,
						h,
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				{
					beginKeywords: "namespace",
					relevance: 0,
					end: /[{;=]/,
					illegal: /[^\s:]/,
					contains: [
						i,
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				{
					beginKeywords: "record",
					relevance: 0,
					end: /[{;=]/,
					illegal: /[^\s:]/,
					contains: [
						i,
						h,
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				{
					className: "meta",
					begin: "^\\s*\\[(?=[\\w])",
					excludeBegin: !0,
					end: "\\]",
					excludeEnd: !0,
					contains: [{
						className: "string",
						begin: /"/,
						end: /"/
					}]
				},
				{
					beginKeywords: "new return throw await else",
					relevance: 0
				},
				{
					className: "function",
					begin: "(" + g + "\\s+)+" + e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
					returnBegin: !0,
					end: /\s*[{;=]/,
					excludeEnd: !0,
					keywords: r,
					contains: [
						{
							beginKeywords: n.join(" "),
							relevance: 0
						},
						{
							begin: e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
							returnBegin: !0,
							contains: [e.TITLE_MODE, h],
							relevance: 0
						},
						{ match: /\(\)/ },
						{
							className: "params",
							begin: /\(/,
							end: /\)/,
							excludeBegin: !0,
							excludeEnd: !0,
							keywords: r,
							relevance: 0,
							contains: [
								m,
								a,
								e.C_BLOCK_COMMENT_MODE
							]
						},
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				_
			]
		};
	}
	t.exports = n;
})), Og = /* @__PURE__ */ o(((e, t) => {
	var n = (e) => ({
		IMPORTANT: {
			scope: "meta",
			begin: "!important"
		},
		BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
		HEXCOLOR: {
			scope: "number",
			begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
		},
		UNICODE_RANGE: {
			scope: "number",
			begin: /\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,4}(-[0-9A-Fa-f][0-9A-Fa-f]{0,4})?/
		},
		FUNCTION_DISPATCH: {
			className: "built_in",
			begin: /[\w-]+(?=\()/
		},
		ATTRIBUTE_SELECTOR_MODE: {
			scope: "selector-attr",
			begin: /\[/,
			end: /\]/,
			illegal: "$",
			contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
		},
		CSS_NUMBER_MODE: {
			scope: "number",
			begin: e.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
			relevance: 0
		},
		CSS_VARIABLE: {
			className: "attr",
			begin: /--[A-Za-z_][A-Za-z0-9_-]*/
		}
	}), r = /* @__PURE__ */ "a.abbr.address.article.aside.audio.b.blockquote.body.button.canvas.caption.cite.code.dd.del.details.dfn.div.dl.dt.em.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.hgroup.html.i.iframe.img.input.ins.kbd.label.legend.li.main.mark.menu.nav.object.ol.optgroup.option.p.picture.q.quote.samp.section.select.source.span.strong.summary.sup.table.tbody.td.textarea.tfoot.th.thead.time.tr.ul.var.video".split("."), i = /* @__PURE__ */ "defs.g.marker.mask.pattern.svg.switch.symbol.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feFlood.feGaussianBlur.feImage.feMerge.feMorphology.feOffset.feSpecularLighting.feTile.feTurbulence.linearGradient.radialGradient.stop.circle.ellipse.image.line.path.polygon.polyline.rect.text.use.textPath.tspan.foreignObject.clipPath".split("."), a = [...r, ...i], o = (/* @__PURE__ */ "any-hover.any-pointer.aspect-ratio.color.color-gamut.color-index.device-aspect-ratio.device-height.device-width.display-mode.forced-colors.grid.height.hover.inverted-colors.monochrome.orientation.overflow-block.overflow-inline.pointer.prefers-color-scheme.prefers-contrast.prefers-reduced-motion.prefers-reduced-transparency.resolution.scan.scripting.update.width.min-width.max-width.min-height.max-height".split(".")).sort().reverse(), s = (/* @__PURE__ */ "active.any-link.blank.checked.current.default.defined.dir.disabled.drop.empty.enabled.first.first-child.first-of-type.fullscreen.future.focus.focus-visible.focus-within.has.host.host-context.hover.indeterminate.in-range.invalid.is.lang.last-child.last-of-type.left.link.local-link.not.nth-child.nth-col.nth-last-child.nth-last-col.nth-last-of-type.nth-of-type.only-child.only-of-type.optional.out-of-range.past.placeholder-shown.read-only.read-write.required.right.root.scope.target.target-within.user-invalid.valid.visited.where".split(".")).sort().reverse(), c = [
		"after",
		"backdrop",
		"before",
		"cue",
		"cue-region",
		"first-letter",
		"first-line",
		"grammar-error",
		"marker",
		"part",
		"placeholder",
		"selection",
		"slotted",
		"spelling-error"
	].sort().reverse(), l = (/* @__PURE__ */ "accent-color.align-content.align-items.align-self.alignment-baseline.all.anchor-name.animation.animation-composition.animation-delay.animation-direction.animation-duration.animation-fill-mode.animation-iteration-count.animation-name.animation-play-state.animation-range.animation-range-end.animation-range-start.animation-timeline.animation-timing-function.appearance.aspect-ratio.backdrop-filter.backface-visibility.background.background-attachment.background-blend-mode.background-clip.background-color.background-image.background-origin.background-position.background-position-x.background-position-y.background-repeat.background-size.baseline-shift.block-size.border.border-block.border-block-color.border-block-end.border-block-end-color.border-block-end-style.border-block-end-width.border-block-start.border-block-start-color.border-block-start-style.border-block-start-width.border-block-style.border-block-width.border-bottom.border-bottom-color.border-bottom-left-radius.border-bottom-right-radius.border-bottom-style.border-bottom-width.border-collapse.border-color.border-end-end-radius.border-end-start-radius.border-image.border-image-outset.border-image-repeat.border-image-slice.border-image-source.border-image-width.border-inline.border-inline-color.border-inline-end.border-inline-end-color.border-inline-end-style.border-inline-end-width.border-inline-start.border-inline-start-color.border-inline-start-style.border-inline-start-width.border-inline-style.border-inline-width.border-left.border-left-color.border-left-style.border-left-width.border-radius.border-right.border-right-color.border-right-style.border-right-width.border-spacing.border-start-end-radius.border-start-start-radius.border-style.border-top.border-top-color.border-top-left-radius.border-top-right-radius.border-top-style.border-top-width.border-width.bottom.box-align.box-decoration-break.box-direction.box-flex.box-flex-group.box-lines.box-ordinal-group.box-orient.box-pack.box-shadow.box-sizing.break-after.break-before.break-inside.caption-side.caret-color.clear.clip.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.color-scheme.column-count.column-fill.column-gap.column-rule.column-rule-color.column-rule-style.column-rule-width.column-span.column-width.columns.contain.contain-intrinsic-block-size.contain-intrinsic-height.contain-intrinsic-inline-size.contain-intrinsic-size.contain-intrinsic-width.container.container-name.container-type.content.content-visibility.counter-increment.counter-reset.counter-set.cue.cue-after.cue-before.cursor.cx.cy.direction.display.dominant-baseline.empty-cells.enable-background.field-sizing.fill.fill-opacity.fill-rule.filter.flex.flex-basis.flex-direction.flex-flow.flex-grow.flex-shrink.flex-wrap.float.flood-color.flood-opacity.flow.font.font-display.font-family.font-feature-settings.font-kerning.font-language-override.font-optical-sizing.font-palette.font-size.font-size-adjust.font-smooth.font-smoothing.font-stretch.font-style.font-synthesis.font-synthesis-position.font-synthesis-small-caps.font-synthesis-style.font-synthesis-weight.font-variant.font-variant-alternates.font-variant-caps.font-variant-east-asian.font-variant-emoji.font-variant-ligatures.font-variant-numeric.font-variant-position.font-variation-settings.font-weight.forced-color-adjust.gap.glyph-orientation-horizontal.glyph-orientation-vertical.grid.grid-area.grid-auto-columns.grid-auto-flow.grid-auto-rows.grid-column.grid-column-end.grid-column-start.grid-gap.grid-row.grid-row-end.grid-row-start.grid-template.grid-template-areas.grid-template-columns.grid-template-rows.hanging-punctuation.height.hyphenate-character.hyphenate-limit-chars.hyphens.icon.image-orientation.image-rendering.image-resolution.ime-mode.initial-letter.initial-letter-align.inline-size.inset.inset-area.inset-block.inset-block-end.inset-block-start.inset-inline.inset-inline-end.inset-inline-start.isolation.justify-content.justify-items.justify-self.kerning.left.letter-spacing.lighting-color.line-break.line-height.line-height-step.list-style.list-style-image.list-style-position.list-style-type.margin.margin-block.margin-block-end.margin-block-start.margin-bottom.margin-inline.margin-inline-end.margin-inline-start.margin-left.margin-right.margin-top.margin-trim.marker.marker-end.marker-mid.marker-start.marks.mask.mask-border.mask-border-mode.mask-border-outset.mask-border-repeat.mask-border-slice.mask-border-source.mask-border-width.mask-clip.mask-composite.mask-image.mask-mode.mask-origin.mask-position.mask-repeat.mask-size.mask-type.masonry-auto-flow.math-depth.math-shift.math-style.max-block-size.max-height.max-inline-size.max-width.min-block-size.min-height.min-inline-size.min-width.mix-blend-mode.nav-down.nav-index.nav-left.nav-right.nav-up.none.normal.object-fit.object-position.offset.offset-anchor.offset-distance.offset-path.offset-position.offset-rotate.opacity.order.orphans.outline.outline-color.outline-offset.outline-style.outline-width.overflow.overflow-anchor.overflow-block.overflow-clip-margin.overflow-inline.overflow-wrap.overflow-x.overflow-y.overlay.overscroll-behavior.overscroll-behavior-block.overscroll-behavior-inline.overscroll-behavior-x.overscroll-behavior-y.padding.padding-block.padding-block-end.padding-block-start.padding-bottom.padding-inline.padding-inline-end.padding-inline-start.padding-left.padding-right.padding-top.page.page-break-after.page-break-before.page-break-inside.paint-order.pause.pause-after.pause-before.perspective.perspective-origin.place-content.place-items.place-self.pointer-events.position.position-anchor.position-visibility.print-color-adjust.quotes.r.resize.rest.rest-after.rest-before.right.rotate.row-gap.ruby-align.ruby-position.scale.scroll-behavior.scroll-margin.scroll-margin-block.scroll-margin-block-end.scroll-margin-block-start.scroll-margin-bottom.scroll-margin-inline.scroll-margin-inline-end.scroll-margin-inline-start.scroll-margin-left.scroll-margin-right.scroll-margin-top.scroll-padding.scroll-padding-block.scroll-padding-block-end.scroll-padding-block-start.scroll-padding-bottom.scroll-padding-inline.scroll-padding-inline-end.scroll-padding-inline-start.scroll-padding-left.scroll-padding-right.scroll-padding-top.scroll-snap-align.scroll-snap-stop.scroll-snap-type.scroll-timeline.scroll-timeline-axis.scroll-timeline-name.scrollbar-color.scrollbar-gutter.scrollbar-width.shape-image-threshold.shape-margin.shape-outside.shape-rendering.speak.speak-as.src.stop-color.stop-opacity.stroke.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke-width.tab-size.table-layout.text-align.text-align-all.text-align-last.text-anchor.text-combine-upright.text-decoration.text-decoration-color.text-decoration-line.text-decoration-skip.text-decoration-skip-ink.text-decoration-style.text-decoration-thickness.text-emphasis.text-emphasis-color.text-emphasis-position.text-emphasis-style.text-indent.text-justify.text-orientation.text-overflow.text-rendering.text-shadow.text-size-adjust.text-transform.text-underline-offset.text-underline-position.text-wrap.text-wrap-mode.text-wrap-style.timeline-scope.top.touch-action.transform.transform-box.transform-origin.transform-style.transition.transition-behavior.transition-delay.transition-duration.transition-property.transition-timing-function.translate.unicode-bidi.unicode-range.user-modify.user-select.vector-effect.vertical-align.view-timeline.view-timeline-axis.view-timeline-inset.view-timeline-name.view-transition-name.visibility.voice-balance.voice-duration.voice-family.voice-pitch.voice-range.voice-rate.voice-stress.voice-volume.white-space.white-space-collapse.widows.width.will-change.word-break.word-spacing.word-wrap.writing-mode.x.y.z-index.zoom".split(".")).sort().reverse();
	function u(e) {
		let t = e.regex, r = n(e), i = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ }, u = /@-?\w[\w]*(-\w+)*/, d = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE];
		return {
			name: "CSS",
			case_insensitive: !0,
			illegal: /[=|'\$]/,
			keywords: { keyframePosition: "from to" },
			classNameAliases: { keyframePosition: "selector-tag" },
			contains: [
				r.BLOCK_COMMENT,
				i,
				r.CSS_NUMBER_MODE,
				{
					className: "selector-id",
					begin: /#[A-Za-z0-9_-]+/,
					relevance: 0
				},
				{
					className: "selector-class",
					begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*",
					relevance: 0
				},
				r.ATTRIBUTE_SELECTOR_MODE,
				{
					className: "selector-pseudo",
					variants: [{ begin: ":(" + s.join("|") + ")" }, { begin: ":(:)?(" + c.join("|") + ")" }]
				},
				r.CSS_VARIABLE,
				{
					className: "attribute",
					begin: "\\b(" + l.join("|") + ")\\b"
				},
				{
					begin: /:/,
					end: /[;}{]/,
					contains: [
						r.BLOCK_COMMENT,
						r.HEXCOLOR,
						r.IMPORTANT,
						r.CSS_NUMBER_MODE,
						r.UNICODE_RANGE,
						...d,
						{
							begin: /(url|data-uri)\(/,
							end: /\)/,
							relevance: 0,
							keywords: { built_in: "url data-uri" },
							contains: [...d, {
								className: "string",
								begin: /[^)]/,
								endsWithParent: !0,
								excludeEnd: !0
							}]
						},
						r.FUNCTION_DISPATCH
					]
				},
				{
					begin: t.lookahead(/@/),
					end: "[{;]",
					relevance: 0,
					illegal: /:/,
					contains: [{
						className: "keyword",
						begin: u
					}, {
						begin: /\s/,
						endsWithParent: !0,
						excludeEnd: !0,
						relevance: 0,
						keywords: {
							$pattern: /[a-z-]+/,
							keyword: "and or not only",
							attribute: o.join(" ")
						},
						contains: [
							{
								begin: /[a-z-]+(?=:)/,
								className: "attribute"
							},
							...d,
							r.CSS_NUMBER_MODE
						]
					}]
				},
				{
					className: "selector-tag",
					begin: "\\b(" + a.join("|") + ")\\b"
				}
			]
		};
	}
	t.exports = u;
})), kg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = {
			begin: /<\/?[A-Za-z_]/,
			end: ">",
			subLanguage: "xml",
			relevance: 0
		}, r = {
			begin: "^[-\\*]{3,}",
			end: "$"
		}, i = {
			className: "code",
			variants: [
				{ begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
				{ begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*" },
				{
					begin: "```",
					end: "```+[ ]*$"
				},
				{
					begin: "~~~",
					end: "~~~+[ ]*$"
				},
				{ begin: "`.+?`" },
				{
					begin: "(?=^( {4}|\\t))",
					contains: [{
						begin: "^( {4}|\\t)",
						end: "(\\n)$"
					}],
					relevance: 0
				}
			]
		}, a = {
			className: "bullet",
			begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
			end: "\\s+",
			excludeEnd: !0
		}, o = {
			begin: /^\[[^\n]+\]:/,
			returnBegin: !0,
			contains: [{
				className: "symbol",
				begin: /\[/,
				end: /\]/,
				excludeBegin: !0,
				excludeEnd: !0
			}, {
				className: "link",
				begin: /:\s*/,
				end: /$/,
				excludeBegin: !0
			}]
		}, s = {
			variants: [
				{
					begin: /\[.+?\]\[.*?\]/,
					relevance: 0
				},
				{
					begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
					relevance: 2
				},
				{
					begin: t.concat(/\[.+?\]\(/, /[A-Za-z][A-Za-z0-9+.-]*/, /:\/\/.*?\)/),
					relevance: 2
				},
				{
					begin: /\[.+?\]\([./?&#].*?\)/,
					relevance: 1
				},
				{
					begin: /\[.*?\]\(.*?\)/,
					relevance: 0
				}
			],
			returnBegin: !0,
			contains: [
				{ match: /\[(?=\])/ },
				{
					className: "string",
					relevance: 0,
					begin: "\\[",
					end: "\\]",
					excludeBegin: !0,
					returnEnd: !0
				},
				{
					className: "link",
					relevance: 0,
					begin: "\\]\\(",
					end: "\\)",
					excludeBegin: !0,
					excludeEnd: !0
				},
				{
					className: "symbol",
					relevance: 0,
					begin: "\\]\\[",
					end: "\\]",
					excludeBegin: !0,
					excludeEnd: !0
				}
			]
		}, c = {
			className: "strong",
			contains: [],
			variants: [{
				begin: /_{2}(?!\s)/,
				end: /_{2}/
			}, {
				begin: /\*{2}(?!\s)/,
				end: /\*{2}/
			}]
		}, l = {
			className: "emphasis",
			contains: [],
			variants: [{
				begin: /\*(?![*\s])/,
				end: /\*/
			}, {
				begin: /_(?![_\s])/,
				end: /_/,
				relevance: 0
			}]
		}, u = e.inherit(c, { contains: [] }), d = e.inherit(l, { contains: [] });
		c.contains.push(d), l.contains.push(u);
		let f = [n, s];
		return [
			c,
			l,
			u,
			d
		].forEach((e) => {
			e.contains = e.contains.concat(f);
		}), f = f.concat(c, l), {
			name: "Markdown",
			aliases: [
				"md",
				"mkdown",
				"mkd"
			],
			contains: [
				{
					className: "section",
					variants: [{
						begin: "^#{1,6}",
						end: "$",
						contains: f
					}, {
						begin: "(?=^.+?\\n[=-]{2,}$)",
						contains: [{ begin: "^[=-]*$" }, {
							begin: "^",
							end: "\\n",
							contains: f
						}]
					}]
				},
				n,
				a,
				c,
				l,
				{
					className: "quote",
					begin: "^>\\s+",
					contains: f,
					end: "$"
				},
				i,
				r,
				s,
				o,
				{
					scope: "literal",
					match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/
				}
			]
		};
	}
	t.exports = n;
})), Ag = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex;
		return {
			name: "Diff",
			aliases: ["patch"],
			contains: [
				{
					className: "meta",
					relevance: 10,
					match: t.either(/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/, /^@@ +-\d+ +\+\d+,\d+ +@@/, /^@@ +-\d+,\d+ +\+\d+ +@@/, /^@@ +-\d+ +\+\d+ +@@/, /^\*\*\* +\d+,\d+ +\*\*\*\*$/, /^--- +\d+,\d+ +----$/)
				},
				{
					className: "comment",
					variants: [{
						begin: t.either(/Index: /, /^index/, /={3,}/, /^-{3}/, /^\*{3} /, /^\+{3}/, /^diff --git/),
						end: /$/
					}, { match: /^\*{15}$/ }]
				},
				{
					className: "addition",
					begin: /^\+/,
					end: /$/
				},
				{
					className: "deletion",
					begin: /^-/,
					end: /$/
				},
				{
					className: "addition",
					begin: /^!/,
					end: /$/
				}
			]
		};
	}
	t.exports = n;
})), jg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)", r = t.either(/\b([A-Z]+[a-z0-9]+)+/, /\b([A-Z]+[a-z0-9]+)+[A-Z]+/), i = t.concat(r, /(::\w+)*/), a = {
			"variable.constant": [
				"__FILE__",
				"__LINE__",
				"__ENCODING__"
			],
			"variable.language": ["self", "super"],
			keyword: /* @__PURE__ */ "alias.and.begin.BEGIN.break.case.class.defined.do.else.elsif.end.END.ensure.for.if.in.module.next.not.or.redo.require.rescue.retry.return.then.undef.unless.until.when.while.yield.include.extend.prepend.public.private.protected.raise.throw".split("."),
			built_in: [
				"proc",
				"lambda",
				"attr_accessor",
				"attr_reader",
				"attr_writer",
				"define_method",
				"private_constant",
				"module_function"
			],
			literal: [
				"true",
				"false",
				"nil"
			]
		}, o = {
			className: "doctag",
			begin: "@[A-Za-z]+"
		}, s = {
			begin: "#<",
			end: ">"
		}, c = [
			e.COMMENT("#", "$", { contains: [o] }),
			e.COMMENT("^=begin", "^=end", {
				contains: [o],
				relevance: 10
			}),
			e.COMMENT("^__END__", e.MATCH_NOTHING_RE)
		], l = {
			className: "subst",
			begin: /#\{/,
			end: /\}/,
			keywords: a
		}, u = {
			className: "string",
			contains: [e.BACKSLASH_ESCAPE, l],
			variants: [
				{
					begin: /'/,
					end: /'/
				},
				{
					begin: /"/,
					end: /"/
				},
				{
					begin: /`/,
					end: /`/
				},
				{
					begin: /%[qQwWx]?\(/,
					end: /\)/
				},
				{
					begin: /%[qQwWx]?\[/,
					end: /\]/
				},
				{
					begin: /%[qQwWx]?\{/,
					end: /\}/
				},
				{
					begin: /%[qQwWx]?</,
					end: />/
				},
				{
					begin: /%[qQwWx]?\//,
					end: /\//
				},
				{
					begin: /%[qQwWx]?%/,
					end: /%/
				},
				{
					begin: /%[qQwWx]?-/,
					end: /-/
				},
				{
					begin: /%[qQwWx]?\|/,
					end: /\|/
				},
				{ begin: /\B\?(\\\d{1,3})/ },
				{ begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/ },
				{ begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/ },
				{ begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/ },
				{ begin: /\B\?\\(c|C-)[\x20-\x7e]/ },
				{ begin: /\B\?\\?\S/ },
				{
					begin: t.concat(/<<[-~]?'?/, t.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)),
					contains: [e.END_SAME_AS_BEGIN({
						begin: /(\w+)/,
						end: /(\w+)/,
						contains: [e.BACKSLASH_ESCAPE, l]
					})]
				}
			]
		}, d = "[0-9](_?[0-9])*", f = {
			className: "number",
			relevance: 0,
			variants: [
				{ begin: `\\b([1-9](_?[0-9])*|0)(\\.(${d}))?([eE][+-]?(${d})|r)?i?\\b` },
				{ begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b" },
				{ begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b" },
				{ begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b" },
				{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b" },
				{ begin: "\\b0(_?[0-7])+r?i?\\b" }
			]
		}, p = { variants: [{ match: /\(\)/ }, {
			className: "params",
			begin: /\(/,
			end: /(?=\))/,
			excludeBegin: !0,
			endsParent: !0,
			keywords: a
		}] }, m = [
			u,
			{
				variants: [{ match: [
					/class\s+/,
					i,
					/\s+<\s+/,
					i
				] }, { match: [/\b(class|module)\s+/, i] }],
				scope: {
					2: "title.class",
					4: "title.class.inherited"
				},
				keywords: a
			},
			{
				match: [/(include|extend)\s+/, i],
				scope: { 2: "title.class" },
				keywords: a
			},
			{
				relevance: 0,
				match: [i, /\.new[. (]/],
				scope: { 1: "title.class" }
			},
			{
				relevance: 0,
				match: /\b[A-Z][A-Z_0-9]+\b/,
				className: "variable.constant"
			},
			{
				relevance: 0,
				match: r,
				scope: "title.class"
			},
			{
				match: [
					/def/,
					/\s+/,
					n
				],
				scope: {
					1: "keyword",
					3: "title.function"
				},
				contains: [p]
			},
			{ begin: e.IDENT_RE + "::" },
			{
				className: "symbol",
				begin: e.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
				relevance: 0
			},
			{
				className: "symbol",
				begin: ":(?!\\s)",
				contains: [u, { begin: n }],
				relevance: 0
			},
			f,
			{
				className: "variable",
				begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"
			},
			{
				className: "params",
				begin: /\|(?!=)/,
				end: /\|/,
				excludeBegin: !0,
				excludeEnd: !0,
				relevance: 0,
				keywords: a
			},
			{
				begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
				keywords: "unless",
				contains: [{
					className: "regexp",
					contains: [e.BACKSLASH_ESCAPE, l],
					illegal: /\n/,
					variants: [
						{
							begin: "/",
							end: "/[a-z]*"
						},
						{
							begin: /%r\{/,
							end: /\}[a-z]*/
						},
						{
							begin: "%r\\(",
							end: "\\)[a-z]*"
						},
						{
							begin: "%r!",
							end: "![a-z]*"
						},
						{
							begin: "%r\\[",
							end: "\\][a-z]*"
						}
					]
				}].concat(s, c),
				relevance: 0
			}
		].concat(s, c);
		l.contains = m, p.contains = m;
		let h = [{
			begin: /^\s*=>/,
			starts: {
				end: "$",
				contains: m
			}
		}, {
			className: "meta.prompt",
			begin: "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",
			starts: {
				end: "$",
				keywords: a,
				contains: m
			}
		}];
		return c.unshift(s), {
			name: "Ruby",
			aliases: [
				"rb",
				"gemspec",
				"podspec",
				"thor",
				"irb"
			],
			keywords: a,
			illegal: /\/\*/,
			contains: [e.SHEBANG({ binary: "ruby" })].concat(h, c, m)
		};
	}
	t.exports = n;
})), Mg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = {
			keyword: [
				"break",
				"case",
				"chan",
				"const",
				"continue",
				"default",
				"defer",
				"else",
				"fallthrough",
				"for",
				"func",
				"go",
				"goto",
				"if",
				"import",
				"interface",
				"map",
				"package",
				"range",
				"return",
				"select",
				"struct",
				"switch",
				"type",
				"var"
			],
			type: [
				"bool",
				"byte",
				"complex64",
				"complex128",
				"error",
				"float32",
				"float64",
				"int8",
				"int16",
				"int32",
				"int64",
				"string",
				"uint8",
				"uint16",
				"uint32",
				"uint64",
				"int",
				"uint",
				"uintptr",
				"rune"
			],
			literal: [
				"true",
				"false",
				"iota",
				"nil"
			],
			built_in: [
				"append",
				"cap",
				"close",
				"complex",
				"copy",
				"imag",
				"len",
				"make",
				"new",
				"panic",
				"print",
				"println",
				"real",
				"recover",
				"delete"
			]
		};
		return {
			name: "Go",
			aliases: ["golang"],
			keywords: t,
			illegal: "</",
			contains: [
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				{
					className: "string",
					variants: [
						e.QUOTE_STRING_MODE,
						e.APOS_STRING_MODE,
						{
							begin: "`",
							end: "`"
						}
					]
				},
				{
					className: "number",
					variants: [
						{
							match: /-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,
							relevance: 0
						},
						{
							match: /-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,
							relevance: 0
						},
						{
							match: /-?\b0[oO](_?[0-7])*i?/,
							relevance: 0
						},
						{
							match: /-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,
							relevance: 0
						},
						{
							match: /-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,
							relevance: 0
						}
					]
				},
				{ begin: /:=/ },
				{
					className: "function",
					beginKeywords: "func",
					end: "\\s*(\\{|$)",
					excludeEnd: !0,
					contains: [e.TITLE_MODE, {
						className: "params",
						begin: /\(/,
						end: /\)/,
						endsParent: !0,
						keywords: t,
						illegal: /["']/
					}]
				}
			]
		};
	}
	t.exports = n;
})), Ng = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex;
		return {
			name: "GraphQL",
			aliases: ["gql"],
			case_insensitive: !0,
			disableAutodetect: !1,
			keywords: {
				keyword: [
					"query",
					"mutation",
					"subscription",
					"type",
					"input",
					"schema",
					"directive",
					"interface",
					"union",
					"scalar",
					"fragment",
					"enum",
					"on"
				],
				literal: [
					"true",
					"false",
					"null"
				]
			},
			contains: [
				e.HASH_COMMENT_MODE,
				e.QUOTE_STRING_MODE,
				e.NUMBER_MODE,
				{
					scope: "punctuation",
					match: /[.]{3}/,
					relevance: 0
				},
				{
					scope: "punctuation",
					begin: /[\!\(\)\:\=\[\]\{\|\}]{1}/,
					relevance: 0
				},
				{
					scope: "variable",
					begin: /\$/,
					end: /\W/,
					excludeEnd: !0,
					relevance: 0
				},
				{
					scope: "meta",
					match: /@\w+/,
					excludeEnd: !0
				},
				{
					scope: "symbol",
					begin: t.concat(/[_A-Za-z][_0-9A-Za-z]*/, t.lookahead(/\s*:/)),
					relevance: 0
				}
			],
			illegal: [/[;<']/, /BEGIN/]
		};
	}
	t.exports = n;
})), Pg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = {
			className: "number",
			relevance: 0,
			variants: [{ begin: /([+-]+)?[\d]+_[\d_]+/ }, { begin: e.NUMBER_RE }]
		}, r = e.COMMENT();
		r.variants = [{
			begin: /;/,
			end: /$/
		}, {
			begin: /#/,
			end: /$/
		}];
		let i = {
			className: "variable",
			variants: [{ begin: /\$[\w\d"][\w\d_]*/ }, { begin: /\$\{(.*?)\}/ }]
		}, a = {
			className: "literal",
			begin: /\bon|off|true|false|yes|no\b/
		}, o = {
			className: "string",
			contains: [e.BACKSLASH_ESCAPE],
			variants: [
				{
					begin: "'''",
					end: "'''",
					relevance: 10
				},
				{
					begin: "\"\"\"",
					end: "\"\"\"",
					relevance: 10
				},
				{
					begin: "\"",
					end: "\""
				},
				{
					begin: "'",
					end: "'"
				}
			]
		}, s = {
			begin: /\[/,
			end: /\]/,
			contains: [
				r,
				a,
				i,
				o,
				n,
				"self"
			],
			relevance: 0
		}, c = t.either(/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/);
		return {
			name: "TOML, also INI",
			aliases: ["toml"],
			case_insensitive: !0,
			illegal: /\S/,
			contains: [
				r,
				{
					className: "section",
					begin: /\[+/,
					end: /\]+/
				},
				{
					begin: t.concat(c, "(\\s*\\.\\s*", c, ")*", t.lookahead(/\s*=\s*[^#\s]/)),
					className: "attr",
					starts: {
						end: /$/,
						contains: [
							r,
							s,
							a,
							i,
							o,
							n
						]
					}
				}
			]
		};
	}
	t.exports = n;
})), Fg = /* @__PURE__ */ o(((e, t) => {
	var n = "[0-9](_*[0-9])*", r = `\\.(${n})`, i = "[0-9a-fA-F](_*[0-9a-fA-F])*", a = {
		className: "number",
		variants: [
			{ begin: `(\\b(${n})((${r})|\\.)?|(${r}))[eE][+-]?(${n})[fFdD]?\\b` },
			{ begin: `\\b(${n})((${r})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
			{ begin: `(${r})[fFdD]?\\b` },
			{ begin: `\\b(${n})[fFdD]\\b` },
			{ begin: `\\b0[xX]((${i})\\.?|(${i})?\\.(${i}))[pP][+-]?(${n})[fFdD]?\\b` },
			{ begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
			{ begin: `\\b0[xX](${i})[lL]?\\b` },
			{ begin: "\\b0(_*[0-7])*[lL]?\\b" },
			{ begin: "\\b0[bB][01](_*[01])*[lL]?\\b" }
		],
		relevance: 0
	};
	function o(e, t, n) {
		return n === -1 ? "" : e.replace(t, (r) => o(e, t, n - 1));
	}
	function s(e) {
		let t = e.regex, n = "[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*", r = n + o("(?:<" + n + "~~~(?:\\s*,\\s*" + n + "~~~)*>)?", /~~~/g, 2), i = {
			keyword: /* @__PURE__ */ "synchronized.abstract.private.var.static.if.const .for.while.strictfp.finally.protected.import.native.final.void.enum.else.break.transient.catch.instanceof.volatile.case.assert.package.default.public.try.switch.continue.throws.protected.public.private.module.requires.exports.do.sealed.yield.permits.goto.when".split("."),
			literal: [
				"false",
				"true",
				"null"
			],
			type: [
				"char",
				"boolean",
				"long",
				"float",
				"int",
				"byte",
				"short",
				"double"
			],
			built_in: ["super", "this"]
		}, s = {
			className: "meta",
			begin: "@" + n,
			contains: [{
				begin: /\(/,
				end: /\)/,
				contains: ["self"]
			}]
		}, c = {
			className: "params",
			begin: /\(/,
			end: /\)/,
			keywords: i,
			relevance: 0,
			contains: [e.C_BLOCK_COMMENT_MODE],
			endsParent: !0
		};
		return {
			name: "Java",
			aliases: ["jsp"],
			keywords: i,
			illegal: /<\/|#/,
			contains: [
				e.COMMENT("/\\*\\*", "\\*/", {
					relevance: 0,
					contains: [{
						begin: /\w+@/,
						relevance: 0
					}, {
						className: "doctag",
						begin: "@[A-Za-z]+"
					}]
				}),
				{
					begin: /import java\.[a-z]+\./,
					keywords: "import",
					relevance: 2
				},
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				{
					begin: /"""/,
					end: /"""/,
					className: "string",
					contains: [e.BACKSLASH_ESCAPE]
				},
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE,
				{
					match: [
						/\b(?:class|interface|enum|extends|implements|new)/,
						/\s+/,
						n
					],
					className: {
						1: "keyword",
						3: "title.class"
					}
				},
				{
					match: /non-sealed/,
					scope: "keyword"
				},
				{
					begin: [
						t.concat(/(?!else)/, n),
						/\s+/,
						n,
						/\s+/,
						/=(?!=)/
					],
					className: {
						1: "type",
						3: "variable",
						5: "operator"
					}
				},
				{
					begin: [
						/record/,
						/\s+/,
						n
					],
					className: {
						1: "keyword",
						3: "title.class"
					},
					contains: [
						c,
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				{
					beginKeywords: "new throw return else",
					relevance: 0
				},
				{
					begin: [
						"(?:" + r + "\\s+)",
						e.UNDERSCORE_IDENT_RE,
						/\s*(?=\()/
					],
					className: { 2: "title.function" },
					keywords: i,
					contains: [
						{
							className: "params",
							begin: /\(/,
							end: /\)/,
							keywords: i,
							relevance: 0,
							contains: [
								s,
								e.APOS_STRING_MODE,
								e.QUOTE_STRING_MODE,
								a,
								e.C_BLOCK_COMMENT_MODE
							]
						},
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				a,
				s
			]
		};
	}
	t.exports = s;
})), Ig = /* @__PURE__ */ o(((e, t) => {
	var n = "[A-Za-z$_][0-9A-Za-z$_]*", r = /* @__PURE__ */ "as.in.of.if.for.while.finally.var.new.function.do.return.void.else.break.catch.instanceof.with.throw.case.default.try.switch.continue.typeof.delete.let.yield.const.class.debugger.async.await.static.import.from.export.extends.using".split("."), i = [
		"true",
		"false",
		"null",
		"undefined",
		"NaN",
		"Infinity"
	], a = /* @__PURE__ */ "Object.Function.Boolean.Symbol.Math.Date.Number.BigInt.String.RegExp.Array.Float32Array.Float64Array.Int8Array.Uint8Array.Uint8ClampedArray.Int16Array.Int32Array.Uint16Array.Uint32Array.BigInt64Array.BigUint64Array.Set.Map.WeakSet.WeakMap.ArrayBuffer.SharedArrayBuffer.Atomics.DataView.JSON.Promise.Generator.GeneratorFunction.AsyncFunction.Reflect.Proxy.Intl.WebAssembly".split("."), o = [
		"Error",
		"EvalError",
		"InternalError",
		"RangeError",
		"ReferenceError",
		"SyntaxError",
		"TypeError",
		"URIError"
	], s = [
		"setInterval",
		"setTimeout",
		"clearInterval",
		"clearTimeout",
		"require",
		"exports",
		"eval",
		"isFinite",
		"isNaN",
		"parseFloat",
		"parseInt",
		"decodeURI",
		"decodeURIComponent",
		"encodeURI",
		"encodeURIComponent",
		"escape",
		"unescape"
	], c = [
		"arguments",
		"this",
		"super",
		"console",
		"window",
		"document",
		"localStorage",
		"sessionStorage",
		"module",
		"global"
	], l = [].concat(s, a, o);
	function u(e) {
		let t = e.regex, u = (e, { after: t }) => {
			let n = "</" + e[0].slice(1);
			return e.input.indexOf(n, t) !== -1;
		}, d = n, f = {
			begin: "<>",
			end: "</>"
		}, p = /<[A-Za-z0-9\\._:-]+\s*\/>/, m = {
			begin: /<[A-Za-z0-9\\._:-]+/,
			end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
			isTrulyOpeningTag: (e, t) => {
				let n = e[0].length + e.index, r = e.input[n];
				if (r === "<" || r === ",") {
					t.ignoreMatch();
					return;
				}
				r === ">" && (u(e, { after: n }) || t.ignoreMatch());
				let i, a = e.input.substring(n);
				if (i = a.match(/^\s*=/)) {
					t.ignoreMatch();
					return;
				}
				if ((i = a.match(/^\s+extends\s+/)) && i.index === 0) {
					t.ignoreMatch();
					return;
				}
			}
		}, h = {
			$pattern: n,
			keyword: r,
			literal: i,
			built_in: l,
			"variable.language": c
		}, g = "[0-9](_?[0-9])*", _ = `\\.(${g})`, v = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", y = {
			className: "number",
			variants: [
				{ begin: `(\\b(${v})((${_})|\\.)?|(${_}))[eE][+-]?(${g})\\b` },
				{ begin: `\\b(${v})\\b((${_})\\b|\\.)?|(${_})\\b` },
				{ begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
				{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
				{ begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
				{ begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
				{ begin: "\\b0[0-7]+n?\\b" }
			],
			relevance: 0
		}, b = {
			className: "subst",
			begin: "\\$\\{",
			end: "\\}",
			keywords: h,
			contains: []
		}, x = {
			begin: ".?html`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "xml"
			}
		}, S = {
			begin: ".?css`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "css"
			}
		}, ee = {
			begin: ".?gql`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "graphql"
			}
		}, C = {
			className: "string",
			begin: "`",
			end: "`",
			contains: [e.BACKSLASH_ESCAPE, b]
		}, w = {
			className: "comment",
			variants: [
				e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
					relevance: 0,
					contains: [{
						begin: "(?=@[A-Za-z]+)",
						relevance: 0,
						contains: [
							{
								className: "doctag",
								begin: "@[A-Za-z]+"
							},
							{
								className: "type",
								begin: "\\{",
								end: "\\}",
								excludeEnd: !0,
								excludeBegin: !0,
								relevance: 0
							},
							{
								className: "variable",
								begin: d + "(?=\\s*(-)|$)",
								endsParent: !0,
								relevance: 0
							},
							{
								begin: /(?=[^\n])\s/,
								relevance: 0
							}
						]
					}]
				}),
				e.C_BLOCK_COMMENT_MODE,
				e.C_LINE_COMMENT_MODE
			]
		}, te = [
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			x,
			S,
			ee,
			C,
			{ match: /\$\d+/ },
			y
		];
		b.contains = te.concat({
			begin: /\{/,
			end: /\}/,
			keywords: h,
			contains: ["self"].concat(te)
		});
		let ne = [].concat(w, b.contains), re = ne.concat([{
			begin: /(\s*)\(/,
			end: /\)/,
			keywords: h,
			contains: ["self"].concat(ne)
		}]), ie = {
			className: "params",
			begin: /(\s*)\(/,
			end: /\)/,
			excludeBegin: !0,
			excludeEnd: !0,
			keywords: h,
			contains: re
		}, T = { variants: [{
			match: [
				/class/,
				/\s+/,
				d,
				/\s+/,
				/extends/,
				/\s+/,
				t.concat(d, "(", t.concat(/\./, d), ")*")
			],
			scope: {
				1: "keyword",
				3: "title.class",
				5: "keyword",
				7: "title.class.inherited"
			}
		}, {
			match: [
				/class/,
				/\s+/,
				d
			],
			scope: {
				1: "keyword",
				3: "title.class"
			}
		}] }, ae = {
			relevance: 0,
			match: t.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
			className: "title.class",
			keywords: { _: [...a, ...o] }
		}, E = {
			label: "use_strict",
			className: "meta",
			relevance: 10,
			begin: /^\s*['"]use (strict|asm)['"]/
		}, oe = {
			variants: [{ match: [
				/function/,
				/\s+/,
				d,
				/(?=\s*\()/
			] }, { match: [/function/, /\s*(?=\()/] }],
			className: {
				1: "keyword",
				3: "title.function"
			},
			label: "func.def",
			contains: [ie],
			illegal: /%/
		}, D = {
			relevance: 0,
			match: /\b[A-Z][A-Z_0-9]+\b/,
			className: "variable.constant"
		};
		function se(e) {
			return t.concat("(?!", e.join("|"), ")");
		}
		let ce = {
			match: t.concat(/\b/, se([
				...s,
				"super",
				"import",
				"await"
			].map((e) => `${e}\\s*\\(`)), d, t.lookahead(/\s*\(/)),
			className: "title.function",
			relevance: 0
		}, le = {
			begin: t.concat(/\./, t.lookahead(t.concat(d, /(?![0-9A-Za-z$_(])/))),
			end: d,
			excludeBegin: !0,
			keywords: "prototype",
			className: "property",
			relevance: 0
		}, ue = {
			match: [
				/get|set/,
				/\s+/,
				d,
				/(?=\()/
			],
			className: {
				1: "keyword",
				3: "title.function"
			},
			contains: [{ begin: /\(\)/ }, ie]
		}, de = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", fe = {
			match: [
				/const|var|let/,
				/\s+/,
				d,
				/\s*/,
				/=\s*/,
				/(async\s*)?/,
				t.lookahead(de)
			],
			keywords: "async",
			className: {
				1: "keyword",
				3: "title.function"
			},
			contains: [ie]
		};
		return {
			name: "JavaScript",
			aliases: [
				"js",
				"jsx",
				"mjs",
				"cjs"
			],
			keywords: h,
			exports: {
				PARAMS_CONTAINS: re,
				CLASS_REFERENCE: ae
			},
			illegal: /#(?![$_A-Za-z])/,
			contains: [
				e.SHEBANG({
					label: "shebang",
					binary: "node",
					relevance: 5
				}),
				E,
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE,
				x,
				S,
				ee,
				C,
				w,
				{ match: /\$\d+/ },
				y,
				ae,
				{
					scope: "attr",
					match: d + t.lookahead(":"),
					relevance: 0
				},
				fe,
				{
					begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
					keywords: "return throw case",
					relevance: 0,
					contains: [
						w,
						e.REGEXP_MODE,
						{
							className: "function",
							begin: de,
							returnBegin: !0,
							end: "\\s*=>",
							contains: [{
								className: "params",
								variants: [
									{
										begin: e.UNDERSCORE_IDENT_RE,
										relevance: 0
									},
									{
										className: null,
										begin: /\(\s*\)/,
										skip: !0
									},
									{
										begin: /(\s*)\(/,
										end: /\)/,
										excludeBegin: !0,
										excludeEnd: !0,
										keywords: h,
										contains: re
									}
								]
							}]
						},
						{
							begin: /,/,
							relevance: 0
						},
						{
							match: /\s+/,
							relevance: 0
						},
						{
							variants: [
								{
									begin: f.begin,
									end: f.end
								},
								{ match: p },
								{
									begin: m.begin,
									"on:begin": m.isTrulyOpeningTag,
									end: m.end
								}
							],
							subLanguage: "xml",
							contains: [{
								begin: m.begin,
								end: m.end,
								skip: !0,
								contains: ["self"]
							}]
						}
					]
				},
				oe,
				{ beginKeywords: "while if switch catch for" },
				{
					begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
					returnBegin: !0,
					label: "func.def",
					contains: [ie, e.inherit(e.TITLE_MODE, {
						begin: d,
						className: "title.function"
					})]
				},
				{
					match: /\.\.\./,
					relevance: 0
				},
				le,
				{
					match: "\\$" + d,
					relevance: 0
				},
				{
					match: [/\bconstructor(?=\s*\()/],
					className: { 1: "title.function" },
					contains: [ie]
				},
				ce,
				D,
				T,
				ue,
				{ match: /\$[(.]/ }
			]
		};
	}
	t.exports = u;
})), Lg = /* @__PURE__ */ o(((e, t) => {
	var n = {
		scope: "number",
		match: "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity",
		relevance: 0
	};
	function r(e) {
		let t = {
			className: "attr",
			begin: /(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,
			relevance: 1.01
		}, r = {
			match: /[{}[\],:]/,
			className: "punctuation",
			relevance: 0
		}, i = [
			"true",
			"false",
			"null"
		], a = {
			scope: "literal",
			beginKeywords: i.join(" ")
		};
		return {
			name: "JSON",
			aliases: ["jsonc", "json5"],
			keywords: { literal: i },
			contains: [
				t,
				r,
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE,
				a,
				n,
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE
			],
			illegal: "\\S"
		};
	}
	t.exports = r;
})), Rg = /* @__PURE__ */ o(((e, t) => {
	var n = "[0-9](_*[0-9])*", r = `\\.(${n})`, i = "[0-9a-fA-F](_*[0-9a-fA-F])*", a = {
		className: "number",
		variants: [
			{ begin: `(\\b(${n})((${r})|\\.)?|(${r}))[eE][+-]?(${n})[fFdD]?\\b` },
			{ begin: `\\b(${n})((${r})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
			{ begin: `(${r})[fFdD]?\\b` },
			{ begin: `\\b(${n})[fFdD]\\b` },
			{ begin: `\\b0[xX]((${i})\\.?|(${i})?\\.(${i}))[pP][+-]?(${n})[fFdD]?\\b` },
			{ begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
			{ begin: `\\b0[xX](${i})[lL]?\\b` },
			{ begin: "\\b0(_*[0-7])*[lL]?\\b" },
			{ begin: "\\b0[bB][01](_*[01])*[lL]?\\b" }
		],
		relevance: 0
	};
	function o(e) {
		let t = {
			keyword: "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
			built_in: "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
			literal: "true false null"
		}, n = {
			className: "keyword",
			begin: /\b(break|continue|return|this)\b/,
			starts: { contains: [{
				className: "symbol",
				begin: /@\w+/
			}] }
		}, r = {
			className: "symbol",
			begin: e.UNDERSCORE_IDENT_RE + "@"
		}, i = {
			className: "subst",
			begin: /\$\{/,
			end: /\}/,
			contains: [e.C_NUMBER_MODE]
		}, o = {
			className: "variable",
			begin: "\\$" + e.UNDERSCORE_IDENT_RE
		}, s = {
			className: "string",
			variants: [
				{
					begin: "\"\"\"",
					end: "\"\"\"(?=[^\"])",
					contains: [o, i]
				},
				{
					begin: "'",
					end: "'",
					illegal: /\n/,
					contains: [e.BACKSLASH_ESCAPE]
				},
				{
					begin: "\"",
					end: "\"",
					illegal: /\n/,
					contains: [
						e.BACKSLASH_ESCAPE,
						o,
						i
					]
				}
			]
		};
		i.contains.push(s);
		let c = {
			className: "meta",
			begin: "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" + e.UNDERSCORE_IDENT_RE + ")?"
		}, l = {
			className: "meta",
			begin: "@" + e.UNDERSCORE_IDENT_RE,
			contains: [{
				begin: /\(/,
				end: /\)/,
				contains: [e.inherit(s, { className: "string" }), "self"]
			}]
		}, u = a, d = e.COMMENT("/\\*", "\\*/", { contains: [e.C_BLOCK_COMMENT_MODE] }), f = { variants: [{
			className: "type",
			begin: e.UNDERSCORE_IDENT_RE
		}, {
			begin: /\(/,
			end: /\)/,
			contains: []
		}] }, p = f;
		return p.variants[1].contains = [f], f.variants[1].contains = [p], {
			name: "Kotlin",
			aliases: ["kt", "kts"],
			keywords: t,
			contains: [
				e.COMMENT("/\\*\\*", "\\*/", {
					relevance: 0,
					contains: [{
						className: "doctag",
						begin: "@[A-Za-z]+"
					}]
				}),
				e.C_LINE_COMMENT_MODE,
				d,
				n,
				r,
				c,
				l,
				{
					className: "function",
					beginKeywords: "fun",
					end: "[(]|$",
					returnBegin: !0,
					excludeEnd: !0,
					keywords: t,
					relevance: 5,
					contains: [
						{
							begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
							returnBegin: !0,
							relevance: 0,
							contains: [e.UNDERSCORE_TITLE_MODE]
						},
						{
							className: "type",
							begin: /</,
							end: />/,
							keywords: "reified",
							relevance: 0
						},
						{
							className: "params",
							begin: /\(/,
							end: /\)/,
							endsParent: !0,
							keywords: t,
							relevance: 0,
							contains: [
								{
									begin: /:/,
									end: /[=,\/]/,
									endsWithParent: !0,
									contains: [
										f,
										e.C_LINE_COMMENT_MODE,
										d
									],
									relevance: 0
								},
								e.C_LINE_COMMENT_MODE,
								d,
								c,
								l,
								s,
								e.C_NUMBER_MODE
							]
						},
						d
					]
				},
				{
					begin: [
						/class|interface|trait/,
						/\s+/,
						e.UNDERSCORE_IDENT_RE
					],
					beginScope: { 3: "title.class" },
					keywords: "class interface trait",
					end: /[:\{(]|$/,
					excludeEnd: !0,
					illegal: "extends implements",
					contains: [
						{ beginKeywords: "public protected internal private constructor" },
						e.UNDERSCORE_TITLE_MODE,
						{
							className: "type",
							begin: /</,
							end: />/,
							excludeBegin: !0,
							excludeEnd: !0,
							relevance: 0
						},
						{
							className: "type",
							begin: /[,:]\s*/,
							end: /[<\(,){\s]|$/,
							excludeBegin: !0,
							returnEnd: !0
						},
						c,
						l
					]
				},
				s,
				{
					className: "meta",
					begin: "^#!/usr/bin/env",
					end: "$",
					illegal: "\n"
				},
				u
			]
		};
	}
	t.exports = o;
})), zg = /* @__PURE__ */ o(((e, t) => {
	var n = (e) => ({
		IMPORTANT: {
			scope: "meta",
			begin: "!important"
		},
		BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
		HEXCOLOR: {
			scope: "number",
			begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
		},
		UNICODE_RANGE: {
			scope: "number",
			begin: /\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,4}(-[0-9A-Fa-f][0-9A-Fa-f]{0,4})?/
		},
		FUNCTION_DISPATCH: {
			className: "built_in",
			begin: /[\w-]+(?=\()/
		},
		ATTRIBUTE_SELECTOR_MODE: {
			scope: "selector-attr",
			begin: /\[/,
			end: /\]/,
			illegal: "$",
			contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
		},
		CSS_NUMBER_MODE: {
			scope: "number",
			begin: e.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
			relevance: 0
		},
		CSS_VARIABLE: {
			className: "attr",
			begin: /--[A-Za-z_][A-Za-z0-9_-]*/
		}
	}), r = /* @__PURE__ */ "a.abbr.address.article.aside.audio.b.blockquote.body.button.canvas.caption.cite.code.dd.del.details.dfn.div.dl.dt.em.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.hgroup.html.i.iframe.img.input.ins.kbd.label.legend.li.main.mark.menu.nav.object.ol.optgroup.option.p.picture.q.quote.samp.section.select.source.span.strong.summary.sup.table.tbody.td.textarea.tfoot.th.thead.time.tr.ul.var.video".split("."), i = /* @__PURE__ */ "defs.g.marker.mask.pattern.svg.switch.symbol.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feFlood.feGaussianBlur.feImage.feMerge.feMorphology.feOffset.feSpecularLighting.feTile.feTurbulence.linearGradient.radialGradient.stop.circle.ellipse.image.line.path.polygon.polyline.rect.text.use.textPath.tspan.foreignObject.clipPath".split("."), a = [...r, ...i], o = (/* @__PURE__ */ "any-hover.any-pointer.aspect-ratio.color.color-gamut.color-index.device-aspect-ratio.device-height.device-width.display-mode.forced-colors.grid.height.hover.inverted-colors.monochrome.orientation.overflow-block.overflow-inline.pointer.prefers-color-scheme.prefers-contrast.prefers-reduced-motion.prefers-reduced-transparency.resolution.scan.scripting.update.width.min-width.max-width.min-height.max-height".split(".")).sort().reverse(), s = (/* @__PURE__ */ "active.any-link.blank.checked.current.default.defined.dir.disabled.drop.empty.enabled.first.first-child.first-of-type.fullscreen.future.focus.focus-visible.focus-within.has.host.host-context.hover.indeterminate.in-range.invalid.is.lang.last-child.last-of-type.left.link.local-link.not.nth-child.nth-col.nth-last-child.nth-last-col.nth-last-of-type.nth-of-type.only-child.only-of-type.optional.out-of-range.past.placeholder-shown.read-only.read-write.required.right.root.scope.target.target-within.user-invalid.valid.visited.where".split(".")).sort().reverse(), c = [
		"after",
		"backdrop",
		"before",
		"cue",
		"cue-region",
		"first-letter",
		"first-line",
		"grammar-error",
		"marker",
		"part",
		"placeholder",
		"selection",
		"slotted",
		"spelling-error"
	].sort().reverse(), l = (/* @__PURE__ */ "accent-color.align-content.align-items.align-self.alignment-baseline.all.anchor-name.animation.animation-composition.animation-delay.animation-direction.animation-duration.animation-fill-mode.animation-iteration-count.animation-name.animation-play-state.animation-range.animation-range-end.animation-range-start.animation-timeline.animation-timing-function.appearance.aspect-ratio.backdrop-filter.backface-visibility.background.background-attachment.background-blend-mode.background-clip.background-color.background-image.background-origin.background-position.background-position-x.background-position-y.background-repeat.background-size.baseline-shift.block-size.border.border-block.border-block-color.border-block-end.border-block-end-color.border-block-end-style.border-block-end-width.border-block-start.border-block-start-color.border-block-start-style.border-block-start-width.border-block-style.border-block-width.border-bottom.border-bottom-color.border-bottom-left-radius.border-bottom-right-radius.border-bottom-style.border-bottom-width.border-collapse.border-color.border-end-end-radius.border-end-start-radius.border-image.border-image-outset.border-image-repeat.border-image-slice.border-image-source.border-image-width.border-inline.border-inline-color.border-inline-end.border-inline-end-color.border-inline-end-style.border-inline-end-width.border-inline-start.border-inline-start-color.border-inline-start-style.border-inline-start-width.border-inline-style.border-inline-width.border-left.border-left-color.border-left-style.border-left-width.border-radius.border-right.border-right-color.border-right-style.border-right-width.border-spacing.border-start-end-radius.border-start-start-radius.border-style.border-top.border-top-color.border-top-left-radius.border-top-right-radius.border-top-style.border-top-width.border-width.bottom.box-align.box-decoration-break.box-direction.box-flex.box-flex-group.box-lines.box-ordinal-group.box-orient.box-pack.box-shadow.box-sizing.break-after.break-before.break-inside.caption-side.caret-color.clear.clip.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.color-scheme.column-count.column-fill.column-gap.column-rule.column-rule-color.column-rule-style.column-rule-width.column-span.column-width.columns.contain.contain-intrinsic-block-size.contain-intrinsic-height.contain-intrinsic-inline-size.contain-intrinsic-size.contain-intrinsic-width.container.container-name.container-type.content.content-visibility.counter-increment.counter-reset.counter-set.cue.cue-after.cue-before.cursor.cx.cy.direction.display.dominant-baseline.empty-cells.enable-background.field-sizing.fill.fill-opacity.fill-rule.filter.flex.flex-basis.flex-direction.flex-flow.flex-grow.flex-shrink.flex-wrap.float.flood-color.flood-opacity.flow.font.font-display.font-family.font-feature-settings.font-kerning.font-language-override.font-optical-sizing.font-palette.font-size.font-size-adjust.font-smooth.font-smoothing.font-stretch.font-style.font-synthesis.font-synthesis-position.font-synthesis-small-caps.font-synthesis-style.font-synthesis-weight.font-variant.font-variant-alternates.font-variant-caps.font-variant-east-asian.font-variant-emoji.font-variant-ligatures.font-variant-numeric.font-variant-position.font-variation-settings.font-weight.forced-color-adjust.gap.glyph-orientation-horizontal.glyph-orientation-vertical.grid.grid-area.grid-auto-columns.grid-auto-flow.grid-auto-rows.grid-column.grid-column-end.grid-column-start.grid-gap.grid-row.grid-row-end.grid-row-start.grid-template.grid-template-areas.grid-template-columns.grid-template-rows.hanging-punctuation.height.hyphenate-character.hyphenate-limit-chars.hyphens.icon.image-orientation.image-rendering.image-resolution.ime-mode.initial-letter.initial-letter-align.inline-size.inset.inset-area.inset-block.inset-block-end.inset-block-start.inset-inline.inset-inline-end.inset-inline-start.isolation.justify-content.justify-items.justify-self.kerning.left.letter-spacing.lighting-color.line-break.line-height.line-height-step.list-style.list-style-image.list-style-position.list-style-type.margin.margin-block.margin-block-end.margin-block-start.margin-bottom.margin-inline.margin-inline-end.margin-inline-start.margin-left.margin-right.margin-top.margin-trim.marker.marker-end.marker-mid.marker-start.marks.mask.mask-border.mask-border-mode.mask-border-outset.mask-border-repeat.mask-border-slice.mask-border-source.mask-border-width.mask-clip.mask-composite.mask-image.mask-mode.mask-origin.mask-position.mask-repeat.mask-size.mask-type.masonry-auto-flow.math-depth.math-shift.math-style.max-block-size.max-height.max-inline-size.max-width.min-block-size.min-height.min-inline-size.min-width.mix-blend-mode.nav-down.nav-index.nav-left.nav-right.nav-up.none.normal.object-fit.object-position.offset.offset-anchor.offset-distance.offset-path.offset-position.offset-rotate.opacity.order.orphans.outline.outline-color.outline-offset.outline-style.outline-width.overflow.overflow-anchor.overflow-block.overflow-clip-margin.overflow-inline.overflow-wrap.overflow-x.overflow-y.overlay.overscroll-behavior.overscroll-behavior-block.overscroll-behavior-inline.overscroll-behavior-x.overscroll-behavior-y.padding.padding-block.padding-block-end.padding-block-start.padding-bottom.padding-inline.padding-inline-end.padding-inline-start.padding-left.padding-right.padding-top.page.page-break-after.page-break-before.page-break-inside.paint-order.pause.pause-after.pause-before.perspective.perspective-origin.place-content.place-items.place-self.pointer-events.position.position-anchor.position-visibility.print-color-adjust.quotes.r.resize.rest.rest-after.rest-before.right.rotate.row-gap.ruby-align.ruby-position.scale.scroll-behavior.scroll-margin.scroll-margin-block.scroll-margin-block-end.scroll-margin-block-start.scroll-margin-bottom.scroll-margin-inline.scroll-margin-inline-end.scroll-margin-inline-start.scroll-margin-left.scroll-margin-right.scroll-margin-top.scroll-padding.scroll-padding-block.scroll-padding-block-end.scroll-padding-block-start.scroll-padding-bottom.scroll-padding-inline.scroll-padding-inline-end.scroll-padding-inline-start.scroll-padding-left.scroll-padding-right.scroll-padding-top.scroll-snap-align.scroll-snap-stop.scroll-snap-type.scroll-timeline.scroll-timeline-axis.scroll-timeline-name.scrollbar-color.scrollbar-gutter.scrollbar-width.shape-image-threshold.shape-margin.shape-outside.shape-rendering.speak.speak-as.src.stop-color.stop-opacity.stroke.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke-width.tab-size.table-layout.text-align.text-align-all.text-align-last.text-anchor.text-combine-upright.text-decoration.text-decoration-color.text-decoration-line.text-decoration-skip.text-decoration-skip-ink.text-decoration-style.text-decoration-thickness.text-emphasis.text-emphasis-color.text-emphasis-position.text-emphasis-style.text-indent.text-justify.text-orientation.text-overflow.text-rendering.text-shadow.text-size-adjust.text-transform.text-underline-offset.text-underline-position.text-wrap.text-wrap-mode.text-wrap-style.timeline-scope.top.touch-action.transform.transform-box.transform-origin.transform-style.transition.transition-behavior.transition-delay.transition-duration.transition-property.transition-timing-function.translate.unicode-bidi.unicode-range.user-modify.user-select.vector-effect.vertical-align.view-timeline.view-timeline-axis.view-timeline-inset.view-timeline-name.view-transition-name.visibility.voice-balance.voice-duration.voice-family.voice-pitch.voice-range.voice-rate.voice-stress.voice-volume.white-space.white-space-collapse.widows.width.will-change.word-break.word-spacing.word-wrap.writing-mode.x.y.z-index.zoom".split(".")).sort().reverse(), u = s.concat(c).sort().reverse();
	function d(e) {
		let t = n(e), r = u, i = "([\\w-]+|@\\{[\\w-]+\\})", d = [], f = [], p = function(e) {
			return {
				className: "string",
				begin: "~?" + e + ".*?" + e
			};
		}, m = function(e, t, n) {
			return {
				className: e,
				begin: t,
				relevance: n
			};
		}, h = {
			$pattern: /[a-z-]+/,
			keyword: "and or not only",
			attribute: o.join(" ")
		}, g = {
			begin: "\\(",
			end: "\\)",
			contains: f,
			keywords: h,
			relevance: 0
		};
		f.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, p("'"), p("\""), t.CSS_NUMBER_MODE, {
			begin: "(url|data-uri)\\(",
			starts: {
				className: "string",
				end: "[\\)\\n]",
				excludeEnd: !0
			}
		}, t.UNICODE_RANGE, t.HEXCOLOR, g, m("variable", "@@?[\\w-]+", 10), m("variable", "@\\{[\\w-]+\\}"), m("built_in", "~?`[^`]*?`"), {
			className: "attribute",
			begin: "[\\w-]+\\s*:",
			end: ":",
			returnBegin: !0,
			excludeEnd: !0
		}, t.IMPORTANT, { beginKeywords: "and not" }, t.FUNCTION_DISPATCH);
		let _ = f.concat({
			begin: /\{/,
			end: /\}/,
			contains: d
		}), v = {
			beginKeywords: "when",
			endsWithParent: !0,
			contains: [{ beginKeywords: "and not" }].concat(f)
		}, y = {
			begin: i + "\\s*:",
			returnBegin: !0,
			end: /[;}]/,
			relevance: 0,
			contains: [
				{ begin: /-(webkit|moz|ms|o)-/ },
				t.CSS_VARIABLE,
				{
					className: "attribute",
					begin: "\\b(" + l.join("|") + ")\\b",
					end: /(?=:)/,
					starts: {
						endsWithParent: !0,
						illegal: "[<=$]",
						relevance: 0,
						contains: f
					}
				}
			]
		}, b = {
			className: "keyword",
			begin: "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
			starts: {
				end: "[;{}]",
				keywords: h,
				returnEnd: !0,
				contains: f,
				relevance: 0
			}
		}, x = {
			className: "variable",
			variants: [{
				begin: "@[\\w-]+\\s*:",
				relevance: 15
			}, { begin: "@[\\w-]+" }],
			starts: {
				end: "[;}]",
				returnEnd: !0,
				contains: _
			}
		}, S = {
			variants: [{
				begin: "[\\.#:&\\[>]",
				end: "[;{}]"
			}, {
				begin: i,
				end: /\{/
			}],
			returnBegin: !0,
			returnEnd: !0,
			illegal: "[<='$\"]",
			relevance: 0,
			contains: [
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				v,
				m("keyword", "all\\b"),
				m("variable", "@\\{[\\w-]+\\}"),
				{
					begin: "\\b(" + a.join("|") + ")\\b",
					className: "selector-tag"
				},
				t.CSS_NUMBER_MODE,
				m("selector-tag", i, 0),
				m("selector-id", "#" + i),
				m("selector-class", "\\." + i, 0),
				m("selector-tag", "&", 0),
				t.ATTRIBUTE_SELECTOR_MODE,
				{
					className: "selector-pseudo",
					begin: ":(" + s.join("|") + ")"
				},
				{
					className: "selector-pseudo",
					begin: ":(:)?(" + c.join("|") + ")"
				},
				{
					begin: /\(/,
					end: /\)/,
					relevance: 0,
					contains: _
				},
				{ begin: "!important" },
				t.FUNCTION_DISPATCH
			]
		}, ee = {
			begin: `[\\w-]+:(:)?(${r.join("|")})`,
			returnBegin: !0,
			contains: [S]
		};
		return d.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, b, x, ee, y, S, v, t.FUNCTION_DISPATCH), {
			name: "Less",
			case_insensitive: !0,
			illegal: "[=>'/<($\"]",
			contains: d
		};
	}
	t.exports = d;
})), Bg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = "\\[=*\\[", n = "\\]=*\\]", r = {
			begin: t,
			end: n,
			contains: ["self"]
		}, i = [e.COMMENT("--(?!\\[=*\\[)", "$"), e.COMMENT("--\\[=*\\[", n, {
			contains: [r],
			relevance: 10
		})];
		return {
			name: "Lua",
			aliases: ["pluto"],
			keywords: {
				$pattern: e.UNDERSCORE_IDENT_RE,
				literal: "true false nil",
				keyword: "and break do else elseif end for goto if in local not or repeat return then until while",
				built_in: "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"
			},
			contains: i.concat([
				{
					className: "function",
					beginKeywords: "function",
					end: "\\)",
					contains: [e.inherit(e.TITLE_MODE, { begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*" }), {
						className: "params",
						begin: "\\(",
						endsWithParent: !0,
						contains: i
					}].concat(i)
				},
				e.C_NUMBER_MODE,
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE,
				{
					className: "string",
					begin: t,
					end: n,
					contains: [r],
					relevance: 5
				}
			])
		};
	}
	t.exports = n;
})), Vg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = {
			className: "variable",
			variants: [{
				begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)",
				contains: [e.BACKSLASH_ESCAPE]
			}, { begin: /\$[@%<?\^\+\*]/ }]
		}, n = {
			className: "string",
			begin: /"/,
			end: /"/,
			contains: [e.BACKSLASH_ESCAPE, t]
		}, r = {
			className: "variable",
			begin: /\$\([\w-]+\s/,
			end: /\)/,
			keywords: { built_in: "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value" },
			contains: [t, n]
		}, i = { begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)" }, a = {
			className: "meta",
			begin: /^\.PHONY:/,
			end: /$/,
			keywords: {
				$pattern: /[\.\w]+/,
				keyword: ".PHONY"
			}
		}, o = {
			className: "section",
			begin: /^[^\s]+:/,
			end: /$/,
			contains: [t]
		};
		return {
			name: "Makefile",
			aliases: [
				"mk",
				"mak",
				"make"
			],
			keywords: {
				$pattern: /[\w-]+/,
				keyword: "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"
			},
			contains: [
				e.HASH_COMMENT_MODE,
				t,
				n,
				r,
				i,
				a,
				o
			]
		};
	}
	t.exports = n;
})), Hg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = /* @__PURE__ */ "abs.accept.alarm.and.atan2.bind.binmode.bless.break.caller.chdir.chmod.chomp.chop.chown.chr.chroot.class.close.closedir.connect.continue.cos.crypt.dbmclose.dbmopen.defined.delete.die.do.dump.each.else.elsif.endgrent.endhostent.endnetent.endprotoent.endpwent.endservent.eof.eval.exec.exists.exit.exp.fcntl.field.fileno.flock.for.foreach.fork.format.formline.getc.getgrent.getgrgid.getgrnam.gethostbyaddr.gethostbyname.gethostent.getlogin.getnetbyaddr.getnetbyname.getnetent.getpeername.getpgrp.getpriority.getprotobyname.getprotobynumber.getprotoent.getpwent.getpwnam.getpwuid.getservbyname.getservbyport.getservent.getsockname.getsockopt.given.glob.gmtime.goto.grep.gt.hex.if.index.int.ioctl.join.keys.kill.last.lc.lcfirst.length.link.listen.local.localtime.log.lstat.lt.ma.map.method.mkdir.msgctl.msgget.msgrcv.msgsnd.my.ne.next.no.not.oct.open.opendir.or.ord.our.pack.package.pipe.pop.pos.print.printf.prototype.push.q|0.qq.quotemeta.qw.qx.rand.read.readdir.readline.readlink.readpipe.recv.redo.ref.rename.require.reset.return.reverse.rewinddir.rindex.rmdir.say.scalar.seek.seekdir.select.semctl.semget.semop.send.setgrent.sethostent.setnetent.setpgrp.setpriority.setprotoent.setpwent.setservent.setsockopt.shift.shmctl.shmget.shmread.shmwrite.shutdown.sin.sleep.socket.socketpair.sort.splice.split.sprintf.sqrt.srand.stat.state.study.sub.substr.symlink.syscall.sysopen.sysread.sysseek.system.syswrite.tell.telldir.tie.tied.time.times.tr.truncate.uc.ucfirst.umask.undef.unless.unlink.unpack.unshift.untie.until.use.utime.values.vec.wait.waitpid.wantarray.warn.when.while.write.x|0.xor.y|0".split("."), r = /[dualxmsipngr]{0,12}/, i = {
			$pattern: /[\w.]+/,
			keyword: n.join(" ")
		}, a = {
			className: "subst",
			begin: "[$@]\\{",
			end: "\\}",
			keywords: i
		}, o = {
			begin: /->\{/,
			end: /\}/
		}, s = {
			scope: "attr",
			match: /\s+:\s*\w+(\s*\(.*?\))?/
		}, c = {
			scope: "variable",
			variants: [
				{ begin: /\$\d/ },
				{ begin: t.concat(/[$%@](?!")(\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/, "(?![A-Za-z])(?![@$%])") },
				{
					begin: /[$%@](?!")[^\s\w{=]|\$=/,
					relevance: 0
				}
			],
			contains: [s]
		}, l = {
			className: "number",
			variants: [
				{ match: /0?\.[0-9][0-9_]+\b/ },
				{ match: /\bv?(0|[1-9][0-9_]*(\.[0-9_]+)?|[1-9][0-9_]*)\b/ },
				{ match: /\b0[0-7][0-7_]*\b/ },
				{ match: /\b0x[0-9a-fA-F][0-9a-fA-F_]*\b/ },
				{ match: /\b0b[0-1][0-1_]*\b/ }
			],
			relevance: 0
		}, u = [
			e.BACKSLASH_ESCAPE,
			a,
			c
		], d = [
			/!/,
			/\//,
			/\|/,
			/\?/,
			/'/,
			/"/,
			/#/
		], f = (e, n, i = "\\1") => {
			let a = i === "\\1" ? i : t.concat(i, n);
			return t.concat(t.concat("(?:", e, ")"), n, /(?:\\.|[^\\\/])*?/, a, /(?:\\.|[^\\\/])*?/, i, r);
		}, p = (e, n, i) => t.concat(t.concat("(?:", e, ")"), n, /(?:\\.|[^\\\/])*?/, i, r), m = [
			c,
			e.HASH_COMMENT_MODE,
			e.COMMENT(/^=\w/, /=cut/, { endsWithParent: !0 }),
			o,
			{
				className: "string",
				contains: u,
				variants: [
					{
						begin: "q[qwxr]?\\s*\\(",
						end: "\\)",
						relevance: 5
					},
					{
						begin: "q[qwxr]?\\s*\\[",
						end: "\\]",
						relevance: 5
					},
					{
						begin: "q[qwxr]?\\s*\\{",
						end: "\\}",
						relevance: 5
					},
					{
						begin: "q[qwxr]?\\s*\\|",
						end: "\\|",
						relevance: 5
					},
					{
						begin: "q[qwxr]?\\s*<",
						end: ">",
						relevance: 5
					},
					{
						begin: "qw\\s+q",
						end: "q",
						relevance: 5
					},
					{
						begin: "'",
						end: "'",
						contains: [e.BACKSLASH_ESCAPE]
					},
					{
						begin: "\"",
						end: "\""
					},
					{
						begin: "`",
						end: "`",
						contains: [e.BACKSLASH_ESCAPE]
					},
					{
						begin: /\{\w+\}/,
						relevance: 0
					},
					{
						begin: "-?\\w+\\s*=>",
						relevance: 0
					}
				]
			},
			l,
			{
				begin: "(\\/\\/|" + e.RE_STARTERS_RE + "|\\b(split|return|print|reverse|grep)\\b)\\s*",
				keywords: "split return print reverse grep",
				relevance: 0,
				contains: [
					e.HASH_COMMENT_MODE,
					{
						className: "regexp",
						variants: [
							{ begin: f("s|tr|y", t.either(...d, { capture: !0 })) },
							{ begin: f("s|tr|y", "\\(", "\\)") },
							{ begin: f("s|tr|y", "\\[", "\\]") },
							{ begin: f("s|tr|y", "\\{", "\\}") }
						],
						relevance: 2
					},
					{
						className: "regexp",
						variants: [
							{
								begin: /(m|qr)\/\//,
								relevance: 0
							},
							{ begin: p("(?:m|qr)?", /\//, /\//) },
							{ begin: p("m|qr", t.either(...d, { capture: !0 }), /\1/) },
							{ begin: p("m|qr", /\(/, /\)/) },
							{ begin: p("m|qr", /\[/, /\]/) },
							{ begin: p("m|qr", /\{/, /\}/) }
						]
					}
				]
			},
			{
				className: "function",
				beginKeywords: "sub method",
				end: "(\\s*\\(.*?\\))?[;{]",
				excludeEnd: !0,
				relevance: 5,
				contains: [e.TITLE_MODE, s]
			},
			{
				className: "class",
				beginKeywords: "class",
				end: "[;{]",
				excludeEnd: !0,
				relevance: 5,
				contains: [
					e.TITLE_MODE,
					s,
					l
				]
			},
			{
				begin: "-\\w\\b",
				relevance: 0
			},
			{
				begin: "^__DATA__$",
				end: "^__END__$",
				subLanguage: "mojolicious",
				contains: [{
					begin: "^@@.*",
					end: "$",
					className: "comment"
				}]
			}
		];
		return a.contains = m, o.contains = m, {
			name: "Perl",
			aliases: ["pl", "pm"],
			keywords: i,
			contains: m
		};
	}
	t.exports = n;
})), Ug = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = {
			className: "built_in",
			begin: "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"
		}, n = /[a-zA-Z@][a-zA-Z0-9_]*/, r = {
			"variable.language": ["this", "super"],
			$pattern: n,
			keyword: /* @__PURE__ */ "while.export.sizeof.typedef.const.struct.for.union.volatile.static.mutable.if.do.return.goto.enum.else.break.extern.asm.case.default.register.explicit.typename.switch.continue.inline.readonly.assign.readwrite.self.@synchronized.id.typeof.nonatomic.IBOutlet.IBAction.strong.weak.copy.in.out.inout.bycopy.byref.oneway.__strong.__weak.__block.__autoreleasing.@private.@protected.@public.@try.@property.@end.@throw.@catch.@finally.@autoreleasepool.@synthesize.@dynamic.@selector.@optional.@required.@encode.@package.@import.@defs.@compatibility_alias.__bridge.__bridge_transfer.__bridge_retained.__bridge_retain.__covariant.__contravariant.__kindof._Nonnull._Nullable._Null_unspecified.__FUNCTION__.__PRETTY_FUNCTION__.__attribute__.getter.setter.retain.unsafe_unretained.nonnull.nullable.null_unspecified.null_resettable.class.instancetype.NS_DESIGNATED_INITIALIZER.NS_UNAVAILABLE.NS_REQUIRES_SUPER.NS_RETURNS_INNER_POINTER.NS_INLINE.NS_AVAILABLE.NS_DEPRECATED.NS_ENUM.NS_OPTIONS.NS_SWIFT_UNAVAILABLE.NS_ASSUME_NONNULL_BEGIN.NS_ASSUME_NONNULL_END.NS_REFINED_FOR_SWIFT.NS_SWIFT_NAME.NS_SWIFT_NOTHROW.NS_DURING.NS_HANDLER.NS_ENDHANDLER.NS_VALUERETURN.NS_VOIDRETURN".split("."),
			literal: [
				"false",
				"true",
				"FALSE",
				"TRUE",
				"nil",
				"YES",
				"NO",
				"NULL"
			],
			built_in: [
				"dispatch_once_t",
				"dispatch_queue_t",
				"dispatch_sync",
				"dispatch_async",
				"dispatch_once"
			],
			type: [
				"int",
				"float",
				"char",
				"unsigned",
				"signed",
				"short",
				"long",
				"double",
				"wchar_t",
				"unichar",
				"void",
				"bool",
				"BOOL",
				"id|0",
				"_Bool"
			]
		}, i = {
			$pattern: n,
			keyword: [
				"@interface",
				"@class",
				"@protocol",
				"@implementation"
			]
		};
		return {
			name: "Objective-C",
			aliases: [
				"mm",
				"objc",
				"obj-c",
				"obj-c++",
				"objective-c++"
			],
			keywords: r,
			illegal: "</",
			contains: [
				t,
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				e.C_NUMBER_MODE,
				e.QUOTE_STRING_MODE,
				e.APOS_STRING_MODE,
				{
					className: "string",
					variants: [{
						begin: "@\"",
						end: "\"",
						illegal: "\\n",
						contains: [e.BACKSLASH_ESCAPE]
					}]
				},
				{
					className: "meta",
					begin: /#\s*[a-z]+\b/,
					end: /$/,
					keywords: { keyword: "if else elif endif define undef warning error line pragma ifdef ifndef include" },
					contains: [
						{
							begin: /\\\n/,
							relevance: 0
						},
						e.inherit(e.QUOTE_STRING_MODE, { className: "string" }),
						{
							className: "string",
							begin: /<.*?>/,
							end: /$/,
							illegal: "\\n"
						},
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				{
					className: "class",
					begin: "(" + i.keyword.join("|") + ")\\b",
					end: /(\{|$)/,
					excludeEnd: !0,
					keywords: i,
					contains: [e.UNDERSCORE_TITLE_MODE]
				},
				{
					begin: "\\." + e.UNDERSCORE_IDENT_RE,
					relevance: 0
				}
			]
		};
	}
	t.exports = n;
})), Wg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = /(?![A-Za-z0-9])(?![$])/, r = t.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/, n), i = t.concat(/(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/, n), a = t.concat(/[A-Z]+/, n), o = {
			scope: "variable",
			match: "\\$+" + r
		}, s = {
			scope: "meta",
			variants: [
				{
					begin: /<\?php/,
					relevance: 10
				},
				{ begin: /<\?=/ },
				{
					begin: /<\?/,
					relevance: .1
				},
				{ begin: /\?>/ }
			]
		}, c = {
			scope: "subst",
			variants: [{ begin: /\$\w+/ }, {
				begin: /\{\$/,
				end: /\}/
			}]
		}, l = e.inherit(e.APOS_STRING_MODE, { illegal: null }), u = e.inherit(e.QUOTE_STRING_MODE, {
			illegal: null,
			contains: e.QUOTE_STRING_MODE.contains.concat(c)
		}), d = {
			begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
			end: /[ \t]*(\w+)\b/,
			contains: e.QUOTE_STRING_MODE.contains.concat(c),
			"on:begin": (e, t) => {
				t.data._beginMatch = e[1] || e[2];
			},
			"on:end": (e, t) => {
				t.data._beginMatch !== e[1] && t.ignoreMatch();
			}
		}, f = e.END_SAME_AS_BEGIN({
			begin: /<<<[ \t]*'(\w+)'\n/,
			end: /[ \t]*(\w+)\b/
		}), p = "[ 	\n]", m = {
			scope: "string",
			variants: [
				u,
				l,
				d,
				f
			]
		}, h = {
			scope: "number",
			variants: [
				{ begin: "\\b0[bB][01]+(?:_[01]+)*\\b" },
				{ begin: "\\b0[oO][0-7]+(?:_[0-7]+)*\\b" },
				{ begin: "\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b" },
				{ begin: "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?" }
			],
			relevance: 0
		}, g = [
			"false",
			"null",
			"true"
		], _ = /* @__PURE__ */ "__CLASS__.__DIR__.__FILE__.__FUNCTION__.__COMPILER_HALT_OFFSET__.__LINE__.__METHOD__.__NAMESPACE__.__TRAIT__.die.echo.exit.include.include_once.print.require.require_once.array.abstract.and.as.binary.bool.boolean.break.callable.case.catch.class.clone.const.continue.declare.default.do.double.else.elseif.empty.enddeclare.endfor.endforeach.endif.endswitch.endwhile.enum.eval.extends.final.finally.float.for.foreach.from.global.goto.if.implements.instanceof.insteadof.int.integer.interface.isset.iterable.list.match|0.mixed.new.never.object.or.private.protected.public.readonly.real.return.string.switch.throw.trait.try.unset.use.var.void.while.xor.yield".split("."), v = /* @__PURE__ */ "Error|0.AppendIterator.ArgumentCountError.ArithmeticError.ArrayIterator.ArrayObject.AssertionError.BadFunctionCallException.BadMethodCallException.CachingIterator.CallbackFilterIterator.CompileError.Countable.DirectoryIterator.DivisionByZeroError.DomainException.EmptyIterator.ErrorException.Exception.FilesystemIterator.FilterIterator.GlobIterator.InfiniteIterator.InvalidArgumentException.IteratorIterator.LengthException.LimitIterator.LogicException.MultipleIterator.NoRewindIterator.OutOfBoundsException.OutOfRangeException.OuterIterator.OverflowException.ParentIterator.ParseError.RangeException.RecursiveArrayIterator.RecursiveCachingIterator.RecursiveCallbackFilterIterator.RecursiveDirectoryIterator.RecursiveFilterIterator.RecursiveIterator.RecursiveIteratorIterator.RecursiveRegexIterator.RecursiveTreeIterator.RegexIterator.RuntimeException.SeekableIterator.SplDoublyLinkedList.SplFileInfo.SplFileObject.SplFixedArray.SplHeap.SplMaxHeap.SplMinHeap.SplObjectStorage.SplObserver.SplPriorityQueue.SplQueue.SplStack.SplSubject.SplTempFileObject.TypeError.UnderflowException.UnexpectedValueException.UnhandledMatchError.ArrayAccess.BackedEnum.Closure.Fiber.Generator.Iterator.IteratorAggregate.Serializable.Stringable.Throwable.Traversable.UnitEnum.WeakReference.WeakMap.Directory.__PHP_Incomplete_Class.parent.php_user_filter.self.static.stdClass".split("."), y = {
			keyword: _,
			literal: ((e) => {
				let t = [];
				return e.forEach((e) => {
					t.push(e), e.toLowerCase() === e ? t.push(e.toUpperCase()) : t.push(e.toLowerCase());
				}), t;
			})(g),
			built_in: v
		}, b = (e) => e.map((e) => e.replace(/\|\d+$/, "")), x = { variants: [{
			match: [
				/new/,
				t.concat(p, "+"),
				t.concat("(?!", b(v).join("\\b|"), "\\b)"),
				i
			],
			scope: {
				1: "keyword",
				4: "title.class"
			}
		}] }, S = t.concat(r, "\\b(?!\\()"), ee = { variants: [
			{
				match: [t.concat(/::/, t.lookahead(/(?!class\b)/)), S],
				scope: { 2: "variable.constant" }
			},
			{
				match: [/::/, /class/],
				scope: { 2: "variable.language" }
			},
			{
				match: [
					i,
					t.concat(/::/, t.lookahead(/(?!class\b)/)),
					S
				],
				scope: {
					1: "title.class",
					3: "variable.constant"
				}
			},
			{
				match: [i, t.concat("::", t.lookahead(/(?!class\b)/))],
				scope: { 1: "title.class" }
			},
			{
				match: [
					i,
					/::/,
					/class/
				],
				scope: {
					1: "title.class",
					3: "variable.language"
				}
			}
		] }, C = {
			scope: "attr",
			match: t.concat(r, t.lookahead(":"), t.lookahead(/(?!::)/))
		}, w = {
			relevance: 0,
			begin: /\(/,
			end: /\)/,
			keywords: y,
			contains: [
				C,
				o,
				ee,
				e.C_BLOCK_COMMENT_MODE,
				e.C_LINE_COMMENT_MODE,
				e.HASH_COMMENT_MODE,
				m,
				h,
				x
			]
		}, te = {
			relevance: 0,
			match: [
				/\b/,
				t.concat("(?!fn\\b|function\\b|", b(_).join("\\b|"), "|", b(v).join("\\b|"), "\\b)"),
				r,
				t.concat(p, "*"),
				t.lookahead(/(?=\()/)
			],
			scope: { 3: "title.function.invoke" },
			contains: [w]
		};
		w.contains.push(te);
		let ne = [
			C,
			ee,
			e.C_BLOCK_COMMENT_MODE,
			e.C_LINE_COMMENT_MODE,
			e.HASH_COMMENT_MODE,
			m,
			h,
			x
		], re = {
			begin: t.concat(/#\[\s*\\?/, t.either(i, a)),
			beginScope: "meta",
			end: /]/,
			endScope: "meta",
			keywords: {
				literal: g,
				keyword: ["new", "array"]
			},
			contains: [
				{
					begin: /\[/,
					end: /]/,
					keywords: {
						literal: g,
						keyword: ["new", "array"]
					},
					contains: ["self", ...ne]
				},
				...ne,
				{
					scope: "meta",
					variants: [{ match: i }, { match: a }]
				}
			]
		};
		return {
			case_insensitive: !1,
			keywords: y,
			contains: [
				re,
				e.HASH_COMMENT_MODE,
				e.COMMENT("//", "$"),
				e.COMMENT("/\\*", "\\*/", { contains: [{
					scope: "doctag",
					match: "@[A-Za-z]+"
				}] }),
				{
					match: /__halt_compiler\(\);/,
					keywords: "__halt_compiler",
					starts: {
						scope: "comment",
						end: e.MATCH_NOTHING_RE,
						contains: [{
							match: /\?>/,
							scope: "meta",
							endsParent: !0
						}]
					}
				},
				s,
				{
					scope: "variable.language",
					match: /\$this\b/
				},
				o,
				te,
				ee,
				{
					match: [
						/const/,
						/\s/,
						r
					],
					scope: {
						1: "keyword",
						3: "variable.constant"
					}
				},
				x,
				{
					scope: "function",
					relevance: 0,
					beginKeywords: "fn function",
					end: /[;{]/,
					excludeEnd: !0,
					illegal: "[$%\\[]",
					contains: [
						{ beginKeywords: "use" },
						e.UNDERSCORE_TITLE_MODE,
						{
							begin: "=>",
							endsParent: !0
						},
						{
							scope: "params",
							begin: "\\(",
							end: "\\)",
							excludeBegin: !0,
							excludeEnd: !0,
							keywords: y,
							contains: [
								"self",
								re,
								o,
								ee,
								e.C_BLOCK_COMMENT_MODE,
								e.C_LINE_COMMENT_MODE,
								e.HASH_COMMENT_MODE,
								m,
								h
							]
						}
					]
				},
				{
					scope: "class",
					variants: [{
						beginKeywords: "enum",
						illegal: /[($"]/
					}, {
						beginKeywords: "class interface trait",
						illegal: /[:($"]/
					}],
					relevance: 0,
					end: /\{/,
					excludeEnd: !0,
					contains: [{ beginKeywords: "extends implements" }, e.UNDERSCORE_TITLE_MODE]
				},
				{
					beginKeywords: "namespace",
					relevance: 0,
					end: ";",
					illegal: /[.']/,
					contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
				},
				{
					beginKeywords: "use",
					relevance: 0,
					end: ";",
					contains: [{
						match: /\b(as|const|function)\b/,
						scope: "keyword"
					}, e.UNDERSCORE_TITLE_MODE]
				},
				m,
				h
			]
		};
	}
	t.exports = n;
})), Gg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return {
			name: "PHP template",
			subLanguage: "xml",
			contains: [{
				begin: /<\?(php|=)?/,
				end: /\?>/,
				subLanguage: "php",
				contains: [
					{
						begin: "/\\*",
						end: "\\*/",
						skip: !0
					},
					{
						begin: "b\"",
						end: "\"",
						skip: !0
					},
					{
						begin: "b'",
						end: "'",
						skip: !0
					},
					e.inherit(e.APOS_STRING_MODE, {
						illegal: null,
						className: null,
						contains: null,
						skip: !0
					}),
					e.inherit(e.QUOTE_STRING_MODE, {
						illegal: null,
						className: null,
						contains: null,
						skip: !0
					})
				]
			}]
		};
	}
	t.exports = n;
})), Kg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return {
			name: "Plain text",
			aliases: ["text", "txt"],
			disableAutodetect: !0
		};
	}
	t.exports = n;
})), qg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = /[\p{XID_Start}_]\p{XID_Continue}*/u, r = /* @__PURE__ */ "and.as.assert.async.await.break.case.class.continue.def.del.elif.else.except.finally.for.from.global.if.import.in.is.lambda.match.nonlocal|10.not.or.pass.raise.return.try.while.with.yield".split("."), i = {
			$pattern: /[A-Za-z]\w+|__\w+__/,
			keyword: r,
			built_in: /* @__PURE__ */ "__import__.abs.all.any.ascii.bin.bool.breakpoint.bytearray.bytes.callable.chr.classmethod.compile.complex.delattr.dict.dir.divmod.enumerate.eval.exec.filter.float.format.frozenset.getattr.globals.hasattr.hash.help.hex.id.input.int.isinstance.issubclass.iter.len.list.locals.map.max.memoryview.min.next.object.oct.open.ord.pow.print.property.range.repr.reversed.round.set.setattr.slice.sorted.staticmethod.str.sum.super.tuple.type.vars.zip".split("."),
			literal: [
				"__debug__",
				"Ellipsis",
				"False",
				"None",
				"NotImplemented",
				"True"
			],
			type: [
				"Any",
				"Callable",
				"Coroutine",
				"Dict",
				"List",
				"Literal",
				"Generic",
				"Optional",
				"Sequence",
				"Set",
				"Tuple",
				"Type",
				"Union"
			]
		}, a = {
			className: "meta",
			begin: /^(>>>|\.\.\.) /
		}, o = {
			className: "subst",
			begin: /\{/,
			end: /\}/,
			keywords: i,
			illegal: /#/
		}, s = {
			begin: /\{\{/,
			relevance: 0
		}, c = {
			className: "string",
			contains: [e.BACKSLASH_ESCAPE],
			variants: [
				{
					begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
					end: /'''/,
					contains: [e.BACKSLASH_ESCAPE, a],
					relevance: 10
				},
				{
					begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
					end: /"""/,
					contains: [e.BACKSLASH_ESCAPE, a],
					relevance: 10
				},
				{
					begin: /([fF][rR]|[rR][fF]|[fF])'''/,
					end: /'''/,
					contains: [
						e.BACKSLASH_ESCAPE,
						a,
						s,
						o
					]
				},
				{
					begin: /([fF][rR]|[rR][fF]|[fF])"""/,
					end: /"""/,
					contains: [
						e.BACKSLASH_ESCAPE,
						a,
						s,
						o
					]
				},
				{
					begin: /([uU]|[rR])'/,
					end: /'/,
					relevance: 10
				},
				{
					begin: /([uU]|[rR])"/,
					end: /"/,
					relevance: 10
				},
				{
					begin: /([bB]|[bB][rR]|[rR][bB])'/,
					end: /'/
				},
				{
					begin: /([bB]|[bB][rR]|[rR][bB])"/,
					end: /"/
				},
				{
					begin: /([fF][rR]|[rR][fF]|[fF])'/,
					end: /'/,
					contains: [
						e.BACKSLASH_ESCAPE,
						s,
						o
					]
				},
				{
					begin: /([fF][rR]|[rR][fF]|[fF])"/,
					end: /"/,
					contains: [
						e.BACKSLASH_ESCAPE,
						s,
						o
					]
				},
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE
			]
		}, l = "[0-9](_?[0-9])*", u = `(\\b(${l}))?\\.(${l})|\\b(${l})\\.`, d = `\\b|${r.join("|")}`, f = {
			className: "number",
			relevance: 0,
			variants: [
				{ begin: `(\\b(${l})|(${u}))[eE][+-]?(${l})[jJ]?(?=${d})` },
				{ begin: `(${u})[jJ]?` },
				{ begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${d})` },
				{ begin: `\\b0[bB](_?[01])+[lL]?(?=${d})` },
				{ begin: `\\b0[oO](_?[0-7])+[lL]?(?=${d})` },
				{ begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${d})` },
				{ begin: `\\b(${l})[jJ](?=${d})` }
			]
		}, p = {
			className: "comment",
			begin: t.lookahead(/# type:/),
			end: /$/,
			keywords: i,
			contains: [{ begin: /# type:/ }, {
				begin: /#/,
				end: /\b\B/,
				endsWithParent: !0
			}]
		}, m = {
			className: "params",
			variants: [{
				className: "",
				begin: /\(\s*\)/,
				skip: !0
			}, {
				begin: /\(/,
				end: /\)/,
				excludeBegin: !0,
				excludeEnd: !0,
				keywords: i,
				contains: [
					"self",
					a,
					f,
					c,
					e.HASH_COMMENT_MODE
				]
			}]
		};
		return o.contains = [
			c,
			f,
			a
		], {
			name: "Python",
			aliases: [
				"py",
				"gyp",
				"ipython"
			],
			unicodeRegex: !0,
			keywords: i,
			illegal: /(<\/|\?)|=>/,
			contains: [
				a,
				f,
				{
					scope: "variable.language",
					match: /\bself\b/
				},
				{
					beginKeywords: "if",
					relevance: 0
				},
				{
					match: /\bor\b/,
					scope: "keyword"
				},
				c,
				p,
				e.HASH_COMMENT_MODE,
				{
					match: [
						/\bdef/,
						/\s+/,
						n
					],
					scope: {
						1: "keyword",
						3: "title.function"
					},
					contains: [m]
				},
				{
					variants: [{ match: [
						/\bclass/,
						/\s+/,
						n,
						/\s*/,
						/\(\s*/,
						n,
						/\s*\)/
					] }, { match: [
						/\bclass/,
						/\s+/,
						n
					] }],
					scope: {
						1: "keyword",
						3: "title.class",
						6: "title.class.inherited"
					}
				},
				{
					className: "meta",
					begin: /^[\t ]*@/,
					end: /(?=#)|$/,
					contains: [
						f,
						m,
						c
					]
				}
			]
		};
	}
	t.exports = n;
})), Jg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return {
			aliases: ["pycon"],
			contains: [{
				className: "meta.prompt",
				starts: {
					end: / |$/,
					starts: {
						end: "$",
						subLanguage: "python"
					}
				},
				variants: [{ begin: /^>>>(?=[ ]|$)/ }, { begin: /^\.\.\.(?=[ ]|$)/ }]
			}]
		};
	}
	t.exports = n;
})), Yg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/, r = t.either(/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/, /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/, /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/), i = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/, a = t.either(/[()]/, /[{}]/, /\[\[/, /[[\]]/, /\\/, /,/);
		return {
			name: "R",
			keywords: {
				$pattern: n,
				keyword: "function if in break next repeat else for while",
				literal: "NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
				built_in: "LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"
			},
			contains: [
				e.COMMENT(/#'/, /$/, { contains: [
					{
						scope: "doctag",
						match: /@examples/,
						starts: {
							end: t.lookahead(t.either(/\n^#'\s*(?=@[a-zA-Z]+)/, /\n^(?!#')/)),
							endsParent: !0
						}
					},
					{
						scope: "doctag",
						begin: "@param",
						end: /$/,
						contains: [{
							scope: "variable",
							variants: [{ match: n }, { match: /`(?:\\.|[^`\\])+`/ }],
							endsParent: !0
						}]
					},
					{
						scope: "doctag",
						match: /@[a-zA-Z]+/
					},
					{
						scope: "keyword",
						match: /\\[a-zA-Z]+/
					}
				] }),
				e.HASH_COMMENT_MODE,
				{
					scope: "string",
					contains: [e.BACKSLASH_ESCAPE],
					variants: [
						e.END_SAME_AS_BEGIN({
							begin: /[rR]"(-*)\(/,
							end: /\)(-*)"/
						}),
						e.END_SAME_AS_BEGIN({
							begin: /[rR]"(-*)\{/,
							end: /\}(-*)"/
						}),
						e.END_SAME_AS_BEGIN({
							begin: /[rR]"(-*)\[/,
							end: /\](-*)"/
						}),
						e.END_SAME_AS_BEGIN({
							begin: /[rR]'(-*)\(/,
							end: /\)(-*)'/
						}),
						e.END_SAME_AS_BEGIN({
							begin: /[rR]'(-*)\{/,
							end: /\}(-*)'/
						}),
						e.END_SAME_AS_BEGIN({
							begin: /[rR]'(-*)\[/,
							end: /\](-*)'/
						}),
						{
							begin: "\"",
							end: "\"",
							relevance: 0
						},
						{
							begin: "'",
							end: "'",
							relevance: 0
						}
					]
				},
				{
					relevance: 0,
					variants: [
						{
							scope: {
								1: "operator",
								2: "number"
							},
							match: [i, r]
						},
						{
							scope: {
								1: "operator",
								2: "number"
							},
							match: [/%[^%]*%/, r]
						},
						{
							scope: {
								1: "punctuation",
								2: "number"
							},
							match: [a, r]
						},
						{
							scope: { 2: "number" },
							match: [/[^a-zA-Z0-9._]|^/, r]
						}
					]
				},
				{
					scope: { 3: "operator" },
					match: [
						n,
						/\s+/,
						/<-/,
						/\s+/
					]
				},
				{
					scope: "operator",
					relevance: 0,
					variants: [{ match: i }, { match: /%[^%]*%/ }]
				},
				{
					scope: "punctuation",
					relevance: 0,
					match: a
				},
				{
					begin: "`",
					end: "`",
					contains: [{ begin: /\\./ }]
				}
			]
		};
	}
	t.exports = n;
})), Xg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = /(r#)?/, r = t.concat(n, e.UNDERSCORE_IDENT_RE), i = t.concat(n, e.IDENT_RE), a = {
			className: "title.function.invoke",
			relevance: 0,
			begin: t.concat(/\b/, /(?!let|for|while|if|else|match\b)/, i, t.lookahead(/\s*\(/))
		}, o = "([ui](8|16|32|64|128|size)|f(32|64))?", s = /* @__PURE__ */ "abstract.as.async.await.become.box.break.const.continue.crate.do.dyn.else.enum.extern.false.final.fn.for.if.impl.in.let.loop.macro.match.mod.move.mut.override.priv.pub.ref.return.self.Self.static.struct.super.trait.true.try.type.typeof.union.unsafe.unsized.use.virtual.where.while.yield".split("."), c = [
			"true",
			"false",
			"Some",
			"None",
			"Ok",
			"Err"
		], l = /* @__PURE__ */ "drop .Copy.Send.Sized.Sync.Drop.Fn.FnMut.FnOnce.ToOwned.Clone.Debug.PartialEq.PartialOrd.Eq.Ord.AsRef.AsMut.Into.From.Default.Iterator.Extend.IntoIterator.DoubleEndedIterator.ExactSizeIterator.SliceConcatExt.ToString.assert!.assert_eq!.bitflags!.bytes!.cfg!.col!.concat!.concat_idents!.debug_assert!.debug_assert_eq!.env!.eprintln!.panic!.file!.format!.format_args!.include_bytes!.include_str!.line!.local_data_key!.module_path!.option_env!.print!.println!.select!.stringify!.try!.unimplemented!.unreachable!.vec!.write!.writeln!.macro_rules!.assert_ne!.debug_assert_ne!".split("."), u = [
			"i8",
			"i16",
			"i32",
			"i64",
			"i128",
			"isize",
			"u8",
			"u16",
			"u32",
			"u64",
			"u128",
			"usize",
			"f32",
			"f64",
			"str",
			"char",
			"bool",
			"Box",
			"Option",
			"Result",
			"String",
			"Vec"
		];
		return {
			name: "Rust",
			aliases: ["rs"],
			keywords: {
				$pattern: e.IDENT_RE + "!?",
				type: u,
				keyword: s,
				literal: c,
				built_in: l
			},
			illegal: "</",
			contains: [
				e.C_LINE_COMMENT_MODE,
				e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
				e.inherit(e.QUOTE_STRING_MODE, {
					begin: /b?"/,
					illegal: null
				}),
				{
					className: "symbol",
					begin: /'[a-zA-Z_][a-zA-Z0-9_]*(?!')/
				},
				{
					scope: "string",
					variants: [{ begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ }, {
						begin: /b?'/,
						end: /'/,
						contains: [{
							scope: "char.escape",
							match: /\\('|\w|x\w{2}|u\w{4}|U\w{8})/
						}]
					}]
				},
				{
					className: "number",
					variants: [
						{ begin: "\\b0b([01_]+)" + o },
						{ begin: "\\b0o([0-7_]+)" + o },
						{ begin: "\\b0x([A-Fa-f0-9_]+)" + o },
						{ begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + o }
					],
					relevance: 0
				},
				{
					begin: [
						/fn/,
						/\s+/,
						r
					],
					className: {
						1: "keyword",
						3: "title.function"
					}
				},
				{
					className: "meta",
					begin: "#!?\\[",
					end: "\\]",
					contains: [{
						className: "string",
						begin: /"/,
						end: /"/,
						contains: [e.BACKSLASH_ESCAPE]
					}]
				},
				{
					begin: [
						/let/,
						/\s+/,
						/(?:mut\s+)?/,
						r
					],
					className: {
						1: "keyword",
						3: "keyword",
						4: "variable"
					}
				},
				{
					begin: [
						/for/,
						/\s+/,
						r,
						/\s+/,
						/in/
					],
					className: {
						1: "keyword",
						3: "variable",
						5: "keyword"
					}
				},
				{
					begin: [
						/type/,
						/\s+/,
						r
					],
					className: {
						1: "keyword",
						3: "title.class"
					}
				},
				{
					begin: [
						/(?:trait|enum|struct|union|impl|for)/,
						/\s+/,
						r
					],
					className: {
						1: "keyword",
						3: "title.class"
					}
				},
				{
					begin: e.IDENT_RE + "::",
					keywords: {
						keyword: "Self",
						built_in: l,
						type: u
					}
				},
				{
					className: "punctuation",
					begin: "->"
				},
				a
			]
		};
	}
	t.exports = n;
})), Zg = /* @__PURE__ */ o(((e, t) => {
	var n = (e) => ({
		IMPORTANT: {
			scope: "meta",
			begin: "!important"
		},
		BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
		HEXCOLOR: {
			scope: "number",
			begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
		},
		UNICODE_RANGE: {
			scope: "number",
			begin: /\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,4}(-[0-9A-Fa-f][0-9A-Fa-f]{0,4})?/
		},
		FUNCTION_DISPATCH: {
			className: "built_in",
			begin: /[\w-]+(?=\()/
		},
		ATTRIBUTE_SELECTOR_MODE: {
			scope: "selector-attr",
			begin: /\[/,
			end: /\]/,
			illegal: "$",
			contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
		},
		CSS_NUMBER_MODE: {
			scope: "number",
			begin: e.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
			relevance: 0
		},
		CSS_VARIABLE: {
			className: "attr",
			begin: /--[A-Za-z_][A-Za-z0-9_-]*/
		}
	}), r = /* @__PURE__ */ "a.abbr.address.article.aside.audio.b.blockquote.body.button.canvas.caption.cite.code.dd.del.details.dfn.div.dl.dt.em.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.hgroup.html.i.iframe.img.input.ins.kbd.label.legend.li.main.mark.menu.nav.object.ol.optgroup.option.p.picture.q.quote.samp.section.select.source.span.strong.summary.sup.table.tbody.td.textarea.tfoot.th.thead.time.tr.ul.var.video".split("."), i = /* @__PURE__ */ "defs.g.marker.mask.pattern.svg.switch.symbol.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feFlood.feGaussianBlur.feImage.feMerge.feMorphology.feOffset.feSpecularLighting.feTile.feTurbulence.linearGradient.radialGradient.stop.circle.ellipse.image.line.path.polygon.polyline.rect.text.use.textPath.tspan.foreignObject.clipPath".split("."), a = [...r, ...i], o = (/* @__PURE__ */ "any-hover.any-pointer.aspect-ratio.color.color-gamut.color-index.device-aspect-ratio.device-height.device-width.display-mode.forced-colors.grid.height.hover.inverted-colors.monochrome.orientation.overflow-block.overflow-inline.pointer.prefers-color-scheme.prefers-contrast.prefers-reduced-motion.prefers-reduced-transparency.resolution.scan.scripting.update.width.min-width.max-width.min-height.max-height".split(".")).sort().reverse(), s = (/* @__PURE__ */ "active.any-link.blank.checked.current.default.defined.dir.disabled.drop.empty.enabled.first.first-child.first-of-type.fullscreen.future.focus.focus-visible.focus-within.has.host.host-context.hover.indeterminate.in-range.invalid.is.lang.last-child.last-of-type.left.link.local-link.not.nth-child.nth-col.nth-last-child.nth-last-col.nth-last-of-type.nth-of-type.only-child.only-of-type.optional.out-of-range.past.placeholder-shown.read-only.read-write.required.right.root.scope.target.target-within.user-invalid.valid.visited.where".split(".")).sort().reverse(), c = [
		"after",
		"backdrop",
		"before",
		"cue",
		"cue-region",
		"first-letter",
		"first-line",
		"grammar-error",
		"marker",
		"part",
		"placeholder",
		"selection",
		"slotted",
		"spelling-error"
	].sort().reverse(), l = (/* @__PURE__ */ "accent-color.align-content.align-items.align-self.alignment-baseline.all.anchor-name.animation.animation-composition.animation-delay.animation-direction.animation-duration.animation-fill-mode.animation-iteration-count.animation-name.animation-play-state.animation-range.animation-range-end.animation-range-start.animation-timeline.animation-timing-function.appearance.aspect-ratio.backdrop-filter.backface-visibility.background.background-attachment.background-blend-mode.background-clip.background-color.background-image.background-origin.background-position.background-position-x.background-position-y.background-repeat.background-size.baseline-shift.block-size.border.border-block.border-block-color.border-block-end.border-block-end-color.border-block-end-style.border-block-end-width.border-block-start.border-block-start-color.border-block-start-style.border-block-start-width.border-block-style.border-block-width.border-bottom.border-bottom-color.border-bottom-left-radius.border-bottom-right-radius.border-bottom-style.border-bottom-width.border-collapse.border-color.border-end-end-radius.border-end-start-radius.border-image.border-image-outset.border-image-repeat.border-image-slice.border-image-source.border-image-width.border-inline.border-inline-color.border-inline-end.border-inline-end-color.border-inline-end-style.border-inline-end-width.border-inline-start.border-inline-start-color.border-inline-start-style.border-inline-start-width.border-inline-style.border-inline-width.border-left.border-left-color.border-left-style.border-left-width.border-radius.border-right.border-right-color.border-right-style.border-right-width.border-spacing.border-start-end-radius.border-start-start-radius.border-style.border-top.border-top-color.border-top-left-radius.border-top-right-radius.border-top-style.border-top-width.border-width.bottom.box-align.box-decoration-break.box-direction.box-flex.box-flex-group.box-lines.box-ordinal-group.box-orient.box-pack.box-shadow.box-sizing.break-after.break-before.break-inside.caption-side.caret-color.clear.clip.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.color-scheme.column-count.column-fill.column-gap.column-rule.column-rule-color.column-rule-style.column-rule-width.column-span.column-width.columns.contain.contain-intrinsic-block-size.contain-intrinsic-height.contain-intrinsic-inline-size.contain-intrinsic-size.contain-intrinsic-width.container.container-name.container-type.content.content-visibility.counter-increment.counter-reset.counter-set.cue.cue-after.cue-before.cursor.cx.cy.direction.display.dominant-baseline.empty-cells.enable-background.field-sizing.fill.fill-opacity.fill-rule.filter.flex.flex-basis.flex-direction.flex-flow.flex-grow.flex-shrink.flex-wrap.float.flood-color.flood-opacity.flow.font.font-display.font-family.font-feature-settings.font-kerning.font-language-override.font-optical-sizing.font-palette.font-size.font-size-adjust.font-smooth.font-smoothing.font-stretch.font-style.font-synthesis.font-synthesis-position.font-synthesis-small-caps.font-synthesis-style.font-synthesis-weight.font-variant.font-variant-alternates.font-variant-caps.font-variant-east-asian.font-variant-emoji.font-variant-ligatures.font-variant-numeric.font-variant-position.font-variation-settings.font-weight.forced-color-adjust.gap.glyph-orientation-horizontal.glyph-orientation-vertical.grid.grid-area.grid-auto-columns.grid-auto-flow.grid-auto-rows.grid-column.grid-column-end.grid-column-start.grid-gap.grid-row.grid-row-end.grid-row-start.grid-template.grid-template-areas.grid-template-columns.grid-template-rows.hanging-punctuation.height.hyphenate-character.hyphenate-limit-chars.hyphens.icon.image-orientation.image-rendering.image-resolution.ime-mode.initial-letter.initial-letter-align.inline-size.inset.inset-area.inset-block.inset-block-end.inset-block-start.inset-inline.inset-inline-end.inset-inline-start.isolation.justify-content.justify-items.justify-self.kerning.left.letter-spacing.lighting-color.line-break.line-height.line-height-step.list-style.list-style-image.list-style-position.list-style-type.margin.margin-block.margin-block-end.margin-block-start.margin-bottom.margin-inline.margin-inline-end.margin-inline-start.margin-left.margin-right.margin-top.margin-trim.marker.marker-end.marker-mid.marker-start.marks.mask.mask-border.mask-border-mode.mask-border-outset.mask-border-repeat.mask-border-slice.mask-border-source.mask-border-width.mask-clip.mask-composite.mask-image.mask-mode.mask-origin.mask-position.mask-repeat.mask-size.mask-type.masonry-auto-flow.math-depth.math-shift.math-style.max-block-size.max-height.max-inline-size.max-width.min-block-size.min-height.min-inline-size.min-width.mix-blend-mode.nav-down.nav-index.nav-left.nav-right.nav-up.none.normal.object-fit.object-position.offset.offset-anchor.offset-distance.offset-path.offset-position.offset-rotate.opacity.order.orphans.outline.outline-color.outline-offset.outline-style.outline-width.overflow.overflow-anchor.overflow-block.overflow-clip-margin.overflow-inline.overflow-wrap.overflow-x.overflow-y.overlay.overscroll-behavior.overscroll-behavior-block.overscroll-behavior-inline.overscroll-behavior-x.overscroll-behavior-y.padding.padding-block.padding-block-end.padding-block-start.padding-bottom.padding-inline.padding-inline-end.padding-inline-start.padding-left.padding-right.padding-top.page.page-break-after.page-break-before.page-break-inside.paint-order.pause.pause-after.pause-before.perspective.perspective-origin.place-content.place-items.place-self.pointer-events.position.position-anchor.position-visibility.print-color-adjust.quotes.r.resize.rest.rest-after.rest-before.right.rotate.row-gap.ruby-align.ruby-position.scale.scroll-behavior.scroll-margin.scroll-margin-block.scroll-margin-block-end.scroll-margin-block-start.scroll-margin-bottom.scroll-margin-inline.scroll-margin-inline-end.scroll-margin-inline-start.scroll-margin-left.scroll-margin-right.scroll-margin-top.scroll-padding.scroll-padding-block.scroll-padding-block-end.scroll-padding-block-start.scroll-padding-bottom.scroll-padding-inline.scroll-padding-inline-end.scroll-padding-inline-start.scroll-padding-left.scroll-padding-right.scroll-padding-top.scroll-snap-align.scroll-snap-stop.scroll-snap-type.scroll-timeline.scroll-timeline-axis.scroll-timeline-name.scrollbar-color.scrollbar-gutter.scrollbar-width.shape-image-threshold.shape-margin.shape-outside.shape-rendering.speak.speak-as.src.stop-color.stop-opacity.stroke.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke-width.tab-size.table-layout.text-align.text-align-all.text-align-last.text-anchor.text-combine-upright.text-decoration.text-decoration-color.text-decoration-line.text-decoration-skip.text-decoration-skip-ink.text-decoration-style.text-decoration-thickness.text-emphasis.text-emphasis-color.text-emphasis-position.text-emphasis-style.text-indent.text-justify.text-orientation.text-overflow.text-rendering.text-shadow.text-size-adjust.text-transform.text-underline-offset.text-underline-position.text-wrap.text-wrap-mode.text-wrap-style.timeline-scope.top.touch-action.transform.transform-box.transform-origin.transform-style.transition.transition-behavior.transition-delay.transition-duration.transition-property.transition-timing-function.translate.unicode-bidi.unicode-range.user-modify.user-select.vector-effect.vertical-align.view-timeline.view-timeline-axis.view-timeline-inset.view-timeline-name.view-transition-name.visibility.voice-balance.voice-duration.voice-family.voice-pitch.voice-range.voice-rate.voice-stress.voice-volume.white-space.white-space-collapse.widows.width.will-change.word-break.word-spacing.word-wrap.writing-mode.x.y.z-index.zoom".split(".")).sort().reverse();
	function u(e) {
		let t = n(e), r = c, i = s, u = "@[a-z-]+", d = {
			className: "variable",
			begin: "(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b",
			relevance: 0
		};
		return {
			name: "SCSS",
			case_insensitive: !0,
			illegal: "[=/|']",
			contains: [
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				t.CSS_NUMBER_MODE,
				{
					className: "selector-id",
					begin: "#[A-Za-z0-9_-]+",
					relevance: 0
				},
				{
					className: "selector-class",
					begin: "\\.[A-Za-z0-9_-]+",
					relevance: 0
				},
				t.ATTRIBUTE_SELECTOR_MODE,
				{
					className: "selector-tag",
					begin: "\\b(" + a.join("|") + ")\\b",
					relevance: 0
				},
				{
					className: "selector-pseudo",
					begin: ":(" + i.join("|") + ")"
				},
				{
					className: "selector-pseudo",
					begin: ":(:)?(" + r.join("|") + ")"
				},
				d,
				{
					begin: /\(/,
					end: /\)/,
					contains: [t.CSS_NUMBER_MODE]
				},
				t.CSS_VARIABLE,
				{
					className: "attribute",
					begin: "\\b(" + l.join("|") + ")\\b"
				},
				{ begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b" },
				{
					begin: /:/,
					end: /[;}{]/,
					relevance: 0,
					contains: [
						t.BLOCK_COMMENT,
						d,
						t.HEXCOLOR,
						t.CSS_NUMBER_MODE,
						t.UNICODE_RANGE,
						e.QUOTE_STRING_MODE,
						e.APOS_STRING_MODE,
						t.IMPORTANT,
						t.FUNCTION_DISPATCH
					]
				},
				{
					begin: "@(page|font-face)",
					keywords: {
						$pattern: u,
						keyword: "@page @font-face"
					}
				},
				{
					begin: "@",
					end: "[{;]",
					returnBegin: !0,
					keywords: {
						$pattern: /[a-z-]+/,
						keyword: "and or not only",
						attribute: o.join(" ")
					},
					contains: [
						{
							begin: u,
							className: "keyword"
						},
						{
							begin: /[a-z-]+(?=:)/,
							className: "attribute"
						},
						d,
						e.QUOTE_STRING_MODE,
						e.APOS_STRING_MODE,
						t.HEXCOLOR,
						t.CSS_NUMBER_MODE
					]
				},
				t.FUNCTION_DISPATCH
			]
		};
	}
	t.exports = u;
})), Qg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return {
			name: "Shell Session",
			aliases: ["console", "shellsession"],
			contains: [{
				className: "meta.prompt",
				begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
				starts: {
					end: /[^\\](?=\s*$)/,
					subLanguage: "bash"
				}
			}]
		};
	}
	t.exports = n;
})), $g = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = e.COMMENT("--", "$"), r = {
			scope: "string",
			variants: [{
				begin: /'/,
				end: /'/,
				contains: [{ match: /''/ }]
			}]
		}, i = {
			begin: /"/,
			end: /"/,
			contains: [{ match: /""/ }]
		}, a = [
			"true",
			"false",
			"unknown"
		], o = [
			"double precision",
			"large object",
			"with timezone",
			"without timezone"
		], s = /* @__PURE__ */ "bigint.binary.blob.boolean.char.character.clob.date.dec.decfloat.decimal.float.int.integer.interval.nchar.nclob.national.numeric.real.row.smallint.time.timestamp.varchar.varying.varbinary".split("."), c = [
			"add",
			"asc",
			"collation",
			"desc",
			"final",
			"first",
			"last",
			"view"
		], l = /* @__PURE__ */ "abs.acos.all.allocate.alter.and.any.are.array.array_agg.array_max_cardinality.as.asensitive.asin.asymmetric.at.atan.atomic.authorization.avg.begin.begin_frame.begin_partition.between.bigint.binary.blob.boolean.both.by.call.called.cardinality.cascaded.case.cast.ceil.ceiling.char.char_length.character.character_length.check.classifier.clob.close.coalesce.collate.collect.column.commit.condition.connect.constraint.contains.convert.copy.corr.corresponding.cos.cosh.count.covar_pop.covar_samp.create.cross.cube.cume_dist.current.current_catalog.current_date.current_default_transform_group.current_path.current_role.current_row.current_schema.current_time.current_timestamp.current_path.current_role.current_transform_group_for_type.current_user.cursor.cycle.date.day.deallocate.dec.decimal.decfloat.declare.default.define.delete.dense_rank.deref.describe.deterministic.disconnect.distinct.double.drop.dynamic.each.element.else.empty.end.end_frame.end_partition.end-exec.equals.escape.every.except.exec.execute.exists.exp.external.extract.false.fetch.filter.first_value.float.floor.for.foreign.frame_row.free.from.full.function.fusion.get.global.grant.group.grouping.groups.having.hold.hour.identity.in.indicator.initial.inner.inout.insensitive.insert.int.integer.intersect.intersection.interval.into.is.join.json_array.json_arrayagg.json_exists.json_object.json_objectagg.json_query.json_table.json_table_primitive.json_value.lag.language.large.last_value.lateral.lead.leading.left.like.like_regex.listagg.ln.local.localtime.localtimestamp.log.log10.lower.match.match_number.match_recognize.matches.max.member.merge.method.min.minute.mod.modifies.module.month.multiset.national.natural.nchar.nclob.new.no.none.normalize.not.nth_value.ntile.null.nullif.numeric.octet_length.occurrences_regex.of.offset.old.omit.on.one.only.open.or.order.out.outer.over.overlaps.overlay.parameter.partition.pattern.per.percent.percent_rank.percentile_cont.percentile_disc.period.portion.position.position_regex.power.precedes.precision.prepare.primary.procedure.ptf.range.rank.reads.real.recursive.ref.references.referencing.regr_avgx.regr_avgy.regr_count.regr_intercept.regr_r2.regr_slope.regr_sxx.regr_sxy.regr_syy.release.result.return.returns.revoke.right.rollback.rollup.row.row_number.rows.running.savepoint.scope.scroll.search.second.seek.select.sensitive.session_user.set.show.similar.sin.sinh.skip.smallint.some.specific.specifictype.sql.sqlexception.sqlstate.sqlwarning.sqrt.start.static.stddev_pop.stddev_samp.submultiset.subset.substring.substring_regex.succeeds.sum.symmetric.system.system_time.system_user.table.tablesample.tan.tanh.then.time.timestamp.timezone_hour.timezone_minute.to.trailing.translate.translate_regex.translation.treat.trigger.trim.trim_array.true.truncate.uescape.union.unique.unknown.unnest.update.upper.user.using.value.values.value_of.var_pop.var_samp.varbinary.varchar.varying.versioning.when.whenever.where.width_bucket.window.with.within.without.year".split("."), u = /* @__PURE__ */ "abs.acos.array_agg.asin.atan.avg.cast.ceil.ceiling.coalesce.corr.cos.cosh.count.covar_pop.covar_samp.cume_dist.dense_rank.deref.element.exp.extract.first_value.floor.json_array.json_arrayagg.json_exists.json_object.json_objectagg.json_query.json_table.json_table_primitive.json_value.lag.last_value.lead.listagg.ln.log.log10.lower.max.min.mod.nth_value.ntile.nullif.percent_rank.percentile_cont.percentile_disc.position.position_regex.power.rank.regr_avgx.regr_avgy.regr_count.regr_intercept.regr_r2.regr_slope.regr_sxx.regr_sxy.regr_syy.row_number.sin.sinh.sqrt.stddev_pop.stddev_samp.substring.substring_regex.sum.tan.tanh.translate.translate_regex.treat.trim.trim_array.unnest.upper.value_of.var_pop.var_samp.width_bucket".split("."), d = [
			"current_catalog",
			"current_date",
			"current_default_transform_group",
			"current_path",
			"current_role",
			"current_schema",
			"current_transform_group_for_type",
			"current_user",
			"session_user",
			"system_time",
			"system_user",
			"current_time",
			"localtime",
			"current_timestamp",
			"localtimestamp"
		], f = [
			"create table",
			"insert into",
			"primary key",
			"foreign key",
			"not null",
			"alter table",
			"add constraint",
			"grouping sets",
			"on overflow",
			"character set",
			"respect nulls",
			"ignore nulls",
			"nulls first",
			"nulls last",
			"depth first",
			"breadth first"
		], p = u, m = [...l, ...c].filter((e) => !u.includes(e)), h = {
			scope: "variable",
			match: /@[a-z0-9][a-z0-9_]*/
		}, g = {
			scope: "operator",
			match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
			relevance: 0
		}, _ = {
			match: t.concat(/\b/, t.either(...p), /\s*\(/),
			relevance: 0,
			keywords: { built_in: p }
		};
		function v(e) {
			return t.concat(/\b/, t.either(...e.map((e) => e.replace(/\s+/, "\\s+"))), /\b/);
		}
		let y = {
			scope: "keyword",
			match: v(f),
			relevance: 0
		};
		function b(e, { exceptions: t, when: n } = {}) {
			let r = n;
			return t ||= [], e.map((e) => e.match(/\|\d+$/) || t.includes(e) ? e : r(e) ? `${e}|0` : e);
		}
		return {
			name: "SQL",
			case_insensitive: !0,
			illegal: /[{}]|<\//,
			keywords: {
				$pattern: /\b[\w\.]+/,
				keyword: b(m, { when: (e) => e.length < 3 }),
				literal: a,
				type: s,
				built_in: d
			},
			contains: [
				{
					scope: "type",
					match: v(o)
				},
				y,
				_,
				h,
				r,
				i,
				e.C_NUMBER_MODE,
				e.C_BLOCK_COMMENT_MODE,
				n,
				g
			]
		};
	}
	t.exports = n;
})), e_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return e ? typeof e == "string" ? e : e.source : null;
	}
	function r(e) {
		return i("(?=", e, ")");
	}
	function i(...e) {
		return e.map((e) => n(e)).join("");
	}
	function a(e) {
		let t = e[e.length - 1];
		return typeof t == "object" && t.constructor === Object ? (e.splice(e.length - 1, 1), t) : {};
	}
	function o(...e) {
		return "(" + (a(e).capture ? "" : "?:") + e.map((e) => n(e)).join("|") + ")";
	}
	var s = (e) => i(/\b/, e, /\w$/.test(e) ? /\b/ : /\B/), c = ["Protocol", "Type"].map(s), l = ["init", "self"].map(s), u = ["Any", "Self"], d = [
		"actor",
		"any",
		"associatedtype",
		"async",
		"await",
		/as\?/,
		/as!/,
		"as",
		"borrowing",
		"break",
		"case",
		"catch",
		"class",
		"consume",
		"consuming",
		"continue",
		"convenience",
		"copy",
		"default",
		"defer",
		"deinit",
		"didSet",
		"distributed",
		"do",
		"dynamic",
		"each",
		"else",
		"enum",
		"extension",
		"fallthrough",
		/fileprivate\(set\)/,
		"fileprivate",
		"final",
		"for",
		"func",
		"get",
		"guard",
		"if",
		"import",
		"indirect",
		"infix",
		/init\?/,
		/init!/,
		"inout",
		/internal\(set\)/,
		"internal",
		"in",
		"is",
		"isolated",
		"nonisolated",
		"lazy",
		"let",
		"macro",
		"mutating",
		"nonmutating",
		/open\(set\)/,
		"open",
		"operator",
		"optional",
		"override",
		"package",
		"postfix",
		"precedencegroup",
		"prefix",
		/private\(set\)/,
		"private",
		"protocol",
		/public\(set\)/,
		"public",
		"repeat",
		"required",
		"rethrows",
		"return",
		"set",
		"some",
		"static",
		"struct",
		"subscript",
		"super",
		"switch",
		"throws",
		"throw",
		/try\?/,
		/try!/,
		"try",
		"typealias",
		/unowned\(safe\)/,
		/unowned\(unsafe\)/,
		"unowned",
		"var",
		"weak",
		"where",
		"while",
		"willSet"
	], f = [
		"false",
		"nil",
		"true"
	], p = [
		"assignment",
		"associativity",
		"higherThan",
		"left",
		"lowerThan",
		"none",
		"right"
	], m = [
		"#colorLiteral",
		"#column",
		"#dsohandle",
		"#else",
		"#elseif",
		"#endif",
		"#error",
		"#file",
		"#fileID",
		"#fileLiteral",
		"#filePath",
		"#function",
		"#if",
		"#imageLiteral",
		"#keyPath",
		"#line",
		"#selector",
		"#sourceLocation",
		"#warning"
	], h = /* @__PURE__ */ "abs.all.any.assert.assertionFailure.debugPrint.dump.fatalError.getVaList.isKnownUniquelyReferenced.max.min.numericCast.pointwiseMax.pointwiseMin.precondition.preconditionFailure.print.readLine.repeatElement.sequence.stride.swap.swift_unboxFromSwiftValueWithType.transcode.type.unsafeBitCast.unsafeDowncast.withExtendedLifetime.withUnsafeMutablePointer.withUnsafePointer.withVaList.withoutActuallyEscaping.zip".split("."), g = o(/[/=\-+!*%<>&|^~?]/, /[\u00A1-\u00A7]/, /[\u00A9\u00AB]/, /[\u00AC\u00AE]/, /[\u00B0\u00B1]/, /[\u00B6\u00BB\u00BF\u00D7\u00F7]/, /[\u2016-\u2017]/, /[\u2020-\u2027]/, /[\u2030-\u203E]/, /[\u2041-\u2053]/, /[\u2055-\u205E]/, /[\u2190-\u23FF]/, /[\u2500-\u2775]/, /[\u2794-\u2BFF]/, /[\u2E00-\u2E7F]/, /[\u3001-\u3003]/, /[\u3008-\u3020]/, /[\u3030]/), _ = o(g, /[\u0300-\u036F]/, /[\u1DC0-\u1DFF]/, /[\u20D0-\u20FF]/, /[\uFE00-\uFE0F]/, /[\uFE20-\uFE2F]/), v = i(g, _, "*"), y = o(/[a-zA-Z_]/, /[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/, /[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, /[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/, /[\u1E00-\u1FFF]/, /[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/, /[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/, /[\u2C00-\u2DFF\u2E80-\u2FFF]/, /[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/, /[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/, /[\uFE47-\uFEFE\uFF00-\uFFFD]/), b = o(y, /\d/, /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/), x = i(y, b, "*"), S = i(/[A-Z]/, b, "*"), ee = [
		"attached",
		"autoclosure",
		i(/convention\(/, o("swift", "block", "c"), /\)/),
		"discardableResult",
		"dynamicCallable",
		"dynamicMemberLookup",
		"escaping",
		"freestanding",
		"frozen",
		"GKInspectable",
		"IBAction",
		"IBDesignable",
		"IBInspectable",
		"IBOutlet",
		"IBSegueAction",
		"inlinable",
		"main",
		"nonobjc",
		"NSApplicationMain",
		"NSCopying",
		"NSManaged",
		i(/objc\(/, x, /\)/),
		"objc",
		"objcMembers",
		"propertyWrapper",
		"requires_stored_property_inits",
		"resultBuilder",
		"Sendable",
		"testable",
		"UIApplicationMain",
		"unchecked",
		"unknown",
		"usableFromInline",
		"warn_unqualified_access"
	], C = [
		"iOS",
		"iOSApplicationExtension",
		"macOS",
		"macOSApplicationExtension",
		"macCatalyst",
		"macCatalystApplicationExtension",
		"watchOS",
		"watchOSApplicationExtension",
		"tvOS",
		"tvOSApplicationExtension",
		"swift"
	];
	function w(e) {
		let t = {
			match: /\s+/,
			relevance: 0
		}, n = e.COMMENT("/\\*", "\\*/", { contains: ["self"] }), a = [e.C_LINE_COMMENT_MODE, n], g = {
			match: [/\./, o(...c, ...l)],
			className: { 2: "keyword" }
		}, y = {
			match: i(/\./, o(...d)),
			relevance: 0
		}, w = d.filter((e) => typeof e == "string").concat(["_|0"]), te = { variants: [{
			className: "keyword",
			match: o(...d.filter((e) => typeof e != "string").concat(u).map(s), ...l)
		}] }, ne = {
			$pattern: o(/\b\w+/, /#\w+/),
			keyword: w.concat(m),
			literal: f
		}, re = [
			g,
			y,
			te
		], ie = [{
			match: i(/\./, o(...h)),
			relevance: 0
		}, {
			className: "built_in",
			match: i(/\b/, o(...h), /(?=\()/)
		}], T = {
			match: /->/,
			relevance: 0
		}, ae = [T, {
			className: "operator",
			relevance: 0,
			variants: [{ match: v }, { match: `\\.(\\.|${_})+` }]
		}], E = "([0-9]_*)+", oe = "([0-9a-fA-F]_*)+", D = {
			className: "number",
			relevance: 0,
			variants: [
				{ match: `\\b(${E})(\\.(${E}))?([eE][+-]?(${E}))?\\b` },
				{ match: `\\b0x(${oe})(\\.(${oe}))?([pP][+-]?(${E}))?\\b` },
				{ match: /\b0o([0-7]_*)+\b/ },
				{ match: /\b0b([01]_*)+\b/ }
			]
		}, se = (e = "") => ({
			className: "subst",
			variants: [{ match: i(/\\/, e, /[0\\tnr"']/) }, { match: i(/\\/, e, /u\{[0-9a-fA-F]{1,8}\}/) }]
		}), ce = (e = "") => ({
			className: "subst",
			match: i(/\\/, e, /[\t ]*(?:[\r\n]|\r\n)/)
		}), le = (e = "") => ({
			className: "subst",
			label: "interpol",
			begin: i(/\\/, e, /\(/),
			end: /\)/
		}), ue = (e = "") => ({
			begin: i(e, /"""/),
			end: i(/"""/, e),
			contains: [
				se(e),
				ce(e),
				le(e)
			]
		}), de = (e = "") => ({
			begin: i(e, /"/),
			end: i(/"/, e),
			contains: [se(e), le(e)]
		}), fe = {
			className: "string",
			variants: [
				ue(),
				ue("#"),
				ue("##"),
				ue("###"),
				de(),
				de("#"),
				de("##"),
				de("###")
			]
		}, pe = [e.BACKSLASH_ESCAPE, {
			begin: /\[/,
			end: /\]/,
			relevance: 0,
			contains: [e.BACKSLASH_ESCAPE]
		}], me = {
			begin: /\/[^\s](?=[^/\n]*\/)/,
			end: /\//,
			contains: pe
		}, he = (e) => {
			let t = i(e, /\//), n = i(/\//, e);
			return {
				begin: t,
				end: n,
				contains: [...pe, {
					scope: "comment",
					begin: `#(?!.*${n})`,
					end: /$/
				}]
			};
		}, ge = {
			scope: "regexp",
			variants: [
				he("###"),
				he("##"),
				he("#"),
				me
			]
		}, _e = { match: i(/`/, x, /`/) }, ve = [
			_e,
			{
				className: "variable",
				match: /\$\d+/
			},
			{
				className: "variable",
				match: `\\$${b}+`
			}
		], ye = [
			{
				match: /(@|#(un)?)available/,
				scope: "keyword",
				starts: { contains: [{
					begin: /\(/,
					end: /\)/,
					keywords: C,
					contains: [
						...ae,
						D,
						fe
					]
				}] }
			},
			{
				scope: "keyword",
				match: i(/@/, o(...ee), r(o(/\(/, /\s+/)))
			},
			{
				scope: "meta",
				match: i(/@/, x)
			}
		], be = {
			match: r(/\b[A-Z]/),
			relevance: 0,
			contains: [
				{
					className: "type",
					match: i(/(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/, b, "+")
				},
				{
					className: "type",
					match: S,
					relevance: 0
				},
				{
					match: /[?!]+/,
					relevance: 0
				},
				{
					match: /\.\.\./,
					relevance: 0
				},
				{
					match: i(/\s+&\s+/, r(S)),
					relevance: 0
				}
			]
		}, xe = {
			begin: /</,
			end: />/,
			keywords: ne,
			contains: [
				...a,
				...re,
				...ye,
				T,
				be
			]
		};
		be.contains.push(xe);
		let O = {
			begin: /\(/,
			end: /\)/,
			relevance: 0,
			keywords: ne,
			contains: [
				"self",
				{
					match: i(x, /\s*:/),
					keywords: "_|0",
					relevance: 0
				},
				...a,
				ge,
				...re,
				...ie,
				...ae,
				D,
				fe,
				...ve,
				...ye,
				be
			]
		}, Se = {
			begin: /</,
			end: />/,
			keywords: "repeat each",
			contains: [...a, be]
		}, Ce = {
			begin: /\(/,
			end: /\)/,
			keywords: ne,
			contains: [
				{
					begin: o(r(i(x, /\s*:/)), r(i(x, /\s+/, x, /\s*:/))),
					end: /:/,
					relevance: 0,
					contains: [{
						className: "keyword",
						match: /\b_\b/
					}, {
						className: "params",
						match: x
					}]
				},
				...a,
				...re,
				...ae,
				D,
				fe,
				...ye,
				be,
				O
			],
			endsParent: !0,
			illegal: /["']/
		}, we = {
			match: [
				/(func|macro)/,
				/\s+/,
				o(_e.match, x, v)
			],
			className: {
				1: "keyword",
				3: "title.function"
			},
			contains: [
				Se,
				Ce,
				t
			],
			illegal: [/\[/, /%/]
		}, Te = {
			match: [/\b(?:subscript|init[?!]?)/, /\s*(?=[<(])/],
			className: { 1: "keyword" },
			contains: [
				Se,
				Ce,
				t
			],
			illegal: /\[|%/
		}, Ee = {
			match: [
				/operator/,
				/\s+/,
				v
			],
			className: {
				1: "keyword",
				3: "title"
			}
		}, De = {
			begin: [
				/precedencegroup/,
				/\s+/,
				S
			],
			className: {
				1: "keyword",
				3: "title"
			},
			contains: [be],
			keywords: [...p, ...f],
			end: /}/
		}, Oe = {
			match: [
				/class\b/,
				/\s+/,
				/func\b/,
				/\s+/,
				/\b[A-Za-z_][A-Za-z0-9_]*\b/
			],
			scope: {
				1: "keyword",
				3: "keyword",
				5: "title.function"
			}
		}, k = {
			match: [
				/class\b/,
				/\s+/,
				/var\b/
			],
			scope: {
				1: "keyword",
				3: "keyword"
			}
		}, ke = {
			begin: [
				/(struct|protocol|class|extension|enum|actor)/,
				/\s+/,
				x,
				/\s*/
			],
			beginScope: {
				1: "keyword",
				3: "title.class"
			},
			keywords: ne,
			contains: [
				Se,
				...re,
				{
					begin: /:/,
					end: /\{/,
					keywords: ne,
					contains: [{
						scope: "title.class.inherited",
						match: S
					}, ...re],
					relevance: 0
				}
			]
		};
		for (let e of fe.variants) {
			let t = e.contains.find((e) => e.label === "interpol");
			t.keywords = ne;
			let n = [
				...re,
				...ie,
				...ae,
				D,
				fe,
				...ve
			];
			t.contains = [...n, {
				begin: /\(/,
				end: /\)/,
				contains: ["self", ...n]
			}];
		}
		return {
			name: "Swift",
			keywords: ne,
			contains: [
				...a,
				we,
				Te,
				Oe,
				k,
				ke,
				Ee,
				De,
				{
					beginKeywords: "import",
					end: /$/,
					contains: [...a],
					relevance: 0
				},
				ge,
				...re,
				...ie,
				...ae,
				D,
				fe,
				...ve,
				...ye,
				be,
				O
			]
		};
	}
	t.exports = w;
})), t_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = "true false yes no null", n = "[\\w#;/?:@&=+$,.~*'()[\\]]+", r = {
			className: "attr",
			variants: [
				{ begin: /[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/ },
				{ begin: /"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/ },
				{ begin: /'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/ }
			]
		}, i = {
			className: "template-variable",
			variants: [{
				begin: /\{\{/,
				end: /\}\}/
			}, {
				begin: /%\{/,
				end: /\}/
			}]
		}, a = {
			className: "string",
			relevance: 0,
			begin: /'/,
			end: /'/,
			contains: [{
				match: /''/,
				scope: "char.escape",
				relevance: 0
			}]
		}, o = {
			className: "string",
			relevance: 0,
			variants: [{
				begin: /"/,
				end: /"/
			}, { begin: /\S+/ }],
			contains: [e.BACKSLASH_ESCAPE, i]
		}, s = e.inherit(o, { variants: [
			{
				begin: /'/,
				end: /'/,
				contains: [{
					begin: /''/,
					relevance: 0
				}]
			},
			{
				begin: /"/,
				end: /"/
			},
			{ begin: /[^\s,{}[\]]+/ }
		] }), c = {
			className: "number",
			begin: "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b"
		}, l = {
			end: ",",
			endsWithParent: !0,
			excludeEnd: !0,
			keywords: t,
			relevance: 0
		}, u = {
			begin: /\{/,
			end: /\}/,
			contains: [l],
			illegal: "\\n",
			relevance: 0
		}, d = {
			begin: "\\[",
			end: "\\]",
			contains: [l],
			illegal: "\\n",
			relevance: 0
		}, f = [
			r,
			{
				className: "meta",
				begin: "^---\\s*$",
				relevance: 10
			},
			{
				className: "string",
				begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
			},
			{
				begin: "<%[%=-]?",
				end: "[%-]?%>",
				subLanguage: "ruby",
				excludeBegin: !0,
				excludeEnd: !0,
				relevance: 0
			},
			{
				className: "type",
				begin: "!\\w+!" + n
			},
			{
				className: "type",
				begin: "!<" + n + ">"
			},
			{
				className: "type",
				begin: "!" + n
			},
			{
				className: "type",
				begin: "!!" + n
			},
			{
				className: "meta",
				begin: "&" + e.UNDERSCORE_IDENT_RE + "$"
			},
			{
				className: "meta",
				begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$"
			},
			{
				className: "bullet",
				begin: "-(?=[ ]|$)",
				relevance: 0
			},
			e.HASH_COMMENT_MODE,
			{
				beginKeywords: t,
				keywords: { literal: t }
			},
			c,
			{
				className: "number",
				begin: e.C_NUMBER_RE + "\\b",
				relevance: 0
			},
			u,
			d,
			a,
			o
		], p = [...f];
		return p.pop(), p.push(s), l.contains = p, {
			name: "YAML",
			case_insensitive: !0,
			aliases: ["yml"],
			contains: f
		};
	}
	t.exports = n;
})), n_ = /* @__PURE__ */ o(((e, t) => {
	var n = "[A-Za-z$_][0-9A-Za-z$_]*", r = /* @__PURE__ */ "as.in.of.if.for.while.finally.var.new.function.do.return.void.else.break.catch.instanceof.with.throw.case.default.try.switch.continue.typeof.delete.let.yield.const.class.debugger.async.await.static.import.from.export.extends.using".split("."), i = [
		"true",
		"false",
		"null",
		"undefined",
		"NaN",
		"Infinity"
	], a = /* @__PURE__ */ "Object.Function.Boolean.Symbol.Math.Date.Number.BigInt.String.RegExp.Array.Float32Array.Float64Array.Int8Array.Uint8Array.Uint8ClampedArray.Int16Array.Int32Array.Uint16Array.Uint32Array.BigInt64Array.BigUint64Array.Set.Map.WeakSet.WeakMap.ArrayBuffer.SharedArrayBuffer.Atomics.DataView.JSON.Promise.Generator.GeneratorFunction.AsyncFunction.Reflect.Proxy.Intl.WebAssembly".split("."), o = [
		"Error",
		"EvalError",
		"InternalError",
		"RangeError",
		"ReferenceError",
		"SyntaxError",
		"TypeError",
		"URIError"
	], s = [
		"setInterval",
		"setTimeout",
		"clearInterval",
		"clearTimeout",
		"require",
		"exports",
		"eval",
		"isFinite",
		"isNaN",
		"parseFloat",
		"parseInt",
		"decodeURI",
		"decodeURIComponent",
		"encodeURI",
		"encodeURIComponent",
		"escape",
		"unescape"
	], c = [
		"arguments",
		"this",
		"super",
		"console",
		"window",
		"document",
		"localStorage",
		"sessionStorage",
		"module",
		"global"
	], l = [].concat(s, a, o);
	function u(e) {
		let t = e.regex, u = (e, { after: t }) => {
			let n = "</" + e[0].slice(1);
			return e.input.indexOf(n, t) !== -1;
		}, d = n, f = {
			begin: "<>",
			end: "</>"
		}, p = /<[A-Za-z0-9\\._:-]+\s*\/>/, m = {
			begin: /<[A-Za-z0-9\\._:-]+/,
			end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
			isTrulyOpeningTag: (e, t) => {
				let n = e[0].length + e.index, r = e.input[n];
				if (r === "<" || r === ",") {
					t.ignoreMatch();
					return;
				}
				r === ">" && (u(e, { after: n }) || t.ignoreMatch());
				let i, a = e.input.substring(n);
				if (i = a.match(/^\s*=/)) {
					t.ignoreMatch();
					return;
				}
				if ((i = a.match(/^\s+extends\s+/)) && i.index === 0) {
					t.ignoreMatch();
					return;
				}
			}
		}, h = {
			$pattern: n,
			keyword: r,
			literal: i,
			built_in: l,
			"variable.language": c
		}, g = "[0-9](_?[0-9])*", _ = `\\.(${g})`, v = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", y = {
			className: "number",
			variants: [
				{ begin: `(\\b(${v})((${_})|\\.)?|(${_}))[eE][+-]?(${g})\\b` },
				{ begin: `\\b(${v})\\b((${_})\\b|\\.)?|(${_})\\b` },
				{ begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
				{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
				{ begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
				{ begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
				{ begin: "\\b0[0-7]+n?\\b" }
			],
			relevance: 0
		}, b = {
			className: "subst",
			begin: "\\$\\{",
			end: "\\}",
			keywords: h,
			contains: []
		}, x = {
			begin: ".?html`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "xml"
			}
		}, S = {
			begin: ".?css`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "css"
			}
		}, ee = {
			begin: ".?gql`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "graphql"
			}
		}, C = {
			className: "string",
			begin: "`",
			end: "`",
			contains: [e.BACKSLASH_ESCAPE, b]
		}, w = {
			className: "comment",
			variants: [
				e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
					relevance: 0,
					contains: [{
						begin: "(?=@[A-Za-z]+)",
						relevance: 0,
						contains: [
							{
								className: "doctag",
								begin: "@[A-Za-z]+"
							},
							{
								className: "type",
								begin: "\\{",
								end: "\\}",
								excludeEnd: !0,
								excludeBegin: !0,
								relevance: 0
							},
							{
								className: "variable",
								begin: d + "(?=\\s*(-)|$)",
								endsParent: !0,
								relevance: 0
							},
							{
								begin: /(?=[^\n])\s/,
								relevance: 0
							}
						]
					}]
				}),
				e.C_BLOCK_COMMENT_MODE,
				e.C_LINE_COMMENT_MODE
			]
		}, te = [
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			x,
			S,
			ee,
			C,
			{ match: /\$\d+/ },
			y
		];
		b.contains = te.concat({
			begin: /\{/,
			end: /\}/,
			keywords: h,
			contains: ["self"].concat(te)
		});
		let ne = [].concat(w, b.contains), re = ne.concat([{
			begin: /(\s*)\(/,
			end: /\)/,
			keywords: h,
			contains: ["self"].concat(ne)
		}]), ie = {
			className: "params",
			begin: /(\s*)\(/,
			end: /\)/,
			excludeBegin: !0,
			excludeEnd: !0,
			keywords: h,
			contains: re
		}, T = { variants: [{
			match: [
				/class/,
				/\s+/,
				d,
				/\s+/,
				/extends/,
				/\s+/,
				t.concat(d, "(", t.concat(/\./, d), ")*")
			],
			scope: {
				1: "keyword",
				3: "title.class",
				5: "keyword",
				7: "title.class.inherited"
			}
		}, {
			match: [
				/class/,
				/\s+/,
				d
			],
			scope: {
				1: "keyword",
				3: "title.class"
			}
		}] }, ae = {
			relevance: 0,
			match: t.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
			className: "title.class",
			keywords: { _: [...a, ...o] }
		}, E = {
			label: "use_strict",
			className: "meta",
			relevance: 10,
			begin: /^\s*['"]use (strict|asm)['"]/
		}, oe = {
			variants: [{ match: [
				/function/,
				/\s+/,
				d,
				/(?=\s*\()/
			] }, { match: [/function/, /\s*(?=\()/] }],
			className: {
				1: "keyword",
				3: "title.function"
			},
			label: "func.def",
			contains: [ie],
			illegal: /%/
		}, D = {
			relevance: 0,
			match: /\b[A-Z][A-Z_0-9]+\b/,
			className: "variable.constant"
		};
		function se(e) {
			return t.concat("(?!", e.join("|"), ")");
		}
		let ce = {
			match: t.concat(/\b/, se([
				...s,
				"super",
				"import",
				"await"
			].map((e) => `${e}\\s*\\(`)), d, t.lookahead(/\s*\(/)),
			className: "title.function",
			relevance: 0
		}, le = {
			begin: t.concat(/\./, t.lookahead(t.concat(d, /(?![0-9A-Za-z$_(])/))),
			end: d,
			excludeBegin: !0,
			keywords: "prototype",
			className: "property",
			relevance: 0
		}, ue = {
			match: [
				/get|set/,
				/\s+/,
				d,
				/(?=\()/
			],
			className: {
				1: "keyword",
				3: "title.function"
			},
			contains: [{ begin: /\(\)/ }, ie]
		}, de = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", fe = {
			match: [
				/const|var|let/,
				/\s+/,
				d,
				/\s*/,
				/=\s*/,
				/(async\s*)?/,
				t.lookahead(de)
			],
			keywords: "async",
			className: {
				1: "keyword",
				3: "title.function"
			},
			contains: [ie]
		};
		return {
			name: "JavaScript",
			aliases: [
				"js",
				"jsx",
				"mjs",
				"cjs"
			],
			keywords: h,
			exports: {
				PARAMS_CONTAINS: re,
				CLASS_REFERENCE: ae
			},
			illegal: /#(?![$_A-Za-z])/,
			contains: [
				e.SHEBANG({
					label: "shebang",
					binary: "node",
					relevance: 5
				}),
				E,
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE,
				x,
				S,
				ee,
				C,
				w,
				{ match: /\$\d+/ },
				y,
				ae,
				{
					scope: "attr",
					match: d + t.lookahead(":"),
					relevance: 0
				},
				fe,
				{
					begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
					keywords: "return throw case",
					relevance: 0,
					contains: [
						w,
						e.REGEXP_MODE,
						{
							className: "function",
							begin: de,
							returnBegin: !0,
							end: "\\s*=>",
							contains: [{
								className: "params",
								variants: [
									{
										begin: e.UNDERSCORE_IDENT_RE,
										relevance: 0
									},
									{
										className: null,
										begin: /\(\s*\)/,
										skip: !0
									},
									{
										begin: /(\s*)\(/,
										end: /\)/,
										excludeBegin: !0,
										excludeEnd: !0,
										keywords: h,
										contains: re
									}
								]
							}]
						},
						{
							begin: /,/,
							relevance: 0
						},
						{
							match: /\s+/,
							relevance: 0
						},
						{
							variants: [
								{
									begin: f.begin,
									end: f.end
								},
								{ match: p },
								{
									begin: m.begin,
									"on:begin": m.isTrulyOpeningTag,
									end: m.end
								}
							],
							subLanguage: "xml",
							contains: [{
								begin: m.begin,
								end: m.end,
								skip: !0,
								contains: ["self"]
							}]
						}
					]
				},
				oe,
				{ beginKeywords: "while if switch catch for" },
				{
					begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
					returnBegin: !0,
					label: "func.def",
					contains: [ie, e.inherit(e.TITLE_MODE, {
						begin: d,
						className: "title.function"
					})]
				},
				{
					match: /\.\.\./,
					relevance: 0
				},
				le,
				{
					match: "\\$" + d,
					relevance: 0
				},
				{
					match: [/\bconstructor(?=\s*\()/],
					className: { 1: "title.function" },
					contains: [ie]
				},
				ce,
				D,
				T,
				ue,
				{ match: /\$[(.]/ }
			]
		};
	}
	function d(e) {
		let t = e.regex, a = u(e), o = n, s = [
			"any",
			"void",
			"number",
			"boolean",
			"string",
			"object",
			"never",
			"symbol",
			"bigint",
			"unknown"
		], d = {
			begin: [
				/namespace/,
				/\s+/,
				e.IDENT_RE
			],
			beginScope: {
				1: "keyword",
				3: "title.class"
			}
		}, f = {
			beginKeywords: "interface",
			end: /\{/,
			excludeEnd: !0,
			keywords: {
				keyword: "interface extends",
				built_in: s
			},
			contains: [a.exports.CLASS_REFERENCE]
		}, p = {
			className: "meta",
			relevance: 10,
			begin: /^\s*['"]use strict['"]/
		}, m = {
			$pattern: n,
			keyword: r.concat([
				"type",
				"interface",
				"public",
				"private",
				"protected",
				"implements",
				"declare",
				"abstract",
				"readonly",
				"enum",
				"override",
				"satisfies"
			]),
			literal: i,
			built_in: l.concat(s),
			"variable.language": c
		}, h = {
			className: "meta",
			begin: "@" + o
		}, g = (e, t, n) => {
			let r = e.contains.findIndex((e) => e.label === t);
			if (r === -1) throw Error("can not find mode to replace");
			e.contains.splice(r, 1, n);
		};
		Object.assign(a.keywords, m), a.exports.PARAMS_CONTAINS.push(h);
		let _ = a.contains.find((e) => e.scope === "attr"), v = Object.assign({}, _, { match: t.concat(o, t.lookahead(/\s*\?:/)) });
		a.exports.PARAMS_CONTAINS.push([
			a.exports.CLASS_REFERENCE,
			_,
			v
		]), a.contains = a.contains.concat([
			h,
			d,
			f,
			v
		]), g(a, "shebang", e.SHEBANG()), g(a, "use_strict", p);
		let y = a.contains.find((e) => e.label === "func.def");
		return y.relevance = 0, Object.assign(a, {
			name: "TypeScript",
			aliases: [
				"ts",
				"tsx",
				"mts",
				"cts"
			]
		}), a;
	}
	t.exports = d;
})), r_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = {
			className: "string",
			begin: /"(""|[^/n])"C\b/
		}, r = {
			className: "string",
			begin: /"/,
			end: /"/,
			illegal: /\n/,
			contains: [{ begin: /""/ }]
		}, i = /\d{1,2}\/\d{1,2}\/\d{4}/, a = /\d{4}-\d{1,2}-\d{1,2}/, o = /(\d|1[012])(:\d+){0,2} *(AM|PM)/, s = /\d{1,2}(:\d{1,2}){1,2}/, c = {
			className: "literal",
			variants: [
				{ begin: t.concat(/# */, t.either(a, i), / *#/) },
				{ begin: t.concat(/# */, s, / *#/) },
				{ begin: t.concat(/# */, o, / *#/) },
				{ begin: t.concat(/# */, t.either(a, i), / +/, t.either(o, s), / *#/) }
			]
		}, l = {
			className: "number",
			relevance: 0,
			variants: [
				{ begin: /\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/ },
				{ begin: /\b\d[\d_]*((U?[SIL])|[%&])?/ },
				{ begin: /&H[\dA-F_]+((U?[SIL])|[%&])?/ },
				{ begin: /&O[0-7_]+((U?[SIL])|[%&])?/ },
				{ begin: /&B[01_]+((U?[SIL])|[%&])?/ }
			]
		}, u = {
			className: "label",
			begin: /^\w+:/
		}, d = e.COMMENT(/'''/, /$/, { contains: [{
			className: "doctag",
			begin: /<\/?/,
			end: />/
		}] }), f = e.COMMENT(null, /$/, { variants: [{ begin: /'/ }, { begin: /([\t ]|^)REM(?=\s)/ }] });
		return {
			name: "Visual Basic .NET",
			aliases: ["vb"],
			case_insensitive: !0,
			classNameAliases: { label: "symbol" },
			keywords: {
				keyword: "addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",
				built_in: "addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort",
				type: "boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort",
				literal: "true false nothing"
			},
			illegal: "//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",
			contains: [
				n,
				r,
				c,
				l,
				u,
				d,
				f,
				{
					className: "meta",
					begin: /[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,
					end: /$/,
					keywords: { keyword: "const disable else elseif enable end externalsource if region then" },
					contains: [f]
				}
			]
		};
	}
	t.exports = n;
})), i_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		e.regex;
		let t = e.COMMENT(/\(;/, /;\)/);
		return t.contains.push("self"), {
			name: "WebAssembly",
			keywords: {
				$pattern: /[\w.]+/,
				keyword: /* @__PURE__ */ "anyfunc,block,br,br_if,br_table,call,call_indirect,data,drop,elem,else,end,export,func,global.get,global.set,local.get,local.set,local.tee,get_global,get_local,global,if,import,local,loop,memory,memory.grow,memory.size,module,mut,nop,offset,param,result,return,select,set_global,set_local,start,table,tee_local,then,type,unreachable".split(",")
			},
			contains: [
				e.COMMENT(/;;/, /$/),
				t,
				{
					match: [
						/(?:offset|align)/,
						/\s*/,
						/=/
					],
					className: {
						1: "keyword",
						3: "operator"
					}
				},
				{
					className: "variable",
					begin: /\$[\w_]+/
				},
				{
					match: /(\((?!;)|\))+/,
					className: "punctuation",
					relevance: 0
				},
				{
					begin: [
						/(?:func|call|call_indirect)/,
						/\s+/,
						/\$[^\s)]+/
					],
					className: {
						1: "keyword",
						3: "title.function"
					}
				},
				e.QUOTE_STRING_MODE,
				{
					match: /(i32|i64|f32|f64)(?!\.)/,
					className: "type"
				},
				{
					className: "keyword",
					match: /\b(f32|f64|i32|i64)(?:\.(?:abs|add|and|ceil|clz|const|convert_[su]\/i(?:32|64)|copysign|ctz|demote\/f64|div(?:_[su])?|eqz?|extend_[su]\/i32|floor|ge(?:_[su])?|gt(?:_[su])?|le(?:_[su])?|load(?:(?:8|16|32)_[su])?|lt(?:_[su])?|max|min|mul|nearest|neg?|or|popcnt|promote\/f32|reinterpret\/[fi](?:32|64)|rem_[su]|rot[lr]|shl|shr_[su]|store(?:8|16|32)?|sqrt|sub|trunc(?:_[su]\/f(?:32|64))?|wrap\/i64|xor))\b/
				},
				{
					className: "number",
					relevance: 0,
					match: /[+-]?\b(?:\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?|0x[\da-fA-F](?:_?[\da-fA-F])*(?:\.[\da-fA-F](?:_?[\da-fA-D])*)?(?:[pP][+-]?\d(?:_?\d)*)?)\b|\binf\b|\bnan(?::0x[\da-fA-F](?:_?[\da-fA-D])*)?\b/
				}
			]
		};
	}
	t.exports = n;
})), a_ = (/* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	var n = Sg();
	n.registerLanguage("xml", Cg()), n.registerLanguage("bash", wg()), n.registerLanguage("c", Tg()), n.registerLanguage("cpp", Eg()), n.registerLanguage("csharp", Dg()), n.registerLanguage("css", Og()), n.registerLanguage("markdown", kg()), n.registerLanguage("diff", Ag()), n.registerLanguage("ruby", jg()), n.registerLanguage("go", Mg()), n.registerLanguage("graphql", Ng()), n.registerLanguage("ini", Pg()), n.registerLanguage("java", Fg()), n.registerLanguage("javascript", Ig()), n.registerLanguage("json", Lg()), n.registerLanguage("kotlin", Rg()), n.registerLanguage("less", zg()), n.registerLanguage("lua", Bg()), n.registerLanguage("makefile", Vg()), n.registerLanguage("perl", Hg()), n.registerLanguage("objectivec", Ug()), n.registerLanguage("php", Wg()), n.registerLanguage("php-template", Gg()), n.registerLanguage("plaintext", Kg()), n.registerLanguage("python", qg()), n.registerLanguage("python-repl", Jg()), n.registerLanguage("r", Yg()), n.registerLanguage("rust", Xg()), n.registerLanguage("scss", Zg()), n.registerLanguage("shell", Qg()), n.registerLanguage("sql", $g()), n.registerLanguage("swift", e_()), n.registerLanguage("yaml", t_()), n.registerLanguage("typescript", n_()), n.registerLanguage("vbnet", r_()), n.registerLanguage("wasm", i_()), n.HighlightJS = n, n.default = n, t.exports = n;
})))())).default;
//#endregion
//#region node_modules/marked/lib/marked.esm.js
function o_() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var s_ = o_();
function c_(e) {
	s_ = e;
}
var l_ = { exec: () => null };
function u_(e) {
	let t = [];
	return (n) => {
		let r = Math.max(0, Math.min(3, n - 1)), i = t[r];
		return i || (i = e(r), t[r] = i), i;
	};
}
function $(e, t = "") {
	let n = typeof e == "string" ? e : e.source, r = {
		replace: (e, t) => {
			let i = typeof t == "string" ? t : t.source;
			return i = i.replace(f_.caret, "$1"), n = n.replace(e, i), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
var d_ = ((e = "") => {
	try {
		return !!RegExp("(?<=1)(?<!1)" + e);
	} catch {
		return !1;
	}
})(), f_ = {
	codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm,
	outputLinkReplace: /\\([\[\]])/g,
	indentCodeCompensation: /^(\s+)(?:```)/,
	beginningSpace: /^\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	endingSpaceTabChar: /[ \t]$/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\n/g,
	tabCharGlobal: /\t/g,
	leadingSpaceTab: /^[ \t]+/,
	multipleSpaceGlobal: /\s+/g,
	blankLine: /^[ \t]*$/,
	doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\[[ xX]\] +\S/,
	listReplaceTask: /^\[[ xX]\] +/,
	listTaskCheckbox: /\[[ xX]\]/,
	anyLine: /\n.*\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\||\| *$/g,
	tableRowBlankLine: /\n[ \t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
	endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
	unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
	numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	caret: /(^|[^\[])\^/g,
	percentDecode: /%25/g,
	findPipe: /\|/g,
	splitPipe: / \|/,
	slashPipe: /\\\|/g,
	carriageReturn: /\r\n|\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\S*/,
	endingNewline: /\n$/,
	listItemRegex: (e) => RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
	nextBulletRegex: u_((e) => RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),
	hrRegex: u_((e) => RegExp(`^ {0,${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),
	fencesBeginRegex: u_((e) => RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
	headingBeginRegex: u_((e) => RegExp(`^ {0,${e}}#`)),
	htmlBeginRegex: u_((e) => RegExp(`^ {0,${e}}(?:</?(?:${D_})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")),
	blockquoteBeginRegex: u_((e) => RegExp(`^ {0,${e}}>`))
}, p_ = /^(?:[ \t]*(?:\n|$))+/, m_ = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, h_ = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, g_ = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, __ = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, v_ = / {0,3}(?:[*+-]|\d{1,9}[.)])/, y_ = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, b_ = $(y_).replace(/bull/g, v_).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), x_ = $(y_).replace(/bull/g, v_).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), S_ = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, C_ = /^[^\n]+/, w_ = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, T_ = $(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", w_).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), E_ = $(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, v_).getRegex(), D_ = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", O_ = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, k_ = $("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", O_).replace("tag", D_).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), A_ = (e) => $(S_).replace("hr", g_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", e).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", D_).getRegex(), j_ = A_(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), M_ = A_(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), N_ = {
	blockquote: $(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", M_).getRegex(),
	code: m_,
	def: T_,
	fences: h_,
	heading: __,
	hr: g_,
	html: k_,
	lheading: b_,
	list: E_,
	newline: p_,
	paragraph: j_,
	table: l_,
	text: C_
}, P_ = $("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", g_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", D_).getRegex(), F_ = {
	...N_,
	lheading: x_,
	table: P_,
	paragraph: $(S_).replace("hr", g_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", P_).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", D_).getRegex()
}, I_ = {
	...N_,
	html: $("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", O_).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: l_,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: $(S_).replace("hr", g_).replace("heading", " *#{1,6} *[^\n]").replace("lheading", b_).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, L_ = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, R_ = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, z_ = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, B_ = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, V_ = /[\p{P}\p{S}]/u, H_ = /[\s\p{P}\p{S}]/u, U_ = /[^\s\p{P}\p{S}]/u, W_ = $(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, H_).getRegex(), G_ = /[\p{Pi}\p{Ps}"']/u, K_ = /(?!~)[\p{P}\p{S}]/u, q_ = /(?!~)[\s\p{P}\p{S}]/u, J_ = /(?:[^\s\p{P}\p{S}]|~)/u, Y_ = $(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", d_ ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), X_ = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, Z_ = $(X_, "u").replace(/punct/g, V_).getRegex(), Q_ = $(X_, "u").replace(/punct/g, K_).getRegex(), $_ = $(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, G_).replace(/punct/g, V_).getRegex(), ev = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", tv = $(ev, "gu").replace(/notPunctSpace/g, U_).replace(/punctSpace/g, H_).replace(/punct/g, V_).getRegex(), nv = $(ev, "gu").replace(/notPunctSpace/g, J_).replace(/punctSpace/g, q_).replace(/punct/g, K_).getRegex(), rv = $("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, U_).replace(/punctSpace/g, H_).replace(/punct/g, V_).getRegex(), iv = $("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, U_).replace(/punctSpace/g, H_).replace(/punct/g, V_).getRegex(), av = $("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, U_).replace(/punctSpace/g, H_).replace(/punct/g, V_).getRegex(), ov = $(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, V_).getRegex(), sv = $("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, U_).replace(/punctSpace/g, H_).replace(/punct/g, V_).getRegex(), cv = $(/\\(punct)/, "gu").replace(/punct/g, V_).getRegex(), lv = $(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), uv = $(O_).replace("(?:-->|$)", "-->").getRegex(), dv = $("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", uv).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), fv = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, pv = $(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", fv).getRegex(), mv = $(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", pv).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), hv = $(/^!?\[(label)\]\[(ref)\]/).replace("label", pv).replace("ref", w_).getRegex(), gv = $(/^!?\[(ref)\](?:\[\])?/).replace("ref", w_).getRegex(), _v = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, vv = $(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", fv).getRegex(), yv = $("reflink|nolink(?!\\()", "g").replace("reflink", $(/^!?\[(label)\]\[(ref)\]/).replace("label", vv).replace("ref", _v).getRegex()).replace("nolink", $(/^!?\[(ref)\](?:\[\])?/).replace("ref", _v).getRegex()).getRegex(), bv = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, xv = $(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), Sv = {
	_backpedal: l_,
	anyPunctuation: cv,
	autolink: lv,
	blockSkip: Y_,
	br: z_,
	code: R_,
	del: l_,
	delLDelim: l_,
	delRDelim: l_,
	emStrongLDelim: Z_,
	emStrongRDelimAst: tv,
	emStrongRDelimUnd: iv,
	escape: L_,
	link: mv,
	nolink: gv,
	punctuation: W_,
	reflink: hv,
	reflinkSearch: yv,
	tag: dv,
	text: B_,
	url: l_
}, Cv = {
	...Sv,
	emStrongLDelim: $_,
	emStrongRDelimAst: rv,
	emStrongRDelimUnd: av,
	link: $(/^!?\[(label)\]\((.*?)\)/).replace("label", pv).getRegex(),
	reflink: $(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", pv).getRegex()
}, wv = {
	...Sv,
	emStrongRDelimAst: nv,
	emStrongLDelim: Q_,
	delLDelim: ov,
	delRDelim: sv,
	url: $(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", xv).replace("protocol", bv).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: $(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", bv).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex()
}, Tv = {
	...wv,
	br: $(z_).replace("{2,}", "*").getRegex(),
	text: $(wv.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Ev = {
	normal: N_,
	gfm: F_,
	pedantic: I_
}, Dv = {
	normal: Sv,
	gfm: wv,
	breaks: Tv,
	pedantic: Cv
}, Ov = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, kv = (e) => Ov[e];
function Av(e, t) {
	if (t) {
		if (f_.escapeTest.test(e)) return e.replace(f_.escapeReplace, kv);
	} else if (f_.escapeTestNoEncode.test(e)) return e.replace(f_.escapeReplaceNoEncode, kv);
	return e;
}
function jv(e) {
	return e.replace(f_.numericCharacterReference, (e, t, n) => {
		let r = t === void 0 ? Number.parseInt(n, 16) : Number.parseInt(t, 10);
		return r === 0 || r > 1114111 || r >= 55296 && r <= 57343 ? "�" : String.fromCodePoint(r);
	});
}
function Mv(e) {
	try {
		e = encodeURI(e).replace(f_.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function Nv(e, t) {
	let n = e.replace(f_.findPipe, (e, t, n) => {
		let r = !1, i = t;
		for (; --i >= 0 && n[i] === "\\";) r = !r;
		return r ? "|" : " |";
	}).split(f_.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) {
		if (n.length > t) n.splice(t);
		else for (; n.length < t;) n.push("");
	}
	for (; r < n.length; r++) n[r] = n[r].trim().replace(f_.slashPipe, "|");
	return n;
}
function Pv(e, t, n) {
	let r = e.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let a = e.charAt(r - i - 1);
		if (a === t && !n) i++;
		else if (a !== t && n) i++;
		else break;
	}
	return e.slice(0, r - i);
}
function Fv(e) {
	let t = e.split("\n"), n = t.length - 1;
	for (; n >= 0 && f_.blankLine.test(t[n]);) n--;
	return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
}
function Iv(e) {
	return e.trim().toLowerCase().toUpperCase().toLowerCase();
}
function Lv(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function Rv(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function zv(e, t, n, r, i) {
	let a = t.href, o = t.title || null, s = e[1].replace(i.other.outputLinkReplace, "$1"), c = e[0].charAt(0) === "!";
	r.state.inLink = !0;
	let l = r.state.linkEmitted, u = r.state.inRawBlock;
	r.state.linkEmitted = !1;
	let d = r.inlineTokens(s), f = r.state.linkEmitted;
	if (r.state.linkEmitted = l, r.state.inLink = !1, !c) {
		if (f) {
			r.state.inRawBlock = u;
			return;
		}
		r.state.linkEmitted = !0;
	}
	return {
		type: c ? "image" : "link",
		raw: n,
		href: a,
		title: o,
		text: s,
		tokens: d
	};
}
function Bv(e, t, n) {
	let r = e.match(n.other.indentCodeCompensation);
	if (r === null) return t;
	let i = r[1];
	return t.split("\n").map((e) => {
		let t = e.match(n.other.beginningSpace);
		if (t === null) return e;
		let [r] = t;
		return e.slice(Math.min(r.length, i.length));
	}).join("\n");
}
function Vv(e, t, n, r) {
	if (!t.includes("<")) return !1;
	for (let i = 0; i < t.length; i++) {
		if (t[i] === "\\") {
			i++;
			continue;
		}
		if (t[i] === "`") {
			let e = r.inline.code.exec(t.slice(i));
			if (e) {
				i += e[0].length - 1;
				continue;
			}
		}
		if (t[i] !== "<") continue;
		let a = e.slice(n + i), o = r.inline.tag.exec(a) || r.inline.autolink.exec(a);
		if (o) {
			if (o[0].length > t.length - i) return !0;
			i += o[0].length - 1;
		}
	}
	return !1;
}
var Hv = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || s_;
	}
	space(e) {
		let t = this.rules.block.newline.exec(e);
		if (t && t[0].length > 0) return {
			type: "space",
			raw: t[0]
		};
	}
	code(e) {
		let t = this.rules.block.code.exec(e);
		if (t) {
			let e = this.options.pedantic ? t[0] : Fv(t[0]);
			return {
				type: "code",
				raw: e,
				codeBlockStyle: "indented",
				text: e.replace(this.rules.other.codeRemoveIndent, "")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let e = t[0], n = Bv(e, t[3] || "", this.rules);
			return {
				type: "code",
				raw: e,
				lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
				text: n
			};
		}
	}
	heading(e) {
		let t = this.rules.block.heading.exec(e);
		if (t) {
			let e = t[2].trim();
			if (this.rules.other.endingHash.test(e)) {
				let t = Pv(e, "#");
				(this.options.pedantic || !t || this.rules.other.endingSpaceTabChar.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: Pv(t[0], "\n"),
				depth: t[1].length,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	hr(e) {
		let t = this.rules.block.hr.exec(e);
		if (t) return {
			type: "hr",
			raw: Pv(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = Pv(t[0], "\n").split("\n"), n = "", r = "", i = [];
			for (; e.length > 0;) {
				let t = !1, a = [], o = 0;
				for (; o < e.length; o++) if (this.rules.other.blockquoteStart.test(e[o])) a.push(e[o]), t = !0;
				else if (!t) a.push(e[o]);
				else break;
				e = e.slice(o);
				let s = a.join("\n"), c = s.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
				n = n ? `${n}
${s}` : s, r = r ? `${r}
${c}` : c;
				let l = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = l, e.length === 0) break;
				let u = i.at(-1);
				if (u?.type === "code") break;
				if (u?.type === "blockquote") {
					let t = u, a = e.join("\n"), o = t.raw + "\n" + a.replace(this.rules.other.blockquoteSetextReplace2, ""), s = this.blockquote(o);
					i[i.length - 1] = s;
					let c = o.substring(s.raw.length).replace(/^\n/, ""), l = c ? c.split("\n").length : 0, d = l ? e.slice(0, -l) : e;
					d.length > 0 && (n = `${n}
${d.join("\n")}`), r = r.substring(0, r.length - t.text.length) + s.text;
					break;
				}
				if (u?.type === "list") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.list(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - u.raw.length) + o.raw, r = r.substring(0, r.length - t.raw.length) + o.raw, e = a.substring(i.at(-1).raw.length).split("\n");
					continue;
				}
			}
			return {
				type: "blockquote",
				raw: n,
				tokens: i,
				text: r
			};
		}
	}
	list(e) {
		let t = this.rules.block.list.exec(e);
		if (t) {
			let n = t[1].trim(), r = n.length > 1, i = {
				type: "list",
				raw: "",
				ordered: r,
				start: r ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
			let a = this.rules.other.listItemRegex(n), o = !1;
			for (; e;) {
				let n = !1, r = "", s = "";
				if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
				r = t[0], e = e.substring(r.length);
				let c = t[2].split("\n", 1)[0], l = t[1].length, u = this.options.pedantic ? Rv(c, l) : c.replace(this.rules.other.leadingSpaceTab, (e) => Rv(e, l)), d = e.split("\n", 1)[0], f = !u.trim(), p = 0;
				if (this.options.pedantic ? (p = 2, s = u.trimStart()) : f ? p = l + 1 : (p = u.search(this.rules.other.nonSpaceChar), p = p > 4 ? 1 : p, s = u.slice(p), p += l), f && this.rules.other.blankLine.test(d) && (r += d + "\n", e = e.substring(d.length + 1), n = !0), !n) {
					let t = this.rules.other.nextBulletRegex(p), n = this.rules.other.hrRegex(p), i = this.rules.other.fencesBeginRegex(p), a = this.rules.other.headingBeginRegex(p), o = this.rules.other.htmlBeginRegex(p), c = this.rules.other.blockquoteBeginRegex(p);
					for (; e;) {
						let l = e.split("\n", 1)[0], m;
						if (d = l, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), m = d) : m = d.replace(this.rules.other.leadingSpaceTab, (e) => e.replace(this.rules.other.tabCharGlobal, "    ")), i.test(d) || a.test(d) || o.test(d) || c.test(d) || t.test(d) || n.test(d)) break;
						if (m.search(this.rules.other.nonSpaceChar) >= p || !d.trim()) s += "\n" + m.slice(p);
						else {
							if (f || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || i.test(u) || a.test(u) || n.test(u)) break;
							s += "\n" + d;
						}
						f = !d.trim(), r += l + "\n", e = e.substring(l.length + 1), u = m.slice(p);
					}
				}
				i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(r) && (o = !0)), i.items.push({
					type: "list_item",
					raw: r,
					task: !!this.options.gfm && this.rules.other.listIsTask.test(s),
					loose: !1,
					text: s,
					tokens: []
				}), i.raw += r;
			}
			let s = i.items.at(-1);
			if (s) s.raw = s.raw.trimEnd(), s.text = s.text.trimEnd();
			else return;
			i.raw = i.raw.trimEnd();
			for (let e of i.items) if (this.lexer.state.top = !1, e.tokens = this.lexer.blockTokens(e.text, []), !i.loose) {
				let t = e.tokens.filter((e) => e.type === "space");
				i.loose = t.length > 0 && t.some((e) => this.rules.other.anyLine.test(e.raw));
			}
			for (let e of i.items) {
				let t = e.tokens[0];
				if (e.task && (t?.type === "text" || t?.type === "paragraph")) {
					e.text = e.text.replace(this.rules.other.listReplaceTask, ""), t.raw = t.raw.replace(this.rules.other.listReplaceTask, ""), t.text = t.text.replace(this.rules.other.listReplaceTask, "");
					for (let e = this.lexer.inlineQueue.length - 1; e >= 0; e--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)) {
						this.lexer.inlineQueue[e].src = this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask, "");
						break;
					}
					let n = this.rules.other.listTaskCheckbox.exec(e.raw);
					if (n) {
						let t = {
							type: "checkbox",
							raw: n[0] + " ",
							checked: n[0] !== "[ ]"
						};
						e.checked = t.checked, i.loose ? e.tokens[0] && ["paragraph", "text"].includes(e.tokens[0].type) && "tokens" in e.tokens[0] && e.tokens[0].tokens ? (e.tokens[0].raw = t.raw + e.tokens[0].raw, e.tokens[0].text = t.raw + e.tokens[0].text, e.tokens[0].tokens.unshift(t)) : e.tokens.unshift({
							type: "paragraph",
							raw: t.raw,
							text: t.raw,
							tokens: [t]
						}) : e.tokens.unshift(t);
					}
				} else e.task &&= !1;
			}
			if (i.loose) for (let e of i.items) {
				e.loose = !0;
				for (let t of e.tokens) t.type === "text" && (t.type = "paragraph");
			}
			return i;
		}
	}
	html(e) {
		let t = this.rules.block.html.exec(e);
		if (t) {
			let e = Fv(t[0]);
			return {
				type: "html",
				block: !0,
				raw: e,
				pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
				text: e
			};
		}
	}
	def(e) {
		let t = this.rules.block.def.exec(e);
		if (t) {
			let e = Iv(t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), n = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
			return {
				type: "def",
				tag: e,
				raw: Pv(t[0], "\n"),
				href: n,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = Nv(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
			type: "table",
			raw: Pv(t[0], "\n"),
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let e of r) this.rules.other.tableAlignRight.test(e) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(e) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(e) ? a.align.push("left") : a.align.push(null);
			for (let e = 0; e < n.length; e++) a.header.push({
				text: n[e],
				tokens: this.lexer.inline(n[e]),
				header: !0,
				align: a.align[e]
			});
			for (let e of i) a.rows.push(Nv(e, a.header.length).map((e, t) => ({
				text: e,
				tokens: this.lexer.inline(e),
				header: !1,
				align: a.align[t]
			})));
			return a;
		}
	}
	lheading(e) {
		let t = this.rules.block.lheading.exec(e);
		if (t) {
			let e = t[1].trim();
			return {
				type: "heading",
				raw: Pv(t[0], "\n"),
				depth: t[2].charAt(0) === "=" ? 1 : 2,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	paragraph(e) {
		let t = this.rules.block.paragraph.exec(e);
		if (t) {
			let e = t[1].charAt(t[1].length - 1) === "\n" ? t[1].slice(0, -1) : t[1];
			return {
				type: "paragraph",
				raw: t[0],
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	text(e) {
		let t = this.rules.block.text.exec(e);
		if (t) return {
			type: "text",
			raw: t[0],
			text: t[0],
			tokens: this.lexer.inline(t[0])
		};
	}
	escape(e) {
		let t = this.rules.inline.escape.exec(e);
		if (t) return {
			type: "escape",
			raw: t[0],
			text: t[1]
		};
	}
	tag(e) {
		let t = this.rules.inline.tag.exec(e);
		if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: t[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: t[0]
		};
	}
	link(e) {
		let t = this.rules.inline.link.exec(e);
		if (t) {
			let n = t[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && Vv(e, t[1], n, this.rules)) return;
			let r = t[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
				if (!this.rules.other.endAngleBracket.test(r)) return;
				let e = Pv(r.slice(0, -1), "\\");
				if ((r.length - e.length) % 2 == 0) return;
			} else {
				let e = Lv(t[2], "()");
				if (e === -2) return;
				if (e > -1) {
					let n = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + e;
					t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, n).trim(), t[3] = "";
				}
			}
			let i = t[2], a = "";
			if (this.options.pedantic) {
				let e = this.rules.other.pedanticHrefTitle.exec(i);
				e && (i = e[1], a = e[3]);
			} else a = t[3] ? t[3].slice(1, -1) : "";
			return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (i = this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i.slice(1) : i.slice(1, -1)), zv(t, {
				href: i && i.replace(this.rules.inline.anyPunctuation, "$1"),
				title: a && a.replace(this.rules.inline.anyPunctuation, "$1")
			}, t[0], this.lexer, this.rules);
		}
	}
	reflink(e, t) {
		let n;
		if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
			let r = n[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && Vv(e, n[1], r, this.rules)) return;
			let i = t[Iv((n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "))];
			if (!i) {
				let e = n[0].charAt(0);
				return {
					type: "text",
					raw: e,
					text: e
				};
			}
			return zv(n, i, n[0], this.lexer, this.rules);
		}
	}
	emStrong(e, t, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(e);
		if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))) {
			let i = [...r[0]].length - 1, a, o, s = i, c = 0, l = r[0][0], u = n === l, d = l === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (d.lastIndex = 0, t = t.slice(-1 * e.length + i); (r = d.exec(t)) !== null;) {
				if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
				if (o = [...a].length, r[3] || r[4]) {
					s += o;
					continue;
				}
				if (r[5] || r[6]) {
					if (i % 3 && !((i + o) % 3)) {
						c += o;
						continue;
					}
					if (u) break;
				}
				if (s -= o, s > 0) continue;
				o = Math.min(o, o + s + c);
				let t = [...r[0]][0].length, n = e.slice(0, i + r.index + t + o);
				if (Math.min(i, o) % 2) {
					let e = n.slice(1, -1);
					return {
						type: "em",
						raw: n,
						text: e,
						tokens: this.lexer.inlineTokens(e)
					};
				}
				let l = n.slice(2, -2);
				return {
					type: "strong",
					raw: n,
					text: l,
					tokens: this.lexer.inlineTokens(l)
				};
			}
		}
	}
	codespan(e) {
		let t = this.rules.inline.code.exec(e);
		if (t) {
			let e = t[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(e), r = this.rules.other.startingSpaceChar.test(e) && this.rules.other.endingSpaceChar.test(e);
			return n && r && (e = e.substring(1, e.length - 1)), {
				type: "codespan",
				raw: t[0],
				text: e
			};
		}
	}
	br(e) {
		let t = this.rules.inline.br.exec(e);
		if (t) return {
			type: "br",
			raw: t[0]
		};
	}
	del(e, t, n = "") {
		let r = this.rules.inline.delLDelim.exec(e);
		if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = this.rules.inline.delRDelim;
			for (s.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = s.exec(t)) !== null;) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (a = [...i].length, a !== n)) continue;
				if (r[3] || r[4]) {
					o += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o);
				let t = [...r[0]][0].length, s = e.slice(0, n + r.index + t + a), c = s.slice(n, -n);
				return {
					type: "del",
					raw: s,
					text: c,
					tokens: this.lexer.inlineTokens(c)
				};
			}
		}
	}
	autolink(e) {
		let t = this.rules.inline.autolink.exec(e);
		if (t) {
			let e, n;
			return t[2] === "@" ? (e = t[1], n = "mailto:" + e) : (e = t[1], n = e), {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	url(e) {
		let t;
		if (t = this.rules.inline.url.exec(e)) {
			let e, n;
			if (t[2] === "@") e = t[0], n = "mailto:" + e;
			else {
				let r;
				do
					r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
				while (r !== t[0]);
				e = t[0], n = t[1] === "www." ? "http://" + t[0] : t[0];
			}
			return {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	inlineText(e) {
		let t = this.rules.inline.text.exec(e);
		if (t) {
			let e = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: t[0],
				text: e ? t[0] : jv(t[0]),
				escaped: e
			};
		}
	}
}, Uv = class e {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || s_, this.options.tokenizer = this.options.tokenizer || new Hv(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			top: !0
		};
		let t = {
			other: f_,
			block: Ev.normal,
			inline: Dv.normal
		};
		this.options.pedantic ? (t.block = Ev.pedantic, t.inline = Dv.pedantic) : this.options.gfm && (t.block = Ev.gfm, t.inline = this.options.breaks ? Dv.breaks : Dv.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: Ev,
			inline: Dv
		};
	}
	static lex(t, n) {
		return new e(n).lex(t);
	}
	static lexInline(t, n) {
		return new e(n).inlineTokens(t);
	}
	lex(e) {
		e = e.replace(f_.carriageReturn, "\n"), this.blockTokens(e, this.tokens);
		for (let e = 0; e < this.inlineQueue.length; e++) {
			let t = this.inlineQueue[e];
			this.inlineTokens(t.src, t.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(f_.tabCharGlobal, "    ").replace(f_.spaceLine, ""));
		let r = 1 / 0;
		for (; e;) {
			if (e.length < r) r = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			let i;
			if (this.options.extensions?.block?.some((n) => (i = n.call({ lexer: this }, e, t)) ? (e = e.substring(i.raw.length), t.push(i), !0) : !1)) continue;
			if (i = this.tokenizer.space(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				i.raw.length === 1 && n !== void 0 ? n.raw += "\n" : t.push(i);
				continue;
			}
			if (i = this.tokenizer.code(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.text, this.inlineQueue.at(-1).src = n.text) : t.push(i);
				continue;
			}
			if (i = this.tokenizer.fences(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.heading(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.hr(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.blockquote(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.list(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.html(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.def(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.raw, this.inlineQueue.at(-1).src = n.text) : this.tokens.links[i.tag] || (this.tokens.links[i.tag] = {
					href: i.href,
					title: i.title
				}, t.push(i));
				continue;
			}
			if (i = this.tokenizer.table(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.lheading(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			let a = e;
			if (this.options.extensions?.startBlock) {
				let t = 1 / 0, n = e.slice(1), r;
				this.options.extensions.startBlock.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < 1 / 0 && t >= 0 && (a = e.substring(0, t + 1));
			}
			if (this.state.top && (i = this.tokenizer.paragraph(a))) {
				let r = t.at(-1);
				n && r?.type === "paragraph" ? (r.raw += (r.raw.endsWith("\n") ? "" : "\n") + i.raw, r.text += "\n" + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = r.text) : t.push(i), n = a.length !== e.length, e = e.substring(i.raw.length);
				continue;
			}
			if (i = this.tokenizer.text(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = n.text) : t.push(i);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return this.state.top = !0, t;
	}
	inline(e, t = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: t
		}), t;
	}
	linkInText(e) {
		if (!e.includes("[")) return !1;
		let t = this.tokenizer.rules.inline.link;
		for (let n of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (t.test(n[0]) && e.charAt(n.index - 1) !== "!") return !0;
		for (let t of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
			let e = t[0], n = e.lastIndexOf("[");
			if (e.charAt(0) !== "!" && Object.hasOwn(this.tokens.links, Iv(e.slice(n + 1, -1))) && !(n > 1 && this.linkInText(e.slice(1, n - 1)))) return !0;
		}
		return !1;
	}
	inlineTokens(e, t = []) {
		this.tokenizer.lexer = this;
		let n = e;
		if (this.tokens.links && e.includes("[")) {
			let e = this.tokenizer.rules.inline.reflinkSearch, t = (n) => {
				let r = n.lastIndexOf("[");
				if (!Object.hasOwn(this.tokens.links, Iv(n.slice(r + 1, -1)))) return n;
				if (r > 1 && n.charAt(0) !== "!") {
					let i = n.slice(1, r - 1);
					if (this.linkInText(i)) return "[" + i.replace(e, t) + "][" + "a".repeat(n.length - r - 2) + "]";
				}
				return "[" + "a".repeat(n.length - 2) + "]";
			};
			n = n.replace(e, t);
		}
		n = n.replace(this.tokenizer.rules.inline.anyPunctuation, (e) => "+".repeat(e.length)), n = n.replace(this.tokenizer.rules.inline.blockSkip, (e, t, n) => {
			let r = n ? n.length : 0;
			return e.slice(0, r) + "[" + "a".repeat(e.length - r - 2) + "]";
		}), n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
		let r = !1, i = "", a = 1 / 0;
		for (; e;) {
			if (e.length < a) a = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			r || (i = ""), r = !1;
			let o;
			if (this.options.extensions?.inline?.some((n) => (o = n.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1)) continue;
			if (o = this.tokenizer.escape(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.tag(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.link(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(o.raw.length);
				let n = t.at(-1);
				o.type === "text" && n?.type === "text" ? (n.raw += o.raw, n.text += o.text) : t.push(o);
				continue;
			}
			if (o = this.tokenizer.emStrong(e, n, i)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.codespan(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.br(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.del(e, n, i)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.autolink(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (!this.state.inLink && (o = this.tokenizer.url(e))) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			let s = e;
			if (this.options.extensions?.startInline) {
				let t = 1 / 0, n = e.slice(1), r;
				this.options.extensions.startInline.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < 1 / 0 && t >= 0 && (s = e.substring(0, t + 1));
			}
			if (o = this.tokenizer.inlineText(s)) {
				e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (i = o.raw.slice(-1)), r = !0;
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += o.raw, n.text += o.text) : t.push(o);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return t;
	}
	infiniteLoopError(e) {
		let t = "Infinite loop on byte: " + e;
		if (this.options.silent) console.error(t);
		else throw Error(t);
	}
}, Wv = class {
	options;
	parser;
	constructor(e) {
		this.options = e || s_;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(f_.notSpaceStart)?.[0], i = e ? e.replace(f_.endingNewline, "") + "\n" : "";
		return r ? "<pre><code class=\"language-" + Av(r) + "\">" + (n ? i : Av(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : Av(i, !0)) + "</code></pre>\n";
	}
	blockquote({ tokens: e }) {
		return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
	}
	html({ text: e }) {
		return e;
	}
	def(e) {
		return "";
	}
	heading({ tokens: e, depth: t }) {
		return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
	}
	hr(e) {
		return "<hr>\n";
	}
	list(e) {
		let t = e.ordered, n = e.start, r = "";
		for (let t = 0; t < e.items.length; t++) {
			let n = e.items[t];
			r += this.listitem(n);
		}
		let i = t ? "ol" : "ul", a = t && n !== 1 ? " start=\"" + n + "\"" : "";
		return "<" + i + a + ">\n" + r + "</" + i + ">\n";
	}
	listitem(e) {
		return `<li>${this.parser.parse(e.tokens)}</li>
`;
	}
	checkbox({ checked: e }) {
		return "<input " + (e ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\"> ";
	}
	paragraph({ tokens: e }) {
		return `<p>${this.parser.parseInline(e)}</p>
`;
	}
	table(e) {
		let t = "", n = "";
		for (let t = 0; t < e.header.length; t++) n += this.tablecell(e.header[t]);
		t += this.tablerow({ text: n });
		let r = "";
		for (let t = 0; t < e.rows.length; t++) {
			let i = e.rows[t];
			n = "";
			for (let e = 0; e < i.length; e++) n += this.tablecell(i[e]);
			r += this.tablerow({ text: n });
		}
		return r &&= `<tbody>${r}</tbody>`, "<table>\n<thead>\n" + t + "</thead>\n" + r + "</table>\n";
	}
	tablerow({ text: e }) {
		return `<tr>
${e}</tr>
`;
	}
	tablecell(e) {
		let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
		return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
	}
	strong({ tokens: e }) {
		return `<strong>${this.parser.parseInline(e)}</strong>`;
	}
	em({ tokens: e }) {
		return `<em>${this.parser.parseInline(e)}</em>`;
	}
	codespan({ text: e }) {
		return `<code>${Av(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, text: n, tokens: r, autolink: i }) {
		let a = i ? Av(n, !0) : this.parser.parseInline(r), o = Mv(e);
		if (o === null) return a;
		e = Av(o, i);
		let s = "<a href=\"" + e + "\"";
		return t && (s += " title=\"" + Av(t) + "\""), s += ">" + a + "</a>", s;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = Mv(e);
		if (i === null) return Av(n);
		e = i;
		let a = `<img src="${Av(e)}" alt="${Av(n)}"`;
		return t && (a += ` title="${Av(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : Av(e.text);
	}
}, Gv = class {
	strong({ text: e }) {
		return e;
	}
	em({ text: e }) {
		return e;
	}
	codespan({ text: e }) {
		return e;
	}
	del({ text: e }) {
		return e;
	}
	html({ text: e }) {
		return e;
	}
	text({ text: e }) {
		return e;
	}
	link({ text: e }) {
		return "" + e;
	}
	image({ text: e }) {
		return "" + e;
	}
	br() {
		return "";
	}
	checkbox({ raw: e }) {
		return e;
	}
}, Kv = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || s_, this.options.renderer = this.options.renderer || new Wv(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Gv();
	}
	static parse(t, n) {
		return new e(n).parse(t);
	}
	static parseInline(t, n) {
		return new e(n).parseInline(t);
	}
	parse(e) {
		this.renderer.parser = this;
		let t = "";
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (this.options.extensions?.renderers?.[r.type]) {
				let e = r, n = this.options.extensions.renderers[e.type].call({ parser: this }, e);
				if (n !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"checkbox",
					"html",
					"def",
					"paragraph",
					"text"
				].includes(e.type)) {
					t += n || "";
					continue;
				}
			}
			let i = r;
			switch (i.type) {
				case "space":
					t += this.renderer.space(i);
					break;
				case "hr":
					t += this.renderer.hr(i);
					break;
				case "heading":
					t += this.renderer.heading(i);
					break;
				case "code":
					t += this.renderer.code(i);
					break;
				case "table":
					t += this.renderer.table(i);
					break;
				case "blockquote":
					t += this.renderer.blockquote(i);
					break;
				case "list":
					t += this.renderer.list(i);
					break;
				case "checkbox":
					t += this.renderer.checkbox(i);
					break;
				case "html":
					t += this.renderer.html(i);
					break;
				case "def":
					t += this.renderer.def(i);
					break;
				case "paragraph":
					t += this.renderer.paragraph(i);
					break;
				case "text":
					t += this.renderer.text(i);
					break;
				default: {
					let e = "Token with \"" + i.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return t;
	}
	parseInline(e, t = this.renderer) {
		this.renderer.parser = this;
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let e = this.options.extensions.renderers[i.type].call({ parser: this }, i);
				if (e !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"checkbox",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(i.type)) {
					n += e || "";
					continue;
				}
			}
			let a = i;
			switch (a.type) {
				case "escape":
					n += t.text(a);
					break;
				case "html":
					n += t.html(a);
					break;
				case "link":
					n += t.link(a);
					break;
				case "image":
					n += t.image(a);
					break;
				case "checkbox":
					n += t.checkbox(a);
					break;
				case "strong":
					n += t.strong(a);
					break;
				case "em":
					n += t.em(a);
					break;
				case "codespan":
					n += t.codespan(a);
					break;
				case "br":
					n += t.br(a);
					break;
				case "del":
					n += t.del(a);
					break;
				case "text":
					n += t.text(a);
					break;
				default: {
					let e = "Token with \"" + a.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return n;
	}
}, qv = class {
	options;
	block;
	constructor(e) {
		this.options = e || s_;
	}
	static passThroughHooks = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens",
		"emStrongMask"
	]);
	static passThroughHooksRespectAsync = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	preprocess(e) {
		return e;
	}
	postprocess(e) {
		return e;
	}
	processAllTokens(e) {
		return e;
	}
	emStrongMask(e) {
		return e;
	}
	provideLexer(e = this.block) {
		return e ? Uv.lex : Uv.lexInline;
	}
	provideParser(e = this.block) {
		return e ? Kv.parse : Kv.parseInline;
	}
}, Jv = new class {
	defaults = o_();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = Kv;
	Renderer = Wv;
	TextRenderer = Gv;
	Lexer = Uv;
	Tokenizer = Hv;
	Hooks = qv;
	constructor(...e) {
		this.use(...e);
	}
	walkTokens(e, t) {
		let n = [];
		for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
			case "table": {
				let e = r;
				for (let r of e.header) n = n.concat(this.walkTokens(r.tokens, t));
				for (let r of e.rows) for (let e of r) n = n.concat(this.walkTokens(e.tokens, t));
				break;
			}
			case "list": {
				let e = r;
				n = n.concat(this.walkTokens(e.items, t));
				break;
			}
			default: {
				let e = r;
				this.defaults.extensions?.childTokens?.[e.type] ? this.defaults.extensions.childTokens[e.type].forEach((r) => {
					let i = e[r].flat(1 / 0);
					n = n.concat(this.walkTokens(i, t));
				}) : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)));
			}
		}
		return n;
	}
	use(...e) {
		let t = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return e.forEach((e) => {
			let n = { ...e };
			if (n.async = this.defaults.async || n.async || !1, e.extensions && (e.extensions.forEach((e) => {
				if (!e.name) throw Error("extension name required");
				if ("renderer" in e) {
					let n = t.renderers[e.name];
					n ? t.renderers[e.name] = function(...t) {
						let r = e.renderer.apply(this, t);
						return r === !1 && (r = n.apply(this, t)), r;
					} : t.renderers[e.name] = e.renderer;
				}
				if ("tokenizer" in e) {
					if (!e.level || e.level !== "block" && e.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
					let n = t[e.level];
					n ? n.unshift(e.tokenizer) : t[e.level] = [e.tokenizer], e.start && (e.level === "block" ? t.startBlock ? t.startBlock.push(e.start) : t.startBlock = [e.start] : e.level === "inline" && (t.startInline ? t.startInline.push(e.start) : t.startInline = [e.start]));
				}
				"childTokens" in e && e.childTokens && (t.childTokens[e.name] = e.childTokens);
			}), n.extensions = t), e.renderer) {
				let t = this.defaults.renderer || new Wv(this.defaults);
				for (let n in e.renderer) {
					if (!(n in t)) throw Error(`renderer '${n}' does not exist`);
					if (["options", "parser"].includes(n)) continue;
					let r = n, i = e.renderer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n || "";
					};
				}
				n.renderer = t;
			}
			if (e.tokenizer) {
				let t = this.defaults.tokenizer || new Hv(this.defaults);
				for (let n in e.tokenizer) {
					if (!(n in t)) throw Error(`tokenizer '${n}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(n)) continue;
					let r = n, i = e.tokenizer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.tokenizer = t;
			}
			if (e.hooks) {
				let t = this.defaults.hooks || new qv();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					t[r] = qv.passThroughHooks.has(n) ? (e) => {
						if (this.defaults.async && qv.passThroughHooksRespectAsync.has(n)) return (async () => {
							let n = await i.call(t, e);
							return a.call(t, n);
						})();
						let r = i.call(t, e);
						return a.call(t, r);
					} : (...e) => {
						if (this.defaults.async) return (async () => {
							let n = await i.apply(t, e);
							return n === !1 && (n = await a.apply(t, e)), n;
						})();
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.hooks = t;
			}
			if (e.walkTokens) {
				let t = this.defaults.walkTokens, r = e.walkTokens;
				n.walkTokens = function(e) {
					let n = [];
					return n.push(r.call(this, e)), t && (n = n.concat(t.call(this, e))), n;
				};
			}
			this.defaults = {
				...this.defaults,
				...n
			};
		}), this;
	}
	setOptions(e) {
		return this.defaults = {
			...this.defaults,
			...e
		}, this;
	}
	lexer(e, t) {
		return Uv.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return Kv.parse(e, t ?? this.defaults);
	}
	parseMarkdown(e) {
		return (t, n) => {
			let r = { ...n }, i = {
				...this.defaults,
				...r
			}, a = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return a(/* @__PURE__ */ Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof t > "u" || t === null) return a(/* @__PURE__ */ Error("marked(): input parameter is undefined or null"));
			if (typeof t != "string") return a(/* @__PURE__ */ Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer(e) : e ? Uv.lex : Uv.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser(e) : e ? Kv.parse : Kv.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer(e) : e ? Uv.lex : Uv.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser(e) : e ? Kv.parse : Kv.parseInline)(n, i);
				return i.hooks && (r = i.hooks.postprocess(r)), r;
			} catch (e) {
				return a(e);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + Av(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}();
function Yv(e, t) {
	return Jv.parse(e, t);
}
Yv.options = Yv.setOptions = function(e) {
	return Jv.setOptions(e), Yv.defaults = Jv.defaults, c_(Yv.defaults), Yv;
}, Yv.getDefaults = o_, Yv.defaults = s_;
function Xv(...e) {
	return Jv.use(...e), Yv.defaults = Jv.defaults, c_(Yv.defaults), Yv;
}
Yv.use = Xv, Yv.walkTokens = function(e, t) {
	return Jv.walkTokens(e, t);
}, Yv.parseInline = Jv.parseInline, Yv.Parser = Kv, Yv.parser = Kv.parse, Yv.Renderer = Wv, Yv.TextRenderer = Gv, Yv.Lexer = Uv, Yv.lexer = Uv.lex, Yv.Tokenizer = Hv, Yv.Hooks = qv, Yv.parse = Yv, Yv.options, Yv.setOptions, Yv.walkTokens, Yv.parseInline, Kv.parse, Uv.lex;
//#endregion
//#region src/lib/markup.ts
var Zv = globalThis.trustedTypes?.createPolicy("highlight", { createHTML: (e) => e });
function Qv(e) {
	return !!(e && a_.getLanguage(e));
}
function $v(e, t, n) {
	if (Qv(n)) {
		let { value: r } = a_.highlight(t, {
			language: n,
			ignoreIllegals: !0
		});
		e.innerHTML = Zv?.createHTML(r) ?? r;
	} else e.textContent = t;
}
function ey(e, t) {
	return (n) => {
		$v(n, e, t);
	};
}
var ty = [
	"p",
	"br",
	"strong",
	"em",
	"del",
	"code",
	"pre",
	"ul",
	"ol",
	"li",
	"blockquote",
	"hr",
	"a",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"table",
	"thead",
	"tbody",
	"tr",
	"th",
	"td"
], ny = [
	"href",
	"title",
	"class",
	"align",
	"start"
], ry = /^language-[\w+-]+$/, iy = /^(?:https?|mailto):/i, ay = !1;
function oy() {
	return xg.isSupported ? ay ? !0 : (xg.addHook("uponSanitizeElement", (e) => {
		e instanceof HTMLInputElement && e.getAttribute("type") === "checkbox" && e.replaceWith(document.createTextNode(e.hasAttribute("checked") ? "☑" : "☐"));
	}), xg.addHook("afterSanitizeAttributes", (e) => {
		let t = e.getAttribute("class");
		t !== null && !(e.tagName === "CODE" && ry.test(t)) && e.removeAttribute("class"), e.tagName === "A" && (e.setAttribute("target", "_blank"), e.setAttribute("rel", "noopener noreferrer"));
	}), ay = !0, !0) : !1;
}
function sy() {
	return oy();
}
function cy(e, t) {
	if (!oy()) return null;
	let n = document.createElement("div");
	n.innerHTML = xg.sanitize(Yv.parse(e, {
		gfm: !0,
		breaks: t,
		async: !1
	}), {
		ALLOWED_TAGS: ty,
		ALLOWED_ATTR: ny,
		ALLOWED_URI_REGEXP: iy,
		RETURN_TRUSTED_TYPE: !0
	});
	for (let e of n.querySelectorAll("pre > code")) {
		let t = e.className.match(/\blanguage-([\w+-]+)/)?.[1], n = document.createElement("code");
		n.className = "hljs", $v(n, e.textContent ?? "", gm(t));
		let r = document.createElement("pre");
		r.className = "code", r.append(n), e.parentElement?.replaceWith(r);
	}
	return [...n.childNodes];
}
function ly(e, t = !1) {
	return (n) => {
		n.replaceChildren(...cy(e, t) ?? []);
	};
}
//#endregion
//#region src/components/Code.svelte
var uy = /* @__PURE__ */ U([["code", { class: "hljs" }]]), dy = /* @__PURE__ */ U([[
	"pre",
	{ class: "code" },
	,
]]);
function fy(e, t) {
	j(t, !0);
	let n = (e) => {
		var n = uy();
		gi(n, () => ey(t.code, r())), G(e, n);
	}, r = $i(t, "language", 3, null), i = $i(t, "inline", 3, !1);
	var a = W(), o = R(a), s = (e) => {
		n(e);
	}, c = (e) => {
		var t = dy(), r = L(t);
		n(r), A(t), G(e, t);
	};
	q(o, (e) => {
		i() ? e(s) : e(c, -1);
	}), G(e, a), M();
}
//#endregion
//#region src/components/Markdown.svelte
var py = /* @__PURE__ */ U([["div", { class: "chat-markdown" }]]), my = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-markdown chat-text" },
	" "
]]);
function hy(e, t) {
	j(t, !0);
	let n = $i(t, "breaks", 3, !1);
	var r = W(), i = R(r), a = (e) => {
		var r = py();
		gi(r, () => ly(t.text, n())), G(e, r);
	}, o = /* @__PURE__ */ N(() => sy()), s = (e) => {
		var n = my(), r = z(n, !0);
		V(() => K(r, t.text)), G(e, n);
	};
	q(i, (e) => {
		H(o) ? e(a) : e(s, -1);
	}), G(e, r), M();
}
//#endregion
//#region src/components/ChatMessage.svelte
var gy = /* @__PURE__ */ U([
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	]
], 1), _y = /* @__PURE__ */ U([
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	]
], 1), vy = /* @__PURE__ */ U([[
	"details",
	{ class: "chat-entry chat-thinking" },
	[
		"summary",
		null,
		[
			"span",
			{ class: "chat-head" },
			,
		]
	],
	" ",
	[
		"div",
		{ class: "chat-text" },
		" "
	]
]]), yy = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-command" },
	[
		"code",
		null,
		" "
	]
]]), by = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-text" },
	" "
]]), xy = /* @__PURE__ */ U([[
	"div",
	null,
	[
		"div",
		{ class: "chat-head" },
		,
	],
	" ",
	,
]]);
function Sy(e, t) {
	j(t, !0);
	let n = (e) => {
		var n = W(), r = R(n), a = (e) => {
			var n = gy(), r = R(n), a = z(r, !0), o = B(r, 2), s = z(o, !0), c = z(B(o, 2), !0);
			V((e, t) => {
				K(a, e), K(s, H(i)), K(c, t);
			}, [() => om(t.entry.kind), () => Ia(t.entry.timestamp)]), G(e, n);
		}, o = (e) => {
			var n = _y(), r = R(n), i = z(r, !0), a = z(B(r, 2), !0);
			V((e, t) => {
				K(i, e), K(a, t);
			}, [() => om(t.entry.kind), () => Ia(t.entry.timestamp)]), G(e, n);
		};
		q(r, (e) => {
			H(i) ? e(a) : e(o, -1);
		}), G(e, n);
	}, r = /* @__PURE__ */ N(() => t.entry.text ?? ""), i = /* @__PURE__ */ N(() => sm(t.entry)), a = /* @__PURE__ */ N(() => t.entry.kind === "prompt" ? dm(H(r)) : null);
	var o = W(), s = R(o), c = (e) => {
		var t = vy(), i = L(t), a = L(i), o = L(a);
		n(o), A(a), A(i);
		var s = z(B(i, 2), !0);
		A(t), V(() => K(s, H(r))), G(e, t);
	}, l = (e) => {
		var i = xy(), o = L(i), s = L(o);
		n(s), A(o);
		var c = B(o, 2), l = (e) => {
			var t = yy(), n = z(L(t), !0);
			A(t), V(() => K(n, H(a).text)), G(e, t);
		}, u = (e) => {
			fy(e, {
				get code() {
					return H(a).code;
				},
				language: "json"
			});
		}, d = (e) => {
			hy(e, {
				get text() {
					return H(a).text;
				},
				breaks: !0
			});
		}, f = (e) => {
			hy(e, { get text() {
				return H(r);
			} });
		}, p = (e) => {
			var t = by(), n = z(t, !0);
			V(() => K(n, H(r))), G(e, t);
		};
		q(c, (e) => {
			H(a)?.kind === "command" ? e(l) : H(a)?.kind === "json" ? e(u, 1) : H(a) ? e(d, 2) : t.entry.kind === "text" ? e(f, 3) : e(p, -1);
		}), A(i), V(() => Ti(i, 1, `chat-entry ${t.entry.kind === "prompt" ? "chat-user" : "chat-assistant"}`)), G(e, i);
	};
	q(s, (e) => {
		t.entry.kind === "thinking" ? e(c) : e(l, -1);
	}), G(e, o), M();
}
//#endregion
//#region src/components/ChatToolCall.svelte
var Cy = (e, t = b) => {
	var n = W(), r = R(n), i = (e) => {
		var n = Ey();
		J(n, 20, t, (e) => e, (e, t, n, r) => {
			var i = Ty(), a = R(i), o = z(a, !0), s = B(a, 2), c = L(s), l = (e) => {
				fy(e, {
					get code() {
						return t.value;
					},
					language: "json",
					get inline() {
						return t.inline;
					}
				});
			}, u = (e) => {
				var n = wy(), r = z(n, !0);
				V(() => K(r, t.value)), G(e, n);
			}, d = (e) => {
				var n = Jr();
				V(() => K(n, t.value)), G(e, n);
			};
			q(c, (e) => {
				t.shape === "json" ? e(l) : t.shape === "block" ? e(u, 1) : e(d, -1);
			}), A(s), V(() => K(o, t.label)), G(e, i);
		}), A(n), G(e, n);
	};
	q(r, (e) => {
		t().length > 0 && e(i);
	}), G(e, n);
}, wy = /* @__PURE__ */ U([[
	"pre",
	{ class: "code" },
	" "
]]), Ty = /* @__PURE__ */ U([
	[
		"dt",
		null,
		" "
	],
	" ",
	[
		"dd",
		null,
		,
	]
], 1), Ey = /* @__PURE__ */ U([["dl", { class: "tool-fields" }]]), Dy = /* @__PURE__ */ U([[
	"div",
	{ class: "tool-description" },
	" "
]]), Oy = /* @__PURE__ */ U([
	,
	,
	" ",
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), ky = /* @__PURE__ */ U([
	[
		"div",
		{ class: "tool-description" },
		" "
	],
	" ",
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), Ay = /* @__PURE__ */ U([
	[
		"div",
		{ class: "tool-description" },
		" "
	],
	" ",
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), jy = /* @__PURE__ */ U([[
	"div",
	{ class: "label" },
	" "
]]), My = /* @__PURE__ */ U([[
	"pre",
	{ class: "code" },
	" "
]]), Ny = /* @__PURE__ */ U([
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), Py = /* @__PURE__ */ U([[
	"details",
	{ class: "chat-tool" },
	[
		"summary",
		null,
		[
			"strong",
			null,
			" "
		],
		" ",
		[
			"span",
			{ class: "muted" },
			" "
		]
	],
	" ",
	[
		"div",
		null,
		,
		" ",
		,
	],
	" ",
	,
]]);
function Fy(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => `${vm(t.entry) ? ` ${vm(t.entry)}` : ""}${ym(t.entry)}`), r = /* @__PURE__ */ N(() => Sm(t.entry)), i = /* @__PURE__ */ N(() => t.entry.result === null ? null : Cm(t.entry));
	var a = Py(), o = L(a), s = L(o), c = z(s, !0), l = B(s), u = z(B(l), !0);
	A(o);
	var d = B(o, 2), f = L(d), p = (e) => {
		var t = Oy(), n = R(t), i = (e) => {
			var t = Dy(), n = z(t, !0);
			V(() => K(n, H(r).description)), G(e, t);
		};
		q(n, (e) => {
			H(r).description && e(i);
		});
		var a = B(n, 2), o = z(a, !0);
		fy(B(a, 2), {
			get code() {
				return H(r).command;
			},
			language: "bash"
		}), V(() => K(o, H(r).label)), G(e, t);
	}, m = (e) => {
		var t = ky(), n = R(t), i = z(n, !0), a = B(n, 2), o = z(a, !0);
		fy(B(a, 2), {
			get code() {
				return H(r).diff;
			},
			language: "diff"
		}), V(() => {
			K(i, H(r).path), K(o, H(r).label);
		}), G(e, t);
	}, h = (e) => {
		var t = Ay(), n = R(t), i = z(n, !0), a = B(n, 2), o = z(a, !0);
		fy(B(a, 2), {
			get code() {
				return H(r).content;
			},
			get language() {
				return H(r).language;
			}
		}), V(() => {
			K(i, H(r).path), K(o, H(r).label);
		}), G(e, t);
	}, g = (e) => {
		var t = jy(), n = z(t, !0);
		V(() => K(n, H(r).label)), G(e, t);
	};
	q(f, (e) => {
		H(r).kind === "bash" ? e(p) : H(r).kind === "edit" ? e(m, 1) : H(r).kind === "write" ? e(h, 2) : e(g, -1);
	}), Cy(B(f, 2), () => H(r).rest), A(d);
	var _ = B(d, 2), v = (e) => {
		var n = Ny(), r = R(n), a = z(r, !0), o = B(r, 2), s = (e) => {
			fy(e, {
				get code() {
					return H(i).code;
				},
				get language() {
					return H(i).language;
				}
			});
		}, c = (e) => {
			var t = My(), n = z(t, !0);
			V(() => K(n, H(i).text)), G(e, t);
		};
		q(o, (e) => {
			H(i).kind === "code" ? e(s) : e(c, -1);
		}), V((e) => K(a, e), [() => wm(t.entry)]), G(e, n);
	};
	q(_, (e) => {
		H(i) && e(v);
	}), A(a), V((e) => {
		K(c, t.entry.tool), K(l, `${H(n) ?? ""} `), K(u, e);
	}, [() => Ia(t.entry.timestamp)]), G(e, a), M();
}
//#endregion
//#region src/components/ChatUsage.svelte
var Iy = /* @__PURE__ */ U([" ", [
	"span",
	{ role: "note" },
	" "
]], 1), Ly = /* @__PURE__ */ U([" ", [
	"span",
	{
		class: "rebuild-chip",
		role: "note"
	},
	" "
]], 1), Ry = /* @__PURE__ */ U([[
	"div",
	{ role: "note" },
	[
		"strong",
		null,
		" "
	],
	" "
]]), zy = /* @__PURE__ */ U([
	[
		"div",
		null,
		[
			"strong",
			null,
			" "
		],
		[
			"span",
			null,
			" "
		],
		,
		,
	],
	" ",
	,
], 1);
function By(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => t.hint && Im(t.hint) ? Rm(t.hint) : null), r = /* @__PURE__ */ N(() => t.usage.rebuild ? zm(t.usage.rebuild) : null), i = /* @__PURE__ */ N(() => Bm(t.hint));
	var a = zy(), o = R(a), s = L(o), c = z(s, !0), l = B(s), u = z(l, !0), d = B(l), f = (e) => {
		var t = Iy(), r = R(t, !0);
		r.nodeValue = " ";
		var i = B(r), a = z(i, !0);
		V(() => {
			Ti(i, 1, yi(["compact-chip", H(n).tone])), K(a, H(n).text);
		}), G(e, t);
	};
	q(d, (e) => {
		H(n) && e(f);
	});
	var p = B(d), m = (e) => {
		var t = Ly(), n = R(t, !0);
		n.nodeValue = " ";
		var i = B(n), a = z(i, !0);
		V(() => {
			Y(i, "title", H(r).title), K(a, H(r).text);
		}), G(e, t);
	};
	q(p, (e) => {
		H(r) && e(m);
	}), A(o);
	var h = B(o, 2), g = (e) => {
		var t = Ry(), n = L(t), r = z(n, !0), a = B(n);
		A(t), V(() => {
			Ti(t, 1, yi(["compact-hint", H(i).tone])), K(r, H(i).label), K(a, ` ${H(i).text ?? ""}`);
		}), G(e, t);
	};
	q(h, (e) => {
		H(i) && e(g);
	}), V((e, t, n, r) => {
		Ti(o, 1, e), Y(o, "title", t), K(c, n), K(u, r);
	}, [
		() => yi(["chat-usage", Lm(t.hint)]),
		() => Fm(t.usage) ?? void 0,
		() => Pm(t.usage),
		() => ` · ${Nm(t.usage).join(" · ")}`
	]), G(e, a), M();
}
//#endregion
//#region src/components/ConversationEntry.svelte
var Vy = /* @__PURE__ */ U([
	,
	,
	" ",
	,
], 1);
function Hy(e, t) {
	j(t, !0);
	var n = Vy(), r = R(n), i = (e) => {
		Km(e, { get entry() {
			return t.entry;
		} });
	}, a = (e) => {
		Um(e, { get entry() {
			return t.entry;
		} });
	}, o = (e) => {
		Fy(e, { get entry() {
			return t.entry;
		} });
	}, s = (e) => {
		Sy(e, { get entry() {
			return t.entry;
		} });
	};
	q(r, (e) => {
		t.entry.kind === "compaction" || t.entry.kind === "error" ? e(i) : t.entry.kind === "injected" ? e(a, 1) : t.entry.kind === "tool" ? e(o, 2) : e(s, -1);
	});
	var c = B(r, 2), l = (e) => {
		By(e, {
			get usage() {
				return t.entry.usage;
			},
			get hint() {
				return t.entry.compact_hint;
			}
		});
	};
	q(c, (e) => {
		t.entry.usage && e(l);
	}), G(e, n), M();
}
//#endregion
//#region src/components/Conversation.svelte
var Uy = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), Wy = /* @__PURE__ */ U([["optgroup"]]), Gy = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), Ky = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), qy = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), Jy = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-reminders muted" },
	" "
]]), Yy = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-row" },
	,
]]), Xy = /* @__PURE__ */ U([
	[
		"button",
		{
			type: "button",
			class: "skip-link"
		},
		"Skip the conversation"
	],
	" ",
	,
	" ",
	["div", { class: "chat" }]
], 1), Zy = /* @__PURE__ */ U([
	[
		"section",
		{
			class: "chat-section",
			id: "chat-section",
			"aria-labelledby": "chat-heading"
		},
		[
			"div",
			{ class: "chart-head chat-section-head" },
			[
				"h3",
				{ id: "chat-heading" },
				" "
			],
			" ",
			[
				"span",
				{ class: "muted" },
				"read from the transcript when you ask, never stored"
			],
			" ",
			["span", { class: "spacer" }],
			" ",
			["select", {
				id: "chat-agent",
				"aria-label": "Conversation of"
			}],
			" ",
			[
				"button",
				{
					type: "button",
					id: "chat-order",
					"aria-label": "Oldest first"
				},
				[
					"span",
					{
						class: "chat-order-arrow",
						"aria-hidden": "true"
					},
					"↓"
				]
			],
			" ",
			[
				"button",
				{
					type: "button",
					id: "chat-load"
				},
				" "
			],
			" ",
			[
				"button",
				{
					type: "button",
					id: "chat-close"
				},
				"Close"
			]
		],
		" ",
		[
			"div",
			{ id: "chat" },
			,
		]
	],
	" ",
	["div", {
		id: "chat-end",
		class: "chat-end",
		tabindex: "-1",
		role: "note",
		"aria-label": "End of the conversation"
	}]
], 1);
function Qy(e, t) {
	j(t, !0);
	let { payload: n, hype: r, preferences: i } = as(), a = /* @__PURE__ */ F(""), o = /* @__PURE__ */ F(!1), s = /* @__PURE__ */ F(null), c = /* @__PURE__ */ F(null), l = /* @__PURE__ */ F(void 0), u = /* @__PURE__ */ F(void 0), d = /* @__PURE__ */ F(void 0), f = 0, p = /* @__PURE__ */ N(() => em(n.session?.agents ?? [])), m = /* @__PURE__ */ N(() => H(s) ? nm(H(s)) : null), h = /* @__PURE__ */ N(() => H(s) ? tm(H(s).reminders) : null), g = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ N(() => H(s) ? Fo(H(s).entries, i.oldestFirst).map((e) => {
		let t = g.get(e.entry);
		return t?.key === e.key ? t : (g.set(e.entry, e), e);
	}) : []);
	async function v() {
		let e = n.session;
		if (!e) return;
		let t = ++f;
		I(s, null), I(c, "Loading…");
		try {
			let n = await ps(Zp(e.session_id, H(a) || null));
			if (t !== f) return;
			I(s, n), I(c, null);
		} catch (e) {
			t === f && I(c, e instanceof Error ? e.message : String(e), !0);
		}
	}
	function y() {
		I(o, !0), v();
	}
	function b(e) {
		I(a, e.currentTarget.value, !0), H(o) && v();
	}
	function x() {
		f++, I(s, null), I(c, null), I(o, !1), H(l)?.focus();
	}
	async function S() {
		let e = n.session;
		if (!H(o) || !H(s) || !e) return;
		let t = ++f, r;
		try {
			r = await ps(Zp(e.session_id, H(a) || null));
		} catch {
			return;
		}
		if (t !== f || !H(s) || rm(H(s), r)) return;
		let i = H(u) && H(u).getBoundingClientRect().top < 0 ? ss(H(u).querySelectorAll("[data-key]")) : null;
		I(s, im(H(s), r)), await kr(), cs(i, i?.node);
	}
	In(() => {
		n.session, Mr(() => {
			S();
		});
	}), In(() => () => {
		f++;
	});
	var ee = Zy(), C = R(ee), w = L(C), te = L(w), ne = z(te, !0), re = B(te, 6);
	J(re, 21, () => H(p), (e) => "group" in e ? `group ${e.group}` : `option ${e.value}`, (e, t) => {
		var n = W(), r = R(n), i = (e) => {
			var n = Wy();
			J(n, 21, () => H(t).options, (e) => e.value, (e, t) => {
				var n = Uy(), r = z(n, !0), i = {};
				V(() => {
					K(r, H(t).label), i !== (i = H(t).value) && (n.value = (n.__value = i) ?? "");
				}), G(e, n);
			}), A(n), V(() => Y(n, "label", H(t).group)), G(e, n);
		}, a = (e) => {
			var n = Gy(), r = z(n, !0), i = {};
			V(() => {
				K(r, H(t).label), i !== (i = H(t).value) && (n.value = (n.__value = i) ?? "");
			}), G(e, n);
		};
		q(r, (e) => {
			"group" in H(t) ? e(i) : e(a, -1);
		}), G(e, n);
	}), A(re), ji(re);
	var ie = B(re, 2), T = B(ie, 2), ae = z(T, !0);
	Xi(T, (e) => I(l, e), () => H(l));
	var E = B(T, 2);
	A(w);
	var oe = B(w, 2), D = L(oe), se = (e) => {
		var t = Ky(), n = z(t, !0);
		V(() => K(n, H(c))), G(e, t);
	}, ce = (e) => {
		var t = qy(), n = z(t, !0);
		V(() => K(n, H(m))), G(e, t);
	}, le = (e) => {
		var t = Xy(), n = R(t), r = B(n, 2), i = (e) => {
			var t = Jy(), n = z(t, !0);
			V(() => K(n, H(h))), G(e, t);
		};
		q(r, (e) => {
			H(h) !== null && e(i);
		});
		var a = B(r, 2);
		J(a, 21, () => H(_), (e) => e.key, (e, t) => {
			var n = Yy();
			Hy(L(n), { get entry() {
				return H(t).entry;
			} }), A(n), V(() => Y(n, "data-key", H(t).key)), G(e, n);
		}), A(a), Br("click", n, () => H(d)?.focus()), G(e, t);
	};
	q(D, (e) => {
		H(c) === null ? H(m) === null ? H(s) && e(le, 2) : e(ce, 1) : e(se);
	}), A(oe), Xi(oe, (e) => I(u, e), () => H(u)), A(C), Xi(B(C, 2), (e) => I(d, e), () => H(d)), V((e, t) => {
		K(ne, e), Y(ie, "aria-pressed", i.oldestFirst), Y(ie, "title", t), K(ae, H(s) ? "Reload" : "Show conversation"), Y(E, "hidden", !H(o));
	}, [() => r("Conversation"), () => Qp(i.oldestFirst)]), Br("change", re, b), Mi(re, () => H(a), (e) => I(a, e)), Br("click", ie, () => i.oldestFirst = !i.oldestFirst), Br("click", T, y), Br("click", E, x), G(e, ee), M();
}
Vr(["change", "click"]);
//#endregion
//#region src/components/InputSplit.svelte
var $y = /* @__PURE__ */ U([["span"]]), eb = /* @__PURE__ */ U([[
	"div",
	{ class: "split-row" },
	,
	" ",
	[
		"span",
		null,
		" "
	],
	" ",
	[
		"strong",
		{ class: "split-number" },
		" "
	],
	" ",
	[
		"span",
		{ class: "split-number secondary" },
		" "
	],
	" ",
	[
		"span",
		{ class: "split-number" },
		" "
	]
]]), tb = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), nb = /* @__PURE__ */ U([[
	"div",
	{ class: "card" },
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	[
		"div",
		{ class: "tile-value" },
		" "
	],
	" ",
	["div", {
		class: "split",
		role: "img"
	}],
	" ",
	,
	" ",
	,
]]);
function rb(e, t) {
	j(t, !0);
	let { hype: n } = as(), r = /* @__PURE__ */ N(() => Ra(t.totals)), i = /* @__PURE__ */ N(() => Bd(t.totals)), a = /* @__PURE__ */ N(() => Hd(t.context, t.hintTokens));
	var o = nb(), s = L(o), c = z(s, !0), l = B(s, 2), u = z(l, !0), d = B(l, 2);
	J(d, 21, () => H(i).filter((e) => e.tokens > 0), (e) => e.label, (e, t) => {
		var n = $y();
		let r;
		V(() => r = Di(n, "", r, {
			"flex-grow": H(t).tokens,
			background: H(t).color
		})), G(e, n);
	}), A(d);
	var f = B(d, 2);
	J(f, 17, () => H(i), (e) => e.label, (e, t) => {
		var i = eb(), a = L(i);
		Mc(a, { get fill() {
			return H(t).color;
		} });
		var o = B(a, 2), s = z(o, !0), c = B(o, 2), l = z(c, !0), u = B(c, 2), d = z(u, !0), f = z(B(u, 2), !0);
		A(i), V((e, n, r, a) => {
			Y(i, "title", H(t).note), K(s, e), K(l, n), K(d, r), K(f, a);
		}, [
			() => n(H(t).label),
			() => X(H(t).tokens),
			() => Da(H(t).tokens, H(r)),
			() => Q(H(t).cost)
		]), G(e, i);
	});
	var p = B(f, 2), m = (e) => {
		var t = tb();
		Y(t, "title", "The context a main-thread turn reads: new input, cache writes and reads. The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens).");
		var n = z(t, !0);
		V(() => K(n, H(a))), G(e, t);
	};
	q(p, (e) => {
		H(a) !== null && e(m);
	}), A(o), V((e, t, n) => {
		K(c, e), K(u, t), Y(d, "aria-label", n);
	}, [
		() => n("Input tokens"),
		() => X(H(r)),
		() => Vd(H(i), t.totals)
	]), G(e, o), M();
}
//#endregion
//#region src/components/KpiTiles.svelte
var ib = /* @__PURE__ */ U([
	[
		"div",
		null,
		" "
	],
	" ",
	[
		"div",
		null,
		" "
	]
], 1), ab = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	,
]]), ob = /* @__PURE__ */ U([
	[
		"div",
		{ class: "card" },
		[
			"div",
			{ class: "label" },
			[
				"span",
				null,
				" "
			],
			" "
		],
		" ",
		[
			"div",
			{ class: "hero" },
			" "
		],
		" ",
		[
			"div",
			{ class: "note" },
			" "
		],
		" ",
		,
	],
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function sb(e, t) {
	j(t, !0);
	let { hype: n } = as(), r = /* @__PURE__ */ N(() => t.savings ? zd(t.savings) : null);
	var i = ob(), a = R(i), o = L(a), s = L(o), c = z(s, !0), l = B(s);
	A(o);
	var u = B(o, 2), d = z(u, !0), f = B(u, 2), p = z(f, !0), m = B(f, 2), h = (e) => {
		var t = ab(), n = L(t), i = (e) => {
			var t = ib(), n = R(t), i = z(n, !0), a = z(B(n, 2), !0);
			V(() => {
				Ti(n, 1, yi(H(r).verdict === "gain" ? "verdict-gain" : "verdict-loss")), K(i, H(r).amount), K(a, H(r).count);
			}), G(e, t);
		}, a = (e) => {
			var t = Jr();
			V(() => K(t, H(r).count)), G(e, t);
		};
		q(n, (e) => {
			H(r).verdict ? e(i) : e(a, -1);
		}), A(t), V(() => Y(t, "title", H(r).title)), G(e, t);
	};
	q(m, (e) => {
		H(r) && e(h);
	}), A(a);
	var g = B(a, 2);
	rb(g, {
		get totals() {
			return t.totals;
		},
		get context() {
			return t.context;
		},
		get hintTokens() {
			return t.hintTokens;
		}
	});
	var _ = B(g, 2);
	{
		let e = /* @__PURE__ */ N(() => Z(t.totals.turns));
		Dp(_, {
			label: "Turns",
			get value() {
				return H(e);
			},
			note: "API calls with usage",
			themedNote: !0
		});
	}
	var v = B(_, 2);
	{
		let e = /* @__PURE__ */ N(() => X(t.totals.output)), n = /* @__PURE__ */ N(() => Q(t.totals.cost_parts.output));
		Dp(v, {
			label: "Output tokens",
			get value() {
				return H(e);
			},
			get note() {
				return H(n);
			}
		});
	}
	V((e, n, r) => {
		K(c, e), K(l, `, ${t.scope ?? ""}`), K(d, n), K(p, r);
	}, [
		() => n("Estimated cost"),
		() => Q(t.totals.cost),
		() => Ld(t.totals)
	]), G(e, i), M();
}
//#endregion
//#region src/components/RuntimeTiles.svelte
var cb = /* @__PURE__ */ U([
	,
	,
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function lb(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => "source" in t.runtime && t.runtime.source === "transcripts"), r = /* @__PURE__ */ N(() => Ud(t.runtime, t.from, t.costPer100Lines, H(n)));
	var i = cb(), a = R(i);
	{
		let e = /* @__PURE__ */ N(() => Oa(t.runtime.duration_ms));
		Dp(a, {
			label: "Session time",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).session;
			}
		});
	}
	var o = B(a, 2);
	{
		let e = /* @__PURE__ */ N(() => Oa(t.runtime.api_ms));
		Dp(o, {
			label: "Waiting on the API",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).api;
			}
		});
	}
	var s = B(o, 2);
	{
		let e = /* @__PURE__ */ N(() => Oa(t.runtime.tool_ms));
		Dp(s, {
			label: "Running tools",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).tools;
			}
		});
	}
	var c = B(s, 2);
	{
		let e = /* @__PURE__ */ N(() => `+${Z(t.runtime.lines_added)} / −${Z(t.runtime.lines_removed)}`);
		Dp(c, {
			label: "Lines changed",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).lines;
			}
		});
	}
	G(e, i), M();
}
//#endregion
//#region src/lib/secrets.ts
function ub(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function db(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var fb = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function pb(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(fb, e.reach) ? fb[e.reach] ?? "" : "no result yet";
}
var mb = [
	{ label: "Time" },
	{ label: "Agent" },
	{ label: "Tool" },
	{ label: "Path" },
	{
		label: "Matched",
		title: "the [secrets] pattern it matched"
	},
	{ label: "Reached" }
];
function hb(e) {
	let t = /* @__PURE__ */ new Map();
	return e.map((e) => {
		let n = [
			e.time,
			e.agent_id,
			e.tool,
			e.path,
			e.pattern
		].join("\0"), r = t.get(n) ?? 0;
		return t.set(n, r + 1), {
			key: r ? `${n}\u0000${r}` : n,
			time: Ia(e.time),
			agent: e.agent_type,
			tool: e.tool,
			path: e.path,
			via: db(e),
			pattern: e.pattern,
			severity: e.severity || "medium",
			reach: pb(e)
		};
	});
}
function gb(e) {
	return e.length === 1 ? "1 call" : `${Z(e.length)} calls`;
}
function _b(e, t) {
	return e.filter((e) => e.severity === t).length;
}
function vb(e) {
	return `Possible secret access: ${gb(e)} (${Z(_b(e, "high"))} sent out)`;
}
function yb(e, t) {
	let n = `${gb(e)} named a possible secret location`;
	if (t === "warning") return `${n}, ${Z(_b(e, "medium"))} of them returned a result or may still`;
	let r = _b(e, "low-medium");
	return r ? `${n}, ${Z(r)} returned a result only in a likely test` : `${n}, none reached anything`;
}
//#endregion
//#region src/components/SecretAccesses.svelte
var bb = (e, t = b) => {
	var n = Cb(), r = R(n), i = z(r, !0), a = B(r, 2), o = z(a, !0), s = B(a, 2), c = z(s, !0), l = B(s, 2), u = L(l), d = z(u, !0), f = B(u), p = (e) => {
		var n = Sb(), r = z(n, !0);
		V(() => K(r, t().via)), G(e, n);
	};
	q(f, (e) => {
		t().via && e(p);
	}), A(l);
	var m = B(l, 2), h = z(m, !0), g = B(m, 2), _ = L(g), v = B(_, 1, !0);
	A(g), V(() => {
		K(i, t().time), K(o, t().agent), K(c, t().tool), K(d, t().path), K(h, t().pattern), Ti(_, 1, `secret-severity secret-severity-${t().severity ?? ""}`), K(v, t().reach);
	}), G(e, n);
}, xb = /* @__PURE__ */ U([[
	"div",
	null,
	[
		"p",
		null,
		"These tool calls named a path that matches a possible secret location. Most severe first: sent to an MCP server or\n      a network program, then returned into the conversation (and so to the API), then blocked, failed or empty. Check\n      that each was meant."
	],
	" ",
	,
	" ",
	[
		"p",
		{ class: "muted" },
		"Matched against [secrets] patterns in the config: file tools by their path, commands by their words with the\n      variables they set (quoted text only where it holds a path), and scripts this transcript wrote and then ran by\n      their text. Variables from earlier calls and other scripts are unknown. A result counts whatever it held: a test\n      that only mentions a path returns output too."
	]
]]), Sb = /* @__PURE__ */ U([[
	"span",
	{ class: "secret-via" },
	" "
]]), Cb = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		[
			"span",
			{ class: "secret-path" },
			" "
		],
		,
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		["span", { "aria-hidden": "true" }],
		" "
	]
], 1), wb = /* @__PURE__ */ U([[
	"div",
	{
		id: "secret-alert",
		class: "card secret-alert",
		role: "region",
		"aria-labelledby": "secret-alert-title"
	},
	[
		"h3",
		{
			class: "secret-alert-head",
			id: "secret-alert-title"
		},
		[
			"span",
			{
				class: "secret-alert-icon",
				"aria-hidden": "true"
			},
			"!"
		],
		" "
	],
	" ",
	,
]]), Tb = /* @__PURE__ */ U([[
	"div",
	{
		id: "secret-alert",
		role: "region",
		"aria-labelledby": "secret-alert-title"
	},
	[
		"div",
		{ class: "secret-folded-line" },
		[
			"h3",
			{
				class: "secret-folded-head",
				id: "secret-alert-title"
			},
			" "
		],
		" ",
		[
			"button",
			{
				type: "button",
				class: "link-button"
			},
			" "
		]
	],
	" ",
	,
]]);
function Eb(e, t) {
	j(t, !0);
	let n = (e, t = b, n = b) => {
		var r = xb(), i = B(L(r), 2);
		{
			let e = /* @__PURE__ */ N(() => `${t()}-secrets`);
			Hc(i, {
				get key() {
					return H(e);
				},
				get columns() {
					return mb;
				},
				get rows() {
					return H(c);
				},
				rowKey: (e) => e.key,
				get cells() {
					return bb;
				},
				labelledby: "secret-alert-title"
			});
		}
		Ne(2), A(r), V(() => Y(r, "hidden", n())), G(e, r);
	}, { payload: r } = as(), i = /* @__PURE__ */ N(() => r.session), a = /* @__PURE__ */ N(() => H(i)?.secret_accesses ?? []), o = /* @__PURE__ */ N(() => H(i) ? ub(H(i)) : null), s = /* @__PURE__ */ N(() => H(o) === "warning" || H(o) === "quiet" ? H(o) : null), c = /* @__PURE__ */ N(() => hb(H(a))), l = /* @__PURE__ */ F(!1);
	var u = W(), d = R(u), f = (e) => {
		var t = wb(), r = L(t), o = B(L(r), 1, !0);
		A(r);
		var s = B(r, 2);
		n(s, () => H(i).session_id, () => !1), A(t), V((e) => K(o, e), [() => vb(H(a))]), G(e, t);
	}, p = (e) => {
		var t = Tb(), r = L(t), o = L(r), c = z(o, !0), u = B(o, 2), d = z(u, !0);
		A(r);
		var f = B(r, 2);
		n(f, () => H(i).session_id, () => !H(l)), A(t), V((e) => {
			Ti(t, 1, yi([
				"card",
				"secret-folded",
				H(s) === "warning" && "secret-warning"
			])), K(c, e), Y(u, "aria-expanded", H(l)), K(d, H(l) ? "Hide them" : "Show them");
		}, [() => yb(H(a), H(s))]), Br("click", u, () => I(l, !H(l))), G(e, t);
	};
	q(d, (e) => {
		H(i) && H(o) === "alert" ? e(f) : H(i) && H(s) && e(p, 1);
	}), G(e, u), M();
}
Vr(["click"]);
//#endregion
//#region src/components/SessionWaits.svelte
var Db = /* @__PURE__ */ U([[
	"strong",
	null,
	" "
]]), Ob = /* @__PURE__ */ U([[
	"span",
	null,
	[
		"a",
		null,
		" "
	],
	" "
]]), kb = /* @__PURE__ */ U([[
	"p",
	{ class: "wait-line" },
	[
		"span",
		{ class: "wait-icon" },
		,
	],
	" ",
	,
]]), Ab = /* @__PURE__ */ U([["div", {
	class: "card wait-notice",
	role: "status"
}]]);
function jb(e, t) {
	j(t, !0);
	let { payload: n } = as(), r = /* @__PURE__ */ N(() => n.session), i = /* @__PURE__ */ N(() => H(r) ? Bs(H(r), n.live?.sessions ?? []) : []);
	var a = Ab();
	J(a, 21, () => H(i), (e) => e.session_id, (e, t) => {
		var n = kb(), r = L(n);
		Rl(L(r), { get badge() {
			return H(t);
		} }), A(r);
		var i = B(r, 2), a = (e) => {
			var n = Db(), r = z(n);
			V((e, t) => K(r, `This session is ${e ?? ""}${t ?? ""}`), [() => H(t).text.charAt(0).toLowerCase(), () => H(t).text.slice(1)]), G(e, n);
		}, o = (e) => {
			var n = Ob(), r = L(n), i = z(r, !0), a = B(r);
			A(n), V((e) => {
				Y(r, "href", e), K(i, H(t).title), K(a, `: ${H(t).text ?? ""}`);
			}, [() => _l(H(t))]), G(e, n);
		};
		q(i, (e) => {
			H(t).title === null ? e(a) : e(o, -1);
		}), A(n), G(e, n);
	}), A(a), V(() => Y(a, "hidden", H(i).length === 0)), G(e, a), M();
}
//#endregion
//#region src/components/ToolsTable.svelte
var Mb = (e) => {
	G(e, Nb());
}, Nb = /* @__PURE__ */ U([[
	"h3",
	{ id: "session-tools-title" },
	"Tools"
]]), Pb = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Fb = /* @__PURE__ */ U([[
	"button",
	{
		type: "button",
		class: "link-button"
	},
	" "
], ")"], 1), Ib = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), Lb = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		[
			"span",
			null,
			" ",
			,
		]
	],
	" ",
	,
], 1);
function Rb(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = Pb(), n = z(t, !0);
		V(() => K(n, H(s))), G(e, t);
	}, r = (e, t = b) => {
		var n = Lb(), r = R(n), i = z(r, !0), o = B(r, 2), s = L(o), l = L(s, !0), u = B(l), d = (e) => {
			let n = /* @__PURE__ */ N(() => t().fold);
			var r = Fb(), i = R(r), a = z(i, !0);
			Ne(), V(() => {
				Y(i, "aria-expanded", H(n).open), K(a, H(n).label);
			}), Br("click", i, () => c(H(n).fold)), G(e, r);
		};
		q(u, (e) => {
			t().fold && e(d);
		}), A(s), A(o), J(B(o, 2), 19, () => a.slice(2), (e) => e.label, (e, n, r) => {
			var i = Ib(), a = z(i, !0);
			V(() => K(a, t().cells[H(r)])), G(e, i);
		}), V(() => {
			K(i, t().agent), Ti(s, 1, yi(t().name.className)), K(l, t().fold ? `${t().name.text} (` : t().name.text);
		}), G(e, n);
	}, i = /* @__PURE__ */ F(un([])), a = Nd(), o = /* @__PURE__ */ N(() => Fd(t.agents, H(i))), s = /* @__PURE__ */ N(() => Pd(t.agents));
	function c(e) {
		I(i, H(i).includes(e) ? H(i).filter((t) => t !== e) : [...H(i), e], !0);
	}
	{
		let i = /* @__PURE__ */ N(() => H(s) === null ? void 0 : n);
		Hc(e, {
			get key() {
				return t.pagerKey;
			},
			get columns() {
				return a;
			},
			get rows() {
				return H(o);
			},
			rowKey: (e) => e.key,
			get cells() {
				return r;
			},
			sub: (e) => e.sub,
			group: (e) => e.group,
			get heading() {
				return Mb;
			},
			get intro() {
				return H(i);
			},
			empty: "No tool calls.",
			labelledby: "session-tools-title"
		});
	}
	M();
}
Vr(["click"]);
//#endregion
//#region src/components/UsageTable.svelte
var zb = /* @__PURE__ */ U([[
	"h3",
	null,
	" "
]]), Bb = /* @__PURE__ */ U([[
	"h2",
	null,
	" "
]]), Vb = /* @__PURE__ */ U([[
	"p",
	{ class: "note" },
	" "
]]), Hb = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), Ub = /* @__PURE__ */ U([[
	"span",
	{ class: "effort" },
	" "
]]), Wb = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), Gb = /* @__PURE__ */ U([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1), Kb = /* @__PURE__ */ U([[
	"section",
	{ class: "card" },
	,
]]);
function qb(e, t) {
	j(t, !0);
	let n = (e) => {
		var n = W(), o = R(n), c = (e) => {
			{
				let n = /* @__PURE__ */ N(() => qd(t.nameLabel)), o = /* @__PURE__ */ N(() => t.note === void 0 ? void 0 : i);
				Hc(e, {
					get key() {
						return s();
					},
					get columns() {
						return H(n);
					},
					get rows() {
						return t.rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return a;
					},
					sub: (e) => e.sub,
					group: (e) => e.group,
					get heading() {
						return r;
					},
					get intro() {
						return H(o);
					},
					get empty() {
						return t.empty;
					},
					get labelledby() {
						return `${t.id ?? ""}-title`;
					}
				});
			}
		}, l = (e) => {
			r(e);
		};
		q(o, (e) => {
			t.rows ? e(c) : e(l, -1);
		}), G(e, n);
	}, r = (e) => {
		var n = W(), r = R(n), i = (e) => {
			var n = zb(), r = z(n, !0);
			V(() => {
				Y(n, "id", `${t.id ?? ""}-title`), K(r, t.title);
			}), G(e, n);
		}, a = (e) => {
			var n = Bb(), r = z(n, !0);
			V(() => {
				Y(n, "id", `${t.id ?? ""}-title`), K(r, t.title);
			}), G(e, n);
		};
		q(r, (e) => {
			o() ? e(i) : e(a, -1);
		}), G(e, n);
	}, i = (e) => {
		var n = Vb(), r = z(n, !0);
		V(() => K(r, t.note)), G(e, n);
	}, a = (e, t = b) => {
		var n = Gb(), r = R(n), i = L(r), a = (e) => {
			var n = Hb(), r = L(n);
			Mc(r, { get fill() {
				return t().swatch;
			} });
			var i = B(r, 1, !0);
			A(n), V(() => K(i, t().name)), G(e, n);
		}, o = (e) => {
			var n = Ub(), r = z(n, !0);
			V(() => K(r, t().name)), G(e, n);
		}, s = (e) => {
			var n = Jr();
			V(() => K(n, t().name)), G(e, n);
		};
		q(i, (e) => {
			t().kind === "model" ? e(a) : t().kind === "effort" ? e(o, 1) : e(s, -1);
		}), A(r), J(B(r, 2), 19, () => H(c), (e) => e.label, (e, n, r) => {
			var i = Wb(), a = z(i, !0);
			V(() => K(a, t().cells[H(r)])), G(e, i);
		}), G(e, n);
	}, o = $i(t, "inline", 3, !1), s = $i(t, "pagerKey", 19, () => t.id), c = /* @__PURE__ */ N(() => qd(t.nameLabel).slice(1));
	var l = W(), u = R(l), d = (e) => {
		n(e);
	}, f = (e) => {
		var r = Kb(), i = L(r);
		n(i), A(r), V(() => Y(r, "aria-labelledby", `${t.id ?? ""}-title`)), G(e, r);
	};
	q(u, (e) => {
		o() ? e(d) : e(f, -1);
	}), G(e, l), M();
}
//#endregion
//#region src/components/SessionView.svelte
var Jb = /* @__PURE__ */ U([[
	"div",
	{ class: "prompt" },
	" "
]]), Yb = /* @__PURE__ */ U([[
	"div",
	{
		class: "kpis session-kpis",
		role: "group",
		"aria-label": "Time and lines changed"
	},
	,
]]), Xb = /* @__PURE__ */ U([[
	"section",
	{
		id: "drilldown",
		class: "card",
		"aria-labelledby": "drilldown-title"
	},
	[
		"div",
		{ class: "chart-head" },
		[
			"h2",
			{
				id: "drilldown-title",
				tabindex: "-1"
			},
			" "
		],
		" ",
		["span", { class: "spacer" }],
		"  ",
		[
			"a",
			{
				href: "#",
				"aria-keyshortcuts": "Escape"
			},
			"Close"
		]
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "muted" },
		" "
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "kpis session-kpis" },
		,
	],
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	[
		"div",
		{ class: "grid-2" },
		[
			"div",
			null,
			,
		],
		" ",
		[
			"div",
			null,
			,
		]
	],
	" ",
	,
	" ",
	,
	" ",
	,
]]);
function Zb(e, t) {
	j(t, !0);
	let { payload: n, hype: r } = as(), i = /* @__PURE__ */ N(() => n.session), a = /* @__PURE__ */ N(() => H(i) ? Yd(H(i).models, H(i).model_effort, aa(H(i).models.map((e) => e.model))) : []), o = /* @__PURE__ */ N(() => H(i) ? Jd(H(i).skills, (e) => e.skill) : []), s = /* @__PURE__ */ N(() => H(i) ? Jd(H(i).mcp_servers, (e) => e.mcp_server) : []), c = /* @__PURE__ */ N(() => H(i) ? Hu(H(i).api_errors) : []);
	function l(e) {
		H(i) && e.key === "Escape" && !e.defaultPrevented && (location.hash = "");
	}
	var u = W();
	zr("keydown", mn, l);
	var d = R(u), f = (e) => {
		let t = /* @__PURE__ */ N(() => H(i).session_id), n = /* @__PURE__ */ N(() => H(i).runtime);
		var l = W();
		ai(R(l), () => H(t), (e) => {
			var l = Xb(), u = L(l), d = z(L(u), !0);
			Ne(4), A(u);
			var f = B(u, 2), p = (e) => {
				var t = Jb(), n = z(t, !0);
				V(() => K(n, H(i).prompt)), G(e, t);
			};
			q(f, (e) => {
				H(i).prompt && e(p);
			});
			var m = B(f, 2), h = z(m, !0), g = B(m, 2);
			jb(g, {});
			var _ = B(g, 2);
			sb(L(_), {
				get totals() {
					return H(i);
				},
				scope: "this session",
				get context() {
					return H(i).context;
				},
				get hintTokens() {
					return H(i).compact_hint_tokens;
				},
				get savings() {
					return H(i).compaction_savings;
				}
			}), A(_);
			var v = B(_, 2), y = (e) => {
				var t = Yb(), r = L(t);
				{
					let e = /* @__PURE__ */ N(() => Gd(H(n).source)), t = /* @__PURE__ */ N(() => Kd({
						cost: H(i).cost,
						runtime: H(n)
					}));
					lb(r, {
						get runtime() {
							return H(n);
						},
						get from() {
							return H(e);
						},
						get costPer100Lines() {
							return H(t);
						}
					});
				}
				A(t), G(e, t);
			};
			q(v, (e) => {
				H(n) && e(y);
			});
			var b = B(v, 2);
			Eb(b, {});
			var x = B(b, 2);
			Af(x, {});
			var S = B(x, 2);
			Xp(S, {});
			var ee = B(S, 2);
			{
				let e = /* @__PURE__ */ N(() => r("By model"));
				qb(ee, {
					inline: !0,
					id: "session-models",
					get title() {
						return H(e);
					},
					nameLabel: "Model",
					get rows() {
						return H(a);
					},
					empty: "No usage in this range.",
					get pagerKey() {
						return `${H(t) ?? ""}-models`;
					}
				});
			}
			var C = B(ee, 2);
			rf(C, {
				get agents() {
					return H(i).agents;
				},
				get pagerKey() {
					return `${H(t) ?? ""}-agents`;
				}
			});
			var w = B(C, 2), te = (e) => {
				Rb(e, {
					get agents() {
						return H(i).agents;
					},
					get pagerKey() {
						return `${H(t) ?? ""}-tools`;
					}
				});
			};
			q(w, (e) => {
				H(i).transcript || e(te);
			});
			var ne = B(w, 2), re = (e) => {
				Qy(e, {});
			};
			q(ne, (e) => {
				H(i).transcript && e(re);
			});
			var ie = B(ne, 2), T = L(ie), ae = L(T);
			{
				let e = /* @__PURE__ */ N(() => r("By skill"));
				qb(ae, {
					inline: !0,
					id: "session-skills",
					get title() {
						return H(e);
					},
					nameLabel: "Skill",
					get rows() {
						return H(o);
					},
					empty: "No turns attributed to a skill.",
					get pagerKey() {
						return `${H(t) ?? ""}-skills`;
					}
				});
			}
			A(T);
			var E = B(T, 2), oe = L(E);
			{
				let e = /* @__PURE__ */ N(() => r("By MCP server"));
				qb(oe, {
					inline: !0,
					id: "session-mcp-servers",
					get title() {
						return H(e);
					},
					nameLabel: "MCP server",
					get rows() {
						return H(s);
					},
					empty: "No turns attributed to an MCP server.",
					get pagerKey() {
						return `${H(t) ?? ""}-mcp-servers`;
					}
				});
			}
			A(E), A(ie);
			var D = B(ie, 2);
			{
				let e = /* @__PURE__ */ N(() => r("Rate limits and API errors"));
				qu(D, {
					id: "session-api-errors",
					get title() {
						return H(e);
					},
					get rows() {
						return H(c);
					},
					empty: "No API errors in this session.",
					get pagerKey() {
						return `${H(t) ?? ""}-api-errors`;
					},
					withSession: !1
				});
			}
			var se = B(D, 2), ce = (e) => {
				Rb(e, {
					get agents() {
						return H(i).agents;
					},
					get pagerKey() {
						return `${H(t) ?? ""}-tools`;
					}
				});
			};
			q(se, (e) => {
				H(i).transcript && e(ce);
			});
			var le = B(se, 2), ue = (e) => {
				Qy(e, {});
			};
			q(le, (e) => {
				H(i).transcript || e(ue);
			}), A(l), gi(l, () => wd({
				hide: ["filters", "summary"],
				focus: "#drilldown-title"
			})), V((e, t) => {
				K(d, e), K(h, t);
			}, [() => gl(H(i)), () => Td(H(i))]), G(e, l);
		}), G(e, l);
	};
	q(d, (e) => {
		H(i) && e(f);
	}), G(e, u), M();
}
//#endregion
//#region src/components/SummaryTiles.svelte
var Qb = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]);
function $b(e, t) {
	j(t, !0);
	let { payload: n } = as(), r = /* @__PURE__ */ N(() => n.summary);
	var i = W(), a = R(i), o = (e) => {
		var n = W(), i = R(n), a = (e) => {
			{
				let t = /* @__PURE__ */ N(() => Id(H(r)));
				sb(e, {
					get totals() {
						return H(r).totals;
					},
					get scope() {
						return H(t);
					},
					get context() {
						return H(r).context;
					},
					get hintTokens() {
						return H(r).compact_hint_tokens;
					},
					get savings() {
						return H(r).compaction_savings;
					}
				});
			}
		}, o = (e) => {
			{
				let t = /* @__PURE__ */ N(() => Wd(H(r).runtime.sessions));
				lb(e, {
					get runtime() {
						return H(r).runtime;
					},
					get from() {
						return H(t);
					},
					get costPer100Lines() {
						return H(r).runtime.cost_per_100_lines;
					}
				});
			}
		};
		q(i, (e) => {
			t.rows === "kpis" ? e(a) : e(o, -1);
		}), G(e, n);
	}, s = (e) => {
		var t = Qb(), r = z(t, !0);
		V(() => K(r, n.summaryFailed ? "Could not load the summary." : "Loading…")), G(e, t);
	};
	q(a, (e) => {
		H(r) ? e(o) : t.rows === "kpis" && e(s, 1);
	}), G(e, i), M();
}
//#endregion
//#region src/components/ThemePicker.svelte
var ex = /* @__PURE__ */ U([[
	"label",
	{ class: "theme-picker" },
	[
		"span",
		{ class: "muted" },
		"Theme"
	],
	" ",
	[
		"select",
		{ id: "theme" },
		[
			"option",
			null,
			"auto"
		],
		[
			"option",
			null,
			"light"
		],
		[
			"option",
			null,
			"dark"
		],
		[
			"optgroup",
			{ label: "Just for fun" },
			[
				"option",
				null,
				"terminal hacker 💻"
			],
			" ",
			[
				"option",
				null,
				"startup flex ✨"
			],
			" ",
			[
				"option",
				null,
				"RGB battlestation 🌈"
			]
		]
	]
]]);
function tx(e, t) {
	j(t, !0);
	let { preferences: n } = as();
	function r(e) {
		n.theme = e === "auto" ? null : e;
	}
	var i = ex(), a = B(L(i), 2), o = L(a);
	o.value = o.__value = "auto";
	var s = B(o);
	s.value = s.__value = "light";
	var c = B(s);
	c.value = c.__value = "dark";
	var l = B(c), u = L(l);
	u.value = u.__value = "hacker";
	var d = B(u, 2);
	d.value = d.__value = "startup";
	var f = B(d, 2);
	f.value = f.__value = "rgb", A(l), A(a);
	var p;
	ji(a), A(i), V(() => {
		p !== (p = n.theme ?? "auto") && (a.value = (a.__value = p) ?? "", Ai(a, p));
	}), Br("change", a, (e) => r(e.currentTarget.value)), G(e, i), M();
}
Vr(["change"]);
//#endregion
//#region src/components/UsageTables.svelte
var nx = /* @__PURE__ */ U([
	[
		"div",
		{ class: "grid-2 stack" },
		,
		" ",
		,
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "grid-2 stack" },
		,
		" ",
		,
	]
], 1);
function rx(e, t) {
	j(t, !0);
	let { payload: n, hype: r } = as(), i = /* @__PURE__ */ N(() => n.summary), a = /* @__PURE__ */ N(() => H(i) ? Jd(H(i).agent_type, (e) => e.agent_type) : null), o = /* @__PURE__ */ N(() => H(i) ? aa([...new Set(H(i).day_model.map((e) => e.model))]) : null), s = /* @__PURE__ */ N(() => H(i) && H(o) ? Yd(H(i).model, H(i).model_effort, H(o)) : null), c = /* @__PURE__ */ N(() => H(i) ? Jd(H(i).project, (e) => e.project) : null), l = /* @__PURE__ */ N(() => H(i) ? Jd(H(i).skill, (e) => e.skill) : null), u = /* @__PURE__ */ N(() => H(i) ? Jd(H(i).mcp_server, (e) => e.mcp_server) : null);
	var d = nx(), f = R(d), p = L(f);
	{
		let e = /* @__PURE__ */ N(() => r("By agent type"));
		qb(p, {
			id: "by-agent",
			get title() {
				return H(e);
			},
			nameLabel: "Agent type",
			get rows() {
				return H(a);
			},
			empty: "No usage in this range."
		});
	}
	var m = B(p, 2);
	{
		let e = /* @__PURE__ */ N(() => r("By model"));
		qb(m, {
			id: "by-model",
			get title() {
				return H(e);
			},
			nameLabel: "Model",
			get rows() {
				return H(s);
			},
			empty: "No usage in this range."
		});
	}
	A(f);
	var h = B(f, 2);
	{
		let e = /* @__PURE__ */ N(() => r("By project"));
		qb(h, {
			id: "by-project",
			get title() {
				return H(e);
			},
			nameLabel: "Project",
			get rows() {
				return H(c);
			},
			empty: "No usage in this range."
		});
	}
	var g = B(h, 2), _ = L(g);
	{
		let e = /* @__PURE__ */ N(() => r("By skill"));
		qb(_, {
			id: "by-skill",
			get title() {
				return H(e);
			},
			note: "turns Claude Code attributes to a skill while it runs",
			nameLabel: "Skill",
			get rows() {
				return H(l);
			},
			empty: "No turns attributed to a skill in this range."
		});
	}
	var v = B(_, 2);
	{
		let e = /* @__PURE__ */ N(() => r("By MCP server"));
		qb(v, {
			id: "by-mcp-server",
			get title() {
				return H(e);
			},
			note: "turns Claude Code attributes to an MCP server's tools",
			nameLabel: "MCP server",
			get rows() {
				return H(u);
			},
			empty: "No turns attributed to an MCP server in this range."
		});
	}
	A(g), G(e, d), M();
}
//#endregion
//#region src/components/App.svelte
var ix = /* @__PURE__ */ U([
	[
		"header",
		null,
		[
			"h1",
			null,
			" "
		],
		" ",
		[
			"span",
			{
				id: "scope",
				class: "muted"
			},
			" "
		],
		" ",
		["span", { class: "spacer" }],
		" ",
		[
			"span",
			{
				id: "updated",
				class: "muted"
			},
			" "
		],
		" ",
		,
	],
	" ",
	,
	" ",
	[
		"div",
		{ id: "session-card" },
		,
	],
	" ",
	[
		"div",
		{
			class: "filters",
			id: "filters",
			role: "group",
			"aria-label": "Filters"
		},
		,
	],
	" ",
	[
		"div",
		{ id: "summary" },
		[
			"div",
			{
				class: "kpis stack",
				id: "kpis"
			},
			,
		],
		" ",
		[
			"div",
			{
				class: "kpis stack",
				id: "runtime",
				role: "group",
				"aria-label": "Time and lines changed"
			},
			,
		],
		" ",
		[
			"div",
			{ id: "live-card" },
			,
		],
		" ",
		[
			"div",
			{ id: "trend-card" },
			,
		],
		" ",
		[
			"div",
			{ id: "chart-card" },
			,
		],
		" ",
		[
			"div",
			{ id: "costly-card" },
			,
		],
		" ",
		[
			"div",
			{ id: "limits-card" },
			,
		],
		" ",
		[
			"div",
			{ id: "usage-cards" },
			,
		],
		" ",
		[
			"div",
			{ id: "sessions-card" },
			,
		]
	],
	" ",
	[
		"footer",
		{ id: "footer" },
		" "
	]
], 1);
function ax(e, t) {
	j(t, !0);
	let n = $i(t, "app", 19, () => new is()), r = $i(t, "loaderOptions", 19, () => ({}));
	os(n());
	let { payload: i, preferences: a, hype: o, footerCopy: s } = n(), c = new qs(n(), {
		keep: fs,
		...r()
	});
	In(() => (c.start(), () => c.stop()));
	let l = (e) => {
		let { dataset: t } = e.documentElement;
		return a.theme === null ? delete t.theme : t.theme = a.theme, () => {
			delete t.theme;
		};
	};
	var u = ix();
	zr("visibilitychange", mn, () => c.visibilityChanged()), gi(mn, () => l), zr("hashchange", pn, () => c.hashChanged());
	var d = R(u), f = L(d), p = z(f, !0), m = B(f, 2), h = z(m, !0), g = B(m, 4), _ = z(g, !0);
	tx(B(g, 2), {}), A(d);
	var v = B(d, 2);
	Qs(v, { get messages() {
		return n().messages;
	} });
	var y = B(v, 2);
	Zb(L(y), {}), A(y);
	var b = B(y, 2);
	ku(L(b), {}), A(b);
	var x = B(b, 2);
	let S;
	var ee = L(x);
	$b(L(ee), { rows: "kpis" }), A(ee);
	var C = B(ee, 2);
	$b(L(C), { rows: "runtime" }), A(C);
	var w = B(C, 2);
	eu(L(w), {}), A(w);
	var te = B(w, 2);
	Tu(L(te), {}), A(te);
	var ne = B(te, 2);
	pl(L(ne), {}), A(ne);
	var re = B(ne, 2);
	Ml(L(re), {}), A(re);
	var ie = B(re, 2);
	pd(L(ie), {}), A(ie);
	var T = B(ie, 2);
	rx(L(T), {}), A(T);
	var ae = B(T, 2);
	xd(L(ae), {}), A(ae), A(x);
	var E = z(B(x, 2), !0);
	V((e, t, n, r) => {
		K(p, e), K(h, t), K(_, n), S = Ti(x, 1, "", null, S, { loading: i.summaryLoading }), K(E, r);
	}, [
		() => o("Claude usage"),
		() => Js(i.summary),
		() => Ys(i.liveAt),
		() => Xs(i.summary, s())
	]), G(e, u), M();
}
//#endregion
//#region src/main.ts
var ox = document.querySelector("main");
if (!ox) throw Error("The page has no <main> to mount the app on");
$r(ax, { target: ox });
//#endregion

//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, n = {}, r = Symbol("uninitialized"), i = "http://www.w3.org/1999/xhtml", a = "http://www.w3.org/2000/svg", o = "http://www.w3.org/1998/Math/MathML", s = Array.isArray, c = Array.prototype.indexOf, l = Array.prototype.includes, u = Array.from, d = Object.defineProperty, f = Object.getOwnPropertyDescriptor, p = Object.getOwnPropertyDescriptors, m = Object.prototype, h = Array.prototype, g = Object.getPrototypeOf, _ = Object.isExtensible, v = () => {};
function y(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function ee() {
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
var b = 1 << 24, x = 1024, S = 2048, te = 4096, ne = 8192, re = 16384, ie = 32768, ae = 1 << 25, oe = 65536, se = 1 << 19, ce = 1 << 20, le = 1 << 25, ue = 1 << 21, de = 1 << 22, fe = 1 << 23, pe = Symbol("$state"), me = Symbol("component"), he = Symbol("legacy props"), ge = Symbol(""), _e = Symbol("attributes"), ve = Symbol("class"), ye = Symbol("style"), be = Symbol("text"), xe = Symbol("form reset"), Se = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Ce = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function we() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Te(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ee() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function De() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var C = !1;
function Oe(e) {
	C = e;
}
var w;
function ke(e) {
	if (e === null) throw Te(), n;
	return w = e;
}
function Ae() {
	return ke(/* @__PURE__ */ rn(w));
}
function T(e) {
	if (C) {
		if (/* @__PURE__ */ rn(w) !== null) throw Te(), n;
		w = e;
	}
}
function je(e = 1) {
	if (C) {
		for (var t = e, n = w; t--;) n = /* @__PURE__ */ rn(n);
		w = n;
	}
}
function Me(e = !0) {
	for (var t = 0, n = w;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ rn(n);
		e && n.remove(), n = i;
	}
}
function Ne(e) {
	if (!e || e.nodeType !== 8) throw Te(), n;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Pe(e) {
	return e === this.v;
}
function Fe(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ie(e) {
	return !Fe(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Le() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Re(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function ze() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Be(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ve() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function He() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ue() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function We() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var Ge = null;
function Ke(e) {
	Ge = e;
}
function E(e, t = !1, n) {
	Ge = {
		p: Ge,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: V,
		l: null
	};
}
function D(e) {
	var t = Ge, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) vn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ge = t.p, qe(e);
}
function qe(e = {}) {
	return d(e, me, { value: !0 }), e;
}
function Je() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ye = [];
function Xe() {
	var e = Ye;
	Ye = [], y(e);
}
function Ze(e) {
	if (Ye.length === 0 && !Ct) {
		var t = Ye;
		queueMicrotask(() => {
			t === Ye && Xe();
		});
	}
	Ye.push(e);
}
function Qe() {
	for (; Ye.length > 0;) Xe();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var $e = ~(S | te | x);
function O(e, t) {
	e.f = e.f & $e | t;
}
function et(e) {
	e.f & 512 || e.deps === null ? O(e, x) : O(e, te);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function tt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), O(e, x);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
var nt = !1;
function rt() {
	nt || (nt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[xe]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function it(e) {
	var t = B, n = V;
	Vn(null), Hn(null);
	try {
		return e();
	} finally {
		Vn(t), Hn(n);
	}
}
function at(e, t, n, r = n) {
	e.addEventListener(t, () => it(n));
	let i = e[xe];
	e[xe] = i ? () => {
		i(), r(!0);
	} : () => r(!0), rt();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function ot(e, t, n, r) {
	let i = Je() ? ut : pt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = st(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				pn(e, s);
			}
			ct();
		}
	}
	var d = lt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ ft(e))).then(u).catch((e) => pn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ct();
	}) : f();
}
function st() {
	var e = V, t = B, n = Ge, r = A;
	return function(i = !0) {
		Hn(e), Vn(t), Ke(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ct(e = !0) {
	Hn(null), Vn(null), Ke(null), e && A?.deactivate();
}
function lt() {
	var e = V, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ut(e) {
	var t = 2 | S;
	return V !== null && (V.f |= se), {
		ctx: Ge,
		deps: null,
		effects: null,
		equals: Pe,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: r,
		wv: 0,
		parent: V,
		ac: null
	};
}
var dt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ft(e, t, n) {
	let i = V;
	i === null && Le();
	var a = void 0, o = Bt(r), s = !B, c = /* @__PURE__ */ new Set();
	return xn(() => {
		var t = V, n = ee();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== Se && n.reject(e);
			}).finally(ct);
		} catch (e) {
			n.reject(e), ct();
		}
		var r = A;
		if (s) {
			if (t.f & 32768) var l = lt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(dt);
			else for (let e of c.values()) e.reject(dt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== dt && (r.activate(), t ? (o.f |= fe, Wt(o, t)) : (o.f & 8388608 && (o.f ^= fe), Wt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), _n(() => {
		for (let e of c) e.reject(dt);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === a ? e(o) : t(a);
			}
			n.then(r, r);
		}
		t(a);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function k(e) {
	let t = /* @__PURE__ */ ut(e);
	return Wn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function pt(e) {
	let t = /* @__PURE__ */ ut(e);
	return t.equals = Ie, t;
}
function mt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) z(t[n]);
	}
}
function ht(e) {
	var t, n = V, i = e.parent;
	if (!Rn && i !== null && e.v !== r && i.f & 24576) return we(), e.v;
	Hn(i);
	try {
		mt(e), t = nr(e);
	} finally {
		Hn(n);
	}
	return t;
}
function gt(e) {
	var t = ht(e);
	if (!e.equals(t) && (e.wv = $n(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), bt?.capture(e, t, !0)), e.deps === null))) {
		O(e, x);
		return;
	}
	Rn || (xt === null ? et(e) : (gn() || A?.is_fork) && xt.set(e, t));
}
function _t(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && it(() => {
		t.ac.abort(Se), t.ac = null;
	}), t.fn !== null && (t.teardown = v), ar(t, 0), Dn(t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && or(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var yt = null, A = null, bt = null, xt = null, St = null, Ct = !1, wt = !1, Tt = null, Et = null, Dt = 0, Ot = 1, kt = class e {
	id = Ot++;
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
		yt === null ? yt = this : (yt.#n = this, this.#t = yt), yt = this;
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
			for (var r of n.d) O(r, S), t(r);
			for (r of n.m) O(r, te), t(r);
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
					t.f ^= x;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), O(e, S), this.schedule(e);
		for (let e of this.#d) O(e, te), this.schedule(e);
		this.apply();
		for (var t = Tt = [], n = [], r = Et = []; this.#c.length > 0;) {
			Dt++ > 1e3 && (this.#S(), jt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw It(e), this.#h() || this.discard(), t;
			}
		}
		if (A = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Tt = null, Et = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Ft(e, t);
			r.length > 0 && A.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), bt = this, Nt(n), Nt(t), bt = null, this.#s?.resolve();
		var o = A;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (Rt.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= x;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= x : i & 4 ? t.push(r) : er(r) && (i & 16 && this.#d.add(r), or(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), O(i, S), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), A = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) tt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== r && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), xt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, xt = null;
	}
	flush() {
		try {
			wt = !0, A = this, this.#_();
		} finally {
			Dt = 0, St = null, Tt = null, Et = null, wt = !1, A = null, xt = null, Rt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(dt);
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
		this.#m || (this.#m = !0, Ze(() => {
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
		return (this.#s ??= ee()).promise;
	}
	static ensure() {
		if (A === null) {
			let t = A = new e();
			!wt && !Ct && Ze(() => {
				t.#e || t.flush();
			});
		}
		return A;
	}
	apply() {
		xt = null;
	}
	schedule(e) {
		if (St = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? yt = e : t.#t = e, this.linked = !1;
		}
	}
};
function At(e) {
	var t = Ct;
	Ct = !0;
	try {
		var n;
		for (e && (A !== null && !A.is_fork && A.flush(), n = e());;) {
			if (Qe(), A === null) return n;
			A.flush();
		}
	} finally {
		Ct = t;
	}
}
function jt() {
	try {
		ze();
	} catch (e) {
		pn(e, St);
	}
}
var Mt = null;
function Nt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && er(r) && (Mt = /* @__PURE__ */ new Set(), or(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && An(r), Mt?.size > 0)) {
				Rt.clear();
				for (let e of Mt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Mt.has(n) && (Mt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || or(n);
					}
				}
				Mt.clear();
			}
		}
		Mt = null;
	}
}
function Pt(e) {
	A.schedule(e);
}
function Ft(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), O(e, x);
		for (var n = e.first; n !== null;) Ft(n, t), n = n.next;
	}
}
function It(e) {
	O(e, x);
	for (var t = e.first; t !== null;) It(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Lt = /* @__PURE__ */ new Set(), Rt = /* @__PURE__ */ new Map(), zt = !1;
function Bt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Pe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function j(e, t) {
	let n = Bt(e, t);
	return Wn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Vt(e, t = !1, n = !0) {
	let r = Bt(e);
	return t || (r.equals = Ie), r;
}
function M(e, t, n = !1) {
	return B !== null && (!Bn || B.f & 131072) && Je() && B.f & 4325394 && (Un === null || !Un.has(e)) && Ue(), Wt(e, n ? Jt(t) : t, Et);
}
var Ht = null, Ut = 0;
function Wt(e, t, n = null) {
	if (!e.equals(t)) {
		Rn ? Rt.set(e, t) : Rt.has(e) || Rt.set(e, e.v);
		var r = kt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && ht(t), xt === null && et(t);
		}
		e.wv = $n(), Ht = null, Ut = 0, qt(e, S, n), Ht = null, Je() && V !== null && V.f & 1024 && !(V.f & 96) && (qn === null ? Jn([e]) : qn.push(e)), !r.is_fork && Lt.size > 0 && !zt && Gt();
	}
	return t;
}
function Gt() {
	zt = !1;
	for (let e of Lt) {
		e.f & 1024 && O(e, te);
		let t;
		try {
			t = er(e);
		} catch {
			t = !0;
		}
		t && or(e);
	}
	Lt.clear();
}
function Kt(e) {
	M(e, e.v + 1);
}
function qt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Je(), a = r.length;
		if (Ut += a, Ut > 1e5 && Ht === null && (Ht = /* @__PURE__ */ new Set()), Ht !== null) {
			if (Ht.has(e)) return;
			Ht.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== V) {
				var l = (c & S) === 0;
				if (l && O(s, t), c & 131072) Lt.add(s);
				else if (c & 2) {
					var u = s;
					xt?.delete(u), qt(u, te, n);
				} else if (l) {
					var d = s;
					c & 16 && Mt !== null && Mt.add(d), n === null ? Pt(d) : n.push(d);
				}
			}
		}
	}
}
function Jt(e) {
	if (typeof e != "object" || !e || pe in e || me in e) return e;
	let t = g(e);
	if (t !== m && t !== h) return e;
	var n = /* @__PURE__ */ new Map(), i = s(e), a = /* @__PURE__ */ j(0), o = null, c = Zn, l = (e) => {
		if (Zn === c) return e();
		var t = B, n = Zn;
		Vn(null), Qn(c);
		var r = e();
		return Vn(t), Qn(n), r;
	};
	return i && n.set("length", /* @__PURE__ */ j(e.length, o)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && Ve();
			var i = n.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ j(r.value, o);
				return n.set(t, e), e;
			}) : M(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = n.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ j(r, o));
					n.set(t, e), Kt(a);
				}
			} else M(i, r), Kt(a);
			return !0;
		},
		get(t, i, a) {
			if (i === pe) return e;
			var s = n.get(i), c = i in t;
			if (s === void 0 && (!c || f(t, i)?.writable) && (s = l(() => /* @__PURE__ */ j(Jt(c ? t[i] : r), o)), n.set(i, s)), s !== void 0) {
				var u = H(s);
				return u === r ? void 0 : u;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var i = Reflect.getOwnPropertyDescriptor(e, t), a = n.get(t);
			if (a !== void 0) {
				var o = H(a);
				if (o === r) return;
				if (i && "value" in i) i.value = o;
				else return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return i;
		},
		has(e, t) {
			if (t === pe) return !0;
			var i = n.get(t), a = i !== void 0 && i.v !== r || Reflect.has(e, t);
			return (i !== void 0 || V !== null && (!a || f(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ j(a ? Jt(e[t]) : r, o)), n.set(t, i)), H(i) === r) ? !1 : a;
		},
		set(e, t, s, c) {
			var u = n.get(t), d = t in e;
			if (i && t === "length") for (var p = s; p < u.v; p += 1) {
				var m = n.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ j(r, o)), n.set(p + "", m)) : M(m, r);
			}
			if (u === void 0) (!d || f(e, t)?.writable) && (u = l(() => /* @__PURE__ */ j(void 0, o)), M(u, Jt(s)), n.set(t, u));
			else {
				d = u.v !== r;
				var h = l(() => Jt(s));
				M(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, s), !d) {
				if (i && typeof t == "string") {
					var _ = n.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && M(_, v + 1);
				}
				Kt(a);
			}
			return !0;
		},
		ownKeys(e) {
			H(a);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== r;
			});
			for (var [i, o] of n) o.v !== r && !(i in e) && t.push(i);
			return t;
		},
		setPrototypeOf() {
			He();
		}
	});
}
function Yt(e) {
	try {
		if (typeof e == "object" && e && pe in e) return e[pe];
	} catch {}
	return e;
}
function Xt(e, t) {
	return Object.is(Yt(e), Yt(t));
}
var Zt, Qt, $t, en;
function tn() {
	if (Zt === void 0) {
		Zt = window, Qt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		$t = f(t, "firstChild").get, en = f(t, "nextSibling").get, _(e) && (e[ve] = void 0, e[_e] = null, e[ye] = void 0, e.__e = void 0), _(n) && (n[be] = void 0);
	}
}
function N(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function nn(e) {
	return $t.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function rn(e) {
	return en.call(e);
}
function P(e, t) {
	if (!C) return /* @__PURE__ */ nn(e);
	var n = /* @__PURE__ */ nn(w);
	if (n === null) n = w.appendChild(N());
	else if (t && n.nodeType !== 3) {
		var r = N();
		return n?.before(r), ke(r), r;
	}
	return t && dn(n), ke(n), n;
}
function F(e, t = !1) {
	if (!C) {
		var n = /* @__PURE__ */ nn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ rn(n) : n;
	}
	if (t) {
		if (w?.nodeType !== 3) {
			var r = N();
			return w?.before(r), ke(r), r;
		}
		dn(w);
	}
	return w;
}
function I(e, t = !1) {
	if (!C) return /* @__PURE__ */ nn(e);
	var n = P(e, t);
	return T(e), n;
}
function L(e, t = 1, n = !1) {
	let r = C ? w : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ rn(r);
	if (!C) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = N();
			return r === null ? i?.after(a) : r.before(a), ke(a), a;
		}
		dn(r);
	}
	return ke(r), r;
}
function an(e) {
	e.textContent = "";
}
function on() {
	return !1;
}
function sn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function cn() {
	return document.createDocumentFragment();
}
function ln(e = "") {
	return document.createComment(e);
}
function un(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function dn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function fn(e) {
	var t = V;
	if (t === null) return B.f |= fe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	pn(e, t);
}
function pn(e, t) {
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
function mn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function hn(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= ne);
	var r = {
		ctx: Ge,
		deps: null,
		nodes: null,
		f: e | S | 512,
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
	A?.register_created_effect(r);
	var i = r;
	if (e & 4) Tt === null ? kt.ensure().schedule(r) : Tt.push(r);
	else if (t !== null) {
		try {
			or(r);
		} catch (e) {
			throw z(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= oe));
	}
	if (i !== null && (i.parent = n, n !== null && mn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function gn() {
	return B !== null && !Bn;
}
function _n(e) {
	let t = hn(8, null);
	return O(t, x), t.teardown = e, t;
}
function vn(e) {
	return hn(4 | ce, e);
}
function yn(e) {
	kt.ensure();
	let t = hn(64 | se, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? jn(t, () => {
			z(t), n(void 0);
		}) : (z(t), n(void 0));
	});
}
function bn(e) {
	return hn(4, e);
}
function xn(e) {
	return hn(de | se, e);
}
function Sn(e, t = 0) {
	return hn(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	ot(r, t, n, (t) => {
		hn(8, () => {
			e(...t.map(H));
		});
	});
}
function Cn(e, t = 0) {
	return hn(16 | t, e);
}
function wn(e, t = 0) {
	return hn(b | t, e);
}
function Tn(e) {
	return hn(32 | se, e);
}
function En(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Rn, r = B;
		zn(!0), Vn(null);
		try {
			t.call(null);
		} catch (t) {
			pn(t, e.parent);
		} finally {
			zn(n), Vn(r);
		}
	}
}
function Dn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && it(() => {
			e.abort(Se);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : z(n, t), n = r;
	}
}
function On(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || z(t), t = n;
	}
}
function z(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (kn(e.nodes.start, e.nodes.end), n = !0), e.f |= ae, Dn(e, t && !n), ar(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	En(e), e.f ^= ae, e.f |= re;
	var i = e.parent;
	i !== null && i.first !== null && An(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function kn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ rn(e);
		e.remove(), e = n;
	}
}
function An(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function jn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Mn(e, r, !0);
	var i = () => {
		n && z(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Mn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ne;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Mn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Nn(e) {
	e.f &= -257, Pn(e, !0);
}
function Pn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ne, e.f & 1024 || (O(e, S), kt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Pn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Fn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ rn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var In = null, Ln = !1, Rn = !1;
function zn(e) {
	Rn = e;
}
var B = null, Bn = !1;
function Vn(e) {
	B = e;
}
var V = null;
function Hn(e) {
	V = e;
}
var Un = null;
function Wn(e) {
	B !== null && (B.f & 2097152 || B.f & 2) && (Un ??= /* @__PURE__ */ new Set()).add(e);
}
var Gn = null, Kn = 0, qn = null;
function Jn(e) {
	qn = e;
}
var Yn = 1, Xn = 0, Zn = Xn;
function Qn(e) {
	Zn = e;
}
function $n() {
	return ++Yn;
}
function er(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (er(a) && gt(a), a.wv > e.wv) return !0;
		}
		t & 512 && xt === null && O(e, x);
	}
	return !1;
}
function tr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Un !== null && Un.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? tr(a, t, !1) : t === a && (n ? O(a, S) : a.f & 1024 && O(a, te), Pt(a));
	}
}
function nr(e) {
	var t = Gn, n = Kn, r = qn, i = B, a = Un, o = Ge, s = Bn, c = Zn, l = e.f;
	Gn = null, Kn = 0, qn = null, B = l & 96 ? null : e, Un = null, Ke(e.ctx), Bn = !1, Zn = ++Xn, e.ac !== null && (it(() => {
		e.ac.abort(Se);
	}), e.ac = null);
	try {
		e.f |= ue;
		var u = e.fn, d = u();
		e.f |= ie;
		var f = rr(e);
		if (Je() && qn !== null && !Bn && f !== null && !(e.f & 6146)) for (var p = 0; p < qn.length; p++) tr(qn[p], e);
		if (i !== null && i !== e) {
			if (Xn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Xn;
			if (t !== null) for (let e of t) e.rv = Xn;
			qn !== null && (r === null ? r = qn : r.push(...qn));
		}
		return e.f & 8388608 && (e.f ^= fe), d;
	} catch (t) {
		return rr(e), fn(t);
	} finally {
		e.f ^= ue, Gn = t, Kn = n, qn = r, B = i, Un = a, Ke(o), Bn = s, Zn = c;
	}
}
function rr(e) {
	var t = e.deps, n = A?.is_fork;
	if (Gn !== null) {
		var r;
		if (n || ar(e, Kn), t !== null && Kn > 0) for (t.length = Kn + Gn.length, r = 0; r < Gn.length; r++) t[Kn + r] = Gn[r];
		else e.deps = t = Gn;
		if (gn() && e.f & 512) for (r = Kn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Kn < t.length && (ar(e, Kn), t.length = Kn);
	return t;
}
function ir(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var i = c.call(n, e);
		if (i !== -1) {
			var a = n.length - 1;
			a === 0 ? n = t.reactions = null : (n[i] = n[a], n.pop());
		}
	}
	if (n === null && t.f & 2 && (Gn === null || !l.call(Gn, t))) {
		var o = t;
		o.f & 512 && (o.f ^= 512), o.v !== r && et(o), o.ac !== null && it(() => {
			o.ac.abort(Se), o.ac = null, O(o, S);
		}), _t(o), ar(o, 0);
	}
}
function ar(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) ir(e, n[r]);
}
function or(e) {
	var t = e.f;
	if (!(t & 16384)) {
		O(e, x);
		var n = V, r = Ln;
		V = e, Ln = !(t & 96);
		try {
			t & 16777232 ? On(e) : Dn(e), En(e);
			var i = nr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Yn;
		} finally {
			Ln = r, V = n;
		}
	}
}
async function sr() {
	await Promise.resolve(), At();
}
function H(e) {
	var t = !!(e.f & 2);
	if (In?.add(e), B !== null && !Bn && !(V !== null && V.f & 16384) && (Un === null || !Un.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < Xn && (e.rv = Xn, Gn === null && n !== null && n[Kn] === e ? Kn++ : Gn === null ? Gn = [e] : Gn.push(e));
		else {
			B.deps ??= [], l.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : l.call(r, B) || r.push(B);
		}
	}
	if (Rn && Rt.has(e)) return Rt.get(e);
	if (t) {
		var i = e;
		if (Rn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || lr(i)) && (a = ht(i)), Rt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Bn && B !== null && (Ln || !!(B.f & 512)), s = (i.f & ie) === 0;
		er(i) && (o && (i.f |= 512), gt(i)), o && !s && (vt(i), cr(i));
	}
	if (xt?.has(e)) return xt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function cr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (vt(t), cr(t));
}
function lr(e) {
	if (e.v === r) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rt.has(t) || t.f & 2 && lr(t)) return !0;
	return !1;
}
function ur(e) {
	var t = Bn;
	try {
		return Bn = !0, e();
	} finally {
		Bn = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var dr = Symbol("events"), fr = /* @__PURE__ */ new Set(), pr = /* @__PURE__ */ new Set();
function mr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || br.call(t, e), !e.cancelBubble) return it(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Ze(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function hr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = mr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && _n(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function gr(e, t, n) {
	(t[dr] ??= {})[e] = n;
}
function _r(e) {
	for (var t = 0; t < e.length; t++) fr.add(e[t]);
	for (var n of pr) n(e);
}
var vr = null, yr = !1;
function br(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	vr = e, yr || (yr = !0, setTimeout(() => {
		yr = !1, vr = null;
	}));
	var o = 0, s = vr === e && e[dr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[dr] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		d(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = B, f = V;
		Vn(null), Hn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[dr]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[dr] = t, delete e.currentTarget, Vn(u), Hn(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var xr = Ce ? "template" : "TEMPLATE";
function Sr(e, t) {
	var n = V;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function Cr(e, t) {
	var n = cn();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(N(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(ln(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = r, u = e === "svg" ? a : e === "math" ? o : t;
		var i = sn(e, u, c?.is);
		for (var s in c) un(i, s, c[s]);
		l.length > 0 && (i.nodeName === xr ? i.content : i).append(Cr(l, i.nodeName === "foreignObject" ? void 0 : u)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function U(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (C) return Sr(w, null), w;
		i === void 0 && (i = Cr(e, t & 4 ? a : t & 8 ? o : void 0), n || (i = /* @__PURE__ */ nn(i)));
		var s = r || Qt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ nn(s), l = s.lastChild;
			Sr(c, l);
		} else Sr(s, s);
		return s;
	};
}
function wr(e = "") {
	if (!C) {
		var t = N(e + "");
		return Sr(t, t), t;
	}
	var n = w;
	return n.nodeType === 3 ? dn(n) : (n.before(n = N()), ke(n)), Sr(n, n), n;
}
function W() {
	if (C) return Sr(w, null), w;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = N();
	return e.append(t, n), Sr(t, n), e;
}
function G(e, t) {
	if (C) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = w), Ae();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Tr = ["touchstart", "touchmove"];
function Er(e) {
	return Tr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Dr(e) {
	let t = 0, n = Bt(0), r;
	return () => {
		gn() && (H(n), Sn(() => (t === 0 && (r = ur(() => e(() => Kt(n)))), t += 1, () => {
			Ze(() => {
				--t, t === 0 && (r?.(), r = void 0, Kt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Or = oe | se;
function kr(e, t, n, r) {
	new Ar(e, t, n, r);
}
var Ar = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = C ? w : null;
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
	#h = Dr(() => (this.#m = Bt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Cn(() => {
			if (C) {
				let e = this.#t;
				Ae();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Or), C && (this.#e = w);
	}
	#g() {
		try {
			this.#a = Tn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Ze(r), t && (this.#s = Tn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				De();
				return;
			}
			t = !0, n && We(), this.#s !== null && jn(this.#s, () => {
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
					pn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Tn(() => e(this.#e)), Ze(() => {
			var e = this.#c = document.createDocumentFragment(), t = N(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return Tn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						pn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(A);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, jn(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Tn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Fn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Tn(() => t(this.#e));
			} else this.#x(A);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		tt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = V, n = B, r = Ge;
		Hn(this.#i), Vn(this.#i), Ke(this.#i.ctx);
		try {
			return kt.ensure(), e();
		} finally {
			Hn(t), Vn(n), Ke(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && jn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ze(() => {
			this.#d = !1, this.#m && Wt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), H(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (z(this.#a), null), this.#o &&= (z(this.#o), null), this.#s &&= (z(this.#s), null), C && (ke(this.#t), je(), ke(Me()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Tn(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return pn(e, this.#i.parent), null;
				}
			}));
		};
		Ze(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				pn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => pn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function K(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[be] ??= e.nodeValue) && (e[be] = n, e.nodeValue = `${n}`);
}
function jr(e, t) {
	return Nr(e, t);
}
var Mr = /* @__PURE__ */ new Map();
function Nr(e, { target: t, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	tn();
	var l = void 0, d = yn(() => {
		var s = r ?? t.appendChild(N());
		kr(s, { pending: () => {} }, (t) => {
			E({});
			var r = Ge;
			if (o && (r.c = o), a && (i.$$events = a), C && Sr(t, null), l = e(t, i) || qe(), C && (V.nodes.end = w, w === null || w.nodeType !== 8 || w.data !== "]")) throw Te(), n;
			D();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = Er(r);
					for (let e of [t, document]) {
						var a = Mr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Mr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, br, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(u(fr)), pr.add(f), () => {
			for (var e of d) for (let r of [t, document]) {
				var n = Mr.get(r), i = n.get(e);
				--i == 0 ? (r.removeEventListener(e, br), n.delete(e), n.size === 0 && Mr.delete(r)) : n.set(e, i);
			}
			pr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Pr.set(l, d), l;
}
var Pr = /* @__PURE__ */ new WeakMap();
function Fr(e, t) {
	let n = Pr.get(e);
	return n ? (Pr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Ir = class {
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
			if (n) Nn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Nn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (z(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Fn(r, t), t.append(N()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else z(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), jn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (z(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = on();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = N();
				i.append(a), this.#n.set(e, {
					effect: Tn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Tn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else C && (this.anchor = w), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function Lr(e, t, ...n) {
	var r = new Ir(e);
	Cn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, oe);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function q(e, t, n = !1) {
	var r;
	C && (r = w, Ae());
	var i = new Ir(e), a = n ? oe : 0;
	function o(e, t) {
		if (C) {
			var n = Ne(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Me();
				ke(a), i.anchor = a, Oe(!1), i.ensure(e, t), Oe(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Cn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Rr(e, t) {
	return t;
}
function zr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		jn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Br(e, u(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, d = l.parentNode;
			an(d), d.append(l), e.items.clear();
		}
		Br(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Br(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= le, Fn(a, document.createDocumentFragment())) : z(t[i], n);
	}
}
var Vr;
function J(e, t, n, r, i, a = null) {
	var o = e, c = /* @__PURE__ */ new Map();
	if (t & 4) {
		var l = e;
		o = C ? ke(/* @__PURE__ */ nn(l)) : l.appendChild(N());
	}
	C && Ae();
	var d = null, f = /* @__PURE__ */ pt(() => {
		var e = n();
		return s(e) ? e : e == null ? [] : u(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Ur(v, p, o, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= le, Gr(d, null, o)) : Nn(d) : jn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Cn(() => {
			p = H(f);
			var e = p.length;
			let s = !1;
			C && Ne(o) === "[!" != (e === 0) && (o = Me(), ke(o), Oe(!1), s = !0);
			for (var l = /* @__PURE__ */ new Set(), u = A, v = on(), y = 0; y < e; y += 1) {
				C && w.nodeType === 8 && w.data === "]" && (o = w, s = !0, Oe(!1));
				var ee = p[y], b = r(ee, y), x = h ? null : c.get(b);
				x ? (x.v && Wt(x.v, ee), x.i && Wt(x.i, y), v && u.unskip_effect(x.e)) : (x = Wr(c, h ? o : Vr ??= N(), ee, b, y, i, t, n), h || (x.e.f |= le), c.set(b, x)), l.add(b);
			}
			if (e === 0 && a && !d && (h ? d = Tn(() => a(o)) : (d = Tn(() => a(Vr ??= N())), d.f |= le)), e > l.size && Re("", "", ""), C && e > 0 && ke(Me()), !h) {
				if (m.set(u, l), v) {
					for (let [e, t] of c) l.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			s && Oe(!0), H(f);
		}),
		flags: t,
		items: c,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, C && (o = w);
}
function Hr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Ur(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = Hr(e.effect.first), l, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Nn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= le, _ === c) Gr(_, null, n);
			else {
				var y = d ? d.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Kr(e, d, _), Kr(e, _, y), Gr(_, y, n), d = _, p = [], m = [], c = Hr(d.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var ee = m[0], b;
					d = ee.prev;
					var x = p[0], S = p[p.length - 1];
					for (b = 0; b < p.length; b += 1) Gr(p[b], ee, n);
					for (b = 0; b < m.length; b += 1) l.delete(m[b]);
					Kr(e, x.prev, S.next), Kr(e, d, x), Kr(e, S, ee), c = ee, d = S, --v, p = [], m = [];
				} else l.delete(_), Gr(_, c, n), Kr(e, _.prev, _.next), Kr(e, _, d === null ? e.effect.first : d.next), Kr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = Hr(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, c = Hr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Br(e, u(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var te = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || te.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && te.push(c), c = Hr(c.next);
		var ne = te.length;
		if (ne > 0) {
			var re = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.measure();
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.fix();
			}
			zr(e, te, re);
		}
	}
	a && Ze(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Wr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Bt(n) : /* @__PURE__ */ Vt(n, !1, !1) : null, l = o & 2 ? Bt(i) : null;
	return {
		v: c,
		i: l,
		e: Tn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Gr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ rn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Kr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function qr(e, t) {
	var n = void 0, r;
	wn(() => {
		n !== (n = t()) && (r &&= (z(r), null), n && (r = Tn(() => {
			bn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Jr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Jr(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Yr() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Jr(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function Xr(e) {
	return typeof e == "object" ? Yr(e) : e ?? "";
}
var Zr = [..." 	\n\r\f\xA0\v﻿"];
function Qr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Zr.includes(r[o - 1])) && (s === r.length || Zr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function $r(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ei(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function ti(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ei)), i && c.push(...Object.keys(i).map(ei));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ei(e.substring(l, u).trim());
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
		return r && (n += $r(r)), i && (n += $r(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function ni(e, t, n, r, i, a) {
	var o = e[ve];
	if (C || o !== n || o === void 0) {
		var s = Qr(n, r, a);
		(!C || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ve] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function ri(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function ii(e, t, n, r) {
	var i = e[ye];
	if (C || i !== t) {
		var a = ti(t, r);
		(!C || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ye] = t;
	} else r && (Array.isArray(r) ? (ri(e, n?.[0], r[0]), ri(e, n?.[1], r[1], "important")) : ri(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ai(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function oi(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || s(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = ui(c);
			ai(c, r ? i.includes(l) : Xt(l, n));
		}
		if (t) {
			if (o !== null) for (c of e.options) {
				var u = o.has(c);
				c.selected !== u && (c.selected = u);
			}
			else e.selectedIndex !== a && (e.selectedIndex = a);
		}
	}
}
function si(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!s(t)) return Ee();
		for (var r of e.options) r.selected = t.includes(ui(r));
		return;
	}
	for (r of e.options) if (Xt(ui(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function ci(e) {
	var t = new MutationObserver((t) => {
		t.every(di) || ("__defaultValue" in e && oi(e, !1), "__value" in e && si(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), _n(() => {
		t.disconnect();
	});
}
function li(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	at(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ui);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ui(o);
		}
		n(a), e.__value = a, A !== null && r.add(A);
	}), bn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = A;
			if (r.has(o)) return;
		}
		if (si(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = ui(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function ui(e) {
	return "__value" in e ? e.__value : e.value;
}
function di(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var fi = Symbol("is custom element"), pi = Symbol("is html"), mi = Ce ? "link" : "LINK";
function hi(e) {
	if (C) {
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
		e[xe] = n, Ze(n), rt();
	}
}
function Y(e, t, n, r) {
	var i = gi(e);
	C && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === mi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ge] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && vi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function gi(e) {
	return e[_e] ??= {
		[fi]: e.nodeName.includes("-"),
		[pi]: e.namespaceURI === i
	};
}
var _i = /* @__PURE__ */ new Map();
function vi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = _i.get(t);
	if (n) return n;
	_i.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = p(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = g(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function yi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	at(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = bi(e) ? xi(a) : a, n(a), A !== null && r.add(A), await sr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (C && e.defaultValue !== e.value || ur(t) == null && e.value) && (n(bi(e) ? xi(e.value) : e.value), A !== null && r.add(A)), Sn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = A;
			if (r.has(i)) return;
		}
		bi(e) && n === xi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function bi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function xi(e) {
	return e === "" ? null : +e;
}
var Si = /* @__PURE__ */ new class e {
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
function Ci(e, t, n) {
	var r = Si.observe(e, () => n(e[t]));
	bn(() => (ur(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var wi = !1;
function Ti(e) {
	var t = wi;
	try {
		return wi = !1, [e(), wi];
	} finally {
		wi = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Ei(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ ut(r), H(l)) : (c && (c = !1, s = o ? ur(r) : r), s);
	let d;
	if (a) {
		var p = pe in e || he in e;
		d = f(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = Ti(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = u(), d && (i && Be(t), d(m)));
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
	var v = !1, y = (n & 1 ? ut : pt)(() => (v = !1, g()));
	a && H(y);
	var ee = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && a ? Jt(e) : e;
			return M(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Rn && v || ee.f & 16384 ? y.v : H(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var Di = /* @__PURE__ */ U([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function Oi(e, t) {
	E(t, !0);
	var n = Di(), r = I(n, !0);
	R(() => K(r, t.messages.text)), G(e, n), D();
}
var ki = 12;
function Ai(e) {
	return Math.max(320, e);
}
function ji(e, t) {
	return e && t ? e / t : 1;
}
function Mi(e, t, n, r) {
	return (e - t) * r / (n || r);
}
function Ni(e, t, n) {
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
function Pi(e, t, n) {
	return Math.max(0, Math.min(e + ki, n - t));
}
function Fi(e, t = 8) {
	let n = Math.max(1, Math.ceil(e / t));
	return Array.from({ length: Math.ceil(e / n) }, (e, t) => t * n);
}
function Ii(e) {
	return Math.round(e) + .5;
}
//#endregion
//#region src/lib/colors.ts
var Li = /* @__PURE__ */ t({
	BACKGROUND_EFFORT: () => Hi,
	EFFORT_ORDER: () => Bi,
	EFFORT_SHADES: () => Gi,
	HATCH_SHADES: () => Ki,
	HATCH_TURNS: () => qi,
	KNOWN_MODELS: () => Ri,
	SLOT_COUNT: () => 8,
	effortHatch: () => Qi,
	effortLabel: () => Wi,
	effortName: () => Ui,
	effortRank: () => Vi,
	effortShade: () => Zi,
	hatchTurn: () => $i,
	modelSlots: () => zi,
	shade: () => Xi,
	slotColor: () => Yi,
	swatchFill: () => ea
}), Ri = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function zi(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Ri.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !Ri.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var Bi = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function Vi(e) {
	let t = Bi.indexOf(e);
	return t === -1 ? Bi.length : t;
}
var Hi = "background";
function Ui(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function Wi(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var Gi = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, Ki = {
	background: 1,
	ultracode: 4
}, qi = {
	background: -45,
	ultracode: 45
};
function Ji(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function Yi(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function Xi(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? Yi(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function Zi(e, t) {
	return Xi(e, Ji(Gi, t) ?? 0);
}
function Qi(e, t) {
	let n = Ji(Ki, t);
	return n ? Xi(e, n) : null;
}
function $i(e) {
	return Ji(qi, e);
}
function ea(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var ta = /* @__PURE__ */ t({
	ago: () => ya,
	compact: () => X,
	dayText: () => fa,
	duration: () => ua,
	longDay: () => ma,
	longHour: () => _a,
	money: () => Q,
	parseDay: () => da,
	parseHour: () => ha,
	percent: () => la,
	shortDay: () => pa,
	shortHour: () => ga,
	signed: () => ca,
	when: () => va,
	whole: () => Z
}), na = "–", ra = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), ia = new Intl.NumberFormat("en"), aa = {
	month: "short",
	day: "numeric"
}, oa = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, sa = {
	hour: "2-digit",
	minute: "2-digit"
};
function X(e) {
	return e == null ? na : ra.format(e);
}
function ca(e) {
	return e < 0 ? `−${X(-e)}` : `+${X(e)}`;
}
function Z(e) {
	return e == null ? na : ia.format(e);
}
function Q(e) {
	return e == null ? na : Math.abs(e) >= 1e3 ? "$" + ra.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function la(e, t) {
	if (!t) return na;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function ua(e) {
	if (e == null) return na;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function da(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function fa(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function pa(e, t) {
	return da(e).toLocaleDateString(t, aa);
}
function ma(e, t) {
	return da(e).toLocaleDateString(t, oa);
}
function ha(e) {
	let [t = "", n = "0"] = e.split("T"), r = da(t);
	return r.setHours(Number(n)), r;
}
function ga(e, t) {
	return ha(e).toLocaleTimeString(t, sa);
}
function _a(e, t) {
	let n = ha(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, sa);
	return `${n.toLocaleDateString(t, oa)}, ${i(n)}–${i(r)}`;
}
function va(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...aa,
		...sa
	}) : na;
}
function ya(e, t = Date.now(), n) {
	if (!e) return na;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : va(e, n);
}
//#endregion
//#region src/lib/charts.ts
var ba = /* @__PURE__ */ t({
	LIMIT_ICON: () => "⚠",
	NO_USAGE: () => Na,
	RATE_LIMIT: () => za,
	bandIndex: () => Da,
	barShare: () => Ja,
	bucketTotals: () => Pa,
	chartSeries: () => Fa,
	columnPath: () => ka,
	columnTotals: () => La,
	columnWidth: () => Oa,
	costSplit: () => Ka,
	costTop: () => qa,
	errorText: () => Ha,
	inputTotal: () => xa,
	limitCounts: () => Ua,
	limitTop: () => wa,
	limitType: () => Va,
	lineX: () => Ta,
	modelGroups: () => Ia,
	nearestIndex: () => Ea,
	niceMax: () => Sa,
	peakIndex: () => Aa,
	rangeDays: () => ja,
	stackSegments: () => Ra,
	ticks: () => Ca,
	timeBuckets: () => Ma,
	windowHitAfter: () => Wa,
	windowSpan: () => Ga
});
function xa(e) {
	return e.new_input + e.cache_write + e.cache_read;
}
function Sa(e) {
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
function Ca(e, t) {
	return Array.from({ length: t + 1 }, (n, r) => e * r / t);
}
function wa(e) {
	return Math.max(2, Math.ceil(Sa(e) / 2) * 2);
}
function Ta(e, t, n) {
	let r = e - 1;
	return (e) => r > 0 ? t + (n - t) * e / r : (t + n) / 2;
}
function Ea(e, t, n) {
	return (r) => n > 1 ? Math.round((r - e) / (t - e) * (n - 1)) : 0;
}
function Da(e, t) {
	return (n) => Math.floor((n - e) / t);
}
function Oa(e, t = 24) {
	return Math.max(2, Math.min(t, e * .6));
}
function ka(e, t, n, r, i, a = 4) {
	let o = i ? Math.min(a, n / 2, r) : 0;
	return `M${e},${t + r}V${t + o}` + (o ? `Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}` : `H${e + n}`) + `V${t + r}Z`;
}
function Aa(e) {
	return e.indexOf(Math.max(...e));
}
function ja(e, t = /* @__PURE__ */ new Date()) {
	let n = [];
	for (let r = da(e); r <= t; r.setDate(r.getDate() + 1)) n.push(fa(r));
	return n;
}
function Ma(e, t = /* @__PURE__ */ new Date()) {
	if (e.days !== 1 || !e.hour_model) return {
		keys: ja(e.since, t),
		unit: "day",
		heading: "Day",
		short: pa,
		long: ma,
		keyOf: (e) => e.day ?? ""
	};
	let n = e.since === fa(t) ? t.getHours() : 23, r = [];
	for (let t = 0; t <= n; t += 1) r.push(`${e.since}T${String(t).padStart(2, "0")}`);
	return {
		keys: r,
		unit: "hour",
		heading: "Hour",
		short: ga,
		long: _a,
		keyOf: (e) => e.hour ?? ""
	};
}
var Na = {
	cost: 0,
	input: 0,
	output: 0
};
function Pa(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			cost: 0,
			input: 0,
			output: 0
		};
		i.cost += r.cost || 0, i.input += xa(r), i.output += r.output, n.set(e, i);
	}
	return n;
}
function Fa(e, t, n) {
	let r = zi([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${Ui(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: Zi(e, a.effort),
			hatch: Qi(e, a.effort),
			turn: $i(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : Vi(e);
	return [...i.values()].sort((e, t) => (e.slot ?? 8) - (t.slot ?? 8) || e.model.localeCompare(t.model) || a(e.effort) - a(t.effort) || String(e.effort).localeCompare(String(t.effort)));
}
function Ia(e) {
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
function La(e, t) {
	return t.map((t) => e.reduce((e, n) => e + (n.values.get(t) ?? 0), 0));
}
function Ra(e, t, n, r = 2, i = 4) {
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
var za = "rate_limit", Ba = {
	five_hour: "5-hour limit",
	seven_day: "weekly limit",
	seven_day_opus: "weekly Opus limit"
};
function Va(e) {
	return e ? Object.hasOwn(Ba, e) ? Ba[e] ?? e : e.replaceAll("_", " ") : "–";
}
function Ha(e) {
	let t = e.status ? ` (${e.status})` : "";
	return e.error === "rate_limit" ? `⚠ Rate limit${t}` : `${e.error.replaceAll("_", " ")}${t}`;
}
function Ua(e, t) {
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
function Wa(e) {
	return Date.parse(e.first_hit) - Date.parse(e.start);
}
function Ga(e, t) {
	let n = new Date(e.start), r = new Date(e.resets_at), i = n.toDateString() === r.toDateString() ? r.toLocaleTimeString(t, {
		hour: "2-digit",
		minute: "2-digit"
	}) : va(e.resets_at, t);
	return `${va(e.start, t)} – ${i}`;
}
function Ka(e) {
	let t = e.cost_parts.cache_read;
	return {
		cacheRead: t,
		rest: Math.max(0, (e.cost || 0) - t)
	};
}
function qa(e) {
	return Math.max(0, ...e.map((e) => e.cost || 0)) || 1;
}
function Ja(e, t) {
	return 100 * (e || 0) / t;
}
//#endregion
//#region src/lib/bymodel.ts
var Ya = {
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
		value: xa,
		format: X
	}
}, Xa = Object.keys(Ya);
function Za(e) {
	return Xa.find((t) => t === e) ?? "cost";
}
var Qa = 248;
function $a(e, t, n = /* @__PURE__ */ new Date()) {
	let r = Ya[t], i = Ma(e, n), a = Fa(i.unit === "hour" ? e.hour_model_effort : e.day_model_effort, i.keyOf, r.value);
	return {
		buckets: i,
		series: a,
		totals: La(a, i.keys),
		metric: r
	};
}
function eo(e, t) {
	let n = e - 8, r = (n - 56) / t;
	return {
		right: n,
		band: r,
		barWidth: Oa(r, 24)
	};
}
function to(e, t) {
	return Da(56, eo(e, t).band);
}
function no(e, t, n) {
	let { band: r, barWidth: i } = eo(e, t);
	return 56 + r * n + (r - i) / 2;
}
function ro(e, t, n) {
	let r = e.filter((e) => (e.values.get(t) ?? 0) > 0), i = r.map((e) => 220 * (e.values.get(t) ?? 0) / n);
	return Ra(r.map((e) => e.model), i, 220, 2, 4).map((e) => ({
		entry: r[e.position],
		segment: e
	}));
}
function io(e) {
	let t = e.filter((e) => e.hatch).map((e, t) => ({
		id: `model-hatch-${t}`,
		entry: e
	})), n = new Map(t.map((e) => [e.entry, e.id]));
	return {
		patterns: t,
		fill: (e) => n.has(e) ? `url(#${n.get(e)})` : e.color
	};
}
function ao(e, t) {
	return `${e.label} per ${t} by model and effort level; table view available`;
}
function oo(e, t) {
	return `${e.label} per ${t}; arrow keys step through them`;
}
function so(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${e.metric.format(e.totals[t] ?? 0)}`;
}
function co(e) {
	return Ia(e).map((e) => ({
		model: e.model,
		entries: e.entries.map((e) => ({
			entry: e,
			text: Wi(e.effort)
		}))
	}));
}
function lo(e, t) {
	return Ia(e.filter((e) => e.values.get(t))).map((e) => ({
		model: e.model,
		value: e.entries.reduce((e, n) => e + (n.values.get(t) ?? 0), 0),
		efforts: e.entries.slice().reverse().map((e) => ({
			entry: e,
			text: Wi(e.effort),
			value: e.values.get(t) ?? 0
		}))
	}));
}
function uo(e) {
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
//#region node_modules/svelte/src/reactivity/map.js
var fo = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ j(0);
	#n = /* @__PURE__ */ j(0);
	#r = Zn || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return Zn === this.#r ? /* @__PURE__ */ j(e) : Bt(e);
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
		if (r === void 0) r = this.#i(0), n.set(e, r), M(this.#n, super.size), Kt(o);
		else if (i !== t) {
			Kt(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && Kt(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), M(n, -1)), r && (M(this.#n, super.size), Kt(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			M(this.#n, 0);
			for (var t of e.values()) M(t, -1);
			Kt(this.#t), e.clear();
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
}, po = /* @__PURE__ */ t({
	Payload: () => mo,
	payload: () => ho,
	setPayload: () => go
}), mo = class {
	#e = /* @__PURE__ */ j(null);
	#t = /* @__PURE__ */ j(!1);
	#n = /* @__PURE__ */ j(null);
	#r = /* @__PURE__ */ j(!1);
	#i = /* @__PURE__ */ j(null);
	#a = new fo();
	get summary() {
		return H(this.#e);
	}
	get summaryFailed() {
		return H(this.#t);
	}
	get live() {
		return H(this.#n);
	}
	get liveFailed() {
		return H(this.#r);
	}
	get liveAt() {
		return H(this.#i);
	}
	liveState(e) {
		return this.#a.get(e);
	}
	setLiveState(e, t) {
		this.#a.set(e, t);
	}
	keepLiveStates(e) {
		let t = [...e];
		for (let e of [...this.#a.keys()]) t.includes(e) || this.#a.delete(e);
	}
	set(e) {
		e.summary !== void 0 && (M(this.#e, e.summary), M(this.#t, !1)), e.summaryFailed !== void 0 && M(this.#t, e.summaryFailed, !0), e.live !== void 0 && (M(this.#n, e.live), M(this.#r, !1)), e.liveFailed !== void 0 && M(this.#r, e.liveFailed, !0), e.liveAt !== void 0 && M(this.#i, e.liveAt, !0);
	}
	reset() {
		M(this.#e, null), M(this.#t, !1), M(this.#n, null), M(this.#r, !1), M(this.#i, null), this.#a.clear();
	}
}, ho = new mo();
function go(e) {
	ho.set(e), At();
}
//#endregion
//#region src/lib/tables.ts
var _o = /* @__PURE__ */ t({
	DEFAULT_PAGE_SIZE: () => 25,
	PAGE_SIZES: () => vo,
	SESSION_COLUMNS: () => To,
	TOOL_KINDS: () => Oo,
	USAGE_COLUMNS: () => Wo,
	byCost: () => Uo,
	chatRows: () => Vo,
	detailNoun: () => Po,
	emptyDetail: () => jo,
	entryKey: () => Bo,
	kindLabel: () => Ao,
	orderedEntries: () => zo,
	pageSizeFrom: () => So,
	pageText: () => xo,
	pageUnits: () => yo,
	pageWindow: () => bo,
	sessionCells: () => Eo,
	sessionCount: () => Do,
	sessionMatches: () => Co,
	sessionProjects: () => wo,
	toolFolds: () => Lo,
	toolRowClass: () => Fo,
	toolRowName: () => Io,
	toolRowShown: () => Ro,
	toolTableRows: () => ko,
	toolsAndChat: () => Ho,
	usageCells: () => Go
}), vo = [
	10,
	25,
	50
];
function yo(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function bo(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function xo(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function So(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function Co(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function wo(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
var To = [
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
function Eo(e) {
	return [
		va(e.last_ts),
		Z(e.subagents),
		Z(e.turns),
		X(e.context_avg),
		X(e.context_peak),
		X(e.output),
		Q(e.cost)
	];
}
function Do(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var Oo = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function ko(e) {
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
function Ao(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function jo(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var Mo = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, No = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function Po(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn(No, e.tool) && No[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(Mo, n) && Mo[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function Fo(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function Io(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: Ao(e, Oo)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || jo(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function Lo(e) {
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
			label: `${Z(a)} ${Po(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function Ro(e, t) {
	return e.every((e) => t.has(e));
}
function zo(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function Bo(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function Vo(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return zo(e, t).map((e) => ({
		key: Bo(e, n.get(e) ?? 0),
		entry: e
	}));
}
function Ho(e, t, n) {
	return e ? [n, t] : [t, n];
}
function Uo(e, t) {
	return (t.cost ?? -1) - (e.cost ?? -1) || t.turns - e.turns;
}
var Wo = [
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
function Go(e) {
	let t = xa(e);
	return [
		Z(e.turns),
		X(t),
		la(e.cache_read, t),
		X(e.output),
		Q(e.cost)
	];
}
//#endregion
//#region src/lib/themes.ts
var Ko = /* @__PURE__ */ t({
	THEMES: () => qo,
	themeFooter: () => $o,
	themeLabel: () => Qo,
	themeName: () => Xo
}), qo = [
	"light",
	"dark",
	"hacker",
	"startup",
	"rgb"
], Jo = { techbro: "rgb" }, Yo = {
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
function Xo(e) {
	if (e == null) return null;
	let t = (Object.hasOwn(Jo, e) ? Jo[e] : e) ?? e;
	return qo.includes(t) ? t : null;
}
function Zo(e) {
	return e !== null && Object.hasOwn(Yo, e) ? Yo[e] ?? {} : {};
}
function Qo(e, t) {
	let n = Zo(e);
	return Object.hasOwn(n, t) ? n[t] ?? t : t;
}
function $o(e) {
	return Zo(e).footer ?? "";
}
//#endregion
//#region src/lib/prefs.svelte.ts
var es = /* @__PURE__ */ t({
	Preferences: () => is,
	footerCopy: () => os,
	hype: () => $,
	preferences: () => as,
	readPreference: () => ts,
	savePreference: () => ns,
	savedOption: () => rs
});
function ts(e) {
	try {
		return localStorage.getItem(`claude-usage.${e}`);
	} catch {
		return null;
	}
}
function ns(e, t) {
	try {
		localStorage.setItem(`claude-usage.${e}`, String(t));
	} catch {}
}
function rs(e, t) {
	let n = ts(e);
	return n !== null && t.includes(n) ? n : null;
}
var is = class {
	#e = /* @__PURE__ */ j(Jt(Xo(ts("theme"))));
	#t = /* @__PURE__ */ j(Jt(So(ts("page_size"), vo, 25)));
	#n = /* @__PURE__ */ j(ts("chat-oldest-first") === "true");
	get theme() {
		return H(this.#e);
	}
	set theme(e) {
		let t = Xo(e);
		M(this.#e, t, !0), ns("theme", t ?? "auto");
	}
	get pageSize() {
		return H(this.#t);
	}
	set pageSize(e) {
		vo.includes(e) && (M(this.#t, e, !0), ns("page_size", String(e)));
	}
	get oldestFirst() {
		return H(this.#n);
	}
	set oldestFirst(e) {
		M(this.#n, e, !0), ns("chat-oldest-first", String(e));
	}
}, as = new is();
function $(e) {
	return Qo(as.theme, e);
}
function os() {
	return $o(as.theme);
}
//#endregion
//#region src/components/ChartTooltip.svelte
var ss = /* @__PURE__ */ U([[
	"div",
	{ class: "tooltip" },
	,
]]);
function cs(e, t) {
	E(t, !0);
	let n = Ei(t, "top", 3, 8);
	function r(e) {
		let r = e.parentElement?.clientWidth ?? 0;
		e.style.left = `${Pi(t.anchor, e.offsetWidth, r)}px`, e.style.top = `${n()}px`;
	}
	var i = ss();
	Lr(P(i), () => t.children), T(i), qr(i, () => r), G(e, i), D();
}
//#endregion
//#region src/components/Chart.svelte
var ls = /* @__PURE__ */ U([["rect", {
	class: "hit",
	tabindex: "0",
	role: "slider",
	"aria-valuemin": "1"
}]], 4), us = /* @__PURE__ */ U([[
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
function ds(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => (t.cursor?.count ?? 0) - 1), r = /* @__PURE__ */ j(null), i = /* @__PURE__ */ k(() => H(r) === null ? H(n) : Math.min(H(r), H(n))), a = /* @__PURE__ */ j(null), o = /* @__PURE__ */ k(() => H(a) === null || H(n) < 0 ? null : Math.min(H(a), H(n))), s = /* @__PURE__ */ k(() => t.cursor?.area(t.width));
	function c(e) {
		M(r, Math.min(Math.max(0, e), H(n)), !0), M(a, H(r), !0);
	}
	function l(e) {
		let n = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
		t.cursor && n && c(t.cursor.indexAt(t.width)(Mi(e.clientX, n.left, n.width, t.width)));
	}
	function u(e) {
		if (!t.cursor) return;
		let n = Ni(e.key, H(i), t.cursor.count);
		n !== null && (c(n), e.preventDefault());
	}
	var d = us(), f = F(d), p = P(f), m = P(p);
	Lr(m, () => t.plot, () => t.width);
	var h = L(m), g = (e) => {
		var n = W();
		Lr(F(n), () => t.marks ?? v, () => t.width, () => H(o)), G(e, n);
	};
	q(h, (e) => {
		H(o) !== null && e(g);
	}), T(p);
	var _ = L(p), y = (e) => {
		var n = ls();
		R((e, r) => {
			Y(n, "x", H(s).x), Y(n, "y", H(s).y), Y(n, "width", e), Y(n, "height", H(s).height), Y(n, "aria-label", t.cursor.label), Y(n, "aria-valuemax", t.cursor.count), Y(n, "aria-valuenow", H(i) + 1), Y(n, "aria-valuetext", r);
		}, [() => Math.max(1, H(s).width), () => t.cursor.valueText(H(i))]), gr("pointermove", n, l), hr("focus", n, () => c(H(i))), gr("keydown", n, u), hr("pointerleave", n, () => M(a, null)), hr("blur", n, () => M(a, null)), G(e, n);
	};
	q(_, (e) => {
		t.cursor && H(s) && H(n) >= 0 && e(y);
	}), T(f);
	var ee = L(f), b = (e) => {
		{
			let n = /* @__PURE__ */ k(() => t.cursor.tipX(t.width, H(o)) * ji(t.containerWidth, t.width));
			cs(e, {
				get anchor() {
					return H(n);
				},
				get top() {
					return t.tipTop;
				},
				children: (e, n) => {
					var r = W();
					Lr(F(r), () => t.tip, () => H(o)), G(e, r);
				},
				$$slots: { default: !0 }
			});
		}
	};
	q(ee, (e) => {
		t.cursor && H(o) !== null && t.tip && e(b);
	}), R(() => {
		Y(f, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), Y(f, "height", t.height), Y(p, "aria-label", t.label);
	}), G(e, d), D();
}
_r(["pointermove", "keydown"]);
//#endregion
//#region src/components/ChartCard.svelte
var fs = /* @__PURE__ */ U([[
	"span",
	{ class: "muted" },
	" "
]]), ps = /* @__PURE__ */ U([[
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
function ms(e, t) {
	let n = /* @__PURE__ */ j(!1);
	var r = ps(), i = P(r), a = P(i), o = I(a, !0), s = L(a, 2), c = (e) => {
		var n = fs(), r = I(n, !0);
		R(() => K(r, t.note)), G(e, n);
	};
	q(s, (e) => {
		t.note && e(c);
	});
	var l = L(s, 2);
	Lr(l, () => t.controls ?? v);
	var u = L(l, 4);
	T(i);
	var d = L(i, 2);
	Lr(d, () => t.legend ?? v);
	var f = L(d, 2);
	Lr(f, () => t.chart);
	var p = L(f, 2), m = (e) => {
		var n = W();
		Lr(F(n), () => t.table), G(e, n);
	};
	q(p, (e) => {
		H(n) && e(m);
	}), Lr(L(p, 2), () => t.extra ?? v), T(r), R(() => {
		Y(r, "aria-labelledby", `${t.id ?? ""}-title`), Y(a, "id", `${t.id ?? ""}-title`), K(o, t.title), Y(u, "id", `${t.id ?? ""}-table-toggle`), Y(u, "aria-pressed", H(n));
	}), gr("click", u, () => M(n, !H(n))), G(e, r);
}
_r(["click"]);
//#endregion
//#region src/components/Swatch.svelte
var hs = /* @__PURE__ */ U([["span", { class: "swatch" }]]);
function gs(e, t) {
	var n = hs();
	let r;
	R(() => r = ii(n, "", r, { background: t.fill })), G(e, n);
}
//#endregion
//#region src/lib/scroll.ts
var _s = /* @__PURE__ */ t({
	keepScroll: () => ys,
	scrollAnchor: () => vs
});
function vs(e) {
	for (let t of e) {
		let e = t.getBoundingClientRect();
		if (e.bottom > 0) return {
			node: t,
			top: e.top
		};
	}
	return null;
}
function ys(e, t) {
	e && t && t.isConnected && window.scrollBy(0, t.getBoundingClientRect().top - e.top);
}
//#endregion
//#region src/components/Pager.svelte
var bs = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), xs = /* @__PURE__ */ U([[
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
function Ss(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => (t.units.at(-1) ?? -1) + 1), r = /* @__PURE__ */ k(() => Es(t.key, H(n))), i = /* @__PURE__ */ k(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function a() {
		Ts.first(t.key) !== H(r).first && Ts.set(t.key, H(r).first);
	}
	a();
	function o(e, r) {
		let i = e.closest(".pager"), a = vs(i ? [i] : []);
		Ts.set(t.key, bo(H(n), as.pageSize, r).first), At(), ys(a, i);
	}
	function s(e, t) {
		let n = e.closest(".pager"), r = vs(n ? [n] : []);
		as.pageSize = t, At(), ys(r, n);
	}
	function c() {
		let { first: e, last: n } = H(r);
		t.rows?.forEach((r, i) => {
			let a = t.units[i];
			a !== void 0 && r.classList.toggle("off-page", a < e || a >= n);
		});
	}
	var l = xs(), u = P(l);
	J(u, 20, () => vo, (e) => e, (e, n) => {
		var r = bs(), i = I(r), a = {};
		R(() => {
			K(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), G(e, r);
	}), T(u);
	var d;
	ci(u);
	var f = L(u, 2), p = L(f, 2), m = I(p, !0), h = L(p, 2);
	T(l), qr(l, () => c), R((e) => {
		Y(u, "id", `pager-${t.key ?? ""}-size`), Y(u, "aria-label", `${H(i) ?? ""} per page`), d !== (d = as.pageSize) && (u.value = (u.__value = d) ?? "", si(u, d)), Y(f, "id", `pager-${t.key ?? ""}-previous`), f.disabled = H(r).page === 0, K(m, e), Y(h, "id", `pager-${t.key ?? ""}-next`), h.disabled = H(r).page === H(r).pages - 1;
	}, [() => xo(H(r), H(n), t.noun)]), gr("change", u, (e) => s(e.currentTarget, Number(e.currentTarget.value))), gr("click", f, (e) => o(e.currentTarget, H(r).page - 1)), gr("click", h, (e) => o(e.currentTarget, H(r).page + 1)), G(e, l), D();
}
_r(["change", "click"]);
//#endregion
//#region src/lib/paging.svelte.ts
var Cs = /* @__PURE__ */ t({
	TablePages: () => ws,
	mountPager: () => Os,
	releaseDetachedPagers: () => ks,
	shownWindow: () => Es,
	tablePages: () => Ts
}), ws = class {
	#e = new fo();
	first(e) {
		return this.#e.get(e) ?? 0;
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	forget(e) {
		this.#e.delete(e);
	}
}, Ts = new ws();
function Es(e, t) {
	return bo(t, as.pageSize, Math.floor(Ts.first(e) / as.pageSize));
}
var Ds = /* @__PURE__ */ new Set();
function Os(e) {
	let t = document.createElement("div"), n = jr(Ss, {
		target: t,
		props: e
	});
	At();
	let r = t.firstElementChild;
	if (!(r instanceof HTMLElement)) throw Error("The pager drew no element");
	return Ds.add({
		component: n,
		root: r
	}), r;
}
function ks() {
	for (let e of [...Ds]) e.root.isConnected || (Ds.delete(e), Fr(e.component));
}
//#endregion
//#region src/components/TableView.svelte
var As = /* @__PURE__ */ U([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), js = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), Ms = /* @__PURE__ */ U([[
	"th",
	{ scope: "col" },
	" "
]]), Ns = /* @__PURE__ */ U([[
	"tr",
	null,
	,
]]), Ps = /* @__PURE__ */ U([[
	"table",
	null,
	[
		"thead",
		null,
		["tr"]
	],
	["tbody"]
]]), Fs = /* @__PURE__ */ U([
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
function Is(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = W(), o = F(n), s = (e) => {
			Ss(e, {
				get key() {
					return t.key;
				},
				get noun() {
					return r();
				},
				get units() {
					return H(i);
				}
			});
		};
		q(o, (e) => {
			H(a) > vo[0] && e(s);
		}), G(e, n);
	}, r = Ei(t, "noun", 3, "rows"), i = /* @__PURE__ */ k(() => yo(t.rows.map((e) => t.sub?.(e) ?? !1))), a = /* @__PURE__ */ k(() => (H(i).at(-1) ?? -1) + 1), o = /* @__PURE__ */ k(() => Es(t.key, H(a))), s = /* @__PURE__ */ k(() => t.rows.filter((e, t) => {
		let n = H(i)[t] ?? 0;
		return n >= H(o).first && n < H(o).last;
	}));
	var c = Fs(), l = F(c), u = (e) => {
		var r = W(), i = F(r), o = (e) => {
			var r = As(), i = P(r);
			Lr(i, () => t.heading);
			var a = L(i, 2);
			n(a), T(r), G(e, r);
		}, s = (e) => {
			var n = W();
			Lr(F(n), () => t.heading), G(e, n);
		};
		q(i, (e) => {
			H(a) > vo[0] ? e(o) : e(s, -1);
		}), G(e, r);
	};
	q(l, (e) => {
		t.heading && e(u);
	});
	var d = L(l, 2);
	Lr(d, () => t.intro ?? v);
	var f = L(d, 2), p = P(f), m = (e) => {
		n(e);
	};
	q(p, (e) => {
		t.heading || e(m);
	});
	var h = L(p, 2), g = (e) => {
		var n = js(), r = I(n, !0);
		R(() => K(r, t.empty)), G(e, n);
	}, _ = (e) => {
		var n = Ps(), r = P(n), i = P(r);
		J(i, 21, () => t.columns, (e) => e.label, (e, t) => {
			var n = Ms(), r = I(n, !0);
			R(() => {
				ni(n, 1, Xr(H(t).numeric ? "num" : void 0)), K(r, H(t).label);
			}), G(e, n);
		}), T(i), T(r);
		var a = L(r);
		J(a, 21, () => H(s), (e) => t.rowKey(e), (e, n) => {
			var r = Ns();
			Lr(P(r), () => t.cells, () => H(n)), T(r), R((e) => ni(r, 1, e), [() => Xr(t.sub?.(H(n)) ? "sub-row" : t.group?.(H(n)) ? "group-row" : void 0)]), G(e, r);
		}), T(a), T(n), R(() => Y(n, "aria-labelledby", t.labelledby)), G(e, n);
	};
	q(h, (e) => {
		t.rows.length === 0 && t.empty !== void 0 ? e(g) : e(_, -1);
	}), T(f), G(e, c), D();
}
//#endregion
//#region src/components/XLabels.svelte
var Ls = /* @__PURE__ */ U([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4);
function Rs(e, t) {
	E(t, !0);
	var n = W();
	J(F(n), 16, () => Fi(t.count, t.most), (e) => e, (e, n) => {
		var r = Ls(), i = I(r, !0);
		R((e, n) => {
			Y(r, "x", e), Y(r, "y", t.y), K(i, n);
		}, [() => t.xOf(n), () => t.text(n)]), G(e, r);
	}), G(e, n), D();
}
//#endregion
//#region src/components/YAxis.svelte
var zs = /* @__PURE__ */ U([["line", { "stroke-width": "1" }], [
	"text",
	{
		"text-anchor": "end",
		class: "axis-text"
	},
	" "
]], 5);
function Bs(e, t) {
	E(t, !0);
	var n = W();
	J(F(n), 18, () => t.values, (e) => e, (e, n, r) => {
		let i = /* @__PURE__ */ k(() => Ii(t.yOf(n)));
		var a = zs(), o = F(a), s = L(o), c = I(s, !0);
		R((e) => {
			Y(o, "x1", t.left), Y(o, "x2", t.right), Y(o, "y1", H(i)), Y(o, "y2", H(i)), Y(o, "stroke", H(r) === 0 ? "var(--axis)" : "var(--grid)"), Y(s, "x", t.left - 8), Y(s, "y", H(i) + 4), K(c, e);
		}, [() => t.format(n)]), G(e, a);
	}), G(e, n), D();
}
//#endregion
//#region src/components/ByModel.svelte
var Vs = /* @__PURE__ */ U([[
	"button",
	{ type: "button" },
	" "
]]), Hs = /* @__PURE__ */ U([["div", {
	class: "segmented",
	role: "group",
	"aria-label": "Metric"
}]]), Us = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), Ws = /* @__PURE__ */ U([[
	"span",
	{ class: "legend-group" },
	[
		"strong",
		null,
		" "
	],
	" ",
	,
]]), Gs = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), Ks = /* @__PURE__ */ U([[
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
]], 4), qs = /* @__PURE__ */ U([["defs"]], 4), Js = /* @__PURE__ */ U([["path"]], 4), Ys = /* @__PURE__ */ U([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), Xs = /* @__PURE__ */ U([
	,
	,
	,
], 5), Zs = /* @__PURE__ */ U([
	,
	,
	,
	,
	,
], 5), Qs = /* @__PURE__ */ U([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), $s = /* @__PURE__ */ U([[
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
]]), ec = /* @__PURE__ */ U([
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
], 1), tc = /* @__PURE__ */ U([[
	"div",
	{ class: "name" },
	"No usage"
]]), nc = /* @__PURE__ */ U([[
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
]]), rc = /* @__PURE__ */ U([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	,
], 1), ic = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), ac = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), oc = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function sc(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Hs();
		J(t, 20, () => Xa, (e) => e, (e, t) => {
			var n = Vs(), r = I(n, !0);
			R(() => {
				Y(n, "aria-pressed", H(s) === t), K(r, Ya[t].label);
			}), gr("click", n, () => _(t)), G(e, n);
		}), T(t), G(e, t);
	}, r = (e) => {
		var t = Gs(), n = P(t), r = (e) => {
			var t = W();
			J(F(t), 17, () => co(H(c).series), (e) => e.model, (e, t) => {
				var n = Ws(), r = P(n), i = I(r, !0);
				J(L(r, 2), 17, () => H(t).entries, ({ entry: e, text: t }) => e.key, (e, t) => {
					let n = () => H(t).entry, r = () => H(t).text;
					var i = Us(), a = P(i);
					{
						let e = /* @__PURE__ */ k(() => ea(n().color, n().hatch, n().turn));
						gs(a, { get fill() {
							return H(e);
						} });
					}
					var o = L(a, 1, !0);
					T(i), R(() => K(o, r())), G(e, i);
				}), T(n), R(() => K(i, H(t).model)), G(e, n);
			}), G(e, t);
		};
		q(n, (e) => {
			H(c) && e(r);
		}), T(t), G(e, t);
	}, i = (e) => {
		var t = ic(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => eo(t(), H(a).length)), r = /* @__PURE__ */ k(() => Aa(H(c).totals));
				var s = Zs(), l = F(s), d = (e) => {
					var t = qs();
					J(t, 21, () => H(u).patterns, ({ id: e, entry: t }) => e, (e, t) => {
						let n = () => H(t).id, r = () => H(t).entry;
						var i = Ks(), a = P(i), o = L(a);
						T(i), R(() => {
							Y(i, "id", n()), Y(i, "patternTransform", `rotate(${r().turn ?? ""})`), Y(a, "fill", r().color), Y(o, "fill", r().hatch);
						}), G(e, i);
					}), T(t), G(e, t);
				};
				q(l, (e) => {
					H(u).patterns.length && e(d);
				});
				var p = L(l);
				{
					let e = /* @__PURE__ */ k(() => Ca(H(f), 4));
					Bs(p, {
						get left() {
							return 56;
						},
						get right() {
							return H(n).right;
						},
						get values() {
							return H(e);
						},
						yOf: (e) => 220 - 220 * e / H(f),
						get format() {
							return H(o);
						}
					});
				}
				var m = L(p);
				{
					let e = /* @__PURE__ */ k(() => 238);
					Rs(m, {
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
				J(L(m), 18, () => H(a), (e) => e, (e, i, s) => {
					let l = /* @__PURE__ */ k(() => no(t(), H(a).length, H(s)));
					var d = Xs(), p = F(d);
					J(p, 17, () => ro(H(c).series, i, H(f)), ({ entry: e, segment: t }) => e.key, (e, t) => {
						let r = () => H(t).entry, i = () => H(t).segment;
						var a = Js();
						R((e, t) => {
							Y(a, "d", e), Y(a, "fill", t);
						}, [() => ka(H(l), i().y, H(n).barWidth, i().height, i().top), () => H(u).fill(r())]), G(e, a);
					});
					var m = L(p), h = (e) => {
						let t = /* @__PURE__ */ k(() => H(c).totals[H(s)] ?? 0);
						var r = Ys(), i = I(r, !0);
						R((e) => {
							Y(r, "x", H(l) + H(n).barWidth / 2), Y(r, "y", 220 - 220 * H(t) / H(f) - 6), K(i, e);
						}, [() => H(o)(H(t))]), G(e, r);
					};
					q(m, (e) => {
						H(s) === H(r) && (H(c).totals[H(s)] ?? 0) > 0 && e(h);
					}), G(e, d);
				}), G(e, s);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ k(() => eo(t(), H(a).length).band);
				var i = Qs();
				R(() => {
					Y(i, "x", 56 + H(r) * n()), Y(i, "width", H(r)), Y(i, "height", 220);
				}), G(e, i);
			}, r = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => H(a)[t()] ?? ""), r = /* @__PURE__ */ k(() => lo(H(c).series, H(n)));
				var s = rc(), l = F(s), u = I(l, !0), d = L(l, 2);
				J(d, 17, () => H(r), (e) => e.model, (e, t) => {
					var n = ec(), r = F(n), i = P(r), a = I(i, !0), s = I(L(i), !0);
					T(r), J(L(r, 2), 17, () => H(t).efforts, ({ entry: e, text: t, value: n }) => e.key, (e, t) => {
						let n = () => H(t).entry, r = () => H(t).text, i = () => H(t).value;
						var a = $s(), s = P(a), c = P(s);
						{
							let e = /* @__PURE__ */ k(() => ea(n().color, n().hatch, n().turn));
							gs(c, { get fill() {
								return H(e);
							} });
						}
						var l = L(c, 1, !0);
						T(s);
						var u = I(L(s, 2), !0);
						T(a), R((e) => {
							K(l, r()), K(u, e);
						}, [() => H(o)(i())]), G(e, a);
					}), R((e) => {
						K(a, H(t).model), K(s, e);
					}, [() => H(o)(H(t).value)]), G(e, n);
				}, (e) => {
					G(e, tc());
				});
				var f = L(d, 2), p = (e) => {
					var n = nc(), r = I(L(P(n)), !0);
					T(n), R((e) => K(r, e), [() => H(o)(H(c).totals[t()] ?? 0)]), G(e, n);
				};
				q(f, (e) => {
					H(r).length > 1 && e(p);
				}), R((e) => K(u, e), [() => H(i).long(H(n))]), G(e, s);
			}, i = /* @__PURE__ */ k(() => H(c).buckets), a = /* @__PURE__ */ k(() => H(i).keys), o = /* @__PURE__ */ k(() => H(c).metric.format);
			{
				let i = /* @__PURE__ */ k(() => ao(H(c).metric, H(l)));
				ds(e, {
					get height() {
						return Qa;
					},
					get label() {
						return H(i);
					},
					get width() {
						return H(h);
					},
					get containerWidth() {
						return H(m);
					},
					get cursor() {
						return H(g);
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
			H(c) && H(u) && e(r);
		}), T(t), Ci(t, "clientWidth", (e) => M(m, e)), G(e, t);
	}, a = (e) => {
		var t = W(), n = F(t), r = (e) => {
			let t = (e, t = v) => {
				var r = oc(), i = F(r), a = I(i, !0);
				J(L(i, 2), 18, () => H(n).others, (e) => e, (e, n, r) => {
					var i = ac(), a = I(i, !0);
					R(() => K(a, t().cells[H(r) + 1])), G(e, i);
				}), R(() => K(a, t().cells[0])), G(e, r);
			}, n = /* @__PURE__ */ k(() => {
				let [e = "", ...t] = H(p).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let r = /* @__PURE__ */ k(() => [{ label: H(n).first }, ...H(n).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				Is(e, {
					key: "chart-table",
					get columns() {
						return H(r);
					},
					get rows() {
						return H(p).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return t;
					}
				});
			}
		};
		q(n, (e) => {
			H(p) && e(r);
		}), G(e, t);
	}, o = /* @__PURE__ */ k(() => ho.summary), s = /* @__PURE__ */ j(Jt(Za(ts("metric")))), c = /* @__PURE__ */ k(() => H(o) ? $a(H(o), H(s)) : null), l = /* @__PURE__ */ k(() => H(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ k(() => H(c) ? io(H(c).series) : null), d = /* @__PURE__ */ k(() => H(o) ? H(l) === "hour" ? $("Per hour, by model and effort") : $("Per day, by model and effort") : $("Per day, by model")), f = /* @__PURE__ */ k(() => Sa(Math.max(...H(c)?.totals ?? [], 0))), p = /* @__PURE__ */ k(() => H(c) ? uo(H(c)) : null), m = /* @__PURE__ */ j(0), h = /* @__PURE__ */ k(() => Ai(H(m))), g = /* @__PURE__ */ k(() => H(c) ? {
		count: H(c).buckets.keys.length,
		label: oo(H(c).metric, H(l)),
		valueText: (e) => so(H(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: eo(e, H(c).buckets.keys.length).right - 56,
			height: 220
		}),
		indexAt: (e) => to(e, H(c).buckets.keys.length),
		tipX: (e, t) => 56 + eo(e, H(c).buckets.keys.length).band * (t + .5)
	} : null);
	function _(e) {
		M(s, e, !0), ns("metric", e);
	}
	ms(e, {
		id: "chart",
		get title() {
			return H(d);
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
	}), D();
}
_r(["click"]);
//#endregion
//#region src/lib/costly.ts
var cc = [{
	label: "Cache reads",
	color: "var(--split-soft)",
	value: (e) => Ka(e).cacheRead
}, {
	label: "Everything else",
	color: "var(--split-strong)",
	note: "new input, cache writes, output and web searches",
	value: (e) => Ka(e).rest
}];
function lc(e) {
	return e.note ? `${e.label} (${e.note})` : e.label;
}
function uc(e) {
	return e.title || "Untitled session";
}
function dc(e) {
	return `#session/${encodeURIComponent(e.session_id)}`;
}
function fc(e) {
	let t = qa(e);
	return e.map((e) => {
		let n = uc(e), r = cc.map((t) => ({
			part: t,
			amount: t.value(e)
		})), i = r.map(({ part: e, amount: t }) => `${e.label} ${Q(t)}`).join(", ");
		return {
			session: e,
			title: n,
			href: dc(e),
			detail: `${e.project} · ${Z(e.turns)} turns · avg context ${X(e.context_avg)}`,
			share: Ja(e.cost, t),
			cost: Q(e.cost),
			parts: r,
			label: `${n}: ${Q(e.cost)}; ${i}`
		};
	});
}
function pc(e) {
	let { session: t } = e;
	return {
		title: e.title,
		parts: e.parts.map(({ part: e, amount: n }) => ({
			label: e.label,
			color: e.color,
			amount: Q(n),
			share: la(n, t.cost || 0)
		})),
		total: e.cost,
		context: `${Z(t.turns)} turns · context avg ${X(t.context_avg)}, peak ${X(t.context_peak)}`
	};
}
function mc(e) {
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
			...cc.map((e) => ({
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
				...cc.map((t) => Q(t.value(e))),
				Q(e.cost)
			]
		}))
	};
}
//#endregion
//#region src/components/CostPerSession.svelte
var hc = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), gc = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), _c = /* @__PURE__ */ U([["span"]]), vc = /* @__PURE__ */ U([[
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
]]), yc = /* @__PURE__ */ U([[
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
]]), bc = /* @__PURE__ */ U([
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
], 1), xc = /* @__PURE__ */ U([
	["div", { class: "bars" }],
	" ",
	,
], 1), Sc = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	"No sessions in this range."
]]), Cc = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), wc = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), Tc = /* @__PURE__ */ U([
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
function Ec(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = gc(), n = P(t), r = (e) => {
			var t = W();
			J(F(t), 17, () => cc, (e) => e.label, (e, t) => {
				var n = hc(), r = P(n);
				gs(r, { get fill() {
					return H(t).color;
				} });
				var i = L(r, 1, !0);
				T(n), R((e) => K(i, e), [() => lc(H(t))]), G(e, n);
			}), G(e, t);
		};
		q(n, (e) => {
			H(a) && e(r);
		}), T(t), G(e, t);
	}, r = (e) => {
		var t = Cc(), n = P(t), r = (e) => {
			var t = W(), n = F(t), r = (e) => {
				var t = xc(), n = F(t);
				J(n, 21, () => H(s), (e) => e.session.session_id, (e, t) => {
					var n = vc(), r = P(n), i = P(r), a = I(i, !0), o = I(L(i), !0);
					T(r);
					var s = L(r, 2), c = P(s);
					let l;
					J(c, 21, () => H(t).parts, ({ part: e, amount: t }) => e.label, (e, t) => {
						let n = () => H(t).part, r = () => H(t).amount;
						var i = W(), a = F(i), o = (e) => {
							var t = _c();
							let i;
							R(() => i = ii(t, "", i, {
								"flex-grow": r(),
								background: n().color
							})), G(e, t);
						};
						q(a, (e) => {
							r() > 0 && e(o);
						}), G(e, i);
					}), T(c), T(s);
					var u = I(L(s, 2), !0);
					T(n), R((e) => {
						Y(n, "href", H(t).href), Y(n, "aria-label", H(t).label), K(a, H(t).title), K(o, H(t).detail), l = ii(c, "", l, { width: e }), K(u, H(t).cost);
					}, [() => `${H(t).share.toFixed(2) ?? ""}%`]), gr("pointermove", n, (e) => p(e, H(t).session.session_id)), hr("focus", n, (e) => p(e, H(t).session.session_id)), hr("pointerleave", n, m), hr("blur", n, m), G(e, n);
				}), T(n);
				var r = L(n, 2), i = (e) => {
					cs(e, {
						get anchor() {
							return H(u).anchor;
						},
						get top() {
							return H(u).top;
						},
						children: (e, t) => {
							var n = bc(), r = F(n), i = I(r, !0), a = L(r, 2);
							J(a, 17, () => H(f).parts, (e) => e.label, (e, t) => {
								var n = yc(), r = P(n);
								gs(r, { get fill() {
									return H(t).color;
								} });
								var i = L(r), a = I(i, !0), o = I(L(i));
								T(n), R(() => {
									K(a, H(t).amount), K(o, `${H(t).label ?? ""} · ${H(t).share ?? ""}`);
								}), G(e, n);
							});
							var o = L(a, 2), s = P(o);
							gs(s, { fill: null });
							var c = I(L(s), !0);
							je(), T(o);
							var l = I(L(o, 2), !0);
							R(() => {
								K(i, H(f).title), K(c, H(f).total), K(l, H(f).context);
							}), G(e, n);
						},
						$$slots: { default: !0 }
					});
				};
				q(r, (e) => {
					H(u) && H(f) && e(i);
				}), G(e, t);
			}, i = (e) => {
				G(e, Sc());
			};
			q(n, (e) => {
				H(s).length ? e(r) : e(i, -1);
			}), G(e, t);
		};
		q(n, (e) => {
			H(a) && e(r);
		}), T(t), G(e, t);
	}, i = (e) => {
		var t = W(), n = F(t), r = (e) => {
			let t = (e, t = v) => {
				var r = Tc(), i = F(r), a = P(i), o = I(a, !0), s = I(L(a), !0);
				T(i), J(L(i, 2), 19, () => H(n), (e) => e.label, (e, n, r) => {
					var i = wc(), a = I(i, !0);
					R(() => K(a, t().cells[H(r)])), G(e, i);
				}), R((e, n) => {
					Y(a, "href", e), K(o, n), K(s, t().session.project);
				}, [() => dc(t().session), () => uc(t().session)]), G(e, r);
			}, n = /* @__PURE__ */ k(() => H(c).head.slice(1));
			Is(e, {
				key: "costly-table",
				get columns() {
					return H(c).head;
				},
				get rows() {
					return H(c).rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return t;
				}
			});
		};
		q(n, (e) => {
			H(a) && e(r);
		}), G(e, t);
	}, a = /* @__PURE__ */ k(() => ho.summary), o = /* @__PURE__ */ k(() => H(a)?.costly_sessions ?? []), s = /* @__PURE__ */ k(() => fc(H(o))), c = /* @__PURE__ */ k(() => mc(H(o))), l = /* @__PURE__ */ k(() => $("Cost per session")), u = /* @__PURE__ */ j(null), d = /* @__PURE__ */ k(() => H(u) ? H(s).find((e) => e.session.session_id === H(u)?.id) : void 0), f = /* @__PURE__ */ k(() => H(d) ? pc(H(d)) : null);
	function p(e, t) {
		let n = e.currentTarget, r = n.closest(".chart")?.getBoundingClientRect();
		if (!r) return;
		let i = n.getBoundingClientRect(), a = "clientX" in e ? e.clientX : 0;
		M(u, {
			id: t,
			anchor: a ? a - r.left : i.left - r.left + i.width / 2,
			top: n.offsetTop + n.offsetHeight + 4
		}, !0);
	}
	function m() {
		M(u, null);
	}
	ms(e, {
		id: "costly",
		get title() {
			return H(l);
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
	}), D();
}
_r(["pointermove"]);
//#endregion
//#region src/lib/compact.ts
var Dc = /* @__PURE__ */ t({
	PAYOFF_WORDS: () => Oc,
	compactCallKind: () => Nc,
	compactionTotal: () => Ic,
	delegateCallShown: () => Pc,
	payoffAhead: () => jc,
	payoffText: () => Mc,
	payoffTone: () => Ac,
	spread: () => kc,
	verdictTone: () => Fc
}), Oc = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function kc(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function Ac(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function jc(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${Z(t.pays_later_in)} replies`;
		return `${Oc.later}: growing at its recent pace, the context reaches about ${X(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = Z(Math.round(t.calls_ahead));
	return `${Oc[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function Mc(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${Q(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${Z(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : Z(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${Z(e.breakeven_low)} replies)` : `would pay off after about ${Z(e.breakeven_calls)} replies` + kc(r(e.breakeven_low), r(e.breakeven_high));
}
function Nc(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function Pc(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function Fc(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function Ic(e) {
	let t = e.map((e) => e.versus_keeping).filter((e) => e !== null && e.verdict !== "forced");
	if (!t.length) return null;
	let n = t.map((e) => e.net).filter((e) => e !== null);
	return {
		net: n.reduce((e, t) => e + t, 0),
		compactions: n.length,
		unknown: t.length - n.length
	};
}
//#endregion
//#region src/lib/live.ts
var Lc = /* @__PURE__ */ t({
	liveCompactBadge: () => Uc,
	liveEmpty: () => Bc,
	livePastDay: () => Rc,
	liveSecretBadge: () => Hc,
	liveStateBadges: () => Wc,
	liveWaitBadge: () => Vc,
	liveWindow: () => zc,
	sessionWaits: () => Gc,
	waitChanged: () => Kc
});
function Rc(e, t) {
	return e.days === 1 && e.until && e.until !== t ? e.until : null;
}
function zc(e, t) {
	let n = Rc(e, t), r = e.agent_minutes > e.minutes ? ` (${e.agent_minutes} min while agents work)` : "", i = e.sessions.some((e) => e.waiting) ? " or waiting for you" : "", a = n ? `, active on ${ma(n)}` : "";
	return `· changed in the last ${e.minutes} min${r}${i}${a}`;
}
function Bc(e, t) {
	let n = Rc(e, t);
	return n ? `No live session was active on ${ma(n)}.` : `No session active in the last ${e.minutes} minutes.`;
}
function Vc(e) {
	if (!e) return null;
	let t = ` since ${va(e.since)}`;
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
function Hc(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${Z(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${Z(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function Uc(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${X(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = Ac(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if (Nc({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${Q(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${Z(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${Oc[l]}: compacting now ${m}, ~${Z(Math.round(f))} ahead on average.`);
}
function Wc(e, t) {
	return [Hc(e.secrets), Uc(e.current, t)].filter((e) => e !== null);
}
function Gc(e, t) {
	let n = Vc(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : Vc(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function Kc(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/components/LiveIcon.svelte
var qc = /* @__PURE__ */ U([
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
], 5), Jc = /* @__PURE__ */ U([
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
], 5), Yc = /* @__PURE__ */ U([
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
], 5), Xc = /* @__PURE__ */ U([
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
], 5), Zc = /* @__PURE__ */ U([[
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
function Qc(e, t) {
	E(t, !0);
	var n = Zc(), r = P(n), i = P(r), a = (e) => {
		var t = qc();
		je(3), G(e, t);
	}, o = (e) => {
		var t = Jc();
		je(2), G(e, t);
	}, s = (e) => {
		var t = Yc();
		je(5), G(e, t);
	}, c = (e) => {
		var t = Xc();
		je(3), G(e, t);
	};
	q(i, (e) => {
		t.badge.kind === "permission" ? e(a) : t.badge.kind === "waiting" ? e(o, 1) : t.badge.kind === "secret" ? e(s, 2) : e(c, -1);
	}), T(r), T(n), R(() => {
		ni(n, 1, Xr([
			"live-icon",
			`live-icon-${t.badge.kind}`,
			t.badge.tone && `live-icon-${t.badge.tone}`
		])), Y(n, "aria-label", t.badge.text), Y(n, "title", t.badge.text);
	}), G(e, n), D();
}
//#endregion
//#region src/components/LiveCard.svelte
var $c = /* @__PURE__ */ U([[
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
]]), el = /* @__PURE__ */ U([[
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
]]), tl = /* @__PURE__ */ U([["ul"]]), nl = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	"No subagent running"
]]), rl = /* @__PURE__ */ U([[
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
function il(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Vc(t.session.waiting)), r = /* @__PURE__ */ k(() => t.sessionState ? Wc(t.sessionState, new Date(t.now).toISOString()) : []), i = /* @__PURE__ */ k(() => [
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
	var a = rl(), o = P(a), s = P(o), c = L(P(s)), l = I(c, !0);
	T(s);
	var u = L(s, 2), d = (e) => {
		Qc(e, { get badge() {
			return H(n);
		} });
	};
	q(u, (e) => {
		H(n) && e(d);
	});
	var f = L(u, 2);
	J(f, 21, () => H(r), (e) => e.kind, (e, t) => {
		Qc(e, { get badge() {
			return H(t);
		} });
	}), T(f), T(o);
	var p = L(o, 2), m = I(p), h = L(p, 2);
	J(h, 21, () => H(i), (e) => e.label, (e, t) => {
		var n = $c(), r = P(n), i = I(r, !0), a = I(L(r), !0);
		T(n), R(() => {
			K(i, H(t).label), K(a, H(t).value);
		}), G(e, n);
	}), T(h);
	var g = L(h, 2), _ = (e) => {
		var n = tl();
		J(n, 21, () => t.session.subagents, (e) => e.agent_id, (e, n) => {
			var r = el(), i = P(r), a = I(i, !0), o = L(i, 2), s = I(o, !0), c = I(L(o));
			T(r), R((e, t, r) => {
				K(a, H(n).agent_type), K(s, H(n).description || ""), K(c, `${(H(n).model || "–") ?? ""} · ${e ?? ""} turns · context ${t ?? ""} · ${r ?? ""}`);
			}, [
				() => Z(H(n).turns),
				() => X(H(n).last_context),
				() => ya(H(n).last_activity, t.now)
			]), G(e, r);
		}), T(n), G(e, n);
	}, v = (e) => {
		G(e, nl());
	};
	q(g, (e) => {
		t.session.subagents.length ? e(_) : e(v, -1);
	}), T(a), R((e, n, r) => {
		Y(c, "href", e), K(l, n), K(m, `${t.session.project ?? ""}${t.session.git_branch ? ` · ${t.session.git_branch}` : ""} · ${r ?? ""}`);
	}, [
		() => dc(t.session),
		() => uc(t.session),
		() => ya(t.session.last_activity, t.now)
	]), G(e, a), D();
}
//#endregion
//#region src/components/LiveSessions.svelte
var al = /* @__PURE__ */ U([[
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
]]), ol = /* @__PURE__ */ U([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), sl = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), cl = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), ll = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), ul = /* @__PURE__ */ U([["div", { class: "live-grid" }]]), dl = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), fl = /* @__PURE__ */ U([
	,
	,
	" ",
	,
	" ",
	,
], 1), pl = /* @__PURE__ */ U([[
	"section",
	{
		class: "card",
		"aria-labelledby": "live-title"
	},
	,
	" ",
	[
		"div",
		{ class: "paged-wrap" },
		,
	]
]]);
function ml(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = al(), n = P(t), r = I(n, !0), a = I(L(n, 2), !0);
		T(t), R((e, t) => {
			K(r, e), K(a, t);
		}, [() => $("Live sessions"), () => H(i) ? zc(H(i), H(o)) : ""]), G(e, t);
	}, r = "live", i = /* @__PURE__ */ k(() => ho.live), a = /* @__PURE__ */ k(() => ho.liveAt ?? Date.now()), o = /* @__PURE__ */ k(() => fa(new Date(H(a)))), s = /* @__PURE__ */ k(() => H(i)?.sessions ?? []), c = /* @__PURE__ */ k(() => yo(H(s).map(() => !1))), l = /* @__PURE__ */ k(() => H(s).length), u = /* @__PURE__ */ k(() => Es(r, H(l))), d = /* @__PURE__ */ k(() => H(s).slice(H(u).first, H(u).last)), f = /* @__PURE__ */ k(() => H(l) > vo[0]);
	var p = pl(), m = P(p), h = (e) => {
		var t = ol(), i = P(t);
		n(i), Ss(L(i, 2), {
			key: r,
			noun: "sessions",
			get units() {
				return H(c);
			}
		}), T(t), G(e, t);
	}, g = (e) => {
		n(e);
	};
	q(m, (e) => {
		H(f) ? e(h) : e(g, -1);
	});
	var _ = L(m, 2), v = P(_), y = (e) => {
		var t = sl(), n = I(t, !0);
		R(() => K(n, ho.liveFailed ? "Could not load the live sessions." : "Loading…")), G(e, t);
	}, ee = (e) => {
		var t = fl(), n = F(t), r = (e) => {
			var t = cl(), n = I(t);
			R(() => K(n, `Permission prompts can't show here: ${H(i).prompts_unavailable ?? ""}.`)), G(e, t);
		};
		q(n, (e) => {
			H(i).prompts_unavailable && e(r);
		});
		var s = L(n, 2), c = (e) => {
			var t = ll(), n = I(t);
			R(() => K(n, `Desktop notifications can't show: ${H(i).notifications_unavailable ?? ""}.`)), G(e, t);
		};
		q(s, (e) => {
			H(i).notifications_unavailable && e(c);
		});
		var l = L(s, 2), u = (e) => {
			var t = ul();
			J(t, 21, () => H(d), (e) => e.session_id, (e, t) => {
				{
					let n = /* @__PURE__ */ k(() => ho.liveState(H(t).session_id));
					il(e, {
						get session() {
							return H(t);
						},
						get sessionState() {
							return H(n);
						},
						get now() {
							return H(a);
						}
					});
				}
			}), T(t), G(e, t);
		}, f = (e) => {
			var t = dl(), n = I(t, !0);
			R((e) => K(n, e), [() => Bc(H(i), H(o))]), G(e, t);
		};
		q(l, (e) => {
			H(d).length ? e(u) : e(f, -1);
		}), G(e, t);
	};
	q(v, (e) => {
		H(i) ? e(ee, -1) : e(y);
	}), T(_), T(p), G(e, p), D();
}
//#endregion
//#region src/lib/trend.ts
var hl = [
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
function gl(e) {
	let t = e * 116 + 22;
	return {
		top: t,
		bottom: t + 76
	};
}
function _l() {
	return gl(hl.length - 1).bottom + 28;
}
function vl(e, t = /* @__PURE__ */ new Date()) {
	let n = Ma(e, t), r = Pa(n.unit === "hour" ? e.hour_model : e.day_model, n.keyOf);
	return {
		buckets: n,
		totals: n.keys.map((e) => r.get(e) ?? Na)
	};
}
function yl(e, t) {
	return e.totals.map((e) => t.value(e));
}
function bl(e) {
	return `estimated cost, input and output tokens per ${e}`;
}
function xl(e) {
	return `Estimated cost, input tokens and output tokens per ${e}; table view available`;
}
function Sl(e) {
	return `Estimated cost, input and output tokens per ${e}; arrow keys step through them`;
}
function Cl(e, t) {
	let n = e.totals[t] ?? Na, r = hl.map((e) => `${e.label} ${e.format(e.value(n))}`).join(", ");
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${r}`;
}
function wl(e) {
	let t = e.buckets.keys.map((t, n) => ({
		key: t,
		cells: [e.buckets.short(t), ...hl.map((t) => t.format(t.value(e.totals[n] ?? Na)))]
	})).reverse();
	return {
		head: [e.buckets.heading, ...hl.map((e) => e.label)],
		rows: t
	};
}
//#endregion
//#region src/components/AreaLine.svelte
var Tl = /* @__PURE__ */ U([["path", { "fill-opacity": "0.1" }], ["path", {
	fill: "none",
	"stroke-width": "2",
	"stroke-linejoin": "round",
	"stroke-linecap": "round"
}]], 5);
function El(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => t.values.map((e, n) => `${t.xOf(n).toFixed(1)},${t.yOf(e).toFixed(1)}`).join("L")), r = /* @__PURE__ */ k(() => `M${t.xOf(0)},${t.bottom}L${H(n)}L${t.xOf(t.values.length - 1)},${t.bottom}Z`);
	var i = W(), a = F(i), o = (e) => {
		var i = Tl(), a = F(i), o = L(a);
		R(() => {
			Y(a, "d", H(r)), Y(a, "fill", t.color), Y(o, "d", `M${H(n) ?? ""}`), Y(o, "stroke", t.color);
		}), G(e, i);
	};
	q(a, (e) => {
		t.values.length && e(o);
	}), G(e, i), D();
}
//#endregion
//#region src/components/PointDot.svelte
var Dl = /* @__PURE__ */ U([["circle", {
	r: "4",
	stroke: "var(--surface)",
	"stroke-width": "2"
}]], 4);
function Ol(e, t) {
	var n = Dl();
	R(() => {
		Y(n, "cx", t.x), Y(n, "cy", t.y), Y(n, "fill", t.color);
	}), G(e, n);
}
//#endregion
//#region src/components/OverTime.svelte
var kl = (e, t = v) => {
	var n = Rl(), r = F(n), i = I(r, !0);
	J(L(r, 2), 19, () => hl, (e) => e.label, (e, n, r) => {
		var i = Ll(), a = I(i, !0);
		R(() => K(a, t().cells[H(r) + 1])), G(e, i);
	}), R(() => K(i, t().cells[0])), G(e, n);
}, Al = /* @__PURE__ */ U([
	,
	,
	[
		"text",
		{ class: "value-text" },
		" "
	]
], 5), jl = /* @__PURE__ */ U([
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
], 5), Ml = /* @__PURE__ */ U([
	,
	,
	,
], 5), Nl = /* @__PURE__ */ U([["line", { class: "crosshair" }], ,], 5), Pl = /* @__PURE__ */ U([[
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
]]), Fl = /* @__PURE__ */ U([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
], 1), Il = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), Ll = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), Rl = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function zl(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Il(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => t() - 64), r = /* @__PURE__ */ k(() => Ta(H(s).length, 56, H(n)));
				var a = Ml(), o = F(a);
				J(o, 17, () => H(d), ({ panel: e, top: t, bottom: n, color: r, values: i, max: a, yOf: o }) => e.label, (e, t) => {
					let i = () => H(t).panel, a = () => H(t).top, o = () => H(t).bottom, s = () => H(t).color, c = () => H(t).values, l = () => H(t).max, u = () => H(t).yOf;
					var d = jl(), f = F(d), p = L(f), m = I(p, !0), h = L(p);
					{
						let e = /* @__PURE__ */ k(() => Ca(l(), 2));
						Bs(h, {
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
					var g = L(h);
					El(g, {
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
					var _ = L(g), v = (e) => {
						let t = /* @__PURE__ */ k(() => c().length - 1), n = /* @__PURE__ */ k(() => c()[H(t)] ?? 0);
						var a = Al(), o = F(a);
						{
							let e = /* @__PURE__ */ k(() => H(r)(H(t))), i = /* @__PURE__ */ k(() => u()(H(n)));
							Ol(o, {
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
						var l = L(o), d = I(l, !0);
						R((e, t, n) => {
							Y(l, "x", e), Y(l, "y", t), K(d, n);
						}, [
							() => H(r)(H(t)) + 9,
							() => u()(H(n)) + 4,
							() => i().format(H(n))
						]), G(e, a);
					};
					q(_, (e) => {
						c().length && e(v);
					}), R(() => {
						Y(f, "x1", 56), Y(f, "x2", 70), Y(f, "y1", a() - 10), Y(f, "y2", a() - 10), Y(f, "stroke", s()), Y(p, "x", 76), Y(p, "y", a() - 6), K(m, i().label);
					}), G(e, d);
				});
				var c = L(o);
				{
					let e = /* @__PURE__ */ k(() => u + 18);
					Rs(c, {
						get count() {
							return H(s).length;
						},
						get xOf() {
							return H(r);
						},
						get y() {
							return H(e);
						},
						text: (e) => H(i).short(H(s)[e] ?? "")
					});
				}
				G(e, a);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ k(() => Ta(H(s).length, 56, t() - 64));
				var i = Nl(), a = F(i);
				J(L(a), 17, () => H(d), ({ panel: e, color: t, values: n, yOf: r }) => e.label, (e, t) => {
					let i = () => H(t).color, a = () => H(t).values, o = () => H(t).yOf;
					{
						let t = /* @__PURE__ */ k(() => H(r)(n())), s = /* @__PURE__ */ k(() => o()(a()[n()] ?? 0));
						Ol(e, {
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
				}), R((e, t) => {
					Y(a, "x1", e), Y(a, "x2", t), Y(a, "y1", 18), Y(a, "y2", u);
				}, [() => H(r)(n()), () => H(r)(n())]), G(e, i);
			}, r = (e, t = v) => {
				var n = Fl(), r = F(n), a = I(r, !0);
				J(L(r, 2), 17, () => H(d), ({ panel: e, color: t, values: n }) => e.label, (e, n) => {
					let r = () => H(n).panel, i = () => H(n).color, a = () => H(n).values;
					var o = Pl(), s = P(o);
					let c;
					var l = L(s, 2), u = I(l, !0), d = I(L(l, 2), !0);
					T(o), R((e) => {
						c = ii(s, "", c, { background: i() }), K(u, e), K(d, r().label);
					}, [() => r().format(a()[t()] ?? 0)]), G(e, o);
				}), R((e) => K(a, e), [() => H(i).long(H(s)[t()] ?? "")]), G(e, n);
			}, i = /* @__PURE__ */ k(() => H(a).buckets), s = /* @__PURE__ */ k(() => H(i).keys);
			{
				let i = /* @__PURE__ */ k(_l), a = /* @__PURE__ */ k(() => xl(H(o)));
				ds(e, {
					get height() {
						return H(i);
					},
					get label() {
						return H(a);
					},
					get width() {
						return H(l);
					},
					get containerWidth() {
						return H(c);
					},
					get cursor() {
						return H(f);
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
			H(a) && e(r);
		}), T(t), Ci(t, "clientWidth", (e) => M(c, e)), G(e, t);
	}, r = (e) => {
		var t = W(), n = F(t), r = (e) => {
			let t = /* @__PURE__ */ k(() => {
				let [e = "", ...t] = H(s).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let n = /* @__PURE__ */ k(() => [{ label: H(t).first }, ...H(t).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				Is(e, {
					key: "trend-table",
					get columns() {
						return H(n);
					},
					get rows() {
						return H(s).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return kl;
					}
				});
			}
		};
		q(n, (e) => {
			H(s) && e(r);
		}), G(e, t);
	}, i = /* @__PURE__ */ k(() => ho.summary), a = /* @__PURE__ */ k(() => H(i) ? vl(H(i)) : null), o = /* @__PURE__ */ k(() => H(a)?.buckets.unit ?? "day"), s = /* @__PURE__ */ k(() => H(a) ? wl(H(a)) : null), c = /* @__PURE__ */ j(0), l = /* @__PURE__ */ k(() => Ai(H(c))), u = gl(hl.length - 1).bottom, d = /* @__PURE__ */ k(() => H(a) ? hl.map((e, t) => {
		let { top: n, bottom: r } = gl(t), i = yl(H(a), e), o = Sa(Math.max(...i, 0));
		return {
			panel: e,
			top: n,
			bottom: r,
			color: Yi(e.slot),
			values: i,
			max: o,
			yOf: (e) => r - 76 * e / o
		};
	}) : []), f = /* @__PURE__ */ k(() => H(a) ? {
		count: H(a).buckets.keys.length,
		label: Sl(H(o)),
		valueText: (e) => Cl(H(a), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: u
		}),
		indexAt: (e) => Ea(56, e - 64, H(a).buckets.keys.length),
		tipX: (e, t) => Ta(H(a).buckets.keys.length, 56, e - 64)(t)
	} : null);
	{
		let t = /* @__PURE__ */ k(() => $("Over time")), i = /* @__PURE__ */ k(() => bl(H(o)));
		ms(e, {
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
	D();
}
var Bl = 148, Vl = "var(--status-critical)";
function Hl(e, t = /* @__PURE__ */ new Date()) {
	let n = Ma(e, t), r = Ua(n.unit === "hour" ? e.api_errors.hour : e.api_errors.day, n.keyOf), i = n.keys.map((e) => r(e).limits), a = n.keys.map((e) => r(e).other), o = i.reduce((e, t) => e + t, 0), s = Aa(i);
	return {
		buckets: n,
		limits: i,
		others: a,
		total: o,
		top: wa(Math.max(...i, 0)),
		peak: i[s] ? s : null,
		empty: !i.some(Boolean) && !a.some(Boolean)
	};
}
function Ul(e, t, n, r, i) {
	let { band: a, barWidth: o } = eo(e, t), s = 120 * r / i;
	return {
		x: 56 + a * n + (a - o) / 2,
		y: 120 - s,
		width: o,
		height: s
	};
}
function Wl(e) {
	return `rate-limit hits per ${e}; other API errors are in the tooltip, the table view and the list`;
}
function Gl(e, t) {
	return `Rate-limit hits per ${e}: ${Z(t)} in the range; table view available`;
}
function Kl(e) {
	return `Rate-limit hits per ${e}; arrow keys step through them`;
}
function ql(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${Z(e.limits[t])} rate-limit hits, ${Z(e.others[t])} other API errors`;
}
function Jl(e, t) {
	return {
		when: e.buckets.long(e.buckets.keys[t] ?? ""),
		limits: Z(e.limits[t]),
		others: Z(e.others[t])
	};
}
function Yl(e) {
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
var Xl = [
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
function Zl(e, t) {
	return e.flatMap((e) => {
		let n = `${e.limit_type} ${e.resets_at}`;
		return [{
			key: n,
			kind: "window",
			name: Ga(e, t),
			cells: [
				ua(Wa(e)),
				Z(e.hits),
				...Go(e.used)
			],
			sub: !1,
			group: e.models.length > 0
		}, ...e.models.slice().sort(Uo).map((e) => ({
			key: `${n} ${e.model}`,
			kind: "model",
			name: e.model,
			cells: [
				"",
				"",
				...Go(e)
			],
			sub: !0,
			group: !1
		}))];
	});
}
function Ql(e) {
	return e.map((e) => ({
		key: e.record_id,
		when: va(e.ts),
		error: Ha(e),
		quota: Va(e.limit_type),
		resets: va(e.resets_at),
		session: {
			href: dc(e),
			name: uc(e),
			project: e.project
		},
		agent: e.agent_type
	}));
}
var $l = [
	{ label: "When" },
	{ label: "Error" },
	{ label: "Quota" },
	{ label: "Resets" },
	{ label: "Session" },
	{ label: "Agent" }
], eu = (e) => {
	var t = _u(), n = I(t, !0);
	R((e) => K(n, e), [() => $("5-hour windows that hit the limit")]), G(e, t);
}, tu = (e) => {
	G(e, vu());
}, nu = (e) => {
	var t = Su(), n = I(t, !0);
	R((e) => K(n, e), [() => $("Latest API errors")]), G(e, t);
}, ru = (e, t = v) => {
	var n = Cu(), r = F(n), i = I(r, !0), a = L(r, 2), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = I(l, !0), d = L(l, 2), f = P(d), p = I(f, !0), m = I(L(f), !0);
	T(d);
	var h = I(L(d, 2), !0);
	R(() => {
		K(i, t().when), K(o, t().error), K(c, t().quota), K(u, t().resets), Y(f, "href", t().session.href), K(p, t().session.name), K(m, t().session.project), K(h, t().agent);
	}), G(e, n);
}, iu = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), au = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), ou = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	"No rate limits or API errors in this range."
]]), su = /* @__PURE__ */ U([["path"]], 4), cu = /* @__PURE__ */ U([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), lu = /* @__PURE__ */ U([
	,
	,
	,
], 5), uu = /* @__PURE__ */ U([
	,
	,
	,
	,
], 5), du = /* @__PURE__ */ U([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), fu = /* @__PURE__ */ U([
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
], 1), pu = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), mu = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), hu = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1), gu = /* @__PURE__ */ U([
	,
	,
	" ",
	,
], 1), _u = /* @__PURE__ */ U([[
	"h3",
	null,
	" "
]]), vu = /* @__PURE__ */ U([[
	"p",
	{ class: "note" },
	"what each window used from its start (its reset less 5 hours) up to its first hit, as the transcripts here show it;\n    the limit also counts what you use elsewhere"
]]), yu = /* @__PURE__ */ U([[
	"span",
	{ class: "window-model" },
	" "
]]), bu = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), xu = /* @__PURE__ */ U([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1), Su = /* @__PURE__ */ U([[
	"h3",
	null,
	" "
]]), Cu = /* @__PURE__ */ U([
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
	[
		"td",
		null,
		" "
	]
], 1);
function wu(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = au(), n = P(t), r = (e) => {
			var t = iu(), n = P(t);
			gs(n, { get fill() {
				return Vl;
			} });
			var r = L(n);
			T(t), R(() => K(r, "⚠ Rate-limit hit")), G(e, t);
		};
		q(n, (e) => {
			H(c) && e(r);
		}), T(t), G(e, t);
	}, r = (e) => {
		var t = pu(), n = P(t), r = (e) => {
			var t = W(), n = F(t), r = (e) => {
				G(e, ou());
			}, i = (e) => {
				let t = (e, t = v) => {
					let n = /* @__PURE__ */ k(() => eo(t(), H(a).length));
					var r = uu(), o = F(r);
					{
						let e = /* @__PURE__ */ k(() => Ca(H(c).top, 2));
						Bs(o, {
							get left() {
								return 56;
							},
							get right() {
								return H(n).right;
							},
							get values() {
								return H(e);
							},
							yOf: (e) => 120 - 120 * e / H(c).top,
							get format() {
								return Z;
							}
						});
					}
					var s = L(o);
					{
						let e = /* @__PURE__ */ k(() => 138);
						Rs(s, {
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
					J(L(s), 18, () => H(a), (e) => e, (e, n, r) => {
						let i = /* @__PURE__ */ k(() => H(c).limits[H(r)] ?? 0), o = /* @__PURE__ */ k(() => Ul(t(), H(a).length, H(r), H(i), H(c).top));
						var s = lu(), l = F(s), u = (e) => {
							var t = su();
							R((e) => {
								Y(t, "d", e), Y(t, "fill", Vl);
							}, [() => ka(H(o).x, H(o).y, H(o).width, H(o).height, !0)]), G(e, t);
						};
						q(l, (e) => {
							H(o).height > 0 && e(u);
						});
						var d = L(l), f = (e) => {
							var t = cu(), n = I(t, !0);
							R((e) => {
								Y(t, "x", H(o).x + H(o).width / 2), Y(t, "y", H(o).y - 6), K(n, e);
							}, [() => Z(H(i))]), G(e, t);
						};
						q(d, (e) => {
							H(r) === H(c).peak && e(f);
						}), G(e, s);
					}), G(e, r);
				}, n = (e, t = v, n = v) => {
					let r = /* @__PURE__ */ k(() => eo(t(), H(a).length).band);
					var i = du();
					R(() => {
						Y(i, "x", 56 + H(r) * n()), Y(i, "width", H(r)), Y(i, "height", 120);
					}), G(e, i);
				}, r = (e, t = v) => {
					let n = /* @__PURE__ */ k(() => Jl(H(c), t()));
					var r = fu(), i = F(r), a = I(i, !0), o = L(i, 2), s = P(o);
					gs(s, { get fill() {
						return Vl;
					} });
					var l = L(s), u = I(l, !0), d = I(L(l));
					T(o);
					var f = L(o, 2), p = P(f);
					gs(p, { fill: null });
					var m = I(L(p), !0);
					je(), T(f), R(() => {
						K(a, H(n).when), K(u, H(n).limits), K(d, "⚠ rate-limit hits"), K(m, H(n).others);
					}), G(e, r);
				}, i = /* @__PURE__ */ k(() => H(c).buckets), a = /* @__PURE__ */ k(() => H(i).keys);
				{
					let i = /* @__PURE__ */ k(() => Gl(H(l), H(c).total));
					ds(e, {
						get height() {
							return Bl;
						},
						get label() {
							return H(i);
						},
						get width() {
							return H(g);
						},
						get containerWidth() {
							return H(h);
						},
						get cursor() {
							return H(_);
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
				H(c).empty ? e(r) : e(i, -1);
			}), G(e, t);
		};
		q(n, (e) => {
			H(c) && e(r);
		}), T(t), Ci(t, "clientWidth", (e) => M(h, e)), G(e, t);
	}, i = (e) => {
		var t = W(), n = F(t), r = (e) => {
			let t = (e, t = v) => {
				var r = hu(), i = F(r), a = I(i, !0);
				J(L(i, 2), 19, () => H(n), (e) => e.label, (e, n, r) => {
					var i = mu(), a = I(i, !0);
					R(() => K(a, t().cells[H(r) + 1])), G(e, i);
				}), R(() => K(a, t().cells[0])), G(e, r);
			}, n = /* @__PURE__ */ k(() => H(d).head.slice(1));
			Is(e, {
				key: "limits-table",
				get columns() {
					return H(d).head;
				},
				get rows() {
					return H(d).rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return t;
				}
			});
		};
		q(n, (e) => {
			H(d) && e(r);
		}), G(e, t);
	}, a = (e) => {
		var t = W(), n = F(t), r = (e) => {
			var t = gu(), n = F(t);
			Is(n, {
				key: "limit-windows",
				get columns() {
					return Xl;
				},
				get rows() {
					return H(f);
				},
				rowKey: (e) => e.key,
				get cells() {
					return o;
				},
				sub: (e) => e.sub,
				group: (e) => e.group,
				get heading() {
					return eu;
				},
				get intro() {
					return tu;
				},
				empty: "No 5-hour window hit its limit in this range."
			}), Is(L(n, 2), {
				key: "limit-events",
				get columns() {
					return $l;
				},
				get rows() {
					return H(p);
				},
				rowKey: (e) => e.key,
				get cells() {
					return ru;
				},
				get heading() {
					return nu;
				},
				empty: "No API errors in this range."
			}), G(e, t);
		};
		q(n, (e) => {
			H(s) && e(r);
		}), G(e, t);
	}, o = (e, t = v) => {
		var n = xu(), r = F(n), i = P(r), a = (e) => {
			var n = yu(), r = I(n, !0);
			R(() => K(r, t().name)), G(e, n);
		}, o = (e) => {
			var n = wr();
			R(() => K(n, t().name)), G(e, n);
		};
		q(i, (e) => {
			t().kind === "model" ? e(a) : e(o, -1);
		}), T(r), J(L(r, 2), 19, () => m, (e) => e.label, (e, n, r) => {
			var i = bu(), a = I(i, !0);
			R(() => K(a, t().cells[H(r)])), G(e, i);
		}), G(e, n);
	}, s = /* @__PURE__ */ k(() => ho.summary), c = /* @__PURE__ */ k(() => H(s) ? Hl(H(s)) : null), l = /* @__PURE__ */ k(() => H(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ k(() => $("Rate limits")), d = /* @__PURE__ */ k(() => H(c) ? Yl(H(c)) : null), f = /* @__PURE__ */ k(() => H(s) ? Zl(H(s).api_errors.windows) : []), p = /* @__PURE__ */ k(() => H(s) ? Ql(H(s).api_errors.events) : []), m = Xl.slice(1), h = /* @__PURE__ */ j(0), g = /* @__PURE__ */ k(() => Ai(H(h))), _ = /* @__PURE__ */ k(() => H(c) ? {
		count: H(c).buckets.keys.length,
		label: Kl(H(l)),
		valueText: (e) => ql(H(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: eo(e, H(c).buckets.keys.length).right - 56,
			height: 120
		}),
		indexAt: (e) => to(e, H(c).buckets.keys.length),
		tipX: (e, t) => 56 + eo(e, H(c).buckets.keys.length).band * (t + .5)
	} : null);
	{
		let t = /* @__PURE__ */ k(() => H(c) ? Wl(H(l)) : void 0);
		ms(e, {
			id: "limits",
			get title() {
				return H(u);
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
	D();
}
//#endregion
//#region src/components/SessionsList.svelte
var Tu = (e) => {
	var t = Du(), n = I(P(t), !0);
	je(2), T(t), R((e) => K(n, e), [() => $("Sessions")]), G(e, t);
}, Eu = (e, t = v) => {
	let n = /* @__PURE__ */ k(() => Eo(t()));
	var r = ju(), i = F(r), a = I(i, !0), o = L(i, 2), s = P(o), c = I(s, !0), l = I(L(s), !0);
	T(o), J(L(o, 2), 17, () => H(n).slice(1), Rr, (e, t) => {
		var n = Au(), r = I(n, !0);
		R(() => K(r, H(t))), G(e, n);
	}), R((e, r) => {
		K(a, H(n)[0]), Y(s, "href", e), K(c, r), K(l, t().project);
	}, [() => dc(t()), () => uc(t())]), G(e, r);
}, Du = /* @__PURE__ */ U([[
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
]]), Ou = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), ku = /* @__PURE__ */ U([[
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
]]), Au = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), ju = /* @__PURE__ */ U([
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
], 1), Mu = /* @__PURE__ */ U([
	,
	,
	" ",
	,
], 1), Nu = /* @__PURE__ */ U([[
	"section",
	{
		class: "card",
		"aria-labelledby": "sessions-title"
	},
	,
]]);
function Pu(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = ku(), n = P(t), o = P(n);
		o.value = o.__value = "", J(L(o), 17, () => H(c), (e) => e.project, (e, t) => {
			var n = Ou(), r = I(n), i = {};
			R((e) => {
				K(r, `${H(t).project ?? ""} (${e ?? ""})`), i !== (i = H(t).project) && (n.value = (n.__value = i) ?? "");
			}, [() => Z(H(t).count)]), G(e, n);
		}), T(n), ci(n);
		var s = L(n, 2);
		hi(s);
		var u = I(L(s, 2), !0);
		T(t), R(() => K(u, H(l))), li(n, () => H(i), (e) => {
			M(i, e, !0), Ts.forget(r);
		}), yi(s, () => H(a), (e) => {
			M(a, e, !0), Ts.forget(r);
		}), G(e, t);
	}, r = "sessions", i = /* @__PURE__ */ j(""), a = /* @__PURE__ */ j(""), o = /* @__PURE__ */ k(() => ho.summary?.sessions ?? null), s = /* @__PURE__ */ k(() => H(o) ? H(o).filter((e) => Co(e, H(i), H(a))) : []), c = /* @__PURE__ */ k(() => wo(H(o) ?? [], H(i))), l = /* @__PURE__ */ k(() => H(o) ? Do(H(s).length, H(o).length) : "");
	var u = Nu(), d = P(u), f = (e) => {
		{
			let t = /* @__PURE__ */ k(() => H(o).length ? "No sessions match the filter." : "No sessions in this range.");
			Is(e, {
				key: r,
				get columns() {
					return To;
				},
				get rows() {
					return H(s);
				},
				rowKey: (e) => e.session_id,
				get cells() {
					return Eu;
				},
				get heading() {
					return Tu;
				},
				get intro() {
					return n;
				},
				get empty() {
					return H(t);
				},
				labelledby: "sessions-title"
			});
		}
	}, p = (e) => {
		var t = Mu(), r = F(t);
		Tu(r);
		var i = L(r, 2);
		n(i), G(e, t);
	};
	q(d, (e) => {
		H(o) ? e(f) : e(p, -1);
	}), T(u), G(e, u), D();
}
//#endregion
//#region src/lib/tiles.ts
function Fu(e, t = fa(/* @__PURE__ */ new Date()), n) {
	let r = e.history_since, i = r && r > e.since ? ` (history since ${pa(r, n)})` : "";
	return e.days === 1 ? e.until === t ? "today" : ma(e.until, n) : `last ${e.days} days${i}`;
}
function Iu(e) {
	let t = [e.unpriced_turns ? `${Z(e.unpriced_turns)} turns of models without a price are not included` : "at API list prices"];
	return e.web_searches && t.push(`incl. ${Z(e.web_searches)} web searches, ${Q(e.cost_parts.web_search)}`), t.join(" · ");
}
var Lu = "Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.";
function Ru(e) {
	let t = e.compactions === 1 ? "1 compaction" : `${Z(e.compactions)} compactions`, n = e.unknown ? `${Z(e.unknown)} without an estimate` : null;
	if (!e.compactions) return {
		title: Lu,
		verdict: null,
		amount: null,
		count: `Compacting: ${n}`
	};
	let r = e.net >= 0;
	return {
		title: Lu,
		verdict: r ? "gain" : "loss",
		amount: r ? `▲ compacting saved ~${Q(e.net)} so far` : `▼ compacting cost ~${Q(-e.net)} more so far`,
		count: `(${[t, n].filter(Boolean).join(", ")})`
	};
}
function zu(e) {
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
function Bu(e, t) {
	let n = xa(t);
	return e.map((e) => `${e.label} ${la(e.tokens, n)}`).join(", ");
}
function Vu(e, t) {
	return e?.turns ? `median context ${X(e.median)} per turn (p90 ${X(e.p90)})` + (t ? ` · compact hint at ${X(t)}` : "") : null;
}
function Hu(e, t, n, r) {
	let i = e.api_ms_without_retries === null ? null : e.api_ms - e.api_ms_without_retries, a = "no time lost to retries";
	return i === null ? a = "retries are not in the transcripts" : i > 0 && (a = `${ua(i)} of it retries`), {
		session: `wall-clock, ${t}`,
		api: a,
		tools: r ? "from each call to its result, incl. waiting for permission" : `${la(e.tool_ms, e.duration_ms)} of the session time`,
		lines: n === null ? "no lines changed" : `${Q(n)} per 100 lines changed`
	};
}
function Uu(e) {
	return `${Z(e)} ${e === 1 ? "session" : "sessions"} that ended in the range`;
}
function Wu(e) {
	return e === "cost_record" ? "from its cost record" : "estimated from the transcripts";
}
function Gu(e) {
	let t = e.runtime.lines_added + e.runtime.lines_removed;
	return e.cost === null || t === 0 ? null : e.cost / t * 100;
}
//#endregion
//#region src/components/InputSplit.svelte
var Ku = /* @__PURE__ */ U([["span"]]), qu = /* @__PURE__ */ U([[
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
]]), Ju = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Yu = /* @__PURE__ */ U([[
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
function Xu(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => xa(t.totals)), r = /* @__PURE__ */ k(() => zu(t.totals)), i = /* @__PURE__ */ k(() => Vu(t.context, t.hintTokens));
	var a = Yu(), o = P(a), s = I(o, !0), c = L(o, 2), l = I(c, !0), u = L(c, 2);
	J(u, 21, () => H(r).filter((e) => e.tokens > 0), (e) => e.label, (e, t) => {
		var n = Ku();
		let r;
		R(() => r = ii(n, "", r, {
			"flex-grow": H(t).tokens,
			background: H(t).color
		})), G(e, n);
	}), T(u);
	var d = L(u, 2);
	J(d, 17, () => H(r), (e) => e.label, (e, t) => {
		var r = qu(), i = P(r);
		gs(i, { get fill() {
			return H(t).color;
		} });
		var a = L(i, 2), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = I(l, !0), d = I(L(l, 2), !0);
		T(r), R((e, n, i, a) => {
			Y(r, "title", H(t).note), K(o, e), K(c, n), K(u, i), K(d, a);
		}, [
			() => $(H(t).label),
			() => X(H(t).tokens),
			() => la(H(t).tokens, H(n)),
			() => Q(H(t).cost)
		]), G(e, r);
	});
	var f = L(d, 2), p = (e) => {
		var t = Ju();
		Y(t, "title", "The context a main-thread turn reads: new input, cache writes and reads. The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens).");
		var n = I(t, !0);
		R(() => K(n, H(i))), G(e, t);
	};
	q(f, (e) => {
		H(i) !== null && e(p);
	}), T(a), R((e, t, n) => {
		K(s, e), K(l, t), Y(u, "aria-label", n);
	}, [
		() => $("Input tokens"),
		() => X(H(n)),
		() => Bu(H(r), t.totals)
	]), G(e, a), D();
}
//#endregion
//#region src/components/StatTile.svelte
var Zu = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Qu = /* @__PURE__ */ U([[
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
function $u(e, t) {
	E(t, !0);
	let n = Ei(t, "note", 3, null), r = Ei(t, "themedNote", 3, !1);
	var i = Qu(), a = P(i), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = (e) => {
		var t = Zu(), i = I(t, !0);
		R((e) => K(i, e), [() => r() ? $(n()) : n()]), G(e, t);
	};
	q(l, (e) => {
		n() && e(u);
	}), T(i), R((e) => {
		K(o, e), K(c, t.value);
	}, [() => $(t.label)]), G(e, i), D();
}
//#endregion
//#region src/components/KpiTiles.svelte
var ed = /* @__PURE__ */ U([
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
], 1), td = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	,
]]), nd = /* @__PURE__ */ U([
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
function rd(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => t.savings ? Ru(t.savings) : null);
	var r = nd(), i = F(r), a = P(i), o = P(a), s = I(o, !0), c = L(o);
	T(a);
	var l = L(a, 2), u = I(l, !0), d = L(l, 2), f = I(d, !0), p = L(d, 2), m = (e) => {
		var t = td(), r = P(t), i = (e) => {
			var t = ed(), r = F(t), i = I(r, !0), a = I(L(r, 2), !0);
			R(() => {
				ni(r, 1, Xr(H(n).verdict === "gain" ? "verdict-gain" : "verdict-loss")), K(i, H(n).amount), K(a, H(n).count);
			}), G(e, t);
		}, a = (e) => {
			var t = wr();
			R(() => K(t, H(n).count)), G(e, t);
		};
		q(r, (e) => {
			H(n).verdict ? e(i) : e(a, -1);
		}), T(t), R(() => Y(t, "title", H(n).title)), G(e, t);
	};
	q(p, (e) => {
		H(n) && e(m);
	}), T(i);
	var h = L(i, 2);
	Xu(h, {
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
	var g = L(h, 2);
	{
		let e = /* @__PURE__ */ k(() => Z(t.totals.turns));
		$u(g, {
			label: "Turns",
			get value() {
				return H(e);
			},
			note: "API calls with usage",
			themedNote: !0
		});
	}
	var _ = L(g, 2);
	{
		let e = /* @__PURE__ */ k(() => X(t.totals.output)), n = /* @__PURE__ */ k(() => Q(t.totals.cost_parts.output));
		$u(_, {
			label: "Output tokens",
			get value() {
				return H(e);
			},
			get note() {
				return H(n);
			}
		});
	}
	R((e, n, r) => {
		K(s, e), K(c, `, ${t.scope ?? ""}`), K(u, n), K(f, r);
	}, [
		() => $("Estimated cost"),
		() => Q(t.totals.cost),
		() => Iu(t.totals)
	]), G(e, r), D();
}
//#endregion
//#region src/components/RuntimeTiles.svelte
var id = /* @__PURE__ */ U([
	,
	,
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function ad(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => "source" in t.runtime && t.runtime.source === "transcripts"), r = /* @__PURE__ */ k(() => Hu(t.runtime, t.from, t.costPer100Lines, H(n)));
	var i = id(), a = F(i);
	{
		let e = /* @__PURE__ */ k(() => ua(t.runtime.duration_ms));
		$u(a, {
			label: "Session time",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).session;
			}
		});
	}
	var o = L(a, 2);
	{
		let e = /* @__PURE__ */ k(() => ua(t.runtime.api_ms));
		$u(o, {
			label: "Waiting on the API",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).api;
			}
		});
	}
	var s = L(o, 2);
	{
		let e = /* @__PURE__ */ k(() => ua(t.runtime.tool_ms));
		$u(s, {
			label: "Running tools",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).tools;
			}
		});
	}
	var c = L(s, 2);
	{
		let e = /* @__PURE__ */ k(() => `+${Z(t.runtime.lines_added)} / −${Z(t.runtime.lines_removed)}`);
		$u(c, {
			label: "Lines changed",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).lines;
			}
		});
	}
	G(e, i), D();
}
//#endregion
//#region src/components/SummaryTiles.svelte
var od = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]);
function sd(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => ho.summary);
	var r = W(), i = F(r), a = (e) => {
		var r = W(), i = F(r), a = (e) => {
			{
				let t = /* @__PURE__ */ k(() => Fu(H(n)));
				rd(e, {
					get totals() {
						return H(n).totals;
					},
					get scope() {
						return H(t);
					},
					get context() {
						return H(n).context;
					},
					get hintTokens() {
						return H(n).compact_hint_tokens;
					},
					get savings() {
						return H(n).compaction_savings;
					}
				});
			}
		}, o = (e) => {
			{
				let t = /* @__PURE__ */ k(() => Uu(H(n).runtime.sessions));
				ad(e, {
					get runtime() {
						return H(n).runtime;
					},
					get from() {
						return H(t);
					},
					get costPer100Lines() {
						return H(n).runtime.cost_per_100_lines;
					}
				});
			}
		};
		q(i, (e) => {
			t.rows === "kpis" ? e(a) : e(o, -1);
		}), G(e, r);
	}, o = (e) => {
		var t = od(), n = I(t, !0);
		R(() => K(n, ho.summaryFailed ? "Could not load the summary." : "Loading…")), G(e, t);
	};
	q(i, (e) => {
		H(n) ? e(a) : t.rows === "kpis" && e(o, 1);
	}), G(e, r), D();
}
//#endregion
//#region src/lib/usage.ts
function cd(e) {
	return [{ label: e }, ...Wo];
}
function ld(e, t) {
	return e.slice().sort(Uo).map((e) => ({
		key: t(e),
		name: t(e),
		kind: "plain",
		swatch: null,
		cells: Go(e),
		sub: !1,
		group: !1
	}));
}
function ud(e, t, n) {
	return e.slice().sort(Uo).flatMap((e) => [{
		key: e.model,
		name: e.model,
		kind: "model",
		swatch: Yi(n.get(e.model) ?? null),
		cells: Go(e),
		sub: !1,
		group: !0
	}, ...t.filter((t) => t.model === e.model && t.effort !== null).sort((e, t) => Vi(e.effort ?? "") - Vi(t.effort ?? "") || (e.effort ?? "").localeCompare(t.effort ?? "")).map((t) => ({
		key: `${e.model}\u0000${t.effort}`,
		name: Ui(t.effort),
		kind: "effort",
		swatch: null,
		cells: Go(t),
		sub: !0,
		group: !1
	}))]);
}
//#endregion
//#region src/components/UsageTable.svelte
var dd = /* @__PURE__ */ U([[
	"h2",
	null,
	" "
]]), fd = /* @__PURE__ */ U([[
	"p",
	{ class: "note" },
	" "
]]), pd = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), md = /* @__PURE__ */ U([[
	"span",
	{ class: "effort" },
	" "
]]), hd = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), gd = /* @__PURE__ */ U([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1), _d = /* @__PURE__ */ U([[
	"section",
	{ class: "card" },
	,
]]);
function vd(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = dd(), r = I(n, !0);
		R(() => {
			Y(n, "id", `${t.id ?? ""}-title`), K(r, t.title);
		}), G(e, n);
	}, r = (e) => {
		var n = fd(), r = I(n, !0);
		R(() => K(r, t.note)), G(e, n);
	}, i = (e, t = v) => {
		var n = gd(), r = F(n), i = P(r), o = (e) => {
			var n = pd(), r = P(n);
			gs(r, { get fill() {
				return t().swatch;
			} });
			var i = L(r, 1, !0);
			T(n), R(() => K(i, t().name)), G(e, n);
		}, s = (e) => {
			var n = md(), r = I(n, !0);
			R(() => K(r, t().name)), G(e, n);
		}, c = (e) => {
			var n = wr();
			R(() => K(n, t().name)), G(e, n);
		};
		q(i, (e) => {
			t().kind === "model" ? e(o) : t().kind === "effort" ? e(s, 1) : e(c, -1);
		}), T(r), J(L(r, 2), 19, () => H(a), (e) => e.label, (e, n, r) => {
			var i = hd(), a = I(i, !0);
			R(() => K(a, t().cells[H(r)])), G(e, i);
		}), G(e, n);
	}, a = /* @__PURE__ */ k(() => cd(t.nameLabel).slice(1));
	var o = _d(), s = P(o), c = (e) => {
		{
			let a = /* @__PURE__ */ k(() => cd(t.nameLabel)), o = /* @__PURE__ */ k(() => t.note === void 0 ? void 0 : r);
			Is(e, {
				get key() {
					return t.id;
				},
				get columns() {
					return H(a);
				},
				get rows() {
					return t.rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return i;
				},
				sub: (e) => e.sub,
				group: (e) => e.group,
				get heading() {
					return n;
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
		n(e);
	};
	q(s, (e) => {
		t.rows ? e(c) : e(l, -1);
	}), T(o), R(() => Y(o, "aria-labelledby", `${t.id ?? ""}-title`)), G(e, o), D();
}
//#endregion
//#region src/components/UsageTables.svelte
var yd = /* @__PURE__ */ U([
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
function bd(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => ho.summary), r = /* @__PURE__ */ k(() => H(n) ? ld(H(n).agent_type, (e) => e.agent_type) : null), i = /* @__PURE__ */ k(() => H(n) ? zi([...new Set(H(n).day_model.map((e) => e.model))]) : null), a = /* @__PURE__ */ k(() => H(n) && H(i) ? ud(H(n).model, H(n).model_effort, H(i)) : null), o = /* @__PURE__ */ k(() => H(n) ? ld(H(n).project, (e) => e.project) : null), s = /* @__PURE__ */ k(() => H(n) ? ld(H(n).skill, (e) => e.skill) : null), c = /* @__PURE__ */ k(() => H(n) ? ld(H(n).mcp_server, (e) => e.mcp_server) : null);
	var l = yd(), u = F(l), d = P(u);
	{
		let e = /* @__PURE__ */ k(() => $("By agent type"));
		vd(d, {
			id: "by-agent",
			get title() {
				return H(e);
			},
			nameLabel: "Agent type",
			get rows() {
				return H(r);
			},
			empty: "No usage in this range."
		});
	}
	var f = L(d, 2);
	{
		let e = /* @__PURE__ */ k(() => $("By model"));
		vd(f, {
			id: "by-model",
			get title() {
				return H(e);
			},
			nameLabel: "Model",
			get rows() {
				return H(a);
			},
			empty: "No usage in this range."
		});
	}
	T(u);
	var p = L(u, 2);
	{
		let e = /* @__PURE__ */ k(() => $("By project"));
		vd(p, {
			id: "by-project",
			get title() {
				return H(e);
			},
			nameLabel: "Project",
			get rows() {
				return H(o);
			},
			empty: "No usage in this range."
		});
	}
	var m = L(p, 2), h = P(m);
	{
		let e = /* @__PURE__ */ k(() => $("By skill"));
		vd(h, {
			id: "by-skill",
			get title() {
				return H(e);
			},
			note: "turns Claude Code attributes to a skill while it runs",
			nameLabel: "Skill",
			get rows() {
				return H(s);
			},
			empty: "No turns attributed to a skill in this range."
		});
	}
	var g = L(h, 2);
	{
		let e = /* @__PURE__ */ k(() => $("By MCP server"));
		vd(g, {
			id: "by-mcp-server",
			get title() {
				return H(e);
			},
			note: "turns Claude Code attributes to an MCP server's tools",
			nameLabel: "MCP server",
			get rows() {
				return H(c);
			},
			empty: "No turns attributed to an MCP server in this range."
		});
	}
	T(m), G(e, l), D();
}
//#endregion
//#region src/lib/banner.svelte.ts
var xd = class {
	#e = new fo();
	#t = /* @__PURE__ */ k(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return H(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, Sd = /* @__PURE__ */ t({
	mountSessionKpis: () => Dd,
	mountSessionRuntime: () => Od,
	releaseDetachedTiles: () => wd
}), Cd = /* @__PURE__ */ new Set();
function wd() {
	for (let e of [...Cd]) e.holder.isConnected || (Cd.delete(e), Fr(e.component));
}
function Td() {
	let e = document.createElement("div");
	return e.className = "kpis session-kpis", e;
}
function Ed(e, t) {
	return At(), Cd.add({
		component: e,
		holder: t
	}), queueMicrotask(wd), t;
}
function Dd(e) {
	let t = Td();
	return Ed(jr(rd, {
		target: t,
		props: {
			totals: e,
			scope: "this session",
			context: e.context,
			hintTokens: e.compact_hint_tokens,
			savings: e.compaction_savings
		}
	}), t);
}
function Od(e) {
	let t = Td();
	return t.setAttribute("role", "group"), t.setAttribute("aria-label", "Time and lines changed"), Ed(jr(ad, {
		target: t,
		props: {
			runtime: e.runtime,
			from: Wu(e.runtime.source),
			costPer100Lines: Gu(e)
		}
	}), t);
}
//#endregion
//#region src/lib/secrets.ts
var kd = /* @__PURE__ */ t({
	secretReach: () => Nd,
	secretTone: () => Ad,
	secretVia: () => jd
});
function Ad(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function jd(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var Md = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function Nd(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(Md, e.reach) ? Md[e.reach] ?? "" : "no result yet";
}
//#endregion
//#region src/legacy.svelte.ts
var Pd = [
	ta,
	Li,
	Dc,
	kd,
	Lc,
	_o,
	ba,
	Ko,
	es,
	Cs,
	_s,
	po,
	Sd
];
function Fd(e) {
	let t = new xd(), n = e.document.getElementById("error");
	if (!n?.parentElement) throw Error("The page has no #error placeholder for the banner");
	let r = ["kpis", "runtime"].map((t) => {
		let n = e.document.getElementById(t);
		if (!n) throw Error(`The page has no #${t} container for the tiles`);
		return {
			id: t,
			container: n
		};
	}), i = e.document.getElementById("live-card");
	if (!i) throw Error("The page has no #live-card container for the live sessions");
	let a = e.document.getElementById("trend-card");
	if (!a) throw Error("The page has no #trend-card container for the over-time section");
	let o = e.document.getElementById("chart-card");
	if (!o) throw Error("The page has no #chart-card container for the by-model section");
	let s = e.document.getElementById("costly-card");
	if (!s) throw Error("The page has no #costly-card container for the cost-per-session section");
	let c = e.document.getElementById("limits-card");
	if (!c) throw Error("The page has no #limits-card container for the rate-limits section");
	let l = e.document.getElementById("usage-cards");
	if (!l) throw Error("The page has no #usage-cards container for the usage tables");
	let u = e.document.getElementById("sessions-card");
	if (!u) throw Error("The page has no #sessions-card container for the sessions list");
	let d = jr(Oi, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	n.remove();
	let f = r.map(({ id: e, container: t }) => jr(sd, {
		target: t,
		props: { rows: e }
	})), p = jr(ml, { target: i }), m = jr(zl, { target: a }), h = jr(sc, { target: o }), g = jr(Ec, { target: s }), _ = jr(wu, { target: c }), v = jr(bd, { target: l }), y = jr(Pu, { target: u });
	return e.showError = (e, n) => {
		t.show(e, n), At();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...Pd), { stop() {
		Fr(d);
		for (let e of f) Fr(e);
		Fr(p), Fr(m), Fr(h), Fr(g), Fr(_), Fr(v), Fr(y), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of Pd.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
Fd(window);
//#endregion

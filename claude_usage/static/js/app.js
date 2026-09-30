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
	return ke(/* @__PURE__ */ on(w));
}
function T(e) {
	if (C) {
		if (/* @__PURE__ */ on(w) !== null) throw Te(), n;
		w = e;
	}
}
function je(e = 1) {
	if (C) {
		for (var t = e, n = w; t--;) n = /* @__PURE__ */ on(n);
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
		var i = /* @__PURE__ */ on(n);
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
		r: z,
		l: null
	};
}
function D(e) {
	var t = Ge, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) bn(r);
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
	var t = R, n = z;
	Wn(null), Gn(null);
	try {
		return e();
	} finally {
		Wn(t), Gn(n);
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
	var s = z, c = st(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				hn(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ ft(e))).then(u).catch((e) => hn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ct();
	}) : f();
}
function st() {
	var e = z, t = R, n = Ge, r = A;
	return function(i = !0) {
		Gn(e), Wn(t), Ke(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ct(e = !0) {
	Gn(null), Wn(null), Ke(null), e && A?.deactivate();
}
function lt() {
	var e = z, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ut(e) {
	var t = 2 | S;
	return z !== null && (z.f |= se), {
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
		parent: z,
		ac: null
	};
}
var dt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ft(e, t, n) {
	let i = z;
	i === null && Le();
	var a = void 0, o = Bt(r), s = !R, c = /* @__PURE__ */ new Set();
	return Cn(() => {
		var t = z, n = ee();
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
	}), yn(() => {
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
	return qn(t), t;
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
		for (var n = 0; n < t.length; n += 1) jn(t[n]);
	}
}
function ht(e) {
	var t, n = z, i = e.parent;
	if (!Vn && i !== null && e.v !== r && i.f & 24576) return we(), e.v;
	Gn(i);
	try {
		mt(e), t = ar(e);
	} finally {
		Gn(n);
	}
	return t;
}
function gt(e) {
	var t = ht(e);
	if (!e.equals(t) && (e.wv = nr(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), bt?.capture(e, t, !0)), e.deps === null))) {
		O(e, x);
		return;
	}
	Vn || (xt === null ? et(e) : (vn() || A?.is_fork) && xt.set(e, t));
}
function _t(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && it(() => {
		t.ac.abort(Se), t.ac = null;
	}), t.fn !== null && (t.teardown = v), cr(t, 0), kn(t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && lr(t);
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
				a ? r.f ^= x : i & 4 ? t.push(r) : rr(r) && (i & 16 && this.#d.add(r), lr(r));
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
		hn(e, St);
	}
}
var Mt = null;
function Nt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && rr(r) && (Mt = /* @__PURE__ */ new Set(), lr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Nn(r), Mt?.size > 0)) {
				Rt.clear();
				for (let e of Mt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Mt.has(n) && (Mt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || lr(n);
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
	return qn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Vt(e, t = !1, n = !0) {
	let r = Bt(e);
	return t || (r.equals = Ie), r;
}
function M(e, t, n = !1) {
	return R !== null && (!Un || R.f & 131072) && Je() && R.f & 4325394 && (Kn === null || !Kn.has(e)) && Ue(), Wt(e, n ? Jt(t) : t, Et);
}
var Ht = null, Ut = 0;
function Wt(e, t, n = null) {
	if (!e.equals(t)) {
		Vn ? Rt.set(e, t) : Rt.has(e) || Rt.set(e, e.v);
		var r = kt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && ht(t), xt === null && et(t);
		}
		e.wv = nr(), Ht = null, Ut = 0, qt(e, S, n), Ht = null, Je() && z !== null && z.f & 1024 && !(z.f & 96) && (Xn === null ? Zn([e]) : Xn.push(e)), !r.is_fork && Lt.size > 0 && !zt && Gt();
	}
	return t;
}
function Gt() {
	zt = !1;
	for (let e of Lt) {
		e.f & 1024 && O(e, te);
		let t;
		try {
			t = rr(e);
		} catch {
			t = !0;
		}
		t && lr(e);
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
			if (i || s !== z) {
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
	var n = /* @__PURE__ */ new Map(), i = s(e), a = /* @__PURE__ */ j(0), o = null, c = er, l = (e) => {
		if (er === c) return e();
		var t = R, n = er;
		Wn(null), tr(c);
		var r = e();
		return Wn(t), tr(n), r;
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
				var u = B(s);
				return u === r ? void 0 : u;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var i = Reflect.getOwnPropertyDescriptor(e, t), a = n.get(t);
			if (a !== void 0) {
				var o = B(a);
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
			return (i !== void 0 || z !== null && (!a || f(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ j(a ? Jt(e[t]) : r, o)), n.set(t, i)), B(i) === r) ? !1 : a;
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
			B(a);
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
var Zt, Qt, $t, en, tn;
function nn() {
	if (Zt === void 0) {
		Zt = window, Qt = document, $t = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		en = f(t, "firstChild").get, tn = f(t, "nextSibling").get, _(e) && (e[ve] = void 0, e[_e] = null, e[ye] = void 0, e.__e = void 0), _(n) && (n[be] = void 0);
	}
}
function rn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function an(e) {
	return en.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function on(e) {
	return tn.call(e);
}
function N(e, t) {
	if (!C) return /* @__PURE__ */ an(e);
	var n = /* @__PURE__ */ an(w);
	if (n === null) n = w.appendChild(rn());
	else if (t && n.nodeType !== 3) {
		var r = rn();
		return n?.before(r), ke(r), r;
	}
	return t && pn(n), ke(n), n;
}
function P(e, t = !1) {
	if (!C) {
		var n = /* @__PURE__ */ an(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ on(n) : n;
	}
	if (t) {
		if (w?.nodeType !== 3) {
			var r = rn();
			return w?.before(r), ke(r), r;
		}
		pn(w);
	}
	return w;
}
function F(e, t = !1) {
	if (!C) return /* @__PURE__ */ an(e);
	var n = N(e, t);
	return T(e), n;
}
function I(e, t = 1, n = !1) {
	let r = C ? w : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ on(r);
	if (!C) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = rn();
			return r === null ? i?.after(a) : r.before(a), ke(a), a;
		}
		pn(r);
	}
	return ke(r), r;
}
function sn(e) {
	e.textContent = "";
}
function cn() {
	return !1;
}
function ln(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function un() {
	return document.createDocumentFragment();
}
function dn(e = "") {
	return document.createComment(e);
}
function fn(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function pn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function mn(e) {
	var t = z;
	if (t === null) return R.f |= fe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	hn(e, t);
}
function hn(e, t) {
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
function gn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function _n(e, t) {
	var n = z;
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
			lr(r);
		} catch (e) {
			throw jn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= oe));
	}
	if (i !== null && (i.parent = n, n !== null && gn(i, n), R !== null && R.f & 2 && !(e & 64))) {
		var a = R;
		(a.effects ??= []).push(i);
	}
	return r;
}
function vn() {
	return R !== null && !Un;
}
function yn(e) {
	let t = _n(8, null);
	return O(t, x), t.teardown = e, t;
}
function bn(e) {
	return _n(4 | ce, e);
}
function xn(e) {
	kt.ensure();
	let t = _n(64 | se, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Pn(t, () => {
			jn(t), n(void 0);
		}) : (jn(t), n(void 0));
	});
}
function Sn(e) {
	return _n(4, e);
}
function Cn(e) {
	return _n(de | se, e);
}
function wn(e, t = 0) {
	return _n(8 | t, e);
}
function L(e, t = [], n = [], r = []) {
	ot(r, t, n, (t) => {
		_n(8, () => {
			e(...t.map(B));
		});
	});
}
function Tn(e, t = 0) {
	return _n(16 | t, e);
}
function En(e, t = 0) {
	return _n(b | t, e);
}
function Dn(e) {
	return _n(32 | se, e);
}
function On(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Vn, r = R;
		Hn(!0), Wn(null);
		try {
			t.call(null);
		} catch (t) {
			hn(t, e.parent);
		} finally {
			Hn(n), Wn(r);
		}
	}
}
function kn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && it(() => {
			e.abort(Se);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : jn(n, t), n = r;
	}
}
function An(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || jn(t), t = n;
	}
}
function jn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Mn(e.nodes.start, e.nodes.end), n = !0), e.f |= ae, kn(e, t && !n), cr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	On(e), e.f ^= ae, e.f |= re;
	var i = e.parent;
	i !== null && i.first !== null && Nn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Mn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ on(e);
		e.remove(), e = n;
	}
}
function Nn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Pn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Fn(e, r, !0);
	var i = () => {
		n && jn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Fn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ne;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Fn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function In(e) {
	e.f &= -257, Ln(e, !0);
}
function Ln(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ne, e.f & 1024 || (O(e, S), kt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Ln(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Rn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ on(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var zn = null, Bn = !1, Vn = !1;
function Hn(e) {
	Vn = e;
}
var R = null, Un = !1;
function Wn(e) {
	R = e;
}
var z = null;
function Gn(e) {
	z = e;
}
var Kn = null;
function qn(e) {
	R !== null && (R.f & 2097152 || R.f & 2) && (Kn ??= /* @__PURE__ */ new Set()).add(e);
}
var Jn = null, Yn = 0, Xn = null;
function Zn(e) {
	Xn = e;
}
var Qn = 1, $n = 0, er = $n;
function tr(e) {
	er = e;
}
function nr() {
	return ++Qn;
}
function rr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (rr(a) && gt(a), a.wv > e.wv) return !0;
		}
		t & 512 && xt === null && O(e, x);
	}
	return !1;
}
function ir(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Kn !== null && Kn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ir(a, t, !1) : t === a && (n ? O(a, S) : a.f & 1024 && O(a, te), Pt(a));
	}
}
function ar(e) {
	var t = Jn, n = Yn, r = Xn, i = R, a = Kn, o = Ge, s = Un, c = er, l = e.f;
	Jn = null, Yn = 0, Xn = null, R = l & 96 ? null : e, Kn = null, Ke(e.ctx), Un = !1, er = ++$n, e.ac !== null && (it(() => {
		e.ac.abort(Se);
	}), e.ac = null);
	try {
		e.f |= ue;
		var u = e.fn, d = u();
		e.f |= ie;
		var f = or(e);
		if (Je() && Xn !== null && !Un && f !== null && !(e.f & 6146)) for (var p = 0; p < Xn.length; p++) ir(Xn[p], e);
		if (i !== null && i !== e) {
			if ($n++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = $n;
			if (t !== null) for (let e of t) e.rv = $n;
			Xn !== null && (r === null ? r = Xn : r.push(...Xn));
		}
		return e.f & 8388608 && (e.f ^= fe), d;
	} catch (t) {
		return or(e), mn(t);
	} finally {
		e.f ^= ue, Jn = t, Yn = n, Xn = r, R = i, Kn = a, Ke(o), Un = s, er = c;
	}
}
function or(e) {
	var t = e.deps, n = A?.is_fork;
	if (Jn !== null) {
		var r;
		if (n || cr(e, Yn), t !== null && Yn > 0) for (t.length = Yn + Jn.length, r = 0; r < Jn.length; r++) t[Yn + r] = Jn[r];
		else e.deps = t = Jn;
		if (vn() && e.f & 512) for (r = Yn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Yn < t.length && (cr(e, Yn), t.length = Yn);
	return t;
}
function sr(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var i = c.call(n, e);
		if (i !== -1) {
			var a = n.length - 1;
			a === 0 ? n = t.reactions = null : (n[i] = n[a], n.pop());
		}
	}
	if (n === null && t.f & 2 && (Jn === null || !l.call(Jn, t))) {
		var o = t;
		o.f & 512 && (o.f ^= 512), o.v !== r && et(o), o.ac !== null && it(() => {
			o.ac.abort(Se), o.ac = null, O(o, S);
		}), _t(o), cr(o, 0);
	}
}
function cr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) sr(e, n[r]);
}
function lr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		O(e, x);
		var n = z, r = Bn;
		z = e, Bn = !(t & 96);
		try {
			t & 16777232 ? An(e) : kn(e), On(e);
			var i = ar(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Qn;
		} finally {
			Bn = r, z = n;
		}
	}
}
async function ur() {
	await Promise.resolve(), At();
}
function B(e) {
	var t = !!(e.f & 2);
	if (zn?.add(e), R !== null && !Un && !(z !== null && z.f & 16384) && (Kn === null || !Kn.has(e))) {
		var n = R.deps;
		if (R.f & 2097152) e.rv < $n && (e.rv = $n, Jn === null && n !== null && n[Yn] === e ? Yn++ : Jn === null ? Jn = [e] : Jn.push(e));
		else {
			R.deps ??= [], l.call(R.deps, e) || R.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [R] : l.call(r, R) || r.push(R);
		}
	}
	if (Vn && Rt.has(e)) return Rt.get(e);
	if (t) {
		var i = e;
		if (Vn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || fr(i)) && (a = ht(i)), Rt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Un && R !== null && (Bn || !!(R.f & 512)), s = (i.f & ie) === 0;
		rr(i) && (o && (i.f |= 512), gt(i)), o && !s && (vt(i), dr(i));
	}
	if (xt?.has(e)) return xt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function dr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (vt(t), dr(t));
}
function fr(e) {
	if (e.v === r) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rt.has(t) || t.f & 2 && fr(t)) return !0;
	return !1;
}
function pr(e) {
	var t = Un;
	try {
		return Un = !0, e();
	} finally {
		Un = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var mr = Symbol("events"), hr = /* @__PURE__ */ new Set(), gr = /* @__PURE__ */ new Set();
function _r(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Cr.call(t, e), !e.cancelBubble) return it(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Ze(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function vr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = _r(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && yn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function yr(e, t, n) {
	(t[mr] ??= {})[e] = n;
}
function br(e) {
	for (var t = 0; t < e.length; t++) hr.add(e[t]);
	for (var n of gr) n(e);
}
var xr = null, Sr = !1;
function Cr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	xr = e, Sr || (Sr = !0, setTimeout(() => {
		Sr = !1, xr = null;
	}));
	var o = 0, s = xr === e && e[mr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[mr] = t;
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
		var u = R, f = z;
		Wn(null), Gn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[mr]?.[r];
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
			e[mr] = t, delete e.currentTarget, Wn(u), Gn(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var wr = Ce ? "template" : "TEMPLATE";
function Tr(e, t) {
	var n = z;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function Er(e, t) {
	var n = un();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(rn(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(dn(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = r, u = e === "svg" ? a : e === "math" ? o : t;
		var i = ln(e, u, c?.is);
		for (var s in c) fn(i, s, c[s]);
		l.length > 0 && (i.nodeName === wr ? i.content : i).append(Er(l, i.nodeName === "foreignObject" ? void 0 : u)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function V(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (C) return Tr(w, null), w;
		i === void 0 && (i = Er(e, t & 4 ? a : t & 8 ? o : void 0), n || (i = /* @__PURE__ */ an(i)));
		var s = r || $t ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ an(s), l = s.lastChild;
			Tr(c, l);
		} else Tr(s, s);
		return s;
	};
}
function Dr(e = "") {
	if (!C) {
		var t = rn(e + "");
		return Tr(t, t), t;
	}
	var n = w;
	return n.nodeType === 3 ? pn(n) : (n.before(n = rn()), ke(n)), Tr(n, n), n;
}
function H() {
	if (C) return Tr(w, null), w;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = rn();
	return e.append(t, n), Tr(t, n), e;
}
function U(e, t) {
	if (C) {
		var n = z;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = w), Ae();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Or = ["touchstart", "touchmove"];
function kr(e) {
	return Or.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Ar(e) {
	let t = 0, n = Bt(0), r;
	return () => {
		vn() && (B(n), wn(() => (t === 0 && (r = pr(() => e(() => Kt(n)))), t += 1, () => {
			Ze(() => {
				--t, t === 0 && (r?.(), r = void 0, Kt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var jr = oe | se;
function Mr(e, t, n, r) {
	new Nr(e, t, n, r);
}
var Nr = class {
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
	#h = Ar(() => (this.#m = Bt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = z;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = z.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Tn(() => {
			if (C) {
				let e = this.#t;
				Ae();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, jr), C && (this.#e = w);
	}
	#g() {
		try {
			this.#a = Dn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Ze(r), t && (this.#s = Dn(() => {
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
			t = !0, n && We(), this.#s !== null && Pn(this.#s, () => {
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
					hn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Dn(() => e(this.#e)), Ze(() => {
			var e = this.#c = document.createDocumentFragment(), t = rn(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return Dn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						hn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(A);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Pn(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Dn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Rn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Dn(() => t(this.#e));
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
		var t = z, n = R, r = Ge;
		Gn(this.#i), Wn(this.#i), Ke(this.#i.ctx);
		try {
			return kt.ensure(), e();
		} finally {
			Gn(t), Wn(n), Ke(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Pn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ze(() => {
			this.#d = !1, this.#m && Wt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), B(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (jn(this.#a), null), this.#o &&= (jn(this.#o), null), this.#s &&= (jn(this.#s), null), C && (ke(this.#t), je(), ke(Me()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Dn(() => {
						var r = z;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return hn(e, this.#i.parent), null;
				}
			}));
		};
		Ze(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				hn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => hn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function W(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[be] ??= e.nodeValue) && (e[be] = n, e.nodeValue = `${n}`);
}
function Pr(e, t) {
	return Ir(e, t);
}
var Fr = /* @__PURE__ */ new Map();
function Ir(e, { target: t, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	nn();
	var l = void 0, d = xn(() => {
		var s = r ?? t.appendChild(rn());
		Mr(s, { pending: () => {} }, (t) => {
			E({});
			var r = Ge;
			if (o && (r.c = o), a && (i.$$events = a), C && Tr(t, null), l = e(t, i) || qe(), C && (z.nodes.end = w, w === null || w.nodeType !== 8 || w.data !== "]")) throw Te(), n;
			D();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = kr(r);
					for (let e of [t, document]) {
						var a = Fr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Fr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Cr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(u(hr)), gr.add(f), () => {
			for (var e of d) for (let r of [t, document]) {
				var n = Fr.get(r), i = n.get(e);
				--i == 0 ? (r.removeEventListener(e, Cr), n.delete(e), n.size === 0 && Fr.delete(r)) : n.set(e, i);
			}
			gr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Lr.set(l, d), l;
}
var Lr = /* @__PURE__ */ new WeakMap();
function Rr(e, t) {
	let n = Lr.get(e);
	return n ? (Lr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var zr = class {
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
			if (n) In(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (In(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (jn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Rn(r, t), t.append(rn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else jn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Pn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (jn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = cn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = rn();
				i.append(a), this.#n.set(e, {
					effect: Dn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Dn(() => t(this.anchor)));
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
function Br(e, t, ...n) {
	var r = new zr(e);
	Tn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, oe);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function G(e, t, n = !1) {
	var r;
	C && (r = w, Ae());
	var i = new zr(e), a = n ? oe : 0;
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
	Tn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var Vr = Symbol("NaN");
function Hr(e, t, n) {
	C && Ae();
	var r = new zr(e), i = !Je();
	Tn(() => {
		var e = t();
		e !== e && (e = Vr), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Ur(e, t) {
	return t;
}
function Wr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Pn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Gr(e, u(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, d = l.parentNode;
			sn(d), d.append(l), e.items.clear();
		}
		Gr(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Gr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= le, Rn(a, document.createDocumentFragment())) : jn(t[i], n);
	}
}
var Kr;
function K(e, t, n, r, i, a = null) {
	var o = e, c = /* @__PURE__ */ new Map();
	if (t & 4) {
		var l = e;
		o = C ? ke(/* @__PURE__ */ an(l)) : l.appendChild(rn());
	}
	C && Ae();
	var d = null, f = /* @__PURE__ */ pt(() => {
		var e = n();
		return s(e) ? e : e == null ? [] : u(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Jr(v, p, o, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= le, Xr(d, null, o)) : In(d) : Pn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Tn(() => {
			p = B(f);
			var e = p.length;
			let s = !1;
			C && Ne(o) === "[!" != (e === 0) && (o = Me(), ke(o), Oe(!1), s = !0);
			for (var l = /* @__PURE__ */ new Set(), u = A, v = cn(), y = 0; y < e; y += 1) {
				C && w.nodeType === 8 && w.data === "]" && (o = w, s = !0, Oe(!1));
				var ee = p[y], b = r(ee, y), x = h ? null : c.get(b);
				x ? (x.v && Wt(x.v, ee), x.i && Wt(x.i, y), v && u.unskip_effect(x.e)) : (x = Yr(c, h ? o : Kr ??= rn(), ee, b, y, i, t, n), h || (x.e.f |= le), c.set(b, x)), l.add(b);
			}
			if (e === 0 && a && !d && (h ? d = Dn(() => a(o)) : (d = Dn(() => a(Kr ??= rn())), d.f |= le)), e > l.size && Re("", "", ""), C && e > 0 && ke(Me()), !h) {
				if (m.set(u, l), v) {
					for (let [e, t] of c) l.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			s && Oe(!0), B(f);
		}),
		flags: t,
		items: c,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, C && (o = w);
}
function qr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Jr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = qr(e.effect.first), l, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (In(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= le, _ === c) Xr(_, null, n);
			else {
				var y = d ? d.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Zr(e, d, _), Zr(e, _, y), Xr(_, y, n), d = _, p = [], m = [], c = qr(d.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var ee = m[0], b;
					d = ee.prev;
					var x = p[0], S = p[p.length - 1];
					for (b = 0; b < p.length; b += 1) Xr(p[b], ee, n);
					for (b = 0; b < m.length; b += 1) l.delete(m[b]);
					Zr(e, x.prev, S.next), Zr(e, d, x), Zr(e, S, ee), c = ee, d = S, --v, p = [], m = [];
				} else l.delete(_), Xr(_, c, n), Zr(e, _.prev, _.next), Zr(e, _, d === null ? e.effect.first : d.next), Zr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = qr(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, c = qr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Gr(e, u(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var te = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || te.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && te.push(c), c = qr(c.next);
		var ne = te.length;
		if (ne > 0) {
			var re = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.measure();
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.fix();
			}
			Wr(e, te, re);
		}
	}
	a && Ze(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Yr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Bt(n) : /* @__PURE__ */ Vt(n, !1, !1) : null, l = o & 2 ? Bt(i) : null;
	return {
		v: c,
		i: l,
		e: Dn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Xr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ on(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Zr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Qr(e, t) {
	var n = void 0, r;
	En(() => {
		n !== (n = t()) && (r &&= (jn(r), null), n && (r = Dn(() => {
			Sn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function $r(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = $r(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function ei() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = $r(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function ti(e) {
	return typeof e == "object" ? ei(e) : e ?? "";
}
var ni = [..." 	\n\r\f\xA0\v﻿"];
function ri(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ni.includes(r[o - 1])) && (s === r.length || ni.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ii(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ai(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function oi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ai)), i && c.push(...Object.keys(i).map(ai));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ai(e.substring(l, u).trim());
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
		return r && (n += ii(r)), i && (n += ii(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function si(e, t, n, r, i, a) {
	var o = e[ve];
	if (C || o !== n || o === void 0) {
		var s = ri(n, r, a);
		(!C || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ve] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function ci(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function li(e, t, n, r) {
	var i = e[ye];
	if (C || i !== t) {
		var a = oi(t, r);
		(!C || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ye] = t;
	} else r && (Array.isArray(r) ? (ci(e, n?.[0], r[0]), ci(e, n?.[1], r[1], "important")) : ci(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ui(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function di(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || s(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = hi(c);
			ui(c, r ? i.includes(l) : Xt(l, n));
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
function fi(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!s(t)) return Ee();
		for (var r of e.options) r.selected = t.includes(hi(r));
		return;
	}
	for (r of e.options) if (Xt(hi(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function pi(e) {
	var t = new MutationObserver((t) => {
		t.every(gi) || ("__defaultValue" in e && di(e, !1), "__value" in e && fi(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), yn(() => {
		t.disconnect();
	});
}
function mi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	at(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), hi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && hi(o);
		}
		n(a), e.__value = a, A !== null && r.add(A);
	}), Sn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = A;
			if (r.has(o)) return;
		}
		if (fi(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = hi(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function hi(e) {
	return "__value" in e ? e.__value : e.value;
}
function gi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var _i = Symbol("is custom element"), vi = Symbol("is html"), yi = Ce ? "link" : "LINK", bi = Ce ? "progress" : "PROGRESS";
function xi(e) {
	if (C) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					q(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					q(e, "checked", null), e.checked = r;
				}
			}
		};
		e[xe] = n, Ze(n), rt();
	}
}
function Si(e, t) {
	var n = Ci(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === bi) && (e.value = t ?? "");
}
function q(e, t, n, r) {
	var i = Ci(e);
	C && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === yi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ge] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ti(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Ci(e) {
	return e[_e] ??= {
		[_i]: e.nodeName.includes("-"),
		[vi]: e.namespaceURI === i
	};
}
var wi = /* @__PURE__ */ new Map();
function Ti(e) {
	var t = e.getAttribute("is") || e.nodeName, n = wi.get(t);
	if (n) return n;
	wi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = p(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = g(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Ei(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	at(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Di(e) ? Oi(a) : a, n(a), A !== null && r.add(A), await ur(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (C && e.defaultValue !== e.value || pr(t) == null && e.value) && (n(Di(e) ? Oi(e.value) : e.value), A !== null && r.add(A)), wn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = A;
			if (r.has(i)) return;
		}
		Di(e) && n === Oi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Di(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Oi(e) {
	return e === "" ? null : +e;
}
var ki = /* @__PURE__ */ new class e {
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
function Ai(e, t, n) {
	var r = ki.observe(e, () => n(e[t]));
	Sn(() => (pr(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var ji = !1;
function Mi(e) {
	var t = ji;
	try {
		return ji = !1, [e(), ji];
	} finally {
		ji = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Ni(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ ut(r), B(l)) : (c && (c = !1, s = o ? pr(r) : r), s);
	let d;
	if (a) {
		var p = pe in e || he in e;
		d = f(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = Mi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = u(), d && (i && Be(t), d(m)));
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
	a && B(y);
	var ee = z;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? B(y) : i && a ? Jt(e) : e;
			return M(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Vn && v || ee.f & 16384 ? y.v : B(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var Pi = /* @__PURE__ */ V([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function Fi(e, t) {
	E(t, !0);
	var n = Pi(), r = F(n, !0);
	L(() => W(r, t.messages.text)), U(e, n), D();
}
var Ii = 12;
function Li(e) {
	return Math.max(320, e);
}
function Ri(e, t) {
	return e && t ? e / t : 1;
}
function zi(e, t, n, r) {
	return (e - t) * r / (n || r);
}
function Bi(e, t, n) {
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
function Vi(e, t, n) {
	return Math.max(0, Math.min(e + Ii, n - t));
}
function Hi(e, t = 8) {
	let n = Math.max(1, Math.ceil(e / t));
	return Array.from({ length: Math.ceil(e / n) }, (e, t) => t * n);
}
function Ui(e) {
	return Math.round(e) + .5;
}
//#endregion
//#region src/lib/colors.ts
var Wi = /* @__PURE__ */ t({
	BACKGROUND_EFFORT: () => Yi,
	EFFORT_ORDER: () => qi,
	EFFORT_SHADES: () => Qi,
	HATCH_SHADES: () => $i,
	HATCH_TURNS: () => ea,
	KNOWN_MODELS: () => Gi,
	SLOT_COUNT: () => 8,
	effortHatch: () => aa,
	effortLabel: () => Zi,
	effortName: () => Xi,
	effortRank: () => Ji,
	effortShade: () => ia,
	hatchTurn: () => oa,
	modelSlots: () => Ki,
	shade: () => ra,
	slotColor: () => na,
	swatchFill: () => sa
}), Gi = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function Ki(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Gi.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !Gi.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var qi = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function Ji(e) {
	let t = qi.indexOf(e);
	return t === -1 ? qi.length : t;
}
var Yi = "background";
function Xi(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function Zi(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var Qi = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, $i = {
	background: 1,
	ultracode: 4
}, ea = {
	background: -45,
	ultracode: 45
};
function ta(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function na(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function ra(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? na(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function ia(e, t) {
	return ra(e, ta(Qi, t) ?? 0);
}
function aa(e, t) {
	let n = ta($i, t);
	return n ? ra(e, n) : null;
}
function oa(e) {
	return ta(ea, e);
}
function sa(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var ca = /* @__PURE__ */ t({
	ago: () => Ta,
	compact: () => J,
	dayText: () => ya,
	duration: () => _a,
	longDay: () => xa,
	longHour: () => wa,
	money: () => X,
	parseDay: () => va,
	parseHour: () => Sa,
	percent: () => ga,
	shortDay: () => ba,
	shortHour: () => Ca,
	signed: () => ha,
	when: () => Z,
	whole: () => Y
}), la = "–", ua = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), da = new Intl.NumberFormat("en"), fa = {
	month: "short",
	day: "numeric"
}, pa = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, ma = {
	hour: "2-digit",
	minute: "2-digit"
};
function J(e) {
	return e == null ? la : ua.format(e);
}
function ha(e) {
	return e < 0 ? `−${J(-e)}` : `+${J(e)}`;
}
function Y(e) {
	return e == null ? la : da.format(e);
}
function X(e) {
	return e == null ? la : Math.abs(e) >= 1e3 ? "$" + ua.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function ga(e, t) {
	if (!t) return la;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function _a(e) {
	if (e == null) return la;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function va(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function ya(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function ba(e, t) {
	return va(e).toLocaleDateString(t, fa);
}
function xa(e, t) {
	return va(e).toLocaleDateString(t, pa);
}
function Sa(e) {
	let [t = "", n = "0"] = e.split("T"), r = va(t);
	return r.setHours(Number(n)), r;
}
function Ca(e, t) {
	return Sa(e).toLocaleTimeString(t, ma);
}
function wa(e, t) {
	let n = Sa(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, ma);
	return `${n.toLocaleDateString(t, pa)}, ${i(n)}–${i(r)}`;
}
function Z(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...fa,
		...ma
	}) : la;
}
function Ta(e, t = Date.now(), n) {
	if (!e) return la;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : Z(e, n);
}
//#endregion
//#region src/lib/charts.ts
var Ea = /* @__PURE__ */ t({
	LIMIT_ICON: () => "⚠",
	NO_USAGE: () => za,
	RATE_LIMIT: () => Ga,
	bandIndex: () => Na,
	barShare: () => eo,
	bucketTotals: () => Ba,
	chartSeries: () => Va,
	columnPath: () => Fa,
	columnTotals: () => Ua,
	columnWidth: () => Pa,
	costSplit: () => Qa,
	costTop: () => $a,
	daysSince: () => La,
	errorText: () => Ja,
	inputTotal: () => Da,
	limitCounts: () => Ya,
	limitTop: () => Aa,
	limitType: () => qa,
	lineX: () => ja,
	modelGroups: () => Ha,
	nearestIndex: () => Ma,
	niceMax: () => Oa,
	peakIndex: () => Ia,
	stackSegments: () => Wa,
	ticks: () => ka,
	timeBuckets: () => Ra,
	windowHitAfter: () => Xa,
	windowSpan: () => Za
});
function Da(e) {
	return e.new_input + e.cache_write + e.cache_read;
}
function Oa(e) {
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
function ka(e, t) {
	return Array.from({ length: t + 1 }, (n, r) => e * r / t);
}
function Aa(e) {
	return Math.max(2, Math.ceil(Oa(e) / 2) * 2);
}
function ja(e, t, n) {
	let r = e - 1;
	return (e) => r > 0 ? t + (n - t) * e / r : (t + n) / 2;
}
function Ma(e, t, n) {
	return (r) => n > 1 ? Math.round((r - e) / (t - e) * (n - 1)) : 0;
}
function Na(e, t) {
	return (n) => Math.floor((n - e) / t);
}
function Pa(e, t = 24) {
	return Math.max(2, Math.min(t, e * .6));
}
function Fa(e, t, n, r, i, a = 4) {
	let o = i ? Math.min(a, n / 2, r) : 0;
	return `M${e},${t + r}V${t + o}` + (o ? `Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}` : `H${e + n}`) + `V${t + r}Z`;
}
function Ia(e) {
	return e.indexOf(Math.max(...e));
}
function La(e, t = /* @__PURE__ */ new Date()) {
	let n = [];
	for (let r = va(e); r <= t; r.setDate(r.getDate() + 1)) n.push(ya(r));
	return n;
}
function Ra(e, t = /* @__PURE__ */ new Date()) {
	if (e.days !== 1 || !e.hour_model) return {
		keys: La(e.since, t),
		unit: "day",
		heading: "Day",
		short: ba,
		long: xa,
		keyOf: (e) => e.day ?? ""
	};
	let n = e.since === ya(t) ? t.getHours() : 23, r = [];
	for (let t = 0; t <= n; t += 1) r.push(`${e.since}T${String(t).padStart(2, "0")}`);
	return {
		keys: r,
		unit: "hour",
		heading: "Hour",
		short: Ca,
		long: wa,
		keyOf: (e) => e.hour ?? ""
	};
}
var za = {
	cost: 0,
	input: 0,
	output: 0
};
function Ba(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			cost: 0,
			input: 0,
			output: 0
		};
		i.cost += r.cost || 0, i.input += Da(r), i.output += r.output, n.set(e, i);
	}
	return n;
}
function Va(e, t, n) {
	let r = Ki([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${Xi(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: ia(e, a.effort),
			hatch: aa(e, a.effort),
			turn: oa(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : Ji(e);
	return [...i.values()].sort((e, t) => (e.slot ?? 8) - (t.slot ?? 8) || e.model.localeCompare(t.model) || a(e.effort) - a(t.effort) || String(e.effort).localeCompare(String(t.effort)));
}
function Ha(e) {
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
function Ua(e, t) {
	return t.map((t) => e.reduce((e, n) => e + (n.values.get(t) ?? 0), 0));
}
function Wa(e, t, n, r = 2, i = 4) {
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
var Ga = "rate_limit", Ka = {
	five_hour: "5-hour limit",
	seven_day: "weekly limit",
	seven_day_opus: "weekly Opus limit"
};
function qa(e) {
	return e ? Object.hasOwn(Ka, e) ? Ka[e] ?? e : e.replaceAll("_", " ") : "–";
}
function Ja(e) {
	let t = e.status ? ` (${e.status})` : "";
	return e.error === "rate_limit" ? `⚠ Rate limit${t}` : `${e.error.replaceAll("_", " ")}${t}`;
}
function Ya(e, t) {
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
function Xa(e) {
	return Date.parse(e.first_hit) - Date.parse(e.start);
}
function Za(e, t) {
	let n = new Date(e.start), r = new Date(e.resets_at), i = n.toDateString() === r.toDateString() ? r.toLocaleTimeString(t, {
		hour: "2-digit",
		minute: "2-digit"
	}) : Z(e.resets_at, t);
	return `${Z(e.start, t)} – ${i}`;
}
function Qa(e) {
	let t = e.cost_parts.cache_read;
	return {
		cacheRead: t,
		rest: Math.max(0, (e.cost || 0) - t)
	};
}
function $a(e) {
	return Math.max(0, ...e.map((e) => e.cost || 0)) || 1;
}
function eo(e, t) {
	return 100 * (e || 0) / t;
}
//#endregion
//#region src/lib/bymodel.ts
var to = {
	cost: {
		label: "Estimated cost",
		value: (e) => e.cost || 0,
		format: X
	},
	output: {
		label: "Output tokens",
		value: (e) => e.output,
		format: J
	},
	input: {
		label: "Input tokens",
		value: Da,
		format: J
	}
}, no = Object.keys(to);
function ro(e) {
	return no.find((t) => t === e) ?? "cost";
}
var io = 248;
function ao(e, t, n = /* @__PURE__ */ new Date()) {
	let r = to[t], i = Ra(e, n), a = Va(i.unit === "hour" ? e.hour_model_effort : e.day_model_effort, i.keyOf, r.value);
	return {
		buckets: i,
		series: a,
		totals: Ua(a, i.keys),
		metric: r
	};
}
function oo(e, t) {
	let n = e - 8, r = (n - 56) / t;
	return {
		right: n,
		band: r,
		barWidth: Pa(r, 24)
	};
}
function so(e, t) {
	return Na(56, oo(e, t).band);
}
function co(e, t, n) {
	let { band: r, barWidth: i } = oo(e, t);
	return 56 + r * n + (r - i) / 2;
}
function lo(e, t, n) {
	let r = e.filter((e) => (e.values.get(t) ?? 0) > 0), i = r.map((e) => 220 * (e.values.get(t) ?? 0) / n);
	return Wa(r.map((e) => e.model), i, 220, 2, 4).map((e) => ({
		entry: r[e.position],
		segment: e
	}));
}
function uo(e) {
	let t = e.filter((e) => e.hatch).map((e, t) => ({
		id: `model-hatch-${t}`,
		entry: e
	})), n = new Map(t.map((e) => [e.entry, e.id]));
	return {
		patterns: t,
		fill: (e) => n.has(e) ? `url(#${n.get(e)})` : e.color
	};
}
function fo(e, t) {
	return `${e.label} per ${t} by model and effort level; table view available`;
}
function po(e, t) {
	return `${e.label} per ${t}; arrow keys step through them`;
}
function mo(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${e.metric.format(e.totals[t] ?? 0)}`;
}
function ho(e) {
	return Ha(e).map((e) => ({
		model: e.model,
		entries: e.entries.map((e) => ({
			entry: e,
			text: Zi(e.effort)
		}))
	}));
}
function go(e, t) {
	return Ha(e.filter((e) => e.values.get(t))).map((e) => ({
		model: e.model,
		value: e.entries.reduce((e, n) => e + (n.values.get(t) ?? 0), 0),
		efforts: e.entries.slice().reverse().map((e) => ({
			entry: e,
			text: Zi(e.effort),
			value: e.values.get(t) ?? 0
		}))
	}));
}
function _o(e) {
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
var vo = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ j(0);
	#n = /* @__PURE__ */ j(0);
	#r = er || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return er === this.#r ? /* @__PURE__ */ j(e) : Bt(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return B(this.#t), !1;
		}
		return B(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				B(this.#t);
				return;
			}
		}
		return B(n), super.get(e);
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
		B(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) B(n);
	}
	keys() {
		return B(this.#t), super.keys();
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
		return B(this.#n), super.size;
	}
}, yo = /* @__PURE__ */ t({
	Payload: () => bo,
	payload: () => Q,
	setPayload: () => xo
}), bo = class {
	#e = /* @__PURE__ */ j(null);
	#t = /* @__PURE__ */ j(!1);
	#n = /* @__PURE__ */ j(null);
	#r = /* @__PURE__ */ j(!1);
	#i = /* @__PURE__ */ j(null);
	#a = /* @__PURE__ */ j(null);
	#o = new vo();
	get summary() {
		return B(this.#e);
	}
	get summaryFailed() {
		return B(this.#t);
	}
	get live() {
		return B(this.#n);
	}
	get liveFailed() {
		return B(this.#r);
	}
	get liveAt() {
		return B(this.#i);
	}
	get session() {
		return B(this.#a);
	}
	liveState(e) {
		return this.#o.get(e);
	}
	setLiveState(e, t) {
		this.#o.set(e, t);
	}
	keepLiveStates(e) {
		let t = [...e];
		for (let e of [...this.#o.keys()]) t.includes(e) || this.#o.delete(e);
	}
	set(e) {
		e.summary !== void 0 && (M(this.#e, e.summary), M(this.#t, !1)), e.summaryFailed !== void 0 && M(this.#t, e.summaryFailed, !0), e.live !== void 0 && (M(this.#n, e.live), M(this.#r, !1)), e.liveFailed !== void 0 && M(this.#r, e.liveFailed, !0), e.liveAt !== void 0 && M(this.#i, e.liveAt, !0), e.session !== void 0 && M(this.#a, e.session);
	}
	reset() {
		M(this.#e, null), M(this.#t, !1), M(this.#n, null), M(this.#r, !1), M(this.#i, null), M(this.#a, null), this.#o.clear();
	}
}, Q = new bo();
function xo(e) {
	Q.set(e), At();
}
//#endregion
//#region src/lib/tables.ts
var So = /* @__PURE__ */ t({
	DEFAULT_PAGE_SIZE: () => 25,
	PAGE_SIZES: () => Co,
	SESSION_COLUMNS: () => Ao,
	TOOL_KINDS: () => No,
	USAGE_COLUMNS: () => Yo,
	byCost: () => Jo,
	chatRows: () => Ko,
	detailNoun: () => zo,
	emptyDetail: () => Io,
	entryKey: () => Go,
	kindLabel: () => Fo,
	orderedEntries: () => Wo,
	pageSizeFrom: () => Do,
	pageText: () => Eo,
	pageUnits: () => wo,
	pageWindow: () => To,
	sessionCells: () => jo,
	sessionCount: () => Mo,
	sessionMatches: () => Oo,
	sessionProjects: () => ko,
	toolFolds: () => Ho,
	toolRowClass: () => Bo,
	toolRowName: () => Vo,
	toolRowShown: () => Uo,
	toolTableRows: () => Po,
	toolsAndChat: () => qo,
	usageCells: () => Xo
}), Co = [
	10,
	25,
	50
];
function wo(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function To(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function Eo(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function Do(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function Oo(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function ko(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
var Ao = [
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
function jo(e) {
	return [
		Z(e.last_ts),
		Y(e.subagents),
		Y(e.turns),
		J(e.context_avg),
		J(e.context_peak),
		J(e.output),
		X(e.cost)
	];
}
function Mo(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var No = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function Po(e) {
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
function Fo(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function Io(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var Lo = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, Ro = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function zo(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn(Ro, e.tool) && Ro[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(Lo, n) && Lo[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function Bo(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function Vo(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: Fo(e, No)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || Io(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function Ho(e) {
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
			label: `${Y(a)} ${zo(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function Uo(e, t) {
	return e.every((e) => t.has(e));
}
function Wo(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function Go(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function Ko(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return Wo(e, t).map((e) => ({
		key: Go(e, n.get(e) ?? 0),
		entry: e
	}));
}
function qo(e, t, n) {
	return e ? [n, t] : [t, n];
}
function Jo(e, t) {
	return (t.cost ?? -1) - (e.cost ?? -1) || t.turns - e.turns;
}
var Yo = [
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
function Xo(e) {
	let t = Da(e);
	return [
		Y(e.turns),
		J(t),
		ga(e.cache_read, t),
		J(e.output),
		X(e.cost)
	];
}
//#endregion
//#region src/lib/themes.ts
var Zo = /* @__PURE__ */ t({
	THEMES: () => Qo,
	themeFooter: () => is,
	themeLabel: () => rs,
	themeName: () => ts
}), Qo = [
	"light",
	"dark",
	"hacker",
	"startup",
	"rgb"
], $o = { techbro: "rgb" }, es = {
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
function ts(e) {
	if (e == null) return null;
	let t = (Object.hasOwn($o, e) ? $o[e] : e) ?? e;
	return Qo.includes(t) ? t : null;
}
function ns(e) {
	return e !== null && Object.hasOwn(es, e) ? es[e] ?? {} : {};
}
function rs(e, t) {
	let n = ns(e);
	return Object.hasOwn(n, t) ? n[t] ?? t : t;
}
function is(e) {
	return ns(e).footer ?? "";
}
//#endregion
//#region src/lib/prefs.svelte.ts
var as = /* @__PURE__ */ t({
	Preferences: () => ls,
	footerCopy: () => ds,
	hype: () => $,
	preferences: () => us,
	readPreference: () => os,
	savePreference: () => ss,
	savedOption: () => cs
});
function os(e) {
	try {
		return localStorage.getItem(`claude-usage.${e}`);
	} catch {
		return null;
	}
}
function ss(e, t) {
	try {
		localStorage.setItem(`claude-usage.${e}`, String(t));
	} catch {}
}
function cs(e, t) {
	let n = os(e);
	return n !== null && t.includes(n) ? n : null;
}
var ls = class {
	#e = /* @__PURE__ */ j(Jt(ts(os("theme"))));
	#t = /* @__PURE__ */ j(Jt(Do(os("page_size"), Co, 25)));
	#n = /* @__PURE__ */ j(os("chat-oldest-first") === "true");
	get theme() {
		return B(this.#e);
	}
	set theme(e) {
		let t = ts(e);
		M(this.#e, t, !0), ss("theme", t ?? "auto");
	}
	get pageSize() {
		return B(this.#t);
	}
	set pageSize(e) {
		Co.includes(e) && (M(this.#t, e, !0), ss("page_size", String(e)));
	}
	get oldestFirst() {
		return B(this.#n);
	}
	set oldestFirst(e) {
		M(this.#n, e, !0), ss("chat-oldest-first", String(e));
	}
}, us = new ls();
function $(e) {
	return rs(us.theme, e);
}
function ds() {
	return is(us.theme);
}
//#endregion
//#region src/components/ChartTooltip.svelte
var fs = /* @__PURE__ */ V([[
	"div",
	{ class: "tooltip" },
	,
]]);
function ps(e, t) {
	E(t, !0);
	let n = Ni(t, "top", 3, 8);
	function r(e) {
		let r = e.parentElement?.clientWidth ?? 0;
		e.style.left = `${Vi(t.anchor, e.offsetWidth, r)}px`, e.style.top = `${n()}px`;
	}
	var i = fs();
	Br(N(i), () => t.children), T(i), Qr(i, () => r), U(e, i), D();
}
//#endregion
//#region src/components/Chart.svelte
var ms = /* @__PURE__ */ V([["rect", {
	class: "hit",
	tabindex: "0",
	role: "slider",
	"aria-valuemin": "1"
}]], 4), hs = /* @__PURE__ */ V([[
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
function gs(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => (t.cursor?.count ?? 0) - 1), r = /* @__PURE__ */ j(null), i = /* @__PURE__ */ k(() => B(r) === null ? B(n) : Math.min(B(r), B(n))), a = /* @__PURE__ */ j(null), o = /* @__PURE__ */ k(() => B(a) === null || B(n) < 0 ? null : Math.min(B(a), B(n))), s = /* @__PURE__ */ k(() => t.cursor?.area(t.width));
	function c(e) {
		M(r, Math.min(Math.max(0, e), B(n)), !0), M(a, B(r), !0);
	}
	function l(e) {
		let n = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
		t.cursor && n && c(t.cursor.indexAt(t.width)(zi(e.clientX, n.left, n.width, t.width)));
	}
	function u(e) {
		if (!t.cursor) return;
		let n = Bi(e.key, B(i), t.cursor.count);
		n !== null && (c(n), e.preventDefault());
	}
	var d = hs(), f = P(d), p = N(f), m = N(p);
	Br(m, () => t.plot, () => t.width);
	var h = I(m), g = (e) => {
		var n = H();
		Br(P(n), () => t.marks ?? v, () => t.width, () => B(o)), U(e, n);
	};
	G(h, (e) => {
		B(o) !== null && e(g);
	}), T(p);
	var _ = I(p), y = (e) => {
		var n = ms();
		L((e, r) => {
			q(n, "x", B(s).x), q(n, "y", B(s).y), q(n, "width", e), q(n, "height", B(s).height), q(n, "aria-label", t.cursor.label), q(n, "aria-valuemax", t.cursor.count), q(n, "aria-valuenow", B(i) + 1), q(n, "aria-valuetext", r);
		}, [() => Math.max(1, B(s).width), () => t.cursor.valueText(B(i))]), yr("pointermove", n, l), vr("focus", n, () => c(B(i))), yr("keydown", n, u), vr("pointerleave", n, () => M(a, null)), vr("blur", n, () => M(a, null)), U(e, n);
	};
	G(_, (e) => {
		t.cursor && B(s) && B(n) >= 0 && e(y);
	}), T(f);
	var ee = I(f), b = (e) => {
		{
			let n = /* @__PURE__ */ k(() => t.cursor.tipX(t.width, B(o)) * Ri(t.containerWidth, t.width));
			ps(e, {
				get anchor() {
					return B(n);
				},
				get top() {
					return t.tipTop;
				},
				children: (e, n) => {
					var r = H();
					Br(P(r), () => t.tip, () => B(o)), U(e, r);
				},
				$$slots: { default: !0 }
			});
		}
	};
	G(ee, (e) => {
		t.cursor && B(o) !== null && t.tip && e(b);
	}), L(() => {
		q(f, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), q(f, "height", t.height), q(p, "aria-label", t.label);
	}), U(e, d), D();
}
br(["pointermove", "keydown"]);
//#endregion
//#region src/components/ChartCard.svelte
var _s = /* @__PURE__ */ V([[
	"span",
	{ class: "muted" },
	" "
]]), vs = /* @__PURE__ */ V([[
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
function ys(e, t) {
	let n = /* @__PURE__ */ j(!1);
	var r = vs(), i = N(r), a = N(i), o = F(a, !0), s = I(a, 2), c = (e) => {
		var n = _s(), r = F(n, !0);
		L(() => W(r, t.note)), U(e, n);
	};
	G(s, (e) => {
		t.note && e(c);
	});
	var l = I(s, 2);
	Br(l, () => t.controls ?? v);
	var u = I(l, 4);
	T(i);
	var d = I(i, 2);
	Br(d, () => t.legend ?? v);
	var f = I(d, 2);
	Br(f, () => t.chart);
	var p = I(f, 2), m = (e) => {
		var n = H();
		Br(P(n), () => t.table), U(e, n);
	};
	G(p, (e) => {
		B(n) && e(m);
	}), Br(I(p, 2), () => t.extra ?? v), T(r), L(() => {
		q(r, "aria-labelledby", `${t.id ?? ""}-title`), q(a, "id", `${t.id ?? ""}-title`), W(o, t.title), q(u, "id", `${t.id ?? ""}-table-toggle`), q(u, "aria-pressed", B(n));
	}), yr("click", u, () => M(n, !B(n))), U(e, r);
}
br(["click"]);
//#endregion
//#region src/components/Swatch.svelte
var bs = /* @__PURE__ */ V([["span", { class: "swatch" }]]);
function xs(e, t) {
	var n = bs();
	let r;
	L(() => r = li(n, "", r, { background: t.fill })), U(e, n);
}
//#endregion
//#region src/lib/scroll.ts
var Ss = /* @__PURE__ */ t({
	keepScroll: () => ws,
	scrollAnchor: () => Cs
});
function Cs(e) {
	for (let t of e) {
		let e = t.getBoundingClientRect();
		if (e.bottom > 0) return {
			node: t,
			top: e.top
		};
	}
	return null;
}
function ws(e, t) {
	e && t && t.isConnected && window.scrollBy(0, t.getBoundingClientRect().top - e.top);
}
//#endregion
//#region src/components/Pager.svelte
var Ts = /* @__PURE__ */ V([[
	"option",
	null,
	" "
]]), Es = /* @__PURE__ */ V([[
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
function Ds(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => (t.units.at(-1) ?? -1) + 1), r = /* @__PURE__ */ k(() => js(t.key, B(n))), i = /* @__PURE__ */ k(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function a() {
		As.first(t.key) !== B(r).first && As.set(t.key, B(r).first);
	}
	a();
	function o(e, r) {
		let i = e.closest(".pager"), a = Cs(i ? [i] : []);
		As.set(t.key, To(B(n), us.pageSize, r).first), At(), ws(a, i);
	}
	function s(e, t) {
		let n = e.closest(".pager"), r = Cs(n ? [n] : []);
		us.pageSize = t, At(), ws(r, n);
	}
	function c() {
		let { first: e, last: n } = B(r);
		t.rows?.forEach((r, i) => {
			let a = t.units[i];
			a !== void 0 && r.classList.toggle("off-page", a < e || a >= n);
		});
	}
	var l = Es(), u = N(l);
	K(u, 20, () => Co, (e) => e, (e, n) => {
		var r = Ts(), i = F(r), a = {};
		L(() => {
			W(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), U(e, r);
	}), T(u);
	var d;
	pi(u);
	var f = I(u, 2), p = I(f, 2), m = F(p, !0), h = I(p, 2);
	T(l), Qr(l, () => c), L((e) => {
		q(u, "id", `pager-${t.key ?? ""}-size`), q(u, "aria-label", `${B(i) ?? ""} per page`), d !== (d = us.pageSize) && (u.value = (u.__value = d) ?? "", fi(u, d)), q(f, "id", `pager-${t.key ?? ""}-previous`), f.disabled = B(r).page === 0, W(m, e), q(h, "id", `pager-${t.key ?? ""}-next`), h.disabled = B(r).page === B(r).pages - 1;
	}, [() => Eo(B(r), B(n), t.noun)]), yr("change", u, (e) => s(e.currentTarget, Number(e.currentTarget.value))), yr("click", f, (e) => o(e.currentTarget, B(r).page - 1)), yr("click", h, (e) => o(e.currentTarget, B(r).page + 1)), U(e, l), D();
}
br(["change", "click"]);
//#endregion
//#region src/lib/paging.svelte.ts
var Os = /* @__PURE__ */ t({
	TablePages: () => ks,
	mountPager: () => Ns,
	releaseDetachedPagers: () => Ps,
	shownWindow: () => js,
	tablePages: () => As
}), ks = class {
	#e = new vo();
	first(e) {
		return this.#e.get(e) ?? 0;
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	forget(e) {
		this.#e.delete(e);
	}
}, As = new ks();
function js(e, t) {
	return To(t, us.pageSize, Math.floor(As.first(e) / us.pageSize));
}
var Ms = /* @__PURE__ */ new Set();
function Ns(e) {
	let t = document.createElement("div"), n = Pr(Ds, {
		target: t,
		props: e
	});
	At();
	let r = t.firstElementChild;
	if (!(r instanceof HTMLElement)) throw Error("The pager drew no element");
	return Ms.add({
		component: n,
		root: r
	}), r;
}
function Ps() {
	for (let e of [...Ms]) e.root.isConnected || (Ms.delete(e), Rr(e.component));
}
//#endregion
//#region src/components/TableView.svelte
var Fs = /* @__PURE__ */ V([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), Is = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	" "
]]), Ls = /* @__PURE__ */ V([[
	"th",
	{ scope: "col" },
	" "
]]), Rs = /* @__PURE__ */ V([[
	"tr",
	null,
	,
]]), zs = /* @__PURE__ */ V([[
	"table",
	null,
	[
		"thead",
		null,
		["tr"]
	],
	["tbody"]
]]), Bs = /* @__PURE__ */ V([
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
function Vs(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = H(), o = P(n), s = (e) => {
			Ds(e, {
				get key() {
					return t.key;
				},
				get noun() {
					return r();
				},
				get units() {
					return B(i);
				}
			});
		};
		G(o, (e) => {
			B(a) > Co[0] && e(s);
		}), U(e, n);
	}, r = Ni(t, "noun", 3, "rows"), i = /* @__PURE__ */ k(() => wo(t.rows.map((e) => t.sub?.(e) ?? !1))), a = /* @__PURE__ */ k(() => (B(i).at(-1) ?? -1) + 1), o = /* @__PURE__ */ k(() => js(t.key, B(a))), s = /* @__PURE__ */ k(() => t.rows.filter((e, t) => {
		let n = B(i)[t] ?? 0;
		return n >= B(o).first && n < B(o).last;
	}));
	var c = Bs(), l = P(c), u = (e) => {
		var r = H(), i = P(r), o = (e) => {
			var r = Fs(), i = N(r);
			Br(i, () => t.heading);
			var a = I(i, 2);
			n(a), T(r), U(e, r);
		}, s = (e) => {
			var n = H();
			Br(P(n), () => t.heading), U(e, n);
		};
		G(i, (e) => {
			B(a) > Co[0] ? e(o) : e(s, -1);
		}), U(e, r);
	};
	G(l, (e) => {
		t.heading && e(u);
	});
	var d = I(l, 2);
	Br(d, () => t.intro ?? v);
	var f = I(d, 2), p = N(f), m = (e) => {
		n(e);
	};
	G(p, (e) => {
		t.heading || e(m);
	});
	var h = I(p, 2), g = (e) => {
		var n = Is(), r = F(n, !0);
		L(() => W(r, t.empty)), U(e, n);
	}, _ = (e) => {
		var n = zs(), r = N(n), i = N(r);
		K(i, 21, () => t.columns, (e) => e.label, (e, t) => {
			var n = Ls(), r = F(n, !0);
			L(() => {
				si(n, 1, ti(B(t).numeric ? "num" : void 0)), q(n, "title", B(t).title), W(r, B(t).label);
			}), U(e, n);
		}), T(i), T(r);
		var a = I(r);
		K(a, 21, () => B(s), (e) => t.rowKey(e), (e, n) => {
			var r = Rs();
			Br(N(r), () => t.cells, () => B(n)), T(r), L((e) => si(r, 1, e), [() => ti([t.sub?.(B(n)) ? "sub-row" : t.group?.(B(n)) ? "group-row" : void 0, t.rowClass?.(B(n))])]), U(e, r);
		}), T(a), T(n), L(() => q(n, "aria-labelledby", t.labelledby)), U(e, n);
	};
	G(h, (e) => {
		t.rows.length === 0 && t.empty !== void 0 ? e(g) : e(_, -1);
	}), T(f), U(e, c), D();
}
//#endregion
//#region src/components/XLabels.svelte
var Hs = /* @__PURE__ */ V([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4);
function Us(e, t) {
	E(t, !0);
	var n = H();
	K(P(n), 16, () => Hi(t.count, t.most), (e) => e, (e, n) => {
		var r = Hs(), i = F(r, !0);
		L((e, n) => {
			q(r, "x", e), q(r, "y", t.y), W(i, n);
		}, [() => t.xOf(n), () => t.text(n)]), U(e, r);
	}), U(e, n), D();
}
//#endregion
//#region src/components/YAxis.svelte
var Ws = /* @__PURE__ */ V([["line", { "stroke-width": "1" }], [
	"text",
	{
		"text-anchor": "end",
		class: "axis-text"
	},
	" "
]], 5);
function Gs(e, t) {
	E(t, !0);
	var n = H();
	K(P(n), 18, () => t.values, (e) => e, (e, n, r) => {
		let i = /* @__PURE__ */ k(() => Ui(t.yOf(n)));
		var a = Ws(), o = P(a), s = I(o), c = F(s, !0);
		L((e) => {
			q(o, "x1", t.left), q(o, "x2", t.right), q(o, "y1", B(i)), q(o, "y2", B(i)), q(o, "stroke", B(r) === 0 ? "var(--axis)" : "var(--grid)"), q(s, "x", t.left - 8), q(s, "y", B(i) + 4), W(c, e);
		}, [() => t.format(n)]), U(e, a);
	}), U(e, n), D();
}
//#endregion
//#region src/components/ByModel.svelte
var Ks = /* @__PURE__ */ V([[
	"button",
	{ type: "button" },
	" "
]]), qs = /* @__PURE__ */ V([["div", {
	class: "segmented",
	role: "group",
	"aria-label": "Metric"
}]]), Js = /* @__PURE__ */ V([[
	"span",
	null,
	,
	" "
]]), Ys = /* @__PURE__ */ V([[
	"span",
	{ class: "legend-group" },
	[
		"strong",
		null,
		" "
	],
	" ",
	,
]]), Xs = /* @__PURE__ */ V([[
	"div",
	{ class: "legend" },
	,
]]), Zs = /* @__PURE__ */ V([[
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
]], 4), Qs = /* @__PURE__ */ V([["defs"]], 4), $s = /* @__PURE__ */ V([["path"]], 4), ec = /* @__PURE__ */ V([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), tc = /* @__PURE__ */ V([
	,
	,
	,
], 5), nc = /* @__PURE__ */ V([
	,
	,
	,
	,
	,
], 5), rc = /* @__PURE__ */ V([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), ic = /* @__PURE__ */ V([[
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
]]), ac = /* @__PURE__ */ V([
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
], 1), oc = /* @__PURE__ */ V([[
	"div",
	{ class: "name" },
	"No usage"
]]), sc = /* @__PURE__ */ V([[
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
]]), cc = /* @__PURE__ */ V([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	,
], 1), lc = /* @__PURE__ */ V([[
	"div",
	{ class: "chart" },
	,
]]), uc = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), dc = /* @__PURE__ */ V([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function fc(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = qs();
		K(t, 20, () => no, (e) => e, (e, t) => {
			var n = Ks(), r = F(n, !0);
			L(() => {
				q(n, "aria-pressed", B(s) === t), W(r, to[t].label);
			}), yr("click", n, () => _(t)), U(e, n);
		}), T(t), U(e, t);
	}, r = (e) => {
		var t = Xs(), n = N(t), r = (e) => {
			var t = H();
			K(P(t), 17, () => ho(B(c).series), (e) => e.model, (e, t) => {
				var n = Ys(), r = N(n), i = F(r, !0);
				K(I(r, 2), 17, () => B(t).entries, ({ entry: e, text: t }) => e.key, (e, t) => {
					let n = () => B(t).entry, r = () => B(t).text;
					var i = Js(), a = N(i);
					{
						let e = /* @__PURE__ */ k(() => sa(n().color, n().hatch, n().turn));
						xs(a, { get fill() {
							return B(e);
						} });
					}
					var o = I(a, 1, !0);
					T(i), L(() => W(o, r())), U(e, i);
				}), T(n), L(() => W(i, B(t).model)), U(e, n);
			}), U(e, t);
		};
		G(n, (e) => {
			B(c) && e(r);
		}), T(t), U(e, t);
	}, i = (e) => {
		var t = lc(), n = N(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => oo(t(), B(a).length)), r = /* @__PURE__ */ k(() => Ia(B(c).totals));
				var s = nc(), l = P(s), d = (e) => {
					var t = Qs();
					K(t, 21, () => B(u).patterns, ({ id: e, entry: t }) => e, (e, t) => {
						let n = () => B(t).id, r = () => B(t).entry;
						var i = Zs(), a = N(i), o = I(a);
						T(i), L(() => {
							q(i, "id", n()), q(i, "patternTransform", `rotate(${r().turn ?? ""})`), q(a, "fill", r().color), q(o, "fill", r().hatch);
						}), U(e, i);
					}), T(t), U(e, t);
				};
				G(l, (e) => {
					B(u).patterns.length && e(d);
				});
				var p = I(l);
				{
					let e = /* @__PURE__ */ k(() => ka(B(f), 4));
					Gs(p, {
						get left() {
							return 56;
						},
						get right() {
							return B(n).right;
						},
						get values() {
							return B(e);
						},
						yOf: (e) => 220 - 220 * e / B(f),
						get format() {
							return B(o);
						}
					});
				}
				var m = I(p);
				{
					let e = /* @__PURE__ */ k(() => 238);
					Us(m, {
						get count() {
							return B(a).length;
						},
						xOf: (e) => 56 + B(n).band * (e + .5),
						get y() {
							return B(e);
						},
						text: (e) => B(i).short(B(a)[e] ?? "")
					});
				}
				K(I(m), 18, () => B(a), (e) => e, (e, i, s) => {
					let l = /* @__PURE__ */ k(() => co(t(), B(a).length, B(s)));
					var d = tc(), p = P(d);
					K(p, 17, () => lo(B(c).series, i, B(f)), ({ entry: e, segment: t }) => e.key, (e, t) => {
						let r = () => B(t).entry, i = () => B(t).segment;
						var a = $s();
						L((e, t) => {
							q(a, "d", e), q(a, "fill", t);
						}, [() => Fa(B(l), i().y, B(n).barWidth, i().height, i().top), () => B(u).fill(r())]), U(e, a);
					});
					var m = I(p), h = (e) => {
						let t = /* @__PURE__ */ k(() => B(c).totals[B(s)] ?? 0);
						var r = ec(), i = F(r, !0);
						L((e) => {
							q(r, "x", B(l) + B(n).barWidth / 2), q(r, "y", 220 - 220 * B(t) / B(f) - 6), W(i, e);
						}, [() => B(o)(B(t))]), U(e, r);
					};
					G(m, (e) => {
						B(s) === B(r) && (B(c).totals[B(s)] ?? 0) > 0 && e(h);
					}), U(e, d);
				}), U(e, s);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ k(() => oo(t(), B(a).length).band);
				var i = rc();
				L(() => {
					q(i, "x", 56 + B(r) * n()), q(i, "width", B(r)), q(i, "height", 220);
				}), U(e, i);
			}, r = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => B(a)[t()] ?? ""), r = /* @__PURE__ */ k(() => go(B(c).series, B(n)));
				var s = cc(), l = P(s), u = F(l, !0), d = I(l, 2);
				K(d, 17, () => B(r), (e) => e.model, (e, t) => {
					var n = ac(), r = P(n), i = N(r), a = F(i, !0), s = F(I(i), !0);
					T(r), K(I(r, 2), 17, () => B(t).efforts, ({ entry: e, text: t, value: n }) => e.key, (e, t) => {
						let n = () => B(t).entry, r = () => B(t).text, i = () => B(t).value;
						var a = ic(), s = N(a), c = N(s);
						{
							let e = /* @__PURE__ */ k(() => sa(n().color, n().hatch, n().turn));
							xs(c, { get fill() {
								return B(e);
							} });
						}
						var l = I(c, 1, !0);
						T(s);
						var u = F(I(s, 2), !0);
						T(a), L((e) => {
							W(l, r()), W(u, e);
						}, [() => B(o)(i())]), U(e, a);
					}), L((e) => {
						W(a, B(t).model), W(s, e);
					}, [() => B(o)(B(t).value)]), U(e, n);
				}, (e) => {
					U(e, oc());
				});
				var f = I(d, 2), p = (e) => {
					var n = sc(), r = F(I(N(n)), !0);
					T(n), L((e) => W(r, e), [() => B(o)(B(c).totals[t()] ?? 0)]), U(e, n);
				};
				G(f, (e) => {
					B(r).length > 1 && e(p);
				}), L((e) => W(u, e), [() => B(i).long(B(n))]), U(e, s);
			}, i = /* @__PURE__ */ k(() => B(c).buckets), a = /* @__PURE__ */ k(() => B(i).keys), o = /* @__PURE__ */ k(() => B(c).metric.format);
			{
				let i = /* @__PURE__ */ k(() => fo(B(c).metric, B(l)));
				gs(e, {
					get height() {
						return io;
					},
					get label() {
						return B(i);
					},
					get width() {
						return B(h);
					},
					get containerWidth() {
						return B(m);
					},
					get cursor() {
						return B(g);
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
		G(n, (e) => {
			B(c) && B(u) && e(r);
		}), T(t), Ai(t, "clientWidth", (e) => M(m, e)), U(e, t);
	}, a = (e) => {
		var t = H(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				var r = dc(), i = P(r), a = F(i, !0);
				K(I(i, 2), 18, () => B(n).others, (e) => e, (e, n, r) => {
					var i = uc(), a = F(i, !0);
					L(() => W(a, t().cells[B(r) + 1])), U(e, i);
				}), L(() => W(a, t().cells[0])), U(e, r);
			}, n = /* @__PURE__ */ k(() => {
				let [e = "", ...t] = B(p).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let r = /* @__PURE__ */ k(() => [{ label: B(n).first }, ...B(n).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				Vs(e, {
					key: "chart-table",
					get columns() {
						return B(r);
					},
					get rows() {
						return B(p).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return t;
					}
				});
			}
		};
		G(n, (e) => {
			B(p) && e(r);
		}), U(e, t);
	}, o = /* @__PURE__ */ k(() => Q.summary), s = /* @__PURE__ */ j(Jt(ro(os("metric")))), c = /* @__PURE__ */ k(() => B(o) ? ao(B(o), B(s)) : null), l = /* @__PURE__ */ k(() => B(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ k(() => B(c) ? uo(B(c).series) : null), d = /* @__PURE__ */ k(() => B(o) ? B(l) === "hour" ? $("Per hour, by model and effort") : $("Per day, by model and effort") : $("Per day, by model")), f = /* @__PURE__ */ k(() => Oa(Math.max(...B(c)?.totals ?? [], 0))), p = /* @__PURE__ */ k(() => B(c) ? _o(B(c)) : null), m = /* @__PURE__ */ j(0), h = /* @__PURE__ */ k(() => Li(B(m))), g = /* @__PURE__ */ k(() => B(c) ? {
		count: B(c).buckets.keys.length,
		label: po(B(c).metric, B(l)),
		valueText: (e) => mo(B(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: oo(e, B(c).buckets.keys.length).right - 56,
			height: 220
		}),
		indexAt: (e) => so(e, B(c).buckets.keys.length),
		tipX: (e, t) => 56 + oo(e, B(c).buckets.keys.length).band * (t + .5)
	} : null);
	function _(e) {
		M(s, e, !0), ss("metric", e);
	}
	ys(e, {
		id: "chart",
		get title() {
			return B(d);
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
br(["click"]);
//#endregion
//#region src/lib/costly.ts
var pc = [{
	label: "Cache reads",
	color: "var(--split-soft)",
	value: (e) => Qa(e).cacheRead
}, {
	label: "Everything else",
	color: "var(--split-strong)",
	note: "new input, cache writes, output and web searches",
	value: (e) => Qa(e).rest
}];
function mc(e) {
	return e.note ? `${e.label} (${e.note})` : e.label;
}
function hc(e) {
	return e.title || "Untitled session";
}
function gc(e) {
	return `#session/${encodeURIComponent(e.session_id)}`;
}
function _c(e) {
	let t = $a(e);
	return e.map((e) => {
		let n = hc(e), r = pc.map((t) => ({
			part: t,
			amount: t.value(e)
		})), i = r.map(({ part: e, amount: t }) => `${e.label} ${X(t)}`).join(", ");
		return {
			session: e,
			title: n,
			href: gc(e),
			detail: `${e.project} · ${Y(e.turns)} turns · avg context ${J(e.context_avg)}`,
			share: eo(e.cost, t),
			cost: X(e.cost),
			parts: r,
			label: `${n}: ${X(e.cost)}; ${i}`
		};
	});
}
function vc(e) {
	let { session: t } = e;
	return {
		title: e.title,
		parts: e.parts.map(({ part: e, amount: n }) => ({
			label: e.label,
			color: e.color,
			amount: X(n),
			share: ga(n, t.cost || 0)
		})),
		total: e.cost,
		context: `${Y(t.turns)} turns · context avg ${J(t.context_avg)}, peak ${J(t.context_peak)}`
	};
}
function yc(e) {
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
			...pc.map((e) => ({
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
				Y(e.turns),
				J(e.context_avg),
				J(e.context_peak),
				...pc.map((t) => X(t.value(e))),
				X(e.cost)
			]
		}))
	};
}
//#endregion
//#region src/components/CostPerSession.svelte
var bc = /* @__PURE__ */ V([[
	"span",
	null,
	,
	" "
]]), xc = /* @__PURE__ */ V([[
	"div",
	{ class: "legend" },
	,
]]), Sc = /* @__PURE__ */ V([["span"]]), Cc = /* @__PURE__ */ V([[
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
]]), wc = /* @__PURE__ */ V([[
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
]]), Tc = /* @__PURE__ */ V([
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
], 1), Ec = /* @__PURE__ */ V([
	["div", { class: "bars" }],
	" ",
	,
], 1), Dc = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	"No sessions in this range."
]]), Oc = /* @__PURE__ */ V([[
	"div",
	{ class: "chart" },
	,
]]), kc = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), Ac = /* @__PURE__ */ V([
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
function jc(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = xc(), n = N(t), r = (e) => {
			var t = H();
			K(P(t), 17, () => pc, (e) => e.label, (e, t) => {
				var n = bc(), r = N(n);
				xs(r, { get fill() {
					return B(t).color;
				} });
				var i = I(r, 1, !0);
				T(n), L((e) => W(i, e), [() => mc(B(t))]), U(e, n);
			}), U(e, t);
		};
		G(n, (e) => {
			B(a) && e(r);
		}), T(t), U(e, t);
	}, r = (e) => {
		var t = Oc(), n = N(t), r = (e) => {
			var t = H(), n = P(t), r = (e) => {
				var t = Ec(), n = P(t);
				K(n, 21, () => B(s), (e) => e.session.session_id, (e, t) => {
					var n = Cc(), r = N(n), i = N(r), a = F(i, !0), o = F(I(i), !0);
					T(r);
					var s = I(r, 2), c = N(s);
					let l;
					K(c, 21, () => B(t).parts, ({ part: e, amount: t }) => e.label, (e, t) => {
						let n = () => B(t).part, r = () => B(t).amount;
						var i = H(), a = P(i), o = (e) => {
							var t = Sc();
							let i;
							L(() => i = li(t, "", i, {
								"flex-grow": r(),
								background: n().color
							})), U(e, t);
						};
						G(a, (e) => {
							r() > 0 && e(o);
						}), U(e, i);
					}), T(c), T(s);
					var u = F(I(s, 2), !0);
					T(n), L((e) => {
						q(n, "href", B(t).href), q(n, "aria-label", B(t).label), W(a, B(t).title), W(o, B(t).detail), l = li(c, "", l, { width: e }), W(u, B(t).cost);
					}, [() => `${B(t).share.toFixed(2) ?? ""}%`]), yr("pointermove", n, (e) => p(e, B(t).session.session_id)), vr("focus", n, (e) => p(e, B(t).session.session_id)), vr("pointerleave", n, m), vr("blur", n, m), U(e, n);
				}), T(n);
				var r = I(n, 2), i = (e) => {
					ps(e, {
						get anchor() {
							return B(u).anchor;
						},
						get top() {
							return B(u).top;
						},
						children: (e, t) => {
							var n = Tc(), r = P(n), i = F(r, !0), a = I(r, 2);
							K(a, 17, () => B(f).parts, (e) => e.label, (e, t) => {
								var n = wc(), r = N(n);
								xs(r, { get fill() {
									return B(t).color;
								} });
								var i = I(r), a = F(i, !0), o = F(I(i));
								T(n), L(() => {
									W(a, B(t).amount), W(o, `${B(t).label ?? ""} · ${B(t).share ?? ""}`);
								}), U(e, n);
							});
							var o = I(a, 2), s = N(o);
							xs(s, { fill: null });
							var c = F(I(s), !0);
							je(), T(o);
							var l = F(I(o, 2), !0);
							L(() => {
								W(i, B(f).title), W(c, B(f).total), W(l, B(f).context);
							}), U(e, n);
						},
						$$slots: { default: !0 }
					});
				};
				G(r, (e) => {
					B(u) && B(f) && e(i);
				}), U(e, t);
			}, i = (e) => {
				U(e, Dc());
			};
			G(n, (e) => {
				B(s).length ? e(r) : e(i, -1);
			}), U(e, t);
		};
		G(n, (e) => {
			B(a) && e(r);
		}), T(t), U(e, t);
	}, i = (e) => {
		var t = H(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				var r = Ac(), i = P(r), a = N(i), o = F(a, !0), s = F(I(a), !0);
				T(i), K(I(i, 2), 19, () => B(n), (e) => e.label, (e, n, r) => {
					var i = kc(), a = F(i, !0);
					L(() => W(a, t().cells[B(r)])), U(e, i);
				}), L((e, n) => {
					q(a, "href", e), W(o, n), W(s, t().session.project);
				}, [() => gc(t().session), () => hc(t().session)]), U(e, r);
			}, n = /* @__PURE__ */ k(() => B(c).head.slice(1));
			Vs(e, {
				key: "costly-table",
				get columns() {
					return B(c).head;
				},
				get rows() {
					return B(c).rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return t;
				}
			});
		};
		G(n, (e) => {
			B(a) && e(r);
		}), U(e, t);
	}, a = /* @__PURE__ */ k(() => Q.summary), o = /* @__PURE__ */ k(() => B(a)?.costly_sessions ?? []), s = /* @__PURE__ */ k(() => _c(B(o))), c = /* @__PURE__ */ k(() => yc(B(o))), l = /* @__PURE__ */ k(() => $("Cost per session")), u = /* @__PURE__ */ j(null), d = /* @__PURE__ */ k(() => B(u) ? B(s).find((e) => e.session.session_id === B(u)?.id) : void 0), f = /* @__PURE__ */ k(() => B(d) ? vc(B(d)) : null);
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
	ys(e, {
		id: "costly",
		get title() {
			return B(l);
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
br(["pointermove"]);
//#endregion
//#region src/lib/compact.ts
var Mc = /* @__PURE__ */ t({
	PAYOFF_WORDS: () => Nc,
	compactCallKind: () => Rc,
	compactionTotal: () => Vc,
	delegateCallShown: () => zc,
	payoffAhead: () => Ic,
	payoffText: () => Lc,
	payoffTone: () => Fc,
	spread: () => Pc,
	verdictTone: () => Bc
}), Nc = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function Pc(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function Fc(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function Ic(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${Y(t.pays_later_in)} replies`;
		return `${Nc.later}: growing at its recent pace, the context reaches about ${J(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = Y(Math.round(t.calls_ahead));
	return `${Nc[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function Lc(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${X(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${Y(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : Y(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${Y(e.breakeven_low)} replies)` : `would pay off after about ${Y(e.breakeven_calls)} replies` + Pc(r(e.breakeven_low), r(e.breakeven_high));
}
function Rc(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function zc(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function Bc(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function Vc(e) {
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
var Hc = /* @__PURE__ */ t({
	liveCompactBadge: () => Jc,
	liveEmpty: () => Gc,
	livePastDay: () => Uc,
	liveSecretBadge: () => qc,
	liveStateBadges: () => Yc,
	liveWaitBadge: () => Kc,
	liveWindow: () => Wc,
	sessionWaits: () => Xc,
	waitChanged: () => Zc
});
function Uc(e, t) {
	return e.days === 1 && e.until && e.until !== t ? e.until : null;
}
function Wc(e, t) {
	let n = Uc(e, t), r = e.agent_minutes > e.minutes ? ` (${e.agent_minutes} min while agents work)` : "", i = e.sessions.some((e) => e.waiting) ? " or waiting for you" : "", a = n ? `, active on ${xa(n)}` : "";
	return `· changed in the last ${e.minutes} min${r}${i}${a}`;
}
function Gc(e, t) {
	let n = Uc(e, t);
	return n ? `No live session was active on ${xa(n)}.` : `No session active in the last ${e.minutes} minutes.`;
}
function Kc(e) {
	if (!e) return null;
	let t = ` since ${Z(e.since)}`;
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
function qc(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${Y(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${Y(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function Jc(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${J(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = Fc(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if (Rc({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${X(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${Y(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${Nc[l]}: compacting now ${m}, ~${Y(Math.round(f))} ahead on average.`);
}
function Yc(e, t) {
	return [qc(e.secrets), Jc(e.current, t)].filter((e) => e !== null);
}
function Xc(e, t) {
	let n = Kc(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : Kc(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function Zc(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/components/LiveIcon.svelte
var Qc = /* @__PURE__ */ V([
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
], 5), $c = /* @__PURE__ */ V([
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
], 5), el = /* @__PURE__ */ V([
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
], 5), tl = /* @__PURE__ */ V([
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
], 5), nl = /* @__PURE__ */ V([[
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
function rl(e, t) {
	E(t, !0);
	var n = nl(), r = N(n), i = N(r), a = (e) => {
		var t = Qc();
		je(3), U(e, t);
	}, o = (e) => {
		var t = $c();
		je(2), U(e, t);
	}, s = (e) => {
		var t = el();
		je(5), U(e, t);
	}, c = (e) => {
		var t = tl();
		je(3), U(e, t);
	};
	G(i, (e) => {
		t.badge.kind === "permission" ? e(a) : t.badge.kind === "waiting" ? e(o, 1) : t.badge.kind === "secret" ? e(s, 2) : e(c, -1);
	}), T(r), T(n), L(() => {
		si(n, 1, ti([
			"live-icon",
			`live-icon-${t.badge.kind}`,
			t.badge.tone && `live-icon-${t.badge.tone}`
		])), q(n, "aria-label", t.badge.text), q(n, "title", t.badge.text);
	}), U(e, n), D();
}
//#endregion
//#region src/components/LiveCard.svelte
var il = /* @__PURE__ */ V([[
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
]]), al = /* @__PURE__ */ V([[
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
]]), ol = /* @__PURE__ */ V([["ul"]]), sl = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	"No subagent running"
]]), cl = /* @__PURE__ */ V([[
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
function ll(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Kc(t.session.waiting)), r = /* @__PURE__ */ k(() => t.sessionState ? Yc(t.sessionState, new Date(t.now).toISOString()) : []), i = /* @__PURE__ */ k(() => [
		{
			label: "Turns",
			value: Y(t.session.turns)
		},
		{
			label: "Output",
			value: J(t.session.output)
		},
		{
			label: "Last context",
			value: J(t.session.last_context)
		},
		{
			label: "Cost",
			value: X(t.session.cost)
		}
	]);
	var a = cl(), o = N(a), s = N(o), c = I(N(s)), l = F(c, !0);
	T(s);
	var u = I(s, 2), d = (e) => {
		rl(e, { get badge() {
			return B(n);
		} });
	};
	G(u, (e) => {
		B(n) && e(d);
	});
	var f = I(u, 2);
	K(f, 21, () => B(r), (e) => e.kind, (e, t) => {
		rl(e, { get badge() {
			return B(t);
		} });
	}), T(f), T(o);
	var p = I(o, 2), m = F(p), h = I(p, 2);
	K(h, 21, () => B(i), (e) => e.label, (e, t) => {
		var n = il(), r = N(n), i = F(r, !0), a = F(I(r), !0);
		T(n), L(() => {
			W(i, B(t).label), W(a, B(t).value);
		}), U(e, n);
	}), T(h);
	var g = I(h, 2), _ = (e) => {
		var n = ol();
		K(n, 21, () => t.session.subagents, (e) => e.agent_id, (e, n) => {
			var r = al(), i = N(r), a = F(i, !0), o = I(i, 2), s = F(o, !0), c = F(I(o));
			T(r), L((e, t, r) => {
				W(a, B(n).agent_type), W(s, B(n).description || ""), W(c, `${(B(n).model || "–") ?? ""} · ${e ?? ""} turns · context ${t ?? ""} · ${r ?? ""}`);
			}, [
				() => Y(B(n).turns),
				() => J(B(n).last_context),
				() => Ta(B(n).last_activity, t.now)
			]), U(e, r);
		}), T(n), U(e, n);
	}, v = (e) => {
		U(e, sl());
	};
	G(g, (e) => {
		t.session.subagents.length ? e(_) : e(v, -1);
	}), T(a), L((e, n, r) => {
		q(c, "href", e), W(l, n), W(m, `${t.session.project ?? ""}${t.session.git_branch ? ` · ${t.session.git_branch}` : ""} · ${r ?? ""}`);
	}, [
		() => gc(t.session),
		() => hc(t.session),
		() => Ta(t.session.last_activity, t.now)
	]), U(e, a), D();
}
//#endregion
//#region src/components/LiveSessions.svelte
var ul = /* @__PURE__ */ V([[
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
]]), dl = /* @__PURE__ */ V([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), fl = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	" "
]]), pl = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), ml = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), hl = /* @__PURE__ */ V([["div", { class: "live-grid" }]]), gl = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	" "
]]), _l = /* @__PURE__ */ V([
	,
	,
	" ",
	,
	" ",
	,
], 1), vl = /* @__PURE__ */ V([[
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
function yl(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = ul(), n = N(t), r = F(n, !0), a = F(I(n, 2), !0);
		T(t), L((e, t) => {
			W(r, e), W(a, t);
		}, [() => $("Live sessions"), () => B(i) ? Wc(B(i), B(o)) : ""]), U(e, t);
	}, r = "live", i = /* @__PURE__ */ k(() => Q.live), a = /* @__PURE__ */ k(() => Q.liveAt ?? Date.now()), o = /* @__PURE__ */ k(() => ya(new Date(B(a)))), s = /* @__PURE__ */ k(() => B(i)?.sessions ?? []), c = /* @__PURE__ */ k(() => wo(B(s).map(() => !1))), l = /* @__PURE__ */ k(() => B(s).length), u = /* @__PURE__ */ k(() => js(r, B(l))), d = /* @__PURE__ */ k(() => B(s).slice(B(u).first, B(u).last)), f = /* @__PURE__ */ k(() => B(l) > Co[0]);
	var p = vl(), m = N(p), h = (e) => {
		var t = dl(), i = N(t);
		n(i), Ds(I(i, 2), {
			key: r,
			noun: "sessions",
			get units() {
				return B(c);
			}
		}), T(t), U(e, t);
	}, g = (e) => {
		n(e);
	};
	G(m, (e) => {
		B(f) ? e(h) : e(g, -1);
	});
	var _ = I(m, 2), v = N(_), y = (e) => {
		var t = fl(), n = F(t, !0);
		L(() => W(n, Q.liveFailed ? "Could not load the live sessions." : "Loading…")), U(e, t);
	}, ee = (e) => {
		var t = _l(), n = P(t), r = (e) => {
			var t = pl(), n = F(t);
			L(() => W(n, `Permission prompts can't show here: ${B(i).prompts_unavailable ?? ""}.`)), U(e, t);
		};
		G(n, (e) => {
			B(i).prompts_unavailable && e(r);
		});
		var s = I(n, 2), c = (e) => {
			var t = ml(), n = F(t);
			L(() => W(n, `Desktop notifications can't show: ${B(i).notifications_unavailable ?? ""}.`)), U(e, t);
		};
		G(s, (e) => {
			B(i).notifications_unavailable && e(c);
		});
		var l = I(s, 2), u = (e) => {
			var t = hl();
			K(t, 21, () => B(d), (e) => e.session_id, (e, t) => {
				{
					let n = /* @__PURE__ */ k(() => Q.liveState(B(t).session_id));
					ll(e, {
						get session() {
							return B(t);
						},
						get sessionState() {
							return B(n);
						},
						get now() {
							return B(a);
						}
					});
				}
			}), T(t), U(e, t);
		}, f = (e) => {
			var t = gl(), n = F(t, !0);
			L((e) => W(n, e), [() => Gc(B(i), B(o))]), U(e, t);
		};
		G(l, (e) => {
			B(d).length ? e(u) : e(f, -1);
		}), U(e, t);
	};
	G(v, (e) => {
		B(i) ? e(ee, -1) : e(y);
	}), T(_), T(p), U(e, p), D();
}
//#endregion
//#region src/lib/trend.ts
var bl = [
	{
		label: "Estimated cost",
		slot: 0,
		value: (e) => e.cost,
		format: X
	},
	{
		label: "Input tokens",
		slot: 1,
		value: (e) => e.input,
		format: J
	},
	{
		label: "Output tokens",
		slot: 2,
		value: (e) => e.output,
		format: J
	}
];
function xl(e) {
	let t = e * 116 + 22;
	return {
		top: t,
		bottom: t + 76
	};
}
function Sl() {
	return xl(bl.length - 1).bottom + 28;
}
function Cl(e, t = /* @__PURE__ */ new Date()) {
	let n = Ra(e, t), r = Ba(n.unit === "hour" ? e.hour_model : e.day_model, n.keyOf);
	return {
		buckets: n,
		totals: n.keys.map((e) => r.get(e) ?? za)
	};
}
function wl(e, t) {
	return e.totals.map((e) => t.value(e));
}
function Tl(e) {
	return `estimated cost, input and output tokens per ${e}`;
}
function El(e) {
	return `Estimated cost, input tokens and output tokens per ${e}; table view available`;
}
function Dl(e) {
	return `Estimated cost, input and output tokens per ${e}; arrow keys step through them`;
}
function Ol(e, t) {
	let n = e.totals[t] ?? za, r = bl.map((e) => `${e.label} ${e.format(e.value(n))}`).join(", ");
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${r}`;
}
function kl(e) {
	let t = e.buckets.keys.map((t, n) => ({
		key: t,
		cells: [e.buckets.short(t), ...bl.map((t) => t.format(t.value(e.totals[n] ?? za)))]
	})).reverse();
	return {
		head: [e.buckets.heading, ...bl.map((e) => e.label)],
		rows: t
	};
}
//#endregion
//#region src/components/AreaLine.svelte
var Al = /* @__PURE__ */ V([["path", { "fill-opacity": "0.1" }], ["path", {
	fill: "none",
	"stroke-width": "2",
	"stroke-linejoin": "round",
	"stroke-linecap": "round"
}]], 5);
function jl(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => t.values.map((e, n) => `${t.xOf(n).toFixed(1)},${t.yOf(e).toFixed(1)}`).join("L")), r = /* @__PURE__ */ k(() => `M${t.xOf(0)},${t.bottom}L${B(n)}L${t.xOf(t.values.length - 1)},${t.bottom}Z`);
	var i = H(), a = P(i), o = (e) => {
		var i = Al(), a = P(i), o = I(a);
		L(() => {
			q(a, "d", B(r)), q(a, "fill", t.color), q(o, "d", `M${B(n) ?? ""}`), q(o, "stroke", t.color);
		}), U(e, i);
	};
	G(a, (e) => {
		t.values.length && e(o);
	}), U(e, i), D();
}
//#endregion
//#region src/components/PointDot.svelte
var Ml = /* @__PURE__ */ V([["circle", {
	r: "4",
	stroke: "var(--surface)",
	"stroke-width": "2"
}]], 4);
function Nl(e, t) {
	var n = Ml();
	L(() => {
		q(n, "cx", t.x), q(n, "cy", t.y), q(n, "fill", t.color);
	}), U(e, n);
}
//#endregion
//#region src/components/OverTime.svelte
var Pl = (e, t = v) => {
	var n = Ul(), r = P(n), i = F(r, !0);
	K(I(r, 2), 19, () => bl, (e) => e.label, (e, n, r) => {
		var i = Hl(), a = F(i, !0);
		L(() => W(a, t().cells[B(r) + 1])), U(e, i);
	}), L(() => W(i, t().cells[0])), U(e, n);
}, Fl = /* @__PURE__ */ V([
	,
	,
	[
		"text",
		{ class: "value-text" },
		" "
	]
], 5), Il = /* @__PURE__ */ V([
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
], 5), Ll = /* @__PURE__ */ V([
	,
	,
	,
], 5), Rl = /* @__PURE__ */ V([["line", { class: "crosshair" }], ,], 5), zl = /* @__PURE__ */ V([[
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
]]), Bl = /* @__PURE__ */ V([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
], 1), Vl = /* @__PURE__ */ V([[
	"div",
	{ class: "chart" },
	,
]]), Hl = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), Ul = /* @__PURE__ */ V([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function Wl(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Vl(), n = N(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => t() - 64), r = /* @__PURE__ */ k(() => ja(B(s).length, 56, B(n)));
				var a = Ll(), o = P(a);
				K(o, 17, () => B(d), ({ panel: e, top: t, bottom: n, color: r, values: i, max: a, yOf: o }) => e.label, (e, t) => {
					let i = () => B(t).panel, a = () => B(t).top, o = () => B(t).bottom, s = () => B(t).color, c = () => B(t).values, l = () => B(t).max, u = () => B(t).yOf;
					var d = Il(), f = P(d), p = I(f), m = F(p, !0), h = I(p);
					{
						let e = /* @__PURE__ */ k(() => ka(l(), 2));
						Gs(h, {
							get left() {
								return 56;
							},
							get right() {
								return B(n);
							},
							get values() {
								return B(e);
							},
							get yOf() {
								return u();
							},
							get format() {
								return i().format;
							}
						});
					}
					var g = I(h);
					jl(g, {
						get values() {
							return c();
						},
						get xOf() {
							return B(r);
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
					var _ = I(g), v = (e) => {
						let t = /* @__PURE__ */ k(() => c().length - 1), n = /* @__PURE__ */ k(() => c()[B(t)] ?? 0);
						var a = Fl(), o = P(a);
						{
							let e = /* @__PURE__ */ k(() => B(r)(B(t))), i = /* @__PURE__ */ k(() => u()(B(n)));
							Nl(o, {
								get x() {
									return B(e);
								},
								get y() {
									return B(i);
								},
								get color() {
									return s();
								}
							});
						}
						var l = I(o), d = F(l, !0);
						L((e, t, n) => {
							q(l, "x", e), q(l, "y", t), W(d, n);
						}, [
							() => B(r)(B(t)) + 9,
							() => u()(B(n)) + 4,
							() => i().format(B(n))
						]), U(e, a);
					};
					G(_, (e) => {
						c().length && e(v);
					}), L(() => {
						q(f, "x1", 56), q(f, "x2", 70), q(f, "y1", a() - 10), q(f, "y2", a() - 10), q(f, "stroke", s()), q(p, "x", 76), q(p, "y", a() - 6), W(m, i().label);
					}), U(e, d);
				});
				var c = I(o);
				{
					let e = /* @__PURE__ */ k(() => u + 18);
					Us(c, {
						get count() {
							return B(s).length;
						},
						get xOf() {
							return B(r);
						},
						get y() {
							return B(e);
						},
						text: (e) => B(i).short(B(s)[e] ?? "")
					});
				}
				U(e, a);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ k(() => ja(B(s).length, 56, t() - 64));
				var i = Rl(), a = P(i);
				K(I(a), 17, () => B(d), ({ panel: e, color: t, values: n, yOf: r }) => e.label, (e, t) => {
					let i = () => B(t).color, a = () => B(t).values, o = () => B(t).yOf;
					{
						let t = /* @__PURE__ */ k(() => B(r)(n())), s = /* @__PURE__ */ k(() => o()(a()[n()] ?? 0));
						Nl(e, {
							get x() {
								return B(t);
							},
							get y() {
								return B(s);
							},
							get color() {
								return i();
							}
						});
					}
				}), L((e, t) => {
					q(a, "x1", e), q(a, "x2", t), q(a, "y1", 18), q(a, "y2", u);
				}, [() => B(r)(n()), () => B(r)(n())]), U(e, i);
			}, r = (e, t = v) => {
				var n = Bl(), r = P(n), a = F(r, !0);
				K(I(r, 2), 17, () => B(d), ({ panel: e, color: t, values: n }) => e.label, (e, n) => {
					let r = () => B(n).panel, i = () => B(n).color, a = () => B(n).values;
					var o = zl(), s = N(o);
					let c;
					var l = I(s, 2), u = F(l, !0), d = F(I(l, 2), !0);
					T(o), L((e) => {
						c = li(s, "", c, { background: i() }), W(u, e), W(d, r().label);
					}, [() => r().format(a()[t()] ?? 0)]), U(e, o);
				}), L((e) => W(a, e), [() => B(i).long(B(s)[t()] ?? "")]), U(e, n);
			}, i = /* @__PURE__ */ k(() => B(a).buckets), s = /* @__PURE__ */ k(() => B(i).keys);
			{
				let i = /* @__PURE__ */ k(Sl), a = /* @__PURE__ */ k(() => El(B(o)));
				gs(e, {
					get height() {
						return B(i);
					},
					get label() {
						return B(a);
					},
					get width() {
						return B(l);
					},
					get containerWidth() {
						return B(c);
					},
					get cursor() {
						return B(f);
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
		G(n, (e) => {
			B(a) && e(r);
		}), T(t), Ai(t, "clientWidth", (e) => M(c, e)), U(e, t);
	}, r = (e) => {
		var t = H(), n = P(t), r = (e) => {
			let t = /* @__PURE__ */ k(() => {
				let [e = "", ...t] = B(s).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let n = /* @__PURE__ */ k(() => [{ label: B(t).first }, ...B(t).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				Vs(e, {
					key: "trend-table",
					get columns() {
						return B(n);
					},
					get rows() {
						return B(s).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return Pl;
					}
				});
			}
		};
		G(n, (e) => {
			B(s) && e(r);
		}), U(e, t);
	}, i = /* @__PURE__ */ k(() => Q.summary), a = /* @__PURE__ */ k(() => B(i) ? Cl(B(i)) : null), o = /* @__PURE__ */ k(() => B(a)?.buckets.unit ?? "day"), s = /* @__PURE__ */ k(() => B(a) ? kl(B(a)) : null), c = /* @__PURE__ */ j(0), l = /* @__PURE__ */ k(() => Li(B(c))), u = xl(bl.length - 1).bottom, d = /* @__PURE__ */ k(() => B(a) ? bl.map((e, t) => {
		let { top: n, bottom: r } = xl(t), i = wl(B(a), e), o = Oa(Math.max(...i, 0));
		return {
			panel: e,
			top: n,
			bottom: r,
			color: na(e.slot),
			values: i,
			max: o,
			yOf: (e) => r - 76 * e / o
		};
	}) : []), f = /* @__PURE__ */ k(() => B(a) ? {
		count: B(a).buckets.keys.length,
		label: Dl(B(o)),
		valueText: (e) => Ol(B(a), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: u
		}),
		indexAt: (e) => Ma(56, e - 64, B(a).buckets.keys.length),
		tipX: (e, t) => ja(B(a).buckets.keys.length, 56, e - 64)(t)
	} : null);
	{
		let t = /* @__PURE__ */ k(() => $("Over time")), i = /* @__PURE__ */ k(() => Tl(B(o)));
		ys(e, {
			id: "trend",
			get title() {
				return B(t);
			},
			get note() {
				return B(i);
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
//#endregion
//#region src/lib/range.ts
var Gl = /* @__PURE__ */ t({
	RANGES: () => Kl,
	dayLabel: () => Zl,
	dayStep: () => Ql,
	rangeDays: () => ql,
	rangeQuery: () => Yl,
	shownDay: () => Xl,
	visibleRanges: () => Jl
}), Kl = [
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
function ql(e) {
	return Kl.some((t) => t.days === e) ? e : null;
}
function Jl(e) {
	return e ? Kl.filter((t) => t.days <= e) : Kl;
}
function Yl(e, t) {
	return `days=${e}` + (e === 1 && t !== null ? `&until=${t}` : "");
}
function Xl(e, t, n) {
	let r = t ?? n;
	return e && e.days === 1 && e.until === r ? e : null;
}
function Zl(e) {
	return e === null ? "Today" : xa(e);
}
function Ql(e, t, n) {
	let r = e?.[t];
	if (r) return r === n ? null : r;
}
//#endregion
//#region src/lib/range.svelte.ts
var $l = /* @__PURE__ */ t({
	RangeState: () => tu,
	range: () => nu
});
function eu() {
	return ql(Number(os("days"))) ?? 30;
}
var tu = class {
	#e = /* @__PURE__ */ j(Jt(eu()));
	#t = /* @__PURE__ */ j(null);
	onchange = null;
	get days() {
		return B(this.#e);
	}
	get day() {
		return B(this.#t);
	}
	select(e) {
		ql(e) !== null && (M(this.#e, e, !0), M(this.#t, null), ss("days", e), this.onchange?.());
	}
	step(e, t) {
		let n = ya(/* @__PURE__ */ new Date()), r = Ql(Xl(t, B(this.#t), n), e, n);
		r !== void 0 && (M(this.#t, r, !0), this.onchange?.());
	}
	fit(e) {
		e.days >= B(this.#e) || (M(this.#e, e.days, !0), ss("days", e.days));
	}
	reset() {
		M(this.#e, eu(), !0), M(this.#t, null), this.onchange = null;
	}
}, nu = new tu(), ru = /* @__PURE__ */ V([[
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
]]), iu = /* @__PURE__ */ V([
	[
		"button",
		{ type: "button" },
		" "
	],
	" ",
	,
], 1), au = /* @__PURE__ */ V([
	[
		"span",
		{ class: "label" },
		"Range"
	],
	" ",
	["div", { class: "segmented" }]
], 1);
function ou(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Jl(Q.summary?.retention_days)), r = /* @__PURE__ */ k(() => Xl(Q.summary, nu.day, ya(/* @__PURE__ */ new Date())));
	var i = au(), a = I(P(i), 2);
	K(a, 21, () => B(n), (e) => e.days, (e, t) => {
		var n = iu(), i = P(n), a = F(i, !0), o = I(i, 2), s = (e) => {
			var t = ru(), n = N(t), i = I(n, 2), a = F(i, !0), o = I(i, 2);
			T(t), L((e) => {
				n.disabled = !B(r)?.previous_day, W(a, e), o.disabled = !B(r)?.next_day;
			}, [() => Zl(nu.day)]), yr("click", n, () => nu.step("previous_day", Q.summary)), yr("click", o, () => nu.step("next_day", Q.summary)), U(e, t);
		};
		G(o, (e) => {
			B(t).days === 1 && nu.days === 1 && e(s);
		}), L(() => {
			q(i, "aria-pressed", nu.days === B(t).days), W(a, B(t).label);
		}), yr("click", i, () => nu.select(B(t).days)), U(e, n);
	}), T(a), U(e, i), D();
}
br(["click"]);
var su = 148, cu = "var(--status-critical)";
function lu(e, t = /* @__PURE__ */ new Date()) {
	let n = Ra(e, t), r = Ya(n.unit === "hour" ? e.api_errors.hour : e.api_errors.day, n.keyOf), i = n.keys.map((e) => r(e).limits), a = n.keys.map((e) => r(e).other), o = i.reduce((e, t) => e + t, 0), s = Ia(i);
	return {
		buckets: n,
		limits: i,
		others: a,
		total: o,
		top: Aa(Math.max(...i, 0)),
		peak: i[s] ? s : null,
		empty: !i.some(Boolean) && !a.some(Boolean)
	};
}
function uu(e, t, n, r, i) {
	let { band: a, barWidth: o } = oo(e, t), s = 120 * r / i;
	return {
		x: 56 + a * n + (a - o) / 2,
		y: 120 - s,
		width: o,
		height: s
	};
}
function du(e) {
	return `rate-limit hits per ${e}; other API errors are in the tooltip, the table view and the list`;
}
function fu(e, t) {
	return `Rate-limit hits per ${e}: ${Y(t)} in the range; table view available`;
}
function pu(e) {
	return `Rate-limit hits per ${e}; arrow keys step through them`;
}
function mu(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${Y(e.limits[t])} rate-limit hits, ${Y(e.others[t])} other API errors`;
}
function hu(e, t) {
	return {
		when: e.buckets.long(e.buckets.keys[t] ?? ""),
		limits: Y(e.limits[t]),
		others: Y(e.others[t])
	};
}
function gu(e) {
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
				Y(e.limits[r]),
				Y(e.others[r])
			]
		})).reverse()
	};
}
var _u = [
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
function vu(e, t) {
	return e.flatMap((e) => {
		let n = `${e.limit_type} ${e.resets_at}`;
		return [{
			key: n,
			kind: "window",
			name: Za(e, t),
			cells: [
				_a(Xa(e)),
				Y(e.hits),
				...Xo(e.used)
			],
			sub: !1,
			group: e.models.length > 0
		}, ...e.models.slice().sort(Jo).map((e) => ({
			key: `${n} ${e.model}`,
			kind: "model",
			name: e.model,
			cells: [
				"",
				"",
				...Xo(e)
			],
			sub: !0,
			group: !1
		}))];
	});
}
function yu(e) {
	return e.map((e) => ({
		key: e.record_id,
		when: Z(e.ts),
		error: Ja(e),
		quota: qa(e.limit_type),
		resets: Z(e.resets_at),
		session: {
			href: gc(e),
			name: hc(e),
			project: e.project
		},
		agent: e.agent_type
	}));
}
function bu(e) {
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
var xu = /* @__PURE__ */ V([[
	"h3",
	null,
	" "
]]), Su = /* @__PURE__ */ V([[
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
]]), Cu = /* @__PURE__ */ V([
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
function wu(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = xu(), r = F(n, !0);
		L(() => {
			q(n, "id", `${t.id ?? ""}-title`), W(r, t.title);
		}), U(e, n);
	}, r = (e, t = v) => {
		var n = Cu(), r = P(n), a = F(r, !0), o = I(r, 2), s = F(o, !0), c = I(o, 2), l = F(c, !0), u = I(c, 2), d = F(u, !0), f = I(u, 2), p = (e) => {
			var n = Su(), r = N(n), i = F(r, !0), a = F(I(r), !0);
			T(n), L(() => {
				q(r, "href", t().session.href), W(i, t().session.name), W(a, t().session.project);
			}), U(e, n);
		};
		G(f, (e) => {
			i() && e(p);
		});
		var m = F(I(f, 2), !0);
		L(() => {
			W(a, t().when), W(s, t().error), W(l, t().quota), W(d, t().resets), W(m, t().agent);
		}), U(e, n);
	}, i = Ni(t, "withSession", 3, !0);
	{
		let a = /* @__PURE__ */ k(() => bu(i()));
		Vs(e, {
			get key() {
				return t.pagerKey;
			},
			get columns() {
				return B(a);
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
	D();
}
//#endregion
//#region src/components/RateLimits.svelte
var Tu = (e) => {
	var t = Bu(), n = F(t, !0);
	L((e) => W(n, e), [() => $("5-hour windows that hit the limit")]), U(e, t);
}, Eu = (e) => {
	U(e, Vu());
}, Du = /* @__PURE__ */ V([[
	"span",
	null,
	,
	" "
]]), Ou = /* @__PURE__ */ V([[
	"div",
	{ class: "legend" },
	,
]]), ku = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	"No rate limits or API errors in this range."
]]), Au = /* @__PURE__ */ V([["path"]], 4), ju = /* @__PURE__ */ V([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), Mu = /* @__PURE__ */ V([
	,
	,
	,
], 5), Nu = /* @__PURE__ */ V([
	,
	,
	,
	,
], 5), Pu = /* @__PURE__ */ V([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), Fu = /* @__PURE__ */ V([
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
], 1), Iu = /* @__PURE__ */ V([[
	"div",
	{ class: "chart" },
	,
]]), Lu = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), Ru = /* @__PURE__ */ V([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1), zu = /* @__PURE__ */ V([
	,
	,
	" ",
	,
], 1), Bu = /* @__PURE__ */ V([[
	"h3",
	null,
	" "
]]), Vu = /* @__PURE__ */ V([[
	"p",
	{ class: "note" },
	"what each window used from its start (its reset less 5 hours) up to its first hit, as the transcripts here show it;\n    the limit also counts what you use elsewhere"
]]), Hu = /* @__PURE__ */ V([[
	"span",
	{ class: "window-model" },
	" "
]]), Uu = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), Wu = /* @__PURE__ */ V([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1);
function Gu(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Ou(), n = N(t), r = (e) => {
			var t = Du(), n = N(t);
			xs(n, { get fill() {
				return cu;
			} });
			var r = I(n);
			T(t), L(() => W(r, "⚠ Rate-limit hit")), U(e, t);
		};
		G(n, (e) => {
			B(c) && e(r);
		}), T(t), U(e, t);
	}, r = (e) => {
		var t = Iu(), n = N(t), r = (e) => {
			var t = H(), n = P(t), r = (e) => {
				U(e, ku());
			}, i = (e) => {
				let t = (e, t = v) => {
					let n = /* @__PURE__ */ k(() => oo(t(), B(a).length));
					var r = Nu(), o = P(r);
					{
						let e = /* @__PURE__ */ k(() => ka(B(c).top, 2));
						Gs(o, {
							get left() {
								return 56;
							},
							get right() {
								return B(n).right;
							},
							get values() {
								return B(e);
							},
							yOf: (e) => 120 - 120 * e / B(c).top,
							get format() {
								return Y;
							}
						});
					}
					var s = I(o);
					{
						let e = /* @__PURE__ */ k(() => 138);
						Us(s, {
							get count() {
								return B(a).length;
							},
							xOf: (e) => 56 + B(n).band * (e + .5),
							get y() {
								return B(e);
							},
							text: (e) => B(i).short(B(a)[e] ?? "")
						});
					}
					K(I(s), 18, () => B(a), (e) => e, (e, n, r) => {
						let i = /* @__PURE__ */ k(() => B(c).limits[B(r)] ?? 0), o = /* @__PURE__ */ k(() => uu(t(), B(a).length, B(r), B(i), B(c).top));
						var s = Mu(), l = P(s), u = (e) => {
							var t = Au();
							L((e) => {
								q(t, "d", e), q(t, "fill", cu);
							}, [() => Fa(B(o).x, B(o).y, B(o).width, B(o).height, !0)]), U(e, t);
						};
						G(l, (e) => {
							B(o).height > 0 && e(u);
						});
						var d = I(l), f = (e) => {
							var t = ju(), n = F(t, !0);
							L((e) => {
								q(t, "x", B(o).x + B(o).width / 2), q(t, "y", B(o).y - 6), W(n, e);
							}, [() => Y(B(i))]), U(e, t);
						};
						G(d, (e) => {
							B(r) === B(c).peak && e(f);
						}), U(e, s);
					}), U(e, r);
				}, n = (e, t = v, n = v) => {
					let r = /* @__PURE__ */ k(() => oo(t(), B(a).length).band);
					var i = Pu();
					L(() => {
						q(i, "x", 56 + B(r) * n()), q(i, "width", B(r)), q(i, "height", 120);
					}), U(e, i);
				}, r = (e, t = v) => {
					let n = /* @__PURE__ */ k(() => hu(B(c), t()));
					var r = Fu(), i = P(r), a = F(i, !0), o = I(i, 2), s = N(o);
					xs(s, { get fill() {
						return cu;
					} });
					var l = I(s), u = F(l, !0), d = F(I(l));
					T(o);
					var f = I(o, 2), p = N(f);
					xs(p, { fill: null });
					var m = F(I(p), !0);
					je(), T(f), L(() => {
						W(a, B(n).when), W(u, B(n).limits), W(d, "⚠ rate-limit hits"), W(m, B(n).others);
					}), U(e, r);
				}, i = /* @__PURE__ */ k(() => B(c).buckets), a = /* @__PURE__ */ k(() => B(i).keys);
				{
					let i = /* @__PURE__ */ k(() => fu(B(l), B(c).total));
					gs(e, {
						get height() {
							return su;
						},
						get label() {
							return B(i);
						},
						get width() {
							return B(g);
						},
						get containerWidth() {
							return B(h);
						},
						get cursor() {
							return B(_);
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
			G(n, (e) => {
				B(c).empty ? e(r) : e(i, -1);
			}), U(e, t);
		};
		G(n, (e) => {
			B(c) && e(r);
		}), T(t), Ai(t, "clientWidth", (e) => M(h, e)), U(e, t);
	}, i = (e) => {
		var t = H(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				var r = Ru(), i = P(r), a = F(i, !0);
				K(I(i, 2), 19, () => B(n), (e) => e.label, (e, n, r) => {
					var i = Lu(), a = F(i, !0);
					L(() => W(a, t().cells[B(r) + 1])), U(e, i);
				}), L(() => W(a, t().cells[0])), U(e, r);
			}, n = /* @__PURE__ */ k(() => B(d).head.slice(1));
			Vs(e, {
				key: "limits-table",
				get columns() {
					return B(d).head;
				},
				get rows() {
					return B(d).rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return t;
				}
			});
		};
		G(n, (e) => {
			B(d) && e(r);
		}), U(e, t);
	}, a = (e) => {
		var t = H(), n = P(t), r = (e) => {
			var t = zu(), n = P(t);
			Vs(n, {
				key: "limit-windows",
				get columns() {
					return _u;
				},
				get rows() {
					return B(f);
				},
				rowKey: (e) => e.key,
				get cells() {
					return o;
				},
				sub: (e) => e.sub,
				group: (e) => e.group,
				get heading() {
					return Tu;
				},
				get intro() {
					return Eu;
				},
				empty: "No 5-hour window hit its limit in this range."
			});
			var r = I(n, 2);
			{
				let e = /* @__PURE__ */ k(() => $("Latest API errors"));
				wu(r, {
					id: "limit-events",
					get title() {
						return B(e);
					},
					get rows() {
						return B(p);
					},
					empty: "No API errors in this range.",
					pagerKey: "limit-events"
				});
			}
			U(e, t);
		};
		G(n, (e) => {
			B(s) && e(r);
		}), U(e, t);
	}, o = (e, t = v) => {
		var n = Wu(), r = P(n), i = N(r), a = (e) => {
			var n = Hu(), r = F(n, !0);
			L(() => W(r, t().name)), U(e, n);
		}, o = (e) => {
			var n = Dr();
			L(() => W(n, t().name)), U(e, n);
		};
		G(i, (e) => {
			t().kind === "model" ? e(a) : e(o, -1);
		}), T(r), K(I(r, 2), 19, () => m, (e) => e.label, (e, n, r) => {
			var i = Uu(), a = F(i, !0);
			L(() => W(a, t().cells[B(r)])), U(e, i);
		}), U(e, n);
	}, s = /* @__PURE__ */ k(() => Q.summary), c = /* @__PURE__ */ k(() => B(s) ? lu(B(s)) : null), l = /* @__PURE__ */ k(() => B(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ k(() => $("Rate limits")), d = /* @__PURE__ */ k(() => B(c) ? gu(B(c)) : null), f = /* @__PURE__ */ k(() => B(s) ? vu(B(s).api_errors.windows) : []), p = /* @__PURE__ */ k(() => B(s) ? yu(B(s).api_errors.events) : []), m = _u.slice(1), h = /* @__PURE__ */ j(0), g = /* @__PURE__ */ k(() => Li(B(h))), _ = /* @__PURE__ */ k(() => B(c) ? {
		count: B(c).buckets.keys.length,
		label: pu(B(l)),
		valueText: (e) => mu(B(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: oo(e, B(c).buckets.keys.length).right - 56,
			height: 120
		}),
		indexAt: (e) => so(e, B(c).buckets.keys.length),
		tipX: (e, t) => 56 + oo(e, B(c).buckets.keys.length).band * (t + .5)
	} : null);
	{
		let t = /* @__PURE__ */ k(() => B(c) ? du(B(l)) : void 0);
		ys(e, {
			id: "limits",
			get title() {
				return B(u);
			},
			get note() {
				return B(t);
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
var Ku = (e) => {
	var t = Ju(), n = F(N(t), !0);
	je(2), T(t), L((e) => W(n, e), [() => $("Sessions")]), U(e, t);
}, qu = (e, t = v) => {
	let n = /* @__PURE__ */ k(() => jo(t()));
	var r = Qu(), i = P(r), a = F(i, !0), o = I(i, 2), s = N(o), c = F(s, !0), l = F(I(s), !0);
	T(o), K(I(o, 2), 17, () => B(n).slice(1), Ur, (e, t) => {
		var n = Zu(), r = F(n, !0);
		L(() => W(r, B(t))), U(e, n);
	}), L((e, r) => {
		W(a, B(n)[0]), q(s, "href", e), W(c, r), W(l, t().project);
	}, [() => gc(t()), () => hc(t())]), U(e, r);
}, Ju = /* @__PURE__ */ V([[
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
]]), Yu = /* @__PURE__ */ V([[
	"option",
	null,
	" "
]]), Xu = /* @__PURE__ */ V([[
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
]]), Zu = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), Qu = /* @__PURE__ */ V([
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
], 1), $u = /* @__PURE__ */ V([
	,
	,
	" ",
	,
], 1), ed = /* @__PURE__ */ V([[
	"section",
	{
		class: "card",
		"aria-labelledby": "sessions-title"
	},
	,
]]);
function td(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Xu(), n = N(t), o = N(n);
		o.value = o.__value = "", K(I(o), 17, () => B(c), (e) => e.project, (e, t) => {
			var n = Yu(), r = F(n), i = {};
			L((e) => {
				W(r, `${B(t).project ?? ""} (${e ?? ""})`), i !== (i = B(t).project) && (n.value = (n.__value = i) ?? "");
			}, [() => Y(B(t).count)]), U(e, n);
		}), T(n), pi(n);
		var s = I(n, 2);
		xi(s);
		var u = F(I(s, 2), !0);
		T(t), L(() => W(u, B(l))), mi(n, () => B(i), (e) => {
			M(i, e, !0), As.forget(r);
		}), Ei(s, () => B(a), (e) => {
			M(a, e, !0), As.forget(r);
		}), U(e, t);
	}, r = "sessions", i = /* @__PURE__ */ j(""), a = /* @__PURE__ */ j(""), o = /* @__PURE__ */ k(() => Q.summary?.sessions ?? null), s = /* @__PURE__ */ k(() => B(o) ? B(o).filter((e) => Oo(e, B(i), B(a))) : []), c = /* @__PURE__ */ k(() => ko(B(o) ?? [], B(i))), l = /* @__PURE__ */ k(() => B(o) ? Mo(B(s).length, B(o).length) : "");
	var u = ed(), d = N(u), f = (e) => {
		{
			let t = /* @__PURE__ */ k(() => B(o).length ? "No sessions match the filter." : "No sessions in this range.");
			Vs(e, {
				key: r,
				get columns() {
					return Ao;
				},
				get rows() {
					return B(s);
				},
				rowKey: (e) => e.session_id,
				get cells() {
					return qu;
				},
				get heading() {
					return Ku;
				},
				get intro() {
					return n;
				},
				get empty() {
					return B(t);
				},
				labelledby: "sessions-title"
			});
		}
	}, p = (e) => {
		var t = $u(), r = P(t);
		Ku(r);
		var i = I(r, 2);
		n(i), U(e, t);
	};
	G(d, (e) => {
		B(o) ? e(f) : e(p, -1);
	}), T(u), U(e, u), D();
}
//#endregion
//#region src/lib/opening.ts
function nd() {
	let e = document.activeElement, t = e && e !== document.body ? e : null;
	return {
		href: t?.getAttribute("href") ?? null,
		element: t,
		scroll: window.scrollY
	};
}
function rd(e) {
	return e.element?.isConnected ? e.element : e.href === null ? null : [...document.querySelectorAll("a[href]")].find((t) => t.getAttribute("href") === e.href) ?? null;
}
function id(e) {
	return (t) => {
		let n = nd(), r = [];
		for (let t of e.hide) {
			let e = document.getElementById(t);
			e && (e.hidden = !0, r.push(e));
		}
		return t.scrollIntoView({ block: "start" }), t.querySelector(e.focus)?.focus({ preventScroll: !0 }), () => {
			for (let e of r) e.hidden = !1;
			window.scrollTo(0, n.scroll), rd(n)?.focus({ preventScroll: !0 });
		};
	};
}
//#endregion
//#region src/lib/session.ts
function ad(e) {
	let t = e.git_branch ? ` · ${e.git_branch}` : "";
	return `${e.project}${t} · ${Z(e.first_ts)} – ${Z(e.last_ts)} · ${e.session_id}`;
}
function od(e) {
	return e.some((e) => e.web_searches);
}
function sd(e) {
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
function cd(e) {
	return e.models.length ? e.models.map((t) => {
		let n = e.model_efforts.filter((e) => e.model === t).map((e) => e.effort);
		return n.length ? `${t} · ${n.join(", ")}` : t;
	}) : ["–"];
}
function ld(e, t) {
	return [
		Y(e.turns),
		`${J(e.context_first)} → ${J(e.context_last)}`,
		J(e.input_total),
		ga(e.cache_read, e.input_total),
		J(e.output),
		...t ? [Y(e.web_searches)] : [],
		J(e.returned_chars),
		X(e.cost)
	];
}
function ud(e, t, n) {
	let r = e.workflow_phase ? ` · ${e.workflow_phase}` : "";
	return {
		key: e.agent_id ?? "main",
		kind: n,
		name: e.agent_type,
		detail: `${e.description || ""}${r}`,
		models: cd(e),
		fold: null,
		cells: ld(e, t)
	};
}
function dd(e, t, n) {
	let r = (e) => t.reduce((t, n) => t + (n[e] || 0), 0), i = t.map((e) => e.cost).filter((e) => e !== null), a = t[0];
	return {
		key: `run:${e}`,
		kind: "run",
		name: `workflow · ${a.workflow_name || e}`,
		detail: "",
		models: [...new Set(t.flatMap((e) => e.models))],
		fold: {
			run: e,
			label: `${Y(t.length)} agents`
		},
		cells: [
			Y(r("turns")),
			"–",
			J(r("input_total")),
			ga(r("cache_read"), r("input_total")),
			J(r("output")),
			...n ? [Y(r("web_searches"))] : [],
			"–",
			i.length ? X(i.reduce((e, t) => e + t, 0)) : "–"
		]
	};
}
function fd(e, t) {
	let n = od(e), r = /* @__PURE__ */ new Map(), i = [];
	for (let t of e) t.workflow_run === null ? i.push(t) : r.has(t.workflow_run) ? r.get(t.workflow_run).push(t) : (r.set(t.workflow_run, [t]), i.push(t.workflow_run));
	return i.flatMap((e) => {
		if (typeof e != "string") return [ud(e, n, "agent")];
		let i = r.get(e);
		return [dd(e, i, n), ...t.includes(e) ? i.map((e) => ud(e, n, "member")) : []];
	});
}
//#endregion
//#region src/lib/tiles.ts
function pd(e, t = ya(/* @__PURE__ */ new Date()), n) {
	let r = e.history_since, i = r && r > e.since ? ` (history since ${ba(r, n)})` : "";
	return e.days === 1 ? e.until === t ? "today" : xa(e.until, n) : `last ${e.days} days${i}`;
}
function md(e) {
	let t = [e.unpriced_turns ? `${Y(e.unpriced_turns)} turns of models without a price are not included` : "at API list prices"];
	return e.web_searches && t.push(`incl. ${Y(e.web_searches)} web searches, ${X(e.cost_parts.web_search)}`), t.join(" · ");
}
var hd = "Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.";
function gd(e) {
	let t = e.compactions === 1 ? "1 compaction" : `${Y(e.compactions)} compactions`, n = e.unknown ? `${Y(e.unknown)} without an estimate` : null;
	if (!e.compactions) return {
		title: hd,
		verdict: null,
		amount: null,
		count: `Compacting: ${n}`
	};
	let r = e.net >= 0;
	return {
		title: hd,
		verdict: r ? "gain" : "loss",
		amount: r ? `▲ compacting saved ~${X(e.net)} so far` : `▼ compacting cost ~${X(-e.net)} more so far`,
		count: `(${[t, n].filter(Boolean).join(", ")})`
	};
}
function _d(e) {
	let t = e.cost_parts;
	return [{
		label: "Processed",
		tokens: e.new_input + e.cache_write,
		cost: t.new_input + t.cache_write,
		color: "var(--split-strong)",
		note: `New input ${J(e.new_input)} + cache writes ${J(e.cache_write)}, billed at full price or more`
	}, {
		label: "From cache",
		tokens: e.cache_read,
		cost: t.cache_read,
		color: "var(--split-soft)",
		note: "Cache reads, billed at a tenth of the input price and not processed again"
	}];
}
function vd(e, t) {
	let n = Da(t);
	return e.map((e) => `${e.label} ${ga(e.tokens, n)}`).join(", ");
}
function yd(e, t) {
	return e?.turns ? `median context ${J(e.median)} per turn (p90 ${J(e.p90)})` + (t ? ` · compact hint at ${J(t)}` : "") : null;
}
function bd(e, t, n, r) {
	let i = e.api_ms_without_retries === null ? null : e.api_ms - e.api_ms_without_retries, a = "no time lost to retries";
	return i === null ? a = "retries are not in the transcripts" : i > 0 && (a = `${_a(i)} of it retries`), {
		session: `wall-clock, ${t}`,
		api: a,
		tools: r ? "from each call to its result, incl. waiting for permission" : `${ga(e.tool_ms, e.duration_ms)} of the session time`,
		lines: n === null ? "no lines changed" : `${X(n)} per 100 lines changed`
	};
}
function xd(e) {
	return `${Y(e)} ${e === 1 ? "session" : "sessions"} that ended in the range`;
}
function Sd(e) {
	return e === "cost_record" ? "from its cost record" : "estimated from the transcripts";
}
function Cd(e) {
	let t = e.runtime.lines_added + e.runtime.lines_removed;
	return e.cost === null || t === 0 ? null : e.cost / t * 100;
}
//#endregion
//#region src/lib/usage.ts
function wd(e) {
	return [{ label: e }, ...Yo];
}
function Td(e, t) {
	return e.slice().sort(Jo).map((e) => ({
		key: t(e),
		name: t(e),
		kind: "plain",
		swatch: null,
		cells: Xo(e),
		sub: !1,
		group: !1
	}));
}
function Ed(e, t, n) {
	return e.slice().sort(Jo).flatMap((e) => [{
		key: e.model,
		name: e.model,
		kind: "model",
		swatch: na(n.get(e.model) ?? null),
		cells: Xo(e),
		sub: !1,
		group: !0
	}, ...t.filter((t) => t.model === e.model && t.effort !== null).sort((e, t) => Ji(e.effort ?? "") - Ji(t.effort ?? "") || (e.effort ?? "").localeCompare(t.effort ?? "")).map((t) => ({
		key: `${e.model}\u0000${t.effort}`,
		name: Xi(t.effort),
		kind: "effort",
		swatch: null,
		cells: Xo(t),
		sub: !0,
		group: !1
	}))]);
}
//#endregion
//#region src/components/AgentsTable.svelte
var Dd = (e) => {
	U(e, Od());
}, Od = /* @__PURE__ */ V([[
	"h3",
	{ id: "session-agents-title" },
	"Main thread and subagents"
]]), kd = /* @__PURE__ */ V([[
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
]]), Ad = /* @__PURE__ */ V([[
	"span",
	{ class: "sub" },
	" "
]]), jd = /* @__PURE__ */ V([[
	"div",
	null,
	" "
]]), Md = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), Nd = /* @__PURE__ */ V([
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
function Pd(e, t) {
	E(t, !0);
	let n = (e, t = v) => {
		var n = Nd(), i = P(n), a = N(i), s = F(a, !0), c = I(a, 2), l = (e) => {
			let n = /* @__PURE__ */ k(() => t().fold), i = /* @__PURE__ */ k(() => B(r).includes(B(n).run));
			var a = kd(), s = N(a), c = F(s, !0);
			T(a), L(() => {
				q(s, "aria-expanded", B(i)), W(c, B(n).label);
			}), yr("click", s, () => o(B(n).run)), U(e, a);
		}, u = (e) => {
			var n = Ad(), r = F(n, !0);
			L(() => W(r, t().detail)), U(e, n);
		};
		G(c, (e) => {
			t().fold ? e(l) : e(u, -1);
		}), T(i);
		var d = I(i, 2);
		K(d, 20, () => t().models, (e) => e, (e, t) => {
			var n = jd(), r = F(n, !0);
			L(() => W(r, t)), U(e, n);
		}), T(d), K(I(d, 2), 17, () => t().cells, Ur, (e, t) => {
			var n = Md(), r = F(n, !0);
			L(() => W(r, B(t))), U(e, n);
		}), L(() => W(s, t().name)), U(e, n);
	}, r = /* @__PURE__ */ j(Jt([])), i = /* @__PURE__ */ k(() => sd(od(t.agents))), a = /* @__PURE__ */ k(() => fd(t.agents, B(r)));
	function o(e) {
		M(r, B(r).includes(e) ? B(r).filter((t) => t !== e) : [...B(r), e], !0);
	}
	Vs(e, {
		get key() {
			return t.pagerKey;
		},
		get columns() {
			return B(i);
		},
		get rows() {
			return B(a);
		},
		rowKey: (e) => e.key,
		get cells() {
			return n;
		},
		sub: (e) => e.kind === "member",
		group: (e) => e.kind === "run",
		rowClass: (e) => e.kind === "member" ? "workflow-member" : void 0,
		get heading() {
			return Dd;
		},
		labelledby: "session-agents-title"
	}), D();
}
br(["click"]);
//#endregion
//#region src/lib/clock.svelte.ts
var Fd = 2 ** 31 - 1, Id = 1e3;
function Ld(e) {
	let t = (/* @__PURE__ */ new Date()).toISOString(), n = Ar((n) => {
		t = (/* @__PURE__ */ new Date()).toISOString();
		let r = e === null ? NaN : Date.parse(e) - Date.now();
		if (!(r > 0 && r <= Fd)) return;
		let i = setTimeout(() => {
			t = (/* @__PURE__ */ new Date()).toISOString(), n();
		}, r + Id);
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
function Rd(e) {
	return `Before it, the context was ${J(e.context)} of ${J(e.auto_compact)}. The next reply shows the new one: the summary, with the system prompt, tools and CLAUDE.md sent again.`;
}
function zd(e) {
	return `${(e * 100).toFixed(1)}%`;
}
function Bd(e) {
	let t = `Latest context, main thread · ${e.model}`;
	if (e.compacted) return {
		kind: "compacted",
		label: t,
		value: "Compacted",
		secondary: `at ${Z(e.compacted)}, no reply since`,
		note: Rd(e)
	};
	let n = e.hint_tokens < e.auto_compact ? e.hint_tokens / e.auto_compact : null, r = e.last_compaction ? `since the last compaction (${Z(e.last_compaction)})` : "since the session started", i = e.mean_step === null ? "too few turns for an estimate" : e.turns_left === null ? `${ha(e.mean_step)} per turn, not growing` : `about ${Y(e.turns_left)} turns left at ${ha(e.mean_step)} per turn (mean of the last 10)`;
	return {
		kind: "meter",
		label: t,
		value: J(e.context),
		secondary: `of ${J(e.auto_compact)} · ${ga(e.context, e.auto_compact)}`,
		meterLabel: `Latest context ${J(e.context)} of the auto-compact point ${J(e.auto_compact)}`,
		max: e.auto_compact,
		now: e.context,
		fill: zd(Math.min(1, e.context / e.auto_compact)),
		hintAt: n === null ? null : zd(n),
		note: [
			`${J(e.headroom)} until auto-compact`,
			n === null ? null : `the mark is the compact hint at ${J(e.hint_tokens)}, a heuristic`,
			`${Y(e.turns_since_compaction)} turns ${r}`,
			i
		].filter(Boolean).join(" · ")
	};
}
function Vd(e, t) {
	let n = e.cache_warm_until, r = n === null ? null : t ? `The cache has likely expired (${Z(n)}): the next reply sends it all at the full price, ${X(e.keep_across_break)} more.` : `The cache stays warm until ${Z(n)} (${e.cache_ttl_minutes} min after the last request); after that, the next reply costs ${X(e.keep_across_break)} more.`, i = [`Every reply sends the whole conversation again: ${J(e.before)}, ${X(e.reread_cost)} each time from the cache.`, r].filter(Boolean).join(" "), a = e.estimate;
	if (!a) {
		let t = e.stored_compactions;
		return {
			exact: i,
			missing: `No estimate of compacting now: ${t ? `your ${Y(t)} stored ${t === 1 ? "compaction carries" : "compactions carry"} no duration or output speed to estimate the summary from` : "no stored compaction to learn from yet"}.`,
			estimate: null
		};
	}
	return {
		exact: i,
		missing: null,
		estimate: Hd(e, a, t)
	};
}
function Hd(e, t, n) {
	let r = e.cache_warm_until, i = `${Y(t.compactions)} stored ${t.compactions === 1 ? "compaction" : "compactions"}`, a = Y(t.calls_after_low), o = Y(t.calls_after_high), s = t.calls_after_low === null ? "" : `, which were followed by ${a === o ? a : `${a}–${o}`} replies until the next one`, c = Fc(t, n), l = [Ic(c, t, n), `Learnt from your ${i}${s}.`];
	return t.before_break !== null && !n && r !== null && l.push(`Compacting before a break past ${Z(r)} saves about ${X(t.before_break)} at once.`), {
		lead: `If you compacted now, it would shrink to about ${J(t.after)}${Pc(J(t.after_low), J(t.after_high))}. ` + (n ? "Compacting " : `That costs ~${X(t.one_time)} once and `),
		tone: c,
		phrase: Lc(t, n),
		rest: `. ${l.filter(Boolean).join(" ")}`
	};
}
function Ud(e, t) {
	let n = e.estimate, r = [t ? `The cache has expired, so the next reply sends your whole conversation (${J(e.before)}) again at the full price.` : `Every reply sends your whole conversation again: ${J(e.before)}, ~${X(e.reread_cost)} each time from the cache.`];
	return n && r.push(`Compacting would shrink it to about ${J(n.after)}` + (t ? ` and ${Lc(n, !0)}.` : `. That costs ~${X(n.one_time)} once and ${Lc(n, !1)}.`)), r;
}
function Wd(e, t, n) {
	let r = e.compact_now;
	if (!r) return null;
	let i = r.estimate, a = r.cache_warm_until;
	if (t === "cold") return i ? {
		title: "⚠ The cache has expired: compacting now saves money",
		lines: [`The cache has expired, so the next reply sends your whole conversation (${J(r.before)}) again at the full price. Compacting would shrink it to about ${J(i.after)}. Doing it now saves about ${X(i.cold_saving)} at once.`]
	} : null;
	let o = Ud(r, n);
	return !n && i && i.before_break !== null && i.before_break > 0 && a !== null && o.push(`Taking a break past ${Z(a)}? Compact before it: the cache expires then, and compacting first saves about ${X(i.before_break)} at the next reply.`), o.push("How many replies still follow can't be predicted, so past your own threshold ([chat] compact_hint_tokens) this shows whatever the estimate says."), {
		title: `⚠ Your context is past your ${J(e.hint_tokens)} compact hint`,
		lines: o
	};
}
function Gd(e) {
	let t = e.exploration, n = e.compact_now?.estimate;
	if (!t || !n || n.calls_ahead === null) return null;
	let r = Y(Math.round(n.calls_ahead));
	return {
		title: "Explore in a subagent",
		lines: [`Since the last compaction the main thread has read, searched and listed ${J(t.tokens)} tokens in ${Y(t.calls)} calls. They stay in the context: every reply reads them again, ~${X(t.reread)} each and ~${X(t.carried)} so far.`, (n.ahead_from === "longer" ? `After your past compactions, a stretch this long went on for about ${r} more replies on average. ` : `After your past compactions you went on for about ${r} replies on average. `) + "A subagent (such as Explore) reads in its own context and hands back only its summary, so the next search costs less delegated."],
		note: "A heuristic ([chat] delegate_hint_tokens and delegate_calls_ahead): replayed on real sessions, delegating was cheaper in 52 of 53 cases with 60 to 150 calls ahead, and about even with 20 to 60."
	};
}
//#endregion
//#region src/components/CompactCall.svelte
var Kd = /* @__PURE__ */ V([[
	"p",
	null,
	" "
]]), qd = /* @__PURE__ */ V(["Copy it from here: ", ["input", {
	type: "text",
	readonly: "",
	"aria-label": "The command to copy",
	class: "compact-call-field"
}]], 1), Jd = /* @__PURE__ */ V([[
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
function Yd(e, t) {
	E(t, !0);
	let n = "/compact", r = /* @__PURE__ */ j("no");
	async function i() {
		try {
			await navigator.clipboard.writeText(n), M(r, "yes");
		} catch {
			M(r, "by hand");
		}
	}
	function a(e) {
		e.select();
	}
	var o = Jd(), s = N(o), c = F(s, !0), l = I(s, 2);
	K(l, 16, () => t.call.lines, (e) => e, (e, t) => {
		var n = Kd(), r = F(n, !0);
		L(() => W(r, t)), U(e, n);
	});
	var u = I(l, 2), d = N(u), f = I(d, 2), p = N(f), m = (e) => {
		U(e, Dr("Copied: paste it into Claude Code."));
	}, h = (e) => {
		var t = qd(), r = I(P(t));
		xi(r), Si(r, n), Qr(r, () => a), U(e, t);
	};
	G(p, (e) => {
		B(r) === "yes" ? e(m) : B(r) === "by hand" && e(h, 1);
	}), T(f), T(u), T(o), L(() => W(c, t.call.title)), yr("click", d, i), U(e, o), D();
}
br(["click"]);
//#endregion
//#region src/components/DelegateCall.svelte
var Xd = /* @__PURE__ */ V([[
	"p",
	null,
	" "
]]), Zd = /* @__PURE__ */ V([[
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
function Qd(e, t) {
	E(t, !0);
	var n = Zd(), r = N(n), i = F(r, !0), a = I(r, 2);
	K(a, 16, () => t.call.lines, (e) => e, (e, t) => {
		var n = Xd(), r = F(n, !0);
		L(() => W(r, t)), U(e, n);
	});
	var o = F(I(a, 2), !0);
	T(n), L(() => {
		W(i, t.call.title), W(o, t.call.note);
	}), U(e, n), D();
}
//#endregion
//#region src/components/ContextGauge.svelte
var $d = /* @__PURE__ */ V([["span", { class: "gauge-hint" }]]), ef = /* @__PURE__ */ V([[
	"div",
	{
		class: "gauge",
		role: "meter",
		"aria-valuemin": "0"
	},
	["span", { class: "gauge-fill" }],
	" ",
	,
]]), tf = /* @__PURE__ */ V([["span", { "aria-hidden": "true" }]]), nf = /* @__PURE__ */ V([[
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
]]), rf = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), af = /* @__PURE__ */ V([
	[
		"div",
		{ class: "note" },
		" "
	],
	" ",
	,
], 1), of = /* @__PURE__ */ V([
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
function sf(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Q.session), r = /* @__PURE__ */ k(() => B(n)?.current ?? null), i = /* @__PURE__ */ k(() => B(r)?.compact_now?.cache_warm_until ?? null), a = /* @__PURE__ */ k(() => Ld(B(i))), o = /* @__PURE__ */ k(() => B(n) ? Rc(B(n), B(a).now) : null), s = /* @__PURE__ */ k(() => B(r) && B(o) ? Wd(B(r), B(o), B(a).expired) : null), c = /* @__PURE__ */ k(() => B(n) && B(r) && zc(B(n)) ? Gd(B(r)) : null), l = /* @__PURE__ */ k(() => B(r) ? Bd(B(r)) : null), u = /* @__PURE__ */ k(() => B(l)?.kind === "meter" && B(r)?.compact_now ? Vd(B(r).compact_now, B(a).expired) : null);
	var d = H(), f = P(d), p = (e) => {
		var t = of(), n = P(t), r = (e) => {
			Yd(e, { get call() {
				return B(s);
			} });
		};
		G(n, (e) => {
			B(s) && e(r);
		});
		var i = I(n, 2), a = (e) => {
			Qd(e, { get call() {
				return B(c);
			} });
		};
		G(i, (e) => {
			B(c) && e(a);
		});
		var o = I(i, 2), d = N(o), f = F(d, !0), p = I(d, 2), m = N(p), h = F(I(m), !0);
		T(p);
		var g = I(p, 2), _ = (e) => {
			var t = ef(), n = N(t);
			let r;
			var i = I(n, 2), a = (e) => {
				var t = $d();
				let n;
				L(() => n = li(t, "", n, { left: B(l).hintAt })), U(e, t);
			};
			G(i, (e) => {
				B(l).hintAt !== null && e(a);
			}), T(t), L(() => {
				q(t, "aria-valuemax", B(l).max), q(t, "aria-valuenow", B(l).now), q(t, "aria-label", B(l).meterLabel), r = li(n, "", r, { width: B(l).fill });
			}), U(e, t);
		};
		G(g, (e) => {
			B(l).kind === "meter" && e(_);
		});
		var v = I(g, 2), y = F(v, !0), ee = I(v, 2), b = (e) => {
			var t = af(), n = P(t), r = F(n, !0), i = I(n, 2), a = (e) => {
				let t = /* @__PURE__ */ k(() => B(u).estimate);
				var n = nf(), r = N(n, !0), i = I(r), a = (e) => {
					var n = tf();
					L(() => si(n, 1, `payoff-mark payoff-${B(t).tone ?? ""}`)), U(e, n);
				};
				G(i, (e) => {
					B(t).tone && e(a);
				});
				var o = I(i), s = F(o, !0), c = I(o, 1, !0);
				T(n), L(() => {
					W(r, B(t).lead), W(s, B(t).phrase), W(c, B(t).rest);
				}), U(e, n);
			}, o = (e) => {
				var t = rf(), n = F(t, !0);
				L(() => W(n, B(u).missing)), U(e, t);
			};
			G(i, (e) => {
				B(u).estimate ? e(a) : B(u).missing && e(o, 1);
			}), L(() => W(r, B(u).exact)), U(e, t);
		};
		G(ee, (e) => {
			B(u) && e(b);
		}), T(o), L(() => {
			W(f, B(l).label), W(m, `${B(l).value ?? ""} `), W(h, B(l).secondary), W(y, B(l).note);
		}), U(e, t);
	};
	G(f, (e) => {
		B(l) && e(p);
	}), U(e, d), D();
}
//#endregion
//#region src/components/InputSplit.svelte
var cf = /* @__PURE__ */ V([["span"]]), lf = /* @__PURE__ */ V([[
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
]]), uf = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), df = /* @__PURE__ */ V([[
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
function ff(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Da(t.totals)), r = /* @__PURE__ */ k(() => _d(t.totals)), i = /* @__PURE__ */ k(() => yd(t.context, t.hintTokens));
	var a = df(), o = N(a), s = F(o, !0), c = I(o, 2), l = F(c, !0), u = I(c, 2);
	K(u, 21, () => B(r).filter((e) => e.tokens > 0), (e) => e.label, (e, t) => {
		var n = cf();
		let r;
		L(() => r = li(n, "", r, {
			"flex-grow": B(t).tokens,
			background: B(t).color
		})), U(e, n);
	}), T(u);
	var d = I(u, 2);
	K(d, 17, () => B(r), (e) => e.label, (e, t) => {
		var r = lf(), i = N(r);
		xs(i, { get fill() {
			return B(t).color;
		} });
		var a = I(i, 2), o = F(a, !0), s = I(a, 2), c = F(s, !0), l = I(s, 2), u = F(l, !0), d = F(I(l, 2), !0);
		T(r), L((e, n, i, a) => {
			q(r, "title", B(t).note), W(o, e), W(c, n), W(u, i), W(d, a);
		}, [
			() => $(B(t).label),
			() => J(B(t).tokens),
			() => ga(B(t).tokens, B(n)),
			() => X(B(t).cost)
		]), U(e, r);
	});
	var f = I(d, 2), p = (e) => {
		var t = uf();
		q(t, "title", "The context a main-thread turn reads: new input, cache writes and reads. The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens).");
		var n = F(t, !0);
		L(() => W(n, B(i))), U(e, t);
	};
	G(f, (e) => {
		B(i) !== null && e(p);
	}), T(a), L((e, t, n) => {
		W(s, e), W(l, t), q(u, "aria-label", n);
	}, [
		() => $("Input tokens"),
		() => J(B(n)),
		() => vd(B(r), t.totals)
	]), U(e, a), D();
}
//#endregion
//#region src/components/StatTile.svelte
var pf = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), mf = /* @__PURE__ */ V([[
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
function hf(e, t) {
	E(t, !0);
	let n = Ni(t, "note", 3, null), r = Ni(t, "themedNote", 3, !1);
	var i = mf(), a = N(i), o = F(a, !0), s = I(a, 2), c = F(s, !0), l = I(s, 2), u = (e) => {
		var t = pf(), i = F(t, !0);
		L((e) => W(i, e), [() => r() ? $(n()) : n()]), U(e, t);
	};
	G(l, (e) => {
		n() && e(u);
	}), T(i), L((e) => {
		W(o, e), W(c, t.value);
	}, [() => $(t.label)]), U(e, i), D();
}
//#endregion
//#region src/components/KpiTiles.svelte
var gf = /* @__PURE__ */ V([
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
], 1), _f = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	,
]]), vf = /* @__PURE__ */ V([
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
function yf(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => t.savings ? gd(t.savings) : null);
	var r = vf(), i = P(r), a = N(i), o = N(a), s = F(o, !0), c = I(o);
	T(a);
	var l = I(a, 2), u = F(l, !0), d = I(l, 2), f = F(d, !0), p = I(d, 2), m = (e) => {
		var t = _f(), r = N(t), i = (e) => {
			var t = gf(), r = P(t), i = F(r, !0), a = F(I(r, 2), !0);
			L(() => {
				si(r, 1, ti(B(n).verdict === "gain" ? "verdict-gain" : "verdict-loss")), W(i, B(n).amount), W(a, B(n).count);
			}), U(e, t);
		}, a = (e) => {
			var t = Dr();
			L(() => W(t, B(n).count)), U(e, t);
		};
		G(r, (e) => {
			B(n).verdict ? e(i) : e(a, -1);
		}), T(t), L(() => q(t, "title", B(n).title)), U(e, t);
	};
	G(p, (e) => {
		B(n) && e(m);
	}), T(i);
	var h = I(i, 2);
	ff(h, {
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
	var g = I(h, 2);
	{
		let e = /* @__PURE__ */ k(() => Y(t.totals.turns));
		hf(g, {
			label: "Turns",
			get value() {
				return B(e);
			},
			note: "API calls with usage",
			themedNote: !0
		});
	}
	var _ = I(g, 2);
	{
		let e = /* @__PURE__ */ k(() => J(t.totals.output)), n = /* @__PURE__ */ k(() => X(t.totals.cost_parts.output));
		hf(_, {
			label: "Output tokens",
			get value() {
				return B(e);
			},
			get note() {
				return B(n);
			}
		});
	}
	L((e, n, r) => {
		W(s, e), W(c, `, ${t.scope ?? ""}`), W(u, n), W(f, r);
	}, [
		() => $("Estimated cost"),
		() => X(t.totals.cost),
		() => md(t.totals)
	]), U(e, r), D();
}
//#endregion
//#region src/components/RuntimeTiles.svelte
var bf = /* @__PURE__ */ V([
	,
	,
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function xf(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => "source" in t.runtime && t.runtime.source === "transcripts"), r = /* @__PURE__ */ k(() => bd(t.runtime, t.from, t.costPer100Lines, B(n)));
	var i = bf(), a = P(i);
	{
		let e = /* @__PURE__ */ k(() => _a(t.runtime.duration_ms));
		hf(a, {
			label: "Session time",
			get value() {
				return B(e);
			},
			get note() {
				return B(r).session;
			}
		});
	}
	var o = I(a, 2);
	{
		let e = /* @__PURE__ */ k(() => _a(t.runtime.api_ms));
		hf(o, {
			label: "Waiting on the API",
			get value() {
				return B(e);
			},
			get note() {
				return B(r).api;
			}
		});
	}
	var s = I(o, 2);
	{
		let e = /* @__PURE__ */ k(() => _a(t.runtime.tool_ms));
		hf(s, {
			label: "Running tools",
			get value() {
				return B(e);
			},
			get note() {
				return B(r).tools;
			}
		});
	}
	var c = I(s, 2);
	{
		let e = /* @__PURE__ */ k(() => `+${Y(t.runtime.lines_added)} / −${Y(t.runtime.lines_removed)}`);
		hf(c, {
			label: "Lines changed",
			get value() {
				return B(e);
			},
			get note() {
				return B(r).lines;
			}
		});
	}
	U(e, i), D();
}
//#endregion
//#region src/components/SessionWaits.svelte
var Sf = /* @__PURE__ */ V([[
	"strong",
	null,
	" "
]]), Cf = /* @__PURE__ */ V([[
	"span",
	null,
	[
		"a",
		null,
		" "
	],
	" "
]]), wf = /* @__PURE__ */ V([[
	"p",
	{ class: "wait-line" },
	[
		"span",
		{ class: "wait-icon" },
		,
	],
	" ",
	,
]]), Tf = /* @__PURE__ */ V([["div", {
	class: "card wait-notice",
	role: "status"
}]]);
function Ef(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Q.session), r = /* @__PURE__ */ k(() => B(n) ? Xc(B(n), Q.live?.sessions ?? []) : []);
	var i = Tf();
	K(i, 21, () => B(r), (e) => e.session_id, (e, t) => {
		var n = wf(), r = N(n);
		rl(N(r), { get badge() {
			return B(t);
		} }), T(r);
		var i = I(r, 2), a = (e) => {
			var n = Sf(), r = F(n);
			L((e, t) => W(r, `This session is ${e ?? ""}${t ?? ""}`), [() => B(t).text.charAt(0).toLowerCase(), () => B(t).text.slice(1)]), U(e, n);
		}, o = (e) => {
			var n = Cf(), r = N(n), i = F(r, !0), a = I(r);
			T(n), L((e) => {
				q(r, "href", e), W(i, B(t).title), W(a, `: ${B(t).text ?? ""}`);
			}, [() => gc(B(t))]), U(e, n);
		};
		G(i, (e) => {
			B(t).title === null ? e(a) : e(o, -1);
		}), T(n), U(e, n);
	}), T(i), L(() => q(i, "hidden", B(r).length === 0)), U(e, i), D();
}
//#endregion
//#region src/components/UsageTable.svelte
var Df = /* @__PURE__ */ V([[
	"h3",
	null,
	" "
]]), Of = /* @__PURE__ */ V([[
	"h2",
	null,
	" "
]]), kf = /* @__PURE__ */ V([[
	"p",
	{ class: "note" },
	" "
]]), Af = /* @__PURE__ */ V([[
	"span",
	null,
	,
	" "
]]), jf = /* @__PURE__ */ V([[
	"span",
	{ class: "effort" },
	" "
]]), Mf = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), Nf = /* @__PURE__ */ V([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1), Pf = /* @__PURE__ */ V([[
	"section",
	{ class: "card" },
	,
]]);
function Ff(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = H(), o = P(n), c = (e) => {
			{
				let n = /* @__PURE__ */ k(() => wd(t.nameLabel)), o = /* @__PURE__ */ k(() => t.note === void 0 ? void 0 : i);
				Vs(e, {
					get key() {
						return s();
					},
					get columns() {
						return B(n);
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
						return B(o);
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
		G(o, (e) => {
			t.rows ? e(c) : e(l, -1);
		}), U(e, n);
	}, r = (e) => {
		var n = H(), r = P(n), i = (e) => {
			var n = Df(), r = F(n, !0);
			L(() => {
				q(n, "id", `${t.id ?? ""}-title`), W(r, t.title);
			}), U(e, n);
		}, a = (e) => {
			var n = Of(), r = F(n, !0);
			L(() => {
				q(n, "id", `${t.id ?? ""}-title`), W(r, t.title);
			}), U(e, n);
		};
		G(r, (e) => {
			o() ? e(i) : e(a, -1);
		}), U(e, n);
	}, i = (e) => {
		var n = kf(), r = F(n, !0);
		L(() => W(r, t.note)), U(e, n);
	}, a = (e, t = v) => {
		var n = Nf(), r = P(n), i = N(r), a = (e) => {
			var n = Af(), r = N(n);
			xs(r, { get fill() {
				return t().swatch;
			} });
			var i = I(r, 1, !0);
			T(n), L(() => W(i, t().name)), U(e, n);
		}, o = (e) => {
			var n = jf(), r = F(n, !0);
			L(() => W(r, t().name)), U(e, n);
		}, s = (e) => {
			var n = Dr();
			L(() => W(n, t().name)), U(e, n);
		};
		G(i, (e) => {
			t().kind === "model" ? e(a) : t().kind === "effort" ? e(o, 1) : e(s, -1);
		}), T(r), K(I(r, 2), 19, () => B(c), (e) => e.label, (e, n, r) => {
			var i = Mf(), a = F(i, !0);
			L(() => W(a, t().cells[B(r)])), U(e, i);
		}), U(e, n);
	}, o = Ni(t, "inline", 3, !1), s = Ni(t, "pagerKey", 19, () => t.id), c = /* @__PURE__ */ k(() => wd(t.nameLabel).slice(1));
	var l = H(), u = P(l), d = (e) => {
		n(e);
	}, f = (e) => {
		var r = Pf(), i = N(r);
		n(i), T(r), L(() => q(r, "aria-labelledby", `${t.id ?? ""}-title`)), U(e, r);
	};
	G(u, (e) => {
		o() ? e(d) : e(f, -1);
	}), U(e, l), D();
}
//#endregion
//#region src/components/SessionView.svelte
var If = /* @__PURE__ */ V([[
	"div",
	{ class: "prompt" },
	" "
]]), Lf = /* @__PURE__ */ V([[
	"div",
	{
		class: "kpis session-kpis",
		role: "group",
		"aria-label": "Time and lines changed"
	},
	,
]]), Rf = /* @__PURE__ */ V([[
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
	["div", {
		class: "legacy-slot",
		id: "session-secrets"
	}],
	" ",
	,
	" ",
	["div", {
		class: "legacy-slot",
		id: "session-top"
	}],
	" ",
	,
	" ",
	,
	" ",
	["div", {
		class: "legacy-slot",
		id: "session-mid"
	}],
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
	["div", {
		class: "legacy-slot",
		id: "session-end"
	}]
]]);
function zf(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Q.session), r = /* @__PURE__ */ k(() => B(n) ? Ed(B(n).models, B(n).model_effort, Ki(B(n).models.map((e) => e.model))) : []), i = /* @__PURE__ */ k(() => B(n) ? Td(B(n).skills, (e) => e.skill) : []), a = /* @__PURE__ */ k(() => B(n) ? Td(B(n).mcp_servers, (e) => e.mcp_server) : []), o = /* @__PURE__ */ k(() => B(n) ? yu(B(n).api_errors) : []);
	function s(e) {
		B(n) && e.key === "Escape" && !e.defaultPrevented && (location.hash = "");
	}
	var c = H();
	vr("keydown", Qt, s);
	var l = P(c), u = (e) => {
		let t = /* @__PURE__ */ k(() => B(n).session_id), s = /* @__PURE__ */ k(() => B(n).runtime);
		var c = H();
		Hr(P(c), () => B(t), (e) => {
			var c = Rf(), l = N(c), u = F(N(l), !0);
			je(4), T(l);
			var d = I(l, 2), f = (e) => {
				var t = If(), r = F(t, !0);
				L(() => W(r, B(n).prompt)), U(e, t);
			};
			G(d, (e) => {
				B(n).prompt && e(f);
			});
			var p = I(d, 2), m = F(p, !0), h = I(p, 2);
			Ef(h, {});
			var g = I(h, 2);
			yf(N(g), {
				get totals() {
					return B(n);
				},
				scope: "this session",
				get context() {
					return B(n).context;
				},
				get hintTokens() {
					return B(n).compact_hint_tokens;
				},
				get savings() {
					return B(n).compaction_savings;
				}
			}), T(g);
			var _ = I(g, 2), v = (e) => {
				var t = Lf(), r = N(t);
				{
					let e = /* @__PURE__ */ k(() => Sd(B(s).source)), t = /* @__PURE__ */ k(() => Cd({
						cost: B(n).cost,
						runtime: B(s)
					}));
					xf(r, {
						get runtime() {
							return B(s);
						},
						get from() {
							return B(e);
						},
						get costPer100Lines() {
							return B(t);
						}
					});
				}
				T(t), U(e, t);
			};
			G(_, (e) => {
				B(s) && e(v);
			});
			var y = I(_, 4);
			sf(y, {});
			var ee = I(y, 4);
			{
				let e = /* @__PURE__ */ k(() => $("By model"));
				Ff(ee, {
					inline: !0,
					id: "session-models",
					get title() {
						return B(e);
					},
					nameLabel: "Model",
					get rows() {
						return B(r);
					},
					empty: "No usage in this range.",
					get pagerKey() {
						return `${B(t) ?? ""}-models`;
					}
				});
			}
			var b = I(ee, 2);
			Pd(b, {
				get agents() {
					return B(n).agents;
				},
				get pagerKey() {
					return `${B(t) ?? ""}-agents`;
				}
			});
			var x = I(b, 4), S = N(x), te = N(S);
			{
				let e = /* @__PURE__ */ k(() => $("By skill"));
				Ff(te, {
					inline: !0,
					id: "session-skills",
					get title() {
						return B(e);
					},
					nameLabel: "Skill",
					get rows() {
						return B(i);
					},
					empty: "No turns attributed to a skill.",
					get pagerKey() {
						return `${B(t) ?? ""}-skills`;
					}
				});
			}
			T(S);
			var ne = I(S, 2), re = N(ne);
			{
				let e = /* @__PURE__ */ k(() => $("By MCP server"));
				Ff(re, {
					inline: !0,
					id: "session-mcp-servers",
					get title() {
						return B(e);
					},
					nameLabel: "MCP server",
					get rows() {
						return B(a);
					},
					empty: "No turns attributed to an MCP server.",
					get pagerKey() {
						return `${B(t) ?? ""}-mcp-servers`;
					}
				});
			}
			T(ne), T(x);
			var ie = I(x, 2);
			{
				let e = /* @__PURE__ */ k(() => $("Rate limits and API errors"));
				wu(ie, {
					id: "session-api-errors",
					get title() {
						return B(e);
					},
					get rows() {
						return B(o);
					},
					empty: "No API errors in this session.",
					get pagerKey() {
						return `${B(t) ?? ""}-api-errors`;
					},
					withSession: !1
				});
			}
			je(2), T(c), Qr(c, () => id({
				hide: ["filters", "summary"],
				focus: "#drilldown-title"
			})), L((e, t) => {
				W(u, e), W(m, t);
			}, [() => hc(B(n)), () => ad(B(n))]), U(e, c);
		}), U(e, c);
	};
	G(l, (e) => {
		B(n) && e(u);
	}), U(e, c), D();
}
//#endregion
//#region src/components/SummaryTiles.svelte
var Bf = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	" "
]]);
function Vf(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Q.summary);
	var r = H(), i = P(r), a = (e) => {
		var r = H(), i = P(r), a = (e) => {
			{
				let t = /* @__PURE__ */ k(() => pd(B(n)));
				yf(e, {
					get totals() {
						return B(n).totals;
					},
					get scope() {
						return B(t);
					},
					get context() {
						return B(n).context;
					},
					get hintTokens() {
						return B(n).compact_hint_tokens;
					},
					get savings() {
						return B(n).compaction_savings;
					}
				});
			}
		}, o = (e) => {
			{
				let t = /* @__PURE__ */ k(() => xd(B(n).runtime.sessions));
				xf(e, {
					get runtime() {
						return B(n).runtime;
					},
					get from() {
						return B(t);
					},
					get costPer100Lines() {
						return B(n).runtime.cost_per_100_lines;
					}
				});
			}
		};
		G(i, (e) => {
			t.rows === "kpis" ? e(a) : e(o, -1);
		}), U(e, r);
	}, o = (e) => {
		var t = Bf(), n = F(t, !0);
		L(() => W(n, Q.summaryFailed ? "Could not load the summary." : "Loading…")), U(e, t);
	};
	G(i, (e) => {
		B(n) ? e(a) : t.rows === "kpis" && e(o, 1);
	}), U(e, r), D();
}
//#endregion
//#region src/components/UsageTables.svelte
var Hf = /* @__PURE__ */ V([
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
function Uf(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Q.summary), r = /* @__PURE__ */ k(() => B(n) ? Td(B(n).agent_type, (e) => e.agent_type) : null), i = /* @__PURE__ */ k(() => B(n) ? Ki([...new Set(B(n).day_model.map((e) => e.model))]) : null), a = /* @__PURE__ */ k(() => B(n) && B(i) ? Ed(B(n).model, B(n).model_effort, B(i)) : null), o = /* @__PURE__ */ k(() => B(n) ? Td(B(n).project, (e) => e.project) : null), s = /* @__PURE__ */ k(() => B(n) ? Td(B(n).skill, (e) => e.skill) : null), c = /* @__PURE__ */ k(() => B(n) ? Td(B(n).mcp_server, (e) => e.mcp_server) : null);
	var l = Hf(), u = P(l), d = N(u);
	{
		let e = /* @__PURE__ */ k(() => $("By agent type"));
		Ff(d, {
			id: "by-agent",
			get title() {
				return B(e);
			},
			nameLabel: "Agent type",
			get rows() {
				return B(r);
			},
			empty: "No usage in this range."
		});
	}
	var f = I(d, 2);
	{
		let e = /* @__PURE__ */ k(() => $("By model"));
		Ff(f, {
			id: "by-model",
			get title() {
				return B(e);
			},
			nameLabel: "Model",
			get rows() {
				return B(a);
			},
			empty: "No usage in this range."
		});
	}
	T(u);
	var p = I(u, 2);
	{
		let e = /* @__PURE__ */ k(() => $("By project"));
		Ff(p, {
			id: "by-project",
			get title() {
				return B(e);
			},
			nameLabel: "Project",
			get rows() {
				return B(o);
			},
			empty: "No usage in this range."
		});
	}
	var m = I(p, 2), h = N(m);
	{
		let e = /* @__PURE__ */ k(() => $("By skill"));
		Ff(h, {
			id: "by-skill",
			get title() {
				return B(e);
			},
			note: "turns Claude Code attributes to a skill while it runs",
			nameLabel: "Skill",
			get rows() {
				return B(s);
			},
			empty: "No turns attributed to a skill in this range."
		});
	}
	var g = I(h, 2);
	{
		let e = /* @__PURE__ */ k(() => $("By MCP server"));
		Ff(g, {
			id: "by-mcp-server",
			get title() {
				return B(e);
			},
			note: "turns Claude Code attributes to an MCP server's tools",
			nameLabel: "MCP server",
			get rows() {
				return B(c);
			},
			empty: "No turns attributed to an MCP server in this range."
		});
	}
	T(m), U(e, l), D();
}
//#endregion
//#region src/lib/banner.svelte.ts
var Wf = class {
	#e = new vo();
	#t = /* @__PURE__ */ k(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return B(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, Gf = /* @__PURE__ */ t({
	secretReach: () => Yf,
	secretTone: () => Kf,
	secretVia: () => qf
});
function Kf(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function qf(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var Jf = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function Yf(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(Jf, e.reach) ? Jf[e.reach] ?? "" : "no result yet";
}
//#endregion
//#region src/legacy.svelte.ts
var Xf = [
	ca,
	Wi,
	Mc,
	Gf,
	Hc,
	So,
	Ea,
	Zo,
	as,
	Os,
	Ss,
	yo,
	Gl,
	$l
];
function Zf(e) {
	let t = new Wf(), n = e.document.getElementById("error");
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
	let d = e.document.getElementById("filters");
	if (!d) throw Error("The page has no #filters container for the range filter");
	let f = e.document.getElementById("session-card");
	if (!f) throw Error("The page has no #session-card container for the session view");
	let p = Pr(Fi, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	n.remove();
	let m = r.map(({ id: e, container: t }) => Pr(Vf, {
		target: t,
		props: { rows: e }
	})), h = Pr(yl, { target: i }), g = Pr(Wl, { target: a }), _ = Pr(fc, { target: o }), v = Pr(jc, { target: s }), y = Pr(Gu, { target: c }), ee = Pr(Uf, { target: l }), b = Pr(td, { target: u }), x = Pr(ou, { target: d }), S = Pr(zf, { target: f });
	return e.showError = (e, n) => {
		t.show(e, n), At();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...Xf), { stop() {
		Rr(p);
		for (let e of m) Rr(e);
		Rr(h), Rr(g), Rr(_), Rr(v), Rr(y), Rr(ee), Rr(b), Rr(x), Rr(S), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of Xf.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
Zf(window);
//#endregion

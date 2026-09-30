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
	return ke(/* @__PURE__ */ an(w));
}
function T(e) {
	if (C) {
		if (/* @__PURE__ */ an(w) !== null) throw Te(), n;
		w = e;
	}
}
function je(e = 1) {
	if (C) {
		for (var t = e, n = w; t--;) n = /* @__PURE__ */ an(n);
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
		var i = /* @__PURE__ */ an(n);
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
		r: B,
		l: null
	};
}
function D(e) {
	var t = Ge, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) yn(r);
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
	var t = z, n = B;
	Un(null), Wn(null);
	try {
		return e();
	} finally {
		Un(t), Wn(n);
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
	var s = B, c = st(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				mn(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ ft(e))).then(u).catch((e) => mn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ct();
	}) : f();
}
function st() {
	var e = B, t = z, n = Ge, r = A;
	return function(i = !0) {
		Wn(e), Un(t), Ke(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ct(e = !0) {
	Wn(null), Un(null), Ke(null), e && A?.deactivate();
}
function lt() {
	var e = B, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ut(e) {
	var t = 2 | S;
	return B !== null && (B.f |= se), {
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
		parent: B,
		ac: null
	};
}
var dt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ft(e, t, n) {
	let i = B;
	i === null && Le();
	var a = void 0, o = Bt(r), s = !z, c = /* @__PURE__ */ new Set();
	return Sn(() => {
		var t = B, n = ee();
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
	}), vn(() => {
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
	return Kn(t), t;
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
		for (var n = 0; n < t.length; n += 1) An(t[n]);
	}
}
function ht(e) {
	var t, n = B, i = e.parent;
	if (!Bn && i !== null && e.v !== r && i.f & 24576) return we(), e.v;
	Wn(i);
	try {
		mt(e), t = ir(e);
	} finally {
		Wn(n);
	}
	return t;
}
function gt(e) {
	var t = ht(e);
	if (!e.equals(t) && (e.wv = tr(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), bt?.capture(e, t, !0)), e.deps === null))) {
		O(e, x);
		return;
	}
	Bn || (xt === null ? et(e) : (_n() || A?.is_fork) && xt.set(e, t));
}
function _t(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && it(() => {
		t.ac.abort(Se), t.ac = null;
	}), t.fn !== null && (t.teardown = v), sr(t, 0), On(t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && cr(t);
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
				a ? r.f ^= x : i & 4 ? t.push(r) : nr(r) && (i & 16 && this.#d.add(r), cr(r));
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
		mn(e, St);
	}
}
var Mt = null;
function Nt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && nr(r) && (Mt = /* @__PURE__ */ new Set(), cr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Mn(r), Mt?.size > 0)) {
				Rt.clear();
				for (let e of Mt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Mt.has(n) && (Mt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || cr(n);
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
	return Kn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Vt(e, t = !1, n = !0) {
	let r = Bt(e);
	return t || (r.equals = Ie), r;
}
function M(e, t, n = !1) {
	return z !== null && (!Hn || z.f & 131072) && Je() && z.f & 4325394 && (Gn === null || !Gn.has(e)) && Ue(), Wt(e, n ? Jt(t) : t, Et);
}
var Ht = null, Ut = 0;
function Wt(e, t, n = null) {
	if (!e.equals(t)) {
		Bn ? Rt.set(e, t) : Rt.has(e) || Rt.set(e, e.v);
		var r = kt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && ht(t), xt === null && et(t);
		}
		e.wv = tr(), Ht = null, Ut = 0, qt(e, S, n), Ht = null, Je() && B !== null && B.f & 1024 && !(B.f & 96) && (Yn === null ? Xn([e]) : Yn.push(e)), !r.is_fork && Lt.size > 0 && !zt && Gt();
	}
	return t;
}
function Gt() {
	zt = !1;
	for (let e of Lt) {
		e.f & 1024 && O(e, te);
		let t;
		try {
			t = nr(e);
		} catch {
			t = !0;
		}
		t && cr(e);
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
			if (i || s !== B) {
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
	var n = /* @__PURE__ */ new Map(), i = s(e), a = /* @__PURE__ */ j(0), o = null, c = $n, l = (e) => {
		if ($n === c) return e();
		var t = z, n = $n;
		Un(null), er(c);
		var r = e();
		return Un(t), er(n), r;
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
				var u = V(s);
				return u === r ? void 0 : u;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var i = Reflect.getOwnPropertyDescriptor(e, t), a = n.get(t);
			if (a !== void 0) {
				var o = V(a);
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
			return (i !== void 0 || B !== null && (!a || f(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ j(a ? Jt(e[t]) : r, o)), n.set(t, i)), V(i) === r) ? !1 : a;
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
			V(a);
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
function N(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function rn(e) {
	return en.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function an(e) {
	return tn.call(e);
}
function P(e, t) {
	if (!C) return /* @__PURE__ */ rn(e);
	var n = /* @__PURE__ */ rn(w);
	if (n === null) n = w.appendChild(N());
	else if (t && n.nodeType !== 3) {
		var r = N();
		return n?.before(r), ke(r), r;
	}
	return t && fn(n), ke(n), n;
}
function F(e, t = !1) {
	if (!C) {
		var n = /* @__PURE__ */ rn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ an(n) : n;
	}
	if (t) {
		if (w?.nodeType !== 3) {
			var r = N();
			return w?.before(r), ke(r), r;
		}
		fn(w);
	}
	return w;
}
function I(e, t = !1) {
	if (!C) return /* @__PURE__ */ rn(e);
	var n = P(e, t);
	return T(e), n;
}
function L(e, t = 1, n = !1) {
	let r = C ? w : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ an(r);
	if (!C) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = N();
			return r === null ? i?.after(a) : r.before(a), ke(a), a;
		}
		fn(r);
	}
	return ke(r), r;
}
function on(e) {
	e.textContent = "";
}
function sn() {
	return !1;
}
function cn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function ln() {
	return document.createDocumentFragment();
}
function un(e = "") {
	return document.createComment(e);
}
function dn(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function fn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function pn(e) {
	var t = B;
	if (t === null) return z.f |= fe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	mn(e, t);
}
function mn(e, t) {
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
function hn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function gn(e, t) {
	var n = B;
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
			cr(r);
		} catch (e) {
			throw An(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= oe));
	}
	if (i !== null && (i.parent = n, n !== null && hn(i, n), z !== null && z.f & 2 && !(e & 64))) {
		var a = z;
		(a.effects ??= []).push(i);
	}
	return r;
}
function _n() {
	return z !== null && !Hn;
}
function vn(e) {
	let t = gn(8, null);
	return O(t, x), t.teardown = e, t;
}
function yn(e) {
	return gn(4 | ce, e);
}
function bn(e) {
	kt.ensure();
	let t = gn(64 | se, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Nn(t, () => {
			An(t), n(void 0);
		}) : (An(t), n(void 0));
	});
}
function xn(e) {
	return gn(4, e);
}
function Sn(e) {
	return gn(de | se, e);
}
function Cn(e, t = 0) {
	return gn(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	ot(r, t, n, (t) => {
		gn(8, () => {
			e(...t.map(V));
		});
	});
}
function wn(e, t = 0) {
	return gn(16 | t, e);
}
function Tn(e, t = 0) {
	return gn(b | t, e);
}
function En(e) {
	return gn(32 | se, e);
}
function Dn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Bn, r = z;
		Vn(!0), Un(null);
		try {
			t.call(null);
		} catch (t) {
			mn(t, e.parent);
		} finally {
			Vn(n), Un(r);
		}
	}
}
function On(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && it(() => {
			e.abort(Se);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : An(n, t), n = r;
	}
}
function kn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || An(t), t = n;
	}
}
function An(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (jn(e.nodes.start, e.nodes.end), n = !0), e.f |= ae, On(e, t && !n), sr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Dn(e), e.f ^= ae, e.f |= re;
	var i = e.parent;
	i !== null && i.first !== null && Mn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function jn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ an(e);
		e.remove(), e = n;
	}
}
function Mn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Nn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Pn(e, r, !0);
	var i = () => {
		n && An(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Pn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ne;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Pn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Fn(e) {
	e.f &= -257, In(e, !0);
}
function In(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ne, e.f & 1024 || (O(e, S), kt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			In(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Ln(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ an(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Rn = null, zn = !1, Bn = !1;
function Vn(e) {
	Bn = e;
}
var z = null, Hn = !1;
function Un(e) {
	z = e;
}
var B = null;
function Wn(e) {
	B = e;
}
var Gn = null;
function Kn(e) {
	z !== null && (z.f & 2097152 || z.f & 2) && (Gn ??= /* @__PURE__ */ new Set()).add(e);
}
var qn = null, Jn = 0, Yn = null;
function Xn(e) {
	Yn = e;
}
var Zn = 1, Qn = 0, $n = Qn;
function er(e) {
	$n = e;
}
function tr() {
	return ++Zn;
}
function nr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (nr(a) && gt(a), a.wv > e.wv) return !0;
		}
		t & 512 && xt === null && O(e, x);
	}
	return !1;
}
function rr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Gn !== null && Gn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? rr(a, t, !1) : t === a && (n ? O(a, S) : a.f & 1024 && O(a, te), Pt(a));
	}
}
function ir(e) {
	var t = qn, n = Jn, r = Yn, i = z, a = Gn, o = Ge, s = Hn, c = $n, l = e.f;
	qn = null, Jn = 0, Yn = null, z = l & 96 ? null : e, Gn = null, Ke(e.ctx), Hn = !1, $n = ++Qn, e.ac !== null && (it(() => {
		e.ac.abort(Se);
	}), e.ac = null);
	try {
		e.f |= ue;
		var u = e.fn, d = u();
		e.f |= ie;
		var f = ar(e);
		if (Je() && Yn !== null && !Hn && f !== null && !(e.f & 6146)) for (var p = 0; p < Yn.length; p++) rr(Yn[p], e);
		if (i !== null && i !== e) {
			if (Qn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Qn;
			if (t !== null) for (let e of t) e.rv = Qn;
			Yn !== null && (r === null ? r = Yn : r.push(...Yn));
		}
		return e.f & 8388608 && (e.f ^= fe), d;
	} catch (t) {
		return ar(e), pn(t);
	} finally {
		e.f ^= ue, qn = t, Jn = n, Yn = r, z = i, Gn = a, Ke(o), Hn = s, $n = c;
	}
}
function ar(e) {
	var t = e.deps, n = A?.is_fork;
	if (qn !== null) {
		var r;
		if (n || sr(e, Jn), t !== null && Jn > 0) for (t.length = Jn + qn.length, r = 0; r < qn.length; r++) t[Jn + r] = qn[r];
		else e.deps = t = qn;
		if (_n() && e.f & 512) for (r = Jn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Jn < t.length && (sr(e, Jn), t.length = Jn);
	return t;
}
function or(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var i = c.call(n, e);
		if (i !== -1) {
			var a = n.length - 1;
			a === 0 ? n = t.reactions = null : (n[i] = n[a], n.pop());
		}
	}
	if (n === null && t.f & 2 && (qn === null || !l.call(qn, t))) {
		var o = t;
		o.f & 512 && (o.f ^= 512), o.v !== r && et(o), o.ac !== null && it(() => {
			o.ac.abort(Se), o.ac = null, O(o, S);
		}), _t(o), sr(o, 0);
	}
}
function sr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) or(e, n[r]);
}
function cr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		O(e, x);
		var n = B, r = zn;
		B = e, zn = !(t & 96);
		try {
			t & 16777232 ? kn(e) : On(e), Dn(e);
			var i = ir(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Zn;
		} finally {
			zn = r, B = n;
		}
	}
}
async function lr() {
	await Promise.resolve(), At();
}
function V(e) {
	var t = !!(e.f & 2);
	if (Rn?.add(e), z !== null && !Hn && !(B !== null && B.f & 16384) && (Gn === null || !Gn.has(e))) {
		var n = z.deps;
		if (z.f & 2097152) e.rv < Qn && (e.rv = Qn, qn === null && n !== null && n[Jn] === e ? Jn++ : qn === null ? qn = [e] : qn.push(e));
		else {
			z.deps ??= [], l.call(z.deps, e) || z.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [z] : l.call(r, z) || r.push(z);
		}
	}
	if (Bn && Rt.has(e)) return Rt.get(e);
	if (t) {
		var i = e;
		if (Bn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || dr(i)) && (a = ht(i)), Rt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Hn && z !== null && (zn || !!(z.f & 512)), s = (i.f & ie) === 0;
		nr(i) && (o && (i.f |= 512), gt(i)), o && !s && (vt(i), ur(i));
	}
	if (xt?.has(e)) return xt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function ur(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (vt(t), ur(t));
}
function dr(e) {
	if (e.v === r) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rt.has(t) || t.f & 2 && dr(t)) return !0;
	return !1;
}
function fr(e) {
	var t = Hn;
	try {
		return Hn = !0, e();
	} finally {
		Hn = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var pr = Symbol("events"), mr = /* @__PURE__ */ new Set(), hr = /* @__PURE__ */ new Set();
function gr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Sr.call(t, e), !e.cancelBubble) return it(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Ze(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function _r(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = gr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && vn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function vr(e, t, n) {
	(t[pr] ??= {})[e] = n;
}
function yr(e) {
	for (var t = 0; t < e.length; t++) mr.add(e[t]);
	for (var n of hr) n(e);
}
var br = null, xr = !1;
function Sr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	br = e, xr || (xr = !0, setTimeout(() => {
		xr = !1, br = null;
	}));
	var o = 0, s = br === e && e[pr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[pr] = t;
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
		var u = z, f = B;
		Un(null), Wn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[pr]?.[r];
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
			e[pr] = t, delete e.currentTarget, Un(u), Wn(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var Cr = Ce ? "template" : "TEMPLATE";
function wr(e, t) {
	var n = B;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function Tr(e, t) {
	var n = ln();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(N(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(un(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = r, u = e === "svg" ? a : e === "math" ? o : t;
		var i = cn(e, u, c?.is);
		for (var s in c) dn(i, s, c[s]);
		l.length > 0 && (i.nodeName === Cr ? i.content : i).append(Tr(l, i.nodeName === "foreignObject" ? void 0 : u)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function H(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (C) return wr(w, null), w;
		i === void 0 && (i = Tr(e, t & 4 ? a : t & 8 ? o : void 0), n || (i = /* @__PURE__ */ rn(i)));
		var s = r || $t ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ rn(s), l = s.lastChild;
			wr(c, l);
		} else wr(s, s);
		return s;
	};
}
function Er(e = "") {
	if (!C) {
		var t = N(e + "");
		return wr(t, t), t;
	}
	var n = w;
	return n.nodeType === 3 ? fn(n) : (n.before(n = N()), ke(n)), wr(n, n), n;
}
function U() {
	if (C) return wr(w, null), w;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = N();
	return e.append(t, n), wr(t, n), e;
}
function W(e, t) {
	if (C) {
		var n = B;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = w), Ae();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Dr = ["touchstart", "touchmove"];
function Or(e) {
	return Dr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function kr(e) {
	let t = 0, n = Bt(0), r;
	return () => {
		_n() && (V(n), Cn(() => (t === 0 && (r = fr(() => e(() => Kt(n)))), t += 1, () => {
			Ze(() => {
				--t, t === 0 && (r?.(), r = void 0, Kt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Ar = oe | se;
function jr(e, t, n, r) {
	new Mr(e, t, n, r);
}
var Mr = class {
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
	#h = kr(() => (this.#m = Bt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = B;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = B.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = wn(() => {
			if (C) {
				let e = this.#t;
				Ae();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Ar), C && (this.#e = w);
	}
	#g() {
		try {
			this.#a = En(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Ze(r), t && (this.#s = En(() => {
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
			t = !0, n && We(), this.#s !== null && Nn(this.#s, () => {
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
					mn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = En(() => e(this.#e)), Ze(() => {
			var e = this.#c = document.createDocumentFragment(), t = N(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return En(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						mn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(A);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Nn(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = En(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Ln(this.#a, e);
				let t = this.#n.pending;
				this.#o = En(() => t(this.#e));
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
		var t = B, n = z, r = Ge;
		Wn(this.#i), Un(this.#i), Ke(this.#i.ctx);
		try {
			return kt.ensure(), e();
		} finally {
			Wn(t), Un(n), Ke(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Nn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ze(() => {
			this.#d = !1, this.#m && Wt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), V(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (An(this.#a), null), this.#o &&= (An(this.#o), null), this.#s &&= (An(this.#s), null), C && (ke(this.#t), je(), ke(Me()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return En(() => {
						var r = B;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return mn(e, this.#i.parent), null;
				}
			}));
		};
		Ze(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				mn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => mn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function G(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[be] ??= e.nodeValue) && (e[be] = n, e.nodeValue = `${n}`);
}
function Nr(e, t) {
	return Fr(e, t);
}
var Pr = /* @__PURE__ */ new Map();
function Fr(e, { target: t, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	nn();
	var l = void 0, d = bn(() => {
		var s = r ?? t.appendChild(N());
		jr(s, { pending: () => {} }, (t) => {
			E({});
			var r = Ge;
			if (o && (r.c = o), a && (i.$$events = a), C && wr(t, null), l = e(t, i) || qe(), C && (B.nodes.end = w, w === null || w.nodeType !== 8 || w.data !== "]")) throw Te(), n;
			D();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = Or(r);
					for (let e of [t, document]) {
						var a = Pr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Pr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Sr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(u(mr)), hr.add(f), () => {
			for (var e of d) for (let r of [t, document]) {
				var n = Pr.get(r), i = n.get(e);
				--i == 0 ? (r.removeEventListener(e, Sr), n.delete(e), n.size === 0 && Pr.delete(r)) : n.set(e, i);
			}
			hr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Ir.set(l, d), l;
}
var Ir = /* @__PURE__ */ new WeakMap();
function Lr(e, t) {
	let n = Ir.get(e);
	return n ? (Ir.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Rr = class {
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
			if (n) Fn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Fn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (An(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Ln(r, t), t.append(N()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else An(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Nn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (An(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = sn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = N();
				i.append(a), this.#n.set(e, {
					effect: En(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, En(() => t(this.anchor)));
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
function zr(e, t, ...n) {
	var r = new Rr(e);
	wn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, oe);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function K(e, t, n = !1) {
	var r;
	C && (r = w, Ae());
	var i = new Rr(e), a = n ? oe : 0;
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
	wn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var Br = Symbol("NaN");
function Vr(e, t, n) {
	C && Ae();
	var r = new Rr(e), i = !Je();
	wn(() => {
		var e = t();
		e !== e && (e = Br), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Hr(e, t) {
	return t;
}
function Ur(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Nn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Wr(e, u(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, d = l.parentNode;
			on(d), d.append(l), e.items.clear();
		}
		Wr(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Wr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= le, Ln(a, document.createDocumentFragment())) : An(t[i], n);
	}
}
var Gr;
function q(e, t, n, r, i, a = null) {
	var o = e, c = /* @__PURE__ */ new Map();
	if (t & 4) {
		var l = e;
		o = C ? ke(/* @__PURE__ */ rn(l)) : l.appendChild(N());
	}
	C && Ae();
	var d = null, f = /* @__PURE__ */ pt(() => {
		var e = n();
		return s(e) ? e : e == null ? [] : u(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, qr(v, p, o, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= le, Yr(d, null, o)) : Fn(d) : Nn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: wn(() => {
			p = V(f);
			var e = p.length;
			let s = !1;
			C && Ne(o) === "[!" != (e === 0) && (o = Me(), ke(o), Oe(!1), s = !0);
			for (var l = /* @__PURE__ */ new Set(), u = A, v = sn(), y = 0; y < e; y += 1) {
				C && w.nodeType === 8 && w.data === "]" && (o = w, s = !0, Oe(!1));
				var ee = p[y], b = r(ee, y), x = h ? null : c.get(b);
				x ? (x.v && Wt(x.v, ee), x.i && Wt(x.i, y), v && u.unskip_effect(x.e)) : (x = Jr(c, h ? o : Gr ??= N(), ee, b, y, i, t, n), h || (x.e.f |= le), c.set(b, x)), l.add(b);
			}
			if (e === 0 && a && !d && (h ? d = En(() => a(o)) : (d = En(() => a(Gr ??= N())), d.f |= le)), e > l.size && Re("", "", ""), C && e > 0 && ke(Me()), !h) {
				if (m.set(u, l), v) {
					for (let [e, t] of c) l.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			s && Oe(!0), V(f);
		}),
		flags: t,
		items: c,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, C && (o = w);
}
function Kr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function qr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = Kr(e.effect.first), l, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Fn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= le, _ === c) Yr(_, null, n);
			else {
				var y = d ? d.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Xr(e, d, _), Xr(e, _, y), Yr(_, y, n), d = _, p = [], m = [], c = Kr(d.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var ee = m[0], b;
					d = ee.prev;
					var x = p[0], S = p[p.length - 1];
					for (b = 0; b < p.length; b += 1) Yr(p[b], ee, n);
					for (b = 0; b < m.length; b += 1) l.delete(m[b]);
					Xr(e, x.prev, S.next), Xr(e, d, x), Xr(e, S, ee), c = ee, d = S, --v, p = [], m = [];
				} else l.delete(_), Yr(_, c, n), Xr(e, _.prev, _.next), Xr(e, _, d === null ? e.effect.first : d.next), Xr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = Kr(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, c = Kr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Wr(e, u(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var te = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || te.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && te.push(c), c = Kr(c.next);
		var ne = te.length;
		if (ne > 0) {
			var re = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.measure();
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.fix();
			}
			Ur(e, te, re);
		}
	}
	a && Ze(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Jr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Bt(n) : /* @__PURE__ */ Vt(n, !1, !1) : null, l = o & 2 ? Bt(i) : null;
	return {
		v: c,
		i: l,
		e: En(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Yr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ an(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Xr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Zr(e, t) {
	var n = void 0, r;
	Tn(() => {
		n !== (n = t()) && (r &&= (An(r), null), n && (r = En(() => {
			xn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Qr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Qr(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function $r() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Qr(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function ei(e) {
	return typeof e == "object" ? $r(e) : e ?? "";
}
var ti = [..." 	\n\r\f\xA0\v﻿"];
function ni(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ti.includes(r[o - 1])) && (s === r.length || ti.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ri(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ii(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function ai(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ii)), i && c.push(...Object.keys(i).map(ii));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ii(e.substring(l, u).trim());
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
		return r && (n += ri(r)), i && (n += ri(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function oi(e, t, n, r, i, a) {
	var o = e[ve];
	if (C || o !== n || o === void 0) {
		var s = ni(n, r, a);
		(!C || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ve] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function si(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function ci(e, t, n, r) {
	var i = e[ye];
	if (C || i !== t) {
		var a = ai(t, r);
		(!C || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ye] = t;
	} else r && (Array.isArray(r) ? (si(e, n?.[0], r[0]), si(e, n?.[1], r[1], "important")) : si(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function li(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function ui(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || s(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = mi(c);
			li(c, r ? i.includes(l) : Xt(l, n));
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
function di(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!s(t)) return Ee();
		for (var r of e.options) r.selected = t.includes(mi(r));
		return;
	}
	for (r of e.options) if (Xt(mi(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function fi(e) {
	var t = new MutationObserver((t) => {
		t.every(hi) || ("__defaultValue" in e && ui(e, !1), "__value" in e && di(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), vn(() => {
		t.disconnect();
	});
}
function pi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	at(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), mi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && mi(o);
		}
		n(a), e.__value = a, A !== null && r.add(A);
	}), xn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = A;
			if (r.has(o)) return;
		}
		if (di(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = mi(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function mi(e) {
	return "__value" in e ? e.__value : e.value;
}
function hi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var gi = Symbol("is custom element"), _i = Symbol("is html"), vi = Ce ? "link" : "LINK";
function yi(e) {
	if (C) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					J(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					J(e, "checked", null), e.checked = r;
				}
			}
		};
		e[xe] = n, Ze(n), rt();
	}
}
function J(e, t, n, r) {
	var i = bi(e);
	C && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === vi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ge] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Si(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function bi(e) {
	return e[_e] ??= {
		[gi]: e.nodeName.includes("-"),
		[_i]: e.namespaceURI === i
	};
}
var xi = /* @__PURE__ */ new Map();
function Si(e) {
	var t = e.getAttribute("is") || e.nodeName, n = xi.get(t);
	if (n) return n;
	xi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = p(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = g(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Ci(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	at(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = wi(e) ? Ti(a) : a, n(a), A !== null && r.add(A), await lr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (C && e.defaultValue !== e.value || fr(t) == null && e.value) && (n(wi(e) ? Ti(e.value) : e.value), A !== null && r.add(A)), Cn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = A;
			if (r.has(i)) return;
		}
		wi(e) && n === Ti(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function wi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Ti(e) {
	return e === "" ? null : +e;
}
var Ei = /* @__PURE__ */ new class e {
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
function Di(e, t, n) {
	var r = Ei.observe(e, () => n(e[t]));
	xn(() => (fr(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var Oi = !1;
function ki(e) {
	var t = Oi;
	try {
		return Oi = !1, [e(), Oi];
	} finally {
		Oi = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Ai(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ ut(r), V(l)) : (c && (c = !1, s = o ? fr(r) : r), s);
	let d;
	if (a) {
		var p = pe in e || he in e;
		d = f(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = ki(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = u(), d && (i && Be(t), d(m)));
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
	a && V(y);
	var ee = B;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? V(y) : i && a ? Jt(e) : e;
			return M(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Bn && v || ee.f & 16384 ? y.v : V(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var ji = /* @__PURE__ */ H([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function Mi(e, t) {
	E(t, !0);
	var n = ji(), r = I(n, !0);
	R(() => G(r, t.messages.text)), W(e, n), D();
}
var Ni = 12;
function Pi(e) {
	return Math.max(320, e);
}
function Fi(e, t) {
	return e && t ? e / t : 1;
}
function Ii(e, t, n, r) {
	return (e - t) * r / (n || r);
}
function Li(e, t, n) {
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
function Ri(e, t, n) {
	return Math.max(0, Math.min(e + Ni, n - t));
}
function zi(e, t = 8) {
	let n = Math.max(1, Math.ceil(e / t));
	return Array.from({ length: Math.ceil(e / n) }, (e, t) => t * n);
}
function Bi(e) {
	return Math.round(e) + .5;
}
//#endregion
//#region src/lib/colors.ts
var Vi = /* @__PURE__ */ t({
	BACKGROUND_EFFORT: () => Ki,
	EFFORT_ORDER: () => Wi,
	EFFORT_SHADES: () => Yi,
	HATCH_SHADES: () => Xi,
	HATCH_TURNS: () => Zi,
	KNOWN_MODELS: () => Hi,
	SLOT_COUNT: () => 8,
	effortHatch: () => na,
	effortLabel: () => Ji,
	effortName: () => qi,
	effortRank: () => Gi,
	effortShade: () => ta,
	hatchTurn: () => ra,
	modelSlots: () => Ui,
	shade: () => ea,
	slotColor: () => $i,
	swatchFill: () => ia
}), Hi = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function Ui(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Hi.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !Hi.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var Wi = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function Gi(e) {
	let t = Wi.indexOf(e);
	return t === -1 ? Wi.length : t;
}
var Ki = "background";
function qi(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function Ji(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var Yi = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, Xi = {
	background: 1,
	ultracode: 4
}, Zi = {
	background: -45,
	ultracode: 45
};
function Qi(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function $i(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function ea(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? $i(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function ta(e, t) {
	return ea(e, Qi(Yi, t) ?? 0);
}
function na(e, t) {
	let n = Qi(Xi, t);
	return n ? ea(e, n) : null;
}
function ra(e) {
	return Qi(Zi, e);
}
function ia(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var aa = /* @__PURE__ */ t({
	ago: () => Ca,
	compact: () => Y,
	dayText: () => ga,
	duration: () => ma,
	longDay: () => va,
	longHour: () => xa,
	money: () => Z,
	parseDay: () => ha,
	parseHour: () => ya,
	percent: () => pa,
	shortDay: () => _a,
	shortHour: () => ba,
	signed: () => fa,
	when: () => Sa,
	whole: () => X
}), oa = "–", sa = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), ca = new Intl.NumberFormat("en"), la = {
	month: "short",
	day: "numeric"
}, ua = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, da = {
	hour: "2-digit",
	minute: "2-digit"
};
function Y(e) {
	return e == null ? oa : sa.format(e);
}
function fa(e) {
	return e < 0 ? `−${Y(-e)}` : `+${Y(e)}`;
}
function X(e) {
	return e == null ? oa : ca.format(e);
}
function Z(e) {
	return e == null ? oa : Math.abs(e) >= 1e3 ? "$" + sa.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function pa(e, t) {
	if (!t) return oa;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function ma(e) {
	if (e == null) return oa;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function ha(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function ga(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function _a(e, t) {
	return ha(e).toLocaleDateString(t, la);
}
function va(e, t) {
	return ha(e).toLocaleDateString(t, ua);
}
function ya(e) {
	let [t = "", n = "0"] = e.split("T"), r = ha(t);
	return r.setHours(Number(n)), r;
}
function ba(e, t) {
	return ya(e).toLocaleTimeString(t, da);
}
function xa(e, t) {
	let n = ya(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, da);
	return `${n.toLocaleDateString(t, ua)}, ${i(n)}–${i(r)}`;
}
function Sa(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...la,
		...da
	}) : oa;
}
function Ca(e, t = Date.now(), n) {
	if (!e) return oa;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : Sa(e, n);
}
//#endregion
//#region src/lib/charts.ts
var wa = /* @__PURE__ */ t({
	LIMIT_ICON: () => "⚠",
	NO_USAGE: () => La,
	RATE_LIMIT: () => Ua,
	bandIndex: () => ja,
	barShare: () => Qa,
	bucketTotals: () => Ra,
	chartSeries: () => za,
	columnPath: () => Na,
	columnTotals: () => Va,
	columnWidth: () => Ma,
	costSplit: () => Xa,
	costTop: () => Za,
	daysSince: () => Fa,
	errorText: () => Ka,
	inputTotal: () => Ta,
	limitCounts: () => qa,
	limitTop: () => Oa,
	limitType: () => Ga,
	lineX: () => ka,
	modelGroups: () => Ba,
	nearestIndex: () => Aa,
	niceMax: () => Ea,
	peakIndex: () => Pa,
	stackSegments: () => Ha,
	ticks: () => Da,
	timeBuckets: () => Ia,
	windowHitAfter: () => Ja,
	windowSpan: () => Ya
});
function Ta(e) {
	return e.new_input + e.cache_write + e.cache_read;
}
function Ea(e) {
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
function Da(e, t) {
	return Array.from({ length: t + 1 }, (n, r) => e * r / t);
}
function Oa(e) {
	return Math.max(2, Math.ceil(Ea(e) / 2) * 2);
}
function ka(e, t, n) {
	let r = e - 1;
	return (e) => r > 0 ? t + (n - t) * e / r : (t + n) / 2;
}
function Aa(e, t, n) {
	return (r) => n > 1 ? Math.round((r - e) / (t - e) * (n - 1)) : 0;
}
function ja(e, t) {
	return (n) => Math.floor((n - e) / t);
}
function Ma(e, t = 24) {
	return Math.max(2, Math.min(t, e * .6));
}
function Na(e, t, n, r, i, a = 4) {
	let o = i ? Math.min(a, n / 2, r) : 0;
	return `M${e},${t + r}V${t + o}` + (o ? `Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}` : `H${e + n}`) + `V${t + r}Z`;
}
function Pa(e) {
	return e.indexOf(Math.max(...e));
}
function Fa(e, t = /* @__PURE__ */ new Date()) {
	let n = [];
	for (let r = ha(e); r <= t; r.setDate(r.getDate() + 1)) n.push(ga(r));
	return n;
}
function Ia(e, t = /* @__PURE__ */ new Date()) {
	if (e.days !== 1 || !e.hour_model) return {
		keys: Fa(e.since, t),
		unit: "day",
		heading: "Day",
		short: _a,
		long: va,
		keyOf: (e) => e.day ?? ""
	};
	let n = e.since === ga(t) ? t.getHours() : 23, r = [];
	for (let t = 0; t <= n; t += 1) r.push(`${e.since}T${String(t).padStart(2, "0")}`);
	return {
		keys: r,
		unit: "hour",
		heading: "Hour",
		short: ba,
		long: xa,
		keyOf: (e) => e.hour ?? ""
	};
}
var La = {
	cost: 0,
	input: 0,
	output: 0
};
function Ra(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			cost: 0,
			input: 0,
			output: 0
		};
		i.cost += r.cost || 0, i.input += Ta(r), i.output += r.output, n.set(e, i);
	}
	return n;
}
function za(e, t, n) {
	let r = Ui([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${qi(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: ta(e, a.effort),
			hatch: na(e, a.effort),
			turn: ra(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : Gi(e);
	return [...i.values()].sort((e, t) => (e.slot ?? 8) - (t.slot ?? 8) || e.model.localeCompare(t.model) || a(e.effort) - a(t.effort) || String(e.effort).localeCompare(String(t.effort)));
}
function Ba(e) {
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
function Va(e, t) {
	return t.map((t) => e.reduce((e, n) => e + (n.values.get(t) ?? 0), 0));
}
function Ha(e, t, n, r = 2, i = 4) {
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
var Ua = "rate_limit", Wa = {
	five_hour: "5-hour limit",
	seven_day: "weekly limit",
	seven_day_opus: "weekly Opus limit"
};
function Ga(e) {
	return e ? Object.hasOwn(Wa, e) ? Wa[e] ?? e : e.replaceAll("_", " ") : "–";
}
function Ka(e) {
	let t = e.status ? ` (${e.status})` : "";
	return e.error === "rate_limit" ? `⚠ Rate limit${t}` : `${e.error.replaceAll("_", " ")}${t}`;
}
function qa(e, t) {
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
function Ja(e) {
	return Date.parse(e.first_hit) - Date.parse(e.start);
}
function Ya(e, t) {
	let n = new Date(e.start), r = new Date(e.resets_at), i = n.toDateString() === r.toDateString() ? r.toLocaleTimeString(t, {
		hour: "2-digit",
		minute: "2-digit"
	}) : Sa(e.resets_at, t);
	return `${Sa(e.start, t)} – ${i}`;
}
function Xa(e) {
	let t = e.cost_parts.cache_read;
	return {
		cacheRead: t,
		rest: Math.max(0, (e.cost || 0) - t)
	};
}
function Za(e) {
	return Math.max(0, ...e.map((e) => e.cost || 0)) || 1;
}
function Qa(e, t) {
	return 100 * (e || 0) / t;
}
//#endregion
//#region src/lib/bymodel.ts
var $a = {
	cost: {
		label: "Estimated cost",
		value: (e) => e.cost || 0,
		format: Z
	},
	output: {
		label: "Output tokens",
		value: (e) => e.output,
		format: Y
	},
	input: {
		label: "Input tokens",
		value: Ta,
		format: Y
	}
}, eo = Object.keys($a);
function to(e) {
	return eo.find((t) => t === e) ?? "cost";
}
var no = 248;
function ro(e, t, n = /* @__PURE__ */ new Date()) {
	let r = $a[t], i = Ia(e, n), a = za(i.unit === "hour" ? e.hour_model_effort : e.day_model_effort, i.keyOf, r.value);
	return {
		buckets: i,
		series: a,
		totals: Va(a, i.keys),
		metric: r
	};
}
function io(e, t) {
	let n = e - 8, r = (n - 56) / t;
	return {
		right: n,
		band: r,
		barWidth: Ma(r, 24)
	};
}
function ao(e, t) {
	return ja(56, io(e, t).band);
}
function oo(e, t, n) {
	let { band: r, barWidth: i } = io(e, t);
	return 56 + r * n + (r - i) / 2;
}
function so(e, t, n) {
	let r = e.filter((e) => (e.values.get(t) ?? 0) > 0), i = r.map((e) => 220 * (e.values.get(t) ?? 0) / n);
	return Ha(r.map((e) => e.model), i, 220, 2, 4).map((e) => ({
		entry: r[e.position],
		segment: e
	}));
}
function co(e) {
	let t = e.filter((e) => e.hatch).map((e, t) => ({
		id: `model-hatch-${t}`,
		entry: e
	})), n = new Map(t.map((e) => [e.entry, e.id]));
	return {
		patterns: t,
		fill: (e) => n.has(e) ? `url(#${n.get(e)})` : e.color
	};
}
function lo(e, t) {
	return `${e.label} per ${t} by model and effort level; table view available`;
}
function uo(e, t) {
	return `${e.label} per ${t}; arrow keys step through them`;
}
function fo(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${e.metric.format(e.totals[t] ?? 0)}`;
}
function po(e) {
	return Ba(e).map((e) => ({
		model: e.model,
		entries: e.entries.map((e) => ({
			entry: e,
			text: Ji(e.effort)
		}))
	}));
}
function mo(e, t) {
	return Ba(e.filter((e) => e.values.get(t))).map((e) => ({
		model: e.model,
		value: e.entries.reduce((e, n) => e + (n.values.get(t) ?? 0), 0),
		efforts: e.entries.slice().reverse().map((e) => ({
			entry: e,
			text: Ji(e.effort),
			value: e.values.get(t) ?? 0
		}))
	}));
}
function ho(e) {
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
var go = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ j(0);
	#n = /* @__PURE__ */ j(0);
	#r = $n || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return $n === this.#r ? /* @__PURE__ */ j(e) : Bt(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return V(this.#t), !1;
		}
		return V(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				V(this.#t);
				return;
			}
		}
		return V(n), super.get(e);
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
		V(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) V(n);
	}
	keys() {
		return V(this.#t), super.keys();
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
		return V(this.#n), super.size;
	}
}, _o = /* @__PURE__ */ t({
	Payload: () => vo,
	payload: () => Q,
	setPayload: () => yo
}), vo = class {
	#e = /* @__PURE__ */ j(null);
	#t = /* @__PURE__ */ j(!1);
	#n = /* @__PURE__ */ j(null);
	#r = /* @__PURE__ */ j(!1);
	#i = /* @__PURE__ */ j(null);
	#a = /* @__PURE__ */ j(null);
	#o = new go();
	get summary() {
		return V(this.#e);
	}
	get summaryFailed() {
		return V(this.#t);
	}
	get live() {
		return V(this.#n);
	}
	get liveFailed() {
		return V(this.#r);
	}
	get liveAt() {
		return V(this.#i);
	}
	get session() {
		return V(this.#a);
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
}, Q = new vo();
function yo(e) {
	Q.set(e), At();
}
//#endregion
//#region src/lib/tables.ts
var bo = /* @__PURE__ */ t({
	DEFAULT_PAGE_SIZE: () => 25,
	PAGE_SIZES: () => xo,
	SESSION_COLUMNS: () => Oo,
	TOOL_KINDS: () => jo,
	USAGE_COLUMNS: () => qo,
	byCost: () => Ko,
	chatRows: () => Wo,
	detailNoun: () => Lo,
	emptyDetail: () => Po,
	entryKey: () => Uo,
	kindLabel: () => No,
	orderedEntries: () => Ho,
	pageSizeFrom: () => To,
	pageText: () => wo,
	pageUnits: () => So,
	pageWindow: () => Co,
	sessionCells: () => ko,
	sessionCount: () => Ao,
	sessionMatches: () => Eo,
	sessionProjects: () => Do,
	toolFolds: () => Bo,
	toolRowClass: () => Ro,
	toolRowName: () => zo,
	toolRowShown: () => Vo,
	toolTableRows: () => Mo,
	toolsAndChat: () => Go,
	usageCells: () => Jo
}), xo = [
	10,
	25,
	50
];
function So(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function Co(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function wo(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function To(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function Eo(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function Do(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
var Oo = [
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
function ko(e) {
	return [
		Sa(e.last_ts),
		X(e.subagents),
		X(e.turns),
		Y(e.context_avg),
		Y(e.context_peak),
		Y(e.output),
		Z(e.cost)
	];
}
function Ao(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var jo = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function Mo(e) {
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
function No(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function Po(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var Fo = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, Io = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function Lo(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn(Io, e.tool) && Io[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(Fo, n) && Fo[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function Ro(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function zo(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: No(e, jo)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || Po(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function Bo(e) {
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
			label: `${X(a)} ${Lo(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function Vo(e, t) {
	return e.every((e) => t.has(e));
}
function Ho(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function Uo(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function Wo(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return Ho(e, t).map((e) => ({
		key: Uo(e, n.get(e) ?? 0),
		entry: e
	}));
}
function Go(e, t, n) {
	return e ? [n, t] : [t, n];
}
function Ko(e, t) {
	return (t.cost ?? -1) - (e.cost ?? -1) || t.turns - e.turns;
}
var qo = [
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
function Jo(e) {
	let t = Ta(e);
	return [
		X(e.turns),
		Y(t),
		pa(e.cache_read, t),
		Y(e.output),
		Z(e.cost)
	];
}
//#endregion
//#region src/lib/themes.ts
var Yo = /* @__PURE__ */ t({
	THEMES: () => Xo,
	themeFooter: () => ns,
	themeLabel: () => ts,
	themeName: () => $o
}), Xo = [
	"light",
	"dark",
	"hacker",
	"startup",
	"rgb"
], Zo = { techbro: "rgb" }, Qo = {
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
function $o(e) {
	if (e == null) return null;
	let t = (Object.hasOwn(Zo, e) ? Zo[e] : e) ?? e;
	return Xo.includes(t) ? t : null;
}
function es(e) {
	return e !== null && Object.hasOwn(Qo, e) ? Qo[e] ?? {} : {};
}
function ts(e, t) {
	let n = es(e);
	return Object.hasOwn(n, t) ? n[t] ?? t : t;
}
function ns(e) {
	return es(e).footer ?? "";
}
//#endregion
//#region src/lib/prefs.svelte.ts
var rs = /* @__PURE__ */ t({
	Preferences: () => ss,
	footerCopy: () => ls,
	hype: () => $,
	preferences: () => cs,
	readPreference: () => is,
	savePreference: () => as,
	savedOption: () => os
});
function is(e) {
	try {
		return localStorage.getItem(`claude-usage.${e}`);
	} catch {
		return null;
	}
}
function as(e, t) {
	try {
		localStorage.setItem(`claude-usage.${e}`, String(t));
	} catch {}
}
function os(e, t) {
	let n = is(e);
	return n !== null && t.includes(n) ? n : null;
}
var ss = class {
	#e = /* @__PURE__ */ j(Jt($o(is("theme"))));
	#t = /* @__PURE__ */ j(Jt(To(is("page_size"), xo, 25)));
	#n = /* @__PURE__ */ j(is("chat-oldest-first") === "true");
	get theme() {
		return V(this.#e);
	}
	set theme(e) {
		let t = $o(e);
		M(this.#e, t, !0), as("theme", t ?? "auto");
	}
	get pageSize() {
		return V(this.#t);
	}
	set pageSize(e) {
		xo.includes(e) && (M(this.#t, e, !0), as("page_size", String(e)));
	}
	get oldestFirst() {
		return V(this.#n);
	}
	set oldestFirst(e) {
		M(this.#n, e, !0), as("chat-oldest-first", String(e));
	}
}, cs = new ss();
function $(e) {
	return ts(cs.theme, e);
}
function ls() {
	return ns(cs.theme);
}
//#endregion
//#region src/components/ChartTooltip.svelte
var us = /* @__PURE__ */ H([[
	"div",
	{ class: "tooltip" },
	,
]]);
function ds(e, t) {
	E(t, !0);
	let n = Ai(t, "top", 3, 8);
	function r(e) {
		let r = e.parentElement?.clientWidth ?? 0;
		e.style.left = `${Ri(t.anchor, e.offsetWidth, r)}px`, e.style.top = `${n()}px`;
	}
	var i = us();
	zr(P(i), () => t.children), T(i), Zr(i, () => r), W(e, i), D();
}
//#endregion
//#region src/components/Chart.svelte
var fs = /* @__PURE__ */ H([["rect", {
	class: "hit",
	tabindex: "0",
	role: "slider",
	"aria-valuemin": "1"
}]], 4), ps = /* @__PURE__ */ H([[
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
function ms(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => (t.cursor?.count ?? 0) - 1), r = /* @__PURE__ */ j(null), i = /* @__PURE__ */ k(() => V(r) === null ? V(n) : Math.min(V(r), V(n))), a = /* @__PURE__ */ j(null), o = /* @__PURE__ */ k(() => V(a) === null || V(n) < 0 ? null : Math.min(V(a), V(n))), s = /* @__PURE__ */ k(() => t.cursor?.area(t.width));
	function c(e) {
		M(r, Math.min(Math.max(0, e), V(n)), !0), M(a, V(r), !0);
	}
	function l(e) {
		let n = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
		t.cursor && n && c(t.cursor.indexAt(t.width)(Ii(e.clientX, n.left, n.width, t.width)));
	}
	function u(e) {
		if (!t.cursor) return;
		let n = Li(e.key, V(i), t.cursor.count);
		n !== null && (c(n), e.preventDefault());
	}
	var d = ps(), f = F(d), p = P(f), m = P(p);
	zr(m, () => t.plot, () => t.width);
	var h = L(m), g = (e) => {
		var n = U();
		zr(F(n), () => t.marks ?? v, () => t.width, () => V(o)), W(e, n);
	};
	K(h, (e) => {
		V(o) !== null && e(g);
	}), T(p);
	var _ = L(p), y = (e) => {
		var n = fs();
		R((e, r) => {
			J(n, "x", V(s).x), J(n, "y", V(s).y), J(n, "width", e), J(n, "height", V(s).height), J(n, "aria-label", t.cursor.label), J(n, "aria-valuemax", t.cursor.count), J(n, "aria-valuenow", V(i) + 1), J(n, "aria-valuetext", r);
		}, [() => Math.max(1, V(s).width), () => t.cursor.valueText(V(i))]), vr("pointermove", n, l), _r("focus", n, () => c(V(i))), vr("keydown", n, u), _r("pointerleave", n, () => M(a, null)), _r("blur", n, () => M(a, null)), W(e, n);
	};
	K(_, (e) => {
		t.cursor && V(s) && V(n) >= 0 && e(y);
	}), T(f);
	var ee = L(f), b = (e) => {
		{
			let n = /* @__PURE__ */ k(() => t.cursor.tipX(t.width, V(o)) * Fi(t.containerWidth, t.width));
			ds(e, {
				get anchor() {
					return V(n);
				},
				get top() {
					return t.tipTop;
				},
				children: (e, n) => {
					var r = U();
					zr(F(r), () => t.tip, () => V(o)), W(e, r);
				},
				$$slots: { default: !0 }
			});
		}
	};
	K(ee, (e) => {
		t.cursor && V(o) !== null && t.tip && e(b);
	}), R(() => {
		J(f, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), J(f, "height", t.height), J(p, "aria-label", t.label);
	}), W(e, d), D();
}
yr(["pointermove", "keydown"]);
//#endregion
//#region src/components/ChartCard.svelte
var hs = /* @__PURE__ */ H([[
	"span",
	{ class: "muted" },
	" "
]]), gs = /* @__PURE__ */ H([[
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
function _s(e, t) {
	let n = /* @__PURE__ */ j(!1);
	var r = gs(), i = P(r), a = P(i), o = I(a, !0), s = L(a, 2), c = (e) => {
		var n = hs(), r = I(n, !0);
		R(() => G(r, t.note)), W(e, n);
	};
	K(s, (e) => {
		t.note && e(c);
	});
	var l = L(s, 2);
	zr(l, () => t.controls ?? v);
	var u = L(l, 4);
	T(i);
	var d = L(i, 2);
	zr(d, () => t.legend ?? v);
	var f = L(d, 2);
	zr(f, () => t.chart);
	var p = L(f, 2), m = (e) => {
		var n = U();
		zr(F(n), () => t.table), W(e, n);
	};
	K(p, (e) => {
		V(n) && e(m);
	}), zr(L(p, 2), () => t.extra ?? v), T(r), R(() => {
		J(r, "aria-labelledby", `${t.id ?? ""}-title`), J(a, "id", `${t.id ?? ""}-title`), G(o, t.title), J(u, "id", `${t.id ?? ""}-table-toggle`), J(u, "aria-pressed", V(n));
	}), vr("click", u, () => M(n, !V(n))), W(e, r);
}
yr(["click"]);
//#endregion
//#region src/components/Swatch.svelte
var vs = /* @__PURE__ */ H([["span", { class: "swatch" }]]);
function ys(e, t) {
	var n = vs();
	let r;
	R(() => r = ci(n, "", r, { background: t.fill })), W(e, n);
}
//#endregion
//#region src/lib/scroll.ts
var bs = /* @__PURE__ */ t({
	keepScroll: () => Ss,
	scrollAnchor: () => xs
});
function xs(e) {
	for (let t of e) {
		let e = t.getBoundingClientRect();
		if (e.bottom > 0) return {
			node: t,
			top: e.top
		};
	}
	return null;
}
function Ss(e, t) {
	e && t && t.isConnected && window.scrollBy(0, t.getBoundingClientRect().top - e.top);
}
//#endregion
//#region src/components/Pager.svelte
var Cs = /* @__PURE__ */ H([[
	"option",
	null,
	" "
]]), ws = /* @__PURE__ */ H([[
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
function Ts(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => (t.units.at(-1) ?? -1) + 1), r = /* @__PURE__ */ k(() => ks(t.key, V(n))), i = /* @__PURE__ */ k(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function a() {
		Os.first(t.key) !== V(r).first && Os.set(t.key, V(r).first);
	}
	a();
	function o(e, r) {
		let i = e.closest(".pager"), a = xs(i ? [i] : []);
		Os.set(t.key, Co(V(n), cs.pageSize, r).first), At(), Ss(a, i);
	}
	function s(e, t) {
		let n = e.closest(".pager"), r = xs(n ? [n] : []);
		cs.pageSize = t, At(), Ss(r, n);
	}
	function c() {
		let { first: e, last: n } = V(r);
		t.rows?.forEach((r, i) => {
			let a = t.units[i];
			a !== void 0 && r.classList.toggle("off-page", a < e || a >= n);
		});
	}
	var l = ws(), u = P(l);
	q(u, 20, () => xo, (e) => e, (e, n) => {
		var r = Cs(), i = I(r), a = {};
		R(() => {
			G(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), W(e, r);
	}), T(u);
	var d;
	fi(u);
	var f = L(u, 2), p = L(f, 2), m = I(p, !0), h = L(p, 2);
	T(l), Zr(l, () => c), R((e) => {
		J(u, "id", `pager-${t.key ?? ""}-size`), J(u, "aria-label", `${V(i) ?? ""} per page`), d !== (d = cs.pageSize) && (u.value = (u.__value = d) ?? "", di(u, d)), J(f, "id", `pager-${t.key ?? ""}-previous`), f.disabled = V(r).page === 0, G(m, e), J(h, "id", `pager-${t.key ?? ""}-next`), h.disabled = V(r).page === V(r).pages - 1;
	}, [() => wo(V(r), V(n), t.noun)]), vr("change", u, (e) => s(e.currentTarget, Number(e.currentTarget.value))), vr("click", f, (e) => o(e.currentTarget, V(r).page - 1)), vr("click", h, (e) => o(e.currentTarget, V(r).page + 1)), W(e, l), D();
}
yr(["change", "click"]);
//#endregion
//#region src/lib/paging.svelte.ts
var Es = /* @__PURE__ */ t({
	TablePages: () => Ds,
	mountPager: () => js,
	releaseDetachedPagers: () => Ms,
	shownWindow: () => ks,
	tablePages: () => Os
}), Ds = class {
	#e = new go();
	first(e) {
		return this.#e.get(e) ?? 0;
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	forget(e) {
		this.#e.delete(e);
	}
}, Os = new Ds();
function ks(e, t) {
	return Co(t, cs.pageSize, Math.floor(Os.first(e) / cs.pageSize));
}
var As = /* @__PURE__ */ new Set();
function js(e) {
	let t = document.createElement("div"), n = Nr(Ts, {
		target: t,
		props: e
	});
	At();
	let r = t.firstElementChild;
	if (!(r instanceof HTMLElement)) throw Error("The pager drew no element");
	return As.add({
		component: n,
		root: r
	}), r;
}
function Ms() {
	for (let e of [...As]) e.root.isConnected || (As.delete(e), Lr(e.component));
}
//#endregion
//#region src/components/TableView.svelte
var Ns = /* @__PURE__ */ H([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), Ps = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	" "
]]), Fs = /* @__PURE__ */ H([[
	"th",
	{ scope: "col" },
	" "
]]), Is = /* @__PURE__ */ H([[
	"tr",
	null,
	,
]]), Ls = /* @__PURE__ */ H([[
	"table",
	null,
	[
		"thead",
		null,
		["tr"]
	],
	["tbody"]
]]), Rs = /* @__PURE__ */ H([
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
function zs(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = U(), o = F(n), s = (e) => {
			Ts(e, {
				get key() {
					return t.key;
				},
				get noun() {
					return r();
				},
				get units() {
					return V(i);
				}
			});
		};
		K(o, (e) => {
			V(a) > xo[0] && e(s);
		}), W(e, n);
	}, r = Ai(t, "noun", 3, "rows"), i = /* @__PURE__ */ k(() => So(t.rows.map((e) => t.sub?.(e) ?? !1))), a = /* @__PURE__ */ k(() => (V(i).at(-1) ?? -1) + 1), o = /* @__PURE__ */ k(() => ks(t.key, V(a))), s = /* @__PURE__ */ k(() => t.rows.filter((e, t) => {
		let n = V(i)[t] ?? 0;
		return n >= V(o).first && n < V(o).last;
	}));
	var c = Rs(), l = F(c), u = (e) => {
		var r = U(), i = F(r), o = (e) => {
			var r = Ns(), i = P(r);
			zr(i, () => t.heading);
			var a = L(i, 2);
			n(a), T(r), W(e, r);
		}, s = (e) => {
			var n = U();
			zr(F(n), () => t.heading), W(e, n);
		};
		K(i, (e) => {
			V(a) > xo[0] ? e(o) : e(s, -1);
		}), W(e, r);
	};
	K(l, (e) => {
		t.heading && e(u);
	});
	var d = L(l, 2);
	zr(d, () => t.intro ?? v);
	var f = L(d, 2), p = P(f), m = (e) => {
		n(e);
	};
	K(p, (e) => {
		t.heading || e(m);
	});
	var h = L(p, 2), g = (e) => {
		var n = Ps(), r = I(n, !0);
		R(() => G(r, t.empty)), W(e, n);
	}, _ = (e) => {
		var n = Ls(), r = P(n), i = P(r);
		q(i, 21, () => t.columns, (e) => e.label, (e, t) => {
			var n = Fs(), r = I(n, !0);
			R(() => {
				oi(n, 1, ei(V(t).numeric ? "num" : void 0)), J(n, "title", V(t).title), G(r, V(t).label);
			}), W(e, n);
		}), T(i), T(r);
		var a = L(r);
		q(a, 21, () => V(s), (e) => t.rowKey(e), (e, n) => {
			var r = Is();
			zr(P(r), () => t.cells, () => V(n)), T(r), R((e) => oi(r, 1, e), [() => ei([t.sub?.(V(n)) ? "sub-row" : t.group?.(V(n)) ? "group-row" : void 0, t.rowClass?.(V(n))])]), W(e, r);
		}), T(a), T(n), R(() => J(n, "aria-labelledby", t.labelledby)), W(e, n);
	};
	K(h, (e) => {
		t.rows.length === 0 && t.empty !== void 0 ? e(g) : e(_, -1);
	}), T(f), W(e, c), D();
}
//#endregion
//#region src/components/XLabels.svelte
var Bs = /* @__PURE__ */ H([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4);
function Vs(e, t) {
	E(t, !0);
	var n = U();
	q(F(n), 16, () => zi(t.count, t.most), (e) => e, (e, n) => {
		var r = Bs(), i = I(r, !0);
		R((e, n) => {
			J(r, "x", e), J(r, "y", t.y), G(i, n);
		}, [() => t.xOf(n), () => t.text(n)]), W(e, r);
	}), W(e, n), D();
}
//#endregion
//#region src/components/YAxis.svelte
var Hs = /* @__PURE__ */ H([["line", { "stroke-width": "1" }], [
	"text",
	{
		"text-anchor": "end",
		class: "axis-text"
	},
	" "
]], 5);
function Us(e, t) {
	E(t, !0);
	var n = U();
	q(F(n), 18, () => t.values, (e) => e, (e, n, r) => {
		let i = /* @__PURE__ */ k(() => Bi(t.yOf(n)));
		var a = Hs(), o = F(a), s = L(o), c = I(s, !0);
		R((e) => {
			J(o, "x1", t.left), J(o, "x2", t.right), J(o, "y1", V(i)), J(o, "y2", V(i)), J(o, "stroke", V(r) === 0 ? "var(--axis)" : "var(--grid)"), J(s, "x", t.left - 8), J(s, "y", V(i) + 4), G(c, e);
		}, [() => t.format(n)]), W(e, a);
	}), W(e, n), D();
}
//#endregion
//#region src/components/ByModel.svelte
var Ws = /* @__PURE__ */ H([[
	"button",
	{ type: "button" },
	" "
]]), Gs = /* @__PURE__ */ H([["div", {
	class: "segmented",
	role: "group",
	"aria-label": "Metric"
}]]), Ks = /* @__PURE__ */ H([[
	"span",
	null,
	,
	" "
]]), qs = /* @__PURE__ */ H([[
	"span",
	{ class: "legend-group" },
	[
		"strong",
		null,
		" "
	],
	" ",
	,
]]), Js = /* @__PURE__ */ H([[
	"div",
	{ class: "legend" },
	,
]]), Ys = /* @__PURE__ */ H([[
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
]], 4), Xs = /* @__PURE__ */ H([["defs"]], 4), Zs = /* @__PURE__ */ H([["path"]], 4), Qs = /* @__PURE__ */ H([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), $s = /* @__PURE__ */ H([
	,
	,
	,
], 5), ec = /* @__PURE__ */ H([
	,
	,
	,
	,
	,
], 5), tc = /* @__PURE__ */ H([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), nc = /* @__PURE__ */ H([[
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
]]), rc = /* @__PURE__ */ H([
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
], 1), ic = /* @__PURE__ */ H([[
	"div",
	{ class: "name" },
	"No usage"
]]), ac = /* @__PURE__ */ H([[
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
]]), oc = /* @__PURE__ */ H([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	,
], 1), sc = /* @__PURE__ */ H([[
	"div",
	{ class: "chart" },
	,
]]), cc = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), lc = /* @__PURE__ */ H([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function uc(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Gs();
		q(t, 20, () => eo, (e) => e, (e, t) => {
			var n = Ws(), r = I(n, !0);
			R(() => {
				J(n, "aria-pressed", V(s) === t), G(r, $a[t].label);
			}), vr("click", n, () => _(t)), W(e, n);
		}), T(t), W(e, t);
	}, r = (e) => {
		var t = Js(), n = P(t), r = (e) => {
			var t = U();
			q(F(t), 17, () => po(V(c).series), (e) => e.model, (e, t) => {
				var n = qs(), r = P(n), i = I(r, !0);
				q(L(r, 2), 17, () => V(t).entries, ({ entry: e, text: t }) => e.key, (e, t) => {
					let n = () => V(t).entry, r = () => V(t).text;
					var i = Ks(), a = P(i);
					{
						let e = /* @__PURE__ */ k(() => ia(n().color, n().hatch, n().turn));
						ys(a, { get fill() {
							return V(e);
						} });
					}
					var o = L(a, 1, !0);
					T(i), R(() => G(o, r())), W(e, i);
				}), T(n), R(() => G(i, V(t).model)), W(e, n);
			}), W(e, t);
		};
		K(n, (e) => {
			V(c) && e(r);
		}), T(t), W(e, t);
	}, i = (e) => {
		var t = sc(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => io(t(), V(a).length)), r = /* @__PURE__ */ k(() => Pa(V(c).totals));
				var s = ec(), l = F(s), d = (e) => {
					var t = Xs();
					q(t, 21, () => V(u).patterns, ({ id: e, entry: t }) => e, (e, t) => {
						let n = () => V(t).id, r = () => V(t).entry;
						var i = Ys(), a = P(i), o = L(a);
						T(i), R(() => {
							J(i, "id", n()), J(i, "patternTransform", `rotate(${r().turn ?? ""})`), J(a, "fill", r().color), J(o, "fill", r().hatch);
						}), W(e, i);
					}), T(t), W(e, t);
				};
				K(l, (e) => {
					V(u).patterns.length && e(d);
				});
				var p = L(l);
				{
					let e = /* @__PURE__ */ k(() => Da(V(f), 4));
					Us(p, {
						get left() {
							return 56;
						},
						get right() {
							return V(n).right;
						},
						get values() {
							return V(e);
						},
						yOf: (e) => 220 - 220 * e / V(f),
						get format() {
							return V(o);
						}
					});
				}
				var m = L(p);
				{
					let e = /* @__PURE__ */ k(() => 238);
					Vs(m, {
						get count() {
							return V(a).length;
						},
						xOf: (e) => 56 + V(n).band * (e + .5),
						get y() {
							return V(e);
						},
						text: (e) => V(i).short(V(a)[e] ?? "")
					});
				}
				q(L(m), 18, () => V(a), (e) => e, (e, i, s) => {
					let l = /* @__PURE__ */ k(() => oo(t(), V(a).length, V(s)));
					var d = $s(), p = F(d);
					q(p, 17, () => so(V(c).series, i, V(f)), ({ entry: e, segment: t }) => e.key, (e, t) => {
						let r = () => V(t).entry, i = () => V(t).segment;
						var a = Zs();
						R((e, t) => {
							J(a, "d", e), J(a, "fill", t);
						}, [() => Na(V(l), i().y, V(n).barWidth, i().height, i().top), () => V(u).fill(r())]), W(e, a);
					});
					var m = L(p), h = (e) => {
						let t = /* @__PURE__ */ k(() => V(c).totals[V(s)] ?? 0);
						var r = Qs(), i = I(r, !0);
						R((e) => {
							J(r, "x", V(l) + V(n).barWidth / 2), J(r, "y", 220 - 220 * V(t) / V(f) - 6), G(i, e);
						}, [() => V(o)(V(t))]), W(e, r);
					};
					K(m, (e) => {
						V(s) === V(r) && (V(c).totals[V(s)] ?? 0) > 0 && e(h);
					}), W(e, d);
				}), W(e, s);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ k(() => io(t(), V(a).length).band);
				var i = tc();
				R(() => {
					J(i, "x", 56 + V(r) * n()), J(i, "width", V(r)), J(i, "height", 220);
				}), W(e, i);
			}, r = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => V(a)[t()] ?? ""), r = /* @__PURE__ */ k(() => mo(V(c).series, V(n)));
				var s = oc(), l = F(s), u = I(l, !0), d = L(l, 2);
				q(d, 17, () => V(r), (e) => e.model, (e, t) => {
					var n = rc(), r = F(n), i = P(r), a = I(i, !0), s = I(L(i), !0);
					T(r), q(L(r, 2), 17, () => V(t).efforts, ({ entry: e, text: t, value: n }) => e.key, (e, t) => {
						let n = () => V(t).entry, r = () => V(t).text, i = () => V(t).value;
						var a = nc(), s = P(a), c = P(s);
						{
							let e = /* @__PURE__ */ k(() => ia(n().color, n().hatch, n().turn));
							ys(c, { get fill() {
								return V(e);
							} });
						}
						var l = L(c, 1, !0);
						T(s);
						var u = I(L(s, 2), !0);
						T(a), R((e) => {
							G(l, r()), G(u, e);
						}, [() => V(o)(i())]), W(e, a);
					}), R((e) => {
						G(a, V(t).model), G(s, e);
					}, [() => V(o)(V(t).value)]), W(e, n);
				}, (e) => {
					W(e, ic());
				});
				var f = L(d, 2), p = (e) => {
					var n = ac(), r = I(L(P(n)), !0);
					T(n), R((e) => G(r, e), [() => V(o)(V(c).totals[t()] ?? 0)]), W(e, n);
				};
				K(f, (e) => {
					V(r).length > 1 && e(p);
				}), R((e) => G(u, e), [() => V(i).long(V(n))]), W(e, s);
			}, i = /* @__PURE__ */ k(() => V(c).buckets), a = /* @__PURE__ */ k(() => V(i).keys), o = /* @__PURE__ */ k(() => V(c).metric.format);
			{
				let i = /* @__PURE__ */ k(() => lo(V(c).metric, V(l)));
				ms(e, {
					get height() {
						return no;
					},
					get label() {
						return V(i);
					},
					get width() {
						return V(h);
					},
					get containerWidth() {
						return V(m);
					},
					get cursor() {
						return V(g);
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
		K(n, (e) => {
			V(c) && V(u) && e(r);
		}), T(t), Di(t, "clientWidth", (e) => M(m, e)), W(e, t);
	}, a = (e) => {
		var t = U(), n = F(t), r = (e) => {
			let t = (e, t = v) => {
				var r = lc(), i = F(r), a = I(i, !0);
				q(L(i, 2), 18, () => V(n).others, (e) => e, (e, n, r) => {
					var i = cc(), a = I(i, !0);
					R(() => G(a, t().cells[V(r) + 1])), W(e, i);
				}), R(() => G(a, t().cells[0])), W(e, r);
			}, n = /* @__PURE__ */ k(() => {
				let [e = "", ...t] = V(p).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let r = /* @__PURE__ */ k(() => [{ label: V(n).first }, ...V(n).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				zs(e, {
					key: "chart-table",
					get columns() {
						return V(r);
					},
					get rows() {
						return V(p).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return t;
					}
				});
			}
		};
		K(n, (e) => {
			V(p) && e(r);
		}), W(e, t);
	}, o = /* @__PURE__ */ k(() => Q.summary), s = /* @__PURE__ */ j(Jt(to(is("metric")))), c = /* @__PURE__ */ k(() => V(o) ? ro(V(o), V(s)) : null), l = /* @__PURE__ */ k(() => V(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ k(() => V(c) ? co(V(c).series) : null), d = /* @__PURE__ */ k(() => V(o) ? V(l) === "hour" ? $("Per hour, by model and effort") : $("Per day, by model and effort") : $("Per day, by model")), f = /* @__PURE__ */ k(() => Ea(Math.max(...V(c)?.totals ?? [], 0))), p = /* @__PURE__ */ k(() => V(c) ? ho(V(c)) : null), m = /* @__PURE__ */ j(0), h = /* @__PURE__ */ k(() => Pi(V(m))), g = /* @__PURE__ */ k(() => V(c) ? {
		count: V(c).buckets.keys.length,
		label: uo(V(c).metric, V(l)),
		valueText: (e) => fo(V(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: io(e, V(c).buckets.keys.length).right - 56,
			height: 220
		}),
		indexAt: (e) => ao(e, V(c).buckets.keys.length),
		tipX: (e, t) => 56 + io(e, V(c).buckets.keys.length).band * (t + .5)
	} : null);
	function _(e) {
		M(s, e, !0), as("metric", e);
	}
	_s(e, {
		id: "chart",
		get title() {
			return V(d);
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
yr(["click"]);
//#endregion
//#region src/lib/costly.ts
var dc = [{
	label: "Cache reads",
	color: "var(--split-soft)",
	value: (e) => Xa(e).cacheRead
}, {
	label: "Everything else",
	color: "var(--split-strong)",
	note: "new input, cache writes, output and web searches",
	value: (e) => Xa(e).rest
}];
function fc(e) {
	return e.note ? `${e.label} (${e.note})` : e.label;
}
function pc(e) {
	return e.title || "Untitled session";
}
function mc(e) {
	return `#session/${encodeURIComponent(e.session_id)}`;
}
function hc(e) {
	let t = Za(e);
	return e.map((e) => {
		let n = pc(e), r = dc.map((t) => ({
			part: t,
			amount: t.value(e)
		})), i = r.map(({ part: e, amount: t }) => `${e.label} ${Z(t)}`).join(", ");
		return {
			session: e,
			title: n,
			href: mc(e),
			detail: `${e.project} · ${X(e.turns)} turns · avg context ${Y(e.context_avg)}`,
			share: Qa(e.cost, t),
			cost: Z(e.cost),
			parts: r,
			label: `${n}: ${Z(e.cost)}; ${i}`
		};
	});
}
function gc(e) {
	let { session: t } = e;
	return {
		title: e.title,
		parts: e.parts.map(({ part: e, amount: n }) => ({
			label: e.label,
			color: e.color,
			amount: Z(n),
			share: pa(n, t.cost || 0)
		})),
		total: e.cost,
		context: `${X(t.turns)} turns · context avg ${Y(t.context_avg)}, peak ${Y(t.context_peak)}`
	};
}
function _c(e) {
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
			...dc.map((e) => ({
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
				X(e.turns),
				Y(e.context_avg),
				Y(e.context_peak),
				...dc.map((t) => Z(t.value(e))),
				Z(e.cost)
			]
		}))
	};
}
//#endregion
//#region src/components/CostPerSession.svelte
var vc = /* @__PURE__ */ H([[
	"span",
	null,
	,
	" "
]]), yc = /* @__PURE__ */ H([[
	"div",
	{ class: "legend" },
	,
]]), bc = /* @__PURE__ */ H([["span"]]), xc = /* @__PURE__ */ H([[
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
]]), Sc = /* @__PURE__ */ H([[
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
]]), Cc = /* @__PURE__ */ H([
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
], 1), wc = /* @__PURE__ */ H([
	["div", { class: "bars" }],
	" ",
	,
], 1), Tc = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	"No sessions in this range."
]]), Ec = /* @__PURE__ */ H([[
	"div",
	{ class: "chart" },
	,
]]), Dc = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), Oc = /* @__PURE__ */ H([
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
function kc(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = yc(), n = P(t), r = (e) => {
			var t = U();
			q(F(t), 17, () => dc, (e) => e.label, (e, t) => {
				var n = vc(), r = P(n);
				ys(r, { get fill() {
					return V(t).color;
				} });
				var i = L(r, 1, !0);
				T(n), R((e) => G(i, e), [() => fc(V(t))]), W(e, n);
			}), W(e, t);
		};
		K(n, (e) => {
			V(a) && e(r);
		}), T(t), W(e, t);
	}, r = (e) => {
		var t = Ec(), n = P(t), r = (e) => {
			var t = U(), n = F(t), r = (e) => {
				var t = wc(), n = F(t);
				q(n, 21, () => V(s), (e) => e.session.session_id, (e, t) => {
					var n = xc(), r = P(n), i = P(r), a = I(i, !0), o = I(L(i), !0);
					T(r);
					var s = L(r, 2), c = P(s);
					let l;
					q(c, 21, () => V(t).parts, ({ part: e, amount: t }) => e.label, (e, t) => {
						let n = () => V(t).part, r = () => V(t).amount;
						var i = U(), a = F(i), o = (e) => {
							var t = bc();
							let i;
							R(() => i = ci(t, "", i, {
								"flex-grow": r(),
								background: n().color
							})), W(e, t);
						};
						K(a, (e) => {
							r() > 0 && e(o);
						}), W(e, i);
					}), T(c), T(s);
					var u = I(L(s, 2), !0);
					T(n), R((e) => {
						J(n, "href", V(t).href), J(n, "aria-label", V(t).label), G(a, V(t).title), G(o, V(t).detail), l = ci(c, "", l, { width: e }), G(u, V(t).cost);
					}, [() => `${V(t).share.toFixed(2) ?? ""}%`]), vr("pointermove", n, (e) => p(e, V(t).session.session_id)), _r("focus", n, (e) => p(e, V(t).session.session_id)), _r("pointerleave", n, m), _r("blur", n, m), W(e, n);
				}), T(n);
				var r = L(n, 2), i = (e) => {
					ds(e, {
						get anchor() {
							return V(u).anchor;
						},
						get top() {
							return V(u).top;
						},
						children: (e, t) => {
							var n = Cc(), r = F(n), i = I(r, !0), a = L(r, 2);
							q(a, 17, () => V(f).parts, (e) => e.label, (e, t) => {
								var n = Sc(), r = P(n);
								ys(r, { get fill() {
									return V(t).color;
								} });
								var i = L(r), a = I(i, !0), o = I(L(i));
								T(n), R(() => {
									G(a, V(t).amount), G(o, `${V(t).label ?? ""} · ${V(t).share ?? ""}`);
								}), W(e, n);
							});
							var o = L(a, 2), s = P(o);
							ys(s, { fill: null });
							var c = I(L(s), !0);
							je(), T(o);
							var l = I(L(o, 2), !0);
							R(() => {
								G(i, V(f).title), G(c, V(f).total), G(l, V(f).context);
							}), W(e, n);
						},
						$$slots: { default: !0 }
					});
				};
				K(r, (e) => {
					V(u) && V(f) && e(i);
				}), W(e, t);
			}, i = (e) => {
				W(e, Tc());
			};
			K(n, (e) => {
				V(s).length ? e(r) : e(i, -1);
			}), W(e, t);
		};
		K(n, (e) => {
			V(a) && e(r);
		}), T(t), W(e, t);
	}, i = (e) => {
		var t = U(), n = F(t), r = (e) => {
			let t = (e, t = v) => {
				var r = Oc(), i = F(r), a = P(i), o = I(a, !0), s = I(L(a), !0);
				T(i), q(L(i, 2), 19, () => V(n), (e) => e.label, (e, n, r) => {
					var i = Dc(), a = I(i, !0);
					R(() => G(a, t().cells[V(r)])), W(e, i);
				}), R((e, n) => {
					J(a, "href", e), G(o, n), G(s, t().session.project);
				}, [() => mc(t().session), () => pc(t().session)]), W(e, r);
			}, n = /* @__PURE__ */ k(() => V(c).head.slice(1));
			zs(e, {
				key: "costly-table",
				get columns() {
					return V(c).head;
				},
				get rows() {
					return V(c).rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return t;
				}
			});
		};
		K(n, (e) => {
			V(a) && e(r);
		}), W(e, t);
	}, a = /* @__PURE__ */ k(() => Q.summary), o = /* @__PURE__ */ k(() => V(a)?.costly_sessions ?? []), s = /* @__PURE__ */ k(() => hc(V(o))), c = /* @__PURE__ */ k(() => _c(V(o))), l = /* @__PURE__ */ k(() => $("Cost per session")), u = /* @__PURE__ */ j(null), d = /* @__PURE__ */ k(() => V(u) ? V(s).find((e) => e.session.session_id === V(u)?.id) : void 0), f = /* @__PURE__ */ k(() => V(d) ? gc(V(d)) : null);
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
	_s(e, {
		id: "costly",
		get title() {
			return V(l);
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
yr(["pointermove"]);
//#endregion
//#region src/lib/compact.ts
var Ac = /* @__PURE__ */ t({
	PAYOFF_WORDS: () => jc,
	compactCallKind: () => Ic,
	compactionTotal: () => zc,
	delegateCallShown: () => Lc,
	payoffAhead: () => Pc,
	payoffText: () => Fc,
	payoffTone: () => Nc,
	spread: () => Mc,
	verdictTone: () => Rc
}), jc = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function Mc(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function Nc(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function Pc(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${X(t.pays_later_in)} replies`;
		return `${jc.later}: growing at its recent pace, the context reaches about ${Y(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = X(Math.round(t.calls_ahead));
	return `${jc[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function Fc(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${Z(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${X(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : X(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${X(e.breakeven_low)} replies)` : `would pay off after about ${X(e.breakeven_calls)} replies` + Mc(r(e.breakeven_low), r(e.breakeven_high));
}
function Ic(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function Lc(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function Rc(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function zc(e) {
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
var Bc = /* @__PURE__ */ t({
	liveCompactBadge: () => Kc,
	liveEmpty: () => Uc,
	livePastDay: () => Vc,
	liveSecretBadge: () => Gc,
	liveStateBadges: () => qc,
	liveWaitBadge: () => Wc,
	liveWindow: () => Hc,
	sessionWaits: () => Jc,
	waitChanged: () => Yc
});
function Vc(e, t) {
	return e.days === 1 && e.until && e.until !== t ? e.until : null;
}
function Hc(e, t) {
	let n = Vc(e, t), r = e.agent_minutes > e.minutes ? ` (${e.agent_minutes} min while agents work)` : "", i = e.sessions.some((e) => e.waiting) ? " or waiting for you" : "", a = n ? `, active on ${va(n)}` : "";
	return `· changed in the last ${e.minutes} min${r}${i}${a}`;
}
function Uc(e, t) {
	let n = Vc(e, t);
	return n ? `No live session was active on ${va(n)}.` : `No session active in the last ${e.minutes} minutes.`;
}
function Wc(e) {
	if (!e) return null;
	let t = ` since ${Sa(e.since)}`;
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
function Gc(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${X(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${X(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function Kc(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${Y(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = Nc(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if (Ic({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${Z(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${X(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${jc[l]}: compacting now ${m}, ~${X(Math.round(f))} ahead on average.`);
}
function qc(e, t) {
	return [Gc(e.secrets), Kc(e.current, t)].filter((e) => e !== null);
}
function Jc(e, t) {
	let n = Wc(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : Wc(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function Yc(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/components/LiveIcon.svelte
var Xc = /* @__PURE__ */ H([
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
], 5), Zc = /* @__PURE__ */ H([
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
], 5), Qc = /* @__PURE__ */ H([
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
], 5), $c = /* @__PURE__ */ H([
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
], 5), el = /* @__PURE__ */ H([[
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
function tl(e, t) {
	E(t, !0);
	var n = el(), r = P(n), i = P(r), a = (e) => {
		var t = Xc();
		je(3), W(e, t);
	}, o = (e) => {
		var t = Zc();
		je(2), W(e, t);
	}, s = (e) => {
		var t = Qc();
		je(5), W(e, t);
	}, c = (e) => {
		var t = $c();
		je(3), W(e, t);
	};
	K(i, (e) => {
		t.badge.kind === "permission" ? e(a) : t.badge.kind === "waiting" ? e(o, 1) : t.badge.kind === "secret" ? e(s, 2) : e(c, -1);
	}), T(r), T(n), R(() => {
		oi(n, 1, ei([
			"live-icon",
			`live-icon-${t.badge.kind}`,
			t.badge.tone && `live-icon-${t.badge.tone}`
		])), J(n, "aria-label", t.badge.text), J(n, "title", t.badge.text);
	}), W(e, n), D();
}
//#endregion
//#region src/components/LiveCard.svelte
var nl = /* @__PURE__ */ H([[
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
]]), rl = /* @__PURE__ */ H([[
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
]]), il = /* @__PURE__ */ H([["ul"]]), al = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	"No subagent running"
]]), ol = /* @__PURE__ */ H([[
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
function sl(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Wc(t.session.waiting)), r = /* @__PURE__ */ k(() => t.sessionState ? qc(t.sessionState, new Date(t.now).toISOString()) : []), i = /* @__PURE__ */ k(() => [
		{
			label: "Turns",
			value: X(t.session.turns)
		},
		{
			label: "Output",
			value: Y(t.session.output)
		},
		{
			label: "Last context",
			value: Y(t.session.last_context)
		},
		{
			label: "Cost",
			value: Z(t.session.cost)
		}
	]);
	var a = ol(), o = P(a), s = P(o), c = L(P(s)), l = I(c, !0);
	T(s);
	var u = L(s, 2), d = (e) => {
		tl(e, { get badge() {
			return V(n);
		} });
	};
	K(u, (e) => {
		V(n) && e(d);
	});
	var f = L(u, 2);
	q(f, 21, () => V(r), (e) => e.kind, (e, t) => {
		tl(e, { get badge() {
			return V(t);
		} });
	}), T(f), T(o);
	var p = L(o, 2), m = I(p), h = L(p, 2);
	q(h, 21, () => V(i), (e) => e.label, (e, t) => {
		var n = nl(), r = P(n), i = I(r, !0), a = I(L(r), !0);
		T(n), R(() => {
			G(i, V(t).label), G(a, V(t).value);
		}), W(e, n);
	}), T(h);
	var g = L(h, 2), _ = (e) => {
		var n = il();
		q(n, 21, () => t.session.subagents, (e) => e.agent_id, (e, n) => {
			var r = rl(), i = P(r), a = I(i, !0), o = L(i, 2), s = I(o, !0), c = I(L(o));
			T(r), R((e, t, r) => {
				G(a, V(n).agent_type), G(s, V(n).description || ""), G(c, `${(V(n).model || "–") ?? ""} · ${e ?? ""} turns · context ${t ?? ""} · ${r ?? ""}`);
			}, [
				() => X(V(n).turns),
				() => Y(V(n).last_context),
				() => Ca(V(n).last_activity, t.now)
			]), W(e, r);
		}), T(n), W(e, n);
	}, v = (e) => {
		W(e, al());
	};
	K(g, (e) => {
		t.session.subagents.length ? e(_) : e(v, -1);
	}), T(a), R((e, n, r) => {
		J(c, "href", e), G(l, n), G(m, `${t.session.project ?? ""}${t.session.git_branch ? ` · ${t.session.git_branch}` : ""} · ${r ?? ""}`);
	}, [
		() => mc(t.session),
		() => pc(t.session),
		() => Ca(t.session.last_activity, t.now)
	]), W(e, a), D();
}
//#endregion
//#region src/components/LiveSessions.svelte
var cl = /* @__PURE__ */ H([[
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
]]), ll = /* @__PURE__ */ H([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), ul = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	" "
]]), dl = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	" "
]]), fl = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	" "
]]), pl = /* @__PURE__ */ H([["div", { class: "live-grid" }]]), ml = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	" "
]]), hl = /* @__PURE__ */ H([
	,
	,
	" ",
	,
	" ",
	,
], 1), gl = /* @__PURE__ */ H([[
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
function _l(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = cl(), n = P(t), r = I(n, !0), a = I(L(n, 2), !0);
		T(t), R((e, t) => {
			G(r, e), G(a, t);
		}, [() => $("Live sessions"), () => V(i) ? Hc(V(i), V(o)) : ""]), W(e, t);
	}, r = "live", i = /* @__PURE__ */ k(() => Q.live), a = /* @__PURE__ */ k(() => Q.liveAt ?? Date.now()), o = /* @__PURE__ */ k(() => ga(new Date(V(a)))), s = /* @__PURE__ */ k(() => V(i)?.sessions ?? []), c = /* @__PURE__ */ k(() => So(V(s).map(() => !1))), l = /* @__PURE__ */ k(() => V(s).length), u = /* @__PURE__ */ k(() => ks(r, V(l))), d = /* @__PURE__ */ k(() => V(s).slice(V(u).first, V(u).last)), f = /* @__PURE__ */ k(() => V(l) > xo[0]);
	var p = gl(), m = P(p), h = (e) => {
		var t = ll(), i = P(t);
		n(i), Ts(L(i, 2), {
			key: r,
			noun: "sessions",
			get units() {
				return V(c);
			}
		}), T(t), W(e, t);
	}, g = (e) => {
		n(e);
	};
	K(m, (e) => {
		V(f) ? e(h) : e(g, -1);
	});
	var _ = L(m, 2), v = P(_), y = (e) => {
		var t = ul(), n = I(t, !0);
		R(() => G(n, Q.liveFailed ? "Could not load the live sessions." : "Loading…")), W(e, t);
	}, ee = (e) => {
		var t = hl(), n = F(t), r = (e) => {
			var t = dl(), n = I(t);
			R(() => G(n, `Permission prompts can't show here: ${V(i).prompts_unavailable ?? ""}.`)), W(e, t);
		};
		K(n, (e) => {
			V(i).prompts_unavailable && e(r);
		});
		var s = L(n, 2), c = (e) => {
			var t = fl(), n = I(t);
			R(() => G(n, `Desktop notifications can't show: ${V(i).notifications_unavailable ?? ""}.`)), W(e, t);
		};
		K(s, (e) => {
			V(i).notifications_unavailable && e(c);
		});
		var l = L(s, 2), u = (e) => {
			var t = pl();
			q(t, 21, () => V(d), (e) => e.session_id, (e, t) => {
				{
					let n = /* @__PURE__ */ k(() => Q.liveState(V(t).session_id));
					sl(e, {
						get session() {
							return V(t);
						},
						get sessionState() {
							return V(n);
						},
						get now() {
							return V(a);
						}
					});
				}
			}), T(t), W(e, t);
		}, f = (e) => {
			var t = ml(), n = I(t, !0);
			R((e) => G(n, e), [() => Uc(V(i), V(o))]), W(e, t);
		};
		K(l, (e) => {
			V(d).length ? e(u) : e(f, -1);
		}), W(e, t);
	};
	K(v, (e) => {
		V(i) ? e(ee, -1) : e(y);
	}), T(_), T(p), W(e, p), D();
}
//#endregion
//#region src/lib/trend.ts
var vl = [
	{
		label: "Estimated cost",
		slot: 0,
		value: (e) => e.cost,
		format: Z
	},
	{
		label: "Input tokens",
		slot: 1,
		value: (e) => e.input,
		format: Y
	},
	{
		label: "Output tokens",
		slot: 2,
		value: (e) => e.output,
		format: Y
	}
];
function yl(e) {
	let t = e * 116 + 22;
	return {
		top: t,
		bottom: t + 76
	};
}
function bl() {
	return yl(vl.length - 1).bottom + 28;
}
function xl(e, t = /* @__PURE__ */ new Date()) {
	let n = Ia(e, t), r = Ra(n.unit === "hour" ? e.hour_model : e.day_model, n.keyOf);
	return {
		buckets: n,
		totals: n.keys.map((e) => r.get(e) ?? La)
	};
}
function Sl(e, t) {
	return e.totals.map((e) => t.value(e));
}
function Cl(e) {
	return `estimated cost, input and output tokens per ${e}`;
}
function wl(e) {
	return `Estimated cost, input tokens and output tokens per ${e}; table view available`;
}
function Tl(e) {
	return `Estimated cost, input and output tokens per ${e}; arrow keys step through them`;
}
function El(e, t) {
	let n = e.totals[t] ?? La, r = vl.map((e) => `${e.label} ${e.format(e.value(n))}`).join(", ");
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${r}`;
}
function Dl(e) {
	let t = e.buckets.keys.map((t, n) => ({
		key: t,
		cells: [e.buckets.short(t), ...vl.map((t) => t.format(t.value(e.totals[n] ?? La)))]
	})).reverse();
	return {
		head: [e.buckets.heading, ...vl.map((e) => e.label)],
		rows: t
	};
}
//#endregion
//#region src/components/AreaLine.svelte
var Ol = /* @__PURE__ */ H([["path", { "fill-opacity": "0.1" }], ["path", {
	fill: "none",
	"stroke-width": "2",
	"stroke-linejoin": "round",
	"stroke-linecap": "round"
}]], 5);
function kl(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => t.values.map((e, n) => `${t.xOf(n).toFixed(1)},${t.yOf(e).toFixed(1)}`).join("L")), r = /* @__PURE__ */ k(() => `M${t.xOf(0)},${t.bottom}L${V(n)}L${t.xOf(t.values.length - 1)},${t.bottom}Z`);
	var i = U(), a = F(i), o = (e) => {
		var i = Ol(), a = F(i), o = L(a);
		R(() => {
			J(a, "d", V(r)), J(a, "fill", t.color), J(o, "d", `M${V(n) ?? ""}`), J(o, "stroke", t.color);
		}), W(e, i);
	};
	K(a, (e) => {
		t.values.length && e(o);
	}), W(e, i), D();
}
//#endregion
//#region src/components/PointDot.svelte
var Al = /* @__PURE__ */ H([["circle", {
	r: "4",
	stroke: "var(--surface)",
	"stroke-width": "2"
}]], 4);
function jl(e, t) {
	var n = Al();
	R(() => {
		J(n, "cx", t.x), J(n, "cy", t.y), J(n, "fill", t.color);
	}), W(e, n);
}
//#endregion
//#region src/components/OverTime.svelte
var Ml = (e, t = v) => {
	var n = Vl(), r = F(n), i = I(r, !0);
	q(L(r, 2), 19, () => vl, (e) => e.label, (e, n, r) => {
		var i = Bl(), a = I(i, !0);
		R(() => G(a, t().cells[V(r) + 1])), W(e, i);
	}), R(() => G(i, t().cells[0])), W(e, n);
}, Nl = /* @__PURE__ */ H([
	,
	,
	[
		"text",
		{ class: "value-text" },
		" "
	]
], 5), Pl = /* @__PURE__ */ H([
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
], 5), Fl = /* @__PURE__ */ H([
	,
	,
	,
], 5), Il = /* @__PURE__ */ H([["line", { class: "crosshair" }], ,], 5), Ll = /* @__PURE__ */ H([[
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
]]), Rl = /* @__PURE__ */ H([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
], 1), zl = /* @__PURE__ */ H([[
	"div",
	{ class: "chart" },
	,
]]), Bl = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), Vl = /* @__PURE__ */ H([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function Hl(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = zl(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => t() - 64), r = /* @__PURE__ */ k(() => ka(V(s).length, 56, V(n)));
				var a = Fl(), o = F(a);
				q(o, 17, () => V(d), ({ panel: e, top: t, bottom: n, color: r, values: i, max: a, yOf: o }) => e.label, (e, t) => {
					let i = () => V(t).panel, a = () => V(t).top, o = () => V(t).bottom, s = () => V(t).color, c = () => V(t).values, l = () => V(t).max, u = () => V(t).yOf;
					var d = Pl(), f = F(d), p = L(f), m = I(p, !0), h = L(p);
					{
						let e = /* @__PURE__ */ k(() => Da(l(), 2));
						Us(h, {
							get left() {
								return 56;
							},
							get right() {
								return V(n);
							},
							get values() {
								return V(e);
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
					kl(g, {
						get values() {
							return c();
						},
						get xOf() {
							return V(r);
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
						let t = /* @__PURE__ */ k(() => c().length - 1), n = /* @__PURE__ */ k(() => c()[V(t)] ?? 0);
						var a = Nl(), o = F(a);
						{
							let e = /* @__PURE__ */ k(() => V(r)(V(t))), i = /* @__PURE__ */ k(() => u()(V(n)));
							jl(o, {
								get x() {
									return V(e);
								},
								get y() {
									return V(i);
								},
								get color() {
									return s();
								}
							});
						}
						var l = L(o), d = I(l, !0);
						R((e, t, n) => {
							J(l, "x", e), J(l, "y", t), G(d, n);
						}, [
							() => V(r)(V(t)) + 9,
							() => u()(V(n)) + 4,
							() => i().format(V(n))
						]), W(e, a);
					};
					K(_, (e) => {
						c().length && e(v);
					}), R(() => {
						J(f, "x1", 56), J(f, "x2", 70), J(f, "y1", a() - 10), J(f, "y2", a() - 10), J(f, "stroke", s()), J(p, "x", 76), J(p, "y", a() - 6), G(m, i().label);
					}), W(e, d);
				});
				var c = L(o);
				{
					let e = /* @__PURE__ */ k(() => u + 18);
					Vs(c, {
						get count() {
							return V(s).length;
						},
						get xOf() {
							return V(r);
						},
						get y() {
							return V(e);
						},
						text: (e) => V(i).short(V(s)[e] ?? "")
					});
				}
				W(e, a);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ k(() => ka(V(s).length, 56, t() - 64));
				var i = Il(), a = F(i);
				q(L(a), 17, () => V(d), ({ panel: e, color: t, values: n, yOf: r }) => e.label, (e, t) => {
					let i = () => V(t).color, a = () => V(t).values, o = () => V(t).yOf;
					{
						let t = /* @__PURE__ */ k(() => V(r)(n())), s = /* @__PURE__ */ k(() => o()(a()[n()] ?? 0));
						jl(e, {
							get x() {
								return V(t);
							},
							get y() {
								return V(s);
							},
							get color() {
								return i();
							}
						});
					}
				}), R((e, t) => {
					J(a, "x1", e), J(a, "x2", t), J(a, "y1", 18), J(a, "y2", u);
				}, [() => V(r)(n()), () => V(r)(n())]), W(e, i);
			}, r = (e, t = v) => {
				var n = Rl(), r = F(n), a = I(r, !0);
				q(L(r, 2), 17, () => V(d), ({ panel: e, color: t, values: n }) => e.label, (e, n) => {
					let r = () => V(n).panel, i = () => V(n).color, a = () => V(n).values;
					var o = Ll(), s = P(o);
					let c;
					var l = L(s, 2), u = I(l, !0), d = I(L(l, 2), !0);
					T(o), R((e) => {
						c = ci(s, "", c, { background: i() }), G(u, e), G(d, r().label);
					}, [() => r().format(a()[t()] ?? 0)]), W(e, o);
				}), R((e) => G(a, e), [() => V(i).long(V(s)[t()] ?? "")]), W(e, n);
			}, i = /* @__PURE__ */ k(() => V(a).buckets), s = /* @__PURE__ */ k(() => V(i).keys);
			{
				let i = /* @__PURE__ */ k(bl), a = /* @__PURE__ */ k(() => wl(V(o)));
				ms(e, {
					get height() {
						return V(i);
					},
					get label() {
						return V(a);
					},
					get width() {
						return V(l);
					},
					get containerWidth() {
						return V(c);
					},
					get cursor() {
						return V(f);
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
		K(n, (e) => {
			V(a) && e(r);
		}), T(t), Di(t, "clientWidth", (e) => M(c, e)), W(e, t);
	}, r = (e) => {
		var t = U(), n = F(t), r = (e) => {
			let t = /* @__PURE__ */ k(() => {
				let [e = "", ...t] = V(s).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let n = /* @__PURE__ */ k(() => [{ label: V(t).first }, ...V(t).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				zs(e, {
					key: "trend-table",
					get columns() {
						return V(n);
					},
					get rows() {
						return V(s).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return Ml;
					}
				});
			}
		};
		K(n, (e) => {
			V(s) && e(r);
		}), W(e, t);
	}, i = /* @__PURE__ */ k(() => Q.summary), a = /* @__PURE__ */ k(() => V(i) ? xl(V(i)) : null), o = /* @__PURE__ */ k(() => V(a)?.buckets.unit ?? "day"), s = /* @__PURE__ */ k(() => V(a) ? Dl(V(a)) : null), c = /* @__PURE__ */ j(0), l = /* @__PURE__ */ k(() => Pi(V(c))), u = yl(vl.length - 1).bottom, d = /* @__PURE__ */ k(() => V(a) ? vl.map((e, t) => {
		let { top: n, bottom: r } = yl(t), i = Sl(V(a), e), o = Ea(Math.max(...i, 0));
		return {
			panel: e,
			top: n,
			bottom: r,
			color: $i(e.slot),
			values: i,
			max: o,
			yOf: (e) => r - 76 * e / o
		};
	}) : []), f = /* @__PURE__ */ k(() => V(a) ? {
		count: V(a).buckets.keys.length,
		label: Tl(V(o)),
		valueText: (e) => El(V(a), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: u
		}),
		indexAt: (e) => Aa(56, e - 64, V(a).buckets.keys.length),
		tipX: (e, t) => ka(V(a).buckets.keys.length, 56, e - 64)(t)
	} : null);
	{
		let t = /* @__PURE__ */ k(() => $("Over time")), i = /* @__PURE__ */ k(() => Cl(V(o)));
		_s(e, {
			id: "trend",
			get title() {
				return V(t);
			},
			get note() {
				return V(i);
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
var Ul = /* @__PURE__ */ t({
	RANGES: () => Wl,
	dayLabel: () => Yl,
	dayStep: () => Xl,
	rangeDays: () => Gl,
	rangeQuery: () => ql,
	shownDay: () => Jl,
	visibleRanges: () => Kl
}), Wl = [
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
function Gl(e) {
	return Wl.some((t) => t.days === e) ? e : null;
}
function Kl(e) {
	return e ? Wl.filter((t) => t.days <= e) : Wl;
}
function ql(e, t) {
	return `days=${e}` + (e === 1 && t !== null ? `&until=${t}` : "");
}
function Jl(e, t, n) {
	let r = t ?? n;
	return e && e.days === 1 && e.until === r ? e : null;
}
function Yl(e) {
	return e === null ? "Today" : va(e);
}
function Xl(e, t, n) {
	let r = e?.[t];
	if (r) return r === n ? null : r;
}
//#endregion
//#region src/lib/range.svelte.ts
var Zl = /* @__PURE__ */ t({
	RangeState: () => $l,
	range: () => eu
});
function Ql() {
	return Gl(Number(is("days"))) ?? 30;
}
var $l = class {
	#e = /* @__PURE__ */ j(Jt(Ql()));
	#t = /* @__PURE__ */ j(null);
	onchange = null;
	get days() {
		return V(this.#e);
	}
	get day() {
		return V(this.#t);
	}
	select(e) {
		Gl(e) !== null && (M(this.#e, e, !0), M(this.#t, null), as("days", e), this.onchange?.());
	}
	step(e, t) {
		let n = ga(/* @__PURE__ */ new Date()), r = Xl(Jl(t, V(this.#t), n), e, n);
		r !== void 0 && (M(this.#t, r, !0), this.onchange?.());
	}
	fit(e) {
		e.days >= V(this.#e) || (M(this.#e, e.days, !0), as("days", e.days));
	}
	reset() {
		M(this.#e, Ql(), !0), M(this.#t, null), this.onchange = null;
	}
}, eu = new $l(), tu = /* @__PURE__ */ H([[
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
]]), nu = /* @__PURE__ */ H([
	[
		"button",
		{ type: "button" },
		" "
	],
	" ",
	,
], 1), ru = /* @__PURE__ */ H([
	[
		"span",
		{ class: "label" },
		"Range"
	],
	" ",
	["div", { class: "segmented" }]
], 1);
function iu(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Kl(Q.summary?.retention_days)), r = /* @__PURE__ */ k(() => Jl(Q.summary, eu.day, ga(/* @__PURE__ */ new Date())));
	var i = ru(), a = L(F(i), 2);
	q(a, 21, () => V(n), (e) => e.days, (e, t) => {
		var n = nu(), i = F(n), a = I(i, !0), o = L(i, 2), s = (e) => {
			var t = tu(), n = P(t), i = L(n, 2), a = I(i, !0), o = L(i, 2);
			T(t), R((e) => {
				n.disabled = !V(r)?.previous_day, G(a, e), o.disabled = !V(r)?.next_day;
			}, [() => Yl(eu.day)]), vr("click", n, () => eu.step("previous_day", Q.summary)), vr("click", o, () => eu.step("next_day", Q.summary)), W(e, t);
		};
		K(o, (e) => {
			V(t).days === 1 && eu.days === 1 && e(s);
		}), R(() => {
			J(i, "aria-pressed", eu.days === V(t).days), G(a, V(t).label);
		}), vr("click", i, () => eu.select(V(t).days)), W(e, n);
	}), T(a), W(e, i), D();
}
yr(["click"]);
var au = 148, ou = "var(--status-critical)";
function su(e, t = /* @__PURE__ */ new Date()) {
	let n = Ia(e, t), r = qa(n.unit === "hour" ? e.api_errors.hour : e.api_errors.day, n.keyOf), i = n.keys.map((e) => r(e).limits), a = n.keys.map((e) => r(e).other), o = i.reduce((e, t) => e + t, 0), s = Pa(i);
	return {
		buckets: n,
		limits: i,
		others: a,
		total: o,
		top: Oa(Math.max(...i, 0)),
		peak: i[s] ? s : null,
		empty: !i.some(Boolean) && !a.some(Boolean)
	};
}
function cu(e, t, n, r, i) {
	let { band: a, barWidth: o } = io(e, t), s = 120 * r / i;
	return {
		x: 56 + a * n + (a - o) / 2,
		y: 120 - s,
		width: o,
		height: s
	};
}
function lu(e) {
	return `rate-limit hits per ${e}; other API errors are in the tooltip, the table view and the list`;
}
function uu(e, t) {
	return `Rate-limit hits per ${e}: ${X(t)} in the range; table view available`;
}
function du(e) {
	return `Rate-limit hits per ${e}; arrow keys step through them`;
}
function fu(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${X(e.limits[t])} rate-limit hits, ${X(e.others[t])} other API errors`;
}
function pu(e, t) {
	return {
		when: e.buckets.long(e.buckets.keys[t] ?? ""),
		limits: X(e.limits[t]),
		others: X(e.others[t])
	};
}
function mu(e) {
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
				X(e.limits[r]),
				X(e.others[r])
			]
		})).reverse()
	};
}
var hu = [
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
function gu(e, t) {
	return e.flatMap((e) => {
		let n = `${e.limit_type} ${e.resets_at}`;
		return [{
			key: n,
			kind: "window",
			name: Ya(e, t),
			cells: [
				ma(Ja(e)),
				X(e.hits),
				...Jo(e.used)
			],
			sub: !1,
			group: e.models.length > 0
		}, ...e.models.slice().sort(Ko).map((e) => ({
			key: `${n} ${e.model}`,
			kind: "model",
			name: e.model,
			cells: [
				"",
				"",
				...Jo(e)
			],
			sub: !0,
			group: !1
		}))];
	});
}
function _u(e) {
	return e.map((e) => ({
		key: e.record_id,
		when: Sa(e.ts),
		error: Ka(e),
		quota: Ga(e.limit_type),
		resets: Sa(e.resets_at),
		session: {
			href: mc(e),
			name: pc(e),
			project: e.project
		},
		agent: e.agent_type
	}));
}
function vu(e) {
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
var yu = /* @__PURE__ */ H([[
	"h3",
	null,
	" "
]]), bu = /* @__PURE__ */ H([[
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
]]), xu = /* @__PURE__ */ H([
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
function Su(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = yu(), r = I(n, !0);
		R(() => {
			J(n, "id", `${t.id ?? ""}-title`), G(r, t.title);
		}), W(e, n);
	}, r = (e, t = v) => {
		var n = xu(), r = F(n), a = I(r, !0), o = L(r, 2), s = I(o, !0), c = L(o, 2), l = I(c, !0), u = L(c, 2), d = I(u, !0), f = L(u, 2), p = (e) => {
			var n = bu(), r = P(n), i = I(r, !0), a = I(L(r), !0);
			T(n), R(() => {
				J(r, "href", t().session.href), G(i, t().session.name), G(a, t().session.project);
			}), W(e, n);
		};
		K(f, (e) => {
			i() && e(p);
		});
		var m = I(L(f, 2), !0);
		R(() => {
			G(a, t().when), G(s, t().error), G(l, t().quota), G(d, t().resets), G(m, t().agent);
		}), W(e, n);
	}, i = Ai(t, "withSession", 3, !0);
	{
		let a = /* @__PURE__ */ k(() => vu(i()));
		zs(e, {
			get key() {
				return t.pagerKey;
			},
			get columns() {
				return V(a);
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
var Cu = (e) => {
	var t = Ru(), n = I(t, !0);
	R((e) => G(n, e), [() => $("5-hour windows that hit the limit")]), W(e, t);
}, wu = (e) => {
	W(e, zu());
}, Tu = /* @__PURE__ */ H([[
	"span",
	null,
	,
	" "
]]), Eu = /* @__PURE__ */ H([[
	"div",
	{ class: "legend" },
	,
]]), Du = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	"No rate limits or API errors in this range."
]]), Ou = /* @__PURE__ */ H([["path"]], 4), ku = /* @__PURE__ */ H([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), Au = /* @__PURE__ */ H([
	,
	,
	,
], 5), ju = /* @__PURE__ */ H([
	,
	,
	,
	,
], 5), Mu = /* @__PURE__ */ H([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), Nu = /* @__PURE__ */ H([
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
], 1), Pu = /* @__PURE__ */ H([[
	"div",
	{ class: "chart" },
	,
]]), Fu = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), Iu = /* @__PURE__ */ H([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1), Lu = /* @__PURE__ */ H([
	,
	,
	" ",
	,
], 1), Ru = /* @__PURE__ */ H([[
	"h3",
	null,
	" "
]]), zu = /* @__PURE__ */ H([[
	"p",
	{ class: "note" },
	"what each window used from its start (its reset less 5 hours) up to its first hit, as the transcripts here show it;\n    the limit also counts what you use elsewhere"
]]), Bu = /* @__PURE__ */ H([[
	"span",
	{ class: "window-model" },
	" "
]]), Vu = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), Hu = /* @__PURE__ */ H([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1);
function Uu(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Eu(), n = P(t), r = (e) => {
			var t = Tu(), n = P(t);
			ys(n, { get fill() {
				return ou;
			} });
			var r = L(n);
			T(t), R(() => G(r, "⚠ Rate-limit hit")), W(e, t);
		};
		K(n, (e) => {
			V(c) && e(r);
		}), T(t), W(e, t);
	}, r = (e) => {
		var t = Pu(), n = P(t), r = (e) => {
			var t = U(), n = F(t), r = (e) => {
				W(e, Du());
			}, i = (e) => {
				let t = (e, t = v) => {
					let n = /* @__PURE__ */ k(() => io(t(), V(a).length));
					var r = ju(), o = F(r);
					{
						let e = /* @__PURE__ */ k(() => Da(V(c).top, 2));
						Us(o, {
							get left() {
								return 56;
							},
							get right() {
								return V(n).right;
							},
							get values() {
								return V(e);
							},
							yOf: (e) => 120 - 120 * e / V(c).top,
							get format() {
								return X;
							}
						});
					}
					var s = L(o);
					{
						let e = /* @__PURE__ */ k(() => 138);
						Vs(s, {
							get count() {
								return V(a).length;
							},
							xOf: (e) => 56 + V(n).band * (e + .5),
							get y() {
								return V(e);
							},
							text: (e) => V(i).short(V(a)[e] ?? "")
						});
					}
					q(L(s), 18, () => V(a), (e) => e, (e, n, r) => {
						let i = /* @__PURE__ */ k(() => V(c).limits[V(r)] ?? 0), o = /* @__PURE__ */ k(() => cu(t(), V(a).length, V(r), V(i), V(c).top));
						var s = Au(), l = F(s), u = (e) => {
							var t = Ou();
							R((e) => {
								J(t, "d", e), J(t, "fill", ou);
							}, [() => Na(V(o).x, V(o).y, V(o).width, V(o).height, !0)]), W(e, t);
						};
						K(l, (e) => {
							V(o).height > 0 && e(u);
						});
						var d = L(l), f = (e) => {
							var t = ku(), n = I(t, !0);
							R((e) => {
								J(t, "x", V(o).x + V(o).width / 2), J(t, "y", V(o).y - 6), G(n, e);
							}, [() => X(V(i))]), W(e, t);
						};
						K(d, (e) => {
							V(r) === V(c).peak && e(f);
						}), W(e, s);
					}), W(e, r);
				}, n = (e, t = v, n = v) => {
					let r = /* @__PURE__ */ k(() => io(t(), V(a).length).band);
					var i = Mu();
					R(() => {
						J(i, "x", 56 + V(r) * n()), J(i, "width", V(r)), J(i, "height", 120);
					}), W(e, i);
				}, r = (e, t = v) => {
					let n = /* @__PURE__ */ k(() => pu(V(c), t()));
					var r = Nu(), i = F(r), a = I(i, !0), o = L(i, 2), s = P(o);
					ys(s, { get fill() {
						return ou;
					} });
					var l = L(s), u = I(l, !0), d = I(L(l));
					T(o);
					var f = L(o, 2), p = P(f);
					ys(p, { fill: null });
					var m = I(L(p), !0);
					je(), T(f), R(() => {
						G(a, V(n).when), G(u, V(n).limits), G(d, "⚠ rate-limit hits"), G(m, V(n).others);
					}), W(e, r);
				}, i = /* @__PURE__ */ k(() => V(c).buckets), a = /* @__PURE__ */ k(() => V(i).keys);
				{
					let i = /* @__PURE__ */ k(() => uu(V(l), V(c).total));
					ms(e, {
						get height() {
							return au;
						},
						get label() {
							return V(i);
						},
						get width() {
							return V(g);
						},
						get containerWidth() {
							return V(h);
						},
						get cursor() {
							return V(_);
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
			K(n, (e) => {
				V(c).empty ? e(r) : e(i, -1);
			}), W(e, t);
		};
		K(n, (e) => {
			V(c) && e(r);
		}), T(t), Di(t, "clientWidth", (e) => M(h, e)), W(e, t);
	}, i = (e) => {
		var t = U(), n = F(t), r = (e) => {
			let t = (e, t = v) => {
				var r = Iu(), i = F(r), a = I(i, !0);
				q(L(i, 2), 19, () => V(n), (e) => e.label, (e, n, r) => {
					var i = Fu(), a = I(i, !0);
					R(() => G(a, t().cells[V(r) + 1])), W(e, i);
				}), R(() => G(a, t().cells[0])), W(e, r);
			}, n = /* @__PURE__ */ k(() => V(d).head.slice(1));
			zs(e, {
				key: "limits-table",
				get columns() {
					return V(d).head;
				},
				get rows() {
					return V(d).rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return t;
				}
			});
		};
		K(n, (e) => {
			V(d) && e(r);
		}), W(e, t);
	}, a = (e) => {
		var t = U(), n = F(t), r = (e) => {
			var t = Lu(), n = F(t);
			zs(n, {
				key: "limit-windows",
				get columns() {
					return hu;
				},
				get rows() {
					return V(f);
				},
				rowKey: (e) => e.key,
				get cells() {
					return o;
				},
				sub: (e) => e.sub,
				group: (e) => e.group,
				get heading() {
					return Cu;
				},
				get intro() {
					return wu;
				},
				empty: "No 5-hour window hit its limit in this range."
			});
			var r = L(n, 2);
			{
				let e = /* @__PURE__ */ k(() => $("Latest API errors"));
				Su(r, {
					id: "limit-events",
					get title() {
						return V(e);
					},
					get rows() {
						return V(p);
					},
					empty: "No API errors in this range.",
					pagerKey: "limit-events"
				});
			}
			W(e, t);
		};
		K(n, (e) => {
			V(s) && e(r);
		}), W(e, t);
	}, o = (e, t = v) => {
		var n = Hu(), r = F(n), i = P(r), a = (e) => {
			var n = Bu(), r = I(n, !0);
			R(() => G(r, t().name)), W(e, n);
		}, o = (e) => {
			var n = Er();
			R(() => G(n, t().name)), W(e, n);
		};
		K(i, (e) => {
			t().kind === "model" ? e(a) : e(o, -1);
		}), T(r), q(L(r, 2), 19, () => m, (e) => e.label, (e, n, r) => {
			var i = Vu(), a = I(i, !0);
			R(() => G(a, t().cells[V(r)])), W(e, i);
		}), W(e, n);
	}, s = /* @__PURE__ */ k(() => Q.summary), c = /* @__PURE__ */ k(() => V(s) ? su(V(s)) : null), l = /* @__PURE__ */ k(() => V(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ k(() => $("Rate limits")), d = /* @__PURE__ */ k(() => V(c) ? mu(V(c)) : null), f = /* @__PURE__ */ k(() => V(s) ? gu(V(s).api_errors.windows) : []), p = /* @__PURE__ */ k(() => V(s) ? _u(V(s).api_errors.events) : []), m = hu.slice(1), h = /* @__PURE__ */ j(0), g = /* @__PURE__ */ k(() => Pi(V(h))), _ = /* @__PURE__ */ k(() => V(c) ? {
		count: V(c).buckets.keys.length,
		label: du(V(l)),
		valueText: (e) => fu(V(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: io(e, V(c).buckets.keys.length).right - 56,
			height: 120
		}),
		indexAt: (e) => ao(e, V(c).buckets.keys.length),
		tipX: (e, t) => 56 + io(e, V(c).buckets.keys.length).band * (t + .5)
	} : null);
	{
		let t = /* @__PURE__ */ k(() => V(c) ? lu(V(l)) : void 0);
		_s(e, {
			id: "limits",
			get title() {
				return V(u);
			},
			get note() {
				return V(t);
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
var Wu = (e) => {
	var t = Ku(), n = I(P(t), !0);
	je(2), T(t), R((e) => G(n, e), [() => $("Sessions")]), W(e, t);
}, Gu = (e, t = v) => {
	let n = /* @__PURE__ */ k(() => ko(t()));
	var r = Xu(), i = F(r), a = I(i, !0), o = L(i, 2), s = P(o), c = I(s, !0), l = I(L(s), !0);
	T(o), q(L(o, 2), 17, () => V(n).slice(1), Hr, (e, t) => {
		var n = Yu(), r = I(n, !0);
		R(() => G(r, V(t))), W(e, n);
	}), R((e, r) => {
		G(a, V(n)[0]), J(s, "href", e), G(c, r), G(l, t().project);
	}, [() => mc(t()), () => pc(t())]), W(e, r);
}, Ku = /* @__PURE__ */ H([[
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
]]), qu = /* @__PURE__ */ H([[
	"option",
	null,
	" "
]]), Ju = /* @__PURE__ */ H([[
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
]]), Yu = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), Xu = /* @__PURE__ */ H([
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
], 1), Zu = /* @__PURE__ */ H([
	,
	,
	" ",
	,
], 1), Qu = /* @__PURE__ */ H([[
	"section",
	{
		class: "card",
		"aria-labelledby": "sessions-title"
	},
	,
]]);
function $u(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Ju(), n = P(t), o = P(n);
		o.value = o.__value = "", q(L(o), 17, () => V(c), (e) => e.project, (e, t) => {
			var n = qu(), r = I(n), i = {};
			R((e) => {
				G(r, `${V(t).project ?? ""} (${e ?? ""})`), i !== (i = V(t).project) && (n.value = (n.__value = i) ?? "");
			}, [() => X(V(t).count)]), W(e, n);
		}), T(n), fi(n);
		var s = L(n, 2);
		yi(s);
		var u = I(L(s, 2), !0);
		T(t), R(() => G(u, V(l))), pi(n, () => V(i), (e) => {
			M(i, e, !0), Os.forget(r);
		}), Ci(s, () => V(a), (e) => {
			M(a, e, !0), Os.forget(r);
		}), W(e, t);
	}, r = "sessions", i = /* @__PURE__ */ j(""), a = /* @__PURE__ */ j(""), o = /* @__PURE__ */ k(() => Q.summary?.sessions ?? null), s = /* @__PURE__ */ k(() => V(o) ? V(o).filter((e) => Eo(e, V(i), V(a))) : []), c = /* @__PURE__ */ k(() => Do(V(o) ?? [], V(i))), l = /* @__PURE__ */ k(() => V(o) ? Ao(V(s).length, V(o).length) : "");
	var u = Qu(), d = P(u), f = (e) => {
		{
			let t = /* @__PURE__ */ k(() => V(o).length ? "No sessions match the filter." : "No sessions in this range.");
			zs(e, {
				key: r,
				get columns() {
					return Oo;
				},
				get rows() {
					return V(s);
				},
				rowKey: (e) => e.session_id,
				get cells() {
					return Gu;
				},
				get heading() {
					return Wu;
				},
				get intro() {
					return n;
				},
				get empty() {
					return V(t);
				},
				labelledby: "sessions-title"
			});
		}
	}, p = (e) => {
		var t = Zu(), r = F(t);
		Wu(r);
		var i = L(r, 2);
		n(i), W(e, t);
	};
	K(d, (e) => {
		V(o) ? e(f) : e(p, -1);
	}), T(u), W(e, u), D();
}
//#endregion
//#region src/lib/opening.ts
function ed() {
	let e = document.activeElement, t = e && e !== document.body ? e : null;
	return {
		href: t?.getAttribute("href") ?? null,
		element: t,
		scroll: window.scrollY
	};
}
function td(e) {
	return e.element?.isConnected ? e.element : e.href === null ? null : [...document.querySelectorAll("a[href]")].find((t) => t.getAttribute("href") === e.href) ?? null;
}
function nd(e) {
	return (t) => {
		let n = ed(), r = [];
		for (let t of e.hide) {
			let e = document.getElementById(t);
			e && (e.hidden = !0, r.push(e));
		}
		return t.scrollIntoView({ block: "start" }), t.querySelector(e.focus)?.focus({ preventScroll: !0 }), () => {
			for (let e of r) e.hidden = !1;
			window.scrollTo(0, n.scroll), td(n)?.focus({ preventScroll: !0 });
		};
	};
}
//#endregion
//#region src/lib/session.ts
function rd(e) {
	let t = e.git_branch ? ` · ${e.git_branch}` : "";
	return `${e.project}${t} · ${Sa(e.first_ts)} – ${Sa(e.last_ts)} · ${e.session_id}`;
}
function id(e) {
	return e.some((e) => e.web_searches);
}
function ad(e) {
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
function od(e) {
	return e.models.length ? e.models.map((t) => {
		let n = e.model_efforts.filter((e) => e.model === t).map((e) => e.effort);
		return n.length ? `${t} · ${n.join(", ")}` : t;
	}) : ["–"];
}
function sd(e, t) {
	return [
		X(e.turns),
		`${Y(e.context_first)} → ${Y(e.context_last)}`,
		Y(e.input_total),
		pa(e.cache_read, e.input_total),
		Y(e.output),
		...t ? [X(e.web_searches)] : [],
		Y(e.returned_chars),
		Z(e.cost)
	];
}
function cd(e, t, n) {
	let r = e.workflow_phase ? ` · ${e.workflow_phase}` : "";
	return {
		key: e.agent_id ?? "main",
		kind: n,
		name: e.agent_type,
		detail: `${e.description || ""}${r}`,
		models: od(e),
		fold: null,
		cells: sd(e, t)
	};
}
function ld(e, t, n) {
	let r = (e) => t.reduce((t, n) => t + (n[e] || 0), 0), i = t.map((e) => e.cost).filter((e) => e !== null), a = t[0];
	return {
		key: `run:${e}`,
		kind: "run",
		name: `workflow · ${a.workflow_name || e}`,
		detail: "",
		models: [...new Set(t.flatMap((e) => e.models))],
		fold: {
			run: e,
			label: `${X(t.length)} agents`
		},
		cells: [
			X(r("turns")),
			"–",
			Y(r("input_total")),
			pa(r("cache_read"), r("input_total")),
			Y(r("output")),
			...n ? [X(r("web_searches"))] : [],
			"–",
			i.length ? Z(i.reduce((e, t) => e + t, 0)) : "–"
		]
	};
}
function ud(e, t) {
	let n = id(e), r = /* @__PURE__ */ new Map(), i = [];
	for (let t of e) t.workflow_run === null ? i.push(t) : r.has(t.workflow_run) ? r.get(t.workflow_run).push(t) : (r.set(t.workflow_run, [t]), i.push(t.workflow_run));
	return i.flatMap((e) => {
		if (typeof e != "string") return [cd(e, n, "agent")];
		let i = r.get(e);
		return [ld(e, i, n), ...t.includes(e) ? i.map((e) => cd(e, n, "member")) : []];
	});
}
//#endregion
//#region src/lib/tiles.ts
function dd(e, t = ga(/* @__PURE__ */ new Date()), n) {
	let r = e.history_since, i = r && r > e.since ? ` (history since ${_a(r, n)})` : "";
	return e.days === 1 ? e.until === t ? "today" : va(e.until, n) : `last ${e.days} days${i}`;
}
function fd(e) {
	let t = [e.unpriced_turns ? `${X(e.unpriced_turns)} turns of models without a price are not included` : "at API list prices"];
	return e.web_searches && t.push(`incl. ${X(e.web_searches)} web searches, ${Z(e.cost_parts.web_search)}`), t.join(" · ");
}
var pd = "Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.";
function md(e) {
	let t = e.compactions === 1 ? "1 compaction" : `${X(e.compactions)} compactions`, n = e.unknown ? `${X(e.unknown)} without an estimate` : null;
	if (!e.compactions) return {
		title: pd,
		verdict: null,
		amount: null,
		count: `Compacting: ${n}`
	};
	let r = e.net >= 0;
	return {
		title: pd,
		verdict: r ? "gain" : "loss",
		amount: r ? `▲ compacting saved ~${Z(e.net)} so far` : `▼ compacting cost ~${Z(-e.net)} more so far`,
		count: `(${[t, n].filter(Boolean).join(", ")})`
	};
}
function hd(e) {
	let t = e.cost_parts;
	return [{
		label: "Processed",
		tokens: e.new_input + e.cache_write,
		cost: t.new_input + t.cache_write,
		color: "var(--split-strong)",
		note: `New input ${Y(e.new_input)} + cache writes ${Y(e.cache_write)}, billed at full price or more`
	}, {
		label: "From cache",
		tokens: e.cache_read,
		cost: t.cache_read,
		color: "var(--split-soft)",
		note: "Cache reads, billed at a tenth of the input price and not processed again"
	}];
}
function gd(e, t) {
	let n = Ta(t);
	return e.map((e) => `${e.label} ${pa(e.tokens, n)}`).join(", ");
}
function _d(e, t) {
	return e?.turns ? `median context ${Y(e.median)} per turn (p90 ${Y(e.p90)})` + (t ? ` · compact hint at ${Y(t)}` : "") : null;
}
function vd(e, t, n, r) {
	let i = e.api_ms_without_retries === null ? null : e.api_ms - e.api_ms_without_retries, a = "no time lost to retries";
	return i === null ? a = "retries are not in the transcripts" : i > 0 && (a = `${ma(i)} of it retries`), {
		session: `wall-clock, ${t}`,
		api: a,
		tools: r ? "from each call to its result, incl. waiting for permission" : `${pa(e.tool_ms, e.duration_ms)} of the session time`,
		lines: n === null ? "no lines changed" : `${Z(n)} per 100 lines changed`
	};
}
function yd(e) {
	return `${X(e)} ${e === 1 ? "session" : "sessions"} that ended in the range`;
}
function bd(e) {
	return e === "cost_record" ? "from its cost record" : "estimated from the transcripts";
}
function xd(e) {
	let t = e.runtime.lines_added + e.runtime.lines_removed;
	return e.cost === null || t === 0 ? null : e.cost / t * 100;
}
//#endregion
//#region src/lib/usage.ts
function Sd(e) {
	return [{ label: e }, ...qo];
}
function Cd(e, t) {
	return e.slice().sort(Ko).map((e) => ({
		key: t(e),
		name: t(e),
		kind: "plain",
		swatch: null,
		cells: Jo(e),
		sub: !1,
		group: !1
	}));
}
function wd(e, t, n) {
	return e.slice().sort(Ko).flatMap((e) => [{
		key: e.model,
		name: e.model,
		kind: "model",
		swatch: $i(n.get(e.model) ?? null),
		cells: Jo(e),
		sub: !1,
		group: !0
	}, ...t.filter((t) => t.model === e.model && t.effort !== null).sort((e, t) => Gi(e.effort ?? "") - Gi(t.effort ?? "") || (e.effort ?? "").localeCompare(t.effort ?? "")).map((t) => ({
		key: `${e.model}\u0000${t.effort}`,
		name: qi(t.effort),
		kind: "effort",
		swatch: null,
		cells: Jo(t),
		sub: !0,
		group: !1
	}))]);
}
//#endregion
//#region src/components/AgentsTable.svelte
var Td = (e) => {
	W(e, Ed());
}, Ed = /* @__PURE__ */ H([[
	"h3",
	{ id: "session-agents-title" },
	"Main thread and subagents"
]]), Dd = /* @__PURE__ */ H([[
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
]]), Od = /* @__PURE__ */ H([[
	"span",
	{ class: "sub" },
	" "
]]), kd = /* @__PURE__ */ H([[
	"div",
	null,
	" "
]]), Ad = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), jd = /* @__PURE__ */ H([
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
function Md(e, t) {
	E(t, !0);
	let n = (e, t = v) => {
		var n = jd(), i = F(n), a = P(i), s = I(a, !0), c = L(a, 2), l = (e) => {
			let n = /* @__PURE__ */ k(() => t().fold), i = /* @__PURE__ */ k(() => V(r).includes(V(n).run));
			var a = Dd(), s = P(a), c = I(s, !0);
			T(a), R(() => {
				J(s, "aria-expanded", V(i)), G(c, V(n).label);
			}), vr("click", s, () => o(V(n).run)), W(e, a);
		}, u = (e) => {
			var n = Od(), r = I(n, !0);
			R(() => G(r, t().detail)), W(e, n);
		};
		K(c, (e) => {
			t().fold ? e(l) : e(u, -1);
		}), T(i);
		var d = L(i, 2);
		q(d, 20, () => t().models, (e) => e, (e, t) => {
			var n = kd(), r = I(n, !0);
			R(() => G(r, t)), W(e, n);
		}), T(d), q(L(d, 2), 17, () => t().cells, Hr, (e, t) => {
			var n = Ad(), r = I(n, !0);
			R(() => G(r, V(t))), W(e, n);
		}), R(() => G(s, t().name)), W(e, n);
	}, r = /* @__PURE__ */ j(Jt([])), i = /* @__PURE__ */ k(() => ad(id(t.agents))), a = /* @__PURE__ */ k(() => ud(t.agents, V(r)));
	function o(e) {
		M(r, V(r).includes(e) ? V(r).filter((t) => t !== e) : [...V(r), e], !0);
	}
	zs(e, {
		get key() {
			return t.pagerKey;
		},
		get columns() {
			return V(i);
		},
		get rows() {
			return V(a);
		},
		rowKey: (e) => e.key,
		get cells() {
			return n;
		},
		sub: (e) => e.kind === "member",
		group: (e) => e.kind === "run",
		rowClass: (e) => e.kind === "member" ? "workflow-member" : void 0,
		get heading() {
			return Td;
		},
		labelledby: "session-agents-title"
	}), D();
}
yr(["click"]);
//#endregion
//#region src/components/InputSplit.svelte
var Nd = /* @__PURE__ */ H([["span"]]), Pd = /* @__PURE__ */ H([[
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
]]), Fd = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	" "
]]), Id = /* @__PURE__ */ H([[
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
function Ld(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Ta(t.totals)), r = /* @__PURE__ */ k(() => hd(t.totals)), i = /* @__PURE__ */ k(() => _d(t.context, t.hintTokens));
	var a = Id(), o = P(a), s = I(o, !0), c = L(o, 2), l = I(c, !0), u = L(c, 2);
	q(u, 21, () => V(r).filter((e) => e.tokens > 0), (e) => e.label, (e, t) => {
		var n = Nd();
		let r;
		R(() => r = ci(n, "", r, {
			"flex-grow": V(t).tokens,
			background: V(t).color
		})), W(e, n);
	}), T(u);
	var d = L(u, 2);
	q(d, 17, () => V(r), (e) => e.label, (e, t) => {
		var r = Pd(), i = P(r);
		ys(i, { get fill() {
			return V(t).color;
		} });
		var a = L(i, 2), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = I(l, !0), d = I(L(l, 2), !0);
		T(r), R((e, n, i, a) => {
			J(r, "title", V(t).note), G(o, e), G(c, n), G(u, i), G(d, a);
		}, [
			() => $(V(t).label),
			() => Y(V(t).tokens),
			() => pa(V(t).tokens, V(n)),
			() => Z(V(t).cost)
		]), W(e, r);
	});
	var f = L(d, 2), p = (e) => {
		var t = Fd();
		J(t, "title", "The context a main-thread turn reads: new input, cache writes and reads. The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens).");
		var n = I(t, !0);
		R(() => G(n, V(i))), W(e, t);
	};
	K(f, (e) => {
		V(i) !== null && e(p);
	}), T(a), R((e, t, n) => {
		G(s, e), G(l, t), J(u, "aria-label", n);
	}, [
		() => $("Input tokens"),
		() => Y(V(n)),
		() => gd(V(r), t.totals)
	]), W(e, a), D();
}
//#endregion
//#region src/components/StatTile.svelte
var Rd = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	" "
]]), zd = /* @__PURE__ */ H([[
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
function Bd(e, t) {
	E(t, !0);
	let n = Ai(t, "note", 3, null), r = Ai(t, "themedNote", 3, !1);
	var i = zd(), a = P(i), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = (e) => {
		var t = Rd(), i = I(t, !0);
		R((e) => G(i, e), [() => r() ? $(n()) : n()]), W(e, t);
	};
	K(l, (e) => {
		n() && e(u);
	}), T(i), R((e) => {
		G(o, e), G(c, t.value);
	}, [() => $(t.label)]), W(e, i), D();
}
//#endregion
//#region src/components/KpiTiles.svelte
var Vd = /* @__PURE__ */ H([
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
], 1), Hd = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	,
]]), Ud = /* @__PURE__ */ H([
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
function Wd(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => t.savings ? md(t.savings) : null);
	var r = Ud(), i = F(r), a = P(i), o = P(a), s = I(o, !0), c = L(o);
	T(a);
	var l = L(a, 2), u = I(l, !0), d = L(l, 2), f = I(d, !0), p = L(d, 2), m = (e) => {
		var t = Hd(), r = P(t), i = (e) => {
			var t = Vd(), r = F(t), i = I(r, !0), a = I(L(r, 2), !0);
			R(() => {
				oi(r, 1, ei(V(n).verdict === "gain" ? "verdict-gain" : "verdict-loss")), G(i, V(n).amount), G(a, V(n).count);
			}), W(e, t);
		}, a = (e) => {
			var t = Er();
			R(() => G(t, V(n).count)), W(e, t);
		};
		K(r, (e) => {
			V(n).verdict ? e(i) : e(a, -1);
		}), T(t), R(() => J(t, "title", V(n).title)), W(e, t);
	};
	K(p, (e) => {
		V(n) && e(m);
	}), T(i);
	var h = L(i, 2);
	Ld(h, {
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
		let e = /* @__PURE__ */ k(() => X(t.totals.turns));
		Bd(g, {
			label: "Turns",
			get value() {
				return V(e);
			},
			note: "API calls with usage",
			themedNote: !0
		});
	}
	var _ = L(g, 2);
	{
		let e = /* @__PURE__ */ k(() => Y(t.totals.output)), n = /* @__PURE__ */ k(() => Z(t.totals.cost_parts.output));
		Bd(_, {
			label: "Output tokens",
			get value() {
				return V(e);
			},
			get note() {
				return V(n);
			}
		});
	}
	R((e, n, r) => {
		G(s, e), G(c, `, ${t.scope ?? ""}`), G(u, n), G(f, r);
	}, [
		() => $("Estimated cost"),
		() => Z(t.totals.cost),
		() => fd(t.totals)
	]), W(e, r), D();
}
//#endregion
//#region src/components/RuntimeTiles.svelte
var Gd = /* @__PURE__ */ H([
	,
	,
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function Kd(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => "source" in t.runtime && t.runtime.source === "transcripts"), r = /* @__PURE__ */ k(() => vd(t.runtime, t.from, t.costPer100Lines, V(n)));
	var i = Gd(), a = F(i);
	{
		let e = /* @__PURE__ */ k(() => ma(t.runtime.duration_ms));
		Bd(a, {
			label: "Session time",
			get value() {
				return V(e);
			},
			get note() {
				return V(r).session;
			}
		});
	}
	var o = L(a, 2);
	{
		let e = /* @__PURE__ */ k(() => ma(t.runtime.api_ms));
		Bd(o, {
			label: "Waiting on the API",
			get value() {
				return V(e);
			},
			get note() {
				return V(r).api;
			}
		});
	}
	var s = L(o, 2);
	{
		let e = /* @__PURE__ */ k(() => ma(t.runtime.tool_ms));
		Bd(s, {
			label: "Running tools",
			get value() {
				return V(e);
			},
			get note() {
				return V(r).tools;
			}
		});
	}
	var c = L(s, 2);
	{
		let e = /* @__PURE__ */ k(() => `+${X(t.runtime.lines_added)} / −${X(t.runtime.lines_removed)}`);
		Bd(c, {
			label: "Lines changed",
			get value() {
				return V(e);
			},
			get note() {
				return V(r).lines;
			}
		});
	}
	W(e, i), D();
}
//#endregion
//#region src/components/SessionWaits.svelte
var qd = /* @__PURE__ */ H([[
	"strong",
	null,
	" "
]]), Jd = /* @__PURE__ */ H([[
	"span",
	null,
	[
		"a",
		null,
		" "
	],
	" "
]]), Yd = /* @__PURE__ */ H([[
	"p",
	{ class: "wait-line" },
	[
		"span",
		{ class: "wait-icon" },
		,
	],
	" ",
	,
]]), Xd = /* @__PURE__ */ H([["div", {
	class: "card wait-notice",
	role: "status"
}]]);
function Zd(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Q.session), r = /* @__PURE__ */ k(() => V(n) ? Jc(V(n), Q.live?.sessions ?? []) : []);
	var i = Xd();
	q(i, 21, () => V(r), (e) => e.session_id, (e, t) => {
		var n = Yd(), r = P(n);
		tl(P(r), { get badge() {
			return V(t);
		} }), T(r);
		var i = L(r, 2), a = (e) => {
			var n = qd(), r = I(n);
			R((e, t) => G(r, `This session is ${e ?? ""}${t ?? ""}`), [() => V(t).text.charAt(0).toLowerCase(), () => V(t).text.slice(1)]), W(e, n);
		}, o = (e) => {
			var n = Jd(), r = P(n), i = I(r, !0), a = L(r);
			T(n), R((e) => {
				J(r, "href", e), G(i, V(t).title), G(a, `: ${V(t).text ?? ""}`);
			}, [() => mc(V(t))]), W(e, n);
		};
		K(i, (e) => {
			V(t).title === null ? e(a) : e(o, -1);
		}), T(n), W(e, n);
	}), T(i), R(() => J(i, "hidden", V(r).length === 0)), W(e, i), D();
}
//#endregion
//#region src/components/UsageTable.svelte
var Qd = /* @__PURE__ */ H([[
	"h3",
	null,
	" "
]]), $d = /* @__PURE__ */ H([[
	"h2",
	null,
	" "
]]), ef = /* @__PURE__ */ H([[
	"p",
	{ class: "note" },
	" "
]]), tf = /* @__PURE__ */ H([[
	"span",
	null,
	,
	" "
]]), nf = /* @__PURE__ */ H([[
	"span",
	{ class: "effort" },
	" "
]]), rf = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), af = /* @__PURE__ */ H([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1), of = /* @__PURE__ */ H([[
	"section",
	{ class: "card" },
	,
]]);
function sf(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = U(), o = F(n), c = (e) => {
			{
				let n = /* @__PURE__ */ k(() => Sd(t.nameLabel)), o = /* @__PURE__ */ k(() => t.note === void 0 ? void 0 : i);
				zs(e, {
					get key() {
						return s();
					},
					get columns() {
						return V(n);
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
						return V(o);
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
		K(o, (e) => {
			t.rows ? e(c) : e(l, -1);
		}), W(e, n);
	}, r = (e) => {
		var n = U(), r = F(n), i = (e) => {
			var n = Qd(), r = I(n, !0);
			R(() => {
				J(n, "id", `${t.id ?? ""}-title`), G(r, t.title);
			}), W(e, n);
		}, a = (e) => {
			var n = $d(), r = I(n, !0);
			R(() => {
				J(n, "id", `${t.id ?? ""}-title`), G(r, t.title);
			}), W(e, n);
		};
		K(r, (e) => {
			o() ? e(i) : e(a, -1);
		}), W(e, n);
	}, i = (e) => {
		var n = ef(), r = I(n, !0);
		R(() => G(r, t.note)), W(e, n);
	}, a = (e, t = v) => {
		var n = af(), r = F(n), i = P(r), a = (e) => {
			var n = tf(), r = P(n);
			ys(r, { get fill() {
				return t().swatch;
			} });
			var i = L(r, 1, !0);
			T(n), R(() => G(i, t().name)), W(e, n);
		}, o = (e) => {
			var n = nf(), r = I(n, !0);
			R(() => G(r, t().name)), W(e, n);
		}, s = (e) => {
			var n = Er();
			R(() => G(n, t().name)), W(e, n);
		};
		K(i, (e) => {
			t().kind === "model" ? e(a) : t().kind === "effort" ? e(o, 1) : e(s, -1);
		}), T(r), q(L(r, 2), 19, () => V(c), (e) => e.label, (e, n, r) => {
			var i = rf(), a = I(i, !0);
			R(() => G(a, t().cells[V(r)])), W(e, i);
		}), W(e, n);
	}, o = Ai(t, "inline", 3, !1), s = Ai(t, "pagerKey", 19, () => t.id), c = /* @__PURE__ */ k(() => Sd(t.nameLabel).slice(1));
	var l = U(), u = F(l), d = (e) => {
		n(e);
	}, f = (e) => {
		var r = of(), i = P(r);
		n(i), T(r), R(() => J(r, "aria-labelledby", `${t.id ?? ""}-title`)), W(e, r);
	};
	K(u, (e) => {
		o() ? e(d) : e(f, -1);
	}), W(e, l), D();
}
//#endregion
//#region src/components/SessionView.svelte
var cf = /* @__PURE__ */ H([[
	"div",
	{ class: "prompt" },
	" "
]]), lf = /* @__PURE__ */ H([[
	"div",
	{
		class: "kpis session-kpis",
		role: "group",
		"aria-label": "Time and lines changed"
	},
	,
]]), uf = /* @__PURE__ */ H([[
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
function df(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Q.session), r = /* @__PURE__ */ k(() => V(n) ? wd(V(n).models, V(n).model_effort, Ui(V(n).models.map((e) => e.model))) : []), i = /* @__PURE__ */ k(() => V(n) ? Cd(V(n).skills, (e) => e.skill) : []), a = /* @__PURE__ */ k(() => V(n) ? Cd(V(n).mcp_servers, (e) => e.mcp_server) : []), o = /* @__PURE__ */ k(() => V(n) ? _u(V(n).api_errors) : []);
	function s(e) {
		V(n) && e.key === "Escape" && !e.defaultPrevented && (location.hash = "");
	}
	var c = U();
	_r("keydown", Qt, s);
	var l = F(c), u = (e) => {
		let t = /* @__PURE__ */ k(() => V(n).session_id), s = /* @__PURE__ */ k(() => V(n).runtime);
		var c = U();
		Vr(F(c), () => V(t), (e) => {
			var c = uf(), l = P(c), u = I(P(l), !0);
			je(4), T(l);
			var d = L(l, 2), f = (e) => {
				var t = cf(), r = I(t, !0);
				R(() => G(r, V(n).prompt)), W(e, t);
			};
			K(d, (e) => {
				V(n).prompt && e(f);
			});
			var p = L(d, 2), m = I(p, !0), h = L(p, 2);
			Zd(h, {});
			var g = L(h, 2);
			Wd(P(g), {
				get totals() {
					return V(n);
				},
				scope: "this session",
				get context() {
					return V(n).context;
				},
				get hintTokens() {
					return V(n).compact_hint_tokens;
				},
				get savings() {
					return V(n).compaction_savings;
				}
			}), T(g);
			var _ = L(g, 2), v = (e) => {
				var t = lf(), r = P(t);
				{
					let e = /* @__PURE__ */ k(() => bd(V(s).source)), t = /* @__PURE__ */ k(() => xd({
						cost: V(n).cost,
						runtime: V(s)
					}));
					Kd(r, {
						get runtime() {
							return V(s);
						},
						get from() {
							return V(e);
						},
						get costPer100Lines() {
							return V(t);
						}
					});
				}
				T(t), W(e, t);
			};
			K(_, (e) => {
				V(s) && e(v);
			});
			var y = L(_, 4);
			{
				let e = /* @__PURE__ */ k(() => $("By model"));
				sf(y, {
					inline: !0,
					id: "session-models",
					get title() {
						return V(e);
					},
					nameLabel: "Model",
					get rows() {
						return V(r);
					},
					empty: "No usage in this range.",
					get pagerKey() {
						return `${V(t) ?? ""}-models`;
					}
				});
			}
			var ee = L(y, 2);
			Md(ee, {
				get agents() {
					return V(n).agents;
				},
				get pagerKey() {
					return `${V(t) ?? ""}-agents`;
				}
			});
			var b = L(ee, 4), x = P(b), S = P(x);
			{
				let e = /* @__PURE__ */ k(() => $("By skill"));
				sf(S, {
					inline: !0,
					id: "session-skills",
					get title() {
						return V(e);
					},
					nameLabel: "Skill",
					get rows() {
						return V(i);
					},
					empty: "No turns attributed to a skill.",
					get pagerKey() {
						return `${V(t) ?? ""}-skills`;
					}
				});
			}
			T(x);
			var te = L(x, 2), ne = P(te);
			{
				let e = /* @__PURE__ */ k(() => $("By MCP server"));
				sf(ne, {
					inline: !0,
					id: "session-mcp-servers",
					get title() {
						return V(e);
					},
					nameLabel: "MCP server",
					get rows() {
						return V(a);
					},
					empty: "No turns attributed to an MCP server.",
					get pagerKey() {
						return `${V(t) ?? ""}-mcp-servers`;
					}
				});
			}
			T(te), T(b);
			var re = L(b, 2);
			{
				let e = /* @__PURE__ */ k(() => $("Rate limits and API errors"));
				Su(re, {
					id: "session-api-errors",
					get title() {
						return V(e);
					},
					get rows() {
						return V(o);
					},
					empty: "No API errors in this session.",
					get pagerKey() {
						return `${V(t) ?? ""}-api-errors`;
					},
					withSession: !1
				});
			}
			je(2), T(c), Zr(c, () => nd({
				hide: ["filters", "summary"],
				focus: "#drilldown-title"
			})), R((e, t) => {
				G(u, e), G(m, t);
			}, [() => pc(V(n)), () => rd(V(n))]), W(e, c);
		}), W(e, c);
	};
	K(l, (e) => {
		V(n) && e(u);
	}), W(e, c), D();
}
//#endregion
//#region src/components/SummaryTiles.svelte
var ff = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	" "
]]);
function pf(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Q.summary);
	var r = U(), i = F(r), a = (e) => {
		var r = U(), i = F(r), a = (e) => {
			{
				let t = /* @__PURE__ */ k(() => dd(V(n)));
				Wd(e, {
					get totals() {
						return V(n).totals;
					},
					get scope() {
						return V(t);
					},
					get context() {
						return V(n).context;
					},
					get hintTokens() {
						return V(n).compact_hint_tokens;
					},
					get savings() {
						return V(n).compaction_savings;
					}
				});
			}
		}, o = (e) => {
			{
				let t = /* @__PURE__ */ k(() => yd(V(n).runtime.sessions));
				Kd(e, {
					get runtime() {
						return V(n).runtime;
					},
					get from() {
						return V(t);
					},
					get costPer100Lines() {
						return V(n).runtime.cost_per_100_lines;
					}
				});
			}
		};
		K(i, (e) => {
			t.rows === "kpis" ? e(a) : e(o, -1);
		}), W(e, r);
	}, o = (e) => {
		var t = ff(), n = I(t, !0);
		R(() => G(n, Q.summaryFailed ? "Could not load the summary." : "Loading…")), W(e, t);
	};
	K(i, (e) => {
		V(n) ? e(a) : t.rows === "kpis" && e(o, 1);
	}), W(e, r), D();
}
//#endregion
//#region src/components/UsageTables.svelte
var mf = /* @__PURE__ */ H([
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
function hf(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => Q.summary), r = /* @__PURE__ */ k(() => V(n) ? Cd(V(n).agent_type, (e) => e.agent_type) : null), i = /* @__PURE__ */ k(() => V(n) ? Ui([...new Set(V(n).day_model.map((e) => e.model))]) : null), a = /* @__PURE__ */ k(() => V(n) && V(i) ? wd(V(n).model, V(n).model_effort, V(i)) : null), o = /* @__PURE__ */ k(() => V(n) ? Cd(V(n).project, (e) => e.project) : null), s = /* @__PURE__ */ k(() => V(n) ? Cd(V(n).skill, (e) => e.skill) : null), c = /* @__PURE__ */ k(() => V(n) ? Cd(V(n).mcp_server, (e) => e.mcp_server) : null);
	var l = mf(), u = F(l), d = P(u);
	{
		let e = /* @__PURE__ */ k(() => $("By agent type"));
		sf(d, {
			id: "by-agent",
			get title() {
				return V(e);
			},
			nameLabel: "Agent type",
			get rows() {
				return V(r);
			},
			empty: "No usage in this range."
		});
	}
	var f = L(d, 2);
	{
		let e = /* @__PURE__ */ k(() => $("By model"));
		sf(f, {
			id: "by-model",
			get title() {
				return V(e);
			},
			nameLabel: "Model",
			get rows() {
				return V(a);
			},
			empty: "No usage in this range."
		});
	}
	T(u);
	var p = L(u, 2);
	{
		let e = /* @__PURE__ */ k(() => $("By project"));
		sf(p, {
			id: "by-project",
			get title() {
				return V(e);
			},
			nameLabel: "Project",
			get rows() {
				return V(o);
			},
			empty: "No usage in this range."
		});
	}
	var m = L(p, 2), h = P(m);
	{
		let e = /* @__PURE__ */ k(() => $("By skill"));
		sf(h, {
			id: "by-skill",
			get title() {
				return V(e);
			},
			note: "turns Claude Code attributes to a skill while it runs",
			nameLabel: "Skill",
			get rows() {
				return V(s);
			},
			empty: "No turns attributed to a skill in this range."
		});
	}
	var g = L(h, 2);
	{
		let e = /* @__PURE__ */ k(() => $("By MCP server"));
		sf(g, {
			id: "by-mcp-server",
			get title() {
				return V(e);
			},
			note: "turns Claude Code attributes to an MCP server's tools",
			nameLabel: "MCP server",
			get rows() {
				return V(c);
			},
			empty: "No turns attributed to an MCP server in this range."
		});
	}
	T(m), W(e, l), D();
}
//#endregion
//#region src/lib/banner.svelte.ts
var gf = class {
	#e = new go();
	#t = /* @__PURE__ */ k(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return V(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, _f = /* @__PURE__ */ t({
	secretReach: () => xf,
	secretTone: () => vf,
	secretVia: () => yf
});
function vf(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function yf(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var bf = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function xf(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(bf, e.reach) ? bf[e.reach] ?? "" : "no result yet";
}
//#endregion
//#region src/legacy.svelte.ts
var Sf = [
	aa,
	Vi,
	Ac,
	_f,
	Bc,
	bo,
	wa,
	Yo,
	rs,
	Es,
	bs,
	_o,
	Ul,
	Zl
];
function Cf(e) {
	let t = new gf(), n = e.document.getElementById("error");
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
	let p = Nr(Mi, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	n.remove();
	let m = r.map(({ id: e, container: t }) => Nr(pf, {
		target: t,
		props: { rows: e }
	})), h = Nr(_l, { target: i }), g = Nr(Hl, { target: a }), _ = Nr(uc, { target: o }), v = Nr(kc, { target: s }), y = Nr(Uu, { target: c }), ee = Nr(hf, { target: l }), b = Nr($u, { target: u }), x = Nr(iu, { target: d }), S = Nr(df, { target: f });
	return e.showError = (e, n) => {
		t.show(e, n), At();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...Sf), { stop() {
		Lr(p);
		for (let e of m) Lr(e);
		Lr(h), Lr(g), Lr(_), Lr(v), Lr(y), Lr(ee), Lr(b), Lr(x), Lr(S), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of Sf.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
Cf(window);
//#endregion

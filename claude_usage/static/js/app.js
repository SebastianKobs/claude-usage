//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, n = Symbol("uninitialized"), r = "http://www.w3.org/2000/svg", i = "http://www.w3.org/1998/Math/MathML", a = Array.isArray, o = Array.prototype.indexOf, s = Array.prototype.includes, c = Array.from, l = Object.defineProperty, u = Object.getOwnPropertyDescriptor, d = Object.prototype, f = Array.prototype, p = Object.getPrototypeOf, m = Object.isExtensible, ee = () => {};
function te(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function ne() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var h = 1024, g = 2048, _ = 4096, re = 8192, ie = 16384, ae = 32768, oe = 1 << 25, se = 65536, ce = 1 << 19, le = 1 << 20, ue = 1 << 21, de = 1 << 22, fe = 1 << 23, pe = Symbol("$state"), me = Symbol("component"), he = Symbol("attributes"), ge = Symbol("class"), _e = Symbol("style"), ve = Symbol("text"), ye = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), be = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function xe() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Se() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ce(e) {
	return e === this.v;
}
function we(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Te(e) {
	return !we(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Ee() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function De() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Oe() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ke() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ae() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function je() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var v = null;
function y(e) {
	v = e;
}
function Me(e, t = !1, n) {
	v = {
		p: v,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: U,
		l: null
	};
}
function Ne(e) {
	var t = v, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Rt(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, v = t.p, Pe(e);
}
function Pe(e = {}) {
	return l(e, me, { value: !0 }), e;
}
function Fe() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var b = [];
function Ie() {
	var e = b;
	b = [], te(e);
}
function x(e) {
	if (b.length === 0 && !E) {
		var t = b;
		queueMicrotask(() => {
			t === b && Ie();
		});
	}
	b.push(e);
}
function Le() {
	for (; b.length > 0;) Ie();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Re = ~(g | _ | h);
function S(e, t) {
	e.f = e.f & Re | t;
}
function ze(e) {
	e.f & 512 || e.deps === null ? S(e, h) : S(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function Be(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), S(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function Ve(e) {
	var t = B, n = U;
	H(null), W(null);
	try {
		return e();
	} finally {
		H(t), W(n);
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function He(e, t, n, r) {
	let i = Fe() ? Ke : Xe;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = U, c = Ue(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				I(e, s);
			}
			We();
		}
	}
	var d = Ge();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Je(e))).then(u).catch((e) => I(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), We();
	}) : f();
}
function Ue() {
	var e = U, t = B, n = v, r = w;
	return function(i = !0) {
		W(e), H(t), y(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function We(e = !0) {
	W(null), H(null), y(null), e && w?.deactivate();
}
function Ge() {
	var e = U, t = e.b, n = w, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ke(e) {
	var t = 2 | g;
	return U !== null && (U.f |= ce), {
		ctx: v,
		deps: null,
		effects: null,
		equals: Ce,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: n,
		wv: 0,
		parent: U,
		ac: null
	};
}
var qe = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Je(e, t, r) {
	let i = U;
	i === null && Ee();
	var a = void 0, o = A(n), s = !B, c = /* @__PURE__ */ new Set();
	return Bt(() => {
		var t = U, n = ne();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ye && n.reject(e);
			}).finally(We);
		} catch (e) {
			n.reject(e), We();
		}
		var r = w;
		if (s) {
			if (t.f & 32768) var l = Ge();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(qe);
			else for (let e of c.values()) e.reject(qe);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== qe && (r.activate(), t ? (o.f |= fe, vt(o, t)) : (o.f & 8388608 && (o.f ^= fe), vt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Lt(() => {
		for (let e of c) e.reject(qe);
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
function Ye(e) {
	let t = /* @__PURE__ */ Ke(e);
	return nn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Xe(e) {
	let t = /* @__PURE__ */ Ke(e);
	return t.equals = Te, t;
}
function Ze(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) R(t[n]);
	}
}
function Qe(e) {
	var t, r = U, i = e.parent;
	if (!z && i !== null && e.v !== n && i.f & 24576) return xe(), e.v;
	W(i);
	try {
		Ze(e), t = un(e);
	} finally {
		W(r);
	}
	return t;
}
function $e(e) {
	var t = Qe(e);
	if (!e.equals(t) && (e.wv = sn(), (!w?.is_fork || e.deps === null) && (w === null ? e.v = t : (w.capture(e, t, !0), nt?.capture(e, t, !0)), e.deps === null))) {
		S(e, h);
		return;
	}
	z || (T === null ? ze(e) : (It() || w?.is_fork) && T.set(e, t));
}
function et(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && Ve(() => {
		t.ac.abort(ye), t.ac = null;
	}), t.fn !== null && (t.teardown = ee), pn(t, 0), Kt(t));
}
function tt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Z(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var C = null, w = null, nt = null, T = null, rt = null, E = !1, it = !1, D = null, at = null, ot = 0, st = 1, ct = class e {
	id = st++;
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
		C === null ? C = this : (C.#n = this, this.#t = C), C = this;
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
			for (var r of n.d) S(r, g), t(r);
			for (r of n.m) S(r, _), t(r);
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
					t.f ^= h;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), S(e, g), this.schedule(e);
		for (let e of this.#d) S(e, _), this.schedule(e);
		this.apply();
		for (var t = D = [], n = [], r = at = []; this.#c.length > 0;) {
			ot++ > 1e3 && (this.#S(), ut());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw mt(e), this.#h() || this.discard(), t;
			}
		}
		if (w = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (D = null, at = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) pt(e, t);
			r.length > 0 && w.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), nt = this, dt(n), dt(t), nt = null, this.#s?.resolve();
		var o = w;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (k.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : cn(r) && (i & 16 && this.#d.add(r), Z(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), S(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), w = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) Be(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), T?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		w = this;
	}
	deactivate() {
		w = null, T = null;
	}
	flush() {
		try {
			it = !0, w = this, this.#_();
		} finally {
			ot = 0, rt = null, D = null, at = null, it = !1, w = null, T = null, k.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(qe);
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
		this.#m || (this.#m = !0, x(() => {
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
		return (this.#s ??= ne()).promise;
	}
	static ensure() {
		if (w === null) {
			let t = w = new e();
			!it && !E && x(() => {
				t.#e || t.flush();
			});
		}
		return w;
	}
	apply() {
		T = null;
	}
	schedule(e) {
		if (rt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? C = e : t.#t = e, this.linked = !1;
		}
	}
};
function lt(e) {
	var t = E;
	E = !0;
	try {
		var n;
		for (e && (w !== null && !w.is_fork && w.flush(), n = e());;) {
			if (Le(), w === null) return n;
			w.flush();
		}
	} finally {
		E = t;
	}
}
function ut() {
	try {
		De();
	} catch (e) {
		I(e, rt);
	}
}
var O = null;
function dt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && cn(r) && (O = /* @__PURE__ */ new Set(), Z(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Yt(r), O?.size > 0)) {
				k.clear();
				for (let e of O) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) O.has(n) && (O.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Z(n);
					}
				}
				O.clear();
			}
		}
		O = null;
	}
}
function ft(e) {
	w.schedule(e);
}
function pt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), S(e, h);
		for (var n = e.first; n !== null;) pt(n, t), n = n.next;
	}
}
function mt(e) {
	S(e, h);
	for (var t = e.first; t !== null;) mt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var ht = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Map(), gt = !1;
function A(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ce,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function j(e, t) {
	let n = A(e, t);
	return nn(n), n;
}
function M(e, t, n = !1) {
	return B !== null && (!V || B.f & 131072) && Fe() && B.f & 4325394 && (G === null || !G.has(e)) && Ae(), vt(e, n ? F(t) : t, at);
}
var N = null, _t = 0;
function vt(e, t, n = null) {
	if (!e.equals(t)) {
		z ? k.set(e, t) : k.has(e) || k.set(e, e.v);
		var r = ct.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Qe(t), T === null && ze(t);
		}
		e.wv = sn(), N = null, _t = 0, bt(e, g, n), N = null, Fe() && U !== null && U.f & 1024 && !(U.f & 96) && (J === null ? rn([e]) : J.push(e)), !r.is_fork && ht.size > 0 && !gt && yt();
	}
	return t;
}
function yt() {
	gt = !1;
	for (let e of ht) {
		e.f & 1024 && S(e, _);
		let t;
		try {
			t = cn(e);
		} catch {
			t = !0;
		}
		t && Z(e);
	}
	ht.clear();
}
function P(e) {
	M(e, e.v + 1);
}
function bt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Fe(), a = r.length;
		if (_t += a, _t > 1e5 && N === null && (N = /* @__PURE__ */ new Set()), N !== null) {
			if (N.has(e)) return;
			N.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== U) {
				var l = (c & g) === 0;
				if (l && S(s, t), c & 131072) ht.add(s);
				else if (c & 2) {
					var u = s;
					T?.delete(u), bt(u, _, n);
				} else if (l) {
					var d = s;
					c & 16 && O !== null && O.add(d), n === null ? ft(d) : n.push(d);
				}
			}
		}
	}
}
function F(e) {
	if (typeof e != "object" || !e || pe in e || me in e) return e;
	let t = p(e);
	if (t !== d && t !== f) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ j(0), s = null, c = X, l = (e) => {
		if (X === c) return e();
		var t = B, n = X;
		H(null), on(c);
		var r = e();
		return H(t), on(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ j(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Oe();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ j(n.value, s);
				return r.set(t, e), e;
			}) : M(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ j(n, s));
					r.set(t, e), P(o);
				}
			} else M(i, n), P(o);
			return !0;
		},
		get(t, i, a) {
			if (i === pe) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ j(F(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
				var d = Q(o);
				return d === n ? void 0 : d;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var i = Reflect.getOwnPropertyDescriptor(e, t), a = r.get(t);
			if (a !== void 0) {
				var o = Q(a);
				if (o === n) return;
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
			var i = r.get(t), a = i !== void 0 && i.v !== n || Reflect.has(e, t);
			return (i !== void 0 || U !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ j(a ? F(e[t]) : n, s)), r.set(t, i)), Q(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ j(n, s)), r.set(p + "", m)) : M(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ j(void 0, s)), M(d, F(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var ee = l(() => F(a));
				M(d, ee);
			}
			var te = Reflect.getOwnPropertyDescriptor(e, t);
			if (te?.set && te.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var ne = r.get("length"), h = Number(t);
					Number.isInteger(h) && h >= ne.v && M(ne, h + 1);
				}
				P(o);
			}
			return !0;
		},
		ownKeys(e) {
			Q(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== n;
			});
			for (var [i, a] of r) a.v !== n && !(i in e) && t.push(i);
			return t;
		},
		setPrototypeOf() {
			ke();
		}
	});
}
var xt, St, Ct, wt;
function Tt() {
	if (xt === void 0) {
		xt = window, St = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Ct = u(t, "firstChild").get, wt = u(t, "nextSibling").get, m(e) && (e[ge] = void 0, e[he] = null, e[_e] = void 0, e.__e = void 0), m(n) && (n[ve] = void 0);
	}
}
function Et(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Dt(e) {
	return Ct.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Ot(e) {
	return wt.call(e);
}
function kt(e, t = !1) {
	return /* @__PURE__ */ Dt(e);
}
function At(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function jt() {
	return document.createDocumentFragment();
}
function Mt(e = "") {
	return document.createComment(e);
}
function Nt(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function Pt(e) {
	var t = U;
	if (t === null) return B.f |= fe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	I(e, t);
}
function I(e, t) {
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
function Ft(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function L(e, t) {
	var n = U;
	n !== null && n.f & 8192 && (e |= re);
	var r = {
		ctx: v,
		deps: null,
		nodes: null,
		f: e | g | 512,
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
	w?.register_created_effect(r);
	var i = r;
	if (e & 4) D === null ? ct.ensure().schedule(r) : D.push(r);
	else if (t !== null) {
		try {
			Z(r);
		} catch (e) {
			throw R(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= se));
	}
	if (i !== null && (i.parent = n, n !== null && Ft(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function It() {
	return B !== null && !V;
}
function Lt(e) {
	let t = L(8, null);
	return S(t, h), t.teardown = e, t;
}
function Rt(e) {
	return L(4 | le, e);
}
function zt(e) {
	ct.ensure();
	let t = L(64 | ce, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Xt(t, () => {
			R(t), n(void 0);
		}) : (R(t), n(void 0));
	});
}
function Bt(e) {
	return L(de | ce, e);
}
function Vt(e, t = 0) {
	return L(8 | t, e);
}
function Ht(e, t = [], n = [], r = []) {
	He(r, t, n, (t) => {
		L(8, () => {
			e(...t.map(Q));
		});
	});
}
function Ut(e, t = 0) {
	return L(16 | t, e);
}
function Wt(e) {
	return L(32 | ce, e);
}
function Gt(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = z, r = B;
		tn(!0), H(null);
		try {
			t.call(null);
		} catch (t) {
			I(t, e.parent);
		} finally {
			tn(n), H(r);
		}
	}
}
function Kt(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && Ve(() => {
			e.abort(ye);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : R(n, t), n = r;
	}
}
function qt(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || R(t), t = n;
	}
}
function R(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Jt(e.nodes.start, e.nodes.end), n = !0), e.f |= oe, Kt(e, t && !n), pn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Gt(e), e.f ^= oe, e.f |= ie;
	var i = e.parent;
	i !== null && i.first !== null && Yt(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Jt(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Ot(e);
		e.remove(), e = n;
	}
}
function Yt(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Xt(e, t, n = !0) {
	var r = [];
	e.f |= 256, Zt(e, r, !0);
	var i = () => {
		n && R(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Zt(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= re;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Zt(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Qt(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Ot(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var $t = null, en = !1, z = !1;
function tn(e) {
	z = e;
}
var B = null, V = !1;
function H(e) {
	B = e;
}
var U = null;
function W(e) {
	U = e;
}
var G = null;
function nn(e) {
	B !== null && (B.f & 2097152 || B.f & 2) && (G ??= /* @__PURE__ */ new Set()).add(e);
}
var K = null, q = 0, J = null;
function rn(e) {
	J = e;
}
var an = 1, Y = 0, X = Y;
function on(e) {
	X = e;
}
function sn() {
	return ++an;
}
function cn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (cn(a) && $e(a), a.wv > e.wv) return !0;
		}
		t & 512 && T === null && S(e, h);
	}
	return !1;
}
function ln(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(G !== null && G.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ln(a, t, !1) : t === a && (n ? S(a, g) : a.f & 1024 && S(a, _), ft(a));
	}
}
function un(e) {
	var t = K, n = q, r = J, i = B, a = G, o = v, s = V, c = X, l = e.f;
	K = null, q = 0, J = null, B = l & 96 ? null : e, G = null, y(e.ctx), V = !1, X = ++Y, e.ac !== null && (Ve(() => {
		e.ac.abort(ye);
	}), e.ac = null);
	try {
		e.f |= ue;
		var u = e.fn, d = u();
		e.f |= ae;
		var f = dn(e);
		if (Fe() && J !== null && !V && f !== null && !(e.f & 6146)) for (var p = 0; p < J.length; p++) ln(J[p], e);
		if (i !== null && i !== e) {
			if (Y++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Y;
			if (t !== null) for (let e of t) e.rv = Y;
			J !== null && (r === null ? r = J : r.push(...J));
		}
		return e.f & 8388608 && (e.f ^= fe), d;
	} catch (t) {
		return dn(e), Pt(t);
	} finally {
		e.f ^= ue, K = t, q = n, J = r, B = i, G = a, y(o), V = s, X = c;
	}
}
function dn(e) {
	var t = e.deps, n = w?.is_fork;
	if (K !== null) {
		var r;
		if (n || pn(e, q), t !== null && q > 0) for (t.length = q + K.length, r = 0; r < K.length; r++) t[q + r] = K[r];
		else e.deps = t = K;
		if (It() && e.f & 512) for (r = q; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && q < t.length && (pn(e, q), t.length = q);
	return t;
}
function fn(e, t) {
	let r = t.reactions;
	if (r !== null) {
		var i = o.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = t.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && t.f & 2 && (K === null || !s.call(K, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512), c.v !== n && ze(c), c.ac !== null && Ve(() => {
			c.ac.abort(ye), c.ac = null, S(c, g);
		}), et(c), pn(c, 0);
	}
}
function pn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) fn(e, n[r]);
}
function Z(e) {
	var t = e.f;
	if (!(t & 16384)) {
		S(e, h);
		var n = U, r = en;
		U = e, en = !(t & 96);
		try {
			t & 16777232 ? qt(e) : Kt(e), Gt(e);
			var i = un(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = an;
		} finally {
			en = r, U = n;
		}
	}
}
function Q(e) {
	var t = !!(e.f & 2);
	if ($t?.add(e), B !== null && !V && !(U !== null && U.f & 16384) && (G === null || !G.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < Y && (e.rv = Y, K === null && n !== null && n[q] === e ? q++ : K === null ? K = [e] : K.push(e));
		else {
			B.deps ??= [], s.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : s.call(r, B) || r.push(B);
		}
	}
	if (z && k.has(e)) return k.get(e);
	if (t) {
		var i = e;
		if (z) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || hn(i)) && (a = Qe(i)), k.set(i, a), a;
		}
		var o = !(i.f & 512) && !V && B !== null && (en || !!(B.f & 512)), c = (i.f & ae) === 0;
		cn(i) && (o && (i.f |= 512), $e(i)), o && !c && (tt(i), mn(i));
	}
	if (T?.has(e)) return T.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function mn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (tt(t), mn(t));
}
function hn(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (k.has(t) || t.f & 2 && hn(t)) return !0;
	return !1;
}
function gn(e) {
	var t = V;
	try {
		return V = !0, e();
	} finally {
		V = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var _n = Symbol("events"), vn = /* @__PURE__ */ new Set(), yn = /* @__PURE__ */ new Set(), bn = null, xn = !1;
function Sn(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	bn = e, xn || (xn = !0, setTimeout(() => {
		xn = !1, bn = null;
	}));
	var o = 0, s = bn === e && e[_n];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[_n] = t;
			return;
		}
		var u = i.indexOf(t);
		if (u === -1) return;
		c <= u && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		l(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var d = B, f = U;
		H(null), W(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var ee = a[_n]?.[r];
					ee != null && (!a.disabled || e.target === a) && ee.call(a, e);
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
			e[_n] = t, delete e.currentTarget, H(d), W(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var Cn = be ? "template" : "TEMPLATE";
function wn(e, t) {
	var n = U;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function Tn(e, t) {
	var n = jt();
	for (var a of e) {
		if (typeof a == "string") {
			n.append(Et(a));
			continue;
		}
		if (a === void 0 || a[0][0] === "/") {
			n.append(Mt(a ? a[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = a, u = e === "svg" ? r : e === "math" ? i : t;
		var o = At(e, u, c?.is);
		for (var s in c) Nt(o, s, c[s]);
		l.length > 0 && (o.nodeName === Cn ? o.content : o).append(Tn(l, o.nodeName === "foreignObject" ? void 0 : u)), n.append(o);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function En(e, t) {
	var n = !!(t & 1), a = !!(t & 2), o;
	return () => {
		o === void 0 && (o = Tn(e, t & 4 ? r : t & 8 ? i : void 0), n || (o = /* @__PURE__ */ Dt(o)));
		var s = a || St ? document.importNode(o, !0) : o.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ Dt(s), l = s.lastChild;
			wn(c, l);
		} else wn(s, s);
		return s;
	};
}
function Dn(e, t) {
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var On = ["touchstart", "touchmove"];
function kn(e) {
	return On.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function An(e) {
	let t = 0, n = A(0), r;
	return () => {
		It() && (Q(n), Vt(() => (t === 0 && (r = gn(() => e(() => P(n)))), t += 1, () => {
			x(() => {
				--t, t === 0 && (r?.(), r = void 0, P(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var jn = se | ce;
function Mn(e, t, n, r) {
	new Nn(e, t, n, r);
}
var Nn = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t;
	#n;
	#r;
	#i = null;
	#a = null;
	#o = null;
	#s = null;
	#c = 0;
	#l = 0;
	#u = !1;
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Set();
	#p = null;
	#m = An(() => (this.#p = A(this.#c), () => {
		this.#p = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#t = t, this.#n = (e) => {
			var t = U;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = U.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#r = Ut(() => {
			this.#g();
		}, jn);
	}
	#h(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Se();
				return;
			}
			t = !0, n && je(), this.#o !== null && Xt(this.#o, () => {
				this.#o = null;
			}), this.#v(() => {
				this.#g();
			});
		};
		return {
			reset: r,
			invoke_onerror: () => {
				try {
					n = !0, this.#t.onerror?.(e, r), n = !1;
				} catch (e) {
					I(e, this.#r && this.#r.parent);
				}
			}
		};
	}
	#g() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#l = 0, this.#c = 0, this.#i = Wt(() => {
				this.#n(this.#e);
			}), this.#l > 0) {
				var e = this.#s = document.createDocumentFragment();
				Qt(this.#i, e);
				let t = this.#t.pending;
				this.#a = Wt(() => t(this.#e));
			} else this.#_(w);
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		this.is_pending = !1, e.transfer_effects(this.#d, this.#f);
	}
	defer_effect(e) {
		Be(e, this.#d, this.#f);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#t.pending;
	}
	#v(e) {
		var t = U, n = B, r = v;
		W(this.#r), H(this.#r), y(this.#r.ctx);
		try {
			return ct.ensure(), e();
		} finally {
			W(t), H(n), y(r);
		}
	}
	#y(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#y(e, t);
			return;
		}
		this.#l += e, this.#l === 0 && (this.#_(t), this.#a && Xt(this.#a, () => {
			this.#a = null;
		}), this.#s &&= (this.#e.before(this.#s), null));
	}
	update_pending_count(e, t) {
		this.#y(e, t), this.#c += e, !(!this.#p || this.#u) && (this.#u = !0, x(() => {
			this.#u = !1, this.#p && vt(this.#p, this.#c);
		}));
	}
	get_effect_pending() {
		return this.#m(), Q(this.#p);
	}
	error(e) {
		if (!this.#t.onerror && !this.#t.failed) throw e;
		w?.is_fork ? (this.#i && w.skip_effect(this.#i), this.#a && w.skip_effect(this.#a), this.#o && w.skip_effect(this.#o), w.oncommit(() => {
			this.#b(e);
		})) : this.#b(e);
	}
	#b(e) {
		this.#i &&= (R(this.#i), null), this.#a &&= (R(this.#a), null), this.#o &&= (R(this.#o), null);
		let t = this.#t.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#h(e);
			r(), t && (this.#o = this.#v(() => {
				try {
					return Wt(() => {
						var r = U;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return I(e, this.#r.parent), null;
				}
			}));
		};
		x(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				I(e, this.#r && this.#r.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => I(e, this.#r && this.#r.parent)) : n(t);
		});
	}
};
function Pn(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ve] ??= e.nodeValue) && (e[ve] = n, e.nodeValue = `${n}`);
}
function Fn(e, t) {
	return Ln(e, t);
}
var In = /* @__PURE__ */ new Map();
function Ln(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	Tt();
	var l = void 0, u = zt(() => {
		var o = n ?? t.appendChild(Et());
		Mn(o, { pending: () => {} }, (t) => {
			Me({});
			var n = v;
			a && (n.c = a), i && (r.$$events = i), l = e(t, r) || Pe(), Ne();
		}, s);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = kn(r);
					for (let e of [t, document]) {
						var a = In.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), In.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Sn, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(c(vn)), yn.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = In.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Sn), r.delete(e), r.size === 0 && In.delete(n)) : r.set(e, i);
			}
			yn.delete(d), o !== n && o.parentNode?.removeChild(o);
		};
	});
	return Rn.set(l, u), l;
}
var Rn = /* @__PURE__ */ new WeakMap();
function zn(e, t) {
	let n = Rn.get(e);
	return n ? (Rn.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var Bn = /* @__PURE__ */ En([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function Vn(e, t) {
	Me(t, !0);
	var n = Bn(), r = kt(n, !0);
	Ht(() => Pn(r, t.messages.text)), Dn(e, n), Ne();
}
//#endregion
//#region node_modules/svelte/src/reactivity/map.js
var Hn = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ j(0);
	#n = /* @__PURE__ */ j(0);
	#r = X || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return X === this.#r ? /* @__PURE__ */ j(e) : A(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return Q(this.#t), !1;
		}
		return Q(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				Q(this.#t);
				return;
			}
		}
		return Q(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), M(this.#n, super.size), P(o);
		else if (i !== t) {
			P(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && P(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), M(n, -1)), r && (M(this.#n, super.size), P(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			M(this.#n, 0);
			for (var t of e.values()) M(t, -1);
			P(this.#t), e.clear();
		}
	}
	#a() {
		Q(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) Q(n);
	}
	keys() {
		return Q(this.#t), super.keys();
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
		return Q(this.#n), super.size;
	}
}, Un = class {
	#e = new Hn();
	#t = /* @__PURE__ */ Ye(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return Q(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, Wn = /* @__PURE__ */ t({
	ago: () => ur,
	compact: () => Xn,
	dayText: () => rr,
	duration: () => tr,
	longDay: () => ar,
	longHour: () => cr,
	money: () => $n,
	parseDay: () => nr,
	parseHour: () => or,
	percent: () => er,
	shortDay: () => ir,
	shortHour: () => sr,
	signed: () => Zn,
	when: () => lr,
	whole: () => Qn
}), $ = "–", Gn = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), Kn = new Intl.NumberFormat("en"), qn = {
	month: "short",
	day: "numeric"
}, Jn = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, Yn = {
	hour: "2-digit",
	minute: "2-digit"
};
function Xn(e) {
	return e == null ? $ : Gn.format(e);
}
function Zn(e) {
	return e < 0 ? `−${Xn(-e)}` : `+${Xn(e)}`;
}
function Qn(e) {
	return e == null ? $ : Kn.format(e);
}
function $n(e) {
	return e == null ? $ : Math.abs(e) >= 1e3 ? "$" + Gn.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function er(e, t) {
	if (!t) return $;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function tr(e) {
	if (e == null) return $;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function nr(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function rr(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function ir(e, t) {
	return nr(e).toLocaleDateString(t, qn);
}
function ar(e, t) {
	return nr(e).toLocaleDateString(t, Jn);
}
function or(e) {
	let [t = "", n = "0"] = e.split("T"), r = nr(t);
	return r.setHours(Number(n)), r;
}
function sr(e, t) {
	return or(e).toLocaleTimeString(t, Yn);
}
function cr(e, t) {
	let n = or(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, Yn);
	return `${n.toLocaleDateString(t, Jn)}, ${i(n)}–${i(r)}`;
}
function lr(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...qn,
		...Yn
	}) : $;
}
function ur(e, t = Date.now(), n) {
	if (!e) return $;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : lr(e, n);
}
//#endregion
//#region src/legacy.svelte.ts
function dr(e) {
	let t = new Un(), n = e.document.getElementById("error");
	if (!n?.parentElement) throw Error("The page has no #error placeholder for the banner");
	let r = Fn(Vn, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	return n.remove(), e.showError = (e, n) => {
		t.show(e, n), lt();
	}, e.hasError = (e) => t.has(e), Object.assign(e, Wn), { stop() {
		zn(r), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of Object.keys(Wn)) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
dr(window);
//#endregion

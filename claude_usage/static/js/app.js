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
var h = 1024, g = 2048, _ = 4096, re = 8192, ie = 16384, ae = 32768, oe = 1 << 25, se = 65536, ce = 1 << 19, le = 1 << 20, ue = 1 << 21, de = 1 << 22, fe = 1 << 23, pe = Symbol("$state"), me = Symbol("component"), he = Symbol("attributes"), ge = Symbol("class"), _e = Symbol("style"), ve = Symbol("text"), v = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ye = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function be() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function xe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Se(e) {
	return e === this.v;
}
function Ce(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function we(e) {
	return !Ce(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Te() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ee() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function De() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Oe() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function ke() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ae() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var y = null;
function b(e) {
	y = e;
}
function je(e, t = !1, n) {
	y = {
		p: y,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: H,
		l: null
	};
}
function Me(e) {
	var t = y, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) zt(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, y = t.p, Ne(e);
}
function Ne(e = {}) {
	return l(e, me, { value: !0 }), e;
}
function x() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var S = [];
function Pe() {
	var e = S;
	S = [], te(e);
}
function Fe(e) {
	if (S.length === 0 && !rt) {
		var t = S;
		queueMicrotask(() => {
			t === S && Pe();
		});
	}
	S.push(e);
}
function Ie() {
	for (; S.length > 0;) Pe();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Le = ~(g | _ | h);
function C(e, t) {
	e.f = e.f & Le | t;
}
function Re(e) {
	e.f & 512 || e.deps === null ? C(e, h) : C(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function ze(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), C(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function Be(e) {
	var t = z, n = H;
	V(null), U(null);
	try {
		return e();
	} finally {
		V(t), U(n);
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function Ve(e, t, n, r) {
	let i = x() ? Ge : Ye;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = H, c = He(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				F(e, s);
			}
			Ue();
		}
	}
	var d = We();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ qe(e))).then(u).catch((e) => F(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), Ue();
	}) : f();
}
function He() {
	var e = H, t = z, n = y, r = T;
	return function(i = !0) {
		U(e), V(t), b(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function Ue(e = !0) {
	U(null), V(null), b(null), e && T?.deactivate();
}
function We() {
	var e = H, t = e.b, n = T, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ge(e) {
	var t = 2 | g;
	return H !== null && (H.f |= ce), {
		ctx: y,
		deps: null,
		effects: null,
		equals: Se,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: n,
		wv: 0,
		parent: H,
		ac: null
	};
}
var Ke = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function qe(e, t, r) {
	let i = H;
	i === null && Te();
	var a = void 0, o = k(n), s = !z, c = /* @__PURE__ */ new Set();
	return Vt(() => {
		var t = H, n = ne();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== v && n.reject(e);
			}).finally(Ue);
		} catch (e) {
			n.reject(e), Ue();
		}
		var r = T;
		if (s) {
			if (t.f & 32768) var l = We();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(Ke);
			else for (let e of c.values()) e.reject(Ke);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== Ke && (r.activate(), t ? (o.f |= fe, yt(o, t)) : (o.f & 8388608 && (o.f ^= fe), yt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Rt(() => {
		for (let e of c) e.reject(Ke);
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
function Je(e) {
	let t = /* @__PURE__ */ Ge(e);
	return rn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Ye(e) {
	let t = /* @__PURE__ */ Ge(e);
	return t.equals = we, t;
}
function Xe(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) L(t[n]);
	}
}
function Ze(e) {
	var t, r = H, i = e.parent;
	if (!R && i !== null && e.v !== n && i.f & 24576) return be(), e.v;
	U(i);
	try {
		Xe(e), t = dn(e);
	} finally {
		U(r);
	}
	return t;
}
function Qe(e) {
	var t = Ze(e);
	if (!e.equals(t) && (e.wv = cn(), (!T?.is_fork || e.deps === null) && (T === null ? e.v = t : (T.capture(e, t, !0), tt?.capture(e, t, !0)), e.deps === null))) {
		C(e, h);
		return;
	}
	R || (E === null ? Re(e) : (Lt() || T?.is_fork) && E.set(e, t));
}
function $e(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && Be(() => {
		t.ac.abort(v), t.ac = null;
	}), t.fn !== null && (t.teardown = ee), mn(t, 0), qt(t));
}
function et(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && X(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var w = null, T = null, tt = null, E = null, nt = null, rt = !1, it = !1, at = null, ot = null, st = 0, ct = 1, lt = class e {
	id = ct++;
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
		w === null ? w = this : (w.#n = this, this.#t = w), w = this;
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
			for (var r of n.d) C(r, g), t(r);
			for (r of n.m) C(r, _), t(r);
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
		for (let e of this.#u) this.#d.delete(e), C(e, g), this.schedule(e);
		for (let e of this.#d) C(e, _), this.schedule(e);
		this.apply();
		for (var t = at = [], n = [], r = ot = []; this.#c.length > 0;) {
			st++ > 1e3 && (this.#S(), dt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw ht(e), this.#h() || this.discard(), t;
			}
		}
		if (T = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (at = null, ot = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) mt(e, t);
			r.length > 0 && T.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), tt = this, ft(n), ft(t), tt = null, this.#s?.resolve();
		var o = T;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (O.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : ln(r) && (i & 16 && this.#d.add(r), X(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), C(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), T = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) ze(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), E?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		T = this;
	}
	deactivate() {
		T = null, E = null;
	}
	flush() {
		try {
			it = !0, T = this, this.#_();
		} finally {
			st = 0, nt = null, at = null, ot = null, it = !1, T = null, E = null, O.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Ke);
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
		this.#m || (this.#m = !0, Fe(() => {
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
		if (T === null) {
			let t = T = new e();
			!it && !rt && Fe(() => {
				t.#e || t.flush();
			});
		}
		return T;
	}
	apply() {
		E = null;
	}
	schedule(e) {
		if (nt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? w = e : t.#t = e, this.linked = !1;
		}
	}
};
function ut(e) {
	var t = rt;
	rt = !0;
	try {
		var n;
		for (e && (T !== null && !T.is_fork && T.flush(), n = e());;) {
			if (Ie(), T === null) return n;
			T.flush();
		}
	} finally {
		rt = t;
	}
}
function dt() {
	try {
		Ee();
	} catch (e) {
		F(e, nt);
	}
}
var D = null;
function ft(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && ln(r) && (D = /* @__PURE__ */ new Set(), X(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Xt(r), D?.size > 0)) {
				O.clear();
				for (let e of D) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) D.has(n) && (D.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || X(n);
					}
				}
				D.clear();
			}
		}
		D = null;
	}
}
function pt(e) {
	T.schedule(e);
}
function mt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), C(e, h);
		for (var n = e.first; n !== null;) mt(n, t), n = n.next;
	}
}
function ht(e) {
	C(e, h);
	for (var t = e.first; t !== null;) ht(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var gt = /* @__PURE__ */ new Set(), O = /* @__PURE__ */ new Map(), _t = !1;
function k(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Se,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function A(e, t) {
	let n = k(e, t);
	return rn(n), n;
}
function j(e, t, n = !1) {
	return z !== null && (!B || z.f & 131072) && x() && z.f & 4325394 && (W === null || !W.has(e)) && ke(), yt(e, n ? P(t) : t, ot);
}
var M = null, vt = 0;
function yt(e, t, n = null) {
	if (!e.equals(t)) {
		R ? O.set(e, t) : O.has(e) || O.set(e, e.v);
		var r = lt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Ze(t), E === null && Re(t);
		}
		e.wv = cn(), M = null, vt = 0, xt(e, g, n), M = null, x() && H !== null && H.f & 1024 && !(H.f & 96) && (q === null ? an([e]) : q.push(e)), !r.is_fork && gt.size > 0 && !_t && bt();
	}
	return t;
}
function bt() {
	_t = !1;
	for (let e of gt) {
		e.f & 1024 && C(e, _);
		let t;
		try {
			t = ln(e);
		} catch {
			t = !0;
		}
		t && X(e);
	}
	gt.clear();
}
function N(e) {
	j(e, e.v + 1);
}
function xt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = x(), a = r.length;
		if (vt += a, vt > 1e5 && M === null && (M = /* @__PURE__ */ new Set()), M !== null) {
			if (M.has(e)) return;
			M.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== H) {
				var l = (c & g) === 0;
				if (l && C(s, t), c & 131072) gt.add(s);
				else if (c & 2) {
					var u = s;
					E?.delete(u), xt(u, _, n);
				} else if (l) {
					var d = s;
					c & 16 && D !== null && D.add(d), n === null ? pt(d) : n.push(d);
				}
			}
		}
	}
}
function P(e) {
	if (typeof e != "object" || !e || pe in e || me in e) return e;
	let t = p(e);
	if (t !== d && t !== f) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ A(0), s = null, c = Y, l = (e) => {
		if (Y === c) return e();
		var t = z, n = Y;
		V(null), sn(c);
		var r = e();
		return V(t), sn(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ A(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && De();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ A(n.value, s);
				return r.set(t, e), e;
			}) : j(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ A(n, s));
					r.set(t, e), N(o);
				}
			} else j(i, n), N(o);
			return !0;
		},
		get(t, i, a) {
			if (i === pe) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ A(P(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
				var d = Z(o);
				return d === n ? void 0 : d;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var i = Reflect.getOwnPropertyDescriptor(e, t), a = r.get(t);
			if (a !== void 0) {
				var o = Z(a);
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
			return (i !== void 0 || H !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ A(a ? P(e[t]) : n, s)), r.set(t, i)), Z(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ A(n, s)), r.set(p + "", m)) : j(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ A(void 0, s)), j(d, P(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var ee = l(() => P(a));
				j(d, ee);
			}
			var te = Reflect.getOwnPropertyDescriptor(e, t);
			if (te?.set && te.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var ne = r.get("length"), h = Number(t);
					Number.isInteger(h) && h >= ne.v && j(ne, h + 1);
				}
				N(o);
			}
			return !0;
		},
		ownKeys(e) {
			Z(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== n;
			});
			for (var [i, a] of r) a.v !== n && !(i in e) && t.push(i);
			return t;
		},
		setPrototypeOf() {
			Oe();
		}
	});
}
var St, Ct, wt, Tt;
function Et() {
	if (St === void 0) {
		St = window, Ct = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		wt = u(t, "firstChild").get, Tt = u(t, "nextSibling").get, m(e) && (e[ge] = void 0, e[he] = null, e[_e] = void 0, e.__e = void 0), m(n) && (n[ve] = void 0);
	}
}
function Dt(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Ot(e) {
	return wt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function kt(e) {
	return Tt.call(e);
}
function At(e, t = !1) {
	return /* @__PURE__ */ Ot(e);
}
function jt(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Mt() {
	return document.createDocumentFragment();
}
function Nt(e = "") {
	return document.createComment(e);
}
function Pt(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function Ft(e) {
	var t = H;
	if (t === null) return z.f |= fe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	F(e, t);
}
function F(e, t) {
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
function It(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function I(e, t) {
	var n = H;
	n !== null && n.f & 8192 && (e |= re);
	var r = {
		ctx: y,
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
	T?.register_created_effect(r);
	var i = r;
	if (e & 4) at === null ? lt.ensure().schedule(r) : at.push(r);
	else if (t !== null) {
		try {
			X(r);
		} catch (e) {
			throw L(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= se));
	}
	if (i !== null && (i.parent = n, n !== null && It(i, n), z !== null && z.f & 2 && !(e & 64))) {
		var a = z;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Lt() {
	return z !== null && !B;
}
function Rt(e) {
	let t = I(8, null);
	return C(t, h), t.teardown = e, t;
}
function zt(e) {
	return I(4 | le, e);
}
function Bt(e) {
	lt.ensure();
	let t = I(64 | ce, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Zt(t, () => {
			L(t), n(void 0);
		}) : (L(t), n(void 0));
	});
}
function Vt(e) {
	return I(de | ce, e);
}
function Ht(e, t = 0) {
	return I(8 | t, e);
}
function Ut(e, t = [], n = [], r = []) {
	Ve(r, t, n, (t) => {
		I(8, () => {
			e(...t.map(Z));
		});
	});
}
function Wt(e, t = 0) {
	return I(16 | t, e);
}
function Gt(e) {
	return I(32 | ce, e);
}
function Kt(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = R, r = z;
		nn(!0), V(null);
		try {
			t.call(null);
		} catch (t) {
			F(t, e.parent);
		} finally {
			nn(n), V(r);
		}
	}
}
function qt(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && Be(() => {
			e.abort(v);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : L(n, t), n = r;
	}
}
function Jt(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || L(t), t = n;
	}
}
function L(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Yt(e.nodes.start, e.nodes.end), n = !0), e.f |= oe, qt(e, t && !n), mn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Kt(e), e.f ^= oe, e.f |= ie;
	var i = e.parent;
	i !== null && i.first !== null && Xt(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Yt(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ kt(e);
		e.remove(), e = n;
	}
}
function Xt(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Zt(e, t, n = !0) {
	var r = [];
	e.f |= 256, Qt(e, r, !0);
	var i = () => {
		n && L(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Qt(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= re;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Qt(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function $t(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ kt(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var en = null, tn = !1, R = !1;
function nn(e) {
	R = e;
}
var z = null, B = !1;
function V(e) {
	z = e;
}
var H = null;
function U(e) {
	H = e;
}
var W = null;
function rn(e) {
	z !== null && (z.f & 2097152 || z.f & 2) && (W ??= /* @__PURE__ */ new Set()).add(e);
}
var G = null, K = 0, q = null;
function an(e) {
	q = e;
}
var on = 1, J = 0, Y = J;
function sn(e) {
	Y = e;
}
function cn() {
	return ++on;
}
function ln(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (ln(a) && Qe(a), a.wv > e.wv) return !0;
		}
		t & 512 && E === null && C(e, h);
	}
	return !1;
}
function un(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(W !== null && W.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? un(a, t, !1) : t === a && (n ? C(a, g) : a.f & 1024 && C(a, _), pt(a));
	}
}
function dn(e) {
	var t = G, n = K, r = q, i = z, a = W, o = y, s = B, c = Y, l = e.f;
	G = null, K = 0, q = null, z = l & 96 ? null : e, W = null, b(e.ctx), B = !1, Y = ++J, e.ac !== null && (Be(() => {
		e.ac.abort(v);
	}), e.ac = null);
	try {
		e.f |= ue;
		var u = e.fn, d = u();
		e.f |= ae;
		var f = fn(e);
		if (x() && q !== null && !B && f !== null && !(e.f & 6146)) for (var p = 0; p < q.length; p++) un(q[p], e);
		if (i !== null && i !== e) {
			if (J++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = J;
			if (t !== null) for (let e of t) e.rv = J;
			q !== null && (r === null ? r = q : r.push(...q));
		}
		return e.f & 8388608 && (e.f ^= fe), d;
	} catch (t) {
		return fn(e), Ft(t);
	} finally {
		e.f ^= ue, G = t, K = n, q = r, z = i, W = a, b(o), B = s, Y = c;
	}
}
function fn(e) {
	var t = e.deps, n = T?.is_fork;
	if (G !== null) {
		var r;
		if (n || mn(e, K), t !== null && K > 0) for (t.length = K + G.length, r = 0; r < G.length; r++) t[K + r] = G[r];
		else e.deps = t = G;
		if (Lt() && e.f & 512) for (r = K; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && K < t.length && (mn(e, K), t.length = K);
	return t;
}
function pn(e, t) {
	let r = t.reactions;
	if (r !== null) {
		var i = o.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = t.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && t.f & 2 && (G === null || !s.call(G, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512), c.v !== n && Re(c), c.ac !== null && Be(() => {
			c.ac.abort(v), c.ac = null, C(c, g);
		}), $e(c), mn(c, 0);
	}
}
function mn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) pn(e, n[r]);
}
function X(e) {
	var t = e.f;
	if (!(t & 16384)) {
		C(e, h);
		var n = H, r = tn;
		H = e, tn = !(t & 96);
		try {
			t & 16777232 ? Jt(e) : qt(e), Kt(e);
			var i = dn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = on;
		} finally {
			tn = r, H = n;
		}
	}
}
function Z(e) {
	var t = !!(e.f & 2);
	if (en?.add(e), z !== null && !B && !(H !== null && H.f & 16384) && (W === null || !W.has(e))) {
		var n = z.deps;
		if (z.f & 2097152) e.rv < J && (e.rv = J, G === null && n !== null && n[K] === e ? K++ : G === null ? G = [e] : G.push(e));
		else {
			z.deps ??= [], s.call(z.deps, e) || z.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [z] : s.call(r, z) || r.push(z);
		}
	}
	if (R && O.has(e)) return O.get(e);
	if (t) {
		var i = e;
		if (R) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || gn(i)) && (a = Ze(i)), O.set(i, a), a;
		}
		var o = !(i.f & 512) && !B && z !== null && (tn || !!(z.f & 512)), c = (i.f & ae) === 0;
		ln(i) && (o && (i.f |= 512), Qe(i)), o && !c && (et(i), hn(i));
	}
	if (E?.has(e)) return E.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function hn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (et(t), hn(t));
}
function gn(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (O.has(t) || t.f & 2 && gn(t)) return !0;
	return !1;
}
function _n(e) {
	var t = B;
	try {
		return B = !0, e();
	} finally {
		B = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var vn = Symbol("events"), yn = /* @__PURE__ */ new Set(), bn = /* @__PURE__ */ new Set(), xn = null, Sn = !1;
function Cn(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	xn = e, Sn || (Sn = !0, setTimeout(() => {
		Sn = !1, xn = null;
	}));
	var o = 0, s = xn === e && e[vn];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[vn] = t;
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
		var d = z, f = H;
		V(null), U(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var ee = a[vn]?.[r];
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
			e[vn] = t, delete e.currentTarget, V(d), U(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var wn = ye ? "template" : "TEMPLATE";
function Tn(e, t) {
	var n = H;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function En(e, t) {
	var n = Mt();
	for (var a of e) {
		if (typeof a == "string") {
			n.append(Dt(a));
			continue;
		}
		if (a === void 0 || a[0][0] === "/") {
			n.append(Nt(a ? a[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = a, u = e === "svg" ? r : e === "math" ? i : t;
		var o = jt(e, u, c?.is);
		for (var s in c) Pt(o, s, c[s]);
		l.length > 0 && (o.nodeName === wn ? o.content : o).append(En(l, o.nodeName === "foreignObject" ? void 0 : u)), n.append(o);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function Dn(e, t) {
	var n = !!(t & 1), a = !!(t & 2), o;
	return () => {
		o === void 0 && (o = En(e, t & 4 ? r : t & 8 ? i : void 0), n || (o = /* @__PURE__ */ Ot(o)));
		var s = a || Ct ? document.importNode(o, !0) : o.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ Ot(s), l = s.lastChild;
			Tn(c, l);
		} else Tn(s, s);
		return s;
	};
}
function On(e, t) {
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var kn = ["touchstart", "touchmove"];
function An(e) {
	return kn.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function jn(e) {
	let t = 0, n = k(0), r;
	return () => {
		Lt() && (Z(n), Ht(() => (t === 0 && (r = _n(() => e(() => N(n)))), t += 1, () => {
			Fe(() => {
				--t, t === 0 && (r?.(), r = void 0, N(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Mn = se | ce;
function Nn(e, t, n, r) {
	new Pn(e, t, n, r);
}
var Pn = class {
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
	#m = jn(() => (this.#p = k(this.#c), () => {
		this.#p = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#t = t, this.#n = (e) => {
			var t = H;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = H.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#r = Wt(() => {
			this.#g();
		}, Mn);
	}
	#h(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				xe();
				return;
			}
			t = !0, n && Ae(), this.#o !== null && Zt(this.#o, () => {
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
					F(e, this.#r && this.#r.parent);
				}
			}
		};
	}
	#g() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#l = 0, this.#c = 0, this.#i = Gt(() => {
				this.#n(this.#e);
			}), this.#l > 0) {
				var e = this.#s = document.createDocumentFragment();
				$t(this.#i, e);
				let t = this.#t.pending;
				this.#a = Gt(() => t(this.#e));
			} else this.#_(T);
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		this.is_pending = !1, e.transfer_effects(this.#d, this.#f);
	}
	defer_effect(e) {
		ze(e, this.#d, this.#f);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#t.pending;
	}
	#v(e) {
		var t = H, n = z, r = y;
		U(this.#r), V(this.#r), b(this.#r.ctx);
		try {
			return lt.ensure(), e();
		} finally {
			U(t), V(n), b(r);
		}
	}
	#y(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#y(e, t);
			return;
		}
		this.#l += e, this.#l === 0 && (this.#_(t), this.#a && Zt(this.#a, () => {
			this.#a = null;
		}), this.#s &&= (this.#e.before(this.#s), null));
	}
	update_pending_count(e, t) {
		this.#y(e, t), this.#c += e, !(!this.#p || this.#u) && (this.#u = !0, Fe(() => {
			this.#u = !1, this.#p && yt(this.#p, this.#c);
		}));
	}
	get_effect_pending() {
		return this.#m(), Z(this.#p);
	}
	error(e) {
		if (!this.#t.onerror && !this.#t.failed) throw e;
		T?.is_fork ? (this.#i && T.skip_effect(this.#i), this.#a && T.skip_effect(this.#a), this.#o && T.skip_effect(this.#o), T.oncommit(() => {
			this.#b(e);
		})) : this.#b(e);
	}
	#b(e) {
		this.#i &&= (L(this.#i), null), this.#a &&= (L(this.#a), null), this.#o &&= (L(this.#o), null);
		let t = this.#t.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#h(e);
			r(), t && (this.#o = this.#v(() => {
				try {
					return Gt(() => {
						var r = H;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return F(e, this.#r.parent), null;
				}
			}));
		};
		Fe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				F(e, this.#r && this.#r.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => F(e, this.#r && this.#r.parent)) : n(t);
		});
	}
};
function Fn(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ve] ??= e.nodeValue) && (e[ve] = n, e.nodeValue = `${n}`);
}
function In(e, t) {
	return Rn(e, t);
}
var Ln = /* @__PURE__ */ new Map();
function Rn(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	Et();
	var l = void 0, u = Bt(() => {
		var o = n ?? t.appendChild(Dt());
		Nn(o, { pending: () => {} }, (t) => {
			je({});
			var n = y;
			a && (n.c = a), i && (r.$$events = i), l = e(t, r) || Ne(), Me();
		}, s);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = An(r);
					for (let e of [t, document]) {
						var a = Ln.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Ln.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Cn, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(c(yn)), bn.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Ln.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Cn), r.delete(e), r.size === 0 && Ln.delete(n)) : r.set(e, i);
			}
			bn.delete(d), o !== n && o.parentNode?.removeChild(o);
		};
	});
	return zn.set(l, u), l;
}
var zn = /* @__PURE__ */ new WeakMap();
function Bn(e, t) {
	let n = zn.get(e);
	return n ? (zn.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var Vn = /* @__PURE__ */ Dn([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function Hn(e, t) {
	je(t, !0);
	var n = Vn(), r = At(n, !0);
	Ut(() => Fn(r, t.messages.text)), On(e, n), Me();
}
//#endregion
//#region node_modules/svelte/src/reactivity/map.js
var Un = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ A(0);
	#n = /* @__PURE__ */ A(0);
	#r = Y || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return Y === this.#r ? /* @__PURE__ */ A(e) : k(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return Z(this.#t), !1;
		}
		return Z(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				Z(this.#t);
				return;
			}
		}
		return Z(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), j(this.#n, super.size), N(o);
		else if (i !== t) {
			N(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && N(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), j(n, -1)), r && (j(this.#n, super.size), N(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			j(this.#n, 0);
			for (var t of e.values()) j(t, -1);
			N(this.#t), e.clear();
		}
	}
	#a() {
		Z(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) Z(n);
	}
	keys() {
		return Z(this.#t), super.keys();
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
		return Z(this.#n), super.size;
	}
}, Wn = class {
	#e = new Un();
	#t = /* @__PURE__ */ Je(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return Z(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, Gn = /* @__PURE__ */ t({
	BACKGROUND_EFFORT: () => Xn,
	EFFORT_ORDER: () => Jn,
	EFFORT_SHADES: () => $n,
	HATCH_SHADES: () => er,
	HATCH_TURNS: () => tr,
	KNOWN_MODELS: () => Kn,
	SLOT_COUNT: () => 8,
	effortHatch: () => or,
	effortLabel: () => Qn,
	effortName: () => Zn,
	effortRank: () => Yn,
	effortShade: () => ar,
	hatchTurn: () => sr,
	modelSlots: () => qn,
	shade: () => ir,
	slotColor: () => rr,
	swatchFill: () => cr
}), Kn = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function qn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Kn.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !Kn.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var Jn = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function Yn(e) {
	let t = Jn.indexOf(e);
	return t === -1 ? Jn.length : t;
}
var Xn = "background";
function Zn(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function Qn(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var $n = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, er = {
	background: 1,
	ultracode: 4
}, tr = {
	background: -45,
	ultracode: 45
};
function nr(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function rr(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function ir(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? rr(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function ar(e, t) {
	return ir(e, nr($n, t) ?? 0);
}
function or(e, t) {
	let n = nr(er, t);
	return n ? ir(e, n) : null;
}
function sr(e) {
	return nr(tr, e);
}
function cr(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var lr = /* @__PURE__ */ t({
	ago: () => Or,
	compact: () => hr,
	dayText: () => xr,
	duration: () => yr,
	longDay: () => Cr,
	longHour: () => Er,
	money: () => _r,
	parseDay: () => br,
	parseHour: () => wr,
	percent: () => vr,
	shortDay: () => Sr,
	shortHour: () => Tr,
	signed: () => gr,
	when: () => Dr,
	whole: () => $
}), Q = "–", ur = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), dr = new Intl.NumberFormat("en"), fr = {
	month: "short",
	day: "numeric"
}, pr = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, mr = {
	hour: "2-digit",
	minute: "2-digit"
};
function hr(e) {
	return e == null ? Q : ur.format(e);
}
function gr(e) {
	return e < 0 ? `−${hr(-e)}` : `+${hr(e)}`;
}
function $(e) {
	return e == null ? Q : dr.format(e);
}
function _r(e) {
	return e == null ? Q : Math.abs(e) >= 1e3 ? "$" + ur.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function vr(e, t) {
	if (!t) return Q;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function yr(e) {
	if (e == null) return Q;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function br(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function xr(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function Sr(e, t) {
	return br(e).toLocaleDateString(t, fr);
}
function Cr(e, t) {
	return br(e).toLocaleDateString(t, pr);
}
function wr(e) {
	let [t = "", n = "0"] = e.split("T"), r = br(t);
	return r.setHours(Number(n)), r;
}
function Tr(e, t) {
	return wr(e).toLocaleTimeString(t, mr);
}
function Er(e, t) {
	let n = wr(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, mr);
	return `${n.toLocaleDateString(t, pr)}, ${i(n)}–${i(r)}`;
}
function Dr(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...fr,
		...mr
	}) : Q;
}
function Or(e, t = Date.now(), n) {
	if (!e) return Q;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : Dr(e, n);
}
//#endregion
//#region src/lib/compact.ts
var kr = /* @__PURE__ */ t({
	PAYOFF_WORDS: () => Ar,
	compactCallKind: () => Fr,
	compactionTotal: () => Rr,
	delegateCallShown: () => Ir,
	payoffAhead: () => Nr,
	payoffText: () => Pr,
	payoffTone: () => Mr,
	spread: () => jr,
	verdictTone: () => Lr
}), Ar = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function jr(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function Mr(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function Nr(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${$(t.pays_later_in)} replies`;
		return `${Ar.later}: growing at its recent pace, the context reaches about ${hr(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = $(Math.round(t.calls_ahead));
	return `${Ar[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function Pr(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${_r(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${$(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : $(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${$(e.breakeven_low)} replies)` : `would pay off after about ${$(e.breakeven_calls)} replies` + jr(r(e.breakeven_low), r(e.breakeven_high));
}
function Fr(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function Ir(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function Lr(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function Rr(e) {
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
var zr = /* @__PURE__ */ t({
	liveCompactBadge: () => Hr,
	liveSecretBadge: () => Vr,
	liveStateBadges: () => Ur,
	liveWaitBadge: () => Br,
	sessionWaits: () => Wr,
	waitChanged: () => Gr
});
function Br(e) {
	if (!e) return null;
	let t = ` since ${Dr(e.since)}`;
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
function Vr(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${$(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${$(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function Hr(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${hr(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = Mr(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if (Fr({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${_r(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${$(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${Ar[l]}: compacting now ${m}, ~${$(Math.round(f))} ahead on average.`);
}
function Ur(e, t) {
	return [Vr(e.secrets), Hr(e.current, t)].filter((e) => e !== null);
}
function Wr(e, t) {
	let n = Br(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : Br(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function Gr(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/lib/secrets.ts
var Kr = /* @__PURE__ */ t({
	secretReach: () => Xr,
	secretTone: () => qr,
	secretVia: () => Jr
});
function qr(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function Jr(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var Yr = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function Xr(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(Yr, e.reach) ? Yr[e.reach] ?? "" : "no result yet";
}
//#endregion
//#region src/lib/tables.ts
var Zr = /* @__PURE__ */ t({
	DEFAULT_PAGE_SIZE: () => 25,
	PAGE_SIZES: () => Qr,
	TOOL_KINDS: () => oi,
	chatRows: () => yi,
	detailNoun: () => fi,
	emptyDetail: () => li,
	entryKey: () => vi,
	kindLabel: () => ci,
	orderedEntries: () => _i,
	pageSizeFrom: () => ni,
	pageText: () => ti,
	pageUnits: () => $r,
	pageWindow: () => ei,
	sessionCount: () => ai,
	sessionMatches: () => ri,
	sessionProjects: () => ii,
	toolFolds: () => hi,
	toolRowClass: () => pi,
	toolRowName: () => mi,
	toolRowShown: () => gi,
	toolTableRows: () => si,
	toolsAndChat: () => bi
}), Qr = [
	10,
	25,
	50
];
function $r(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function ei(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function ti(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function ni(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function ri(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function ii(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
function ai(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var oi = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function si(e) {
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
function ci(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function li(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var ui = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, di = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function fi(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn(di, e.tool) && di[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(ui, n) && ui[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function pi(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function mi(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: ci(e, oi)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || li(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function hi(e) {
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
			label: `${$(a)} ${fi(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function gi(e, t) {
	return e.every((e) => t.has(e));
}
function _i(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function vi(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function yi(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return _i(e, t).map((e) => ({
		key: vi(e, n.get(e) ?? 0),
		entry: e
	}));
}
function bi(e, t, n) {
	return e ? [n, t] : [t, n];
}
//#endregion
//#region src/legacy.svelte.ts
var xi = [
	lr,
	Gn,
	kr,
	Kr,
	zr,
	Zr
];
function Si(e) {
	let t = new Wn(), n = e.document.getElementById("error");
	if (!n?.parentElement) throw Error("The page has no #error placeholder for the banner");
	let r = In(Hn, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	return n.remove(), e.showError = (e, n) => {
		t.show(e, n), ut();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...xi), { stop() {
		Bn(r), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of xi.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
Si(window);
//#endregion

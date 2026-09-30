//#region node_modules/svelte/src/constants.js
var e = Symbol("uninitialized"), t = "http://www.w3.org/2000/svg", n = "http://www.w3.org/1998/Math/MathML", r = Array.isArray, i = Array.prototype.indexOf, a = Array.prototype.includes, o = Array.from, s = Object.defineProperty, c = Object.getOwnPropertyDescriptor, l = Object.prototype, u = Array.prototype, d = Object.getPrototypeOf, f = Object.isExtensible, p = () => {};
function m(e) {
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
var h = 1024, g = 2048, _ = 4096, te = 8192, ne = 16384, re = 32768, ie = 1 << 25, ae = 65536, v = 1 << 19, oe = 1 << 20, se = 1 << 21, ce = 1 << 22, le = 1 << 23, ue = Symbol("$state"), de = Symbol("component"), fe = Symbol("attributes"), pe = Symbol("class"), me = Symbol("style"), he = Symbol("text"), y = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ge = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function _e() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function ve() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function ye(e) {
	return e === this.v;
}
function be(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function xe(e) {
	return !be(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Se() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ce() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function we() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Te() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ee() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function De() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var b = null;
function x(e) {
	b = e;
}
function Oe(e, t = !1, n) {
	b = {
		p: b,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: W,
		l: null
	};
}
function ke(e) {
	var t = b, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Ft(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, b = t.p, Ae(e);
}
function Ae(e = {}) {
	return s(e, de, { value: !0 }), e;
}
function S() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var C = [];
function je() {
	var e = C;
	C = [], m(e);
}
function w(e) {
	if (C.length === 0 && !k) {
		var t = C;
		queueMicrotask(() => {
			t === C && je();
		});
	}
	C.push(e);
}
function Me() {
	for (; C.length > 0;) je();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Ne = ~(g | _ | h);
function T(e, t) {
	e.f = e.f & Ne | t;
}
function Pe(e) {
	e.f & 512 || e.deps === null ? T(e, h) : T(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function Fe(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), T(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function Ie(e) {
	var t = V, n = W;
	U(null), G(null);
	try {
		return e();
	} finally {
		U(t), G(n);
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function Le(e, t, n, r) {
	let i = S() ? Ve : Ge;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = W, c = Re(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				L(e, s);
			}
			ze();
		}
	}
	var d = Be();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Ue(e))).then(u).catch((e) => L(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ze();
	}) : f();
}
function Re() {
	var e = W, t = V, n = b, r = D;
	return function(i = !0) {
		G(e), U(t), x(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ze(e = !0) {
	G(null), U(null), x(null), e && D?.deactivate();
}
function Be() {
	var e = W, t = e.b, n = D, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ve(t) {
	var n = 2 | g;
	return W !== null && (W.f |= v), {
		ctx: b,
		deps: null,
		effects: null,
		equals: ye,
		f: n,
		fn: t,
		reactions: null,
		rv: 0,
		v: e,
		wv: 0,
		parent: W,
		ac: null
	};
}
var He = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Ue(t, n, r) {
	let i = W;
	i === null && Se();
	var a = void 0, o = M(e), s = !V, c = /* @__PURE__ */ new Set();
	return Lt(() => {
		var e = W, n = ee();
		a = n.promise;
		try {
			Promise.resolve(t()).then(n.resolve, (e) => {
				e !== y && n.reject(e);
			}).finally(ze);
		} catch (e) {
			n.reject(e), ze();
		}
		var r = D;
		if (s) {
			if (e.f & 32768) var l = Be();
			if (i.b?.is_rendered()) r.async_deriveds.get(e)?.reject(He);
			else for (let e of c.values()) e.reject(He);
			c.add(n), r.async_deriveds.set(e, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== He && (r.activate(), t ? (o.f |= le, mt(o, t)) : (o.f & 8388608 && (o.f ^= le), mt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Pt(() => {
		for (let e of c) e.reject(He);
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
function We(e) {
	let t = /* @__PURE__ */ Ve(e);
	return $t(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Ge(e) {
	let t = /* @__PURE__ */ Ve(e);
	return t.equals = xe, t;
}
function Ke(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) z(t[n]);
	}
}
function qe(t) {
	var n, r = W, i = t.parent;
	if (!B && i !== null && t.v !== e && i.f & 24576) return _e(), t.v;
	G(i);
	try {
		Ke(t), n = sn(t);
	} finally {
		G(r);
	}
	return n;
}
function Je(e) {
	var t = qe(e);
	if (!e.equals(t) && (e.wv = rn(), (!D?.is_fork || e.deps === null) && (D === null ? e.v = t : (D.capture(e, t, !0), Ze?.capture(e, t, !0)), e.deps === null))) {
		T(e, h);
		return;
	}
	B || (O === null ? Pe(e) : (Nt() || D?.is_fork) && O.set(e, t));
}
function Ye(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && Ie(() => {
		t.ac.abort(y), t.ac = null;
	}), t.fn !== null && (t.teardown = p), un(t, 0), Ut(t));
}
function Xe(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Q(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var E = null, D = null, Ze = null, O = null, Qe = null, k = !1, $e = !1, et = null, tt = null, nt = 0, rt = 1, it = class t {
	id = rt++;
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
		E === null ? E = this : (E.#n = this, this.#t = E), E = this;
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
			for (var r of n.d) T(r, g), t(r);
			for (r of n.m) T(r, _), t(r);
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
		for (let e of this.#u) this.#d.delete(e), T(e, g), this.schedule(e);
		for (let e of this.#d) T(e, _), this.schedule(e);
		this.apply();
		for (var e = et = [], n = [], r = tt = []; this.#c.length > 0;) {
			nt++ > 1e3 && (this.#S(), ot());
			for (let t of this.#g()) try {
				this.#v(t, e, n);
			} catch (e) {
				throw ut(t), this.#h() || this.discard(), e;
			}
		}
		if (D = null, r.length > 0) {
			var i = t.ensure();
			for (let e of r) i.schedule(e);
		}
		if (et = null, tt = null, this.#h()) {
			this.#x(n), this.#x(e);
			for (let [e, t] of this.#f) lt(e, t);
			r.length > 0 && D.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(e), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Ze = this, st(n), st(e), Ze = null, this.#s?.resolve();
		var o = D;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (j.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : an(r) && (i & 16 && this.#d.add(r), Q(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), T(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), D = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) Fe(e[t], this.#u, this.#d);
	}
	capture(t, n, r = !1) {
		t.v !== e && !this.previous.has(t) && this.previous.set(t, t.v), t.f & 8388608 || (this.current.set(t, [n, r]), O?.set(t, n)), this.is_fork || (t.v = n);
	}
	activate() {
		D = this;
	}
	deactivate() {
		D = null, O = null;
	}
	flush() {
		try {
			$e = !0, D = this, this.#_();
		} finally {
			nt = 0, Qe = null, et = null, tt = null, $e = !1, D = null, O = null, j.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(He);
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
		this.#m || (this.#m = !0, w(() => {
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
		if (D === null) {
			let e = D = new t();
			!$e && !k && w(() => {
				e.#e || e.flush();
			});
		}
		return D;
	}
	apply() {
		O = null;
	}
	schedule(e) {
		if (Qe = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? E = e : t.#t = e, this.linked = !1;
		}
	}
};
function at(e) {
	var t = k;
	k = !0;
	try {
		var n;
		for (e && (D !== null && !D.is_fork && D.flush(), n = e());;) {
			if (Me(), D === null) return n;
			D.flush();
		}
	} finally {
		k = t;
	}
}
function ot() {
	try {
		Ce();
	} catch (e) {
		L(e, Qe);
	}
}
var A = null;
function st(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && an(r) && (A = /* @__PURE__ */ new Set(), Q(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Kt(r), A?.size > 0)) {
				j.clear();
				for (let e of A) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) A.has(n) && (A.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Q(n);
					}
				}
				A.clear();
			}
		}
		A = null;
	}
}
function ct(e) {
	D.schedule(e);
}
function lt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), T(e, h);
		for (var n = e.first; n !== null;) lt(n, t), n = n.next;
	}
}
function ut(e) {
	T(e, h);
	for (var t = e.first; t !== null;) ut(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var dt = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Map(), ft = !1;
function M(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: ye,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t) {
	let n = M(e, t);
	return $t(n), n;
}
function P(e, t, n = !1) {
	return V !== null && (!H || V.f & 131072) && S() && V.f & 4325394 && (K === null || !K.has(e)) && Ee(), mt(e, n ? _t(t) : t, tt);
}
var F = null, pt = 0;
function mt(e, t, n = null) {
	if (!e.equals(t)) {
		B ? j.set(e, t) : j.has(e) || j.set(e, e.v);
		var r = it.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && qe(t), O === null && Pe(t);
		}
		e.wv = rn(), F = null, pt = 0, gt(e, g, n), F = null, S() && W !== null && W.f & 1024 && !(W.f & 96) && (Y === null ? en([e]) : Y.push(e)), !r.is_fork && dt.size > 0 && !ft && ht();
	}
	return t;
}
function ht() {
	ft = !1;
	for (let e of dt) {
		e.f & 1024 && T(e, _);
		let t;
		try {
			t = an(e);
		} catch {
			t = !0;
		}
		t && Q(e);
	}
	dt.clear();
}
function I(e) {
	P(e, e.v + 1);
}
function gt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = S(), a = r.length;
		if (pt += a, pt > 1e5 && F === null && (F = /* @__PURE__ */ new Set()), F !== null) {
			if (F.has(e)) return;
			F.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== W) {
				var l = (c & g) === 0;
				if (l && T(s, t), c & 131072) dt.add(s);
				else if (c & 2) {
					var u = s;
					O?.delete(u), gt(u, _, n);
				} else if (l) {
					var d = s;
					c & 16 && A !== null && A.add(d), n === null ? ct(d) : n.push(d);
				}
			}
		}
	}
}
function _t(t) {
	if (typeof t != "object" || !t || ue in t || de in t) return t;
	let n = d(t);
	if (n !== l && n !== u) return t;
	var i = /* @__PURE__ */ new Map(), a = r(t), o = /* @__PURE__ */ N(0), s = null, f = Z, p = (e) => {
		if (Z === f) return e();
		var t = V, n = Z;
		U(null), nn(f);
		var r = e();
		return U(t), nn(n), r;
	};
	return a && i.set("length", /* @__PURE__ */ N(t.length, s)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && we();
			var r = i.get(t);
			return r === void 0 ? p(() => {
				var e = /* @__PURE__ */ N(n.value, s);
				return i.set(t, e), e;
			}) : P(r, n.value, !0), !0;
		},
		deleteProperty(t, n) {
			var r = i.get(n);
			if (r === void 0) {
				if (n in t) {
					let t = p(() => /* @__PURE__ */ N(e, s));
					i.set(n, t), I(o);
				}
			} else P(r, e), I(o);
			return !0;
		},
		get(n, r, a) {
			if (r === ue) return t;
			var o = i.get(r), l = r in n;
			if (o === void 0 && (!l || c(n, r)?.writable) && (o = p(() => /* @__PURE__ */ N(_t(l ? n[r] : e), s)), i.set(r, o)), o !== void 0) {
				var u = $(o);
				return u === e ? void 0 : u;
			}
			return Reflect.get(n, r, a);
		},
		getOwnPropertyDescriptor(t, n) {
			this.has?.(t, n);
			var r = Reflect.getOwnPropertyDescriptor(t, n), a = i.get(n);
			if (a !== void 0) {
				var o = $(a);
				if (o === e) return;
				if (r && "value" in r) r.value = o;
				else return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return r;
		},
		has(t, n) {
			if (n === ue) return !0;
			var r = i.get(n), a = r !== void 0 && r.v !== e || Reflect.has(t, n);
			return (r !== void 0 || W !== null && (!a || c(t, n)?.writable)) && (r === void 0 && (r = p(() => /* @__PURE__ */ N(a ? _t(t[n]) : e, s)), i.set(n, r)), $(r) === e) ? !1 : a;
		},
		set(t, n, r, l) {
			var u = i.get(n), d = n in t;
			if (a && n === "length") for (var f = r; f < u.v; f += 1) {
				var m = i.get(f + "");
				m === void 0 ? f in t && (m = p(() => /* @__PURE__ */ N(e, s)), i.set(f + "", m)) : P(m, e);
			}
			if (u === void 0) (!d || c(t, n)?.writable) && (u = p(() => /* @__PURE__ */ N(void 0, s)), P(u, _t(r)), i.set(n, u));
			else {
				d = u.v !== e;
				var ee = p(() => _t(r));
				P(u, ee);
			}
			var h = Reflect.getOwnPropertyDescriptor(t, n);
			if (h?.set && h.set.call(l, r), !d) {
				if (a && typeof n == "string") {
					var g = i.get("length"), _ = Number(n);
					Number.isInteger(_) && _ >= g.v && P(g, _ + 1);
				}
				I(o);
			}
			return !0;
		},
		ownKeys(t) {
			$(o);
			var n = Reflect.ownKeys(t).filter((t) => {
				var n = i.get(t);
				return n === void 0 || n.v !== e;
			});
			for (var [r, a] of i) a.v !== e && !(r in t) && n.push(r);
			return n;
		},
		setPrototypeOf() {
			Te();
		}
	});
}
var vt, yt, bt, xt;
function St() {
	if (vt === void 0) {
		vt = window, yt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		bt = c(t, "firstChild").get, xt = c(t, "nextSibling").get, f(e) && (e[pe] = void 0, e[fe] = null, e[me] = void 0, e.__e = void 0), f(n) && (n[he] = void 0);
	}
}
function Ct(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function wt(e) {
	return bt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Tt(e) {
	return xt.call(e);
}
function Et(e, t = !1) {
	return /* @__PURE__ */ wt(e);
}
function Dt(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Ot() {
	return document.createDocumentFragment();
}
function kt(e = "") {
	return document.createComment(e);
}
function At(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function jt(e) {
	var t = W;
	if (t === null) return V.f |= le, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	L(e, t);
}
function L(e, t) {
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
function Mt(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function R(e, t) {
	var n = W;
	n !== null && n.f & 8192 && (e |= te);
	var r = {
		ctx: b,
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
	D?.register_created_effect(r);
	var i = r;
	if (e & 4) et === null ? it.ensure().schedule(r) : et.push(r);
	else if (t !== null) {
		try {
			Q(r);
		} catch (e) {
			throw z(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ae));
	}
	if (i !== null && (i.parent = n, n !== null && Mt(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Nt() {
	return V !== null && !H;
}
function Pt(e) {
	let t = R(8, null);
	return T(t, h), t.teardown = e, t;
}
function Ft(e) {
	return R(4 | oe, e);
}
function It(e) {
	it.ensure();
	let t = R(64 | v, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? qt(t, () => {
			z(t), n(void 0);
		}) : (z(t), n(void 0));
	});
}
function Lt(e) {
	return R(ce | v, e);
}
function Rt(e, t = 0) {
	return R(8 | t, e);
}
function zt(e, t = [], n = [], r = []) {
	Le(r, t, n, (t) => {
		R(8, () => {
			e(...t.map($));
		});
	});
}
function Bt(e, t = 0) {
	return R(16 | t, e);
}
function Vt(e) {
	return R(32 | v, e);
}
function Ht(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = B, r = V;
		Qt(!0), U(null);
		try {
			t.call(null);
		} catch (t) {
			L(t, e.parent);
		} finally {
			Qt(n), U(r);
		}
	}
}
function Ut(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && Ie(() => {
			e.abort(y);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : z(n, t), n = r;
	}
}
function Wt(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || z(t), t = n;
	}
}
function z(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Gt(e.nodes.start, e.nodes.end), n = !0), e.f |= ie, Ut(e, t && !n), un(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Ht(e), e.f ^= ie, e.f |= ne;
	var i = e.parent;
	i !== null && i.first !== null && Kt(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Gt(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Tt(e);
		e.remove(), e = n;
	}
}
function Kt(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function qt(e, t, n = !0) {
	var r = [];
	e.f |= 256, Jt(e, r, !0);
	var i = () => {
		n && z(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Jt(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= te;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Jt(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Yt(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Tt(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Xt = null, Zt = !1, B = !1;
function Qt(e) {
	B = e;
}
var V = null, H = !1;
function U(e) {
	V = e;
}
var W = null;
function G(e) {
	W = e;
}
var K = null;
function $t(e) {
	V !== null && (V.f & 2097152 || V.f & 2) && (K ??= /* @__PURE__ */ new Set()).add(e);
}
var q = null, J = 0, Y = null;
function en(e) {
	Y = e;
}
var tn = 1, X = 0, Z = X;
function nn(e) {
	Z = e;
}
function rn() {
	return ++tn;
}
function an(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (an(a) && Je(a), a.wv > e.wv) return !0;
		}
		t & 512 && O === null && T(e, h);
	}
	return !1;
}
function on(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(K !== null && K.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? on(a, t, !1) : t === a && (n ? T(a, g) : a.f & 1024 && T(a, _), ct(a));
	}
}
function sn(e) {
	var t = q, n = J, r = Y, i = V, a = K, o = b, s = H, c = Z, l = e.f;
	q = null, J = 0, Y = null, V = l & 96 ? null : e, K = null, x(e.ctx), H = !1, Z = ++X, e.ac !== null && (Ie(() => {
		e.ac.abort(y);
	}), e.ac = null);
	try {
		e.f |= se;
		var u = e.fn, d = u();
		e.f |= re;
		var f = cn(e);
		if (S() && Y !== null && !H && f !== null && !(e.f & 6146)) for (var p = 0; p < Y.length; p++) on(Y[p], e);
		if (i !== null && i !== e) {
			if (X++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = X;
			if (t !== null) for (let e of t) e.rv = X;
			Y !== null && (r === null ? r = Y : r.push(...Y));
		}
		return e.f & 8388608 && (e.f ^= le), d;
	} catch (t) {
		return cn(e), jt(t);
	} finally {
		e.f ^= se, q = t, J = n, Y = r, V = i, K = a, x(o), H = s, Z = c;
	}
}
function cn(e) {
	var t = e.deps, n = D?.is_fork;
	if (q !== null) {
		var r;
		if (n || un(e, J), t !== null && J > 0) for (t.length = J + q.length, r = 0; r < q.length; r++) t[J + r] = q[r];
		else e.deps = t = q;
		if (Nt() && e.f & 512) for (r = J; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && J < t.length && (un(e, J), t.length = J);
	return t;
}
function ln(t, n) {
	let r = n.reactions;
	if (r !== null) {
		var o = i.call(r, t);
		if (o !== -1) {
			var s = r.length - 1;
			s === 0 ? r = n.reactions = null : (r[o] = r[s], r.pop());
		}
	}
	if (r === null && n.f & 2 && (q === null || !a.call(q, n))) {
		var c = n;
		c.f & 512 && (c.f ^= 512), c.v !== e && Pe(c), c.ac !== null && Ie(() => {
			c.ac.abort(y), c.ac = null, T(c, g);
		}), Ye(c), un(c, 0);
	}
}
function un(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) ln(e, n[r]);
}
function Q(e) {
	var t = e.f;
	if (!(t & 16384)) {
		T(e, h);
		var n = W, r = Zt;
		W = e, Zt = !(t & 96);
		try {
			t & 16777232 ? Wt(e) : Ut(e), Ht(e);
			var i = sn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = tn;
		} finally {
			Zt = r, W = n;
		}
	}
}
function $(e) {
	var t = !!(e.f & 2);
	if (Xt?.add(e), V !== null && !H && !(W !== null && W.f & 16384) && (K === null || !K.has(e))) {
		var n = V.deps;
		if (V.f & 2097152) e.rv < X && (e.rv = X, q === null && n !== null && n[J] === e ? J++ : q === null ? q = [e] : q.push(e));
		else {
			V.deps ??= [], a.call(V.deps, e) || V.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [V] : a.call(r, V) || r.push(V);
		}
	}
	if (B && j.has(e)) return j.get(e);
	if (t) {
		var i = e;
		if (B) {
			var o = i.v;
			return (!(i.f & 1024) && i.reactions !== null || fn(i)) && (o = qe(i)), j.set(i, o), o;
		}
		var s = !(i.f & 512) && !H && V !== null && (Zt || !!(V.f & 512)), c = (i.f & re) === 0;
		an(i) && (s && (i.f |= 512), Je(i)), s && !c && (Xe(i), dn(i));
	}
	if (O?.has(e)) return O.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function dn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Xe(t), dn(t));
}
function fn(t) {
	if (t.v === e) return !0;
	if (t.deps === null) return !1;
	for (let e of t.deps) if (j.has(e) || e.f & 2 && fn(e)) return !0;
	return !1;
}
function pn(e) {
	var t = H;
	try {
		return H = !0, e();
	} finally {
		H = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var mn = Symbol("events"), hn = /* @__PURE__ */ new Set(), gn = /* @__PURE__ */ new Set(), _n = null, vn = !1;
function yn(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	_n = e, vn || (vn = !0, setTimeout(() => {
		vn = !1, _n = null;
	}));
	var o = 0, c = _n === e && e[mn];
	if (c) {
		var l = i.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[mn] = t;
			return;
		}
		var u = i.indexOf(t);
		if (u === -1) return;
		l <= u && (o = l);
	}
	if (a = i[o] || e.target, a !== t) {
		s(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var d = V, f = W;
		U(null), G(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var ee = a[mn]?.[r];
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
			e[mn] = t, delete e.currentTarget, U(d), G(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var bn = ge ? "template" : "TEMPLATE";
function xn(e, t) {
	var n = W;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function Sn(e, r) {
	var i = Ot();
	for (var a of e) {
		if (typeof a == "string") {
			i.append(Ct(a));
			continue;
		}
		if (a === void 0 || a[0][0] === "/") {
			i.append(kt(a ? a[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = a, u = e === "svg" ? t : e === "math" ? n : r;
		var o = Dt(e, u, c?.is);
		for (var s in c) At(o, s, c[s]);
		l.length > 0 && (o.nodeName === bn ? o.content : o).append(Sn(l, o.nodeName === "foreignObject" ? void 0 : u)), i.append(o);
	}
	return i;
}
/*#__NO_SIDE_EFFECTS__*/
function Cn(e, r) {
	var i = !!(r & 1), a = !!(r & 2), o;
	return () => {
		o === void 0 && (o = Sn(e, r & 4 ? t : r & 8 ? n : void 0), i || (o = /* @__PURE__ */ wt(o)));
		var s = a || yt ? document.importNode(o, !0) : o.cloneNode(!0);
		if (i) {
			var c = /* @__PURE__ */ wt(s), l = s.lastChild;
			xn(c, l);
		} else xn(s, s);
		return s;
	};
}
function wn(e, t) {
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Tn = ["touchstart", "touchmove"];
function En(e) {
	return Tn.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Dn(e) {
	let t = 0, n = M(0), r;
	return () => {
		Nt() && ($(n), Rt(() => (t === 0 && (r = pn(() => e(() => I(n)))), t += 1, () => {
			w(() => {
				--t, t === 0 && (r?.(), r = void 0, I(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var On = ae | v;
function kn(e, t, n, r) {
	new An(e, t, n, r);
}
var An = class {
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
	#m = Dn(() => (this.#p = M(this.#c), () => {
		this.#p = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#t = t, this.#n = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#r = Bt(() => {
			this.#g();
		}, On);
	}
	#h(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				ve();
				return;
			}
			t = !0, n && De(), this.#o !== null && qt(this.#o, () => {
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
					L(e, this.#r && this.#r.parent);
				}
			}
		};
	}
	#g() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#l = 0, this.#c = 0, this.#i = Vt(() => {
				this.#n(this.#e);
			}), this.#l > 0) {
				var e = this.#s = document.createDocumentFragment();
				Yt(this.#i, e);
				let t = this.#t.pending;
				this.#a = Vt(() => t(this.#e));
			} else this.#_(D);
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		this.is_pending = !1, e.transfer_effects(this.#d, this.#f);
	}
	defer_effect(e) {
		Fe(e, this.#d, this.#f);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#t.pending;
	}
	#v(e) {
		var t = W, n = V, r = b;
		G(this.#r), U(this.#r), x(this.#r.ctx);
		try {
			return it.ensure(), e();
		} finally {
			G(t), U(n), x(r);
		}
	}
	#y(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#y(e, t);
			return;
		}
		this.#l += e, this.#l === 0 && (this.#_(t), this.#a && qt(this.#a, () => {
			this.#a = null;
		}), this.#s &&= (this.#e.before(this.#s), null));
	}
	update_pending_count(e, t) {
		this.#y(e, t), this.#c += e, !(!this.#p || this.#u) && (this.#u = !0, w(() => {
			this.#u = !1, this.#p && mt(this.#p, this.#c);
		}));
	}
	get_effect_pending() {
		return this.#m(), $(this.#p);
	}
	error(e) {
		if (!this.#t.onerror && !this.#t.failed) throw e;
		D?.is_fork ? (this.#i && D.skip_effect(this.#i), this.#a && D.skip_effect(this.#a), this.#o && D.skip_effect(this.#o), D.oncommit(() => {
			this.#b(e);
		})) : this.#b(e);
	}
	#b(e) {
		this.#i &&= (z(this.#i), null), this.#a &&= (z(this.#a), null), this.#o &&= (z(this.#o), null);
		let t = this.#t.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#h(e);
			r(), t && (this.#o = this.#v(() => {
				try {
					return Vt(() => {
						var r = W;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return L(e, this.#r.parent), null;
				}
			}));
		};
		w(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				L(e, this.#r && this.#r.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => L(e, this.#r && this.#r.parent)) : n(t);
		});
	}
};
function jn(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[he] ??= e.nodeValue) && (e[he] = n, e.nodeValue = `${n}`);
}
function Mn(e, t) {
	return Pn(e, t);
}
var Nn = /* @__PURE__ */ new Map();
function Pn(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: s = !0, transformError: c }) {
	St();
	var l = void 0, u = It(() => {
		var s = n ?? t.appendChild(Ct());
		kn(s, { pending: () => {} }, (t) => {
			Oe({});
			var n = b;
			a && (n.c = a), i && (r.$$events = i), l = e(t, r) || Ae(), ke();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = En(r);
					for (let e of [t, document]) {
						var a = Nn.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Nn.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, yn, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(o(hn)), gn.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Nn.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, yn), r.delete(e), r.size === 0 && Nn.delete(n)) : r.set(e, i);
			}
			gn.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Fn.set(l, u), l;
}
var Fn = /* @__PURE__ */ new WeakMap();
function In(e, t) {
	let n = Fn.get(e);
	return n ? (Fn.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var Ln = /* @__PURE__ */ Cn([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function Rn(e, t) {
	Oe(t, !0);
	var n = Ln(), r = Et(n, !0);
	zt(() => jn(r, t.messages.text)), wn(e, n), ke();
}
//#endregion
//#region node_modules/svelte/src/reactivity/map.js
var zn = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ N(0);
	#n = /* @__PURE__ */ N(0);
	#r = Z || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return Z === this.#r ? /* @__PURE__ */ N(e) : M(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return $(this.#t), !1;
		}
		return $(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				$(this.#t);
				return;
			}
		}
		return $(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), P(this.#n, super.size), I(o);
		else if (i !== t) {
			I(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && I(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), P(n, -1)), r && (P(this.#n, super.size), I(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			P(this.#n, 0);
			for (var t of e.values()) P(t, -1);
			I(this.#t), e.clear();
		}
	}
	#a() {
		$(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) $(n);
	}
	keys() {
		return $(this.#t), super.keys();
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
		return $(this.#n), super.size;
	}
}, Bn = class {
	#e = new zn();
	#t = /* @__PURE__ */ We(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return $(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
};
//#endregion
//#region src/legacy.svelte.ts
function Vn(e) {
	let t = new Bn(), n = e.document.getElementById("error");
	if (!n?.parentElement) throw Error("The page has no #error placeholder for the banner");
	let r = Mn(Rn, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	return n.remove(), e.showError = (e, n) => {
		t.show(e, n), at();
	}, e.hasError = (e) => t.has(e), { stop() {
		In(r), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
	} };
}
//#endregion
//#region src/main.ts
Vn(window);
//#endregion

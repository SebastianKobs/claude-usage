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
function b() {
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
var x = 1 << 24, S = 1024, C = 2048, w = 4096, ee = 8192, te = 16384, ne = 32768, re = 1 << 25, ie = 65536, ae = 1 << 19, oe = 1 << 20, se = 1 << 25, ce = 1 << 21, le = 1 << 22, ue = 1 << 23, de = Symbol("$state"), fe = Symbol("component"), pe = Symbol(""), me = Symbol("attributes"), he = Symbol("class"), ge = Symbol("style"), _e = Symbol("text"), ve = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ye = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function be() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function xe(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Se() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ce() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var T = !1;
function we(e) {
	T = e;
}
var E;
function D(e) {
	if (e === null) throw xe(), n;
	return E = e;
}
function Te() {
	return D(/* @__PURE__ */ qt(E));
}
function Ee(e) {
	if (T) {
		if (/* @__PURE__ */ qt(E) !== null) throw xe(), n;
		E = e;
	}
}
function De(e = 1) {
	if (T) {
		for (var t = e, n = E; t--;) n = /* @__PURE__ */ qt(n);
		E = n;
	}
}
function Oe(e = !0) {
	for (var t = 0, n = E;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ qt(n);
		e && n.remove(), n = i;
	}
}
function ke(e) {
	if (!e || e.nodeType !== 8) throw xe(), n;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ae(e) {
	return e === this.v;
}
function je(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Me(e) {
	return !je(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Ne() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Pe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Fe() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ie() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Le() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Re() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function ze() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var O = null;
function Be(e) {
	O = e;
}
function Ve(e, t = !1, n) {
	O = {
		p: O,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: G,
		l: null
	};
}
function He(e) {
	var t = O, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) ln(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, O = t.p, Ue(e);
}
function Ue(e = {}) {
	return d(e, fe, { value: !0 }), e;
}
function We() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ge = [];
function Ke() {
	var e = Ge;
	Ge = [], y(e);
}
function qe(e) {
	if (Ge.length === 0 && !gt) {
		var t = Ge;
		queueMicrotask(() => {
			t === Ge && Ke();
		});
	}
	Ge.push(e);
}
function Je() {
	for (; Ge.length > 0;) Ke();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Ye = ~(C | w | S);
function k(e, t) {
	e.f = e.f & Ye | t;
}
function Xe(e) {
	e.f & 512 || e.deps === null ? k(e, S) : k(e, w);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function Ze(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), k(e, S);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function Qe(e) {
	var t = H, n = G;
	W(null), K(null);
	try {
		return e();
	} finally {
		W(t), K(n);
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function $e(e, t, n, r) {
	let i = We() ? rt : st;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = G, c = et(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				R(e, s);
			}
			tt();
		}
	}
	var d = nt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ at(e))).then(u).catch((e) => R(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), tt();
	}) : f();
}
function et() {
	var e = G, t = H, n = O, r = A;
	return function(i = !0) {
		K(e), W(t), Be(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function tt(e = !0) {
	K(null), W(null), Be(null), e && A?.deactivate();
}
function nt() {
	var e = G, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function rt(e) {
	var t = 2 | C;
	return G !== null && (G.f |= ae), {
		ctx: O,
		deps: null,
		effects: null,
		equals: Ae,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: r,
		wv: 0,
		parent: G,
		ac: null
	};
}
var it = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function at(e, t, n) {
	let i = G;
	i === null && Ne();
	var a = void 0, o = jt(r), s = !H, c = /* @__PURE__ */ new Set();
	return fn(() => {
		var t = G, n = b();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ve && n.reject(e);
			}).finally(tt);
		} catch (e) {
			n.reject(e), tt();
		}
		var r = A;
		if (s) {
			if (t.f & 32768) var l = nt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(it);
			else for (let e of c.values()) e.reject(it);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== it && (r.activate(), t ? (o.f |= ue, Ft(o, t)) : (o.f & 8388608 && (o.f ^= ue), Ft(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), cn(() => {
		for (let e of c) e.reject(it);
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
function ot(e) {
	let t = /* @__PURE__ */ rt(e);
	return jn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function st(e) {
	let t = /* @__PURE__ */ rt(e);
	return t.equals = Me, t;
}
function ct(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function lt(e) {
	var t, n = G, i = e.parent;
	if (!kn && i !== null && e.v !== r && i.f & 24576) return be(), e.v;
	K(i);
	try {
		ct(e), t = zn(e);
	} finally {
		K(n);
	}
	return t;
}
function ut(e) {
	var t = lt(e);
	if (!e.equals(t) && (e.wv = In(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), mt?.capture(e, t, !0)), e.deps === null))) {
		k(e, S);
		return;
	}
	kn || (j === null ? Xe(e) : (sn() || A?.is_fork) && j.set(e, t));
}
function dt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && Qe(() => {
		t.ac.abort(ve), t.ac = null;
	}), t.fn !== null && (t.teardown = v), Hn(t, 0), vn(t));
}
function ft(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Un(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var pt = null, A = null, mt = null, j = null, ht = null, gt = !1, _t = !1, vt = null, yt = null, bt = 0, xt = 1, St = class e {
	id = xt++;
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
		pt === null ? pt = this : (pt.#n = this, this.#t = pt), pt = this;
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
			for (var r of n.d) k(r, C), t(r);
			for (r of n.m) k(r, w), t(r);
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
					t.f ^= S;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), k(e, C), this.schedule(e);
		for (let e of this.#d) k(e, w), this.schedule(e);
		this.apply();
		for (var t = vt = [], n = [], r = yt = []; this.#c.length > 0;) {
			bt++ > 1e3 && (this.#S(), wt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Ot(e), this.#h() || this.discard(), t;
			}
		}
		if (A = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (vt = null, yt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Dt(e, t);
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
		this.#r.clear(), mt = this, Tt(n), Tt(t), mt = null, this.#s?.resolve();
		var o = A;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (N.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= S;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= S : i & 4 ? t.push(r) : Ln(r) && (i & 16 && this.#d.add(r), Un(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), k(i, C), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), A = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) Ze(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== r && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), j?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, j = null;
	}
	flush() {
		try {
			_t = !0, A = this, this.#_();
		} finally {
			bt = 0, ht = null, vt = null, yt = null, _t = !1, A = null, j = null, N.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(it);
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
		this.#m || (this.#m = !0, qe(() => {
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
		return (this.#s ??= b()).promise;
	}
	static ensure() {
		if (A === null) {
			let t = A = new e();
			!_t && !gt && qe(() => {
				t.#e || t.flush();
			});
		}
		return A;
	}
	apply() {
		j = null;
	}
	schedule(e) {
		if (ht = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? pt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ct(e) {
	var t = gt;
	gt = !0;
	try {
		var n;
		for (e && (A !== null && !A.is_fork && A.flush(), n = e());;) {
			if (Je(), A === null) return n;
			A.flush();
		}
	} finally {
		gt = t;
	}
}
function wt() {
	try {
		Fe();
	} catch (e) {
		R(e, ht);
	}
}
var M = null;
function Tt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Ln(r) && (M = /* @__PURE__ */ new Set(), Un(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && xn(r), M?.size > 0)) {
				N.clear();
				for (let e of M) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) M.has(n) && (M.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Un(n);
					}
				}
				M.clear();
			}
		}
		M = null;
	}
}
function Et(e) {
	A.schedule(e);
}
function Dt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), k(e, S);
		for (var n = e.first; n !== null;) Dt(n, t), n = n.next;
	}
}
function Ot(e) {
	k(e, S);
	for (var t = e.first; t !== null;) Ot(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var kt = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map(), At = !1;
function jt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ae,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function P(e, t) {
	let n = jt(e, t);
	return jn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Mt(e, t = !1, n = !0) {
	let r = jt(e);
	return t || (r.equals = Me), r;
}
function F(e, t, n = !1) {
	return H !== null && (!U || H.f & 131072) && We() && H.f & 4325394 && (q === null || !q.has(e)) && Re(), Ft(e, n ? Rt(t) : t, yt);
}
var Nt = null, Pt = 0;
function Ft(e, t, n = null) {
	if (!e.equals(t)) {
		kn ? N.set(e, t) : N.has(e) || N.set(e, e.v);
		var r = St.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && lt(t), j === null && Xe(t);
		}
		e.wv = In(), Nt = null, Pt = 0, Lt(e, C, n), Nt = null, We() && G !== null && G.f & 1024 && !(G.f & 96) && (X === null ? Mn([e]) : X.push(e)), !r.is_fork && kt.size > 0 && !At && It();
	}
	return t;
}
function It() {
	At = !1;
	for (let e of kt) {
		e.f & 1024 && k(e, w);
		let t;
		try {
			t = Ln(e);
		} catch {
			t = !0;
		}
		t && Un(e);
	}
	kt.clear();
}
function I(e) {
	F(e, e.v + 1);
}
function Lt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = We(), a = r.length;
		if (Pt += a, Pt > 1e5 && Nt === null && (Nt = /* @__PURE__ */ new Set()), Nt !== null) {
			if (Nt.has(e)) return;
			Nt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== G) {
				var l = (c & C) === 0;
				if (l && k(s, t), c & 131072) kt.add(s);
				else if (c & 2) {
					var u = s;
					j?.delete(u), Lt(u, w, n);
				} else if (l) {
					var d = s;
					c & 16 && M !== null && M.add(d), n === null ? Et(d) : n.push(d);
				}
			}
		}
	}
}
function Rt(e) {
	if (typeof e != "object" || !e || de in e || fe in e) return e;
	let t = g(e);
	if (t !== m && t !== h) return e;
	var n = /* @__PURE__ */ new Map(), i = s(e), a = /* @__PURE__ */ P(0), o = null, c = Z, l = (e) => {
		if (Z === c) return e();
		var t = H, n = Z;
		W(null), Fn(c);
		var r = e();
		return W(t), Fn(n), r;
	};
	return i && n.set("length", /* @__PURE__ */ P(e.length, o)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && Ie();
			var i = n.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ P(r.value, o);
				return n.set(t, e), e;
			}) : F(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = n.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ P(r, o));
					n.set(t, e), I(a);
				}
			} else F(i, r), I(a);
			return !0;
		},
		get(t, i, a) {
			if (i === de) return e;
			var s = n.get(i), c = i in t;
			if (s === void 0 && (!c || f(t, i)?.writable) && (s = l(() => /* @__PURE__ */ P(Rt(c ? t[i] : r), o)), n.set(i, s)), s !== void 0) {
				var u = Q(s);
				return u === r ? void 0 : u;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var i = Reflect.getOwnPropertyDescriptor(e, t), a = n.get(t);
			if (a !== void 0) {
				var o = Q(a);
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
			if (t === de) return !0;
			var i = n.get(t), a = i !== void 0 && i.v !== r || Reflect.has(e, t);
			return (i !== void 0 || G !== null && (!a || f(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ P(a ? Rt(e[t]) : r, o)), n.set(t, i)), Q(i) === r) ? !1 : a;
		},
		set(e, t, s, c) {
			var u = n.get(t), d = t in e;
			if (i && t === "length") for (var p = s; p < u.v; p += 1) {
				var m = n.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ P(r, o)), n.set(p + "", m)) : F(m, r);
			}
			if (u === void 0) (!d || f(e, t)?.writable) && (u = l(() => /* @__PURE__ */ P(void 0, o)), F(u, Rt(s)), n.set(t, u));
			else {
				d = u.v !== r;
				var h = l(() => Rt(s));
				F(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, s), !d) {
				if (i && typeof t == "string") {
					var _ = n.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && F(_, v + 1);
				}
				I(a);
			}
			return !0;
		},
		ownKeys(e) {
			Q(a);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== r;
			});
			for (var [i, o] of n) o.v !== r && !(i in e) && t.push(i);
			return t;
		},
		setPrototypeOf() {
			Le();
		}
	});
}
function zt(e) {
	try {
		if (typeof e == "object" && e && de in e) return e[de];
	} catch {}
	return e;
}
function Bt(e, t) {
	return Object.is(zt(e), zt(t));
}
var Vt, Ht, Ut, Wt;
function Gt() {
	if (Vt === void 0) {
		Vt = window, Ht = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Ut = f(t, "firstChild").get, Wt = f(t, "nextSibling").get, _(e) && (e[he] = void 0, e[me] = null, e[ge] = void 0, e.__e = void 0), _(n) && (n[_e] = void 0);
	}
}
function L(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Kt(e) {
	return Ut.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function qt(e) {
	return Wt.call(e);
}
function Jt(e, t) {
	if (!T) return /* @__PURE__ */ Kt(e);
	var n = /* @__PURE__ */ Kt(E);
	if (n === null) n = E.appendChild(L());
	else if (t && n.nodeType !== 3) {
		var r = L();
		return n?.before(r), D(r), r;
	}
	return t && rn(n), D(n), n;
}
function Yt(e, t = !1) {
	if (!T) return /* @__PURE__ */ Kt(e);
	var n = Jt(e, t);
	return Ee(e), n;
}
function Xt(e, t = 1, n = !1) {
	let r = T ? E : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ qt(r);
	if (!T) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = L();
			return r === null ? i?.after(a) : r.before(a), D(a), a;
		}
		rn(r);
	}
	return D(r), r;
}
function Zt(e) {
	e.textContent = "";
}
function Qt() {
	return !1;
}
function $t(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function en() {
	return document.createDocumentFragment();
}
function tn(e = "") {
	return document.createComment(e);
}
function nn(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function rn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function an(e) {
	var t = G;
	if (t === null) return H.f |= ue, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	R(e, t);
}
function R(e, t) {
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
function on(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function z(e, t) {
	var n = G;
	n !== null && n.f & 8192 && (e |= ee);
	var r = {
		ctx: O,
		deps: null,
		nodes: null,
		f: e | C | 512,
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
	if (e & 4) vt === null ? St.ensure().schedule(r) : vt.push(r);
	else if (t !== null) {
		try {
			Un(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ie));
	}
	if (i !== null && (i.parent = n, n !== null && on(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function sn() {
	return H !== null && !U;
}
function cn(e) {
	let t = z(8, null);
	return k(t, S), t.teardown = e, t;
}
function ln(e) {
	return z(4 | oe, e);
}
function un(e) {
	St.ensure();
	let t = z(64 | ae, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Sn(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function dn(e) {
	return z(4, e);
}
function fn(e) {
	return z(le | ae, e);
}
function pn(e, t = 0) {
	return z(8 | t, e);
}
function mn(e, t = [], n = [], r = []) {
	$e(r, t, n, (t) => {
		z(8, () => {
			e(...t.map(Q));
		});
	});
}
function hn(e, t = 0) {
	return z(16 | t, e);
}
function gn(e, t = 0) {
	return z(x | t, e);
}
function B(e) {
	return z(32 | ae, e);
}
function _n(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = kn, r = H;
		An(!0), W(null);
		try {
			t.call(null);
		} catch (t) {
			R(t, e.parent);
		} finally {
			An(n), W(r);
		}
	}
}
function vn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && Qe(() => {
			e.abort(ve);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : V(n, t), n = r;
	}
}
function yn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (bn(e.nodes.start, e.nodes.end), n = !0), e.f |= re, vn(e, t && !n), Hn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	_n(e), e.f ^= re, e.f |= te;
	var i = e.parent;
	i !== null && i.first !== null && xn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function bn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ qt(e);
		e.remove(), e = n;
	}
}
function xn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Sn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Cn(e, r, !0);
	var i = () => {
		n && V(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Cn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ee;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Cn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function wn(e) {
	e.f &= -257, Tn(e, !0);
}
function Tn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ee, e.f & 1024 || (k(e, C), St.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Tn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function En(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ qt(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Dn = null, On = !1, kn = !1;
function An(e) {
	kn = e;
}
var H = null, U = !1;
function W(e) {
	H = e;
}
var G = null;
function K(e) {
	G = e;
}
var q = null;
function jn(e) {
	H !== null && (H.f & 2097152 || H.f & 2) && (q ??= /* @__PURE__ */ new Set()).add(e);
}
var J = null, Y = 0, X = null;
function Mn(e) {
	X = e;
}
var Nn = 1, Pn = 0, Z = Pn;
function Fn(e) {
	Z = e;
}
function In() {
	return ++Nn;
}
function Ln(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Ln(a) && ut(a), a.wv > e.wv) return !0;
		}
		t & 512 && j === null && k(e, S);
	}
	return !1;
}
function Rn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(q !== null && q.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Rn(a, t, !1) : t === a && (n ? k(a, C) : a.f & 1024 && k(a, w), Et(a));
	}
}
function zn(e) {
	var t = J, n = Y, r = X, i = H, a = q, o = O, s = U, c = Z, l = e.f;
	J = null, Y = 0, X = null, H = l & 96 ? null : e, q = null, Be(e.ctx), U = !1, Z = ++Pn, e.ac !== null && (Qe(() => {
		e.ac.abort(ve);
	}), e.ac = null);
	try {
		e.f |= ce;
		var u = e.fn, d = u();
		e.f |= ne;
		var f = Bn(e);
		if (We() && X !== null && !U && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) Rn(X[p], e);
		if (i !== null && i !== e) {
			if (Pn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Pn;
			if (t !== null) for (let e of t) e.rv = Pn;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= ue), d;
	} catch (t) {
		return Bn(e), an(t);
	} finally {
		e.f ^= ce, J = t, Y = n, X = r, H = i, q = a, Be(o), U = s, Z = c;
	}
}
function Bn(e) {
	var t = e.deps, n = A?.is_fork;
	if (J !== null) {
		var r;
		if (n || Hn(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (sn() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Y < t.length && (Hn(e, Y), t.length = Y);
	return t;
}
function Vn(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var i = c.call(n, e);
		if (i !== -1) {
			var a = n.length - 1;
			a === 0 ? n = t.reactions = null : (n[i] = n[a], n.pop());
		}
	}
	if (n === null && t.f & 2 && (J === null || !l.call(J, t))) {
		var o = t;
		o.f & 512 && (o.f ^= 512), o.v !== r && Xe(o), o.ac !== null && Qe(() => {
			o.ac.abort(ve), o.ac = null, k(o, C);
		}), dt(o), Hn(o, 0);
	}
}
function Hn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Vn(e, n[r]);
}
function Un(e) {
	var t = e.f;
	if (!(t & 16384)) {
		k(e, S);
		var n = G, r = On;
		G = e, On = !(t & 96);
		try {
			t & 16777232 ? yn(e) : vn(e), _n(e);
			var i = zn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Nn;
		} finally {
			On = r, G = n;
		}
	}
}
function Q(e) {
	var t = !!(e.f & 2);
	if (Dn?.add(e), H !== null && !U && !(G !== null && G.f & 16384) && (q === null || !q.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < Pn && (e.rv = Pn, J === null && n !== null && n[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			H.deps ??= [], l.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : l.call(r, H) || r.push(H);
		}
	}
	if (kn && N.has(e)) return N.get(e);
	if (t) {
		var i = e;
		if (kn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Gn(i)) && (a = lt(i)), N.set(i, a), a;
		}
		var o = !(i.f & 512) && !U && H !== null && (On || !!(H.f & 512)), s = (i.f & ne) === 0;
		Ln(i) && (o && (i.f |= 512), ut(i)), o && !s && (ft(i), Wn(i));
	}
	if (j?.has(e)) return j.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Wn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (ft(t), Wn(t));
}
function Gn(e) {
	if (e.v === r) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (N.has(t) || t.f & 2 && Gn(t)) return !0;
	return !1;
}
function Kn(e) {
	var t = U;
	try {
		return U = !0, e();
	} finally {
		U = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var qn = Symbol("events"), Jn = /* @__PURE__ */ new Set(), Yn = /* @__PURE__ */ new Set();
function Xn(e, t, n) {
	(t[qn] ??= {})[e] = n;
}
function Zn(e) {
	for (var t = 0; t < e.length; t++) Jn.add(e[t]);
	for (var n of Yn) n(e);
}
var Qn = null, $n = !1;
function er(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Qn = e, $n || ($n = !0, setTimeout(() => {
		$n = !1, Qn = null;
	}));
	var o = 0, s = Qn === e && e[qn];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[qn] = t;
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
		var u = H, f = G;
		W(null), K(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[qn]?.[r];
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
			e[qn] = t, delete e.currentTarget, W(u), K(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var tr = ye ? "template" : "TEMPLATE";
function nr(e, t) {
	var n = G;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function rr(e, t) {
	var n = en();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(L(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(tn(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = r, u = e === "svg" ? a : e === "math" ? o : t;
		var i = $t(e, u, c?.is);
		for (var s in c) nn(i, s, c[s]);
		l.length > 0 && (i.nodeName === tr ? i.content : i).append(rr(l, i.nodeName === "foreignObject" ? void 0 : u)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function ir(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (T) return nr(E, null), E;
		i === void 0 && (i = rr(e, t & 4 ? a : t & 8 ? o : void 0), n || (i = /* @__PURE__ */ Kt(i)));
		var s = r || Ht ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ Kt(s), l = s.lastChild;
			nr(c, l);
		} else nr(s, s);
		return s;
	};
}
function ar(e, t) {
	if (T) {
		var n = G;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = E), Te();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var or = ["touchstart", "touchmove"];
function sr(e) {
	return or.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function cr(e) {
	let t = 0, n = jt(0), r;
	return () => {
		sn() && (Q(n), pn(() => (t === 0 && (r = Kn(() => e(() => I(n)))), t += 1, () => {
			qe(() => {
				--t, t === 0 && (r?.(), r = void 0, I(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var lr = ie | ae;
function ur(e, t, n, r) {
	new dr(e, t, n, r);
}
var dr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = T ? E : null;
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
	#h = cr(() => (this.#m = jt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = G;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = G.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = hn(() => {
			if (T) {
				let e = this.#t;
				Te();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, lr), T && (this.#e = E);
	}
	#g() {
		try {
			this.#a = B(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		qe(r), t && (this.#s = B(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Ce();
				return;
			}
			t = !0, n && ze(), this.#s !== null && Sn(this.#s, () => {
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
					R(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = L(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return B(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						R(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(A);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Sn(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = B(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				En(this.#a, e);
				let t = this.#n.pending;
				this.#o = B(() => t(this.#e));
			} else this.#x(A);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		Ze(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = G, n = H, r = O;
		K(this.#i), W(this.#i), Be(this.#i.ctx);
		try {
			return St.ensure(), e();
		} finally {
			K(t), W(n), Be(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Sn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, qe(() => {
			this.#d = !1, this.#m && Ft(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Q(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), T && (D(this.#t), De(), D(Oe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return B(() => {
						var r = G;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return R(e, this.#i.parent), null;
				}
			}));
		};
		qe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				R(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => R(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function fr(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[_e] ??= e.nodeValue) && (e[_e] = n, e.nodeValue = `${n}`);
}
function pr(e, t) {
	return hr(e, t);
}
var mr = /* @__PURE__ */ new Map();
function hr(e, { target: t, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	Gt();
	var l = void 0, d = un(() => {
		var s = r ?? t.appendChild(L());
		ur(s, { pending: () => {} }, (t) => {
			Ve({});
			var r = O;
			if (o && (r.c = o), a && (i.$$events = a), T && nr(t, null), l = e(t, i) || Ue(), T && (G.nodes.end = E, E === null || E.nodeType !== 8 || E.data !== "]")) throw xe(), n;
			He();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = sr(r);
					for (let e of [t, document]) {
						var a = mr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), mr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, er, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(u(Jn)), Yn.add(f), () => {
			for (var e of d) for (let r of [t, document]) {
				var n = mr.get(r), i = n.get(e);
				--i == 0 ? (r.removeEventListener(e, er), n.delete(e), n.size === 0 && mr.delete(r)) : n.set(e, i);
			}
			Yn.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return gr.set(l, d), l;
}
var gr = /* @__PURE__ */ new WeakMap();
function _r(e, t) {
	let n = gr.get(e);
	return n ? (gr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function vr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Sn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					yr(e, u(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, d = l.parentNode;
			Zt(d), d.append(l), e.items.clear();
		}
		yr(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function yr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= se, En(a, document.createDocumentFragment())) : V(t[i], n);
	}
}
var br;
function xr(e, t, n, r, i, a = null) {
	var o = e, c = /* @__PURE__ */ new Map();
	if (t & 4) {
		var l = e;
		o = T ? D(/* @__PURE__ */ Kt(l)) : l.appendChild(L());
	}
	T && Te();
	var d = null, f = /* @__PURE__ */ st(() => {
		var e = n();
		return s(e) ? e : e == null ? [] : u(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Cr(v, p, o, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= se, Tr(d, null, o)) : wn(d) : Sn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: hn(() => {
			p = Q(f);
			var e = p.length;
			let s = !1;
			T && ke(o) === "[!" != (e === 0) && (o = Oe(), D(o), we(!1), s = !0);
			for (var l = /* @__PURE__ */ new Set(), u = A, v = Qt(), y = 0; y < e; y += 1) {
				T && E.nodeType === 8 && E.data === "]" && (o = E, s = !0, we(!1));
				var b = p[y], x = r(b, y), S = h ? null : c.get(x);
				S ? (S.v && Ft(S.v, b), S.i && Ft(S.i, y), v && u.unskip_effect(S.e)) : (S = wr(c, h ? o : br ??= L(), b, x, y, i, t, n), h || (S.e.f |= se), c.set(x, S)), l.add(x);
			}
			if (e === 0 && a && !d && (h ? d = B(() => a(o)) : (d = B(() => a(br ??= L())), d.f |= se)), e > l.size && Pe("", "", ""), T && e > 0 && D(Oe()), !h) {
				if (m.set(u, l), v) {
					for (let [e, t] of c) l.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			s && we(!0), Q(f);
		}),
		flags: t,
		items: c,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, T && (o = E);
}
function Sr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Cr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = Sr(e.effect.first), l, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (wn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= se, _ === c) Tr(_, null, n);
			else {
				var y = d ? d.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Er(e, d, _), Er(e, _, y), Tr(_, y, n), d = _, p = [], m = [], c = Sr(d.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Tr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) l.delete(m[x]);
					Er(e, S.prev, C.next), Er(e, d, S), Er(e, C, b), c = b, d = C, --v, p = [], m = [];
				} else l.delete(_), Tr(_, c, n), Er(e, _.prev, _.next), Er(e, _, d === null ? e.effect.first : d.next), Er(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = Sr(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, c = Sr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (yr(e, u(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var w = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || w.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && w.push(c), c = Sr(c.next);
		var ee = w.length;
		if (ee > 0) {
			var te = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			vr(e, w, te);
		}
	}
	a && qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function wr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? jt(n) : /* @__PURE__ */ Mt(n, !1, !1) : null, l = o & 2 ? jt(i) : null;
	return {
		v: c,
		i: l,
		e: B(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Tr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ qt(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Er(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Dr(e, t) {
	var n = void 0, r;
	gn(() => {
		n !== (n = t()) && (r &&= (V(r), null), n && (r = B(() => {
			dn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Or(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function kr(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || s(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = Mr(c);
			Or(c, r ? i.includes(l) : Bt(l, n));
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
function Ar(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!s(t)) return Se();
		for (var r of e.options) r.selected = t.includes(Mr(r));
		return;
	}
	for (r of e.options) if (Bt(Mr(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function jr(e) {
	var t = new MutationObserver((t) => {
		t.every(Nr) || ("__defaultValue" in e && kr(e, !1), "__value" in e && Ar(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), cn(() => {
		t.disconnect();
	});
}
function Mr(e) {
	return "__value" in e ? e.__value : e.value;
}
function Nr(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Pr = Symbol("is custom element"), Fr = Symbol("is html"), Ir = ye ? "link" : "LINK";
function Lr(e, t, n, r) {
	var i = Rr(e);
	T && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Ir) || i[t] !== (i[t] = n) && (t === "loading" && (e[pe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Br(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Rr(e) {
	return e[me] ??= {
		[Pr]: e.nodeName.includes("-"),
		[Fr]: e.namespaceURI === i
	};
}
var zr = /* @__PURE__ */ new Map();
function Br(e) {
	var t = e.getAttribute("is") || e.nodeName, n = zr.get(t);
	if (n) return n;
	zr.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = p(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = g(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var Vr = /* @__PURE__ */ ir([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function Hr(e, t) {
	Ve(t, !0);
	var n = Vr(), r = Yt(n, !0);
	mn(() => fr(r, t.messages.text)), ar(e, n), He();
}
//#endregion
//#region node_modules/svelte/src/reactivity/map.js
var Ur = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ P(0);
	#n = /* @__PURE__ */ P(0);
	#r = Z || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return Z === this.#r ? /* @__PURE__ */ P(e) : jt(e);
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
		if (r === void 0) r = this.#i(0), n.set(e, r), F(this.#n, super.size), I(o);
		else if (i !== t) {
			I(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && I(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), F(n, -1)), r && (F(this.#n, super.size), I(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			F(this.#n, 0);
			for (var t of e.values()) F(t, -1);
			I(this.#t), e.clear();
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
}, Wr = class {
	#e = new Ur();
	#t = /* @__PURE__ */ ot(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return Q(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, Gr = /* @__PURE__ */ t({
	BACKGROUND_EFFORT: () => Xr,
	EFFORT_ORDER: () => Jr,
	EFFORT_SHADES: () => $r,
	HATCH_SHADES: () => ei,
	HATCH_TURNS: () => ti,
	KNOWN_MODELS: () => Kr,
	SLOT_COUNT: () => 8,
	effortHatch: () => oi,
	effortLabel: () => Qr,
	effortName: () => Zr,
	effortRank: () => Yr,
	effortShade: () => ai,
	hatchTurn: () => si,
	modelSlots: () => qr,
	shade: () => ii,
	slotColor: () => ri,
	swatchFill: () => ci
}), Kr = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function qr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Kr.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !Kr.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var Jr = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function Yr(e) {
	let t = Jr.indexOf(e);
	return t === -1 ? Jr.length : t;
}
var Xr = "background";
function Zr(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function Qr(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var $r = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, ei = {
	background: 1,
	ultracode: 4
}, ti = {
	background: -45,
	ultracode: 45
};
function ni(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function ri(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function ii(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? ri(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function ai(e, t) {
	return ii(e, ni($r, t) ?? 0);
}
function oi(e, t) {
	let n = ni(ei, t);
	return n ? ii(e, n) : null;
}
function si(e) {
	return ni(ti, e);
}
function ci(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var li = /* @__PURE__ */ t({
	ago: () => ki,
	compact: () => gi,
	dayText: () => Si,
	duration: () => bi,
	longDay: () => wi,
	longHour: () => Di,
	money: () => vi,
	parseDay: () => xi,
	parseHour: () => Ti,
	percent: () => yi,
	shortDay: () => Ci,
	shortHour: () => Ei,
	signed: () => _i,
	when: () => Oi,
	whole: () => $
}), ui = "–", di = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), fi = new Intl.NumberFormat("en"), pi = {
	month: "short",
	day: "numeric"
}, mi = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, hi = {
	hour: "2-digit",
	minute: "2-digit"
};
function gi(e) {
	return e == null ? ui : di.format(e);
}
function _i(e) {
	return e < 0 ? `−${gi(-e)}` : `+${gi(e)}`;
}
function $(e) {
	return e == null ? ui : fi.format(e);
}
function vi(e) {
	return e == null ? ui : Math.abs(e) >= 1e3 ? "$" + di.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function yi(e, t) {
	if (!t) return ui;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function bi(e) {
	if (e == null) return ui;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function xi(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function Si(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function Ci(e, t) {
	return xi(e).toLocaleDateString(t, pi);
}
function wi(e, t) {
	return xi(e).toLocaleDateString(t, mi);
}
function Ti(e) {
	let [t = "", n = "0"] = e.split("T"), r = xi(t);
	return r.setHours(Number(n)), r;
}
function Ei(e, t) {
	return Ti(e).toLocaleTimeString(t, hi);
}
function Di(e, t) {
	let n = Ti(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, hi);
	return `${n.toLocaleDateString(t, mi)}, ${i(n)}–${i(r)}`;
}
function Oi(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...pi,
		...hi
	}) : ui;
}
function ki(e, t = Date.now(), n) {
	if (!e) return ui;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : Oi(e, n);
}
//#endregion
//#region src/lib/charts.ts
var Ai = /* @__PURE__ */ t({
	LIMIT_ICON: () => "⚠",
	NO_USAGE: () => Ui,
	RATE_LIMIT: () => Yi,
	bandIndex: () => Li,
	barShare: () => ia,
	bucketTotals: () => Wi,
	chartSeries: () => Gi,
	columnPath: () => zi,
	columnTotals: () => qi,
	columnWidth: () => Ri,
	costSplit: () => na,
	costTop: () => ra,
	errorText: () => Qi,
	inputTotal: () => ji,
	limitCounts: () => $i,
	limitTop: () => Pi,
	limitType: () => Zi,
	lineX: () => Fi,
	modelGroups: () => Ki,
	nearestIndex: () => Ii,
	niceMax: () => Mi,
	peakIndex: () => Bi,
	rangeDays: () => Vi,
	stackSegments: () => Ji,
	ticks: () => Ni,
	timeBuckets: () => Hi,
	windowHitAfter: () => ea,
	windowSpan: () => ta
});
function ji(e) {
	return e.new_input + e.cache_write + e.cache_read;
}
function Mi(e) {
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
function Ni(e, t) {
	return Array.from({ length: t + 1 }, (n, r) => e * r / t);
}
function Pi(e) {
	return Math.max(2, Math.ceil(Mi(e) / 2) * 2);
}
function Fi(e, t, n) {
	let r = e - 1;
	return (e) => r > 0 ? t + (n - t) * e / r : (t + n) / 2;
}
function Ii(e, t, n) {
	return (r) => n > 1 ? Math.round((r - e) / (t - e) * (n - 1)) : 0;
}
function Li(e, t) {
	return (n) => Math.floor((n - e) / t);
}
function Ri(e, t = 24) {
	return Math.max(2, Math.min(t, e * .6));
}
function zi(e, t, n, r, i, a = 4) {
	let o = i ? Math.min(a, n / 2, r) : 0;
	return `M${e},${t + r}V${t + o}` + (o ? `Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}` : `H${e + n}`) + `V${t + r}Z`;
}
function Bi(e) {
	return e.indexOf(Math.max(...e));
}
function Vi(e, t = /* @__PURE__ */ new Date()) {
	let n = [];
	for (let r = xi(e); r <= t; r.setDate(r.getDate() + 1)) n.push(Si(r));
	return n;
}
function Hi(e, t = /* @__PURE__ */ new Date()) {
	if (e.days !== 1 || !e.hour_model) return {
		keys: Vi(e.since, t),
		unit: "day",
		heading: "Day",
		short: Ci,
		long: wi,
		keyOf: (e) => e.day ?? ""
	};
	let n = e.since === Si(t) ? t.getHours() : 23, r = [];
	for (let t = 0; t <= n; t += 1) r.push(`${e.since}T${String(t).padStart(2, "0")}`);
	return {
		keys: r,
		unit: "hour",
		heading: "Hour",
		short: Ei,
		long: Di,
		keyOf: (e) => e.hour ?? ""
	};
}
var Ui = {
	cost: 0,
	input: 0,
	output: 0
};
function Wi(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			cost: 0,
			input: 0,
			output: 0
		};
		i.cost += r.cost || 0, i.input += ji(r), i.output += r.output, n.set(e, i);
	}
	return n;
}
function Gi(e, t, n) {
	let r = qr([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${Zr(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: ai(e, a.effort),
			hatch: oi(e, a.effort),
			turn: si(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : Yr(e);
	return [...i.values()].sort((e, t) => (e.slot ?? 8) - (t.slot ?? 8) || e.model.localeCompare(t.model) || a(e.effort) - a(t.effort) || String(e.effort).localeCompare(String(t.effort)));
}
function Ki(e) {
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
function qi(e, t) {
	return t.map((t) => e.reduce((e, n) => e + (n.values.get(t) ?? 0), 0));
}
function Ji(e, t, n, r = 2, i = 4) {
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
var Yi = "rate_limit", Xi = {
	five_hour: "5-hour limit",
	seven_day: "weekly limit",
	seven_day_opus: "weekly Opus limit"
};
function Zi(e) {
	return e ? Object.hasOwn(Xi, e) ? Xi[e] ?? e : e.replaceAll("_", " ") : "–";
}
function Qi(e) {
	let t = e.status ? ` (${e.status})` : "";
	return e.error === "rate_limit" ? `⚠ Rate limit${t}` : `${e.error.replaceAll("_", " ")}${t}`;
}
function $i(e, t) {
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
function ea(e) {
	return Date.parse(e.first_hit) - Date.parse(e.start);
}
function ta(e, t) {
	let n = new Date(e.start), r = new Date(e.resets_at), i = n.toDateString() === r.toDateString() ? r.toLocaleTimeString(t, {
		hour: "2-digit",
		minute: "2-digit"
	}) : Oi(e.resets_at, t);
	return `${Oi(e.start, t)} – ${i}`;
}
function na(e) {
	let t = e.cost_parts.cache_read;
	return {
		cacheRead: t,
		rest: Math.max(0, (e.cost || 0) - t)
	};
}
function ra(e) {
	return Math.max(0, ...e.map((e) => e.cost || 0)) || 1;
}
function ia(e, t) {
	return 100 * (e || 0) / t;
}
//#endregion
//#region src/lib/compact.ts
var aa = /* @__PURE__ */ t({
	PAYOFF_WORDS: () => oa,
	compactCallKind: () => da,
	compactionTotal: () => ma,
	delegateCallShown: () => fa,
	payoffAhead: () => la,
	payoffText: () => ua,
	payoffTone: () => ca,
	spread: () => sa,
	verdictTone: () => pa
}), oa = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function sa(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function ca(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function la(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${$(t.pays_later_in)} replies`;
		return `${oa.later}: growing at its recent pace, the context reaches about ${gi(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = $(Math.round(t.calls_ahead));
	return `${oa[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function ua(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${vi(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${$(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : $(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${$(e.breakeven_low)} replies)` : `would pay off after about ${$(e.breakeven_calls)} replies` + sa(r(e.breakeven_low), r(e.breakeven_high));
}
function da(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function fa(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function pa(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function ma(e) {
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
var ha = /* @__PURE__ */ t({
	liveCompactBadge: () => va,
	liveSecretBadge: () => _a,
	liveStateBadges: () => ya,
	liveWaitBadge: () => ga,
	sessionWaits: () => ba,
	waitChanged: () => xa
});
function ga(e) {
	if (!e) return null;
	let t = ` since ${Oi(e.since)}`;
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
function _a(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${$(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${$(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function va(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${gi(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = ca(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if (da({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${vi(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${$(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${oa[l]}: compacting now ${m}, ~${$(Math.round(f))} ahead on average.`);
}
function ya(e, t) {
	return [_a(e.secrets), va(e.current, t)].filter((e) => e !== null);
}
function ba(e, t) {
	let n = ga(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : ga(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function xa(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/lib/tables.ts
var Sa = /* @__PURE__ */ t({
	DEFAULT_PAGE_SIZE: () => 25,
	PAGE_SIZES: () => Ca,
	TOOL_KINDS: () => ja,
	chatRows: () => Wa,
	detailNoun: () => La,
	emptyDetail: () => Pa,
	entryKey: () => Ua,
	kindLabel: () => Na,
	orderedEntries: () => Ha,
	pageSizeFrom: () => Da,
	pageText: () => Ea,
	pageUnits: () => wa,
	pageWindow: () => Ta,
	sessionCount: () => Aa,
	sessionMatches: () => Oa,
	sessionProjects: () => ka,
	toolFolds: () => Ba,
	toolRowClass: () => Ra,
	toolRowName: () => za,
	toolRowShown: () => Va,
	toolTableRows: () => Ma,
	toolsAndChat: () => Ga
}), Ca = [
	10,
	25,
	50
];
function wa(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function Ta(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function Ea(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function Da(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function Oa(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function ka(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
function Aa(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var ja = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function Ma(e) {
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
function Na(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function Pa(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var Fa = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, Ia = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function La(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn(Ia, e.tool) && Ia[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(Fa, n) && Fa[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function Ra(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function za(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: Na(e, ja)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || Pa(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function Ba(e) {
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
			label: `${$(a)} ${La(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function Va(e, t) {
	return e.every((e) => t.has(e));
}
function Ha(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function Ua(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function Wa(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return Ha(e, t).map((e) => ({
		key: Ua(e, n.get(e) ?? 0),
		entry: e
	}));
}
function Ga(e, t, n) {
	return e ? [n, t] : [t, n];
}
//#endregion
//#region src/lib/themes.ts
var Ka = /* @__PURE__ */ t({
	THEMES: () => qa,
	themeFooter: () => $a,
	themeLabel: () => Qa,
	themeName: () => Xa
}), qa = [
	"light",
	"dark",
	"hacker",
	"startup",
	"rgb"
], Ja = { techbro: "rgb" }, Ya = {
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
function Xa(e) {
	if (e == null) return null;
	let t = (Object.hasOwn(Ja, e) ? Ja[e] : e) ?? e;
	return qa.includes(t) ? t : null;
}
function Za(e) {
	return e !== null && Object.hasOwn(Ya, e) ? Ya[e] ?? {} : {};
}
function Qa(e, t) {
	let n = Za(e);
	return Object.hasOwn(n, t) ? n[t] ?? t : t;
}
function $a(e) {
	return Za(e).footer ?? "";
}
//#endregion
//#region src/lib/prefs.svelte.ts
var eo = /* @__PURE__ */ t({
	Preferences: () => io,
	footerCopy: () => so,
	hype: () => oo,
	preferences: () => ao,
	readPreference: () => to,
	savePreference: () => no,
	savedOption: () => ro
});
function to(e) {
	try {
		return localStorage.getItem(`claude-usage.${e}`);
	} catch {
		return null;
	}
}
function no(e, t) {
	try {
		localStorage.setItem(`claude-usage.${e}`, String(t));
	} catch {}
}
function ro(e, t) {
	let n = to(e);
	return n !== null && t.includes(n) ? n : null;
}
var io = class {
	#e = /* @__PURE__ */ P(Rt(Xa(to("theme"))));
	#t = /* @__PURE__ */ P(Rt(Da(to("page_size"), Ca, 25)));
	#n = /* @__PURE__ */ P(to("chat-oldest-first") === "true");
	get theme() {
		return Q(this.#e);
	}
	set theme(e) {
		let t = Xa(e);
		F(this.#e, t, !0), no("theme", t ?? "auto");
	}
	get pageSize() {
		return Q(this.#t);
	}
	set pageSize(e) {
		Ca.includes(e) && (F(this.#t, e, !0), no("page_size", String(e)));
	}
	get oldestFirst() {
		return Q(this.#n);
	}
	set oldestFirst(e) {
		F(this.#n, e, !0), no("chat-oldest-first", String(e));
	}
}, ao = new io();
function oo(e) {
	return Qa(ao.theme, e);
}
function so() {
	return $a(ao.theme);
}
//#endregion
//#region src/lib/scroll.ts
var co = /* @__PURE__ */ t({
	keepScroll: () => uo,
	scrollAnchor: () => lo
});
function lo(e) {
	for (let t of e) {
		let e = t.getBoundingClientRect();
		if (e.bottom > 0) return {
			node: t,
			top: e.top
		};
	}
	return null;
}
function uo(e, t) {
	e && t && t.isConnected && window.scrollBy(0, t.getBoundingClientRect().top - e.top);
}
//#endregion
//#region src/components/Pager.svelte
var fo = /* @__PURE__ */ ir([[
	"option",
	null,
	" "
]]), po = /* @__PURE__ */ ir([[
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
function mo(e, t) {
	Ve(t, !0);
	let n = /* @__PURE__ */ ot(() => (t.units.at(-1) ?? -1) + 1), r = /* @__PURE__ */ ot(() => Ta(Q(n), ao.pageSize, Math.floor(_o.first(t.key) / ao.pageSize))), i = /* @__PURE__ */ ot(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function a() {
		_o.first(t.key) !== Q(r).first && _o.set(t.key, Q(r).first);
	}
	a();
	function o(e, r) {
		let i = e.closest(".pager"), a = lo(i ? [i] : []);
		_o.set(t.key, Ta(Q(n), ao.pageSize, r).first), Ct(), uo(a, i);
	}
	function s(e, t) {
		let n = e.closest(".pager"), r = lo(n ? [n] : []);
		ao.pageSize = t, Ct(), uo(r, n);
	}
	function c() {
		let { first: e, last: n } = Q(r);
		t.rows.forEach((r, i) => {
			let a = t.units[i];
			a !== void 0 && r.classList.toggle("off-page", a < e || a >= n);
		});
	}
	var l = po(), u = Jt(l);
	xr(u, 20, () => Ca, (e) => e, (e, n) => {
		var r = fo(), i = Yt(r), a = {};
		mn(() => {
			fr(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), ar(e, r);
	}), Ee(u);
	var d;
	jr(u);
	var f = Xt(u, 2), p = Xt(f, 2), m = Yt(p, !0), h = Xt(p, 2);
	Ee(l), Dr(l, () => c), mn((e) => {
		Lr(u, "id", `pager-${t.key ?? ""}-size`), Lr(u, "aria-label", `${Q(i) ?? ""} per page`), d !== (d = ao.pageSize) && (u.value = (u.__value = d) ?? "", Ar(u, d)), Lr(f, "id", `pager-${t.key ?? ""}-previous`), f.disabled = Q(r).page === 0, fr(m, e), Lr(h, "id", `pager-${t.key ?? ""}-next`), h.disabled = Q(r).page === Q(r).pages - 1;
	}, [() => Ea(Q(r), Q(n), t.noun)]), Xn("change", u, (e) => s(e.currentTarget, Number(e.currentTarget.value))), Xn("click", f, (e) => o(e.currentTarget, Q(r).page - 1)), Xn("click", h, (e) => o(e.currentTarget, Q(r).page + 1)), ar(e, l), He();
}
Zn(["change", "click"]);
//#endregion
//#region src/lib/paging.svelte.ts
var ho = /* @__PURE__ */ t({
	TablePages: () => go,
	mountPager: () => yo,
	releaseDetachedPagers: () => bo,
	tablePages: () => _o
}), go = class {
	#e = new Ur();
	first(e) {
		return this.#e.get(e) ?? 0;
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	forget(e) {
		this.#e.delete(e);
	}
}, _o = new go(), vo = /* @__PURE__ */ new Set();
function yo(e) {
	let t = document.createElement("div"), n = pr(mo, {
		target: t,
		props: e
	});
	Ct();
	let r = t.firstElementChild;
	if (!(r instanceof HTMLElement)) throw Error("The pager drew no element");
	return vo.add({
		component: n,
		root: r
	}), r;
}
function bo() {
	for (let e of [...vo]) e.root.isConnected || (vo.delete(e), _r(e.component));
}
//#endregion
//#region src/lib/secrets.ts
var xo = /* @__PURE__ */ t({
	secretReach: () => To,
	secretTone: () => So,
	secretVia: () => Co
});
function So(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function Co(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var wo = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function To(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(wo, e.reach) ? wo[e.reach] ?? "" : "no result yet";
}
//#endregion
//#region src/legacy.svelte.ts
var Eo = [
	li,
	Gr,
	aa,
	xo,
	ha,
	Sa,
	Ai,
	Ka,
	eo,
	ho,
	co
];
function Do(e) {
	let t = new Wr(), n = e.document.getElementById("error");
	if (!n?.parentElement) throw Error("The page has no #error placeholder for the banner");
	let r = pr(Hr, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	return n.remove(), e.showError = (e, n) => {
		t.show(e, n), Ct();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...Eo), { stop() {
		_r(r), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of Eo.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
Do(window);
//#endregion

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
var b = 1 << 24, x = 1024, te = 2048, ne = 4096, re = 8192, ie = 16384, ae = 32768, oe = 1 << 25, se = 65536, ce = 1 << 19, le = 1 << 20, ue = 1 << 25, de = 1 << 21, fe = 1 << 22, pe = 1 << 23, me = Symbol("$state"), he = Symbol("component"), ge = Symbol("legacy props"), _e = Symbol(""), ve = Symbol("attributes"), ye = Symbol("class"), be = Symbol("style"), xe = Symbol("text"), Se = Symbol("form reset"), Ce = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), we = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
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
var S = !1;
function ke(e) {
	S = e;
}
var C;
function Ae(e) {
	if (e === null) throw Ee(), n;
	return C = e;
}
function je() {
	return Ae(/* @__PURE__ */ an(C));
}
function w(e) {
	if (S) {
		if (/* @__PURE__ */ an(C) !== null) throw Ee(), n;
		C = e;
	}
}
function Me(e = 1) {
	if (S) {
		for (var t = e, n = C; t--;) n = /* @__PURE__ */ an(n);
		C = n;
	}
}
function Ne(e = !0) {
	for (var t = 0, n = C;;) {
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
function Pe(e) {
	if (!e || e.nodeType !== 8) throw Ee(), n;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Fe(e) {
	return e === this.v;
}
function Ie(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Le(e) {
	return !Ie(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Re() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function ze(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Be() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ve(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function He() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ue() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function We() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ge() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var Ke = null;
function qe(e) {
	Ke = e;
}
function T(e, t = !1, n) {
	Ke = {
		p: Ke,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: B,
		l: null
	};
}
function E(e) {
	var t = Ke, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) yn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ke = t.p, Je(e);
}
function Je(e = {}) {
	return d(e, he, { value: !0 }), e;
}
function Ye() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Xe = [];
function Ze() {
	var e = Xe;
	Xe = [], y(e);
}
function Qe(e) {
	if (Xe.length === 0 && !wt) {
		var t = Xe;
		queueMicrotask(() => {
			t === Xe && Ze();
		});
	}
	Xe.push(e);
}
function $e() {
	for (; Xe.length > 0;) Ze();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var et = ~(te | ne | x);
function D(e, t) {
	e.f = e.f & et | t;
}
function tt(e) {
	e.f & 512 || e.deps === null ? D(e, x) : D(e, ne);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function nt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), D(e, x);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
var rt = !1;
function it() {
	rt || (rt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[Se]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function at(e) {
	var t = z, n = B;
	Hn(null), Un(null);
	try {
		return e();
	} finally {
		Hn(t), Un(n);
	}
}
function ot(e, t, n, r = n) {
	e.addEventListener(t, () => at(n));
	let i = e[Se];
	e[Se] = i ? () => {
		i(), r(!0);
	} : () => r(!0), it();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function st(e, t, n, r) {
	let i = Ye() ? dt : mt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = B, c = ct(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				mn(e, s);
			}
			lt();
		}
	}
	var d = ut();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ pt(e))).then(u).catch((e) => mn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), lt();
	}) : f();
}
function ct() {
	var e = B, t = z, n = Ke, r = k;
	return function(i = !0) {
		Un(e), Hn(t), qe(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function lt(e = !0) {
	Un(null), Hn(null), qe(null), e && k?.deactivate();
}
function ut() {
	var e = B, t = e.b, n = k, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function dt(e) {
	var t = 2 | te;
	return B !== null && (B.f |= ce), {
		ctx: Ke,
		deps: null,
		effects: null,
		equals: Fe,
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
var ft = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function pt(e, t, n) {
	let i = B;
	i === null && Re();
	var a = void 0, o = Vt(r), s = !z, c = /* @__PURE__ */ new Set();
	return Sn(() => {
		var t = B, n = ee();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== Ce && n.reject(e);
			}).finally(lt);
		} catch (e) {
			n.reject(e), lt();
		}
		var r = k;
		if (s) {
			if (t.f & 32768) var l = ut();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(ft);
			else for (let e of c.values()) e.reject(ft);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== ft && (r.activate(), t ? (o.f |= pe, Gt(o, t)) : (o.f & 8388608 && (o.f ^= pe), Gt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), vn(() => {
		for (let e of c) e.reject(ft);
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
function O(e) {
	let t = /* @__PURE__ */ dt(e);
	return Gn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function mt(e) {
	let t = /* @__PURE__ */ dt(e);
	return t.equals = Le, t;
}
function ht(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) R(t[n]);
	}
}
function gt(e) {
	var t, n = B, i = e.parent;
	if (!zn && i !== null && e.v !== r && i.f & 24576) return Te(), e.v;
	Un(i);
	try {
		ht(e), t = rr(e);
	} finally {
		Un(n);
	}
	return t;
}
function _t(e) {
	var t = gt(e);
	if (!e.equals(t) && (e.wv = er(), (!k?.is_fork || e.deps === null) && (k === null ? e.v = t : (k.capture(e, t, !0), xt?.capture(e, t, !0)), e.deps === null))) {
		D(e, x);
		return;
	}
	zn || (St === null ? tt(e) : (_n() || k?.is_fork) && St.set(e, t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && at(() => {
		t.ac.abort(Ce), t.ac = null;
	}), t.fn !== null && (t.teardown = v), or(t, 0), On(t));
}
function yt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && sr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var bt = null, k = null, xt = null, St = null, Ct = null, wt = !1, Tt = !1, Et = null, Dt = null, Ot = 0, kt = 1, At = class e {
	id = kt++;
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
		bt === null ? bt = this : (bt.#n = this, this.#t = bt), bt = this;
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
			for (var r of n.d) D(r, te), t(r);
			for (r of n.m) D(r, ne), t(r);
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
		for (let e of this.#u) this.#d.delete(e), D(e, te), this.schedule(e);
		for (let e of this.#d) D(e, ne), this.schedule(e);
		this.apply();
		for (var t = Et = [], n = [], r = Dt = []; this.#c.length > 0;) {
			Ot++ > 1e3 && (this.#S(), Mt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Lt(e), this.#h() || this.discard(), t;
			}
		}
		if (k = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Et = null, Dt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) It(e, t);
			r.length > 0 && k.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), xt = this, Pt(n), Pt(t), xt = null, this.#s?.resolve();
		var o = k;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (zt.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= x;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= x : i & 4 ? t.push(r) : tr(r) && (i & 16 && this.#d.add(r), sr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), D(i, te), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), k = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) nt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== r && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), St?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		k = this;
	}
	deactivate() {
		k = null, St = null;
	}
	flush() {
		try {
			Tt = !0, k = this, this.#_();
		} finally {
			Ot = 0, Ct = null, Et = null, Dt = null, Tt = !1, k = null, St = null, zt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ft);
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
		this.#m || (this.#m = !0, Qe(() => {
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
		if (k === null) {
			let t = k = new e();
			!Tt && !wt && Qe(() => {
				t.#e || t.flush();
			});
		}
		return k;
	}
	apply() {
		St = null;
	}
	schedule(e) {
		if (Ct = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? bt = e : t.#t = e, this.linked = !1;
		}
	}
};
function jt(e) {
	var t = wt;
	wt = !0;
	try {
		var n;
		for (e && (k !== null && !k.is_fork && k.flush(), n = e());;) {
			if ($e(), k === null) return n;
			k.flush();
		}
	} finally {
		wt = t;
	}
}
function Mt() {
	try {
		Be();
	} catch (e) {
		mn(e, Ct);
	}
}
var Nt = null;
function Pt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && tr(r) && (Nt = /* @__PURE__ */ new Set(), sr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && jn(r), Nt?.size > 0)) {
				zt.clear();
				for (let e of Nt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Nt.has(n) && (Nt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || sr(n);
					}
				}
				Nt.clear();
			}
		}
		Nt = null;
	}
}
function Ft(e) {
	k.schedule(e);
}
function It(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), D(e, x);
		for (var n = e.first; n !== null;) It(n, t), n = n.next;
	}
}
function Lt(e) {
	D(e, x);
	for (var t = e.first; t !== null;) Lt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Rt = /* @__PURE__ */ new Set(), zt = /* @__PURE__ */ new Map(), Bt = !1;
function Vt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Fe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function A(e, t) {
	let n = Vt(e, t);
	return Gn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Ht(e, t = !1, n = !0) {
	let r = Vt(e);
	return t || (r.equals = Le), r;
}
function j(e, t, n = !1) {
	return z !== null && (!Vn || z.f & 131072) && Ye() && z.f & 4325394 && (Wn === null || !Wn.has(e)) && We(), Gt(e, n ? Yt(t) : t, Dt);
}
var Ut = null, Wt = 0;
function Gt(e, t, n = null) {
	if (!e.equals(t)) {
		zn ? zt.set(e, t) : zt.has(e) || zt.set(e, e.v);
		var r = At.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && gt(t), St === null && tt(t);
		}
		e.wv = er(), Ut = null, Wt = 0, Jt(e, te, n), Ut = null, Ye() && B !== null && B.f & 1024 && !(B.f & 96) && (Jn === null ? Yn([e]) : Jn.push(e)), !r.is_fork && Rt.size > 0 && !Bt && Kt();
	}
	return t;
}
function Kt() {
	Bt = !1;
	for (let e of Rt) {
		e.f & 1024 && D(e, ne);
		let t;
		try {
			t = tr(e);
		} catch {
			t = !0;
		}
		t && sr(e);
	}
	Rt.clear();
}
function qt(e) {
	j(e, e.v + 1);
}
function Jt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Ye(), a = r.length;
		if (Wt += a, Wt > 1e5 && Ut === null && (Ut = /* @__PURE__ */ new Set()), Ut !== null) {
			if (Ut.has(e)) return;
			Ut.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== B) {
				var l = (c & te) === 0;
				if (l && D(s, t), c & 131072) Rt.add(s);
				else if (c & 2) {
					var u = s;
					St?.delete(u), Jt(u, ne, n);
				} else if (l) {
					var d = s;
					c & 16 && Nt !== null && Nt.add(d), n === null ? Ft(d) : n.push(d);
				}
			}
		}
	}
}
function Yt(e) {
	if (typeof e != "object" || !e || me in e || he in e) return e;
	let t = g(e);
	if (t !== m && t !== h) return e;
	var n = /* @__PURE__ */ new Map(), i = s(e), a = /* @__PURE__ */ A(0), o = null, c = Qn, l = (e) => {
		if (Qn === c) return e();
		var t = z, n = Qn;
		Hn(null), $n(c);
		var r = e();
		return Hn(t), $n(n), r;
	};
	return i && n.set("length", /* @__PURE__ */ A(e.length, o)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && He();
			var i = n.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ A(r.value, o);
				return n.set(t, e), e;
			}) : j(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = n.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ A(r, o));
					n.set(t, e), qt(a);
				}
			} else j(i, r), qt(a);
			return !0;
		},
		get(t, i, a) {
			if (i === me) return e;
			var s = n.get(i), c = i in t;
			if (s === void 0 && (!c || f(t, i)?.writable) && (s = l(() => /* @__PURE__ */ A(Yt(c ? t[i] : r), o)), n.set(i, s)), s !== void 0) {
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
			if (t === me) return !0;
			var i = n.get(t), a = i !== void 0 && i.v !== r || Reflect.has(e, t);
			return (i !== void 0 || B !== null && (!a || f(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ A(a ? Yt(e[t]) : r, o)), n.set(t, i)), V(i) === r) ? !1 : a;
		},
		set(e, t, s, c) {
			var u = n.get(t), d = t in e;
			if (i && t === "length") for (var p = s; p < u.v; p += 1) {
				var m = n.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ A(r, o)), n.set(p + "", m)) : j(m, r);
			}
			if (u === void 0) (!d || f(e, t)?.writable) && (u = l(() => /* @__PURE__ */ A(void 0, o)), j(u, Yt(s)), n.set(t, u));
			else {
				d = u.v !== r;
				var h = l(() => Yt(s));
				j(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, s), !d) {
				if (i && typeof t == "string") {
					var _ = n.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && j(_, v + 1);
				}
				qt(a);
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
			Ue();
		}
	});
}
function Xt(e) {
	try {
		if (typeof e == "object" && e && me in e) return e[me];
	} catch {}
	return e;
}
function Zt(e, t) {
	return Object.is(Xt(e), Xt(t));
}
var Qt, $t, en, tn;
function nn() {
	if (Qt === void 0) {
		Qt = window, $t = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		en = f(t, "firstChild").get, tn = f(t, "nextSibling").get, _(e) && (e[ye] = void 0, e[ve] = null, e[be] = void 0, e.__e = void 0), _(n) && (n[xe] = void 0);
	}
}
function M(e = "") {
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
function N(e, t) {
	if (!S) return /* @__PURE__ */ rn(e);
	var n = /* @__PURE__ */ rn(C);
	if (n === null) n = C.appendChild(M());
	else if (t && n.nodeType !== 3) {
		var r = M();
		return n?.before(r), Ae(r), r;
	}
	return t && fn(n), Ae(n), n;
}
function P(e, t = !1) {
	if (!S) {
		var n = /* @__PURE__ */ rn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ an(n) : n;
	}
	if (t) {
		if (C?.nodeType !== 3) {
			var r = M();
			return C?.before(r), Ae(r), r;
		}
		fn(C);
	}
	return C;
}
function F(e, t = !1) {
	if (!S) return /* @__PURE__ */ rn(e);
	var n = N(e, t);
	return w(e), n;
}
function I(e, t = 1, n = !1) {
	let r = S ? C : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ an(r);
	if (!S) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = M();
			return r === null ? i?.after(a) : r.before(a), Ae(a), a;
		}
		fn(r);
	}
	return Ae(r), r;
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
	if (t === null) return z.f |= pe, e;
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
	n !== null && n.f & 8192 && (e |= re);
	var r = {
		ctx: Ke,
		deps: null,
		nodes: null,
		f: e | te | 512,
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
	k?.register_created_effect(r);
	var i = r;
	if (e & 4) Et === null ? At.ensure().schedule(r) : Et.push(r);
	else if (t !== null) {
		try {
			sr(r);
		} catch (e) {
			throw R(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= se));
	}
	if (i !== null && (i.parent = n, n !== null && hn(i, n), z !== null && z.f & 2 && !(e & 64))) {
		var a = z;
		(a.effects ??= []).push(i);
	}
	return r;
}
function _n() {
	return z !== null && !Vn;
}
function vn(e) {
	let t = gn(8, null);
	return D(t, x), t.teardown = e, t;
}
function yn(e) {
	return gn(4 | le, e);
}
function bn(e) {
	At.ensure();
	let t = gn(64 | ce, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Mn(t, () => {
			R(t), n(void 0);
		}) : (R(t), n(void 0));
	});
}
function xn(e) {
	return gn(4, e);
}
function Sn(e) {
	return gn(fe | ce, e);
}
function Cn(e, t = 0) {
	return gn(8 | t, e);
}
function L(e, t = [], n = [], r = []) {
	st(r, t, n, (t) => {
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
	return gn(32 | ce, e);
}
function Dn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = zn, r = z;
		Bn(!0), Hn(null);
		try {
			t.call(null);
		} catch (t) {
			mn(t, e.parent);
		} finally {
			Bn(n), Hn(r);
		}
	}
}
function On(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && at(() => {
			e.abort(Ce);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : R(n, t), n = r;
	}
}
function kn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || R(t), t = n;
	}
}
function R(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (An(e.nodes.start, e.nodes.end), n = !0), e.f |= oe, On(e, t && !n), or(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Dn(e), e.f ^= oe, e.f |= ie;
	var i = e.parent;
	i !== null && i.first !== null && jn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function An(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ an(e);
		e.remove(), e = n;
	}
}
function jn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Mn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Nn(e, r, !0);
	var i = () => {
		n && R(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Nn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= re;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Nn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Pn(e) {
	e.f &= -257, Fn(e, !0);
}
function Fn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= re, e.f & 1024 || (D(e, te), At.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Fn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function In(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ an(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Ln = null, Rn = !1, zn = !1;
function Bn(e) {
	zn = e;
}
var z = null, Vn = !1;
function Hn(e) {
	z = e;
}
var B = null;
function Un(e) {
	B = e;
}
var Wn = null;
function Gn(e) {
	z !== null && (z.f & 2097152 || z.f & 2) && (Wn ??= /* @__PURE__ */ new Set()).add(e);
}
var Kn = null, qn = 0, Jn = null;
function Yn(e) {
	Jn = e;
}
var Xn = 1, Zn = 0, Qn = Zn;
function $n(e) {
	Qn = e;
}
function er() {
	return ++Xn;
}
function tr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (tr(a) && _t(a), a.wv > e.wv) return !0;
		}
		t & 512 && St === null && D(e, x);
	}
	return !1;
}
function nr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Wn !== null && Wn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? nr(a, t, !1) : t === a && (n ? D(a, te) : a.f & 1024 && D(a, ne), Ft(a));
	}
}
function rr(e) {
	var t = Kn, n = qn, r = Jn, i = z, a = Wn, o = Ke, s = Vn, c = Qn, l = e.f;
	Kn = null, qn = 0, Jn = null, z = l & 96 ? null : e, Wn = null, qe(e.ctx), Vn = !1, Qn = ++Zn, e.ac !== null && (at(() => {
		e.ac.abort(Ce);
	}), e.ac = null);
	try {
		e.f |= de;
		var u = e.fn, d = u();
		e.f |= ae;
		var f = ir(e);
		if (Ye() && Jn !== null && !Vn && f !== null && !(e.f & 6146)) for (var p = 0; p < Jn.length; p++) nr(Jn[p], e);
		if (i !== null && i !== e) {
			if (Zn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Zn;
			if (t !== null) for (let e of t) e.rv = Zn;
			Jn !== null && (r === null ? r = Jn : r.push(...Jn));
		}
		return e.f & 8388608 && (e.f ^= pe), d;
	} catch (t) {
		return ir(e), pn(t);
	} finally {
		e.f ^= de, Kn = t, qn = n, Jn = r, z = i, Wn = a, qe(o), Vn = s, Qn = c;
	}
}
function ir(e) {
	var t = e.deps, n = k?.is_fork;
	if (Kn !== null) {
		var r;
		if (n || or(e, qn), t !== null && qn > 0) for (t.length = qn + Kn.length, r = 0; r < Kn.length; r++) t[qn + r] = Kn[r];
		else e.deps = t = Kn;
		if (_n() && e.f & 512) for (r = qn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && qn < t.length && (or(e, qn), t.length = qn);
	return t;
}
function ar(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var i = c.call(n, e);
		if (i !== -1) {
			var a = n.length - 1;
			a === 0 ? n = t.reactions = null : (n[i] = n[a], n.pop());
		}
	}
	if (n === null && t.f & 2 && (Kn === null || !l.call(Kn, t))) {
		var o = t;
		o.f & 512 && (o.f ^= 512), o.v !== r && tt(o), o.ac !== null && at(() => {
			o.ac.abort(Ce), o.ac = null, D(o, te);
		}), vt(o), or(o, 0);
	}
}
function or(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) ar(e, n[r]);
}
function sr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		D(e, x);
		var n = B, r = Rn;
		B = e, Rn = !(t & 96);
		try {
			t & 16777232 ? kn(e) : On(e), Dn(e);
			var i = rr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Xn;
		} finally {
			Rn = r, B = n;
		}
	}
}
async function cr() {
	await Promise.resolve(), jt();
}
function V(e) {
	var t = !!(e.f & 2);
	if (Ln?.add(e), z !== null && !Vn && !(B !== null && B.f & 16384) && (Wn === null || !Wn.has(e))) {
		var n = z.deps;
		if (z.f & 2097152) e.rv < Zn && (e.rv = Zn, Kn === null && n !== null && n[qn] === e ? qn++ : Kn === null ? Kn = [e] : Kn.push(e));
		else {
			z.deps ??= [], l.call(z.deps, e) || z.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [z] : l.call(r, z) || r.push(z);
		}
	}
	if (zn && zt.has(e)) return zt.get(e);
	if (t) {
		var i = e;
		if (zn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || ur(i)) && (a = gt(i)), zt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Vn && z !== null && (Rn || !!(z.f & 512)), s = (i.f & ae) === 0;
		tr(i) && (o && (i.f |= 512), _t(i)), o && !s && (yt(i), lr(i));
	}
	if (St?.has(e)) return St.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function lr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (yt(t), lr(t));
}
function ur(e) {
	if (e.v === r) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (zt.has(t) || t.f & 2 && ur(t)) return !0;
	return !1;
}
function dr(e) {
	var t = Vn;
	try {
		return Vn = !0, e();
	} finally {
		Vn = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var fr = Symbol("events"), pr = /* @__PURE__ */ new Set(), mr = /* @__PURE__ */ new Set();
function hr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || xr.call(t, e), !e.cancelBubble) return at(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Qe(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function gr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = hr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && vn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function _r(e, t, n) {
	(t[fr] ??= {})[e] = n;
}
function vr(e) {
	for (var t = 0; t < e.length; t++) pr.add(e[t]);
	for (var n of mr) n(e);
}
var yr = null, br = !1;
function xr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	yr = e, br || (br = !0, setTimeout(() => {
		br = !1, yr = null;
	}));
	var o = 0, s = yr === e && e[fr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[fr] = t;
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
		Hn(null), Un(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[fr]?.[r];
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
			e[fr] = t, delete e.currentTarget, Hn(u), Un(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var Sr = we ? "template" : "TEMPLATE";
function Cr(e, t) {
	var n = B;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function wr(e, t) {
	var n = ln();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(M(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(un(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = r, u = e === "svg" ? a : e === "math" ? o : t;
		var i = cn(e, u, c?.is);
		for (var s in c) dn(i, s, c[s]);
		l.length > 0 && (i.nodeName === Sr ? i.content : i).append(wr(l, i.nodeName === "foreignObject" ? void 0 : u)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function H(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (S) return Cr(C, null), C;
		i === void 0 && (i = wr(e, t & 4 ? a : t & 8 ? o : void 0), n || (i = /* @__PURE__ */ rn(i)));
		var s = r || $t ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ rn(s), l = s.lastChild;
			Cr(c, l);
		} else Cr(s, s);
		return s;
	};
}
function Tr(e = "") {
	if (!S) {
		var t = M(e + "");
		return Cr(t, t), t;
	}
	var n = C;
	return n.nodeType === 3 ? fn(n) : (n.before(n = M()), Ae(n)), Cr(n, n), n;
}
function U() {
	if (S) return Cr(C, null), C;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = M();
	return e.append(t, n), Cr(t, n), e;
}
function W(e, t) {
	if (S) {
		var n = B;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = C), je();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Er = ["touchstart", "touchmove"];
function Dr(e) {
	return Er.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Or(e) {
	let t = 0, n = Vt(0), r;
	return () => {
		_n() && (V(n), Cn(() => (t === 0 && (r = dr(() => e(() => qt(n)))), t += 1, () => {
			Qe(() => {
				--t, t === 0 && (r?.(), r = void 0, qt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var kr = se | ce;
function Ar(e, t, n, r) {
	new jr(e, t, n, r);
}
var jr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = S ? C : null;
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
	#h = Or(() => (this.#m = Vt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = B;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = B.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = wn(() => {
			if (S) {
				let e = this.#t;
				je();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, kr), S && (this.#e = C);
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
		Qe(r), t && (this.#s = En(() => {
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
			t = !0, n && Ge(), this.#s !== null && Mn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = En(() => e(this.#e)), Qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = M(), n = !1;
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
				this.#c = null, n && this.#x(k);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Mn(this.#o, () => {
				this.#o = null;
			}), this.#x(k));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = En(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				In(this.#a, e);
				let t = this.#n.pending;
				this.#o = En(() => t(this.#e));
			} else this.#x(k);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		nt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = B, n = z, r = Ke;
		Un(this.#i), Hn(this.#i), qe(this.#i.ctx);
		try {
			return At.ensure(), e();
		} finally {
			Un(t), Hn(n), qe(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Mn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Qe(() => {
			this.#d = !1, this.#m && Gt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), V(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		k?.is_fork ? (this.#a && k.skip_effect(this.#a), this.#o && k.skip_effect(this.#o), this.#s && k.skip_effect(this.#s), k.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (R(this.#a), null), this.#o &&= (R(this.#o), null), this.#s &&= (R(this.#s), null), S && (Ae(this.#t), Me(), Ae(Ne()));
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
		Qe(() => {
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
	n !== (e[xe] ??= e.nodeValue) && (e[xe] = n, e.nodeValue = `${n}`);
}
function Mr(e, t) {
	return Pr(e, t);
}
var Nr = /* @__PURE__ */ new Map();
function Pr(e, { target: t, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	nn();
	var l = void 0, d = bn(() => {
		var s = r ?? t.appendChild(M());
		Ar(s, { pending: () => {} }, (t) => {
			T({});
			var r = Ke;
			if (o && (r.c = o), a && (i.$$events = a), S && Cr(t, null), l = e(t, i) || Je(), S && (B.nodes.end = C, C === null || C.nodeType !== 8 || C.data !== "]")) throw Ee(), n;
			E();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = Dr(r);
					for (let e of [t, document]) {
						var a = Nr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Nr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, xr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(u(pr)), mr.add(f), () => {
			for (var e of d) for (let r of [t, document]) {
				var n = Nr.get(r), i = n.get(e);
				--i == 0 ? (r.removeEventListener(e, xr), n.delete(e), n.size === 0 && Nr.delete(r)) : n.set(e, i);
			}
			mr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Fr.set(l, d), l;
}
var Fr = /* @__PURE__ */ new WeakMap();
function Ir(e, t) {
	let n = Fr.get(e);
	return n ? (Fr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Lr = class {
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
			if (n) Pn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Pn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (R(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						In(r, t), t.append(M()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else R(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Mn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (R(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = k, r = sn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = M();
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
		} else S && (this.anchor = C), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function Rr(e, t, ...n) {
	var r = new Lr(e);
	wn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, se);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function K(e, t, n = !1) {
	var r;
	S && (r = C, je());
	var i = new Lr(e), a = n ? se : 0;
	function o(e, t) {
		if (S) {
			var n = Pe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ne();
				Ae(a), i.anchor = a, ke(!1), i.ensure(e, t), ke(!0);
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
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function zr(e, t) {
	return t;
}
function Br(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Mn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Vr(e, u(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
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
		Vr(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Vr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ue, In(a, document.createDocumentFragment())) : R(t[i], n);
	}
}
var Hr;
function q(e, t, n, r, i, a = null) {
	var o = e, c = /* @__PURE__ */ new Map();
	if (t & 4) {
		var l = e;
		o = S ? Ae(/* @__PURE__ */ rn(l)) : l.appendChild(M());
	}
	S && je();
	var d = null, f = /* @__PURE__ */ mt(() => {
		var e = n();
		return s(e) ? e : e == null ? [] : u(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Wr(v, p, o, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ue, Kr(d, null, o)) : Pn(d) : Mn(d, () => {
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
			S && Pe(o) === "[!" != (e === 0) && (o = Ne(), Ae(o), ke(!1), s = !0);
			for (var l = /* @__PURE__ */ new Set(), u = k, v = sn(), y = 0; y < e; y += 1) {
				S && C.nodeType === 8 && C.data === "]" && (o = C, s = !0, ke(!1));
				var ee = p[y], b = r(ee, y), x = h ? null : c.get(b);
				x ? (x.v && Gt(x.v, ee), x.i && Gt(x.i, y), v && u.unskip_effect(x.e)) : (x = Gr(c, h ? o : Hr ??= M(), ee, b, y, i, t, n), h || (x.e.f |= ue), c.set(b, x)), l.add(b);
			}
			if (e === 0 && a && !d && (h ? d = En(() => a(o)) : (d = En(() => a(Hr ??= M())), d.f |= ue)), e > l.size && ze("", "", ""), S && e > 0 && Ae(Ne()), !h) {
				if (m.set(u, l), v) {
					for (let [e, t] of c) l.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			s && ke(!0), V(f);
		}),
		flags: t,
		items: c,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, S && (o = C);
}
function Ur(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Wr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = Ur(e.effect.first), l, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Pn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ue, _ === c) Kr(_, null, n);
			else {
				var y = d ? d.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), qr(e, d, _), qr(e, _, y), Kr(_, y, n), d = _, p = [], m = [], c = Ur(d.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var ee = m[0], b;
					d = ee.prev;
					var x = p[0], te = p[p.length - 1];
					for (b = 0; b < p.length; b += 1) Kr(p[b], ee, n);
					for (b = 0; b < m.length; b += 1) l.delete(m[b]);
					qr(e, x.prev, te.next), qr(e, d, x), qr(e, te, ee), c = ee, d = te, --v, p = [], m = [];
				} else l.delete(_), Kr(_, c, n), qr(e, _.prev, _.next), qr(e, _, d === null ? e.effect.first : d.next), qr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = Ur(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, c = Ur(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Vr(e, u(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var ne = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || ne.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && ne.push(c), c = Ur(c.next);
		var re = ne.length;
		if (re > 0) {
			var ie = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < re; v += 1) ne[v].nodes?.a?.measure();
				for (v = 0; v < re; v += 1) ne[v].nodes?.a?.fix();
			}
			Br(e, ne, ie);
		}
	}
	a && Qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Gr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Vt(n) : /* @__PURE__ */ Ht(n, !1, !1) : null, l = o & 2 ? Vt(i) : null;
	return {
		v: c,
		i: l,
		e: En(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Kr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ an(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function qr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Jr(e, t) {
	var n = void 0, r;
	Tn(() => {
		n !== (n = t()) && (r &&= (R(r), null), n && (r = En(() => {
			xn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Yr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Yr(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Xr() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Yr(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function Zr(e) {
	return typeof e == "object" ? Xr(e) : e ?? "";
}
var Qr = [..." 	\n\r\f\xA0\v﻿"];
function $r(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Qr.includes(r[o - 1])) && (s === r.length || Qr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ei(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ti(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function ni(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ti)), i && c.push(...Object.keys(i).map(ti));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ti(e.substring(l, u).trim());
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
		return r && (n += ei(r)), i && (n += ei(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function ri(e, t, n, r, i, a) {
	var o = e[ye];
	if (S || o !== n || o === void 0) {
		var s = $r(n, r, a);
		(!S || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ye] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function ii(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function ai(e, t, n, r) {
	var i = e[be];
	if (S || i !== t) {
		var a = ni(t, r);
		(!S || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[be] = t;
	} else r && (Array.isArray(r) ? (ii(e, n?.[0], r[0]), ii(e, n?.[1], r[1], "important")) : ii(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function oi(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function si(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || s(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = di(c);
			oi(c, r ? i.includes(l) : Zt(l, n));
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
function ci(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!s(t)) return De();
		for (var r of e.options) r.selected = t.includes(di(r));
		return;
	}
	for (r of e.options) if (Zt(di(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function li(e) {
	var t = new MutationObserver((t) => {
		t.every(fi) || ("__defaultValue" in e && si(e, !1), "__value" in e && ci(e, e.__value));
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
function ui(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ot(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), di);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && di(o);
		}
		n(a), e.__value = a, k !== null && r.add(k);
	}), xn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = k;
			if (r.has(o)) return;
		}
		if (ci(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = di(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function di(e) {
	return "__value" in e ? e.__value : e.value;
}
function fi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var pi = Symbol("is custom element"), mi = Symbol("is html"), hi = we ? "link" : "LINK";
function gi(e) {
	if (S) {
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
		e[Se] = n, Qe(n), it();
	}
}
function J(e, t, n, r) {
	var i = _i(e);
	S && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === hi) || i[t] !== (i[t] = n) && (t === "loading" && (e[_e] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && yi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function _i(e) {
	return e[ve] ??= {
		[pi]: e.nodeName.includes("-"),
		[mi]: e.namespaceURI === i
	};
}
var vi = /* @__PURE__ */ new Map();
function yi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = vi.get(t);
	if (n) return n;
	vi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = p(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = g(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function bi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	ot(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = xi(e) ? Si(a) : a, n(a), k !== null && r.add(k), await cr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (S && e.defaultValue !== e.value || dr(t) == null && e.value) && (n(xi(e) ? Si(e.value) : e.value), k !== null && r.add(k)), Cn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = k;
			if (r.has(i)) return;
		}
		xi(e) && n === Si(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function xi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Si(e) {
	return e === "" ? null : +e;
}
var Ci = /* @__PURE__ */ new class e {
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
function wi(e, t, n) {
	var r = Ci.observe(e, () => n(e[t]));
	xn(() => (dr(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var Ti = !1;
function Ei(e) {
	var t = Ti;
	try {
		return Ti = !1, [e(), Ti];
	} finally {
		Ti = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Di(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ dt(r), V(l)) : (c && (c = !1, s = o ? dr(r) : r), s);
	let d;
	if (a) {
		var p = me in e || ge in e;
		d = f(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = Ei(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = u(), d && (i && Ve(t), d(m)));
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
	var v = !1, y = (n & 1 ? dt : mt)(() => (v = !1, g()));
	a && V(y);
	var ee = B;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? V(y) : i && a ? Yt(e) : e;
			return j(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return zn && v || ee.f & 16384 ? y.v : V(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var Oi = /* @__PURE__ */ H([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function ki(e, t) {
	T(t, !0);
	var n = Oi(), r = F(n, !0);
	L(() => G(r, t.messages.text)), W(e, n), E();
}
var Ai = 12;
function ji(e) {
	return Math.max(320, e);
}
function Mi(e, t) {
	return e && t ? e / t : 1;
}
function Ni(e, t, n, r) {
	return (e - t) * r / (n || r);
}
function Pi(e, t, n) {
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
function Fi(e, t, n) {
	return Math.max(0, Math.min(e + Ai, n - t));
}
function Ii(e, t = 8) {
	let n = Math.max(1, Math.ceil(e / t));
	return Array.from({ length: Math.ceil(e / n) }, (e, t) => t * n);
}
function Li(e) {
	return Math.round(e) + .5;
}
//#endregion
//#region src/lib/colors.ts
var Ri = /* @__PURE__ */ t({
	BACKGROUND_EFFORT: () => Ui,
	EFFORT_ORDER: () => Vi,
	EFFORT_SHADES: () => Ki,
	HATCH_SHADES: () => qi,
	HATCH_TURNS: () => Ji,
	KNOWN_MODELS: () => zi,
	SLOT_COUNT: () => 8,
	effortHatch: () => $i,
	effortLabel: () => Gi,
	effortName: () => Wi,
	effortRank: () => Hi,
	effortShade: () => Qi,
	hatchTurn: () => ea,
	modelSlots: () => Bi,
	shade: () => Zi,
	slotColor: () => Xi,
	swatchFill: () => ta
}), zi = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function Bi(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of zi.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !zi.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var Vi = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function Hi(e) {
	let t = Vi.indexOf(e);
	return t === -1 ? Vi.length : t;
}
var Ui = "background";
function Wi(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function Gi(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var Ki = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, qi = {
	background: 1,
	ultracode: 4
}, Ji = {
	background: -45,
	ultracode: 45
};
function Yi(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function Xi(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function Zi(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? Xi(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function Qi(e, t) {
	return Zi(e, Yi(Ki, t) ?? 0);
}
function $i(e, t) {
	let n = Yi(qi, t);
	return n ? Zi(e, n) : null;
}
function ea(e) {
	return Yi(Ji, e);
}
function ta(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var na = /* @__PURE__ */ t({
	ago: () => ba,
	compact: () => Y,
	dayText: () => pa,
	duration: () => da,
	longDay: () => ha,
	longHour: () => va,
	money: () => Z,
	parseDay: () => fa,
	parseHour: () => ga,
	percent: () => ua,
	shortDay: () => ma,
	shortHour: () => _a,
	signed: () => la,
	when: () => ya,
	whole: () => X
}), ra = "–", ia = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), aa = new Intl.NumberFormat("en"), oa = {
	month: "short",
	day: "numeric"
}, sa = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, ca = {
	hour: "2-digit",
	minute: "2-digit"
};
function Y(e) {
	return e == null ? ra : ia.format(e);
}
function la(e) {
	return e < 0 ? `−${Y(-e)}` : `+${Y(e)}`;
}
function X(e) {
	return e == null ? ra : aa.format(e);
}
function Z(e) {
	return e == null ? ra : Math.abs(e) >= 1e3 ? "$" + ia.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function ua(e, t) {
	if (!t) return ra;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function da(e) {
	if (e == null) return ra;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function fa(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function pa(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function ma(e, t) {
	return fa(e).toLocaleDateString(t, oa);
}
function ha(e, t) {
	return fa(e).toLocaleDateString(t, sa);
}
function ga(e) {
	let [t = "", n = "0"] = e.split("T"), r = fa(t);
	return r.setHours(Number(n)), r;
}
function _a(e, t) {
	return ga(e).toLocaleTimeString(t, ca);
}
function va(e, t) {
	let n = ga(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, ca);
	return `${n.toLocaleDateString(t, sa)}, ${i(n)}–${i(r)}`;
}
function ya(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...oa,
		...ca
	}) : ra;
}
function ba(e, t = Date.now(), n) {
	if (!e) return ra;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : ya(e, n);
}
//#endregion
//#region src/lib/charts.ts
var xa = /* @__PURE__ */ t({
	LIMIT_ICON: () => "⚠",
	NO_USAGE: () => Pa,
	RATE_LIMIT: () => Ba,
	bandIndex: () => Oa,
	barShare: () => Ya,
	bucketTotals: () => Fa,
	chartSeries: () => Ia,
	columnPath: () => Aa,
	columnTotals: () => Ra,
	columnWidth: () => ka,
	costSplit: () => qa,
	costTop: () => Ja,
	daysSince: () => Ma,
	errorText: () => Ua,
	inputTotal: () => Sa,
	limitCounts: () => Wa,
	limitTop: () => Ta,
	limitType: () => Ha,
	lineX: () => Ea,
	modelGroups: () => La,
	nearestIndex: () => Da,
	niceMax: () => Ca,
	peakIndex: () => ja,
	stackSegments: () => za,
	ticks: () => wa,
	timeBuckets: () => Na,
	windowHitAfter: () => Ga,
	windowSpan: () => Ka
});
function Sa(e) {
	return e.new_input + e.cache_write + e.cache_read;
}
function Ca(e) {
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
function wa(e, t) {
	return Array.from({ length: t + 1 }, (n, r) => e * r / t);
}
function Ta(e) {
	return Math.max(2, Math.ceil(Ca(e) / 2) * 2);
}
function Ea(e, t, n) {
	let r = e - 1;
	return (e) => r > 0 ? t + (n - t) * e / r : (t + n) / 2;
}
function Da(e, t, n) {
	return (r) => n > 1 ? Math.round((r - e) / (t - e) * (n - 1)) : 0;
}
function Oa(e, t) {
	return (n) => Math.floor((n - e) / t);
}
function ka(e, t = 24) {
	return Math.max(2, Math.min(t, e * .6));
}
function Aa(e, t, n, r, i, a = 4) {
	let o = i ? Math.min(a, n / 2, r) : 0;
	return `M${e},${t + r}V${t + o}` + (o ? `Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}` : `H${e + n}`) + `V${t + r}Z`;
}
function ja(e) {
	return e.indexOf(Math.max(...e));
}
function Ma(e, t = /* @__PURE__ */ new Date()) {
	let n = [];
	for (let r = fa(e); r <= t; r.setDate(r.getDate() + 1)) n.push(pa(r));
	return n;
}
function Na(e, t = /* @__PURE__ */ new Date()) {
	if (e.days !== 1 || !e.hour_model) return {
		keys: Ma(e.since, t),
		unit: "day",
		heading: "Day",
		short: ma,
		long: ha,
		keyOf: (e) => e.day ?? ""
	};
	let n = e.since === pa(t) ? t.getHours() : 23, r = [];
	for (let t = 0; t <= n; t += 1) r.push(`${e.since}T${String(t).padStart(2, "0")}`);
	return {
		keys: r,
		unit: "hour",
		heading: "Hour",
		short: _a,
		long: va,
		keyOf: (e) => e.hour ?? ""
	};
}
var Pa = {
	cost: 0,
	input: 0,
	output: 0
};
function Fa(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			cost: 0,
			input: 0,
			output: 0
		};
		i.cost += r.cost || 0, i.input += Sa(r), i.output += r.output, n.set(e, i);
	}
	return n;
}
function Ia(e, t, n) {
	let r = Bi([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${Wi(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: Qi(e, a.effort),
			hatch: $i(e, a.effort),
			turn: ea(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : Hi(e);
	return [...i.values()].sort((e, t) => (e.slot ?? 8) - (t.slot ?? 8) || e.model.localeCompare(t.model) || a(e.effort) - a(t.effort) || String(e.effort).localeCompare(String(t.effort)));
}
function La(e) {
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
function Ra(e, t) {
	return t.map((t) => e.reduce((e, n) => e + (n.values.get(t) ?? 0), 0));
}
function za(e, t, n, r = 2, i = 4) {
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
var Ba = "rate_limit", Va = {
	five_hour: "5-hour limit",
	seven_day: "weekly limit",
	seven_day_opus: "weekly Opus limit"
};
function Ha(e) {
	return e ? Object.hasOwn(Va, e) ? Va[e] ?? e : e.replaceAll("_", " ") : "–";
}
function Ua(e) {
	let t = e.status ? ` (${e.status})` : "";
	return e.error === "rate_limit" ? `⚠ Rate limit${t}` : `${e.error.replaceAll("_", " ")}${t}`;
}
function Wa(e, t) {
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
function Ga(e) {
	return Date.parse(e.first_hit) - Date.parse(e.start);
}
function Ka(e, t) {
	let n = new Date(e.start), r = new Date(e.resets_at), i = n.toDateString() === r.toDateString() ? r.toLocaleTimeString(t, {
		hour: "2-digit",
		minute: "2-digit"
	}) : ya(e.resets_at, t);
	return `${ya(e.start, t)} – ${i}`;
}
function qa(e) {
	let t = e.cost_parts.cache_read;
	return {
		cacheRead: t,
		rest: Math.max(0, (e.cost || 0) - t)
	};
}
function Ja(e) {
	return Math.max(0, ...e.map((e) => e.cost || 0)) || 1;
}
function Ya(e, t) {
	return 100 * (e || 0) / t;
}
//#endregion
//#region src/lib/bymodel.ts
var Xa = {
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
		value: Sa,
		format: Y
	}
}, Za = Object.keys(Xa);
function Qa(e) {
	return Za.find((t) => t === e) ?? "cost";
}
var $a = 248;
function eo(e, t, n = /* @__PURE__ */ new Date()) {
	let r = Xa[t], i = Na(e, n), a = Ia(i.unit === "hour" ? e.hour_model_effort : e.day_model_effort, i.keyOf, r.value);
	return {
		buckets: i,
		series: a,
		totals: Ra(a, i.keys),
		metric: r
	};
}
function to(e, t) {
	let n = e - 8, r = (n - 56) / t;
	return {
		right: n,
		band: r,
		barWidth: ka(r, 24)
	};
}
function no(e, t) {
	return Oa(56, to(e, t).band);
}
function ro(e, t, n) {
	let { band: r, barWidth: i } = to(e, t);
	return 56 + r * n + (r - i) / 2;
}
function io(e, t, n) {
	let r = e.filter((e) => (e.values.get(t) ?? 0) > 0), i = r.map((e) => 220 * (e.values.get(t) ?? 0) / n);
	return za(r.map((e) => e.model), i, 220, 2, 4).map((e) => ({
		entry: r[e.position],
		segment: e
	}));
}
function ao(e) {
	let t = e.filter((e) => e.hatch).map((e, t) => ({
		id: `model-hatch-${t}`,
		entry: e
	})), n = new Map(t.map((e) => [e.entry, e.id]));
	return {
		patterns: t,
		fill: (e) => n.has(e) ? `url(#${n.get(e)})` : e.color
	};
}
function oo(e, t) {
	return `${e.label} per ${t} by model and effort level; table view available`;
}
function so(e, t) {
	return `${e.label} per ${t}; arrow keys step through them`;
}
function co(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${e.metric.format(e.totals[t] ?? 0)}`;
}
function lo(e) {
	return La(e).map((e) => ({
		model: e.model,
		entries: e.entries.map((e) => ({
			entry: e,
			text: Gi(e.effort)
		}))
	}));
}
function uo(e, t) {
	return La(e.filter((e) => e.values.get(t))).map((e) => ({
		model: e.model,
		value: e.entries.reduce((e, n) => e + (n.values.get(t) ?? 0), 0),
		efforts: e.entries.slice().reverse().map((e) => ({
			entry: e,
			text: Gi(e.effort),
			value: e.values.get(t) ?? 0
		}))
	}));
}
function fo(e) {
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
var po = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ A(0);
	#n = /* @__PURE__ */ A(0);
	#r = Qn || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return Qn === this.#r ? /* @__PURE__ */ A(e) : Vt(e);
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
		if (r === void 0) r = this.#i(0), n.set(e, r), j(this.#n, super.size), qt(o);
		else if (i !== t) {
			qt(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && qt(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), j(n, -1)), r && (j(this.#n, super.size), qt(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			j(this.#n, 0);
			for (var t of e.values()) j(t, -1);
			qt(this.#t), e.clear();
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
}, mo = /* @__PURE__ */ t({
	Payload: () => ho,
	payload: () => Q,
	setPayload: () => go
}), ho = class {
	#e = /* @__PURE__ */ A(null);
	#t = /* @__PURE__ */ A(!1);
	#n = /* @__PURE__ */ A(null);
	#r = /* @__PURE__ */ A(!1);
	#i = /* @__PURE__ */ A(null);
	#a = new po();
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
		e.summary !== void 0 && (j(this.#e, e.summary), j(this.#t, !1)), e.summaryFailed !== void 0 && j(this.#t, e.summaryFailed, !0), e.live !== void 0 && (j(this.#n, e.live), j(this.#r, !1)), e.liveFailed !== void 0 && j(this.#r, e.liveFailed, !0), e.liveAt !== void 0 && j(this.#i, e.liveAt, !0);
	}
	reset() {
		j(this.#e, null), j(this.#t, !1), j(this.#n, null), j(this.#r, !1), j(this.#i, null), this.#a.clear();
	}
}, Q = new ho();
function go(e) {
	Q.set(e), jt();
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
		ya(e.last_ts),
		X(e.subagents),
		X(e.turns),
		Y(e.context_avg),
		Y(e.context_peak),
		Y(e.output),
		Z(e.cost)
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
			label: `${X(a)} ${Po(t, a)}`
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
	let t = Sa(e);
	return [
		X(e.turns),
		Y(t),
		ua(e.cache_read, t),
		Y(e.output),
		Z(e.cost)
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
	#e = /* @__PURE__ */ A(Yt(Xo(ts("theme"))));
	#t = /* @__PURE__ */ A(Yt(So(ts("page_size"), vo, 25)));
	#n = /* @__PURE__ */ A(ts("chat-oldest-first") === "true");
	get theme() {
		return V(this.#e);
	}
	set theme(e) {
		let t = Xo(e);
		j(this.#e, t, !0), ns("theme", t ?? "auto");
	}
	get pageSize() {
		return V(this.#t);
	}
	set pageSize(e) {
		vo.includes(e) && (j(this.#t, e, !0), ns("page_size", String(e)));
	}
	get oldestFirst() {
		return V(this.#n);
	}
	set oldestFirst(e) {
		j(this.#n, e, !0), ns("chat-oldest-first", String(e));
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
var ss = /* @__PURE__ */ H([[
	"div",
	{ class: "tooltip" },
	,
]]);
function cs(e, t) {
	T(t, !0);
	let n = Di(t, "top", 3, 8);
	function r(e) {
		let r = e.parentElement?.clientWidth ?? 0;
		e.style.left = `${Fi(t.anchor, e.offsetWidth, r)}px`, e.style.top = `${n()}px`;
	}
	var i = ss();
	Rr(N(i), () => t.children), w(i), Jr(i, () => r), W(e, i), E();
}
//#endregion
//#region src/components/Chart.svelte
var ls = /* @__PURE__ */ H([["rect", {
	class: "hit",
	tabindex: "0",
	role: "slider",
	"aria-valuemin": "1"
}]], 4), us = /* @__PURE__ */ H([[
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
	T(t, !0);
	let n = /* @__PURE__ */ O(() => (t.cursor?.count ?? 0) - 1), r = /* @__PURE__ */ A(null), i = /* @__PURE__ */ O(() => V(r) === null ? V(n) : Math.min(V(r), V(n))), a = /* @__PURE__ */ A(null), o = /* @__PURE__ */ O(() => V(a) === null || V(n) < 0 ? null : Math.min(V(a), V(n))), s = /* @__PURE__ */ O(() => t.cursor?.area(t.width));
	function c(e) {
		j(r, Math.min(Math.max(0, e), V(n)), !0), j(a, V(r), !0);
	}
	function l(e) {
		let n = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
		t.cursor && n && c(t.cursor.indexAt(t.width)(Ni(e.clientX, n.left, n.width, t.width)));
	}
	function u(e) {
		if (!t.cursor) return;
		let n = Pi(e.key, V(i), t.cursor.count);
		n !== null && (c(n), e.preventDefault());
	}
	var d = us(), f = P(d), p = N(f), m = N(p);
	Rr(m, () => t.plot, () => t.width);
	var h = I(m), g = (e) => {
		var n = U();
		Rr(P(n), () => t.marks ?? v, () => t.width, () => V(o)), W(e, n);
	};
	K(h, (e) => {
		V(o) !== null && e(g);
	}), w(p);
	var _ = I(p), y = (e) => {
		var n = ls();
		L((e, r) => {
			J(n, "x", V(s).x), J(n, "y", V(s).y), J(n, "width", e), J(n, "height", V(s).height), J(n, "aria-label", t.cursor.label), J(n, "aria-valuemax", t.cursor.count), J(n, "aria-valuenow", V(i) + 1), J(n, "aria-valuetext", r);
		}, [() => Math.max(1, V(s).width), () => t.cursor.valueText(V(i))]), _r("pointermove", n, l), gr("focus", n, () => c(V(i))), _r("keydown", n, u), gr("pointerleave", n, () => j(a, null)), gr("blur", n, () => j(a, null)), W(e, n);
	};
	K(_, (e) => {
		t.cursor && V(s) && V(n) >= 0 && e(y);
	}), w(f);
	var ee = I(f), b = (e) => {
		{
			let n = /* @__PURE__ */ O(() => t.cursor.tipX(t.width, V(o)) * Mi(t.containerWidth, t.width));
			cs(e, {
				get anchor() {
					return V(n);
				},
				get top() {
					return t.tipTop;
				},
				children: (e, n) => {
					var r = U();
					Rr(P(r), () => t.tip, () => V(o)), W(e, r);
				},
				$$slots: { default: !0 }
			});
		}
	};
	K(ee, (e) => {
		t.cursor && V(o) !== null && t.tip && e(b);
	}), L(() => {
		J(f, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), J(f, "height", t.height), J(p, "aria-label", t.label);
	}), W(e, d), E();
}
vr(["pointermove", "keydown"]);
//#endregion
//#region src/components/ChartCard.svelte
var fs = /* @__PURE__ */ H([[
	"span",
	{ class: "muted" },
	" "
]]), ps = /* @__PURE__ */ H([[
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
	let n = /* @__PURE__ */ A(!1);
	var r = ps(), i = N(r), a = N(i), o = F(a, !0), s = I(a, 2), c = (e) => {
		var n = fs(), r = F(n, !0);
		L(() => G(r, t.note)), W(e, n);
	};
	K(s, (e) => {
		t.note && e(c);
	});
	var l = I(s, 2);
	Rr(l, () => t.controls ?? v);
	var u = I(l, 4);
	w(i);
	var d = I(i, 2);
	Rr(d, () => t.legend ?? v);
	var f = I(d, 2);
	Rr(f, () => t.chart);
	var p = I(f, 2), m = (e) => {
		var n = U();
		Rr(P(n), () => t.table), W(e, n);
	};
	K(p, (e) => {
		V(n) && e(m);
	}), Rr(I(p, 2), () => t.extra ?? v), w(r), L(() => {
		J(r, "aria-labelledby", `${t.id ?? ""}-title`), J(a, "id", `${t.id ?? ""}-title`), G(o, t.title), J(u, "id", `${t.id ?? ""}-table-toggle`), J(u, "aria-pressed", V(n));
	}), _r("click", u, () => j(n, !V(n))), W(e, r);
}
vr(["click"]);
//#endregion
//#region src/components/Swatch.svelte
var hs = /* @__PURE__ */ H([["span", { class: "swatch" }]]);
function gs(e, t) {
	var n = hs();
	let r;
	L(() => r = ai(n, "", r, { background: t.fill })), W(e, n);
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
var bs = /* @__PURE__ */ H([[
	"option",
	null,
	" "
]]), xs = /* @__PURE__ */ H([[
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
	T(t, !0);
	let n = /* @__PURE__ */ O(() => (t.units.at(-1) ?? -1) + 1), r = /* @__PURE__ */ O(() => Es(t.key, V(n))), i = /* @__PURE__ */ O(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function a() {
		Ts.first(t.key) !== V(r).first && Ts.set(t.key, V(r).first);
	}
	a();
	function o(e, r) {
		let i = e.closest(".pager"), a = vs(i ? [i] : []);
		Ts.set(t.key, bo(V(n), as.pageSize, r).first), jt(), ys(a, i);
	}
	function s(e, t) {
		let n = e.closest(".pager"), r = vs(n ? [n] : []);
		as.pageSize = t, jt(), ys(r, n);
	}
	function c() {
		let { first: e, last: n } = V(r);
		t.rows?.forEach((r, i) => {
			let a = t.units[i];
			a !== void 0 && r.classList.toggle("off-page", a < e || a >= n);
		});
	}
	var l = xs(), u = N(l);
	q(u, 20, () => vo, (e) => e, (e, n) => {
		var r = bs(), i = F(r), a = {};
		L(() => {
			G(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), W(e, r);
	}), w(u);
	var d;
	li(u);
	var f = I(u, 2), p = I(f, 2), m = F(p, !0), h = I(p, 2);
	w(l), Jr(l, () => c), L((e) => {
		J(u, "id", `pager-${t.key ?? ""}-size`), J(u, "aria-label", `${V(i) ?? ""} per page`), d !== (d = as.pageSize) && (u.value = (u.__value = d) ?? "", ci(u, d)), J(f, "id", `pager-${t.key ?? ""}-previous`), f.disabled = V(r).page === 0, G(m, e), J(h, "id", `pager-${t.key ?? ""}-next`), h.disabled = V(r).page === V(r).pages - 1;
	}, [() => xo(V(r), V(n), t.noun)]), _r("change", u, (e) => s(e.currentTarget, Number(e.currentTarget.value))), _r("click", f, (e) => o(e.currentTarget, V(r).page - 1)), _r("click", h, (e) => o(e.currentTarget, V(r).page + 1)), W(e, l), E();
}
vr(["change", "click"]);
//#endregion
//#region src/lib/paging.svelte.ts
var Cs = /* @__PURE__ */ t({
	TablePages: () => ws,
	mountPager: () => Os,
	releaseDetachedPagers: () => ks,
	shownWindow: () => Es,
	tablePages: () => Ts
}), ws = class {
	#e = new po();
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
	let t = document.createElement("div"), n = Mr(Ss, {
		target: t,
		props: e
	});
	jt();
	let r = t.firstElementChild;
	if (!(r instanceof HTMLElement)) throw Error("The pager drew no element");
	return Ds.add({
		component: n,
		root: r
	}), r;
}
function ks() {
	for (let e of [...Ds]) e.root.isConnected || (Ds.delete(e), Ir(e.component));
}
//#endregion
//#region src/components/TableView.svelte
var As = /* @__PURE__ */ H([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), js = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	" "
]]), Ms = /* @__PURE__ */ H([[
	"th",
	{ scope: "col" },
	" "
]]), Ns = /* @__PURE__ */ H([[
	"tr",
	null,
	,
]]), Ps = /* @__PURE__ */ H([[
	"table",
	null,
	[
		"thead",
		null,
		["tr"]
	],
	["tbody"]
]]), Fs = /* @__PURE__ */ H([
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
	T(t, !0);
	let n = (e) => {
		var n = U(), o = P(n), s = (e) => {
			Ss(e, {
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
			V(a) > vo[0] && e(s);
		}), W(e, n);
	}, r = Di(t, "noun", 3, "rows"), i = /* @__PURE__ */ O(() => yo(t.rows.map((e) => t.sub?.(e) ?? !1))), a = /* @__PURE__ */ O(() => (V(i).at(-1) ?? -1) + 1), o = /* @__PURE__ */ O(() => Es(t.key, V(a))), s = /* @__PURE__ */ O(() => t.rows.filter((e, t) => {
		let n = V(i)[t] ?? 0;
		return n >= V(o).first && n < V(o).last;
	}));
	var c = Fs(), l = P(c), u = (e) => {
		var r = U(), i = P(r), o = (e) => {
			var r = As(), i = N(r);
			Rr(i, () => t.heading);
			var a = I(i, 2);
			n(a), w(r), W(e, r);
		}, s = (e) => {
			var n = U();
			Rr(P(n), () => t.heading), W(e, n);
		};
		K(i, (e) => {
			V(a) > vo[0] ? e(o) : e(s, -1);
		}), W(e, r);
	};
	K(l, (e) => {
		t.heading && e(u);
	});
	var d = I(l, 2);
	Rr(d, () => t.intro ?? v);
	var f = I(d, 2), p = N(f), m = (e) => {
		n(e);
	};
	K(p, (e) => {
		t.heading || e(m);
	});
	var h = I(p, 2), g = (e) => {
		var n = js(), r = F(n, !0);
		L(() => G(r, t.empty)), W(e, n);
	}, _ = (e) => {
		var n = Ps(), r = N(n), i = N(r);
		q(i, 21, () => t.columns, (e) => e.label, (e, t) => {
			var n = Ms(), r = F(n, !0);
			L(() => {
				ri(n, 1, Zr(V(t).numeric ? "num" : void 0)), G(r, V(t).label);
			}), W(e, n);
		}), w(i), w(r);
		var a = I(r);
		q(a, 21, () => V(s), (e) => t.rowKey(e), (e, n) => {
			var r = Ns();
			Rr(N(r), () => t.cells, () => V(n)), w(r), L((e) => ri(r, 1, e), [() => Zr(t.sub?.(V(n)) ? "sub-row" : t.group?.(V(n)) ? "group-row" : void 0)]), W(e, r);
		}), w(a), w(n), L(() => J(n, "aria-labelledby", t.labelledby)), W(e, n);
	};
	K(h, (e) => {
		t.rows.length === 0 && t.empty !== void 0 ? e(g) : e(_, -1);
	}), w(f), W(e, c), E();
}
//#endregion
//#region src/components/XLabels.svelte
var Ls = /* @__PURE__ */ H([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4);
function Rs(e, t) {
	T(t, !0);
	var n = U();
	q(P(n), 16, () => Ii(t.count, t.most), (e) => e, (e, n) => {
		var r = Ls(), i = F(r, !0);
		L((e, n) => {
			J(r, "x", e), J(r, "y", t.y), G(i, n);
		}, [() => t.xOf(n), () => t.text(n)]), W(e, r);
	}), W(e, n), E();
}
//#endregion
//#region src/components/YAxis.svelte
var zs = /* @__PURE__ */ H([["line", { "stroke-width": "1" }], [
	"text",
	{
		"text-anchor": "end",
		class: "axis-text"
	},
	" "
]], 5);
function Bs(e, t) {
	T(t, !0);
	var n = U();
	q(P(n), 18, () => t.values, (e) => e, (e, n, r) => {
		let i = /* @__PURE__ */ O(() => Li(t.yOf(n)));
		var a = zs(), o = P(a), s = I(o), c = F(s, !0);
		L((e) => {
			J(o, "x1", t.left), J(o, "x2", t.right), J(o, "y1", V(i)), J(o, "y2", V(i)), J(o, "stroke", V(r) === 0 ? "var(--axis)" : "var(--grid)"), J(s, "x", t.left - 8), J(s, "y", V(i) + 4), G(c, e);
		}, [() => t.format(n)]), W(e, a);
	}), W(e, n), E();
}
//#endregion
//#region src/components/ByModel.svelte
var Vs = /* @__PURE__ */ H([[
	"button",
	{ type: "button" },
	" "
]]), Hs = /* @__PURE__ */ H([["div", {
	class: "segmented",
	role: "group",
	"aria-label": "Metric"
}]]), Us = /* @__PURE__ */ H([[
	"span",
	null,
	,
	" "
]]), Ws = /* @__PURE__ */ H([[
	"span",
	{ class: "legend-group" },
	[
		"strong",
		null,
		" "
	],
	" ",
	,
]]), Gs = /* @__PURE__ */ H([[
	"div",
	{ class: "legend" },
	,
]]), Ks = /* @__PURE__ */ H([[
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
]], 4), qs = /* @__PURE__ */ H([["defs"]], 4), Js = /* @__PURE__ */ H([["path"]], 4), Ys = /* @__PURE__ */ H([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), Xs = /* @__PURE__ */ H([
	,
	,
	,
], 5), Zs = /* @__PURE__ */ H([
	,
	,
	,
	,
	,
], 5), Qs = /* @__PURE__ */ H([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), $s = /* @__PURE__ */ H([[
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
]]), ec = /* @__PURE__ */ H([
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
], 1), tc = /* @__PURE__ */ H([[
	"div",
	{ class: "name" },
	"No usage"
]]), nc = /* @__PURE__ */ H([[
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
]]), rc = /* @__PURE__ */ H([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	,
], 1), ic = /* @__PURE__ */ H([[
	"div",
	{ class: "chart" },
	,
]]), ac = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), oc = /* @__PURE__ */ H([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function sc(e, t) {
	T(t, !0);
	let n = (e) => {
		var t = Hs();
		q(t, 20, () => Za, (e) => e, (e, t) => {
			var n = Vs(), r = F(n, !0);
			L(() => {
				J(n, "aria-pressed", V(s) === t), G(r, Xa[t].label);
			}), _r("click", n, () => _(t)), W(e, n);
		}), w(t), W(e, t);
	}, r = (e) => {
		var t = Gs(), n = N(t), r = (e) => {
			var t = U();
			q(P(t), 17, () => lo(V(c).series), (e) => e.model, (e, t) => {
				var n = Ws(), r = N(n), i = F(r, !0);
				q(I(r, 2), 17, () => V(t).entries, ({ entry: e, text: t }) => e.key, (e, t) => {
					let n = () => V(t).entry, r = () => V(t).text;
					var i = Us(), a = N(i);
					{
						let e = /* @__PURE__ */ O(() => ta(n().color, n().hatch, n().turn));
						gs(a, { get fill() {
							return V(e);
						} });
					}
					var o = I(a, 1, !0);
					w(i), L(() => G(o, r())), W(e, i);
				}), w(n), L(() => G(i, V(t).model)), W(e, n);
			}), W(e, t);
		};
		K(n, (e) => {
			V(c) && e(r);
		}), w(t), W(e, t);
	}, i = (e) => {
		var t = ic(), n = N(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ O(() => to(t(), V(a).length)), r = /* @__PURE__ */ O(() => ja(V(c).totals));
				var s = Zs(), l = P(s), d = (e) => {
					var t = qs();
					q(t, 21, () => V(u).patterns, ({ id: e, entry: t }) => e, (e, t) => {
						let n = () => V(t).id, r = () => V(t).entry;
						var i = Ks(), a = N(i), o = I(a);
						w(i), L(() => {
							J(i, "id", n()), J(i, "patternTransform", `rotate(${r().turn ?? ""})`), J(a, "fill", r().color), J(o, "fill", r().hatch);
						}), W(e, i);
					}), w(t), W(e, t);
				};
				K(l, (e) => {
					V(u).patterns.length && e(d);
				});
				var p = I(l);
				{
					let e = /* @__PURE__ */ O(() => wa(V(f), 4));
					Bs(p, {
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
				var m = I(p);
				{
					let e = /* @__PURE__ */ O(() => 238);
					Rs(m, {
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
				q(I(m), 18, () => V(a), (e) => e, (e, i, s) => {
					let l = /* @__PURE__ */ O(() => ro(t(), V(a).length, V(s)));
					var d = Xs(), p = P(d);
					q(p, 17, () => io(V(c).series, i, V(f)), ({ entry: e, segment: t }) => e.key, (e, t) => {
						let r = () => V(t).entry, i = () => V(t).segment;
						var a = Js();
						L((e, t) => {
							J(a, "d", e), J(a, "fill", t);
						}, [() => Aa(V(l), i().y, V(n).barWidth, i().height, i().top), () => V(u).fill(r())]), W(e, a);
					});
					var m = I(p), h = (e) => {
						let t = /* @__PURE__ */ O(() => V(c).totals[V(s)] ?? 0);
						var r = Ys(), i = F(r, !0);
						L((e) => {
							J(r, "x", V(l) + V(n).barWidth / 2), J(r, "y", 220 - 220 * V(t) / V(f) - 6), G(i, e);
						}, [() => V(o)(V(t))]), W(e, r);
					};
					K(m, (e) => {
						V(s) === V(r) && (V(c).totals[V(s)] ?? 0) > 0 && e(h);
					}), W(e, d);
				}), W(e, s);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ O(() => to(t(), V(a).length).band);
				var i = Qs();
				L(() => {
					J(i, "x", 56 + V(r) * n()), J(i, "width", V(r)), J(i, "height", 220);
				}), W(e, i);
			}, r = (e, t = v) => {
				let n = /* @__PURE__ */ O(() => V(a)[t()] ?? ""), r = /* @__PURE__ */ O(() => uo(V(c).series, V(n)));
				var s = rc(), l = P(s), u = F(l, !0), d = I(l, 2);
				q(d, 17, () => V(r), (e) => e.model, (e, t) => {
					var n = ec(), r = P(n), i = N(r), a = F(i, !0), s = F(I(i), !0);
					w(r), q(I(r, 2), 17, () => V(t).efforts, ({ entry: e, text: t, value: n }) => e.key, (e, t) => {
						let n = () => V(t).entry, r = () => V(t).text, i = () => V(t).value;
						var a = $s(), s = N(a), c = N(s);
						{
							let e = /* @__PURE__ */ O(() => ta(n().color, n().hatch, n().turn));
							gs(c, { get fill() {
								return V(e);
							} });
						}
						var l = I(c, 1, !0);
						w(s);
						var u = F(I(s, 2), !0);
						w(a), L((e) => {
							G(l, r()), G(u, e);
						}, [() => V(o)(i())]), W(e, a);
					}), L((e) => {
						G(a, V(t).model), G(s, e);
					}, [() => V(o)(V(t).value)]), W(e, n);
				}, (e) => {
					W(e, tc());
				});
				var f = I(d, 2), p = (e) => {
					var n = nc(), r = F(I(N(n)), !0);
					w(n), L((e) => G(r, e), [() => V(o)(V(c).totals[t()] ?? 0)]), W(e, n);
				};
				K(f, (e) => {
					V(r).length > 1 && e(p);
				}), L((e) => G(u, e), [() => V(i).long(V(n))]), W(e, s);
			}, i = /* @__PURE__ */ O(() => V(c).buckets), a = /* @__PURE__ */ O(() => V(i).keys), o = /* @__PURE__ */ O(() => V(c).metric.format);
			{
				let i = /* @__PURE__ */ O(() => oo(V(c).metric, V(l)));
				ds(e, {
					get height() {
						return $a;
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
		}), w(t), wi(t, "clientWidth", (e) => j(m, e)), W(e, t);
	}, a = (e) => {
		var t = U(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				var r = oc(), i = P(r), a = F(i, !0);
				q(I(i, 2), 18, () => V(n).others, (e) => e, (e, n, r) => {
					var i = ac(), a = F(i, !0);
					L(() => G(a, t().cells[V(r) + 1])), W(e, i);
				}), L(() => G(a, t().cells[0])), W(e, r);
			}, n = /* @__PURE__ */ O(() => {
				let [e = "", ...t] = V(p).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let r = /* @__PURE__ */ O(() => [{ label: V(n).first }, ...V(n).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				Is(e, {
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
	}, o = /* @__PURE__ */ O(() => Q.summary), s = /* @__PURE__ */ A(Yt(Qa(ts("metric")))), c = /* @__PURE__ */ O(() => V(o) ? eo(V(o), V(s)) : null), l = /* @__PURE__ */ O(() => V(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ O(() => V(c) ? ao(V(c).series) : null), d = /* @__PURE__ */ O(() => V(o) ? V(l) === "hour" ? $("Per hour, by model and effort") : $("Per day, by model and effort") : $("Per day, by model")), f = /* @__PURE__ */ O(() => Ca(Math.max(...V(c)?.totals ?? [], 0))), p = /* @__PURE__ */ O(() => V(c) ? fo(V(c)) : null), m = /* @__PURE__ */ A(0), h = /* @__PURE__ */ O(() => ji(V(m))), g = /* @__PURE__ */ O(() => V(c) ? {
		count: V(c).buckets.keys.length,
		label: so(V(c).metric, V(l)),
		valueText: (e) => co(V(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: to(e, V(c).buckets.keys.length).right - 56,
			height: 220
		}),
		indexAt: (e) => no(e, V(c).buckets.keys.length),
		tipX: (e, t) => 56 + to(e, V(c).buckets.keys.length).band * (t + .5)
	} : null);
	function _(e) {
		j(s, e, !0), ns("metric", e);
	}
	ms(e, {
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
	}), E();
}
vr(["click"]);
//#endregion
//#region src/lib/costly.ts
var cc = [{
	label: "Cache reads",
	color: "var(--split-soft)",
	value: (e) => qa(e).cacheRead
}, {
	label: "Everything else",
	color: "var(--split-strong)",
	note: "new input, cache writes, output and web searches",
	value: (e) => qa(e).rest
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
	let t = Ja(e);
	return e.map((e) => {
		let n = uc(e), r = cc.map((t) => ({
			part: t,
			amount: t.value(e)
		})), i = r.map(({ part: e, amount: t }) => `${e.label} ${Z(t)}`).join(", ");
		return {
			session: e,
			title: n,
			href: dc(e),
			detail: `${e.project} · ${X(e.turns)} turns · avg context ${Y(e.context_avg)}`,
			share: Ya(e.cost, t),
			cost: Z(e.cost),
			parts: r,
			label: `${n}: ${Z(e.cost)}; ${i}`
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
			amount: Z(n),
			share: ua(n, t.cost || 0)
		})),
		total: e.cost,
		context: `${X(t.turns)} turns · context avg ${Y(t.context_avg)}, peak ${Y(t.context_peak)}`
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
				X(e.turns),
				Y(e.context_avg),
				Y(e.context_peak),
				...cc.map((t) => Z(t.value(e))),
				Z(e.cost)
			]
		}))
	};
}
//#endregion
//#region src/components/CostPerSession.svelte
var hc = /* @__PURE__ */ H([[
	"span",
	null,
	,
	" "
]]), gc = /* @__PURE__ */ H([[
	"div",
	{ class: "legend" },
	,
]]), _c = /* @__PURE__ */ H([["span"]]), vc = /* @__PURE__ */ H([[
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
]]), yc = /* @__PURE__ */ H([[
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
]]), bc = /* @__PURE__ */ H([
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
], 1), xc = /* @__PURE__ */ H([
	["div", { class: "bars" }],
	" ",
	,
], 1), Sc = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	"No sessions in this range."
]]), Cc = /* @__PURE__ */ H([[
	"div",
	{ class: "chart" },
	,
]]), wc = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), Tc = /* @__PURE__ */ H([
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
	T(t, !0);
	let n = (e) => {
		var t = gc(), n = N(t), r = (e) => {
			var t = U();
			q(P(t), 17, () => cc, (e) => e.label, (e, t) => {
				var n = hc(), r = N(n);
				gs(r, { get fill() {
					return V(t).color;
				} });
				var i = I(r, 1, !0);
				w(n), L((e) => G(i, e), [() => lc(V(t))]), W(e, n);
			}), W(e, t);
		};
		K(n, (e) => {
			V(a) && e(r);
		}), w(t), W(e, t);
	}, r = (e) => {
		var t = Cc(), n = N(t), r = (e) => {
			var t = U(), n = P(t), r = (e) => {
				var t = xc(), n = P(t);
				q(n, 21, () => V(s), (e) => e.session.session_id, (e, t) => {
					var n = vc(), r = N(n), i = N(r), a = F(i, !0), o = F(I(i), !0);
					w(r);
					var s = I(r, 2), c = N(s);
					let l;
					q(c, 21, () => V(t).parts, ({ part: e, amount: t }) => e.label, (e, t) => {
						let n = () => V(t).part, r = () => V(t).amount;
						var i = U(), a = P(i), o = (e) => {
							var t = _c();
							let i;
							L(() => i = ai(t, "", i, {
								"flex-grow": r(),
								background: n().color
							})), W(e, t);
						};
						K(a, (e) => {
							r() > 0 && e(o);
						}), W(e, i);
					}), w(c), w(s);
					var u = F(I(s, 2), !0);
					w(n), L((e) => {
						J(n, "href", V(t).href), J(n, "aria-label", V(t).label), G(a, V(t).title), G(o, V(t).detail), l = ai(c, "", l, { width: e }), G(u, V(t).cost);
					}, [() => `${V(t).share.toFixed(2) ?? ""}%`]), _r("pointermove", n, (e) => p(e, V(t).session.session_id)), gr("focus", n, (e) => p(e, V(t).session.session_id)), gr("pointerleave", n, m), gr("blur", n, m), W(e, n);
				}), w(n);
				var r = I(n, 2), i = (e) => {
					cs(e, {
						get anchor() {
							return V(u).anchor;
						},
						get top() {
							return V(u).top;
						},
						children: (e, t) => {
							var n = bc(), r = P(n), i = F(r, !0), a = I(r, 2);
							q(a, 17, () => V(f).parts, (e) => e.label, (e, t) => {
								var n = yc(), r = N(n);
								gs(r, { get fill() {
									return V(t).color;
								} });
								var i = I(r), a = F(i, !0), o = F(I(i));
								w(n), L(() => {
									G(a, V(t).amount), G(o, `${V(t).label ?? ""} · ${V(t).share ?? ""}`);
								}), W(e, n);
							});
							var o = I(a, 2), s = N(o);
							gs(s, { fill: null });
							var c = F(I(s), !0);
							Me(), w(o);
							var l = F(I(o, 2), !0);
							L(() => {
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
				W(e, Sc());
			};
			K(n, (e) => {
				V(s).length ? e(r) : e(i, -1);
			}), W(e, t);
		};
		K(n, (e) => {
			V(a) && e(r);
		}), w(t), W(e, t);
	}, i = (e) => {
		var t = U(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				var r = Tc(), i = P(r), a = N(i), o = F(a, !0), s = F(I(a), !0);
				w(i), q(I(i, 2), 19, () => V(n), (e) => e.label, (e, n, r) => {
					var i = wc(), a = F(i, !0);
					L(() => G(a, t().cells[V(r)])), W(e, i);
				}), L((e, n) => {
					J(a, "href", e), G(o, n), G(s, t().session.project);
				}, [() => dc(t().session), () => uc(t().session)]), W(e, r);
			}, n = /* @__PURE__ */ O(() => V(c).head.slice(1));
			Is(e, {
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
	}, a = /* @__PURE__ */ O(() => Q.summary), o = /* @__PURE__ */ O(() => V(a)?.costly_sessions ?? []), s = /* @__PURE__ */ O(() => fc(V(o))), c = /* @__PURE__ */ O(() => mc(V(o))), l = /* @__PURE__ */ O(() => $("Cost per session")), u = /* @__PURE__ */ A(null), d = /* @__PURE__ */ O(() => V(u) ? V(s).find((e) => e.session.session_id === V(u)?.id) : void 0), f = /* @__PURE__ */ O(() => V(d) ? pc(V(d)) : null);
	function p(e, t) {
		let n = e.currentTarget, r = n.closest(".chart")?.getBoundingClientRect();
		if (!r) return;
		let i = n.getBoundingClientRect(), a = "clientX" in e ? e.clientX : 0;
		j(u, {
			id: t,
			anchor: a ? a - r.left : i.left - r.left + i.width / 2,
			top: n.offsetTop + n.offsetHeight + 4
		}, !0);
	}
	function m() {
		j(u, null);
	}
	ms(e, {
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
	}), E();
}
vr(["pointermove"]);
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
		let e = t.pays_later_in === 1 ? "1 reply" : `${X(t.pays_later_in)} replies`;
		return `${Oc.later}: growing at its recent pace, the context reaches about ${Y(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = X(Math.round(t.calls_ahead));
	return `${Oc[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function Mc(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${Z(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${X(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : X(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${X(e.breakeven_low)} replies)` : `would pay off after about ${X(e.breakeven_calls)} replies` + kc(r(e.breakeven_low), r(e.breakeven_high));
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
	let n = Rc(e, t), r = e.agent_minutes > e.minutes ? ` (${e.agent_minutes} min while agents work)` : "", i = e.sessions.some((e) => e.waiting) ? " or waiting for you" : "", a = n ? `, active on ${ha(n)}` : "";
	return `· changed in the last ${e.minutes} min${r}${i}${a}`;
}
function Bc(e, t) {
	let n = Rc(e, t);
	return n ? `No live session was active on ${ha(n)}.` : `No session active in the last ${e.minutes} minutes.`;
}
function Vc(e) {
	if (!e) return null;
	let t = ` since ${ya(e.since)}`;
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
	let r = (e) => e === 1 ? "1 call" : `${X(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${X(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function Uc(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${Y(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
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
	}, t) === "cold") return u("cold", `Compacting now saves ~${Z(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${X(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${Oc[l]}: compacting now ${m}, ~${X(Math.round(f))} ahead on average.`);
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
var qc = /* @__PURE__ */ H([
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
], 5), Jc = /* @__PURE__ */ H([
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
], 5), Yc = /* @__PURE__ */ H([
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
], 5), Xc = /* @__PURE__ */ H([
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
], 5), Zc = /* @__PURE__ */ H([[
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
	T(t, !0);
	var n = Zc(), r = N(n), i = N(r), a = (e) => {
		var t = qc();
		Me(3), W(e, t);
	}, o = (e) => {
		var t = Jc();
		Me(2), W(e, t);
	}, s = (e) => {
		var t = Yc();
		Me(5), W(e, t);
	}, c = (e) => {
		var t = Xc();
		Me(3), W(e, t);
	};
	K(i, (e) => {
		t.badge.kind === "permission" ? e(a) : t.badge.kind === "waiting" ? e(o, 1) : t.badge.kind === "secret" ? e(s, 2) : e(c, -1);
	}), w(r), w(n), L(() => {
		ri(n, 1, Zr([
			"live-icon",
			`live-icon-${t.badge.kind}`,
			t.badge.tone && `live-icon-${t.badge.tone}`
		])), J(n, "aria-label", t.badge.text), J(n, "title", t.badge.text);
	}), W(e, n), E();
}
//#endregion
//#region src/components/LiveCard.svelte
var $c = /* @__PURE__ */ H([[
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
]]), el = /* @__PURE__ */ H([[
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
]]), tl = /* @__PURE__ */ H([["ul"]]), nl = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	"No subagent running"
]]), rl = /* @__PURE__ */ H([[
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
	T(t, !0);
	let n = /* @__PURE__ */ O(() => Vc(t.session.waiting)), r = /* @__PURE__ */ O(() => t.sessionState ? Wc(t.sessionState, new Date(t.now).toISOString()) : []), i = /* @__PURE__ */ O(() => [
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
	var a = rl(), o = N(a), s = N(o), c = I(N(s)), l = F(c, !0);
	w(s);
	var u = I(s, 2), d = (e) => {
		Qc(e, { get badge() {
			return V(n);
		} });
	};
	K(u, (e) => {
		V(n) && e(d);
	});
	var f = I(u, 2);
	q(f, 21, () => V(r), (e) => e.kind, (e, t) => {
		Qc(e, { get badge() {
			return V(t);
		} });
	}), w(f), w(o);
	var p = I(o, 2), m = F(p), h = I(p, 2);
	q(h, 21, () => V(i), (e) => e.label, (e, t) => {
		var n = $c(), r = N(n), i = F(r, !0), a = F(I(r), !0);
		w(n), L(() => {
			G(i, V(t).label), G(a, V(t).value);
		}), W(e, n);
	}), w(h);
	var g = I(h, 2), _ = (e) => {
		var n = tl();
		q(n, 21, () => t.session.subagents, (e) => e.agent_id, (e, n) => {
			var r = el(), i = N(r), a = F(i, !0), o = I(i, 2), s = F(o, !0), c = F(I(o));
			w(r), L((e, t, r) => {
				G(a, V(n).agent_type), G(s, V(n).description || ""), G(c, `${(V(n).model || "–") ?? ""} · ${e ?? ""} turns · context ${t ?? ""} · ${r ?? ""}`);
			}, [
				() => X(V(n).turns),
				() => Y(V(n).last_context),
				() => ba(V(n).last_activity, t.now)
			]), W(e, r);
		}), w(n), W(e, n);
	}, v = (e) => {
		W(e, nl());
	};
	K(g, (e) => {
		t.session.subagents.length ? e(_) : e(v, -1);
	}), w(a), L((e, n, r) => {
		J(c, "href", e), G(l, n), G(m, `${t.session.project ?? ""}${t.session.git_branch ? ` · ${t.session.git_branch}` : ""} · ${r ?? ""}`);
	}, [
		() => dc(t.session),
		() => uc(t.session),
		() => ba(t.session.last_activity, t.now)
	]), W(e, a), E();
}
//#endregion
//#region src/components/LiveSessions.svelte
var al = /* @__PURE__ */ H([[
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
]]), ol = /* @__PURE__ */ H([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), sl = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	" "
]]), cl = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	" "
]]), ll = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	" "
]]), ul = /* @__PURE__ */ H([["div", { class: "live-grid" }]]), dl = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	" "
]]), fl = /* @__PURE__ */ H([
	,
	,
	" ",
	,
	" ",
	,
], 1), pl = /* @__PURE__ */ H([[
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
	T(t, !0);
	let n = (e) => {
		var t = al(), n = N(t), r = F(n, !0), a = F(I(n, 2), !0);
		w(t), L((e, t) => {
			G(r, e), G(a, t);
		}, [() => $("Live sessions"), () => V(i) ? zc(V(i), V(o)) : ""]), W(e, t);
	}, r = "live", i = /* @__PURE__ */ O(() => Q.live), a = /* @__PURE__ */ O(() => Q.liveAt ?? Date.now()), o = /* @__PURE__ */ O(() => pa(new Date(V(a)))), s = /* @__PURE__ */ O(() => V(i)?.sessions ?? []), c = /* @__PURE__ */ O(() => yo(V(s).map(() => !1))), l = /* @__PURE__ */ O(() => V(s).length), u = /* @__PURE__ */ O(() => Es(r, V(l))), d = /* @__PURE__ */ O(() => V(s).slice(V(u).first, V(u).last)), f = /* @__PURE__ */ O(() => V(l) > vo[0]);
	var p = pl(), m = N(p), h = (e) => {
		var t = ol(), i = N(t);
		n(i), Ss(I(i, 2), {
			key: r,
			noun: "sessions",
			get units() {
				return V(c);
			}
		}), w(t), W(e, t);
	}, g = (e) => {
		n(e);
	};
	K(m, (e) => {
		V(f) ? e(h) : e(g, -1);
	});
	var _ = I(m, 2), v = N(_), y = (e) => {
		var t = sl(), n = F(t, !0);
		L(() => G(n, Q.liveFailed ? "Could not load the live sessions." : "Loading…")), W(e, t);
	}, ee = (e) => {
		var t = fl(), n = P(t), r = (e) => {
			var t = cl(), n = F(t);
			L(() => G(n, `Permission prompts can't show here: ${V(i).prompts_unavailable ?? ""}.`)), W(e, t);
		};
		K(n, (e) => {
			V(i).prompts_unavailable && e(r);
		});
		var s = I(n, 2), c = (e) => {
			var t = ll(), n = F(t);
			L(() => G(n, `Desktop notifications can't show: ${V(i).notifications_unavailable ?? ""}.`)), W(e, t);
		};
		K(s, (e) => {
			V(i).notifications_unavailable && e(c);
		});
		var l = I(s, 2), u = (e) => {
			var t = ul();
			q(t, 21, () => V(d), (e) => e.session_id, (e, t) => {
				{
					let n = /* @__PURE__ */ O(() => Q.liveState(V(t).session_id));
					il(e, {
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
			}), w(t), W(e, t);
		}, f = (e) => {
			var t = dl(), n = F(t, !0);
			L((e) => G(n, e), [() => Bc(V(i), V(o))]), W(e, t);
		};
		K(l, (e) => {
			V(d).length ? e(u) : e(f, -1);
		}), W(e, t);
	};
	K(v, (e) => {
		V(i) ? e(ee, -1) : e(y);
	}), w(_), w(p), W(e, p), E();
}
//#endregion
//#region src/lib/trend.ts
var hl = [
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
	let n = Na(e, t), r = Fa(n.unit === "hour" ? e.hour_model : e.day_model, n.keyOf);
	return {
		buckets: n,
		totals: n.keys.map((e) => r.get(e) ?? Pa)
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
	let n = e.totals[t] ?? Pa, r = hl.map((e) => `${e.label} ${e.format(e.value(n))}`).join(", ");
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${r}`;
}
function wl(e) {
	let t = e.buckets.keys.map((t, n) => ({
		key: t,
		cells: [e.buckets.short(t), ...hl.map((t) => t.format(t.value(e.totals[n] ?? Pa)))]
	})).reverse();
	return {
		head: [e.buckets.heading, ...hl.map((e) => e.label)],
		rows: t
	};
}
//#endregion
//#region src/components/AreaLine.svelte
var Tl = /* @__PURE__ */ H([["path", { "fill-opacity": "0.1" }], ["path", {
	fill: "none",
	"stroke-width": "2",
	"stroke-linejoin": "round",
	"stroke-linecap": "round"
}]], 5);
function El(e, t) {
	T(t, !0);
	let n = /* @__PURE__ */ O(() => t.values.map((e, n) => `${t.xOf(n).toFixed(1)},${t.yOf(e).toFixed(1)}`).join("L")), r = /* @__PURE__ */ O(() => `M${t.xOf(0)},${t.bottom}L${V(n)}L${t.xOf(t.values.length - 1)},${t.bottom}Z`);
	var i = U(), a = P(i), o = (e) => {
		var i = Tl(), a = P(i), o = I(a);
		L(() => {
			J(a, "d", V(r)), J(a, "fill", t.color), J(o, "d", `M${V(n) ?? ""}`), J(o, "stroke", t.color);
		}), W(e, i);
	};
	K(a, (e) => {
		t.values.length && e(o);
	}), W(e, i), E();
}
//#endregion
//#region src/components/PointDot.svelte
var Dl = /* @__PURE__ */ H([["circle", {
	r: "4",
	stroke: "var(--surface)",
	"stroke-width": "2"
}]], 4);
function Ol(e, t) {
	var n = Dl();
	L(() => {
		J(n, "cx", t.x), J(n, "cy", t.y), J(n, "fill", t.color);
	}), W(e, n);
}
//#endregion
//#region src/components/OverTime.svelte
var kl = (e, t = v) => {
	var n = Rl(), r = P(n), i = F(r, !0);
	q(I(r, 2), 19, () => hl, (e) => e.label, (e, n, r) => {
		var i = Ll(), a = F(i, !0);
		L(() => G(a, t().cells[V(r) + 1])), W(e, i);
	}), L(() => G(i, t().cells[0])), W(e, n);
}, Al = /* @__PURE__ */ H([
	,
	,
	[
		"text",
		{ class: "value-text" },
		" "
	]
], 5), jl = /* @__PURE__ */ H([
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
], 5), Ml = /* @__PURE__ */ H([
	,
	,
	,
], 5), Nl = /* @__PURE__ */ H([["line", { class: "crosshair" }], ,], 5), Pl = /* @__PURE__ */ H([[
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
]]), Fl = /* @__PURE__ */ H([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
], 1), Il = /* @__PURE__ */ H([[
	"div",
	{ class: "chart" },
	,
]]), Ll = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), Rl = /* @__PURE__ */ H([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function zl(e, t) {
	T(t, !0);
	let n = (e) => {
		var t = Il(), n = N(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ O(() => t() - 64), r = /* @__PURE__ */ O(() => Ea(V(s).length, 56, V(n)));
				var a = Ml(), o = P(a);
				q(o, 17, () => V(d), ({ panel: e, top: t, bottom: n, color: r, values: i, max: a, yOf: o }) => e.label, (e, t) => {
					let i = () => V(t).panel, a = () => V(t).top, o = () => V(t).bottom, s = () => V(t).color, c = () => V(t).values, l = () => V(t).max, u = () => V(t).yOf;
					var d = jl(), f = P(d), p = I(f), m = F(p, !0), h = I(p);
					{
						let e = /* @__PURE__ */ O(() => wa(l(), 2));
						Bs(h, {
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
					var g = I(h);
					El(g, {
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
					var _ = I(g), v = (e) => {
						let t = /* @__PURE__ */ O(() => c().length - 1), n = /* @__PURE__ */ O(() => c()[V(t)] ?? 0);
						var a = Al(), o = P(a);
						{
							let e = /* @__PURE__ */ O(() => V(r)(V(t))), i = /* @__PURE__ */ O(() => u()(V(n)));
							Ol(o, {
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
						var l = I(o), d = F(l, !0);
						L((e, t, n) => {
							J(l, "x", e), J(l, "y", t), G(d, n);
						}, [
							() => V(r)(V(t)) + 9,
							() => u()(V(n)) + 4,
							() => i().format(V(n))
						]), W(e, a);
					};
					K(_, (e) => {
						c().length && e(v);
					}), L(() => {
						J(f, "x1", 56), J(f, "x2", 70), J(f, "y1", a() - 10), J(f, "y2", a() - 10), J(f, "stroke", s()), J(p, "x", 76), J(p, "y", a() - 6), G(m, i().label);
					}), W(e, d);
				});
				var c = I(o);
				{
					let e = /* @__PURE__ */ O(() => u + 18);
					Rs(c, {
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
				let r = /* @__PURE__ */ O(() => Ea(V(s).length, 56, t() - 64));
				var i = Nl(), a = P(i);
				q(I(a), 17, () => V(d), ({ panel: e, color: t, values: n, yOf: r }) => e.label, (e, t) => {
					let i = () => V(t).color, a = () => V(t).values, o = () => V(t).yOf;
					{
						let t = /* @__PURE__ */ O(() => V(r)(n())), s = /* @__PURE__ */ O(() => o()(a()[n()] ?? 0));
						Ol(e, {
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
				}), L((e, t) => {
					J(a, "x1", e), J(a, "x2", t), J(a, "y1", 18), J(a, "y2", u);
				}, [() => V(r)(n()), () => V(r)(n())]), W(e, i);
			}, r = (e, t = v) => {
				var n = Fl(), r = P(n), a = F(r, !0);
				q(I(r, 2), 17, () => V(d), ({ panel: e, color: t, values: n }) => e.label, (e, n) => {
					let r = () => V(n).panel, i = () => V(n).color, a = () => V(n).values;
					var o = Pl(), s = N(o);
					let c;
					var l = I(s, 2), u = F(l, !0), d = F(I(l, 2), !0);
					w(o), L((e) => {
						c = ai(s, "", c, { background: i() }), G(u, e), G(d, r().label);
					}, [() => r().format(a()[t()] ?? 0)]), W(e, o);
				}), L((e) => G(a, e), [() => V(i).long(V(s)[t()] ?? "")]), W(e, n);
			}, i = /* @__PURE__ */ O(() => V(a).buckets), s = /* @__PURE__ */ O(() => V(i).keys);
			{
				let i = /* @__PURE__ */ O(_l), a = /* @__PURE__ */ O(() => xl(V(o)));
				ds(e, {
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
		}), w(t), wi(t, "clientWidth", (e) => j(c, e)), W(e, t);
	}, r = (e) => {
		var t = U(), n = P(t), r = (e) => {
			let t = /* @__PURE__ */ O(() => {
				let [e = "", ...t] = V(s).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let n = /* @__PURE__ */ O(() => [{ label: V(t).first }, ...V(t).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				Is(e, {
					key: "trend-table",
					get columns() {
						return V(n);
					},
					get rows() {
						return V(s).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return kl;
					}
				});
			}
		};
		K(n, (e) => {
			V(s) && e(r);
		}), W(e, t);
	}, i = /* @__PURE__ */ O(() => Q.summary), a = /* @__PURE__ */ O(() => V(i) ? vl(V(i)) : null), o = /* @__PURE__ */ O(() => V(a)?.buckets.unit ?? "day"), s = /* @__PURE__ */ O(() => V(a) ? wl(V(a)) : null), c = /* @__PURE__ */ A(0), l = /* @__PURE__ */ O(() => ji(V(c))), u = gl(hl.length - 1).bottom, d = /* @__PURE__ */ O(() => V(a) ? hl.map((e, t) => {
		let { top: n, bottom: r } = gl(t), i = yl(V(a), e), o = Ca(Math.max(...i, 0));
		return {
			panel: e,
			top: n,
			bottom: r,
			color: Xi(e.slot),
			values: i,
			max: o,
			yOf: (e) => r - 76 * e / o
		};
	}) : []), f = /* @__PURE__ */ O(() => V(a) ? {
		count: V(a).buckets.keys.length,
		label: Sl(V(o)),
		valueText: (e) => Cl(V(a), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: u
		}),
		indexAt: (e) => Da(56, e - 64, V(a).buckets.keys.length),
		tipX: (e, t) => Ea(V(a).buckets.keys.length, 56, e - 64)(t)
	} : null);
	{
		let t = /* @__PURE__ */ O(() => $("Over time")), i = /* @__PURE__ */ O(() => bl(V(o)));
		ms(e, {
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
	E();
}
//#endregion
//#region src/lib/range.ts
var Bl = /* @__PURE__ */ t({
	RANGES: () => Vl,
	dayLabel: () => Kl,
	dayStep: () => ql,
	rangeDays: () => Hl,
	rangeQuery: () => Wl,
	shownDay: () => Gl,
	visibleRanges: () => Ul
}), Vl = [
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
function Hl(e) {
	return Vl.some((t) => t.days === e) ? e : null;
}
function Ul(e) {
	return e ? Vl.filter((t) => t.days <= e) : Vl;
}
function Wl(e, t) {
	return `days=${e}` + (e === 1 && t !== null ? `&until=${t}` : "");
}
function Gl(e, t, n) {
	let r = t ?? n;
	return e && e.days === 1 && e.until === r ? e : null;
}
function Kl(e) {
	return e === null ? "Today" : ha(e);
}
function ql(e, t, n) {
	let r = e?.[t];
	if (r) return r === n ? null : r;
}
//#endregion
//#region src/lib/range.svelte.ts
var Jl = /* @__PURE__ */ t({
	RangeState: () => Xl,
	range: () => Zl
});
function Yl() {
	return Hl(Number(ts("days"))) ?? 30;
}
var Xl = class {
	#e = /* @__PURE__ */ A(Yt(Yl()));
	#t = /* @__PURE__ */ A(null);
	onchange = null;
	get days() {
		return V(this.#e);
	}
	get day() {
		return V(this.#t);
	}
	select(e) {
		Hl(e) !== null && (j(this.#e, e, !0), j(this.#t, null), ns("days", e), this.onchange?.());
	}
	step(e, t) {
		let n = pa(/* @__PURE__ */ new Date()), r = ql(Gl(t, V(this.#t), n), e, n);
		r !== void 0 && (j(this.#t, r, !0), this.onchange?.());
	}
	fit(e) {
		e.days >= V(this.#e) || (j(this.#e, e.days, !0), ns("days", e.days));
	}
	reset() {
		j(this.#e, Yl(), !0), j(this.#t, null), this.onchange = null;
	}
}, Zl = new Xl(), Ql = /* @__PURE__ */ H([[
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
]]), $l = /* @__PURE__ */ H([
	[
		"button",
		{ type: "button" },
		" "
	],
	" ",
	,
], 1), eu = /* @__PURE__ */ H([
	[
		"span",
		{ class: "label" },
		"Range"
	],
	" ",
	["div", { class: "segmented" }]
], 1);
function tu(e, t) {
	T(t, !0);
	let n = /* @__PURE__ */ O(() => Ul(Q.summary?.retention_days)), r = /* @__PURE__ */ O(() => Gl(Q.summary, Zl.day, pa(/* @__PURE__ */ new Date())));
	var i = eu(), a = I(P(i), 2);
	q(a, 21, () => V(n), (e) => e.days, (e, t) => {
		var n = $l(), i = P(n), a = F(i, !0), o = I(i, 2), s = (e) => {
			var t = Ql(), n = N(t), i = I(n, 2), a = F(i, !0), o = I(i, 2);
			w(t), L((e) => {
				n.disabled = !V(r)?.previous_day, G(a, e), o.disabled = !V(r)?.next_day;
			}, [() => Kl(Zl.day)]), _r("click", n, () => Zl.step("previous_day", Q.summary)), _r("click", o, () => Zl.step("next_day", Q.summary)), W(e, t);
		};
		K(o, (e) => {
			V(t).days === 1 && Zl.days === 1 && e(s);
		}), L(() => {
			J(i, "aria-pressed", Zl.days === V(t).days), G(a, V(t).label);
		}), _r("click", i, () => Zl.select(V(t).days)), W(e, n);
	}), w(a), W(e, i), E();
}
vr(["click"]);
var nu = 148, ru = "var(--status-critical)";
function iu(e, t = /* @__PURE__ */ new Date()) {
	let n = Na(e, t), r = Wa(n.unit === "hour" ? e.api_errors.hour : e.api_errors.day, n.keyOf), i = n.keys.map((e) => r(e).limits), a = n.keys.map((e) => r(e).other), o = i.reduce((e, t) => e + t, 0), s = ja(i);
	return {
		buckets: n,
		limits: i,
		others: a,
		total: o,
		top: Ta(Math.max(...i, 0)),
		peak: i[s] ? s : null,
		empty: !i.some(Boolean) && !a.some(Boolean)
	};
}
function au(e, t, n, r, i) {
	let { band: a, barWidth: o } = to(e, t), s = 120 * r / i;
	return {
		x: 56 + a * n + (a - o) / 2,
		y: 120 - s,
		width: o,
		height: s
	};
}
function ou(e) {
	return `rate-limit hits per ${e}; other API errors are in the tooltip, the table view and the list`;
}
function su(e, t) {
	return `Rate-limit hits per ${e}: ${X(t)} in the range; table view available`;
}
function cu(e) {
	return `Rate-limit hits per ${e}; arrow keys step through them`;
}
function lu(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${X(e.limits[t])} rate-limit hits, ${X(e.others[t])} other API errors`;
}
function uu(e, t) {
	return {
		when: e.buckets.long(e.buckets.keys[t] ?? ""),
		limits: X(e.limits[t]),
		others: X(e.others[t])
	};
}
function du(e) {
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
var fu = [
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
function pu(e, t) {
	return e.flatMap((e) => {
		let n = `${e.limit_type} ${e.resets_at}`;
		return [{
			key: n,
			kind: "window",
			name: Ka(e, t),
			cells: [
				da(Ga(e)),
				X(e.hits),
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
function mu(e) {
	return e.map((e) => ({
		key: e.record_id,
		when: ya(e.ts),
		error: Ua(e),
		quota: Ha(e.limit_type),
		resets: ya(e.resets_at),
		session: {
			href: dc(e),
			name: uc(e),
			project: e.project
		},
		agent: e.agent_type
	}));
}
var hu = [
	{ label: "When" },
	{ label: "Error" },
	{ label: "Quota" },
	{ label: "Resets" },
	{ label: "Session" },
	{ label: "Agent" }
], gu = (e) => {
	var t = Nu(), n = F(t, !0);
	L((e) => G(n, e), [() => $("5-hour windows that hit the limit")]), W(e, t);
}, _u = (e) => {
	W(e, Pu());
}, vu = (e) => {
	var t = Ru(), n = F(t, !0);
	L((e) => G(n, e), [() => $("Latest API errors")]), W(e, t);
}, yu = (e, t = v) => {
	var n = zu(), r = P(n), i = F(r, !0), a = I(r, 2), o = F(a, !0), s = I(a, 2), c = F(s, !0), l = I(s, 2), u = F(l, !0), d = I(l, 2), f = N(d), p = F(f, !0), m = F(I(f), !0);
	w(d);
	var h = F(I(d, 2), !0);
	L(() => {
		G(i, t().when), G(o, t().error), G(c, t().quota), G(u, t().resets), J(f, "href", t().session.href), G(p, t().session.name), G(m, t().session.project), G(h, t().agent);
	}), W(e, n);
}, bu = /* @__PURE__ */ H([[
	"span",
	null,
	,
	" "
]]), xu = /* @__PURE__ */ H([[
	"div",
	{ class: "legend" },
	,
]]), Su = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	"No rate limits or API errors in this range."
]]), Cu = /* @__PURE__ */ H([["path"]], 4), wu = /* @__PURE__ */ H([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), Tu = /* @__PURE__ */ H([
	,
	,
	,
], 5), Eu = /* @__PURE__ */ H([
	,
	,
	,
	,
], 5), Du = /* @__PURE__ */ H([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), Ou = /* @__PURE__ */ H([
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
], 1), ku = /* @__PURE__ */ H([[
	"div",
	{ class: "chart" },
	,
]]), Au = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), ju = /* @__PURE__ */ H([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1), Mu = /* @__PURE__ */ H([
	,
	,
	" ",
	,
], 1), Nu = /* @__PURE__ */ H([[
	"h3",
	null,
	" "
]]), Pu = /* @__PURE__ */ H([[
	"p",
	{ class: "note" },
	"what each window used from its start (its reset less 5 hours) up to its first hit, as the transcripts here show it;\n    the limit also counts what you use elsewhere"
]]), Fu = /* @__PURE__ */ H([[
	"span",
	{ class: "window-model" },
	" "
]]), Iu = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), Lu = /* @__PURE__ */ H([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1), Ru = /* @__PURE__ */ H([[
	"h3",
	null,
	" "
]]), zu = /* @__PURE__ */ H([
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
function Bu(e, t) {
	T(t, !0);
	let n = (e) => {
		var t = xu(), n = N(t), r = (e) => {
			var t = bu(), n = N(t);
			gs(n, { get fill() {
				return ru;
			} });
			var r = I(n);
			w(t), L(() => G(r, "⚠ Rate-limit hit")), W(e, t);
		};
		K(n, (e) => {
			V(c) && e(r);
		}), w(t), W(e, t);
	}, r = (e) => {
		var t = ku(), n = N(t), r = (e) => {
			var t = U(), n = P(t), r = (e) => {
				W(e, Su());
			}, i = (e) => {
				let t = (e, t = v) => {
					let n = /* @__PURE__ */ O(() => to(t(), V(a).length));
					var r = Eu(), o = P(r);
					{
						let e = /* @__PURE__ */ O(() => wa(V(c).top, 2));
						Bs(o, {
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
					var s = I(o);
					{
						let e = /* @__PURE__ */ O(() => 138);
						Rs(s, {
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
					q(I(s), 18, () => V(a), (e) => e, (e, n, r) => {
						let i = /* @__PURE__ */ O(() => V(c).limits[V(r)] ?? 0), o = /* @__PURE__ */ O(() => au(t(), V(a).length, V(r), V(i), V(c).top));
						var s = Tu(), l = P(s), u = (e) => {
							var t = Cu();
							L((e) => {
								J(t, "d", e), J(t, "fill", ru);
							}, [() => Aa(V(o).x, V(o).y, V(o).width, V(o).height, !0)]), W(e, t);
						};
						K(l, (e) => {
							V(o).height > 0 && e(u);
						});
						var d = I(l), f = (e) => {
							var t = wu(), n = F(t, !0);
							L((e) => {
								J(t, "x", V(o).x + V(o).width / 2), J(t, "y", V(o).y - 6), G(n, e);
							}, [() => X(V(i))]), W(e, t);
						};
						K(d, (e) => {
							V(r) === V(c).peak && e(f);
						}), W(e, s);
					}), W(e, r);
				}, n = (e, t = v, n = v) => {
					let r = /* @__PURE__ */ O(() => to(t(), V(a).length).band);
					var i = Du();
					L(() => {
						J(i, "x", 56 + V(r) * n()), J(i, "width", V(r)), J(i, "height", 120);
					}), W(e, i);
				}, r = (e, t = v) => {
					let n = /* @__PURE__ */ O(() => uu(V(c), t()));
					var r = Ou(), i = P(r), a = F(i, !0), o = I(i, 2), s = N(o);
					gs(s, { get fill() {
						return ru;
					} });
					var l = I(s), u = F(l, !0), d = F(I(l));
					w(o);
					var f = I(o, 2), p = N(f);
					gs(p, { fill: null });
					var m = F(I(p), !0);
					Me(), w(f), L(() => {
						G(a, V(n).when), G(u, V(n).limits), G(d, "⚠ rate-limit hits"), G(m, V(n).others);
					}), W(e, r);
				}, i = /* @__PURE__ */ O(() => V(c).buckets), a = /* @__PURE__ */ O(() => V(i).keys);
				{
					let i = /* @__PURE__ */ O(() => su(V(l), V(c).total));
					ds(e, {
						get height() {
							return nu;
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
		}), w(t), wi(t, "clientWidth", (e) => j(h, e)), W(e, t);
	}, i = (e) => {
		var t = U(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				var r = ju(), i = P(r), a = F(i, !0);
				q(I(i, 2), 19, () => V(n), (e) => e.label, (e, n, r) => {
					var i = Au(), a = F(i, !0);
					L(() => G(a, t().cells[V(r) + 1])), W(e, i);
				}), L(() => G(a, t().cells[0])), W(e, r);
			}, n = /* @__PURE__ */ O(() => V(d).head.slice(1));
			Is(e, {
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
		var t = U(), n = P(t), r = (e) => {
			var t = Mu(), n = P(t);
			Is(n, {
				key: "limit-windows",
				get columns() {
					return fu;
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
					return gu;
				},
				get intro() {
					return _u;
				},
				empty: "No 5-hour window hit its limit in this range."
			}), Is(I(n, 2), {
				key: "limit-events",
				get columns() {
					return hu;
				},
				get rows() {
					return V(p);
				},
				rowKey: (e) => e.key,
				get cells() {
					return yu;
				},
				get heading() {
					return vu;
				},
				empty: "No API errors in this range."
			}), W(e, t);
		};
		K(n, (e) => {
			V(s) && e(r);
		}), W(e, t);
	}, o = (e, t = v) => {
		var n = Lu(), r = P(n), i = N(r), a = (e) => {
			var n = Fu(), r = F(n, !0);
			L(() => G(r, t().name)), W(e, n);
		}, o = (e) => {
			var n = Tr();
			L(() => G(n, t().name)), W(e, n);
		};
		K(i, (e) => {
			t().kind === "model" ? e(a) : e(o, -1);
		}), w(r), q(I(r, 2), 19, () => m, (e) => e.label, (e, n, r) => {
			var i = Iu(), a = F(i, !0);
			L(() => G(a, t().cells[V(r)])), W(e, i);
		}), W(e, n);
	}, s = /* @__PURE__ */ O(() => Q.summary), c = /* @__PURE__ */ O(() => V(s) ? iu(V(s)) : null), l = /* @__PURE__ */ O(() => V(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ O(() => $("Rate limits")), d = /* @__PURE__ */ O(() => V(c) ? du(V(c)) : null), f = /* @__PURE__ */ O(() => V(s) ? pu(V(s).api_errors.windows) : []), p = /* @__PURE__ */ O(() => V(s) ? mu(V(s).api_errors.events) : []), m = fu.slice(1), h = /* @__PURE__ */ A(0), g = /* @__PURE__ */ O(() => ji(V(h))), _ = /* @__PURE__ */ O(() => V(c) ? {
		count: V(c).buckets.keys.length,
		label: cu(V(l)),
		valueText: (e) => lu(V(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: to(e, V(c).buckets.keys.length).right - 56,
			height: 120
		}),
		indexAt: (e) => no(e, V(c).buckets.keys.length),
		tipX: (e, t) => 56 + to(e, V(c).buckets.keys.length).band * (t + .5)
	} : null);
	{
		let t = /* @__PURE__ */ O(() => V(c) ? ou(V(l)) : void 0);
		ms(e, {
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
	E();
}
//#endregion
//#region src/components/SessionsList.svelte
var Vu = (e) => {
	var t = Uu(), n = F(N(t), !0);
	Me(2), w(t), L((e) => G(n, e), [() => $("Sessions")]), W(e, t);
}, Hu = (e, t = v) => {
	let n = /* @__PURE__ */ O(() => Eo(t()));
	var r = qu(), i = P(r), a = F(i, !0), o = I(i, 2), s = N(o), c = F(s, !0), l = F(I(s), !0);
	w(o), q(I(o, 2), 17, () => V(n).slice(1), zr, (e, t) => {
		var n = Ku(), r = F(n, !0);
		L(() => G(r, V(t))), W(e, n);
	}), L((e, r) => {
		G(a, V(n)[0]), J(s, "href", e), G(c, r), G(l, t().project);
	}, [() => dc(t()), () => uc(t())]), W(e, r);
}, Uu = /* @__PURE__ */ H([[
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
]]), Wu = /* @__PURE__ */ H([[
	"option",
	null,
	" "
]]), Gu = /* @__PURE__ */ H([[
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
]]), Ku = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), qu = /* @__PURE__ */ H([
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
], 1), Ju = /* @__PURE__ */ H([
	,
	,
	" ",
	,
], 1), Yu = /* @__PURE__ */ H([[
	"section",
	{
		class: "card",
		"aria-labelledby": "sessions-title"
	},
	,
]]);
function Xu(e, t) {
	T(t, !0);
	let n = (e) => {
		var t = Gu(), n = N(t), o = N(n);
		o.value = o.__value = "", q(I(o), 17, () => V(c), (e) => e.project, (e, t) => {
			var n = Wu(), r = F(n), i = {};
			L((e) => {
				G(r, `${V(t).project ?? ""} (${e ?? ""})`), i !== (i = V(t).project) && (n.value = (n.__value = i) ?? "");
			}, [() => X(V(t).count)]), W(e, n);
		}), w(n), li(n);
		var s = I(n, 2);
		gi(s);
		var u = F(I(s, 2), !0);
		w(t), L(() => G(u, V(l))), ui(n, () => V(i), (e) => {
			j(i, e, !0), Ts.forget(r);
		}), bi(s, () => V(a), (e) => {
			j(a, e, !0), Ts.forget(r);
		}), W(e, t);
	}, r = "sessions", i = /* @__PURE__ */ A(""), a = /* @__PURE__ */ A(""), o = /* @__PURE__ */ O(() => Q.summary?.sessions ?? null), s = /* @__PURE__ */ O(() => V(o) ? V(o).filter((e) => Co(e, V(i), V(a))) : []), c = /* @__PURE__ */ O(() => wo(V(o) ?? [], V(i))), l = /* @__PURE__ */ O(() => V(o) ? Do(V(s).length, V(o).length) : "");
	var u = Yu(), d = N(u), f = (e) => {
		{
			let t = /* @__PURE__ */ O(() => V(o).length ? "No sessions match the filter." : "No sessions in this range.");
			Is(e, {
				key: r,
				get columns() {
					return To;
				},
				get rows() {
					return V(s);
				},
				rowKey: (e) => e.session_id,
				get cells() {
					return Hu;
				},
				get heading() {
					return Vu;
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
		var t = Ju(), r = P(t);
		Vu(r);
		var i = I(r, 2);
		n(i), W(e, t);
	};
	K(d, (e) => {
		V(o) ? e(f) : e(p, -1);
	}), w(u), W(e, u), E();
}
//#endregion
//#region src/lib/tiles.ts
function Zu(e, t = pa(/* @__PURE__ */ new Date()), n) {
	let r = e.history_since, i = r && r > e.since ? ` (history since ${ma(r, n)})` : "";
	return e.days === 1 ? e.until === t ? "today" : ha(e.until, n) : `last ${e.days} days${i}`;
}
function Qu(e) {
	let t = [e.unpriced_turns ? `${X(e.unpriced_turns)} turns of models without a price are not included` : "at API list prices"];
	return e.web_searches && t.push(`incl. ${X(e.web_searches)} web searches, ${Z(e.cost_parts.web_search)}`), t.join(" · ");
}
var $u = "Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.";
function ed(e) {
	let t = e.compactions === 1 ? "1 compaction" : `${X(e.compactions)} compactions`, n = e.unknown ? `${X(e.unknown)} without an estimate` : null;
	if (!e.compactions) return {
		title: $u,
		verdict: null,
		amount: null,
		count: `Compacting: ${n}`
	};
	let r = e.net >= 0;
	return {
		title: $u,
		verdict: r ? "gain" : "loss",
		amount: r ? `▲ compacting saved ~${Z(e.net)} so far` : `▼ compacting cost ~${Z(-e.net)} more so far`,
		count: `(${[t, n].filter(Boolean).join(", ")})`
	};
}
function td(e) {
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
function nd(e, t) {
	let n = Sa(t);
	return e.map((e) => `${e.label} ${ua(e.tokens, n)}`).join(", ");
}
function rd(e, t) {
	return e?.turns ? `median context ${Y(e.median)} per turn (p90 ${Y(e.p90)})` + (t ? ` · compact hint at ${Y(t)}` : "") : null;
}
function id(e, t, n, r) {
	let i = e.api_ms_without_retries === null ? null : e.api_ms - e.api_ms_without_retries, a = "no time lost to retries";
	return i === null ? a = "retries are not in the transcripts" : i > 0 && (a = `${da(i)} of it retries`), {
		session: `wall-clock, ${t}`,
		api: a,
		tools: r ? "from each call to its result, incl. waiting for permission" : `${ua(e.tool_ms, e.duration_ms)} of the session time`,
		lines: n === null ? "no lines changed" : `${Z(n)} per 100 lines changed`
	};
}
function ad(e) {
	return `${X(e)} ${e === 1 ? "session" : "sessions"} that ended in the range`;
}
function od(e) {
	return e === "cost_record" ? "from its cost record" : "estimated from the transcripts";
}
function sd(e) {
	let t = e.runtime.lines_added + e.runtime.lines_removed;
	return e.cost === null || t === 0 ? null : e.cost / t * 100;
}
//#endregion
//#region src/components/InputSplit.svelte
var cd = /* @__PURE__ */ H([["span"]]), ld = /* @__PURE__ */ H([[
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
]]), ud = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	" "
]]), dd = /* @__PURE__ */ H([[
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
function fd(e, t) {
	T(t, !0);
	let n = /* @__PURE__ */ O(() => Sa(t.totals)), r = /* @__PURE__ */ O(() => td(t.totals)), i = /* @__PURE__ */ O(() => rd(t.context, t.hintTokens));
	var a = dd(), o = N(a), s = F(o, !0), c = I(o, 2), l = F(c, !0), u = I(c, 2);
	q(u, 21, () => V(r).filter((e) => e.tokens > 0), (e) => e.label, (e, t) => {
		var n = cd();
		let r;
		L(() => r = ai(n, "", r, {
			"flex-grow": V(t).tokens,
			background: V(t).color
		})), W(e, n);
	}), w(u);
	var d = I(u, 2);
	q(d, 17, () => V(r), (e) => e.label, (e, t) => {
		var r = ld(), i = N(r);
		gs(i, { get fill() {
			return V(t).color;
		} });
		var a = I(i, 2), o = F(a, !0), s = I(a, 2), c = F(s, !0), l = I(s, 2), u = F(l, !0), d = F(I(l, 2), !0);
		w(r), L((e, n, i, a) => {
			J(r, "title", V(t).note), G(o, e), G(c, n), G(u, i), G(d, a);
		}, [
			() => $(V(t).label),
			() => Y(V(t).tokens),
			() => ua(V(t).tokens, V(n)),
			() => Z(V(t).cost)
		]), W(e, r);
	});
	var f = I(d, 2), p = (e) => {
		var t = ud();
		J(t, "title", "The context a main-thread turn reads: new input, cache writes and reads. The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens).");
		var n = F(t, !0);
		L(() => G(n, V(i))), W(e, t);
	};
	K(f, (e) => {
		V(i) !== null && e(p);
	}), w(a), L((e, t, n) => {
		G(s, e), G(l, t), J(u, "aria-label", n);
	}, [
		() => $("Input tokens"),
		() => Y(V(n)),
		() => nd(V(r), t.totals)
	]), W(e, a), E();
}
//#endregion
//#region src/components/StatTile.svelte
var pd = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	" "
]]), md = /* @__PURE__ */ H([[
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
function hd(e, t) {
	T(t, !0);
	let n = Di(t, "note", 3, null), r = Di(t, "themedNote", 3, !1);
	var i = md(), a = N(i), o = F(a, !0), s = I(a, 2), c = F(s, !0), l = I(s, 2), u = (e) => {
		var t = pd(), i = F(t, !0);
		L((e) => G(i, e), [() => r() ? $(n()) : n()]), W(e, t);
	};
	K(l, (e) => {
		n() && e(u);
	}), w(i), L((e) => {
		G(o, e), G(c, t.value);
	}, [() => $(t.label)]), W(e, i), E();
}
//#endregion
//#region src/components/KpiTiles.svelte
var gd = /* @__PURE__ */ H([
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
], 1), _d = /* @__PURE__ */ H([[
	"div",
	{ class: "note" },
	,
]]), vd = /* @__PURE__ */ H([
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
function yd(e, t) {
	T(t, !0);
	let n = /* @__PURE__ */ O(() => t.savings ? ed(t.savings) : null);
	var r = vd(), i = P(r), a = N(i), o = N(a), s = F(o, !0), c = I(o);
	w(a);
	var l = I(a, 2), u = F(l, !0), d = I(l, 2), f = F(d, !0), p = I(d, 2), m = (e) => {
		var t = _d(), r = N(t), i = (e) => {
			var t = gd(), r = P(t), i = F(r, !0), a = F(I(r, 2), !0);
			L(() => {
				ri(r, 1, Zr(V(n).verdict === "gain" ? "verdict-gain" : "verdict-loss")), G(i, V(n).amount), G(a, V(n).count);
			}), W(e, t);
		}, a = (e) => {
			var t = Tr();
			L(() => G(t, V(n).count)), W(e, t);
		};
		K(r, (e) => {
			V(n).verdict ? e(i) : e(a, -1);
		}), w(t), L(() => J(t, "title", V(n).title)), W(e, t);
	};
	K(p, (e) => {
		V(n) && e(m);
	}), w(i);
	var h = I(i, 2);
	fd(h, {
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
		let e = /* @__PURE__ */ O(() => X(t.totals.turns));
		hd(g, {
			label: "Turns",
			get value() {
				return V(e);
			},
			note: "API calls with usage",
			themedNote: !0
		});
	}
	var _ = I(g, 2);
	{
		let e = /* @__PURE__ */ O(() => Y(t.totals.output)), n = /* @__PURE__ */ O(() => Z(t.totals.cost_parts.output));
		hd(_, {
			label: "Output tokens",
			get value() {
				return V(e);
			},
			get note() {
				return V(n);
			}
		});
	}
	L((e, n, r) => {
		G(s, e), G(c, `, ${t.scope ?? ""}`), G(u, n), G(f, r);
	}, [
		() => $("Estimated cost"),
		() => Z(t.totals.cost),
		() => Qu(t.totals)
	]), W(e, r), E();
}
//#endregion
//#region src/components/RuntimeTiles.svelte
var bd = /* @__PURE__ */ H([
	,
	,
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function xd(e, t) {
	T(t, !0);
	let n = /* @__PURE__ */ O(() => "source" in t.runtime && t.runtime.source === "transcripts"), r = /* @__PURE__ */ O(() => id(t.runtime, t.from, t.costPer100Lines, V(n)));
	var i = bd(), a = P(i);
	{
		let e = /* @__PURE__ */ O(() => da(t.runtime.duration_ms));
		hd(a, {
			label: "Session time",
			get value() {
				return V(e);
			},
			get note() {
				return V(r).session;
			}
		});
	}
	var o = I(a, 2);
	{
		let e = /* @__PURE__ */ O(() => da(t.runtime.api_ms));
		hd(o, {
			label: "Waiting on the API",
			get value() {
				return V(e);
			},
			get note() {
				return V(r).api;
			}
		});
	}
	var s = I(o, 2);
	{
		let e = /* @__PURE__ */ O(() => da(t.runtime.tool_ms));
		hd(s, {
			label: "Running tools",
			get value() {
				return V(e);
			},
			get note() {
				return V(r).tools;
			}
		});
	}
	var c = I(s, 2);
	{
		let e = /* @__PURE__ */ O(() => `+${X(t.runtime.lines_added)} / −${X(t.runtime.lines_removed)}`);
		hd(c, {
			label: "Lines changed",
			get value() {
				return V(e);
			},
			get note() {
				return V(r).lines;
			}
		});
	}
	W(e, i), E();
}
//#endregion
//#region src/components/SummaryTiles.svelte
var Sd = /* @__PURE__ */ H([[
	"div",
	{ class: "empty" },
	" "
]]);
function Cd(e, t) {
	T(t, !0);
	let n = /* @__PURE__ */ O(() => Q.summary);
	var r = U(), i = P(r), a = (e) => {
		var r = U(), i = P(r), a = (e) => {
			{
				let t = /* @__PURE__ */ O(() => Zu(V(n)));
				yd(e, {
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
				let t = /* @__PURE__ */ O(() => ad(V(n).runtime.sessions));
				xd(e, {
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
		var t = Sd(), n = F(t, !0);
		L(() => G(n, Q.summaryFailed ? "Could not load the summary." : "Loading…")), W(e, t);
	};
	K(i, (e) => {
		V(n) ? e(a) : t.rows === "kpis" && e(o, 1);
	}), W(e, r), E();
}
//#endregion
//#region src/lib/usage.ts
function wd(e) {
	return [{ label: e }, ...Wo];
}
function Td(e, t) {
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
function Ed(e, t, n) {
	return e.slice().sort(Uo).flatMap((e) => [{
		key: e.model,
		name: e.model,
		kind: "model",
		swatch: Xi(n.get(e.model) ?? null),
		cells: Go(e),
		sub: !1,
		group: !0
	}, ...t.filter((t) => t.model === e.model && t.effort !== null).sort((e, t) => Hi(e.effort ?? "") - Hi(t.effort ?? "") || (e.effort ?? "").localeCompare(t.effort ?? "")).map((t) => ({
		key: `${e.model}\u0000${t.effort}`,
		name: Wi(t.effort),
		kind: "effort",
		swatch: null,
		cells: Go(t),
		sub: !0,
		group: !1
	}))]);
}
//#endregion
//#region src/components/UsageTable.svelte
var Dd = /* @__PURE__ */ H([[
	"h2",
	null,
	" "
]]), Od = /* @__PURE__ */ H([[
	"p",
	{ class: "note" },
	" "
]]), kd = /* @__PURE__ */ H([[
	"span",
	null,
	,
	" "
]]), Ad = /* @__PURE__ */ H([[
	"span",
	{ class: "effort" },
	" "
]]), jd = /* @__PURE__ */ H([[
	"td",
	{ class: "num" },
	" "
]]), Md = /* @__PURE__ */ H([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1), Nd = /* @__PURE__ */ H([[
	"section",
	{ class: "card" },
	,
]]);
function Pd(e, t) {
	T(t, !0);
	let n = (e) => {
		var n = Dd(), r = F(n, !0);
		L(() => {
			J(n, "id", `${t.id ?? ""}-title`), G(r, t.title);
		}), W(e, n);
	}, r = (e) => {
		var n = Od(), r = F(n, !0);
		L(() => G(r, t.note)), W(e, n);
	}, i = (e, t = v) => {
		var n = Md(), r = P(n), i = N(r), o = (e) => {
			var n = kd(), r = N(n);
			gs(r, { get fill() {
				return t().swatch;
			} });
			var i = I(r, 1, !0);
			w(n), L(() => G(i, t().name)), W(e, n);
		}, s = (e) => {
			var n = Ad(), r = F(n, !0);
			L(() => G(r, t().name)), W(e, n);
		}, c = (e) => {
			var n = Tr();
			L(() => G(n, t().name)), W(e, n);
		};
		K(i, (e) => {
			t().kind === "model" ? e(o) : t().kind === "effort" ? e(s, 1) : e(c, -1);
		}), w(r), q(I(r, 2), 19, () => V(a), (e) => e.label, (e, n, r) => {
			var i = jd(), a = F(i, !0);
			L(() => G(a, t().cells[V(r)])), W(e, i);
		}), W(e, n);
	}, a = /* @__PURE__ */ O(() => wd(t.nameLabel).slice(1));
	var o = Nd(), s = N(o), c = (e) => {
		{
			let a = /* @__PURE__ */ O(() => wd(t.nameLabel)), o = /* @__PURE__ */ O(() => t.note === void 0 ? void 0 : r);
			Is(e, {
				get key() {
					return t.id;
				},
				get columns() {
					return V(a);
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
		n(e);
	};
	K(s, (e) => {
		t.rows ? e(c) : e(l, -1);
	}), w(o), L(() => J(o, "aria-labelledby", `${t.id ?? ""}-title`)), W(e, o), E();
}
//#endregion
//#region src/components/UsageTables.svelte
var Fd = /* @__PURE__ */ H([
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
function Id(e, t) {
	T(t, !0);
	let n = /* @__PURE__ */ O(() => Q.summary), r = /* @__PURE__ */ O(() => V(n) ? Td(V(n).agent_type, (e) => e.agent_type) : null), i = /* @__PURE__ */ O(() => V(n) ? Bi([...new Set(V(n).day_model.map((e) => e.model))]) : null), a = /* @__PURE__ */ O(() => V(n) && V(i) ? Ed(V(n).model, V(n).model_effort, V(i)) : null), o = /* @__PURE__ */ O(() => V(n) ? Td(V(n).project, (e) => e.project) : null), s = /* @__PURE__ */ O(() => V(n) ? Td(V(n).skill, (e) => e.skill) : null), c = /* @__PURE__ */ O(() => V(n) ? Td(V(n).mcp_server, (e) => e.mcp_server) : null);
	var l = Fd(), u = P(l), d = N(u);
	{
		let e = /* @__PURE__ */ O(() => $("By agent type"));
		Pd(d, {
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
	var f = I(d, 2);
	{
		let e = /* @__PURE__ */ O(() => $("By model"));
		Pd(f, {
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
	w(u);
	var p = I(u, 2);
	{
		let e = /* @__PURE__ */ O(() => $("By project"));
		Pd(p, {
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
	var m = I(p, 2), h = N(m);
	{
		let e = /* @__PURE__ */ O(() => $("By skill"));
		Pd(h, {
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
	var g = I(h, 2);
	{
		let e = /* @__PURE__ */ O(() => $("By MCP server"));
		Pd(g, {
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
	w(m), W(e, l), E();
}
//#endregion
//#region src/lib/banner.svelte.ts
var Ld = class {
	#e = new po();
	#t = /* @__PURE__ */ O(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return V(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, Rd = /* @__PURE__ */ t({
	mountSessionKpis: () => Ud,
	mountSessionRuntime: () => Wd,
	releaseDetachedTiles: () => Bd
}), zd = /* @__PURE__ */ new Set();
function Bd() {
	for (let e of [...zd]) e.holder.isConnected || (zd.delete(e), Ir(e.component));
}
function Vd() {
	let e = document.createElement("div");
	return e.className = "kpis session-kpis", e;
}
function Hd(e, t) {
	return jt(), zd.add({
		component: e,
		holder: t
	}), queueMicrotask(Bd), t;
}
function Ud(e) {
	let t = Vd();
	return Hd(Mr(yd, {
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
function Wd(e) {
	let t = Vd();
	return t.setAttribute("role", "group"), t.setAttribute("aria-label", "Time and lines changed"), Hd(Mr(xd, {
		target: t,
		props: {
			runtime: e.runtime,
			from: od(e.runtime.source),
			costPer100Lines: sd(e)
		}
	}), t);
}
//#endregion
//#region src/lib/secrets.ts
var Gd = /* @__PURE__ */ t({
	secretReach: () => Yd,
	secretTone: () => Kd,
	secretVia: () => qd
});
function Kd(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function qd(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var Jd = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function Yd(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(Jd, e.reach) ? Jd[e.reach] ?? "" : "no result yet";
}
//#endregion
//#region src/legacy.svelte.ts
var Xd = [
	na,
	Ri,
	Dc,
	Gd,
	Lc,
	_o,
	xa,
	Ko,
	es,
	Cs,
	_s,
	mo,
	Rd,
	Bl,
	Jl
];
function Zd(e) {
	let t = new Ld(), n = e.document.getElementById("error");
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
	let f = Mr(ki, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	n.remove();
	let p = r.map(({ id: e, container: t }) => Mr(Cd, {
		target: t,
		props: { rows: e }
	})), m = Mr(ml, { target: i }), h = Mr(zl, { target: a }), g = Mr(sc, { target: o }), _ = Mr(Ec, { target: s }), v = Mr(Bu, { target: c }), y = Mr(Id, { target: l }), ee = Mr(Xu, { target: u }), b = Mr(tu, { target: d });
	return e.showError = (e, n) => {
		t.show(e, n), jt();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...Xd), { stop() {
		Ir(f);
		for (let e of p) Ir(e);
		Ir(m), Ir(h), Ir(g), Ir(_), Ir(v), Ir(y), Ir(ee), Ir(b), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of Xd.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
Zd(window);
//#endregion

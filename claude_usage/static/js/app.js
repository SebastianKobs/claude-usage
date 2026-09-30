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
var b = 1 << 24, x = 1024, S = 2048, C = 4096, te = 8192, ne = 16384, re = 32768, ie = 1 << 25, ae = 65536, oe = 1 << 19, se = 1 << 20, ce = 1 << 25, le = 1 << 21, ue = 1 << 22, de = 1 << 23, fe = Symbol("$state"), pe = Symbol("component"), me = Symbol("legacy props"), he = Symbol(""), ge = Symbol("attributes"), _e = Symbol("class"), ve = Symbol("style"), ye = Symbol("text"), be = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), xe = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function Se() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ce(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function we() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Te() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var w = !1;
function Ee(e) {
	w = e;
}
var T;
function De(e) {
	if (e === null) throw Ce(), n;
	return T = e;
}
function Oe() {
	return De(/* @__PURE__ */ Qt(T));
}
function E(e) {
	if (w) {
		if (/* @__PURE__ */ Qt(T) !== null) throw Ce(), n;
		T = e;
	}
}
function ke(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ Qt(n);
		T = n;
	}
}
function Ae(e = !0) {
	for (var t = 0, n = T;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ Qt(n);
		e && n.remove(), n = i;
	}
}
function je(e) {
	if (!e || e.nodeType !== 8) throw Ce(), n;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Me(e) {
	return e === this.v;
}
function Ne(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Pe(e) {
	return !Ne(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Fe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ie(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Le() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Re(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function ze() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Be() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ve() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function He() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var Ue = null;
function We(e) {
	Ue = e;
}
function D(e, t = !1, n) {
	Ue = {
		p: Ue,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: U,
		l: null
	};
}
function O(e) {
	var t = Ue, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) pn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ue = t.p, Ge(e);
}
function Ge(e = {}) {
	return d(e, pe, { value: !0 }), e;
}
function Ke() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var qe = [];
function Je() {
	var e = qe;
	qe = [], y(e);
}
function Ye(e) {
	if (qe.length === 0 && !vt) {
		var t = qe;
		queueMicrotask(() => {
			t === qe && Je();
		});
	}
	qe.push(e);
}
function Xe() {
	for (; qe.length > 0;) Je();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Ze = ~(S | C | x);
function k(e, t) {
	e.f = e.f & Ze | t;
}
function Qe(e) {
	e.f & 512 || e.deps === null ? k(e, x) : k(e, C);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function $e(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), k(e, x);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function et(e) {
	var t = H, n = U;
	Fn(null), In(null);
	try {
		return e();
	} finally {
		Fn(t), In(n);
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function tt(e, t, n, r) {
	let i = Ke() ? at : ct;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = U, c = nt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				cn(e, s);
			}
			rt();
		}
	}
	var d = it();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ st(e))).then(u).catch((e) => cn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), rt();
	}) : f();
}
function nt() {
	var e = U, t = H, n = Ue, r = j;
	return function(i = !0) {
		In(e), Fn(t), We(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function rt(e = !0) {
	In(null), Fn(null), We(null), e && j?.deactivate();
}
function it() {
	var e = U, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function at(e) {
	var t = 2 | S;
	return U !== null && (U.f |= oe), {
		ctx: Ue,
		deps: null,
		effects: null,
		equals: Me,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: r,
		wv: 0,
		parent: U,
		ac: null
	};
}
var ot = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function st(e, t, n) {
	let i = U;
	i === null && Fe();
	var a = void 0, o = Ft(r), s = !H, c = /* @__PURE__ */ new Set();
	return gn(() => {
		var t = U, n = ee();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== be && n.reject(e);
			}).finally(rt);
		} catch (e) {
			n.reject(e), rt();
		}
		var r = j;
		if (s) {
			if (t.f & 32768) var l = it();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(ot);
			else for (let e of c.values()) e.reject(ot);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== ot && (r.activate(), t ? (o.f |= de, zt(o, t)) : (o.f & 8388608 && (o.f ^= de), zt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), fn(() => {
		for (let e of c) e.reject(ot);
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
function A(e) {
	let t = /* @__PURE__ */ at(e);
	return Rn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function ct(e) {
	let t = /* @__PURE__ */ at(e);
	return t.equals = Pe, t;
}
function lt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function ut(e) {
	var t, n = U, i = e.parent;
	if (!Mn && i !== null && e.v !== r && i.f & 24576) return Se(), e.v;
	In(i);
	try {
		lt(e), t = Jn(e);
	} finally {
		In(n);
	}
	return t;
}
function dt(e) {
	var t = ut(e);
	if (!e.equals(t) && (e.wv = Gn(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), ht?.capture(e, t, !0)), e.deps === null))) {
		k(e, x);
		return;
	}
	Mn || (gt === null ? Qe(e) : (dn() || j?.is_fork) && gt.set(e, t));
}
function ft(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && et(() => {
		t.ac.abort(be), t.ac = null;
	}), t.fn !== null && (t.teardown = v), Zn(t, 0), xn(t));
}
function pt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Qn(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var mt = null, j = null, ht = null, gt = null, _t = null, vt = !1, yt = !1, bt = null, xt = null, St = 0, Ct = 1, wt = class e {
	id = Ct++;
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
		mt === null ? mt = this : (mt.#n = this, this.#t = mt), mt = this;
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
			for (var r of n.d) k(r, S), t(r);
			for (r of n.m) k(r, C), t(r);
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
		for (let e of this.#u) this.#d.delete(e), k(e, S), this.schedule(e);
		for (let e of this.#d) k(e, C), this.schedule(e);
		this.apply();
		for (var t = bt = [], n = [], r = xt = []; this.#c.length > 0;) {
			St++ > 1e3 && (this.#S(), Et());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw jt(e), this.#h() || this.discard(), t;
			}
		}
		if (j = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (bt = null, xt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) At(e, t);
			r.length > 0 && j.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), ht = this, Ot(n), Ot(t), ht = null, this.#s?.resolve();
		var o = j;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (Nt.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= x;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= x : i & 4 ? t.push(r) : Kn(r) && (i & 16 && this.#d.add(r), Qn(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), k(i, S), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), j = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) $e(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== r && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), gt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		j = this;
	}
	deactivate() {
		j = null, gt = null;
	}
	flush() {
		try {
			yt = !0, j = this, this.#_();
		} finally {
			St = 0, _t = null, bt = null, xt = null, yt = !1, j = null, gt = null, Nt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ot);
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
		this.#m || (this.#m = !0, Ye(() => {
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
		if (j === null) {
			let t = j = new e();
			!yt && !vt && Ye(() => {
				t.#e || t.flush();
			});
		}
		return j;
	}
	apply() {
		gt = null;
	}
	schedule(e) {
		if (_t = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? mt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Tt(e) {
	var t = vt;
	vt = !0;
	try {
		var n;
		for (e && (j !== null && !j.is_fork && j.flush(), n = e());;) {
			if (Xe(), j === null) return n;
			j.flush();
		}
	} finally {
		vt = t;
	}
}
function Et() {
	try {
		Le();
	} catch (e) {
		cn(e, _t);
	}
}
var Dt = null;
function Ot(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Kn(r) && (Dt = /* @__PURE__ */ new Set(), Qn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && wn(r), Dt?.size > 0)) {
				Nt.clear();
				for (let e of Dt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Dt.has(n) && (Dt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Qn(n);
					}
				}
				Dt.clear();
			}
		}
		Dt = null;
	}
}
function kt(e) {
	j.schedule(e);
}
function At(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), k(e, x);
		for (var n = e.first; n !== null;) At(n, t), n = n.next;
	}
}
function jt(e) {
	k(e, x);
	for (var t = e.first; t !== null;) jt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Mt = /* @__PURE__ */ new Set(), Nt = /* @__PURE__ */ new Map(), Pt = !1;
function Ft(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Me,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function M(e, t) {
	let n = Ft(e, t);
	return Rn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function It(e, t = !1, n = !0) {
	let r = Ft(e);
	return t || (r.equals = Pe), r;
}
function N(e, t, n = !1) {
	return H !== null && (!Pn || H.f & 131072) && Ke() && H.f & 4325394 && (Ln === null || !Ln.has(e)) && Ve(), zt(e, n ? Ut(t) : t, xt);
}
var Lt = null, Rt = 0;
function zt(e, t, n = null) {
	if (!e.equals(t)) {
		Mn ? Nt.set(e, t) : Nt.has(e) || Nt.set(e, e.v);
		var r = wt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && ut(t), gt === null && Qe(t);
		}
		e.wv = Gn(), Lt = null, Rt = 0, Ht(e, S, n), Lt = null, Ke() && U !== null && U.f & 1024 && !(U.f & 96) && (zn === null ? Bn([e]) : zn.push(e)), !r.is_fork && Mt.size > 0 && !Pt && Bt();
	}
	return t;
}
function Bt() {
	Pt = !1;
	for (let e of Mt) {
		e.f & 1024 && k(e, C);
		let t;
		try {
			t = Kn(e);
		} catch {
			t = !0;
		}
		t && Qn(e);
	}
	Mt.clear();
}
function Vt(e) {
	N(e, e.v + 1);
}
function Ht(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Ke(), a = r.length;
		if (Rt += a, Rt > 1e5 && Lt === null && (Lt = /* @__PURE__ */ new Set()), Lt !== null) {
			if (Lt.has(e)) return;
			Lt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== U) {
				var l = (c & S) === 0;
				if (l && k(s, t), c & 131072) Mt.add(s);
				else if (c & 2) {
					var u = s;
					gt?.delete(u), Ht(u, C, n);
				} else if (l) {
					var d = s;
					c & 16 && Dt !== null && Dt.add(d), n === null ? kt(d) : n.push(d);
				}
			}
		}
	}
}
function Ut(e) {
	if (typeof e != "object" || !e || fe in e || pe in e) return e;
	let t = g(e);
	if (t !== m && t !== h) return e;
	var n = /* @__PURE__ */ new Map(), i = s(e), a = /* @__PURE__ */ M(0), o = null, c = Un, l = (e) => {
		if (Un === c) return e();
		var t = H, n = Un;
		Fn(null), Wn(c);
		var r = e();
		return Fn(t), Wn(n), r;
	};
	return i && n.set("length", /* @__PURE__ */ M(e.length, o)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && ze();
			var i = n.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ M(r.value, o);
				return n.set(t, e), e;
			}) : N(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = n.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ M(r, o));
					n.set(t, e), Vt(a);
				}
			} else N(i, r), Vt(a);
			return !0;
		},
		get(t, i, a) {
			if (i === fe) return e;
			var s = n.get(i), c = i in t;
			if (s === void 0 && (!c || f(t, i)?.writable) && (s = l(() => /* @__PURE__ */ M(Ut(c ? t[i] : r), o)), n.set(i, s)), s !== void 0) {
				var u = K(s);
				return u === r ? void 0 : u;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var i = Reflect.getOwnPropertyDescriptor(e, t), a = n.get(t);
			if (a !== void 0) {
				var o = K(a);
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
			if (t === fe) return !0;
			var i = n.get(t), a = i !== void 0 && i.v !== r || Reflect.has(e, t);
			return (i !== void 0 || U !== null && (!a || f(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ M(a ? Ut(e[t]) : r, o)), n.set(t, i)), K(i) === r) ? !1 : a;
		},
		set(e, t, s, c) {
			var u = n.get(t), d = t in e;
			if (i && t === "length") for (var p = s; p < u.v; p += 1) {
				var m = n.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ M(r, o)), n.set(p + "", m)) : N(m, r);
			}
			if (u === void 0) (!d || f(e, t)?.writable) && (u = l(() => /* @__PURE__ */ M(void 0, o)), N(u, Ut(s)), n.set(t, u));
			else {
				d = u.v !== r;
				var h = l(() => Ut(s));
				N(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, s), !d) {
				if (i && typeof t == "string") {
					var _ = n.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && N(_, v + 1);
				}
				Vt(a);
			}
			return !0;
		},
		ownKeys(e) {
			K(a);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== r;
			});
			for (var [i, o] of n) o.v !== r && !(i in e) && t.push(i);
			return t;
		},
		setPrototypeOf() {
			Be();
		}
	});
}
function Wt(e) {
	try {
		if (typeof e == "object" && e && fe in e) return e[fe];
	} catch {}
	return e;
}
function Gt(e, t) {
	return Object.is(Wt(e), Wt(t));
}
var Kt, qt, Jt, Yt;
function Xt() {
	if (Kt === void 0) {
		Kt = window, qt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Jt = f(t, "firstChild").get, Yt = f(t, "nextSibling").get, _(e) && (e[_e] = void 0, e[ge] = null, e[ve] = void 0, e.__e = void 0), _(n) && (n[ye] = void 0);
	}
}
function P(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Zt(e) {
	return Jt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Qt(e) {
	return Yt.call(e);
}
function F(e, t) {
	if (!w) return /* @__PURE__ */ Zt(e);
	var n = /* @__PURE__ */ Zt(T);
	if (n === null) n = T.appendChild(P());
	else if (t && n.nodeType !== 3) {
		var r = P();
		return n?.before(r), De(r), r;
	}
	return t && on(n), De(n), n;
}
function I(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ Zt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Qt(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = P();
			return T?.before(r), De(r), r;
		}
		on(T);
	}
	return T;
}
function L(e, t = !1) {
	if (!w) return /* @__PURE__ */ Zt(e);
	var n = F(e, t);
	return E(e), n;
}
function R(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Qt(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = P();
			return r === null ? i?.after(a) : r.before(a), De(a), a;
		}
		on(r);
	}
	return De(r), r;
}
function $t(e) {
	e.textContent = "";
}
function en() {
	return !1;
}
function tn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function nn() {
	return document.createDocumentFragment();
}
function rn(e = "") {
	return document.createComment(e);
}
function an(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function on(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function sn(e) {
	var t = U;
	if (t === null) return H.f |= de, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	cn(e, t);
}
function cn(e, t) {
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
function ln(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function un(e, t) {
	var n = U;
	n !== null && n.f & 8192 && (e |= te);
	var r = {
		ctx: Ue,
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
	j?.register_created_effect(r);
	var i = r;
	if (e & 4) bt === null ? wt.ensure().schedule(r) : bt.push(r);
	else if (t !== null) {
		try {
			Qn(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ae));
	}
	if (i !== null && (i.parent = n, n !== null && ln(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function dn() {
	return H !== null && !Pn;
}
function fn(e) {
	let t = un(8, null);
	return k(t, x), t.teardown = e, t;
}
function pn(e) {
	return un(4 | se, e);
}
function mn(e) {
	wt.ensure();
	let t = un(64 | oe, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Tn(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function hn(e) {
	return un(4, e);
}
function gn(e) {
	return un(ue | oe, e);
}
function _n(e, t = 0) {
	return un(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	tt(r, t, n, (t) => {
		un(8, () => {
			e(...t.map(K));
		});
	});
}
function vn(e, t = 0) {
	return un(16 | t, e);
}
function yn(e, t = 0) {
	return un(b | t, e);
}
function B(e) {
	return un(32 | oe, e);
}
function bn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Mn, r = H;
		Nn(!0), Fn(null);
		try {
			t.call(null);
		} catch (t) {
			cn(t, e.parent);
		} finally {
			Nn(n), Fn(r);
		}
	}
}
function xn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && et(() => {
			e.abort(be);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : V(n, t), n = r;
	}
}
function Sn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Cn(e.nodes.start, e.nodes.end), n = !0), e.f |= ie, xn(e, t && !n), Zn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	bn(e), e.f ^= ie, e.f |= ne;
	var i = e.parent;
	i !== null && i.first !== null && wn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Cn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Qt(e);
		e.remove(), e = n;
	}
}
function wn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Tn(e, t, n = !0) {
	var r = [];
	e.f |= 256, En(e, r, !0);
	var i = () => {
		n && V(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function En(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= te;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				En(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Dn(e) {
	e.f &= -257, On(e, !0);
}
function On(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= te, e.f & 1024 || (k(e, S), wt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			On(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function kn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Qt(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var An = null, jn = !1, Mn = !1;
function Nn(e) {
	Mn = e;
}
var H = null, Pn = !1;
function Fn(e) {
	H = e;
}
var U = null;
function In(e) {
	U = e;
}
var Ln = null;
function Rn(e) {
	H !== null && (H.f & 2097152 || H.f & 2) && (Ln ??= /* @__PURE__ */ new Set()).add(e);
}
var W = null, G = 0, zn = null;
function Bn(e) {
	zn = e;
}
var Vn = 1, Hn = 0, Un = Hn;
function Wn(e) {
	Un = e;
}
function Gn() {
	return ++Vn;
}
function Kn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Kn(a) && dt(a), a.wv > e.wv) return !0;
		}
		t & 512 && gt === null && k(e, x);
	}
	return !1;
}
function qn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Ln !== null && Ln.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? qn(a, t, !1) : t === a && (n ? k(a, S) : a.f & 1024 && k(a, C), kt(a));
	}
}
function Jn(e) {
	var t = W, n = G, r = zn, i = H, a = Ln, o = Ue, s = Pn, c = Un, l = e.f;
	W = null, G = 0, zn = null, H = l & 96 ? null : e, Ln = null, We(e.ctx), Pn = !1, Un = ++Hn, e.ac !== null && (et(() => {
		e.ac.abort(be);
	}), e.ac = null);
	try {
		e.f |= le;
		var u = e.fn, d = u();
		e.f |= re;
		var f = Yn(e);
		if (Ke() && zn !== null && !Pn && f !== null && !(e.f & 6146)) for (var p = 0; p < zn.length; p++) qn(zn[p], e);
		if (i !== null && i !== e) {
			if (Hn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Hn;
			if (t !== null) for (let e of t) e.rv = Hn;
			zn !== null && (r === null ? r = zn : r.push(...zn));
		}
		return e.f & 8388608 && (e.f ^= de), d;
	} catch (t) {
		return Yn(e), sn(t);
	} finally {
		e.f ^= le, W = t, G = n, zn = r, H = i, Ln = a, We(o), Pn = s, Un = c;
	}
}
function Yn(e) {
	var t = e.deps, n = j?.is_fork;
	if (W !== null) {
		var r;
		if (n || Zn(e, G), t !== null && G > 0) for (t.length = G + W.length, r = 0; r < W.length; r++) t[G + r] = W[r];
		else e.deps = t = W;
		if (dn() && e.f & 512) for (r = G; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && G < t.length && (Zn(e, G), t.length = G);
	return t;
}
function Xn(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var i = c.call(n, e);
		if (i !== -1) {
			var a = n.length - 1;
			a === 0 ? n = t.reactions = null : (n[i] = n[a], n.pop());
		}
	}
	if (n === null && t.f & 2 && (W === null || !l.call(W, t))) {
		var o = t;
		o.f & 512 && (o.f ^= 512), o.v !== r && Qe(o), o.ac !== null && et(() => {
			o.ac.abort(be), o.ac = null, k(o, S);
		}), ft(o), Zn(o, 0);
	}
}
function Zn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Xn(e, n[r]);
}
function Qn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		k(e, x);
		var n = U, r = jn;
		U = e, jn = !(t & 96);
		try {
			t & 16777232 ? Sn(e) : xn(e), bn(e);
			var i = Jn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Vn;
		} finally {
			jn = r, U = n;
		}
	}
}
function K(e) {
	var t = !!(e.f & 2);
	if (An?.add(e), H !== null && !Pn && !(U !== null && U.f & 16384) && (Ln === null || !Ln.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < Hn && (e.rv = Hn, W === null && n !== null && n[G] === e ? G++ : W === null ? W = [e] : W.push(e));
		else {
			H.deps ??= [], l.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : l.call(r, H) || r.push(H);
		}
	}
	if (Mn && Nt.has(e)) return Nt.get(e);
	if (t) {
		var i = e;
		if (Mn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || er(i)) && (a = ut(i)), Nt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Pn && H !== null && (jn || !!(H.f & 512)), s = (i.f & re) === 0;
		Kn(i) && (o && (i.f |= 512), dt(i)), o && !s && (pt(i), $n(i));
	}
	if (gt?.has(e)) return gt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function $n(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (pt(t), $n(t));
}
function er(e) {
	if (e.v === r) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Nt.has(t) || t.f & 2 && er(t)) return !0;
	return !1;
}
function tr(e) {
	var t = Pn;
	try {
		return Pn = !0, e();
	} finally {
		Pn = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var nr = Symbol("events"), rr = /* @__PURE__ */ new Set(), ir = /* @__PURE__ */ new Set();
function ar(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || dr.call(t, e), !e.cancelBubble) return et(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Ye(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function or(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = ar(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && fn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function sr(e, t, n) {
	(t[nr] ??= {})[e] = n;
}
function cr(e) {
	for (var t = 0; t < e.length; t++) rr.add(e[t]);
	for (var n of ir) n(e);
}
var lr = null, ur = !1;
function dr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	lr = e, ur || (ur = !0, setTimeout(() => {
		ur = !1, lr = null;
	}));
	var o = 0, s = lr === e && e[nr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[nr] = t;
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
		var u = H, f = U;
		Fn(null), In(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[nr]?.[r];
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
			e[nr] = t, delete e.currentTarget, Fn(u), In(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var fr = xe ? "template" : "TEMPLATE";
function pr(e, t) {
	var n = U;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function mr(e, t) {
	var n = nn();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(P(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(rn(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = r, u = e === "svg" ? a : e === "math" ? o : t;
		var i = tn(e, u, c?.is);
		for (var s in c) an(i, s, c[s]);
		l.length > 0 && (i.nodeName === fr ? i.content : i).append(mr(l, i.nodeName === "foreignObject" ? void 0 : u)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function q(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (w) return pr(T, null), T;
		i === void 0 && (i = mr(e, t & 4 ? a : t & 8 ? o : void 0), n || (i = /* @__PURE__ */ Zt(i)));
		var s = r || qt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ Zt(s), l = s.lastChild;
			pr(c, l);
		} else pr(s, s);
		return s;
	};
}
function hr(e = "") {
	if (!w) {
		var t = P(e + "");
		return pr(t, t), t;
	}
	var n = T;
	return n.nodeType === 3 ? on(n) : (n.before(n = P()), De(n)), pr(n, n), n;
}
function gr() {
	if (w) return pr(T, null), T;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = P();
	return e.append(t, n), pr(t, n), e;
}
function J(e, t) {
	if (w) {
		var n = U;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = T), Oe();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var _r = ["touchstart", "touchmove"];
function vr(e) {
	return _r.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function yr(e) {
	let t = 0, n = Ft(0), r;
	return () => {
		dn() && (K(n), _n(() => (t === 0 && (r = tr(() => e(() => Vt(n)))), t += 1, () => {
			Ye(() => {
				--t, t === 0 && (r?.(), r = void 0, Vt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var br = ae | oe;
function xr(e, t, n, r) {
	new Sr(e, t, n, r);
}
var Sr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = w ? T : null;
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
	#h = yr(() => (this.#m = Ft(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = U;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = U.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = vn(() => {
			if (w) {
				let e = this.#t;
				Oe();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, br), w && (this.#e = T);
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
		Ye(r), t && (this.#s = B(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Te();
				return;
			}
			t = !0, n && He(), this.#s !== null && Tn(this.#s, () => {
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
					cn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), Ye(() => {
			var e = this.#c = document.createDocumentFragment(), t = P(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return B(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						cn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(j);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Tn(this.#o, () => {
				this.#o = null;
			}), this.#x(j));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = B(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				kn(this.#a, e);
				let t = this.#n.pending;
				this.#o = B(() => t(this.#e));
			} else this.#x(j);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		$e(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = U, n = H, r = Ue;
		In(this.#i), Fn(this.#i), We(this.#i.ctx);
		try {
			return wt.ensure(), e();
		} finally {
			In(t), Fn(n), We(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Tn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ye(() => {
			this.#d = !1, this.#m && zt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), K(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), w && (De(this.#t), ke(), De(Ae()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return B(() => {
						var r = U;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return cn(e, this.#i.parent), null;
				}
			}));
		};
		Ye(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				cn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => cn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function Y(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ye] ??= e.nodeValue) && (e[ye] = n, e.nodeValue = `${n}`);
}
function Cr(e, t) {
	return Tr(e, t);
}
var wr = /* @__PURE__ */ new Map();
function Tr(e, { target: t, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	Xt();
	var l = void 0, d = mn(() => {
		var s = r ?? t.appendChild(P());
		xr(s, { pending: () => {} }, (t) => {
			D({});
			var r = Ue;
			if (o && (r.c = o), a && (i.$$events = a), w && pr(t, null), l = e(t, i) || Ge(), w && (U.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw Ce(), n;
			O();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = vr(r);
					for (let e of [t, document]) {
						var a = wr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), wr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, dr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(u(rr)), ir.add(f), () => {
			for (var e of d) for (let r of [t, document]) {
				var n = wr.get(r), i = n.get(e);
				--i == 0 ? (r.removeEventListener(e, dr), n.delete(e), n.size === 0 && wr.delete(r)) : n.set(e, i);
			}
			ir.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Er.set(l, d), l;
}
var Er = /* @__PURE__ */ new WeakMap();
function Dr(e, t) {
	let n = Er.get(e);
	return n ? (Er.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Or = class {
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
			if (n) Dn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Dn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (V(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						kn(r, t), t.append(P()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else V(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Tn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (V(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = j, r = en();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = P();
				i.append(a), this.#n.set(e, {
					effect: B(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, B(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else w && (this.anchor = T), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function kr(e, t, ...n) {
	var r = new Or(e);
	vn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, ae);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function X(e, t, n = !1) {
	var r;
	w && (r = T, Oe());
	var i = new Or(e), a = n ? ae : 0;
	function o(e, t) {
		if (w) {
			var n = je(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ae();
				De(a), i.anchor = a, Ee(!1), i.ensure(e, t), Ee(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	vn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Ar(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Tn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					jr(e, u(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, d = l.parentNode;
			$t(d), d.append(l), e.items.clear();
		}
		jr(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function jr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ce, kn(a, document.createDocumentFragment())) : V(t[i], n);
	}
}
var Mr;
function Nr(e, t, n, r, i, a = null) {
	var o = e, c = /* @__PURE__ */ new Map();
	if (t & 4) {
		var l = e;
		o = w ? De(/* @__PURE__ */ Zt(l)) : l.appendChild(P());
	}
	w && Oe();
	var d = null, f = /* @__PURE__ */ ct(() => {
		var e = n();
		return s(e) ? e : e == null ? [] : u(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Fr(v, p, o, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ce, Lr(d, null, o)) : Dn(d) : Tn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: vn(() => {
			p = K(f);
			var e = p.length;
			let s = !1;
			w && je(o) === "[!" != (e === 0) && (o = Ae(), De(o), Ee(!1), s = !0);
			for (var l = /* @__PURE__ */ new Set(), u = j, v = en(), y = 0; y < e; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (o = T, s = !0, Ee(!1));
				var ee = p[y], b = r(ee, y), x = h ? null : c.get(b);
				x ? (x.v && zt(x.v, ee), x.i && zt(x.i, y), v && u.unskip_effect(x.e)) : (x = Ir(c, h ? o : Mr ??= P(), ee, b, y, i, t, n), h || (x.e.f |= ce), c.set(b, x)), l.add(b);
			}
			if (e === 0 && a && !d && (h ? d = B(() => a(o)) : (d = B(() => a(Mr ??= P())), d.f |= ce)), e > l.size && Ie("", "", ""), w && e > 0 && De(Ae()), !h) {
				if (m.set(u, l), v) {
					for (let [e, t] of c) l.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			s && Ee(!0), K(f);
		}),
		flags: t,
		items: c,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (o = T);
}
function Pr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Fr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = Pr(e.effect.first), l, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Dn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ce, _ === c) Lr(_, null, n);
			else {
				var y = d ? d.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Rr(e, d, _), Rr(e, _, y), Lr(_, y, n), d = _, p = [], m = [], c = Pr(d.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var ee = m[0], b;
					d = ee.prev;
					var x = p[0], S = p[p.length - 1];
					for (b = 0; b < p.length; b += 1) Lr(p[b], ee, n);
					for (b = 0; b < m.length; b += 1) l.delete(m[b]);
					Rr(e, x.prev, S.next), Rr(e, d, x), Rr(e, S, ee), c = ee, d = S, --v, p = [], m = [];
				} else l.delete(_), Lr(_, c, n), Rr(e, _.prev, _.next), Rr(e, _, d === null ? e.effect.first : d.next), Rr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = Pr(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, c = Pr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (jr(e, u(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var C = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || C.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && C.push(c), c = Pr(c.next);
		var te = C.length;
		if (te > 0) {
			var ne = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			Ar(e, C, ne);
		}
	}
	a && Ye(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Ir(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Ft(n) : /* @__PURE__ */ It(n, !1, !1) : null, l = o & 2 ? Ft(i) : null;
	return {
		v: c,
		i: l,
		e: B(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Lr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ Qt(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Rr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function zr(e, t) {
	var n = void 0, r;
	yn(() => {
		n !== (n = t()) && (r &&= (V(r), null), n && (r = B(() => {
			hn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Br(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Br(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Vr() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Br(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function Hr(e) {
	return typeof e == "object" ? Vr(e) : e ?? "";
}
var Ur = [..." 	\n\r\f\xA0\v﻿"];
function Wr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Ur.includes(r[o - 1])) && (s === r.length || Ur.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Gr(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Kr(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function qr(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Kr)), i && c.push(...Object.keys(i).map(Kr));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Kr(e.substring(l, u).trim());
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
		return r && (n += Gr(r)), i && (n += Gr(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Jr(e, t, n, r, i, a) {
	var o = e[_e];
	if (w || o !== n || o === void 0) {
		var s = Wr(n, r, a);
		(!w || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[_e] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function Yr(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Xr(e, t, n, r) {
	var i = e[ve];
	if (w || i !== t) {
		var a = qr(t, r);
		(!w || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ve] = t;
	} else r && (Array.isArray(r) ? (Yr(e, n?.[0], r[0]), Yr(e, n?.[1], r[1], "important")) : Yr(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Zr(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Qr(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || s(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = ti(c);
			Zr(c, r ? i.includes(l) : Gt(l, n));
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
function $r(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!s(t)) return we();
		for (var r of e.options) r.selected = t.includes(ti(r));
		return;
	}
	for (r of e.options) if (Gt(ti(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function ei(e) {
	var t = new MutationObserver((t) => {
		t.every(ni) || ("__defaultValue" in e && Qr(e, !1), "__value" in e && $r(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), fn(() => {
		t.disconnect();
	});
}
function ti(e) {
	return "__value" in e ? e.__value : e.value;
}
function ni(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ri = Symbol("is custom element"), ii = Symbol("is html"), ai = xe ? "link" : "LINK";
function Z(e, t, n, r) {
	var i = oi(e);
	w && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ai) || i[t] !== (i[t] = n) && (t === "loading" && (e[he] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ci(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function oi(e) {
	return e[ge] ??= {
		[ri]: e.nodeName.includes("-"),
		[ii]: e.namespaceURI === i
	};
}
var si = /* @__PURE__ */ new Map();
function ci(e) {
	var t = e.getAttribute("is") || e.nodeName, n = si.get(t);
	if (n) return n;
	si.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = p(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = g(i);
	}
	return n;
}
var li = /* @__PURE__ */ new class e {
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
function ui(e, t, n) {
	var r = li.observe(e, () => n(e[t]));
	hn(() => (tr(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var di = !1;
function fi(e) {
	var t = di;
	try {
		return di = !1, [e(), di];
	} finally {
		di = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function pi(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ at(r), K(l)) : (c && (c = !1, s = o ? tr(r) : r), s);
	let d;
	if (a) {
		var p = fe in e || me in e;
		d = f(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = fi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = u(), d && (i && Re(t), d(m)));
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
	var v = !1, y = (n & 1 ? at : ct)(() => (v = !1, g()));
	a && K(y);
	var ee = U;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? K(y) : i && a ? Ut(e) : e;
			return N(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Mn && v || ee.f & 16384 ? y.v : K(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var mi = /* @__PURE__ */ q([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function hi(e, t) {
	D(t, !0);
	var n = mi(), r = L(n, !0);
	z(() => Y(r, t.messages.text)), J(e, n), O();
}
var gi = 12;
function _i(e) {
	return Math.max(320, e);
}
function vi(e, t) {
	return e && t ? e / t : 1;
}
function yi(e, t, n, r) {
	return (e - t) * r / (n || r);
}
function bi(e, t, n) {
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
function xi(e, t, n) {
	return Math.max(0, Math.min(e + gi, n - t));
}
function Si(e, t = 8) {
	let n = Math.max(1, Math.ceil(e / t));
	return Array.from({ length: Math.ceil(e / n) }, (e, t) => t * n);
}
function Ci(e) {
	return Math.round(e) + .5;
}
//#endregion
//#region src/lib/colors.ts
var wi = /* @__PURE__ */ t({
	BACKGROUND_EFFORT: () => ki,
	EFFORT_ORDER: () => Di,
	EFFORT_SHADES: () => Mi,
	HATCH_SHADES: () => Ni,
	HATCH_TURNS: () => Pi,
	KNOWN_MODELS: () => Ti,
	SLOT_COUNT: () => 8,
	effortHatch: () => zi,
	effortLabel: () => ji,
	effortName: () => Ai,
	effortRank: () => Oi,
	effortShade: () => Ri,
	hatchTurn: () => Bi,
	modelSlots: () => Ei,
	shade: () => Li,
	slotColor: () => Ii,
	swatchFill: () => Vi
}), Ti = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function Ei(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Ti.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !Ti.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var Di = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function Oi(e) {
	let t = Di.indexOf(e);
	return t === -1 ? Di.length : t;
}
var ki = "background";
function Ai(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function ji(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var Mi = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, Ni = {
	background: 1,
	ultracode: 4
}, Pi = {
	background: -45,
	ultracode: 45
};
function Fi(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function Ii(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function Li(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? Ii(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function Ri(e, t) {
	return Li(e, Fi(Mi, t) ?? 0);
}
function zi(e, t) {
	let n = Fi(Ni, t);
	return n ? Li(e, n) : null;
}
function Bi(e) {
	return Fi(Pi, e);
}
function Vi(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var Hi = /* @__PURE__ */ t({
	ago: () => sa,
	compact: () => Q,
	dayText: () => ea,
	duration: () => Qi,
	longDay: () => na,
	longHour: () => aa,
	money: () => Xi,
	parseDay: () => $i,
	parseHour: () => ra,
	percent: () => Zi,
	shortDay: () => ta,
	shortHour: () => ia,
	signed: () => Yi,
	when: () => oa,
	whole: () => $
}), Ui = "–", Wi = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), Gi = new Intl.NumberFormat("en"), Ki = {
	month: "short",
	day: "numeric"
}, qi = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, Ji = {
	hour: "2-digit",
	minute: "2-digit"
};
function Q(e) {
	return e == null ? Ui : Wi.format(e);
}
function Yi(e) {
	return e < 0 ? `−${Q(-e)}` : `+${Q(e)}`;
}
function $(e) {
	return e == null ? Ui : Gi.format(e);
}
function Xi(e) {
	return e == null ? Ui : Math.abs(e) >= 1e3 ? "$" + Wi.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function Zi(e, t) {
	if (!t) return Ui;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function Qi(e) {
	if (e == null) return Ui;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function $i(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function ea(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function ta(e, t) {
	return $i(e).toLocaleDateString(t, Ki);
}
function na(e, t) {
	return $i(e).toLocaleDateString(t, qi);
}
function ra(e) {
	let [t = "", n = "0"] = e.split("T"), r = $i(t);
	return r.setHours(Number(n)), r;
}
function ia(e, t) {
	return ra(e).toLocaleTimeString(t, Ji);
}
function aa(e, t) {
	let n = ra(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, Ji);
	return `${n.toLocaleDateString(t, qi)}, ${i(n)}–${i(r)}`;
}
function oa(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...Ki,
		...Ji
	}) : Ui;
}
function sa(e, t = Date.now(), n) {
	if (!e) return Ui;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : oa(e, n);
}
//#endregion
//#region src/lib/charts.ts
var ca = /* @__PURE__ */ t({
	LIMIT_ICON: () => "⚠",
	NO_USAGE: () => xa,
	RATE_LIMIT: () => Da,
	bandIndex: () => ha,
	barShare: () => Ia,
	bucketTotals: () => Sa,
	chartSeries: () => Ca,
	columnPath: () => _a,
	columnTotals: () => Ta,
	columnWidth: () => ga,
	costSplit: () => Pa,
	costTop: () => Fa,
	errorText: () => Aa,
	inputTotal: () => la,
	limitCounts: () => ja,
	limitTop: () => fa,
	limitType: () => ka,
	lineX: () => pa,
	modelGroups: () => wa,
	nearestIndex: () => ma,
	niceMax: () => ua,
	peakIndex: () => va,
	rangeDays: () => ya,
	stackSegments: () => Ea,
	ticks: () => da,
	timeBuckets: () => ba,
	windowHitAfter: () => Ma,
	windowSpan: () => Na
});
function la(e) {
	return e.new_input + e.cache_write + e.cache_read;
}
function ua(e) {
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
function da(e, t) {
	return Array.from({ length: t + 1 }, (n, r) => e * r / t);
}
function fa(e) {
	return Math.max(2, Math.ceil(ua(e) / 2) * 2);
}
function pa(e, t, n) {
	let r = e - 1;
	return (e) => r > 0 ? t + (n - t) * e / r : (t + n) / 2;
}
function ma(e, t, n) {
	return (r) => n > 1 ? Math.round((r - e) / (t - e) * (n - 1)) : 0;
}
function ha(e, t) {
	return (n) => Math.floor((n - e) / t);
}
function ga(e, t = 24) {
	return Math.max(2, Math.min(t, e * .6));
}
function _a(e, t, n, r, i, a = 4) {
	let o = i ? Math.min(a, n / 2, r) : 0;
	return `M${e},${t + r}V${t + o}` + (o ? `Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}` : `H${e + n}`) + `V${t + r}Z`;
}
function va(e) {
	return e.indexOf(Math.max(...e));
}
function ya(e, t = /* @__PURE__ */ new Date()) {
	let n = [];
	for (let r = $i(e); r <= t; r.setDate(r.getDate() + 1)) n.push(ea(r));
	return n;
}
function ba(e, t = /* @__PURE__ */ new Date()) {
	if (e.days !== 1 || !e.hour_model) return {
		keys: ya(e.since, t),
		unit: "day",
		heading: "Day",
		short: ta,
		long: na,
		keyOf: (e) => e.day ?? ""
	};
	let n = e.since === ea(t) ? t.getHours() : 23, r = [];
	for (let t = 0; t <= n; t += 1) r.push(`${e.since}T${String(t).padStart(2, "0")}`);
	return {
		keys: r,
		unit: "hour",
		heading: "Hour",
		short: ia,
		long: aa,
		keyOf: (e) => e.hour ?? ""
	};
}
var xa = {
	cost: 0,
	input: 0,
	output: 0
};
function Sa(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			cost: 0,
			input: 0,
			output: 0
		};
		i.cost += r.cost || 0, i.input += la(r), i.output += r.output, n.set(e, i);
	}
	return n;
}
function Ca(e, t, n) {
	let r = Ei([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${Ai(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: Ri(e, a.effort),
			hatch: zi(e, a.effort),
			turn: Bi(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : Oi(e);
	return [...i.values()].sort((e, t) => (e.slot ?? 8) - (t.slot ?? 8) || e.model.localeCompare(t.model) || a(e.effort) - a(t.effort) || String(e.effort).localeCompare(String(t.effort)));
}
function wa(e) {
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
function Ta(e, t) {
	return t.map((t) => e.reduce((e, n) => e + (n.values.get(t) ?? 0), 0));
}
function Ea(e, t, n, r = 2, i = 4) {
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
var Da = "rate_limit", Oa = {
	five_hour: "5-hour limit",
	seven_day: "weekly limit",
	seven_day_opus: "weekly Opus limit"
};
function ka(e) {
	return e ? Object.hasOwn(Oa, e) ? Oa[e] ?? e : e.replaceAll("_", " ") : "–";
}
function Aa(e) {
	let t = e.status ? ` (${e.status})` : "";
	return e.error === "rate_limit" ? `⚠ Rate limit${t}` : `${e.error.replaceAll("_", " ")}${t}`;
}
function ja(e, t) {
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
function Ma(e) {
	return Date.parse(e.first_hit) - Date.parse(e.start);
}
function Na(e, t) {
	let n = new Date(e.start), r = new Date(e.resets_at), i = n.toDateString() === r.toDateString() ? r.toLocaleTimeString(t, {
		hour: "2-digit",
		minute: "2-digit"
	}) : oa(e.resets_at, t);
	return `${oa(e.start, t)} – ${i}`;
}
function Pa(e) {
	let t = e.cost_parts.cache_read;
	return {
		cacheRead: t,
		rest: Math.max(0, (e.cost || 0) - t)
	};
}
function Fa(e) {
	return Math.max(0, ...e.map((e) => e.cost || 0)) || 1;
}
function Ia(e, t) {
	return 100 * (e || 0) / t;
}
//#endregion
//#region src/lib/payload.svelte.ts
var La = /* @__PURE__ */ t({
	Payload: () => Ra,
	payload: () => za,
	setPayload: () => Ba
}), Ra = class {
	#e = /* @__PURE__ */ M(null);
	#t = /* @__PURE__ */ M(!1);
	get summary() {
		return K(this.#e);
	}
	get summaryFailed() {
		return K(this.#t);
	}
	set(e) {
		e.summary !== void 0 && (N(this.#e, e.summary), N(this.#t, !1)), e.summaryFailed !== void 0 && N(this.#t, e.summaryFailed, !0);
	}
	reset() {
		N(this.#e, null), N(this.#t, !1);
	}
}, za = new Ra();
function Ba(e) {
	za.set(e), Tt();
}
//#endregion
//#region src/lib/tables.ts
var Va = /* @__PURE__ */ t({
	DEFAULT_PAGE_SIZE: () => 25,
	PAGE_SIZES: () => Ha,
	TOOL_KINDS: () => Xa,
	chatRows: () => lo,
	detailNoun: () => no,
	emptyDetail: () => $a,
	entryKey: () => co,
	kindLabel: () => Qa,
	orderedEntries: () => so,
	pageSizeFrom: () => Ka,
	pageText: () => Ga,
	pageUnits: () => Ua,
	pageWindow: () => Wa,
	sessionCount: () => Ya,
	sessionMatches: () => qa,
	sessionProjects: () => Ja,
	toolFolds: () => ao,
	toolRowClass: () => ro,
	toolRowName: () => io,
	toolRowShown: () => oo,
	toolTableRows: () => Za,
	toolsAndChat: () => uo
}), Ha = [
	10,
	25,
	50
];
function Ua(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function Wa(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function Ga(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function Ka(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function qa(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function Ja(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
function Ya(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var Xa = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function Za(e) {
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
function Qa(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function $a(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var eo = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, to = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function no(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn(to, e.tool) && to[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(eo, n) && eo[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function ro(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function io(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: Qa(e, Xa)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || $a(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function ao(e) {
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
			label: `${$(a)} ${no(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function oo(e, t) {
	return e.every((e) => t.has(e));
}
function so(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function co(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function lo(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return so(e, t).map((e) => ({
		key: co(e, n.get(e) ?? 0),
		entry: e
	}));
}
function uo(e, t, n) {
	return e ? [n, t] : [t, n];
}
//#endregion
//#region src/lib/themes.ts
var fo = /* @__PURE__ */ t({
	THEMES: () => po,
	themeFooter: () => yo,
	themeLabel: () => vo,
	themeName: () => go
}), po = [
	"light",
	"dark",
	"hacker",
	"startup",
	"rgb"
], mo = { techbro: "rgb" }, ho = {
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
function go(e) {
	if (e == null) return null;
	let t = (Object.hasOwn(mo, e) ? mo[e] : e) ?? e;
	return po.includes(t) ? t : null;
}
function _o(e) {
	return e !== null && Object.hasOwn(ho, e) ? ho[e] ?? {} : {};
}
function vo(e, t) {
	let n = _o(e);
	return Object.hasOwn(n, t) ? n[t] ?? t : t;
}
function yo(e) {
	return _o(e).footer ?? "";
}
//#endregion
//#region src/lib/prefs.svelte.ts
var bo = /* @__PURE__ */ t({
	Preferences: () => wo,
	footerCopy: () => Do,
	hype: () => Eo,
	preferences: () => To,
	readPreference: () => xo,
	savePreference: () => So,
	savedOption: () => Co
});
function xo(e) {
	try {
		return localStorage.getItem(`claude-usage.${e}`);
	} catch {
		return null;
	}
}
function So(e, t) {
	try {
		localStorage.setItem(`claude-usage.${e}`, String(t));
	} catch {}
}
function Co(e, t) {
	let n = xo(e);
	return n !== null && t.includes(n) ? n : null;
}
var wo = class {
	#e = /* @__PURE__ */ M(Ut(go(xo("theme"))));
	#t = /* @__PURE__ */ M(Ut(Ka(xo("page_size"), Ha, 25)));
	#n = /* @__PURE__ */ M(xo("chat-oldest-first") === "true");
	get theme() {
		return K(this.#e);
	}
	set theme(e) {
		let t = go(e);
		N(this.#e, t, !0), So("theme", t ?? "auto");
	}
	get pageSize() {
		return K(this.#t);
	}
	set pageSize(e) {
		Ha.includes(e) && (N(this.#t, e, !0), So("page_size", String(e)));
	}
	get oldestFirst() {
		return K(this.#n);
	}
	set oldestFirst(e) {
		N(this.#n, e, !0), So("chat-oldest-first", String(e));
	}
}, To = new wo();
function Eo(e) {
	return vo(To.theme, e);
}
function Do() {
	return yo(To.theme);
}
//#endregion
//#region src/lib/trend.ts
var Oo = [
	{
		label: "Estimated cost",
		slot: 0,
		value: (e) => e.cost,
		format: Xi
	},
	{
		label: "Input tokens",
		slot: 1,
		value: (e) => e.input,
		format: Q
	},
	{
		label: "Output tokens",
		slot: 2,
		value: (e) => e.output,
		format: Q
	}
];
function ko(e) {
	let t = e * 116 + 22;
	return {
		top: t,
		bottom: t + 76
	};
}
function Ao() {
	return ko(Oo.length - 1).bottom + 28;
}
function jo(e, t = /* @__PURE__ */ new Date()) {
	let n = ba(e, t), r = Sa(n.unit === "hour" ? e.hour_model : e.day_model, n.keyOf);
	return {
		buckets: n,
		totals: n.keys.map((e) => r.get(e) ?? xa)
	};
}
function Mo(e, t) {
	return e.totals.map((e) => t.value(e));
}
function No(e) {
	return `estimated cost, input and output tokens per ${e}`;
}
function Po(e) {
	return `Estimated cost, input tokens and output tokens per ${e}; table view available`;
}
function Fo(e) {
	return `Estimated cost, input and output tokens per ${e}; arrow keys step through them`;
}
function Io(e, t) {
	let n = e.totals[t] ?? xa, r = Oo.map((e) => `${e.label} ${e.format(e.value(n))}`).join(", ");
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${r}`;
}
function Lo(e) {
	let t = e.buckets.keys.map((t, n) => ({
		key: t,
		cells: [e.buckets.short(t), ...Oo.map((t) => t.format(t.value(e.totals[n] ?? xa)))]
	})).reverse();
	return {
		head: [e.buckets.heading, ...Oo.map((e) => e.label)],
		rows: t
	};
}
//#endregion
//#region src/components/AreaLine.svelte
var Ro = /* @__PURE__ */ q([["path", { "fill-opacity": "0.1" }], ["path", {
	fill: "none",
	"stroke-width": "2",
	"stroke-linejoin": "round",
	"stroke-linecap": "round"
}]], 5);
function zo(e, t) {
	D(t, !0);
	let n = /* @__PURE__ */ A(() => t.values.map((e, n) => `${t.xOf(n).toFixed(1)},${t.yOf(e).toFixed(1)}`).join("L")), r = /* @__PURE__ */ A(() => `M${t.xOf(0)},${t.bottom}L${K(n)}L${t.xOf(t.values.length - 1)},${t.bottom}Z`);
	var i = gr(), a = I(i), o = (e) => {
		var i = Ro(), a = I(i), o = R(a);
		z(() => {
			Z(a, "d", K(r)), Z(a, "fill", t.color), Z(o, "d", `M${K(n) ?? ""}`), Z(o, "stroke", t.color);
		}), J(e, i);
	};
	X(a, (e) => {
		t.values.length && e(o);
	}), J(e, i), O();
}
//#endregion
//#region src/components/ChartTooltip.svelte
var Bo = /* @__PURE__ */ q([[
	"div",
	{ class: "tooltip" },
	,
]]);
function Vo(e, t) {
	D(t, !0);
	let n = pi(t, "top", 3, 8);
	function r(e) {
		let r = e.parentElement?.clientWidth ?? 0;
		e.style.left = `${xi(t.anchor, e.offsetWidth, r)}px`, e.style.top = `${n()}px`;
	}
	var i = Bo();
	kr(F(i), () => t.children), E(i), zr(i, () => r), J(e, i), O();
}
//#endregion
//#region src/components/Chart.svelte
var Ho = /* @__PURE__ */ q([["rect", {
	class: "hit",
	tabindex: "0",
	role: "slider",
	"aria-valuemin": "1"
}]], 4), Uo = /* @__PURE__ */ q([[
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
function Wo(e, t) {
	D(t, !0);
	let n = /* @__PURE__ */ A(() => (t.cursor?.count ?? 0) - 1), r = /* @__PURE__ */ M(null), i = /* @__PURE__ */ A(() => K(r) === null ? K(n) : Math.min(K(r), K(n))), a = /* @__PURE__ */ M(null), o = /* @__PURE__ */ A(() => K(a) === null || K(n) < 0 ? null : Math.min(K(a), K(n))), s = /* @__PURE__ */ A(() => t.cursor?.area(t.width));
	function c(e) {
		N(r, Math.min(Math.max(0, e), K(n)), !0), N(a, K(r), !0);
	}
	function l(e) {
		let n = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
		t.cursor && n && c(t.cursor.indexAt(t.width)(yi(e.clientX, n.left, n.width, t.width)));
	}
	function u(e) {
		if (!t.cursor) return;
		let n = bi(e.key, K(i), t.cursor.count);
		n !== null && (c(n), e.preventDefault());
	}
	var d = Uo(), f = I(d), p = F(f), m = F(p);
	kr(m, () => t.plot, () => t.width);
	var h = R(m), g = (e) => {
		var n = gr();
		kr(I(n), () => t.marks ?? v, () => t.width, () => K(o)), J(e, n);
	};
	X(h, (e) => {
		K(o) !== null && e(g);
	}), E(p);
	var _ = R(p), y = (e) => {
		var n = Ho();
		z((e, r) => {
			Z(n, "x", K(s).x), Z(n, "y", K(s).y), Z(n, "width", e), Z(n, "height", K(s).height), Z(n, "aria-label", t.cursor.label), Z(n, "aria-valuemax", t.cursor.count), Z(n, "aria-valuenow", K(i) + 1), Z(n, "aria-valuetext", r);
		}, [() => Math.max(1, K(s).width), () => t.cursor.valueText(K(i))]), sr("pointermove", n, l), or("focus", n, () => c(K(i))), sr("keydown", n, u), or("pointerleave", n, () => N(a, null)), or("blur", n, () => N(a, null)), J(e, n);
	};
	X(_, (e) => {
		t.cursor && K(s) && K(n) >= 0 && e(y);
	}), E(f);
	var ee = R(f), b = (e) => {
		{
			let n = /* @__PURE__ */ A(() => t.cursor.tipX(t.width, K(o)) * vi(t.containerWidth, t.width));
			Vo(e, {
				get anchor() {
					return K(n);
				},
				get top() {
					return t.tipTop;
				},
				children: (e, n) => {
					var r = gr();
					kr(I(r), () => t.tip, () => K(o)), J(e, r);
				},
				$$slots: { default: !0 }
			});
		}
	};
	X(ee, (e) => {
		t.cursor && K(o) !== null && t.tip && e(b);
	}), z(() => {
		Z(f, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), Z(f, "height", t.height), Z(p, "aria-label", t.label);
	}), J(e, d), O();
}
cr(["pointermove", "keydown"]);
//#endregion
//#region src/components/ChartCard.svelte
var Go = /* @__PURE__ */ q([[
	"span",
	{ class: "muted" },
	" "
]]), Ko = /* @__PURE__ */ q([[
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
function qo(e, t) {
	let n = /* @__PURE__ */ M(!1);
	var r = Ko(), i = F(r), a = F(i), o = L(a, !0), s = R(a, 2), c = (e) => {
		var n = Go(), r = L(n, !0);
		z(() => Y(r, t.note)), J(e, n);
	};
	X(s, (e) => {
		t.note && e(c);
	});
	var l = R(s, 2);
	kr(l, () => t.controls ?? v);
	var u = R(l, 4);
	E(i);
	var d = R(i, 2);
	kr(d, () => t.legend ?? v);
	var f = R(d, 2);
	kr(f, () => t.chart);
	var p = R(f, 2), m = (e) => {
		var n = gr();
		kr(I(n), () => t.table), J(e, n);
	};
	X(p, (e) => {
		K(n) && e(m);
	}), kr(R(p, 2), () => t.extra ?? v), E(r), z(() => {
		Z(r, "aria-labelledby", `${t.id ?? ""}-title`), Z(a, "id", `${t.id ?? ""}-title`), Y(o, t.title), Z(u, "id", `${t.id ?? ""}-table-toggle`), Z(u, "aria-pressed", K(n));
	}), sr("click", u, () => N(n, !K(n))), J(e, r);
}
cr(["click"]);
//#endregion
//#region src/components/PointDot.svelte
var Jo = /* @__PURE__ */ q([["circle", {
	r: "4",
	stroke: "var(--surface)",
	"stroke-width": "2"
}]], 4);
function Yo(e, t) {
	var n = Jo();
	z(() => {
		Z(n, "cx", t.x), Z(n, "cy", t.y), Z(n, "fill", t.color);
	}), J(e, n);
}
//#endregion
//#region node_modules/svelte/src/reactivity/map.js
var Xo = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ M(0);
	#n = /* @__PURE__ */ M(0);
	#r = Un || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return Un === this.#r ? /* @__PURE__ */ M(e) : Ft(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return K(this.#t), !1;
		}
		return K(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				K(this.#t);
				return;
			}
		}
		return K(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), N(this.#n, super.size), Vt(o);
		else if (i !== t) {
			Vt(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && Vt(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), N(n, -1)), r && (N(this.#n, super.size), Vt(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			N(this.#n, 0);
			for (var t of e.values()) N(t, -1);
			Vt(this.#t), e.clear();
		}
	}
	#a() {
		K(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) K(n);
	}
	keys() {
		return K(this.#t), super.keys();
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
		return K(this.#n), super.size;
	}
}, Zo = /* @__PURE__ */ t({
	keepScroll: () => $o,
	scrollAnchor: () => Qo
});
function Qo(e) {
	for (let t of e) {
		let e = t.getBoundingClientRect();
		if (e.bottom > 0) return {
			node: t,
			top: e.top
		};
	}
	return null;
}
function $o(e, t) {
	e && t && t.isConnected && window.scrollBy(0, t.getBoundingClientRect().top - e.top);
}
//#endregion
//#region src/components/Pager.svelte
var es = /* @__PURE__ */ q([[
	"option",
	null,
	" "
]]), ts = /* @__PURE__ */ q([[
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
function ns(e, t) {
	D(t, !0);
	let n = /* @__PURE__ */ A(() => (t.units.at(-1) ?? -1) + 1), r = /* @__PURE__ */ A(() => os(t.key, K(n))), i = /* @__PURE__ */ A(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function a() {
		as.first(t.key) !== K(r).first && as.set(t.key, K(r).first);
	}
	a();
	function o(e, r) {
		let i = e.closest(".pager"), a = Qo(i ? [i] : []);
		as.set(t.key, Wa(K(n), To.pageSize, r).first), Tt(), $o(a, i);
	}
	function s(e, t) {
		let n = e.closest(".pager"), r = Qo(n ? [n] : []);
		To.pageSize = t, Tt(), $o(r, n);
	}
	function c() {
		let { first: e, last: n } = K(r);
		t.rows?.forEach((r, i) => {
			let a = t.units[i];
			a !== void 0 && r.classList.toggle("off-page", a < e || a >= n);
		});
	}
	var l = ts(), u = F(l);
	Nr(u, 20, () => Ha, (e) => e, (e, n) => {
		var r = es(), i = L(r), a = {};
		z(() => {
			Y(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), J(e, r);
	}), E(u);
	var d;
	ei(u);
	var f = R(u, 2), p = R(f, 2), m = L(p, !0), h = R(p, 2);
	E(l), zr(l, () => c), z((e) => {
		Z(u, "id", `pager-${t.key ?? ""}-size`), Z(u, "aria-label", `${K(i) ?? ""} per page`), d !== (d = To.pageSize) && (u.value = (u.__value = d) ?? "", $r(u, d)), Z(f, "id", `pager-${t.key ?? ""}-previous`), f.disabled = K(r).page === 0, Y(m, e), Z(h, "id", `pager-${t.key ?? ""}-next`), h.disabled = K(r).page === K(r).pages - 1;
	}, [() => Ga(K(r), K(n), t.noun)]), sr("change", u, (e) => s(e.currentTarget, Number(e.currentTarget.value))), sr("click", f, (e) => o(e.currentTarget, K(r).page - 1)), sr("click", h, (e) => o(e.currentTarget, K(r).page + 1)), J(e, l), O();
}
cr(["change", "click"]);
//#endregion
//#region src/lib/paging.svelte.ts
var rs = /* @__PURE__ */ t({
	TablePages: () => is,
	mountPager: () => cs,
	releaseDetachedPagers: () => ls,
	shownWindow: () => os,
	tablePages: () => as
}), is = class {
	#e = new Xo();
	first(e) {
		return this.#e.get(e) ?? 0;
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	forget(e) {
		this.#e.delete(e);
	}
}, as = new is();
function os(e, t) {
	return Wa(t, To.pageSize, Math.floor(as.first(e) / To.pageSize));
}
var ss = /* @__PURE__ */ new Set();
function cs(e) {
	let t = document.createElement("div"), n = Cr(ns, {
		target: t,
		props: e
	});
	Tt();
	let r = t.firstElementChild;
	if (!(r instanceof HTMLElement)) throw Error("The pager drew no element");
	return ss.add({
		component: n,
		root: r
	}), r;
}
function ls() {
	for (let e of [...ss]) e.root.isConnected || (ss.delete(e), Dr(e.component));
}
//#endregion
//#region src/components/TableView.svelte
var us = /* @__PURE__ */ q([[
	"th",
	null,
	" "
]]), ds = /* @__PURE__ */ q([[
	"tr",
	null,
	,
]]), fs = /* @__PURE__ */ q([[
	"div",
	{ class: "table-wrap" },
	,
	" ",
	[
		"table",
		null,
		[
			"thead",
			null,
			["tr"]
		],
		["tbody"]
	]
]]);
function ps(e, t) {
	D(t, !0);
	let n = pi(t, "noun", 3, "rows"), r = /* @__PURE__ */ A(() => Ua(t.rows.map((e) => t.sub?.(e) ?? !1))), i = /* @__PURE__ */ A(() => (K(r).at(-1) ?? -1) + 1), a = /* @__PURE__ */ A(() => os(t.key, K(i))), o = /* @__PURE__ */ A(() => t.rows.filter((e, t) => {
		let n = K(r)[t] ?? 0;
		return n >= K(a).first && n < K(a).last;
	}));
	var s = fs(), c = F(s), l = (e) => {
		ns(e, {
			get key() {
				return t.key;
			},
			get noun() {
				return n();
			},
			get units() {
				return K(r);
			}
		});
	};
	X(c, (e) => {
		K(i) > Ha[0] && e(l);
	});
	var u = R(c, 2), d = F(u), f = F(d);
	Nr(f, 21, () => t.columns, (e) => e.label, (e, t) => {
		var n = us(), r = L(n, !0);
		z(() => {
			Jr(n, 1, Hr(K(t).numeric ? "num" : void 0)), Y(r, K(t).label);
		}), J(e, n);
	}), E(f), E(d);
	var p = R(d);
	Nr(p, 21, () => K(o), (e) => t.rowKey(e), (e, n) => {
		var r = ds();
		kr(F(r), () => t.cells, () => K(n)), E(r), z((e) => Jr(r, 1, e), [() => Hr(t.sub?.(K(n)) ? "sub-row" : void 0)]), J(e, r);
	}), E(p), E(u), E(s), J(e, s), O();
}
//#endregion
//#region src/components/XLabels.svelte
var ms = /* @__PURE__ */ q([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4);
function hs(e, t) {
	D(t, !0);
	var n = gr();
	Nr(I(n), 16, () => Si(t.count, t.most), (e) => e, (e, n) => {
		var r = ms(), i = L(r, !0);
		z((e, n) => {
			Z(r, "x", e), Z(r, "y", t.y), Y(i, n);
		}, [() => t.xOf(n), () => t.text(n)]), J(e, r);
	}), J(e, n), O();
}
//#endregion
//#region src/components/YAxis.svelte
var gs = /* @__PURE__ */ q([["line", { "stroke-width": "1" }], [
	"text",
	{
		"text-anchor": "end",
		class: "axis-text"
	},
	" "
]], 5);
function _s(e, t) {
	D(t, !0);
	var n = gr();
	Nr(I(n), 18, () => t.values, (e) => e, (e, n, r) => {
		let i = /* @__PURE__ */ A(() => Ci(t.yOf(n)));
		var a = gs(), o = I(a), s = R(o), c = L(s, !0);
		z((e) => {
			Z(o, "x1", t.left), Z(o, "x2", t.right), Z(o, "y1", K(i)), Z(o, "y2", K(i)), Z(o, "stroke", K(r) === 0 ? "var(--axis)" : "var(--grid)"), Z(s, "x", t.left - 8), Z(s, "y", K(i) + 4), Y(c, e);
		}, [() => t.format(n)]), J(e, a);
	}), J(e, n), O();
}
//#endregion
//#region src/components/OverTime.svelte
var vs = (e, t = v) => {
	var n = Ds(), r = I(n), i = L(r, !0);
	Nr(R(r, 2), 19, () => Oo, (e) => e.label, (e, n, r) => {
		var i = Es(), a = L(i, !0);
		z(() => Y(a, t().cells[K(r) + 1])), J(e, i);
	}), z(() => Y(i, t().cells[0])), J(e, n);
}, ys = /* @__PURE__ */ q([
	,
	,
	[
		"text",
		{ class: "value-text" },
		" "
	]
], 5), bs = /* @__PURE__ */ q([
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
], 5), xs = /* @__PURE__ */ q([
	,
	,
	,
], 5), Ss = /* @__PURE__ */ q([["line", { class: "crosshair" }], ,], 5), Cs = /* @__PURE__ */ q([[
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
]]), ws = /* @__PURE__ */ q([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
], 1), Ts = /* @__PURE__ */ q([[
	"div",
	{ class: "chart" },
	,
]]), Es = /* @__PURE__ */ q([[
	"td",
	{ class: "num" },
	" "
]]), Ds = /* @__PURE__ */ q([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function Os(e, t) {
	D(t, !0);
	let n = (e) => {
		var t = Ts(), n = F(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ A(() => t() - 64), r = /* @__PURE__ */ A(() => pa(K(s).length, 56, K(n)));
				var a = xs(), o = I(a);
				Nr(o, 17, () => K(d), ({ panel: e, top: t, bottom: n, color: r, values: i, max: a, yOf: o }) => e.label, (e, t) => {
					let i = () => K(t).panel, a = () => K(t).top, o = () => K(t).bottom, s = () => K(t).color, c = () => K(t).values, l = () => K(t).max, u = () => K(t).yOf;
					var d = bs(), f = I(d), p = R(f), m = L(p, !0), h = R(p);
					{
						let e = /* @__PURE__ */ A(() => da(l(), 2));
						_s(h, {
							get left() {
								return 56;
							},
							get right() {
								return K(n);
							},
							get values() {
								return K(e);
							},
							get yOf() {
								return u();
							},
							get format() {
								return i().format;
							}
						});
					}
					var g = R(h);
					zo(g, {
						get values() {
							return c();
						},
						get xOf() {
							return K(r);
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
					var _ = R(g), v = (e) => {
						let t = /* @__PURE__ */ A(() => c().length - 1), n = /* @__PURE__ */ A(() => c()[K(t)] ?? 0);
						var a = ys(), o = I(a);
						{
							let e = /* @__PURE__ */ A(() => K(r)(K(t))), i = /* @__PURE__ */ A(() => u()(K(n)));
							Yo(o, {
								get x() {
									return K(e);
								},
								get y() {
									return K(i);
								},
								get color() {
									return s();
								}
							});
						}
						var l = R(o), d = L(l, !0);
						z((e, t, n) => {
							Z(l, "x", e), Z(l, "y", t), Y(d, n);
						}, [
							() => K(r)(K(t)) + 9,
							() => u()(K(n)) + 4,
							() => i().format(K(n))
						]), J(e, a);
					};
					X(_, (e) => {
						c().length && e(v);
					}), z(() => {
						Z(f, "x1", 56), Z(f, "x2", 70), Z(f, "y1", a() - 10), Z(f, "y2", a() - 10), Z(f, "stroke", s()), Z(p, "x", 76), Z(p, "y", a() - 6), Y(m, i().label);
					}), J(e, d);
				});
				var c = R(o);
				{
					let e = /* @__PURE__ */ A(() => u + 18);
					hs(c, {
						get count() {
							return K(s).length;
						},
						get xOf() {
							return K(r);
						},
						get y() {
							return K(e);
						},
						text: (e) => K(i).short(K(s)[e] ?? "")
					});
				}
				J(e, a);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ A(() => pa(K(s).length, 56, t() - 64));
				var i = Ss(), a = I(i);
				Nr(R(a), 17, () => K(d), ({ panel: e, color: t, values: n, yOf: r }) => e.label, (e, t) => {
					let i = () => K(t).color, a = () => K(t).values, o = () => K(t).yOf;
					{
						let t = /* @__PURE__ */ A(() => K(r)(n())), s = /* @__PURE__ */ A(() => o()(a()[n()] ?? 0));
						Yo(e, {
							get x() {
								return K(t);
							},
							get y() {
								return K(s);
							},
							get color() {
								return i();
							}
						});
					}
				}), z((e, t) => {
					Z(a, "x1", e), Z(a, "x2", t), Z(a, "y1", 18), Z(a, "y2", u);
				}, [() => K(r)(n()), () => K(r)(n())]), J(e, i);
			}, r = (e, t = v) => {
				var n = ws(), r = I(n), a = L(r, !0);
				Nr(R(r, 2), 17, () => K(d), ({ panel: e, color: t, values: n }) => e.label, (e, n) => {
					let r = () => K(n).panel, i = () => K(n).color, a = () => K(n).values;
					var o = Cs(), s = F(o);
					let c;
					var l = R(s, 2), u = L(l, !0), d = L(R(l, 2), !0);
					E(o), z((e) => {
						c = Xr(s, "", c, { background: i() }), Y(u, e), Y(d, r().label);
					}, [() => r().format(a()[t()] ?? 0)]), J(e, o);
				}), z((e) => Y(a, e), [() => K(i).long(K(s)[t()] ?? "")]), J(e, n);
			}, i = /* @__PURE__ */ A(() => K(a).buckets), s = /* @__PURE__ */ A(() => K(i).keys);
			{
				let i = /* @__PURE__ */ A(Ao), a = /* @__PURE__ */ A(() => Po(K(o)));
				Wo(e, {
					get height() {
						return K(i);
					},
					get label() {
						return K(a);
					},
					get width() {
						return K(l);
					},
					get containerWidth() {
						return K(c);
					},
					get cursor() {
						return K(f);
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
		X(n, (e) => {
			K(a) && e(r);
		}), E(t), ui(t, "clientWidth", (e) => N(c, e)), J(e, t);
	}, r = (e) => {
		var t = gr(), n = I(t), r = (e) => {
			let t = /* @__PURE__ */ A(() => {
				let [e = "", ...t] = K(s).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let n = /* @__PURE__ */ A(() => [{ label: K(t).first }, ...K(t).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				ps(e, {
					key: "trend-table",
					get columns() {
						return K(n);
					},
					get rows() {
						return K(s).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return vs;
					}
				});
			}
		};
		X(n, (e) => {
			K(s) && e(r);
		}), J(e, t);
	}, i = /* @__PURE__ */ A(() => za.summary), a = /* @__PURE__ */ A(() => K(i) ? jo(K(i)) : null), o = /* @__PURE__ */ A(() => K(a)?.buckets.unit ?? "day"), s = /* @__PURE__ */ A(() => K(a) ? Lo(K(a)) : null), c = /* @__PURE__ */ M(0), l = /* @__PURE__ */ A(() => _i(K(c))), u = ko(Oo.length - 1).bottom, d = /* @__PURE__ */ A(() => K(a) ? Oo.map((e, t) => {
		let { top: n, bottom: r } = ko(t), i = Mo(K(a), e), o = ua(Math.max(...i, 0));
		return {
			panel: e,
			top: n,
			bottom: r,
			color: Ii(e.slot),
			values: i,
			max: o,
			yOf: (e) => r - 76 * e / o
		};
	}) : []), f = /* @__PURE__ */ A(() => K(a) ? {
		count: K(a).buckets.keys.length,
		label: Fo(K(o)),
		valueText: (e) => Io(K(a), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: u
		}),
		indexAt: (e) => ma(56, e - 64, K(a).buckets.keys.length),
		tipX: (e, t) => pa(K(a).buckets.keys.length, 56, e - 64)(t)
	} : null);
	{
		let t = /* @__PURE__ */ A(() => Eo("Over time")), i = /* @__PURE__ */ A(() => No(K(o)));
		qo(e, {
			id: "trend",
			get title() {
				return K(t);
			},
			get note() {
				return K(i);
			},
			get chart() {
				return n;
			},
			get table() {
				return r;
			}
		});
	}
	O();
}
//#endregion
//#region src/lib/tiles.ts
function ks(e, t = ea(/* @__PURE__ */ new Date()), n) {
	let r = e.history_since, i = r && r > e.since ? ` (history since ${ta(r, n)})` : "";
	return e.days === 1 ? e.until === t ? "today" : na(e.until, n) : `last ${e.days} days${i}`;
}
function As(e) {
	let t = [e.unpriced_turns ? `${$(e.unpriced_turns)} turns of models without a price are not included` : "at API list prices"];
	return e.web_searches && t.push(`incl. ${$(e.web_searches)} web searches, ${Xi(e.cost_parts.web_search)}`), t.join(" · ");
}
var js = "Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.";
function Ms(e) {
	let t = e.compactions === 1 ? "1 compaction" : `${$(e.compactions)} compactions`, n = e.unknown ? `${$(e.unknown)} without an estimate` : null;
	if (!e.compactions) return {
		title: js,
		verdict: null,
		amount: null,
		count: `Compacting: ${n}`
	};
	let r = e.net >= 0;
	return {
		title: js,
		verdict: r ? "gain" : "loss",
		amount: r ? `▲ compacting saved ~${Xi(e.net)} so far` : `▼ compacting cost ~${Xi(-e.net)} more so far`,
		count: `(${[t, n].filter(Boolean).join(", ")})`
	};
}
function Ns(e) {
	let t = e.cost_parts;
	return [{
		label: "Processed",
		tokens: e.new_input + e.cache_write,
		cost: t.new_input + t.cache_write,
		color: "var(--split-strong)",
		note: `New input ${Q(e.new_input)} + cache writes ${Q(e.cache_write)}, billed at full price or more`
	}, {
		label: "From cache",
		tokens: e.cache_read,
		cost: t.cache_read,
		color: "var(--split-soft)",
		note: "Cache reads, billed at a tenth of the input price and not processed again"
	}];
}
function Ps(e, t) {
	let n = la(t);
	return e.map((e) => `${e.label} ${Zi(e.tokens, n)}`).join(", ");
}
function Fs(e, t) {
	return e?.turns ? `median context ${Q(e.median)} per turn (p90 ${Q(e.p90)})` + (t ? ` · compact hint at ${Q(t)}` : "") : null;
}
function Is(e, t, n, r) {
	let i = e.api_ms_without_retries === null ? null : e.api_ms - e.api_ms_without_retries, a = "no time lost to retries";
	return i === null ? a = "retries are not in the transcripts" : i > 0 && (a = `${Qi(i)} of it retries`), {
		session: `wall-clock, ${t}`,
		api: a,
		tools: r ? "from each call to its result, incl. waiting for permission" : `${Zi(e.tool_ms, e.duration_ms)} of the session time`,
		lines: n === null ? "no lines changed" : `${Xi(n)} per 100 lines changed`
	};
}
function Ls(e) {
	return `${$(e)} ${e === 1 ? "session" : "sessions"} that ended in the range`;
}
function Rs(e) {
	return e === "cost_record" ? "from its cost record" : "estimated from the transcripts";
}
function zs(e) {
	let t = e.runtime.lines_added + e.runtime.lines_removed;
	return e.cost === null || t === 0 ? null : e.cost / t * 100;
}
//#endregion
//#region src/components/Swatch.svelte
var Bs = /* @__PURE__ */ q([["span", { class: "swatch" }]]);
function Vs(e, t) {
	var n = Bs();
	let r;
	z(() => r = Xr(n, "", r, { background: t.fill })), J(e, n);
}
//#endregion
//#region src/components/InputSplit.svelte
var Hs = /* @__PURE__ */ q([["span"]]), Us = /* @__PURE__ */ q([[
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
]]), Ws = /* @__PURE__ */ q([[
	"div",
	{ class: "note" },
	" "
]]), Gs = /* @__PURE__ */ q([[
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
function Ks(e, t) {
	D(t, !0);
	let n = /* @__PURE__ */ A(() => la(t.totals)), r = /* @__PURE__ */ A(() => Ns(t.totals)), i = /* @__PURE__ */ A(() => Fs(t.context, t.hintTokens));
	var a = Gs(), o = F(a), s = L(o, !0), c = R(o, 2), l = L(c, !0), u = R(c, 2);
	Nr(u, 21, () => K(r).filter((e) => e.tokens > 0), (e) => e.label, (e, t) => {
		var n = Hs();
		let r;
		z(() => r = Xr(n, "", r, {
			"flex-grow": K(t).tokens,
			background: K(t).color
		})), J(e, n);
	}), E(u);
	var d = R(u, 2);
	Nr(d, 17, () => K(r), (e) => e.label, (e, t) => {
		var r = Us(), i = F(r);
		Vs(i, { get fill() {
			return K(t).color;
		} });
		var a = R(i, 2), o = L(a, !0), s = R(a, 2), c = L(s, !0), l = R(s, 2), u = L(l, !0), d = L(R(l, 2), !0);
		E(r), z((e, n, i, a) => {
			Z(r, "title", K(t).note), Y(o, e), Y(c, n), Y(u, i), Y(d, a);
		}, [
			() => Eo(K(t).label),
			() => Q(K(t).tokens),
			() => Zi(K(t).tokens, K(n)),
			() => Xi(K(t).cost)
		]), J(e, r);
	});
	var f = R(d, 2), p = (e) => {
		var t = Ws();
		Z(t, "title", "The context a main-thread turn reads: new input, cache writes and reads. The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens).");
		var n = L(t, !0);
		z(() => Y(n, K(i))), J(e, t);
	};
	X(f, (e) => {
		K(i) !== null && e(p);
	}), E(a), z((e, t, n) => {
		Y(s, e), Y(l, t), Z(u, "aria-label", n);
	}, [
		() => Eo("Input tokens"),
		() => Q(K(n)),
		() => Ps(K(r), t.totals)
	]), J(e, a), O();
}
//#endregion
//#region src/components/StatTile.svelte
var qs = /* @__PURE__ */ q([[
	"div",
	{ class: "note" },
	" "
]]), Js = /* @__PURE__ */ q([[
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
function Ys(e, t) {
	D(t, !0);
	let n = pi(t, "note", 3, null), r = pi(t, "themedNote", 3, !1);
	var i = Js(), a = F(i), o = L(a, !0), s = R(a, 2), c = L(s, !0), l = R(s, 2), u = (e) => {
		var t = qs(), i = L(t, !0);
		z((e) => Y(i, e), [() => r() ? Eo(n()) : n()]), J(e, t);
	};
	X(l, (e) => {
		n() && e(u);
	}), E(i), z((e) => {
		Y(o, e), Y(c, t.value);
	}, [() => Eo(t.label)]), J(e, i), O();
}
//#endregion
//#region src/components/KpiTiles.svelte
var Xs = /* @__PURE__ */ q([
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
], 1), Zs = /* @__PURE__ */ q([[
	"div",
	{ class: "note" },
	,
]]), Qs = /* @__PURE__ */ q([
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
function $s(e, t) {
	D(t, !0);
	let n = /* @__PURE__ */ A(() => t.savings ? Ms(t.savings) : null);
	var r = Qs(), i = I(r), a = F(i), o = F(a), s = L(o, !0), c = R(o);
	E(a);
	var l = R(a, 2), u = L(l, !0), d = R(l, 2), f = L(d, !0), p = R(d, 2), m = (e) => {
		var t = Zs(), r = F(t), i = (e) => {
			var t = Xs(), r = I(t), i = L(r, !0), a = L(R(r, 2), !0);
			z(() => {
				Jr(r, 1, Hr(K(n).verdict === "gain" ? "verdict-gain" : "verdict-loss")), Y(i, K(n).amount), Y(a, K(n).count);
			}), J(e, t);
		}, a = (e) => {
			var t = hr();
			z(() => Y(t, K(n).count)), J(e, t);
		};
		X(r, (e) => {
			K(n).verdict ? e(i) : e(a, -1);
		}), E(t), z(() => Z(t, "title", K(n).title)), J(e, t);
	};
	X(p, (e) => {
		K(n) && e(m);
	}), E(i);
	var h = R(i, 2);
	Ks(h, {
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
	var g = R(h, 2);
	{
		let e = /* @__PURE__ */ A(() => $(t.totals.turns));
		Ys(g, {
			label: "Turns",
			get value() {
				return K(e);
			},
			note: "API calls with usage",
			themedNote: !0
		});
	}
	var _ = R(g, 2);
	{
		let e = /* @__PURE__ */ A(() => Q(t.totals.output)), n = /* @__PURE__ */ A(() => Xi(t.totals.cost_parts.output));
		Ys(_, {
			label: "Output tokens",
			get value() {
				return K(e);
			},
			get note() {
				return K(n);
			}
		});
	}
	z((e, n, r) => {
		Y(s, e), Y(c, `, ${t.scope ?? ""}`), Y(u, n), Y(f, r);
	}, [
		() => Eo("Estimated cost"),
		() => Xi(t.totals.cost),
		() => As(t.totals)
	]), J(e, r), O();
}
//#endregion
//#region src/components/RuntimeTiles.svelte
var ec = /* @__PURE__ */ q([
	,
	,
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function tc(e, t) {
	D(t, !0);
	let n = /* @__PURE__ */ A(() => "source" in t.runtime && t.runtime.source === "transcripts"), r = /* @__PURE__ */ A(() => Is(t.runtime, t.from, t.costPer100Lines, K(n)));
	var i = ec(), a = I(i);
	{
		let e = /* @__PURE__ */ A(() => Qi(t.runtime.duration_ms));
		Ys(a, {
			label: "Session time",
			get value() {
				return K(e);
			},
			get note() {
				return K(r).session;
			}
		});
	}
	var o = R(a, 2);
	{
		let e = /* @__PURE__ */ A(() => Qi(t.runtime.api_ms));
		Ys(o, {
			label: "Waiting on the API",
			get value() {
				return K(e);
			},
			get note() {
				return K(r).api;
			}
		});
	}
	var s = R(o, 2);
	{
		let e = /* @__PURE__ */ A(() => Qi(t.runtime.tool_ms));
		Ys(s, {
			label: "Running tools",
			get value() {
				return K(e);
			},
			get note() {
				return K(r).tools;
			}
		});
	}
	var c = R(s, 2);
	{
		let e = /* @__PURE__ */ A(() => `+${$(t.runtime.lines_added)} / −${$(t.runtime.lines_removed)}`);
		Ys(c, {
			label: "Lines changed",
			get value() {
				return K(e);
			},
			get note() {
				return K(r).lines;
			}
		});
	}
	J(e, i), O();
}
//#endregion
//#region src/components/SummaryTiles.svelte
var nc = /* @__PURE__ */ q([[
	"div",
	{ class: "empty" },
	" "
]]);
function rc(e, t) {
	D(t, !0);
	let n = /* @__PURE__ */ A(() => za.summary);
	var r = gr(), i = I(r), a = (e) => {
		var r = gr(), i = I(r), a = (e) => {
			{
				let t = /* @__PURE__ */ A(() => ks(K(n)));
				$s(e, {
					get totals() {
						return K(n).totals;
					},
					get scope() {
						return K(t);
					},
					get context() {
						return K(n).context;
					},
					get hintTokens() {
						return K(n).compact_hint_tokens;
					},
					get savings() {
						return K(n).compaction_savings;
					}
				});
			}
		}, o = (e) => {
			{
				let t = /* @__PURE__ */ A(() => Ls(K(n).runtime.sessions));
				tc(e, {
					get runtime() {
						return K(n).runtime;
					},
					get from() {
						return K(t);
					},
					get costPer100Lines() {
						return K(n).runtime.cost_per_100_lines;
					}
				});
			}
		};
		X(i, (e) => {
			t.rows === "kpis" ? e(a) : e(o, -1);
		}), J(e, r);
	}, o = (e) => {
		var t = nc(), n = L(t, !0);
		z(() => Y(n, za.summaryFailed ? "Could not load the summary." : "Loading…")), J(e, t);
	};
	X(i, (e) => {
		K(n) ? e(a) : t.rows === "kpis" && e(o, 1);
	}), J(e, r), O();
}
//#endregion
//#region src/lib/banner.svelte.ts
var ic = class {
	#e = new Xo();
	#t = /* @__PURE__ */ A(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return K(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, ac = /* @__PURE__ */ t({
	PAYOFF_WORDS: () => oc,
	compactCallKind: () => dc,
	compactionTotal: () => mc,
	delegateCallShown: () => fc,
	payoffAhead: () => lc,
	payoffText: () => uc,
	payoffTone: () => cc,
	spread: () => sc,
	verdictTone: () => pc
}), oc = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function sc(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function cc(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function lc(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${$(t.pays_later_in)} replies`;
		return `${oc.later}: growing at its recent pace, the context reaches about ${Q(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = $(Math.round(t.calls_ahead));
	return `${oc[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function uc(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${Xi(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${$(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : $(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${$(e.breakeven_low)} replies)` : `would pay off after about ${$(e.breakeven_calls)} replies` + sc(r(e.breakeven_low), r(e.breakeven_high));
}
function dc(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function fc(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function pc(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function mc(e) {
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
var hc = /* @__PURE__ */ t({
	liveCompactBadge: () => vc,
	liveSecretBadge: () => _c,
	liveStateBadges: () => yc,
	liveWaitBadge: () => gc,
	sessionWaits: () => bc,
	waitChanged: () => xc
});
function gc(e) {
	if (!e) return null;
	let t = ` since ${oa(e.since)}`;
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
function _c(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${$(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${$(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function vc(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${Q(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = cc(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if (dc({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${Xi(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${$(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${oc[l]}: compacting now ${m}, ~${$(Math.round(f))} ahead on average.`);
}
function yc(e, t) {
	return [_c(e.secrets), vc(e.current, t)].filter((e) => e !== null);
}
function bc(e, t) {
	let n = gc(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : gc(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function xc(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/lib/overview.svelte.ts
var Sc = /* @__PURE__ */ t({
	mountSessionKpis: () => Dc,
	mountSessionRuntime: () => Oc,
	releaseDetachedTiles: () => wc
}), Cc = /* @__PURE__ */ new Set();
function wc() {
	for (let e of [...Cc]) e.holder.isConnected || (Cc.delete(e), Dr(e.component));
}
function Tc() {
	let e = document.createElement("div");
	return e.className = "kpis session-kpis", e;
}
function Ec(e, t) {
	return Tt(), Cc.add({
		component: e,
		holder: t
	}), queueMicrotask(wc), t;
}
function Dc(e) {
	let t = Tc();
	return Ec(Cr($s, {
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
function Oc(e) {
	let t = Tc();
	return t.setAttribute("role", "group"), t.setAttribute("aria-label", "Time and lines changed"), Ec(Cr(tc, {
		target: t,
		props: {
			runtime: e.runtime,
			from: Rs(e.runtime.source),
			costPer100Lines: zs(e)
		}
	}), t);
}
//#endregion
//#region src/lib/secrets.ts
var kc = /* @__PURE__ */ t({
	secretReach: () => Nc,
	secretTone: () => Ac,
	secretVia: () => jc
});
function Ac(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function jc(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var Mc = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function Nc(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(Mc, e.reach) ? Mc[e.reach] ?? "" : "no result yet";
}
//#endregion
//#region src/legacy.svelte.ts
var Pc = [
	Hi,
	wi,
	ac,
	kc,
	hc,
	Va,
	ca,
	fo,
	bo,
	rs,
	Zo,
	La,
	Sc
];
function Fc(e) {
	let t = new ic(), n = e.document.getElementById("error");
	if (!n?.parentElement) throw Error("The page has no #error placeholder for the banner");
	let r = ["kpis", "runtime"].map((t) => {
		let n = e.document.getElementById(t);
		if (!n) throw Error(`The page has no #${t} container for the tiles`);
		return {
			id: t,
			container: n
		};
	}), i = e.document.getElementById("trend-card");
	if (!i) throw Error("The page has no #trend-card container for the over-time section");
	let a = Cr(hi, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	n.remove();
	let o = r.map(({ id: e, container: t }) => Cr(rc, {
		target: t,
		props: { rows: e }
	})), s = Cr(Os, { target: i });
	return e.showError = (e, n) => {
		t.show(e, n), Tt();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...Pc), { stop() {
		Dr(a);
		for (let e of o) Dr(e);
		Dr(s), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of Pc.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
Fc(window);
//#endregion

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
var b = 1 << 24, x = 1024, S = 2048, te = 4096, ne = 8192, re = 16384, ie = 32768, ae = 1 << 25, oe = 65536, se = 1 << 19, ce = 1 << 20, le = 1 << 25, ue = 1 << 21, de = 1 << 22, fe = 1 << 23, pe = Symbol("$state"), me = Symbol("component"), he = Symbol("legacy props"), ge = Symbol(""), _e = Symbol("attributes"), ve = Symbol("class"), ye = Symbol("style"), be = Symbol("text"), xe = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Se = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function Ce() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function we(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Te() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ee() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var C = !1;
function De(e) {
	C = e;
}
var w;
function Oe(e) {
	if (e === null) throw we(), n;
	return w = e;
}
function ke() {
	return Oe(/* @__PURE__ */ $t(w));
}
function T(e) {
	if (C) {
		if (/* @__PURE__ */ $t(w) !== null) throw we(), n;
		w = e;
	}
}
function Ae(e = 1) {
	if (C) {
		for (var t = e, n = w; t--;) n = /* @__PURE__ */ $t(n);
		w = n;
	}
}
function je(e = !0) {
	for (var t = 0, n = w;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ $t(n);
		e && n.remove(), n = i;
	}
}
function Me(e) {
	if (!e || e.nodeType !== 8) throw we(), n;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ne(e) {
	return e === this.v;
}
function Pe(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Fe(e) {
	return !Pe(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Ie() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Le(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Re() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ze(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Be() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ve() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function He() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ue() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var We = null;
function Ge(e) {
	We = e;
}
function E(e, t = !1, n) {
	We = {
		p: We,
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
	var t = We, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) mn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, We = t.p, Ke(e);
}
function Ke(e = {}) {
	return d(e, me, { value: !0 }), e;
}
function qe() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Je = [];
function Ye() {
	var e = Je;
	Je = [], y(e);
}
function Xe(e) {
	if (Je.length === 0 && !yt) {
		var t = Je;
		queueMicrotask(() => {
			t === Je && Ye();
		});
	}
	Je.push(e);
}
function Ze() {
	for (; Je.length > 0;) Ye();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Qe = ~(S | te | x);
function O(e, t) {
	e.f = e.f & Qe | t;
}
function $e(e) {
	e.f & 512 || e.deps === null ? O(e, x) : O(e, te);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function et(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), O(e, x);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function tt(e) {
	var t = B, n = V;
	Ln(null), Rn(null);
	try {
		return e();
	} finally {
		Ln(t), Rn(n);
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function nt(e, t, n, r) {
	let i = qe() ? ot : lt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = rt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				ln(e, s);
			}
			it();
		}
	}
	var d = at();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ ct(e))).then(u).catch((e) => ln(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), it();
	}) : f();
}
function rt() {
	var e = V, t = B, n = We, r = A;
	return function(i = !0) {
		Rn(e), Ln(t), Ge(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function it(e = !0) {
	Rn(null), Ln(null), Ge(null), e && A?.deactivate();
}
function at() {
	var e = V, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ot(e) {
	var t = 2 | S;
	return V !== null && (V.f |= se), {
		ctx: We,
		deps: null,
		effects: null,
		equals: Ne,
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
var st = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ct(e, t, n) {
	let i = V;
	i === null && Ie();
	var a = void 0, o = It(r), s = !B, c = /* @__PURE__ */ new Set();
	return _n(() => {
		var t = V, n = ee();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== xe && n.reject(e);
			}).finally(it);
		} catch (e) {
			n.reject(e), it();
		}
		var r = A;
		if (s) {
			if (t.f & 32768) var l = at();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(st);
			else for (let e of c.values()) e.reject(st);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== st && (r.activate(), t ? (o.f |= fe, Bt(o, t)) : (o.f & 8388608 && (o.f ^= fe), Bt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), pn(() => {
		for (let e of c) e.reject(st);
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
	let t = /* @__PURE__ */ ot(e);
	return Bn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function lt(e) {
	let t = /* @__PURE__ */ ot(e);
	return t.equals = Fe, t;
}
function ut(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) z(t[n]);
	}
}
function dt(e) {
	var t, n = V, i = e.parent;
	if (!Pn && i !== null && e.v !== r && i.f & 24576) return Ce(), e.v;
	Rn(i);
	try {
		ut(e), t = Zn(e);
	} finally {
		Rn(n);
	}
	return t;
}
function ft(e) {
	var t = dt(e);
	if (!e.equals(t) && (e.wv = Jn(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), gt?.capture(e, t, !0)), e.deps === null))) {
		O(e, x);
		return;
	}
	Pn || (_t === null ? $e(e) : (fn() || A?.is_fork) && _t.set(e, t));
}
function pt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && tt(() => {
		t.ac.abort(xe), t.ac = null;
	}), t.fn !== null && (t.teardown = v), er(t, 0), Cn(t));
}
function mt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && tr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var ht = null, A = null, gt = null, _t = null, vt = null, yt = !1, bt = !1, xt = null, St = null, Ct = 0, wt = 1, Tt = class e {
	id = wt++;
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
		ht === null ? ht = this : (ht.#n = this, this.#t = ht), ht = this;
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
		for (var t = xt = [], n = [], r = St = []; this.#c.length > 0;) {
			Ct++ > 1e3 && (this.#S(), Dt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Mt(e), this.#h() || this.discard(), t;
			}
		}
		if (A = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (xt = null, St = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) jt(e, t);
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
		this.#r.clear(), gt = this, kt(n), kt(t), gt = null, this.#s?.resolve();
		var o = A;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (Pt.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= x;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= x : i & 4 ? t.push(r) : Yn(r) && (i & 16 && this.#d.add(r), tr(r));
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
		for (var t = 0; t < e.length; t += 1) et(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== r && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), _t?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, _t = null;
	}
	flush() {
		try {
			bt = !0, A = this, this.#_();
		} finally {
			Ct = 0, vt = null, xt = null, St = null, bt = !1, A = null, _t = null, Pt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(st);
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
		this.#m || (this.#m = !0, Xe(() => {
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
			!bt && !yt && Xe(() => {
				t.#e || t.flush();
			});
		}
		return A;
	}
	apply() {
		_t = null;
	}
	schedule(e) {
		if (vt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? ht = e : t.#t = e, this.linked = !1;
		}
	}
};
function Et(e) {
	var t = yt;
	yt = !0;
	try {
		var n;
		for (e && (A !== null && !A.is_fork && A.flush(), n = e());;) {
			if (Ze(), A === null) return n;
			A.flush();
		}
	} finally {
		yt = t;
	}
}
function Dt() {
	try {
		Re();
	} catch (e) {
		ln(e, vt);
	}
}
var Ot = null;
function kt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Yn(r) && (Ot = /* @__PURE__ */ new Set(), tr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && En(r), Ot?.size > 0)) {
				Pt.clear();
				for (let e of Ot) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ot.has(n) && (Ot.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || tr(n);
					}
				}
				Ot.clear();
			}
		}
		Ot = null;
	}
}
function At(e) {
	A.schedule(e);
}
function jt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), O(e, x);
		for (var n = e.first; n !== null;) jt(n, t), n = n.next;
	}
}
function Mt(e) {
	O(e, x);
	for (var t = e.first; t !== null;) Mt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Nt = /* @__PURE__ */ new Set(), Pt = /* @__PURE__ */ new Map(), Ft = !1;
function It(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ne,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function j(e, t) {
	let n = It(e, t);
	return Bn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Lt(e, t = !1, n = !0) {
	let r = It(e);
	return t || (r.equals = Fe), r;
}
function M(e, t, n = !1) {
	return B !== null && (!In || B.f & 131072) && qe() && B.f & 4325394 && (zn === null || !zn.has(e)) && He(), Bt(e, n ? Wt(t) : t, St);
}
var Rt = null, zt = 0;
function Bt(e, t, n = null) {
	if (!e.equals(t)) {
		Pn ? Pt.set(e, t) : Pt.has(e) || Pt.set(e, e.v);
		var r = Tt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && dt(t), _t === null && $e(t);
		}
		e.wv = Jn(), Rt = null, zt = 0, Ut(e, S, n), Rt = null, qe() && V !== null && V.f & 1024 && !(V.f & 96) && (Hn === null ? Un([e]) : Hn.push(e)), !r.is_fork && Nt.size > 0 && !Ft && Vt();
	}
	return t;
}
function Vt() {
	Ft = !1;
	for (let e of Nt) {
		e.f & 1024 && O(e, te);
		let t;
		try {
			t = Yn(e);
		} catch {
			t = !0;
		}
		t && tr(e);
	}
	Nt.clear();
}
function Ht(e) {
	M(e, e.v + 1);
}
function Ut(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = qe(), a = r.length;
		if (zt += a, zt > 1e5 && Rt === null && (Rt = /* @__PURE__ */ new Set()), Rt !== null) {
			if (Rt.has(e)) return;
			Rt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== V) {
				var l = (c & S) === 0;
				if (l && O(s, t), c & 131072) Nt.add(s);
				else if (c & 2) {
					var u = s;
					_t?.delete(u), Ut(u, te, n);
				} else if (l) {
					var d = s;
					c & 16 && Ot !== null && Ot.add(d), n === null ? At(d) : n.push(d);
				}
			}
		}
	}
}
function Wt(e) {
	if (typeof e != "object" || !e || pe in e || me in e) return e;
	let t = g(e);
	if (t !== m && t !== h) return e;
	var n = /* @__PURE__ */ new Map(), i = s(e), a = /* @__PURE__ */ j(0), o = null, c = Kn, l = (e) => {
		if (Kn === c) return e();
		var t = B, n = Kn;
		Ln(null), qn(c);
		var r = e();
		return Ln(t), qn(n), r;
	};
	return i && n.set("length", /* @__PURE__ */ j(e.length, o)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && Be();
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
					n.set(t, e), Ht(a);
				}
			} else M(i, r), Ht(a);
			return !0;
		},
		get(t, i, a) {
			if (i === pe) return e;
			var s = n.get(i), c = i in t;
			if (s === void 0 && (!c || f(t, i)?.writable) && (s = l(() => /* @__PURE__ */ j(Wt(c ? t[i] : r), o)), n.set(i, s)), s !== void 0) {
				var u = U(s);
				return u === r ? void 0 : u;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var i = Reflect.getOwnPropertyDescriptor(e, t), a = n.get(t);
			if (a !== void 0) {
				var o = U(a);
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
			return (i !== void 0 || V !== null && (!a || f(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ j(a ? Wt(e[t]) : r, o)), n.set(t, i)), U(i) === r) ? !1 : a;
		},
		set(e, t, s, c) {
			var u = n.get(t), d = t in e;
			if (i && t === "length") for (var p = s; p < u.v; p += 1) {
				var m = n.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ j(r, o)), n.set(p + "", m)) : M(m, r);
			}
			if (u === void 0) (!d || f(e, t)?.writable) && (u = l(() => /* @__PURE__ */ j(void 0, o)), M(u, Wt(s)), n.set(t, u));
			else {
				d = u.v !== r;
				var h = l(() => Wt(s));
				M(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, s), !d) {
				if (i && typeof t == "string") {
					var _ = n.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && M(_, v + 1);
				}
				Ht(a);
			}
			return !0;
		},
		ownKeys(e) {
			U(a);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== r;
			});
			for (var [i, o] of n) o.v !== r && !(i in e) && t.push(i);
			return t;
		},
		setPrototypeOf() {
			Ve();
		}
	});
}
function Gt(e) {
	try {
		if (typeof e == "object" && e && pe in e) return e[pe];
	} catch {}
	return e;
}
function Kt(e, t) {
	return Object.is(Gt(e), Gt(t));
}
var qt, Jt, Yt, Xt;
function Zt() {
	if (qt === void 0) {
		qt = window, Jt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Yt = f(t, "firstChild").get, Xt = f(t, "nextSibling").get, _(e) && (e[ve] = void 0, e[_e] = null, e[ye] = void 0, e.__e = void 0), _(n) && (n[be] = void 0);
	}
}
function N(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Qt(e) {
	return Yt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function $t(e) {
	return Xt.call(e);
}
function P(e, t) {
	if (!C) return /* @__PURE__ */ Qt(e);
	var n = /* @__PURE__ */ Qt(w);
	if (n === null) n = w.appendChild(N());
	else if (t && n.nodeType !== 3) {
		var r = N();
		return n?.before(r), Oe(r), r;
	}
	return t && sn(n), Oe(n), n;
}
function F(e, t = !1) {
	if (!C) {
		var n = /* @__PURE__ */ Qt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ $t(n) : n;
	}
	if (t) {
		if (w?.nodeType !== 3) {
			var r = N();
			return w?.before(r), Oe(r), r;
		}
		sn(w);
	}
	return w;
}
function I(e, t = !1) {
	if (!C) return /* @__PURE__ */ Qt(e);
	var n = P(e, t);
	return T(e), n;
}
function L(e, t = 1, n = !1) {
	let r = C ? w : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ $t(r);
	if (!C) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = N();
			return r === null ? i?.after(a) : r.before(a), Oe(a), a;
		}
		sn(r);
	}
	return Oe(r), r;
}
function en(e) {
	e.textContent = "";
}
function tn() {
	return !1;
}
function nn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function rn() {
	return document.createDocumentFragment();
}
function an(e = "") {
	return document.createComment(e);
}
function on(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function sn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function cn(e) {
	var t = V;
	if (t === null) return B.f |= fe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	ln(e, t);
}
function ln(e, t) {
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
function un(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function dn(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= ne);
	var r = {
		ctx: We,
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
	if (e & 4) xt === null ? Tt.ensure().schedule(r) : xt.push(r);
	else if (t !== null) {
		try {
			tr(r);
		} catch (e) {
			throw z(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= oe));
	}
	if (i !== null && (i.parent = n, n !== null && un(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function fn() {
	return B !== null && !In;
}
function pn(e) {
	let t = dn(8, null);
	return O(t, x), t.teardown = e, t;
}
function mn(e) {
	return dn(4 | ce, e);
}
function hn(e) {
	Tt.ensure();
	let t = dn(64 | se, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Dn(t, () => {
			z(t), n(void 0);
		}) : (z(t), n(void 0));
	});
}
function gn(e) {
	return dn(4, e);
}
function _n(e) {
	return dn(de | se, e);
}
function vn(e, t = 0) {
	return dn(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	nt(r, t, n, (t) => {
		dn(8, () => {
			e(...t.map(U));
		});
	});
}
function yn(e, t = 0) {
	return dn(16 | t, e);
}
function bn(e, t = 0) {
	return dn(b | t, e);
}
function xn(e) {
	return dn(32 | se, e);
}
function Sn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Pn, r = B;
		Fn(!0), Ln(null);
		try {
			t.call(null);
		} catch (t) {
			ln(t, e.parent);
		} finally {
			Fn(n), Ln(r);
		}
	}
}
function Cn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && tt(() => {
			e.abort(xe);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : z(n, t), n = r;
	}
}
function wn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || z(t), t = n;
	}
}
function z(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Tn(e.nodes.start, e.nodes.end), n = !0), e.f |= ae, Cn(e, t && !n), er(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Sn(e), e.f ^= ae, e.f |= re;
	var i = e.parent;
	i !== null && i.first !== null && En(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Tn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ $t(e);
		e.remove(), e = n;
	}
}
function En(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Dn(e, t, n = !0) {
	var r = [];
	e.f |= 256, On(e, r, !0);
	var i = () => {
		n && z(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function On(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ne;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				On(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function kn(e) {
	e.f &= -257, An(e, !0);
}
function An(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ne, e.f & 1024 || (O(e, S), Tt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			An(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function jn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ $t(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Mn = null, Nn = !1, Pn = !1;
function Fn(e) {
	Pn = e;
}
var B = null, In = !1;
function Ln(e) {
	B = e;
}
var V = null;
function Rn(e) {
	V = e;
}
var zn = null;
function Bn(e) {
	B !== null && (B.f & 2097152 || B.f & 2) && (zn ??= /* @__PURE__ */ new Set()).add(e);
}
var H = null, Vn = 0, Hn = null;
function Un(e) {
	Hn = e;
}
var Wn = 1, Gn = 0, Kn = Gn;
function qn(e) {
	Kn = e;
}
function Jn() {
	return ++Wn;
}
function Yn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Yn(a) && ft(a), a.wv > e.wv) return !0;
		}
		t & 512 && _t === null && O(e, x);
	}
	return !1;
}
function Xn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(zn !== null && zn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Xn(a, t, !1) : t === a && (n ? O(a, S) : a.f & 1024 && O(a, te), At(a));
	}
}
function Zn(e) {
	var t = H, n = Vn, r = Hn, i = B, a = zn, o = We, s = In, c = Kn, l = e.f;
	H = null, Vn = 0, Hn = null, B = l & 96 ? null : e, zn = null, Ge(e.ctx), In = !1, Kn = ++Gn, e.ac !== null && (tt(() => {
		e.ac.abort(xe);
	}), e.ac = null);
	try {
		e.f |= ue;
		var u = e.fn, d = u();
		e.f |= ie;
		var f = Qn(e);
		if (qe() && Hn !== null && !In && f !== null && !(e.f & 6146)) for (var p = 0; p < Hn.length; p++) Xn(Hn[p], e);
		if (i !== null && i !== e) {
			if (Gn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Gn;
			if (t !== null) for (let e of t) e.rv = Gn;
			Hn !== null && (r === null ? r = Hn : r.push(...Hn));
		}
		return e.f & 8388608 && (e.f ^= fe), d;
	} catch (t) {
		return Qn(e), cn(t);
	} finally {
		e.f ^= ue, H = t, Vn = n, Hn = r, B = i, zn = a, Ge(o), In = s, Kn = c;
	}
}
function Qn(e) {
	var t = e.deps, n = A?.is_fork;
	if (H !== null) {
		var r;
		if (n || er(e, Vn), t !== null && Vn > 0) for (t.length = Vn + H.length, r = 0; r < H.length; r++) t[Vn + r] = H[r];
		else e.deps = t = H;
		if (fn() && e.f & 512) for (r = Vn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Vn < t.length && (er(e, Vn), t.length = Vn);
	return t;
}
function $n(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var i = c.call(n, e);
		if (i !== -1) {
			var a = n.length - 1;
			a === 0 ? n = t.reactions = null : (n[i] = n[a], n.pop());
		}
	}
	if (n === null && t.f & 2 && (H === null || !l.call(H, t))) {
		var o = t;
		o.f & 512 && (o.f ^= 512), o.v !== r && $e(o), o.ac !== null && tt(() => {
			o.ac.abort(xe), o.ac = null, O(o, S);
		}), pt(o), er(o, 0);
	}
}
function er(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) $n(e, n[r]);
}
function tr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		O(e, x);
		var n = V, r = Nn;
		V = e, Nn = !(t & 96);
		try {
			t & 16777232 ? wn(e) : Cn(e), Sn(e);
			var i = Zn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Wn;
		} finally {
			Nn = r, V = n;
		}
	}
}
function U(e) {
	var t = !!(e.f & 2);
	if (Mn?.add(e), B !== null && !In && !(V !== null && V.f & 16384) && (zn === null || !zn.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < Gn && (e.rv = Gn, H === null && n !== null && n[Vn] === e ? Vn++ : H === null ? H = [e] : H.push(e));
		else {
			B.deps ??= [], l.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : l.call(r, B) || r.push(B);
		}
	}
	if (Pn && Pt.has(e)) return Pt.get(e);
	if (t) {
		var i = e;
		if (Pn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || rr(i)) && (a = dt(i)), Pt.set(i, a), a;
		}
		var o = !(i.f & 512) && !In && B !== null && (Nn || !!(B.f & 512)), s = (i.f & ie) === 0;
		Yn(i) && (o && (i.f |= 512), ft(i)), o && !s && (mt(i), nr(i));
	}
	if (_t?.has(e)) return _t.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function nr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (mt(t), nr(t));
}
function rr(e) {
	if (e.v === r) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Pt.has(t) || t.f & 2 && rr(t)) return !0;
	return !1;
}
function ir(e) {
	var t = In;
	try {
		return In = !0, e();
	} finally {
		In = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var ar = Symbol("events"), or = /* @__PURE__ */ new Set(), sr = /* @__PURE__ */ new Set();
function cr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || mr.call(t, e), !e.cancelBubble) return tt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Xe(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function lr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = cr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && pn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function ur(e, t, n) {
	(t[ar] ??= {})[e] = n;
}
function dr(e) {
	for (var t = 0; t < e.length; t++) or.add(e[t]);
	for (var n of sr) n(e);
}
var fr = null, pr = !1;
function mr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	fr = e, pr || (pr = !0, setTimeout(() => {
		pr = !1, fr = null;
	}));
	var o = 0, s = fr === e && e[ar];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[ar] = t;
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
		Ln(null), Rn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[ar]?.[r];
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
			e[ar] = t, delete e.currentTarget, Ln(u), Rn(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var hr = Se ? "template" : "TEMPLATE";
function gr(e, t) {
	var n = V;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function _r(e, t) {
	var n = rn();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(N(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(an(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = r, u = e === "svg" ? a : e === "math" ? o : t;
		var i = nn(e, u, c?.is);
		for (var s in c) on(i, s, c[s]);
		l.length > 0 && (i.nodeName === hr ? i.content : i).append(_r(l, i.nodeName === "foreignObject" ? void 0 : u)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function W(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (C) return gr(w, null), w;
		i === void 0 && (i = _r(e, t & 4 ? a : t & 8 ? o : void 0), n || (i = /* @__PURE__ */ Qt(i)));
		var s = r || Jt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ Qt(s), l = s.lastChild;
			gr(c, l);
		} else gr(s, s);
		return s;
	};
}
function vr(e = "") {
	if (!C) {
		var t = N(e + "");
		return gr(t, t), t;
	}
	var n = w;
	return n.nodeType === 3 ? sn(n) : (n.before(n = N()), Oe(n)), gr(n, n), n;
}
function G() {
	if (C) return gr(w, null), w;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = N();
	return e.append(t, n), gr(t, n), e;
}
function K(e, t) {
	if (C) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = w), ke();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var yr = ["touchstart", "touchmove"];
function br(e) {
	return yr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function xr(e) {
	let t = 0, n = It(0), r;
	return () => {
		fn() && (U(n), vn(() => (t === 0 && (r = ir(() => e(() => Ht(n)))), t += 1, () => {
			Xe(() => {
				--t, t === 0 && (r?.(), r = void 0, Ht(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Sr = oe | se;
function Cr(e, t, n, r) {
	new wr(e, t, n, r);
}
var wr = class {
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
	#h = xr(() => (this.#m = It(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = yn(() => {
			if (C) {
				let e = this.#t;
				ke();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Sr), C && (this.#e = w);
	}
	#g() {
		try {
			this.#a = xn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Xe(r), t && (this.#s = xn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Ee();
				return;
			}
			t = !0, n && Ue(), this.#s !== null && Dn(this.#s, () => {
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
					ln(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = xn(() => e(this.#e)), Xe(() => {
			var e = this.#c = document.createDocumentFragment(), t = N(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return xn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						ln(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(A);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Dn(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = xn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				jn(this.#a, e);
				let t = this.#n.pending;
				this.#o = xn(() => t(this.#e));
			} else this.#x(A);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		et(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = V, n = B, r = We;
		Rn(this.#i), Ln(this.#i), Ge(this.#i.ctx);
		try {
			return Tt.ensure(), e();
		} finally {
			Rn(t), Ln(n), Ge(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Dn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Xe(() => {
			this.#d = !1, this.#m && Bt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), U(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (z(this.#a), null), this.#o &&= (z(this.#o), null), this.#s &&= (z(this.#s), null), C && (Oe(this.#t), Ae(), Oe(je()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return xn(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return ln(e, this.#i.parent), null;
				}
			}));
		};
		Xe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				ln(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => ln(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function q(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[be] ??= e.nodeValue) && (e[be] = n, e.nodeValue = `${n}`);
}
function Tr(e, t) {
	return Dr(e, t);
}
var Er = /* @__PURE__ */ new Map();
function Dr(e, { target: t, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	Zt();
	var l = void 0, d = hn(() => {
		var s = r ?? t.appendChild(N());
		Cr(s, { pending: () => {} }, (t) => {
			E({});
			var r = We;
			if (o && (r.c = o), a && (i.$$events = a), C && gr(t, null), l = e(t, i) || Ke(), C && (V.nodes.end = w, w === null || w.nodeType !== 8 || w.data !== "]")) throw we(), n;
			D();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = br(r);
					for (let e of [t, document]) {
						var a = Er.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Er.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, mr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(u(or)), sr.add(f), () => {
			for (var e of d) for (let r of [t, document]) {
				var n = Er.get(r), i = n.get(e);
				--i == 0 ? (r.removeEventListener(e, mr), n.delete(e), n.size === 0 && Er.delete(r)) : n.set(e, i);
			}
			sr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Or.set(l, d), l;
}
var Or = /* @__PURE__ */ new WeakMap();
function kr(e, t) {
	let n = Or.get(e);
	return n ? (Or.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Ar = class {
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
			if (n) kn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (kn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						jn(r, t), t.append(N()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else z(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Dn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (z(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = tn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = N();
				i.append(a), this.#n.set(e, {
					effect: xn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, xn(() => t(this.anchor)));
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
function jr(e, t, ...n) {
	var r = new Ar(e);
	yn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, oe);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function J(e, t, n = !1) {
	var r;
	C && (r = w, ke());
	var i = new Ar(e), a = n ? oe : 0;
	function o(e, t) {
		if (C) {
			var n = Me(r);
			if (e !== parseInt(n.substring(1))) {
				var a = je();
				Oe(a), i.anchor = a, De(!1), i.ensure(e, t), De(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	yn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Mr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Dn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Nr(e, u(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, d = l.parentNode;
			en(d), d.append(l), e.items.clear();
		}
		Nr(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Nr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= le, jn(a, document.createDocumentFragment())) : z(t[i], n);
	}
}
var Pr;
function Y(e, t, n, r, i, a = null) {
	var o = e, c = /* @__PURE__ */ new Map();
	if (t & 4) {
		var l = e;
		o = C ? Oe(/* @__PURE__ */ Qt(l)) : l.appendChild(N());
	}
	C && ke();
	var d = null, f = /* @__PURE__ */ lt(() => {
		var e = n();
		return s(e) ? e : e == null ? [] : u(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Ir(v, p, o, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= le, Rr(d, null, o)) : kn(d) : Dn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: yn(() => {
			p = U(f);
			var e = p.length;
			let s = !1;
			C && Me(o) === "[!" != (e === 0) && (o = je(), Oe(o), De(!1), s = !0);
			for (var l = /* @__PURE__ */ new Set(), u = A, v = tn(), y = 0; y < e; y += 1) {
				C && w.nodeType === 8 && w.data === "]" && (o = w, s = !0, De(!1));
				var ee = p[y], b = r(ee, y), x = h ? null : c.get(b);
				x ? (x.v && Bt(x.v, ee), x.i && Bt(x.i, y), v && u.unskip_effect(x.e)) : (x = Lr(c, h ? o : Pr ??= N(), ee, b, y, i, t, n), h || (x.e.f |= le), c.set(b, x)), l.add(b);
			}
			if (e === 0 && a && !d && (h ? d = xn(() => a(o)) : (d = xn(() => a(Pr ??= N())), d.f |= le)), e > l.size && Le("", "", ""), C && e > 0 && Oe(je()), !h) {
				if (m.set(u, l), v) {
					for (let [e, t] of c) l.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			s && De(!0), U(f);
		}),
		flags: t,
		items: c,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, C && (o = w);
}
function Fr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Ir(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = Fr(e.effect.first), l, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (kn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= le, _ === c) Rr(_, null, n);
			else {
				var y = d ? d.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), zr(e, d, _), zr(e, _, y), Rr(_, y, n), d = _, p = [], m = [], c = Fr(d.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var ee = m[0], b;
					d = ee.prev;
					var x = p[0], S = p[p.length - 1];
					for (b = 0; b < p.length; b += 1) Rr(p[b], ee, n);
					for (b = 0; b < m.length; b += 1) l.delete(m[b]);
					zr(e, x.prev, S.next), zr(e, d, x), zr(e, S, ee), c = ee, d = S, --v, p = [], m = [];
				} else l.delete(_), Rr(_, c, n), zr(e, _.prev, _.next), zr(e, _, d === null ? e.effect.first : d.next), zr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = Fr(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, c = Fr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Nr(e, u(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var te = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || te.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && te.push(c), c = Fr(c.next);
		var ne = te.length;
		if (ne > 0) {
			var re = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.measure();
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.fix();
			}
			Mr(e, te, re);
		}
	}
	a && Xe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Lr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? It(n) : /* @__PURE__ */ Lt(n, !1, !1) : null, l = o & 2 ? It(i) : null;
	return {
		v: c,
		i: l,
		e: xn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Rr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ $t(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function zr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Br(e, t) {
	var n = void 0, r;
	bn(() => {
		n !== (n = t()) && (r &&= (z(r), null), n && (r = xn(() => {
			gn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Vr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Vr(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Hr() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Vr(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function Ur(e) {
	return typeof e == "object" ? Hr(e) : e ?? "";
}
var Wr = [..." 	\n\r\f\xA0\v﻿"];
function Gr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Wr.includes(r[o - 1])) && (s === r.length || Wr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Kr(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function qr(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Jr(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(qr)), i && c.push(...Object.keys(i).map(qr));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = qr(e.substring(l, u).trim());
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
		return r && (n += Kr(r)), i && (n += Kr(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Yr(e, t, n, r, i, a) {
	var o = e[ve];
	if (C || o !== n || o === void 0) {
		var s = Gr(n, r, a);
		(!C || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ve] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function Xr(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Zr(e, t, n, r) {
	var i = e[ye];
	if (C || i !== t) {
		var a = Jr(t, r);
		(!C || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ye] = t;
	} else r && (Array.isArray(r) ? (Xr(e, n?.[0], r[0]), Xr(e, n?.[1], r[1], "important")) : Xr(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Qr(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function $r(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || s(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = ni(c);
			Qr(c, r ? i.includes(l) : Kt(l, n));
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
function ei(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!s(t)) return Te();
		for (var r of e.options) r.selected = t.includes(ni(r));
		return;
	}
	for (r of e.options) if (Kt(ni(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function ti(e) {
	var t = new MutationObserver((t) => {
		t.every(ri) || ("__defaultValue" in e && $r(e, !1), "__value" in e && ei(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), pn(() => {
		t.disconnect();
	});
}
function ni(e) {
	return "__value" in e ? e.__value : e.value;
}
function ri(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ii = Symbol("is custom element"), ai = Symbol("is html"), oi = Se ? "link" : "LINK";
function X(e, t, n, r) {
	var i = si(e);
	C && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === oi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ge] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && li(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function si(e) {
	return e[_e] ??= {
		[ii]: e.nodeName.includes("-"),
		[ai]: e.namespaceURI === i
	};
}
var ci = /* @__PURE__ */ new Map();
function li(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ci.get(t);
	if (n) return n;
	ci.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = p(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = g(i);
	}
	return n;
}
var ui = /* @__PURE__ */ new class e {
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
function di(e, t, n) {
	var r = ui.observe(e, () => n(e[t]));
	gn(() => (ir(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var fi = !1;
function pi(e) {
	var t = fi;
	try {
		return fi = !1, [e(), fi];
	} finally {
		fi = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function mi(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ ot(r), U(l)) : (c && (c = !1, s = o ? ir(r) : r), s);
	let d;
	if (a) {
		var p = pe in e || he in e;
		d = f(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = pi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = u(), d && (i && ze(t), d(m)));
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
	var v = !1, y = (n & 1 ? ot : lt)(() => (v = !1, g()));
	a && U(y);
	var ee = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? U(y) : i && a ? Wt(e) : e;
			return M(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Pn && v || ee.f & 16384 ? y.v : U(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var hi = /* @__PURE__ */ W([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function gi(e, t) {
	E(t, !0);
	var n = hi(), r = I(n, !0);
	R(() => q(r, t.messages.text)), K(e, n), D();
}
var _i = 12;
function vi(e) {
	return Math.max(320, e);
}
function yi(e, t) {
	return e && t ? e / t : 1;
}
function bi(e, t, n, r) {
	return (e - t) * r / (n || r);
}
function xi(e, t, n) {
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
function Si(e, t, n) {
	return Math.max(0, Math.min(e + _i, n - t));
}
function Ci(e, t = 8) {
	let n = Math.max(1, Math.ceil(e / t));
	return Array.from({ length: Math.ceil(e / n) }, (e, t) => t * n);
}
function wi(e) {
	return Math.round(e) + .5;
}
//#endregion
//#region src/lib/colors.ts
var Ti = /* @__PURE__ */ t({
	BACKGROUND_EFFORT: () => Ai,
	EFFORT_ORDER: () => Oi,
	EFFORT_SHADES: () => Ni,
	HATCH_SHADES: () => Pi,
	HATCH_TURNS: () => Fi,
	KNOWN_MODELS: () => Ei,
	SLOT_COUNT: () => 8,
	effortHatch: () => Bi,
	effortLabel: () => Mi,
	effortName: () => ji,
	effortRank: () => ki,
	effortShade: () => zi,
	hatchTurn: () => Vi,
	modelSlots: () => Di,
	shade: () => Ri,
	slotColor: () => Li,
	swatchFill: () => Hi
}), Ei = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function Di(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Ei.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !Ei.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var Oi = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function ki(e) {
	let t = Oi.indexOf(e);
	return t === -1 ? Oi.length : t;
}
var Ai = "background";
function ji(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function Mi(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var Ni = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, Pi = {
	background: 1,
	ultracode: 4
}, Fi = {
	background: -45,
	ultracode: 45
};
function Ii(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function Li(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function Ri(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? Li(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function zi(e, t) {
	return Ri(e, Ii(Ni, t) ?? 0);
}
function Bi(e, t) {
	let n = Ii(Pi, t);
	return n ? Ri(e, n) : null;
}
function Vi(e) {
	return Ii(Fi, e);
}
function Hi(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var Ui = /* @__PURE__ */ t({
	ago: () => sa,
	compact: () => Z,
	dayText: () => ea,
	duration: () => Qi,
	longDay: () => na,
	longHour: () => aa,
	money: () => $,
	parseDay: () => $i,
	parseHour: () => ra,
	percent: () => Zi,
	shortDay: () => ta,
	shortHour: () => ia,
	signed: () => Xi,
	when: () => oa,
	whole: () => Q
}), Wi = "–", Gi = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), Ki = new Intl.NumberFormat("en"), qi = {
	month: "short",
	day: "numeric"
}, Ji = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, Yi = {
	hour: "2-digit",
	minute: "2-digit"
};
function Z(e) {
	return e == null ? Wi : Gi.format(e);
}
function Xi(e) {
	return e < 0 ? `−${Z(-e)}` : `+${Z(e)}`;
}
function Q(e) {
	return e == null ? Wi : Ki.format(e);
}
function $(e) {
	return e == null ? Wi : Math.abs(e) >= 1e3 ? "$" + Gi.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function Zi(e, t) {
	if (!t) return Wi;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function Qi(e) {
	if (e == null) return Wi;
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
	return $i(e).toLocaleDateString(t, qi);
}
function na(e, t) {
	return $i(e).toLocaleDateString(t, Ji);
}
function ra(e) {
	let [t = "", n = "0"] = e.split("T"), r = $i(t);
	return r.setHours(Number(n)), r;
}
function ia(e, t) {
	return ra(e).toLocaleTimeString(t, Yi);
}
function aa(e, t) {
	let n = ra(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, Yi);
	return `${n.toLocaleDateString(t, Ji)}, ${i(n)}–${i(r)}`;
}
function oa(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...qi,
		...Yi
	}) : Wi;
}
function sa(e, t = Date.now(), n) {
	if (!e) return Wi;
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
	let r = Di([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${ji(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: zi(e, a.effort),
			hatch: Bi(e, a.effort),
			turn: Vi(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : ki(e);
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
//#region src/lib/bymodel.ts
var La = {
	cost: {
		label: "Estimated cost",
		value: (e) => e.cost || 0,
		format: $
	},
	output: {
		label: "Output tokens",
		value: (e) => e.output,
		format: Z
	},
	input: {
		label: "Input tokens",
		value: la,
		format: Z
	}
}, Ra = Object.keys(La);
function za(e) {
	return Ra.find((t) => t === e) ?? "cost";
}
var Ba = 248;
function Va(e, t, n = /* @__PURE__ */ new Date()) {
	let r = La[t], i = ba(e, n), a = Ca(i.unit === "hour" ? e.hour_model_effort : e.day_model_effort, i.keyOf, r.value);
	return {
		buckets: i,
		series: a,
		totals: Ta(a, i.keys),
		metric: r
	};
}
function Ha(e, t) {
	let n = e - 8, r = (n - 56) / t;
	return {
		right: n,
		band: r,
		barWidth: ga(r, 24)
	};
}
function Ua(e, t) {
	return ha(56, Ha(e, t).band);
}
function Wa(e, t, n) {
	let { band: r, barWidth: i } = Ha(e, t);
	return 56 + r * n + (r - i) / 2;
}
function Ga(e, t, n) {
	let r = e.filter((e) => (e.values.get(t) ?? 0) > 0), i = r.map((e) => 220 * (e.values.get(t) ?? 0) / n);
	return Ea(r.map((e) => e.model), i, 220, 2, 4).map((e) => ({
		entry: r[e.position],
		segment: e
	}));
}
function Ka(e) {
	let t = e.filter((e) => e.hatch).map((e, t) => ({
		id: `model-hatch-${t}`,
		entry: e
	})), n = new Map(t.map((e) => [e.entry, e.id]));
	return {
		patterns: t,
		fill: (e) => n.has(e) ? `url(#${n.get(e)})` : e.color
	};
}
function qa(e, t) {
	return `${e.label} per ${t} by model and effort level; table view available`;
}
function Ja(e, t) {
	return `${e.label} per ${t}; arrow keys step through them`;
}
function Ya(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${e.metric.format(e.totals[t] ?? 0)}`;
}
function Xa(e) {
	return wa(e).map((e) => ({
		model: e.model,
		entries: e.entries.map((e) => ({
			entry: e,
			text: Mi(e.effort)
		}))
	}));
}
function Za(e, t) {
	return wa(e.filter((e) => e.values.get(t))).map((e) => ({
		model: e.model,
		value: e.entries.reduce((e, n) => e + (n.values.get(t) ?? 0), 0),
		efforts: e.entries.slice().reverse().map((e) => ({
			entry: e,
			text: Mi(e.effort),
			value: e.values.get(t) ?? 0
		}))
	}));
}
function Qa(e) {
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
//#region src/lib/payload.svelte.ts
var $a = /* @__PURE__ */ t({
	Payload: () => eo,
	payload: () => to,
	setPayload: () => no
}), eo = class {
	#e = /* @__PURE__ */ j(null);
	#t = /* @__PURE__ */ j(!1);
	get summary() {
		return U(this.#e);
	}
	get summaryFailed() {
		return U(this.#t);
	}
	set(e) {
		e.summary !== void 0 && (M(this.#e, e.summary), M(this.#t, !1)), e.summaryFailed !== void 0 && M(this.#t, e.summaryFailed, !0);
	}
	reset() {
		M(this.#e, null), M(this.#t, !1);
	}
}, to = new eo();
function no(e) {
	to.set(e), Et();
}
//#endregion
//#region src/lib/tables.ts
var ro = /* @__PURE__ */ t({
	DEFAULT_PAGE_SIZE: () => 25,
	PAGE_SIZES: () => io,
	TOOL_KINDS: () => po,
	chatRows: () => Eo,
	detailNoun: () => yo,
	emptyDetail: () => go,
	entryKey: () => To,
	kindLabel: () => ho,
	orderedEntries: () => wo,
	pageSizeFrom: () => co,
	pageText: () => so,
	pageUnits: () => ao,
	pageWindow: () => oo,
	sessionCount: () => fo,
	sessionMatches: () => lo,
	sessionProjects: () => uo,
	toolFolds: () => So,
	toolRowClass: () => bo,
	toolRowName: () => xo,
	toolRowShown: () => Co,
	toolTableRows: () => mo,
	toolsAndChat: () => Do
}), io = [
	10,
	25,
	50
];
function ao(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function oo(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function so(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function co(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function lo(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function uo(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
function fo(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var po = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function mo(e) {
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
function ho(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function go(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var _o = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, vo = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function yo(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn(vo, e.tool) && vo[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(_o, n) && _o[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function bo(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function xo(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: ho(e, po)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || go(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function So(e) {
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
			label: `${Q(a)} ${yo(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function Co(e, t) {
	return e.every((e) => t.has(e));
}
function wo(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function To(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function Eo(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return wo(e, t).map((e) => ({
		key: To(e, n.get(e) ?? 0),
		entry: e
	}));
}
function Do(e, t, n) {
	return e ? [n, t] : [t, n];
}
//#endregion
//#region src/lib/themes.ts
var Oo = /* @__PURE__ */ t({
	THEMES: () => ko,
	themeFooter: () => Fo,
	themeLabel: () => Po,
	themeName: () => Mo
}), ko = [
	"light",
	"dark",
	"hacker",
	"startup",
	"rgb"
], Ao = { techbro: "rgb" }, jo = {
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
function Mo(e) {
	if (e == null) return null;
	let t = (Object.hasOwn(Ao, e) ? Ao[e] : e) ?? e;
	return ko.includes(t) ? t : null;
}
function No(e) {
	return e !== null && Object.hasOwn(jo, e) ? jo[e] ?? {} : {};
}
function Po(e, t) {
	let n = No(e);
	return Object.hasOwn(n, t) ? n[t] ?? t : t;
}
function Fo(e) {
	return No(e).footer ?? "";
}
//#endregion
//#region src/lib/prefs.svelte.ts
var Io = /* @__PURE__ */ t({
	Preferences: () => Bo,
	footerCopy: () => Uo,
	hype: () => Ho,
	preferences: () => Vo,
	readPreference: () => Lo,
	savePreference: () => Ro,
	savedOption: () => zo
});
function Lo(e) {
	try {
		return localStorage.getItem(`claude-usage.${e}`);
	} catch {
		return null;
	}
}
function Ro(e, t) {
	try {
		localStorage.setItem(`claude-usage.${e}`, String(t));
	} catch {}
}
function zo(e, t) {
	let n = Lo(e);
	return n !== null && t.includes(n) ? n : null;
}
var Bo = class {
	#e = /* @__PURE__ */ j(Wt(Mo(Lo("theme"))));
	#t = /* @__PURE__ */ j(Wt(co(Lo("page_size"), io, 25)));
	#n = /* @__PURE__ */ j(Lo("chat-oldest-first") === "true");
	get theme() {
		return U(this.#e);
	}
	set theme(e) {
		let t = Mo(e);
		M(this.#e, t, !0), Ro("theme", t ?? "auto");
	}
	get pageSize() {
		return U(this.#t);
	}
	set pageSize(e) {
		io.includes(e) && (M(this.#t, e, !0), Ro("page_size", String(e)));
	}
	get oldestFirst() {
		return U(this.#n);
	}
	set oldestFirst(e) {
		M(this.#n, e, !0), Ro("chat-oldest-first", String(e));
	}
}, Vo = new Bo();
function Ho(e) {
	return Po(Vo.theme, e);
}
function Uo() {
	return Fo(Vo.theme);
}
//#endregion
//#region src/components/ChartTooltip.svelte
var Wo = /* @__PURE__ */ W([[
	"div",
	{ class: "tooltip" },
	,
]]);
function Go(e, t) {
	E(t, !0);
	let n = mi(t, "top", 3, 8);
	function r(e) {
		let r = e.parentElement?.clientWidth ?? 0;
		e.style.left = `${Si(t.anchor, e.offsetWidth, r)}px`, e.style.top = `${n()}px`;
	}
	var i = Wo();
	jr(P(i), () => t.children), T(i), Br(i, () => r), K(e, i), D();
}
//#endregion
//#region src/components/Chart.svelte
var Ko = /* @__PURE__ */ W([["rect", {
	class: "hit",
	tabindex: "0",
	role: "slider",
	"aria-valuemin": "1"
}]], 4), qo = /* @__PURE__ */ W([[
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
function Jo(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => (t.cursor?.count ?? 0) - 1), r = /* @__PURE__ */ j(null), i = /* @__PURE__ */ k(() => U(r) === null ? U(n) : Math.min(U(r), U(n))), a = /* @__PURE__ */ j(null), o = /* @__PURE__ */ k(() => U(a) === null || U(n) < 0 ? null : Math.min(U(a), U(n))), s = /* @__PURE__ */ k(() => t.cursor?.area(t.width));
	function c(e) {
		M(r, Math.min(Math.max(0, e), U(n)), !0), M(a, U(r), !0);
	}
	function l(e) {
		let n = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
		t.cursor && n && c(t.cursor.indexAt(t.width)(bi(e.clientX, n.left, n.width, t.width)));
	}
	function u(e) {
		if (!t.cursor) return;
		let n = xi(e.key, U(i), t.cursor.count);
		n !== null && (c(n), e.preventDefault());
	}
	var d = qo(), f = F(d), p = P(f), m = P(p);
	jr(m, () => t.plot, () => t.width);
	var h = L(m), g = (e) => {
		var n = G();
		jr(F(n), () => t.marks ?? v, () => t.width, () => U(o)), K(e, n);
	};
	J(h, (e) => {
		U(o) !== null && e(g);
	}), T(p);
	var _ = L(p), y = (e) => {
		var n = Ko();
		R((e, r) => {
			X(n, "x", U(s).x), X(n, "y", U(s).y), X(n, "width", e), X(n, "height", U(s).height), X(n, "aria-label", t.cursor.label), X(n, "aria-valuemax", t.cursor.count), X(n, "aria-valuenow", U(i) + 1), X(n, "aria-valuetext", r);
		}, [() => Math.max(1, U(s).width), () => t.cursor.valueText(U(i))]), ur("pointermove", n, l), lr("focus", n, () => c(U(i))), ur("keydown", n, u), lr("pointerleave", n, () => M(a, null)), lr("blur", n, () => M(a, null)), K(e, n);
	};
	J(_, (e) => {
		t.cursor && U(s) && U(n) >= 0 && e(y);
	}), T(f);
	var ee = L(f), b = (e) => {
		{
			let n = /* @__PURE__ */ k(() => t.cursor.tipX(t.width, U(o)) * yi(t.containerWidth, t.width));
			Go(e, {
				get anchor() {
					return U(n);
				},
				get top() {
					return t.tipTop;
				},
				children: (e, n) => {
					var r = G();
					jr(F(r), () => t.tip, () => U(o)), K(e, r);
				},
				$$slots: { default: !0 }
			});
		}
	};
	J(ee, (e) => {
		t.cursor && U(o) !== null && t.tip && e(b);
	}), R(() => {
		X(f, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), X(f, "height", t.height), X(p, "aria-label", t.label);
	}), K(e, d), D();
}
dr(["pointermove", "keydown"]);
//#endregion
//#region src/components/ChartCard.svelte
var Yo = /* @__PURE__ */ W([[
	"span",
	{ class: "muted" },
	" "
]]), Xo = /* @__PURE__ */ W([[
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
function Zo(e, t) {
	let n = /* @__PURE__ */ j(!1);
	var r = Xo(), i = P(r), a = P(i), o = I(a, !0), s = L(a, 2), c = (e) => {
		var n = Yo(), r = I(n, !0);
		R(() => q(r, t.note)), K(e, n);
	};
	J(s, (e) => {
		t.note && e(c);
	});
	var l = L(s, 2);
	jr(l, () => t.controls ?? v);
	var u = L(l, 4);
	T(i);
	var d = L(i, 2);
	jr(d, () => t.legend ?? v);
	var f = L(d, 2);
	jr(f, () => t.chart);
	var p = L(f, 2), m = (e) => {
		var n = G();
		jr(F(n), () => t.table), K(e, n);
	};
	J(p, (e) => {
		U(n) && e(m);
	}), jr(L(p, 2), () => t.extra ?? v), T(r), R(() => {
		X(r, "aria-labelledby", `${t.id ?? ""}-title`), X(a, "id", `${t.id ?? ""}-title`), q(o, t.title), X(u, "id", `${t.id ?? ""}-table-toggle`), X(u, "aria-pressed", U(n));
	}), ur("click", u, () => M(n, !U(n))), K(e, r);
}
dr(["click"]);
//#endregion
//#region src/components/Swatch.svelte
var Qo = /* @__PURE__ */ W([["span", { class: "swatch" }]]);
function $o(e, t) {
	var n = Qo();
	let r;
	R(() => r = Zr(n, "", r, { background: t.fill })), K(e, n);
}
//#endregion
//#region node_modules/svelte/src/reactivity/map.js
var es = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ j(0);
	#n = /* @__PURE__ */ j(0);
	#r = Kn || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return Kn === this.#r ? /* @__PURE__ */ j(e) : It(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return U(this.#t), !1;
		}
		return U(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				U(this.#t);
				return;
			}
		}
		return U(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), M(this.#n, super.size), Ht(o);
		else if (i !== t) {
			Ht(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && Ht(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), M(n, -1)), r && (M(this.#n, super.size), Ht(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			M(this.#n, 0);
			for (var t of e.values()) M(t, -1);
			Ht(this.#t), e.clear();
		}
	}
	#a() {
		U(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) U(n);
	}
	keys() {
		return U(this.#t), super.keys();
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
		return U(this.#n), super.size;
	}
}, ts = /* @__PURE__ */ t({
	keepScroll: () => rs,
	scrollAnchor: () => ns
});
function ns(e) {
	for (let t of e) {
		let e = t.getBoundingClientRect();
		if (e.bottom > 0) return {
			node: t,
			top: e.top
		};
	}
	return null;
}
function rs(e, t) {
	e && t && t.isConnected && window.scrollBy(0, t.getBoundingClientRect().top - e.top);
}
//#endregion
//#region src/components/Pager.svelte
var is = /* @__PURE__ */ W([[
	"option",
	null,
	" "
]]), as = /* @__PURE__ */ W([[
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
function os(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => (t.units.at(-1) ?? -1) + 1), r = /* @__PURE__ */ k(() => us(t.key, U(n))), i = /* @__PURE__ */ k(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function a() {
		ls.first(t.key) !== U(r).first && ls.set(t.key, U(r).first);
	}
	a();
	function o(e, r) {
		let i = e.closest(".pager"), a = ns(i ? [i] : []);
		ls.set(t.key, oo(U(n), Vo.pageSize, r).first), Et(), rs(a, i);
	}
	function s(e, t) {
		let n = e.closest(".pager"), r = ns(n ? [n] : []);
		Vo.pageSize = t, Et(), rs(r, n);
	}
	function c() {
		let { first: e, last: n } = U(r);
		t.rows?.forEach((r, i) => {
			let a = t.units[i];
			a !== void 0 && r.classList.toggle("off-page", a < e || a >= n);
		});
	}
	var l = as(), u = P(l);
	Y(u, 20, () => io, (e) => e, (e, n) => {
		var r = is(), i = I(r), a = {};
		R(() => {
			q(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), K(e, r);
	}), T(u);
	var d;
	ti(u);
	var f = L(u, 2), p = L(f, 2), m = I(p, !0), h = L(p, 2);
	T(l), Br(l, () => c), R((e) => {
		X(u, "id", `pager-${t.key ?? ""}-size`), X(u, "aria-label", `${U(i) ?? ""} per page`), d !== (d = Vo.pageSize) && (u.value = (u.__value = d) ?? "", ei(u, d)), X(f, "id", `pager-${t.key ?? ""}-previous`), f.disabled = U(r).page === 0, q(m, e), X(h, "id", `pager-${t.key ?? ""}-next`), h.disabled = U(r).page === U(r).pages - 1;
	}, [() => so(U(r), U(n), t.noun)]), ur("change", u, (e) => s(e.currentTarget, Number(e.currentTarget.value))), ur("click", f, (e) => o(e.currentTarget, U(r).page - 1)), ur("click", h, (e) => o(e.currentTarget, U(r).page + 1)), K(e, l), D();
}
dr(["change", "click"]);
//#endregion
//#region src/lib/paging.svelte.ts
var ss = /* @__PURE__ */ t({
	TablePages: () => cs,
	mountPager: () => fs,
	releaseDetachedPagers: () => ps,
	shownWindow: () => us,
	tablePages: () => ls
}), cs = class {
	#e = new es();
	first(e) {
		return this.#e.get(e) ?? 0;
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	forget(e) {
		this.#e.delete(e);
	}
}, ls = new cs();
function us(e, t) {
	return oo(t, Vo.pageSize, Math.floor(ls.first(e) / Vo.pageSize));
}
var ds = /* @__PURE__ */ new Set();
function fs(e) {
	let t = document.createElement("div"), n = Tr(os, {
		target: t,
		props: e
	});
	Et();
	let r = t.firstElementChild;
	if (!(r instanceof HTMLElement)) throw Error("The pager drew no element");
	return ds.add({
		component: n,
		root: r
	}), r;
}
function ps() {
	for (let e of [...ds]) e.root.isConnected || (ds.delete(e), kr(e.component));
}
//#endregion
//#region src/components/TableView.svelte
var ms = /* @__PURE__ */ W([[
	"th",
	null,
	" "
]]), hs = /* @__PURE__ */ W([[
	"tr",
	null,
	,
]]), gs = /* @__PURE__ */ W([[
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
function _s(e, t) {
	E(t, !0);
	let n = mi(t, "noun", 3, "rows"), r = /* @__PURE__ */ k(() => ao(t.rows.map((e) => t.sub?.(e) ?? !1))), i = /* @__PURE__ */ k(() => (U(r).at(-1) ?? -1) + 1), a = /* @__PURE__ */ k(() => us(t.key, U(i))), o = /* @__PURE__ */ k(() => t.rows.filter((e, t) => {
		let n = U(r)[t] ?? 0;
		return n >= U(a).first && n < U(a).last;
	}));
	var s = gs(), c = P(s), l = (e) => {
		os(e, {
			get key() {
				return t.key;
			},
			get noun() {
				return n();
			},
			get units() {
				return U(r);
			}
		});
	};
	J(c, (e) => {
		U(i) > io[0] && e(l);
	});
	var u = L(c, 2), d = P(u), f = P(d);
	Y(f, 21, () => t.columns, (e) => e.label, (e, t) => {
		var n = ms(), r = I(n, !0);
		R(() => {
			Yr(n, 1, Ur(U(t).numeric ? "num" : void 0)), q(r, U(t).label);
		}), K(e, n);
	}), T(f), T(d);
	var p = L(d);
	Y(p, 21, () => U(o), (e) => t.rowKey(e), (e, n) => {
		var r = hs();
		jr(P(r), () => t.cells, () => U(n)), T(r), R((e) => Yr(r, 1, e), [() => Ur(t.sub?.(U(n)) ? "sub-row" : void 0)]), K(e, r);
	}), T(p), T(u), T(s), K(e, s), D();
}
//#endregion
//#region src/components/XLabels.svelte
var vs = /* @__PURE__ */ W([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4);
function ys(e, t) {
	E(t, !0);
	var n = G();
	Y(F(n), 16, () => Ci(t.count, t.most), (e) => e, (e, n) => {
		var r = vs(), i = I(r, !0);
		R((e, n) => {
			X(r, "x", e), X(r, "y", t.y), q(i, n);
		}, [() => t.xOf(n), () => t.text(n)]), K(e, r);
	}), K(e, n), D();
}
//#endregion
//#region src/components/YAxis.svelte
var bs = /* @__PURE__ */ W([["line", { "stroke-width": "1" }], [
	"text",
	{
		"text-anchor": "end",
		class: "axis-text"
	},
	" "
]], 5);
function xs(e, t) {
	E(t, !0);
	var n = G();
	Y(F(n), 18, () => t.values, (e) => e, (e, n, r) => {
		let i = /* @__PURE__ */ k(() => wi(t.yOf(n)));
		var a = bs(), o = F(a), s = L(o), c = I(s, !0);
		R((e) => {
			X(o, "x1", t.left), X(o, "x2", t.right), X(o, "y1", U(i)), X(o, "y2", U(i)), X(o, "stroke", U(r) === 0 ? "var(--axis)" : "var(--grid)"), X(s, "x", t.left - 8), X(s, "y", U(i) + 4), q(c, e);
		}, [() => t.format(n)]), K(e, a);
	}), K(e, n), D();
}
//#endregion
//#region src/components/ByModel.svelte
var Ss = /* @__PURE__ */ W([[
	"button",
	{ type: "button" },
	" "
]]), Cs = /* @__PURE__ */ W([["div", {
	class: "segmented",
	role: "group",
	"aria-label": "Metric"
}]]), ws = /* @__PURE__ */ W([[
	"span",
	null,
	,
	" "
]]), Ts = /* @__PURE__ */ W([[
	"span",
	{ class: "legend-group" },
	[
		"strong",
		null,
		" "
	],
	" ",
	,
]]), Es = /* @__PURE__ */ W([[
	"div",
	{ class: "legend" },
	,
]]), Ds = /* @__PURE__ */ W([[
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
]], 4), Os = /* @__PURE__ */ W([["defs"]], 4), ks = /* @__PURE__ */ W([["path"]], 4), As = /* @__PURE__ */ W([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), js = /* @__PURE__ */ W([
	,
	,
	,
], 5), Ms = /* @__PURE__ */ W([
	,
	,
	,
	,
	,
], 5), Ns = /* @__PURE__ */ W([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), Ps = /* @__PURE__ */ W([[
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
]]), Fs = /* @__PURE__ */ W([
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
], 1), Is = /* @__PURE__ */ W([[
	"div",
	{ class: "name" },
	"No usage"
]]), Ls = /* @__PURE__ */ W([[
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
]]), Rs = /* @__PURE__ */ W([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	,
], 1), zs = /* @__PURE__ */ W([[
	"div",
	{ class: "chart" },
	,
]]), Bs = /* @__PURE__ */ W([[
	"td",
	{ class: "num" },
	" "
]]), Vs = /* @__PURE__ */ W([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function Hs(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Cs();
		Y(t, 20, () => Ra, (e) => e, (e, t) => {
			var n = Ss(), r = I(n, !0);
			R(() => {
				X(n, "aria-pressed", U(s) === t), q(r, La[t].label);
			}), ur("click", n, () => _(t)), K(e, n);
		}), T(t), K(e, t);
	}, r = (e) => {
		var t = Es(), n = P(t), r = (e) => {
			var t = G();
			Y(F(t), 17, () => Xa(U(c).series), (e) => e.model, (e, t) => {
				var n = Ts(), r = P(n), i = I(r, !0);
				Y(L(r, 2), 17, () => U(t).entries, ({ entry: e, text: t }) => e.key, (e, t) => {
					let n = () => U(t).entry, r = () => U(t).text;
					var i = ws(), a = P(i);
					{
						let e = /* @__PURE__ */ k(() => Hi(n().color, n().hatch, n().turn));
						$o(a, { get fill() {
							return U(e);
						} });
					}
					var o = L(a, 1, !0);
					T(i), R(() => q(o, r())), K(e, i);
				}), T(n), R(() => q(i, U(t).model)), K(e, n);
			}), K(e, t);
		};
		J(n, (e) => {
			U(c) && e(r);
		}), T(t), K(e, t);
	}, i = (e) => {
		var t = zs(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => Ha(t(), U(a).length)), r = /* @__PURE__ */ k(() => va(U(c).totals));
				var s = Ms(), l = F(s), d = (e) => {
					var t = Os();
					Y(t, 21, () => U(u).patterns, ({ id: e, entry: t }) => e, (e, t) => {
						let n = () => U(t).id, r = () => U(t).entry;
						var i = Ds(), a = P(i), o = L(a);
						T(i), R(() => {
							X(i, "id", n()), X(i, "patternTransform", `rotate(${r().turn ?? ""})`), X(a, "fill", r().color), X(o, "fill", r().hatch);
						}), K(e, i);
					}), T(t), K(e, t);
				};
				J(l, (e) => {
					U(u).patterns.length && e(d);
				});
				var p = L(l);
				{
					let e = /* @__PURE__ */ k(() => da(U(f), 4));
					xs(p, {
						get left() {
							return 56;
						},
						get right() {
							return U(n).right;
						},
						get values() {
							return U(e);
						},
						yOf: (e) => 220 - 220 * e / U(f),
						get format() {
							return U(o);
						}
					});
				}
				var m = L(p);
				{
					let e = /* @__PURE__ */ k(() => 238);
					ys(m, {
						get count() {
							return U(a).length;
						},
						xOf: (e) => 56 + U(n).band * (e + .5),
						get y() {
							return U(e);
						},
						text: (e) => U(i).short(U(a)[e] ?? "")
					});
				}
				Y(L(m), 18, () => U(a), (e) => e, (e, i, s) => {
					let l = /* @__PURE__ */ k(() => Wa(t(), U(a).length, U(s)));
					var d = js(), p = F(d);
					Y(p, 17, () => Ga(U(c).series, i, U(f)), ({ entry: e, segment: t }) => e.key, (e, t) => {
						let r = () => U(t).entry, i = () => U(t).segment;
						var a = ks();
						R((e, t) => {
							X(a, "d", e), X(a, "fill", t);
						}, [() => _a(U(l), i().y, U(n).barWidth, i().height, i().top), () => U(u).fill(r())]), K(e, a);
					});
					var m = L(p), h = (e) => {
						let t = /* @__PURE__ */ k(() => U(c).totals[U(s)] ?? 0);
						var r = As(), i = I(r, !0);
						R((e) => {
							X(r, "x", U(l) + U(n).barWidth / 2), X(r, "y", 220 - 220 * U(t) / U(f) - 6), q(i, e);
						}, [() => U(o)(U(t))]), K(e, r);
					};
					J(m, (e) => {
						U(s) === U(r) && (U(c).totals[U(s)] ?? 0) > 0 && e(h);
					}), K(e, d);
				}), K(e, s);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ k(() => Ha(t(), U(a).length).band);
				var i = Ns();
				R(() => {
					X(i, "x", 56 + U(r) * n()), X(i, "width", U(r)), X(i, "height", 220);
				}), K(e, i);
			}, r = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => U(a)[t()] ?? ""), r = /* @__PURE__ */ k(() => Za(U(c).series, U(n)));
				var s = Rs(), l = F(s), u = I(l, !0), d = L(l, 2);
				Y(d, 17, () => U(r), (e) => e.model, (e, t) => {
					var n = Fs(), r = F(n), i = P(r), a = I(i, !0), s = I(L(i), !0);
					T(r), Y(L(r, 2), 17, () => U(t).efforts, ({ entry: e, text: t, value: n }) => e.key, (e, t) => {
						let n = () => U(t).entry, r = () => U(t).text, i = () => U(t).value;
						var a = Ps(), s = P(a), c = P(s);
						{
							let e = /* @__PURE__ */ k(() => Hi(n().color, n().hatch, n().turn));
							$o(c, { get fill() {
								return U(e);
							} });
						}
						var l = L(c, 1, !0);
						T(s);
						var u = I(L(s, 2), !0);
						T(a), R((e) => {
							q(l, r()), q(u, e);
						}, [() => U(o)(i())]), K(e, a);
					}), R((e) => {
						q(a, U(t).model), q(s, e);
					}, [() => U(o)(U(t).value)]), K(e, n);
				}, (e) => {
					K(e, Is());
				});
				var f = L(d, 2), p = (e) => {
					var n = Ls(), r = I(L(P(n)), !0);
					T(n), R((e) => q(r, e), [() => U(o)(U(c).totals[t()] ?? 0)]), K(e, n);
				};
				J(f, (e) => {
					U(r).length > 1 && e(p);
				}), R((e) => q(u, e), [() => U(i).long(U(n))]), K(e, s);
			}, i = /* @__PURE__ */ k(() => U(c).buckets), a = /* @__PURE__ */ k(() => U(i).keys), o = /* @__PURE__ */ k(() => U(c).metric.format);
			{
				let i = /* @__PURE__ */ k(() => qa(U(c).metric, U(l)));
				Jo(e, {
					get height() {
						return Ba;
					},
					get label() {
						return U(i);
					},
					get width() {
						return U(h);
					},
					get containerWidth() {
						return U(m);
					},
					get cursor() {
						return U(g);
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
		J(n, (e) => {
			U(c) && U(u) && e(r);
		}), T(t), di(t, "clientWidth", (e) => M(m, e)), K(e, t);
	}, a = (e) => {
		var t = G(), n = F(t), r = (e) => {
			let t = (e, t = v) => {
				var r = Vs(), i = F(r), a = I(i, !0);
				Y(L(i, 2), 18, () => U(n).others, (e) => e, (e, n, r) => {
					var i = Bs(), a = I(i, !0);
					R(() => q(a, t().cells[U(r) + 1])), K(e, i);
				}), R(() => q(a, t().cells[0])), K(e, r);
			}, n = /* @__PURE__ */ k(() => {
				let [e = "", ...t] = U(p).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let r = /* @__PURE__ */ k(() => [{ label: U(n).first }, ...U(n).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				_s(e, {
					key: "chart-table",
					get columns() {
						return U(r);
					},
					get rows() {
						return U(p).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return t;
					}
				});
			}
		};
		J(n, (e) => {
			U(p) && e(r);
		}), K(e, t);
	}, o = /* @__PURE__ */ k(() => to.summary), s = /* @__PURE__ */ j(Wt(za(Lo("metric")))), c = /* @__PURE__ */ k(() => U(o) ? Va(U(o), U(s)) : null), l = /* @__PURE__ */ k(() => U(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ k(() => U(c) ? Ka(U(c).series) : null), d = /* @__PURE__ */ k(() => U(o) ? U(l) === "hour" ? Ho("Per hour, by model and effort") : Ho("Per day, by model and effort") : Ho("Per day, by model")), f = /* @__PURE__ */ k(() => ua(Math.max(...U(c)?.totals ?? [], 0))), p = /* @__PURE__ */ k(() => U(c) ? Qa(U(c)) : null), m = /* @__PURE__ */ j(0), h = /* @__PURE__ */ k(() => vi(U(m))), g = /* @__PURE__ */ k(() => U(c) ? {
		count: U(c).buckets.keys.length,
		label: Ja(U(c).metric, U(l)),
		valueText: (e) => Ya(U(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: Ha(e, U(c).buckets.keys.length).right - 56,
			height: 220
		}),
		indexAt: (e) => Ua(e, U(c).buckets.keys.length),
		tipX: (e, t) => 56 + Ha(e, U(c).buckets.keys.length).band * (t + .5)
	} : null);
	function _(e) {
		M(s, e, !0), Ro("metric", e);
	}
	Zo(e, {
		id: "chart",
		get title() {
			return U(d);
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
dr(["click"]);
//#endregion
//#region src/lib/costly.ts
var Us = [{
	label: "Cache reads",
	color: "var(--split-soft)",
	value: (e) => Pa(e).cacheRead
}, {
	label: "Everything else",
	color: "var(--split-strong)",
	note: "new input, cache writes, output and web searches",
	value: (e) => Pa(e).rest
}];
function Ws(e) {
	return e.note ? `${e.label} (${e.note})` : e.label;
}
function Gs(e) {
	return e.title || "Untitled session";
}
function Ks(e) {
	return `#session/${encodeURIComponent(e.session_id)}`;
}
function qs(e) {
	let t = Fa(e);
	return e.map((e) => {
		let n = Gs(e), r = Us.map((t) => ({
			part: t,
			amount: t.value(e)
		})), i = r.map(({ part: e, amount: t }) => `${e.label} ${$(t)}`).join(", ");
		return {
			session: e,
			title: n,
			href: Ks(e),
			detail: `${e.project} · ${Q(e.turns)} turns · avg context ${Z(e.context_avg)}`,
			share: Ia(e.cost, t),
			cost: $(e.cost),
			parts: r,
			label: `${n}: ${$(e.cost)}; ${i}`
		};
	});
}
function Js(e) {
	let { session: t } = e;
	return {
		title: e.title,
		parts: e.parts.map(({ part: e, amount: n }) => ({
			label: e.label,
			color: e.color,
			amount: $(n),
			share: Zi(n, t.cost || 0)
		})),
		total: e.cost,
		context: `${Q(t.turns)} turns · context avg ${Z(t.context_avg)}, peak ${Z(t.context_peak)}`
	};
}
function Ys(e) {
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
			...Us.map((e) => ({
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
				Q(e.turns),
				Z(e.context_avg),
				Z(e.context_peak),
				...Us.map((t) => $(t.value(e))),
				$(e.cost)
			]
		}))
	};
}
//#endregion
//#region src/components/CostPerSession.svelte
var Xs = /* @__PURE__ */ W([[
	"span",
	null,
	,
	" "
]]), Zs = /* @__PURE__ */ W([[
	"div",
	{ class: "legend" },
	,
]]), Qs = /* @__PURE__ */ W([["span"]]), $s = /* @__PURE__ */ W([[
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
]]), ec = /* @__PURE__ */ W([[
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
]]), tc = /* @__PURE__ */ W([
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
], 1), nc = /* @__PURE__ */ W([
	["div", { class: "bars" }],
	" ",
	,
], 1), rc = /* @__PURE__ */ W([[
	"div",
	{ class: "empty" },
	"No sessions in this range."
]]), ic = /* @__PURE__ */ W([[
	"div",
	{ class: "chart" },
	,
]]), ac = /* @__PURE__ */ W([[
	"td",
	{ class: "num" },
	" "
]]), oc = /* @__PURE__ */ W([
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
function sc(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Zs(), n = P(t), r = (e) => {
			var t = G();
			Y(F(t), 17, () => Us, (e) => e.label, (e, t) => {
				var n = Xs(), r = P(n);
				$o(r, { get fill() {
					return U(t).color;
				} });
				var i = L(r, 1, !0);
				T(n), R((e) => q(i, e), [() => Ws(U(t))]), K(e, n);
			}), K(e, t);
		};
		J(n, (e) => {
			U(a) && e(r);
		}), T(t), K(e, t);
	}, r = (e) => {
		var t = ic(), n = P(t), r = (e) => {
			var t = G(), n = F(t), r = (e) => {
				var t = nc(), n = F(t);
				Y(n, 21, () => U(s), (e) => e.session.session_id, (e, t) => {
					var n = $s(), r = P(n), i = P(r), a = I(i, !0), o = I(L(i), !0);
					T(r);
					var s = L(r, 2), c = P(s);
					let l;
					Y(c, 21, () => U(t).parts, ({ part: e, amount: t }) => e.label, (e, t) => {
						let n = () => U(t).part, r = () => U(t).amount;
						var i = G(), a = F(i), o = (e) => {
							var t = Qs();
							let i;
							R(() => i = Zr(t, "", i, {
								"flex-grow": r(),
								background: n().color
							})), K(e, t);
						};
						J(a, (e) => {
							r() > 0 && e(o);
						}), K(e, i);
					}), T(c), T(s);
					var u = I(L(s, 2), !0);
					T(n), R((e) => {
						X(n, "href", U(t).href), X(n, "aria-label", U(t).label), q(a, U(t).title), q(o, U(t).detail), l = Zr(c, "", l, { width: e }), q(u, U(t).cost);
					}, [() => `${U(t).share.toFixed(2) ?? ""}%`]), ur("pointermove", n, (e) => p(e, U(t).session.session_id)), lr("focus", n, (e) => p(e, U(t).session.session_id)), lr("pointerleave", n, m), lr("blur", n, m), K(e, n);
				}), T(n);
				var r = L(n, 2), i = (e) => {
					Go(e, {
						get anchor() {
							return U(u).anchor;
						},
						get top() {
							return U(u).top;
						},
						children: (e, t) => {
							var n = tc(), r = F(n), i = I(r, !0), a = L(r, 2);
							Y(a, 17, () => U(f).parts, (e) => e.label, (e, t) => {
								var n = ec(), r = P(n);
								$o(r, { get fill() {
									return U(t).color;
								} });
								var i = L(r), a = I(i, !0), o = I(L(i));
								T(n), R(() => {
									q(a, U(t).amount), q(o, `${U(t).label ?? ""} · ${U(t).share ?? ""}`);
								}), K(e, n);
							});
							var o = L(a, 2), s = P(o);
							$o(s, { fill: null });
							var c = I(L(s), !0);
							Ae(), T(o);
							var l = I(L(o, 2), !0);
							R(() => {
								q(i, U(f).title), q(c, U(f).total), q(l, U(f).context);
							}), K(e, n);
						},
						$$slots: { default: !0 }
					});
				};
				J(r, (e) => {
					U(u) && U(f) && e(i);
				}), K(e, t);
			}, i = (e) => {
				K(e, rc());
			};
			J(n, (e) => {
				U(s).length ? e(r) : e(i, -1);
			}), K(e, t);
		};
		J(n, (e) => {
			U(a) && e(r);
		}), T(t), K(e, t);
	}, i = (e) => {
		var t = G(), n = F(t), r = (e) => {
			let t = (e, t = v) => {
				var r = oc(), i = F(r), a = P(i), o = I(a, !0), s = I(L(a), !0);
				T(i), Y(L(i, 2), 19, () => U(n), (e) => e.label, (e, n, r) => {
					var i = ac(), a = I(i, !0);
					R(() => q(a, t().cells[U(r)])), K(e, i);
				}), R((e, n) => {
					X(a, "href", e), q(o, n), q(s, t().session.project);
				}, [() => Ks(t().session), () => Gs(t().session)]), K(e, r);
			}, n = /* @__PURE__ */ k(() => U(c).head.slice(1));
			_s(e, {
				key: "costly-table",
				get columns() {
					return U(c).head;
				},
				get rows() {
					return U(c).rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return t;
				}
			});
		};
		J(n, (e) => {
			U(a) && e(r);
		}), K(e, t);
	}, a = /* @__PURE__ */ k(() => to.summary), o = /* @__PURE__ */ k(() => U(a)?.costly_sessions ?? []), s = /* @__PURE__ */ k(() => qs(U(o))), c = /* @__PURE__ */ k(() => Ys(U(o))), l = /* @__PURE__ */ k(() => Ho("Cost per session")), u = /* @__PURE__ */ j(null), d = /* @__PURE__ */ k(() => U(u) ? U(s).find((e) => e.session.session_id === U(u)?.id) : void 0), f = /* @__PURE__ */ k(() => U(d) ? Js(U(d)) : null);
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
	Zo(e, {
		id: "costly",
		get title() {
			return U(l);
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
dr(["pointermove"]);
//#endregion
//#region src/lib/trend.ts
var cc = [
	{
		label: "Estimated cost",
		slot: 0,
		value: (e) => e.cost,
		format: $
	},
	{
		label: "Input tokens",
		slot: 1,
		value: (e) => e.input,
		format: Z
	},
	{
		label: "Output tokens",
		slot: 2,
		value: (e) => e.output,
		format: Z
	}
];
function lc(e) {
	let t = e * 116 + 22;
	return {
		top: t,
		bottom: t + 76
	};
}
function uc() {
	return lc(cc.length - 1).bottom + 28;
}
function dc(e, t = /* @__PURE__ */ new Date()) {
	let n = ba(e, t), r = Sa(n.unit === "hour" ? e.hour_model : e.day_model, n.keyOf);
	return {
		buckets: n,
		totals: n.keys.map((e) => r.get(e) ?? xa)
	};
}
function fc(e, t) {
	return e.totals.map((e) => t.value(e));
}
function pc(e) {
	return `estimated cost, input and output tokens per ${e}`;
}
function mc(e) {
	return `Estimated cost, input tokens and output tokens per ${e}; table view available`;
}
function hc(e) {
	return `Estimated cost, input and output tokens per ${e}; arrow keys step through them`;
}
function gc(e, t) {
	let n = e.totals[t] ?? xa, r = cc.map((e) => `${e.label} ${e.format(e.value(n))}`).join(", ");
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${r}`;
}
function _c(e) {
	let t = e.buckets.keys.map((t, n) => ({
		key: t,
		cells: [e.buckets.short(t), ...cc.map((t) => t.format(t.value(e.totals[n] ?? xa)))]
	})).reverse();
	return {
		head: [e.buckets.heading, ...cc.map((e) => e.label)],
		rows: t
	};
}
//#endregion
//#region src/components/AreaLine.svelte
var vc = /* @__PURE__ */ W([["path", { "fill-opacity": "0.1" }], ["path", {
	fill: "none",
	"stroke-width": "2",
	"stroke-linejoin": "round",
	"stroke-linecap": "round"
}]], 5);
function yc(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => t.values.map((e, n) => `${t.xOf(n).toFixed(1)},${t.yOf(e).toFixed(1)}`).join("L")), r = /* @__PURE__ */ k(() => `M${t.xOf(0)},${t.bottom}L${U(n)}L${t.xOf(t.values.length - 1)},${t.bottom}Z`);
	var i = G(), a = F(i), o = (e) => {
		var i = vc(), a = F(i), o = L(a);
		R(() => {
			X(a, "d", U(r)), X(a, "fill", t.color), X(o, "d", `M${U(n) ?? ""}`), X(o, "stroke", t.color);
		}), K(e, i);
	};
	J(a, (e) => {
		t.values.length && e(o);
	}), K(e, i), D();
}
//#endregion
//#region src/components/PointDot.svelte
var bc = /* @__PURE__ */ W([["circle", {
	r: "4",
	stroke: "var(--surface)",
	"stroke-width": "2"
}]], 4);
function xc(e, t) {
	var n = bc();
	R(() => {
		X(n, "cx", t.x), X(n, "cy", t.y), X(n, "fill", t.color);
	}), K(e, n);
}
//#endregion
//#region src/components/OverTime.svelte
var Sc = (e, t = v) => {
	var n = jc(), r = F(n), i = I(r, !0);
	Y(L(r, 2), 19, () => cc, (e) => e.label, (e, n, r) => {
		var i = Ac(), a = I(i, !0);
		R(() => q(a, t().cells[U(r) + 1])), K(e, i);
	}), R(() => q(i, t().cells[0])), K(e, n);
}, Cc = /* @__PURE__ */ W([
	,
	,
	[
		"text",
		{ class: "value-text" },
		" "
	]
], 5), wc = /* @__PURE__ */ W([
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
], 5), Tc = /* @__PURE__ */ W([
	,
	,
	,
], 5), Ec = /* @__PURE__ */ W([["line", { class: "crosshair" }], ,], 5), Dc = /* @__PURE__ */ W([[
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
]]), Oc = /* @__PURE__ */ W([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
], 1), kc = /* @__PURE__ */ W([[
	"div",
	{ class: "chart" },
	,
]]), Ac = /* @__PURE__ */ W([[
	"td",
	{ class: "num" },
	" "
]]), jc = /* @__PURE__ */ W([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function Mc(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = kc(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => t() - 64), r = /* @__PURE__ */ k(() => pa(U(s).length, 56, U(n)));
				var a = Tc(), o = F(a);
				Y(o, 17, () => U(d), ({ panel: e, top: t, bottom: n, color: r, values: i, max: a, yOf: o }) => e.label, (e, t) => {
					let i = () => U(t).panel, a = () => U(t).top, o = () => U(t).bottom, s = () => U(t).color, c = () => U(t).values, l = () => U(t).max, u = () => U(t).yOf;
					var d = wc(), f = F(d), p = L(f), m = I(p, !0), h = L(p);
					{
						let e = /* @__PURE__ */ k(() => da(l(), 2));
						xs(h, {
							get left() {
								return 56;
							},
							get right() {
								return U(n);
							},
							get values() {
								return U(e);
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
					yc(g, {
						get values() {
							return c();
						},
						get xOf() {
							return U(r);
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
						let t = /* @__PURE__ */ k(() => c().length - 1), n = /* @__PURE__ */ k(() => c()[U(t)] ?? 0);
						var a = Cc(), o = F(a);
						{
							let e = /* @__PURE__ */ k(() => U(r)(U(t))), i = /* @__PURE__ */ k(() => u()(U(n)));
							xc(o, {
								get x() {
									return U(e);
								},
								get y() {
									return U(i);
								},
								get color() {
									return s();
								}
							});
						}
						var l = L(o), d = I(l, !0);
						R((e, t, n) => {
							X(l, "x", e), X(l, "y", t), q(d, n);
						}, [
							() => U(r)(U(t)) + 9,
							() => u()(U(n)) + 4,
							() => i().format(U(n))
						]), K(e, a);
					};
					J(_, (e) => {
						c().length && e(v);
					}), R(() => {
						X(f, "x1", 56), X(f, "x2", 70), X(f, "y1", a() - 10), X(f, "y2", a() - 10), X(f, "stroke", s()), X(p, "x", 76), X(p, "y", a() - 6), q(m, i().label);
					}), K(e, d);
				});
				var c = L(o);
				{
					let e = /* @__PURE__ */ k(() => u + 18);
					ys(c, {
						get count() {
							return U(s).length;
						},
						get xOf() {
							return U(r);
						},
						get y() {
							return U(e);
						},
						text: (e) => U(i).short(U(s)[e] ?? "")
					});
				}
				K(e, a);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ k(() => pa(U(s).length, 56, t() - 64));
				var i = Ec(), a = F(i);
				Y(L(a), 17, () => U(d), ({ panel: e, color: t, values: n, yOf: r }) => e.label, (e, t) => {
					let i = () => U(t).color, a = () => U(t).values, o = () => U(t).yOf;
					{
						let t = /* @__PURE__ */ k(() => U(r)(n())), s = /* @__PURE__ */ k(() => o()(a()[n()] ?? 0));
						xc(e, {
							get x() {
								return U(t);
							},
							get y() {
								return U(s);
							},
							get color() {
								return i();
							}
						});
					}
				}), R((e, t) => {
					X(a, "x1", e), X(a, "x2", t), X(a, "y1", 18), X(a, "y2", u);
				}, [() => U(r)(n()), () => U(r)(n())]), K(e, i);
			}, r = (e, t = v) => {
				var n = Oc(), r = F(n), a = I(r, !0);
				Y(L(r, 2), 17, () => U(d), ({ panel: e, color: t, values: n }) => e.label, (e, n) => {
					let r = () => U(n).panel, i = () => U(n).color, a = () => U(n).values;
					var o = Dc(), s = P(o);
					let c;
					var l = L(s, 2), u = I(l, !0), d = I(L(l, 2), !0);
					T(o), R((e) => {
						c = Zr(s, "", c, { background: i() }), q(u, e), q(d, r().label);
					}, [() => r().format(a()[t()] ?? 0)]), K(e, o);
				}), R((e) => q(a, e), [() => U(i).long(U(s)[t()] ?? "")]), K(e, n);
			}, i = /* @__PURE__ */ k(() => U(a).buckets), s = /* @__PURE__ */ k(() => U(i).keys);
			{
				let i = /* @__PURE__ */ k(uc), a = /* @__PURE__ */ k(() => mc(U(o)));
				Jo(e, {
					get height() {
						return U(i);
					},
					get label() {
						return U(a);
					},
					get width() {
						return U(l);
					},
					get containerWidth() {
						return U(c);
					},
					get cursor() {
						return U(f);
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
		J(n, (e) => {
			U(a) && e(r);
		}), T(t), di(t, "clientWidth", (e) => M(c, e)), K(e, t);
	}, r = (e) => {
		var t = G(), n = F(t), r = (e) => {
			let t = /* @__PURE__ */ k(() => {
				let [e = "", ...t] = U(s).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let n = /* @__PURE__ */ k(() => [{ label: U(t).first }, ...U(t).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				_s(e, {
					key: "trend-table",
					get columns() {
						return U(n);
					},
					get rows() {
						return U(s).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return Sc;
					}
				});
			}
		};
		J(n, (e) => {
			U(s) && e(r);
		}), K(e, t);
	}, i = /* @__PURE__ */ k(() => to.summary), a = /* @__PURE__ */ k(() => U(i) ? dc(U(i)) : null), o = /* @__PURE__ */ k(() => U(a)?.buckets.unit ?? "day"), s = /* @__PURE__ */ k(() => U(a) ? _c(U(a)) : null), c = /* @__PURE__ */ j(0), l = /* @__PURE__ */ k(() => vi(U(c))), u = lc(cc.length - 1).bottom, d = /* @__PURE__ */ k(() => U(a) ? cc.map((e, t) => {
		let { top: n, bottom: r } = lc(t), i = fc(U(a), e), o = ua(Math.max(...i, 0));
		return {
			panel: e,
			top: n,
			bottom: r,
			color: Li(e.slot),
			values: i,
			max: o,
			yOf: (e) => r - 76 * e / o
		};
	}) : []), f = /* @__PURE__ */ k(() => U(a) ? {
		count: U(a).buckets.keys.length,
		label: hc(U(o)),
		valueText: (e) => gc(U(a), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: u
		}),
		indexAt: (e) => ma(56, e - 64, U(a).buckets.keys.length),
		tipX: (e, t) => pa(U(a).buckets.keys.length, 56, e - 64)(t)
	} : null);
	{
		let t = /* @__PURE__ */ k(() => Ho("Over time")), i = /* @__PURE__ */ k(() => pc(U(o)));
		Zo(e, {
			id: "trend",
			get title() {
				return U(t);
			},
			get note() {
				return U(i);
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
//#region src/lib/tiles.ts
function Nc(e, t = ea(/* @__PURE__ */ new Date()), n) {
	let r = e.history_since, i = r && r > e.since ? ` (history since ${ta(r, n)})` : "";
	return e.days === 1 ? e.until === t ? "today" : na(e.until, n) : `last ${e.days} days${i}`;
}
function Pc(e) {
	let t = [e.unpriced_turns ? `${Q(e.unpriced_turns)} turns of models without a price are not included` : "at API list prices"];
	return e.web_searches && t.push(`incl. ${Q(e.web_searches)} web searches, ${$(e.cost_parts.web_search)}`), t.join(" · ");
}
var Fc = "Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.";
function Ic(e) {
	let t = e.compactions === 1 ? "1 compaction" : `${Q(e.compactions)} compactions`, n = e.unknown ? `${Q(e.unknown)} without an estimate` : null;
	if (!e.compactions) return {
		title: Fc,
		verdict: null,
		amount: null,
		count: `Compacting: ${n}`
	};
	let r = e.net >= 0;
	return {
		title: Fc,
		verdict: r ? "gain" : "loss",
		amount: r ? `▲ compacting saved ~${$(e.net)} so far` : `▼ compacting cost ~${$(-e.net)} more so far`,
		count: `(${[t, n].filter(Boolean).join(", ")})`
	};
}
function Lc(e) {
	let t = e.cost_parts;
	return [{
		label: "Processed",
		tokens: e.new_input + e.cache_write,
		cost: t.new_input + t.cache_write,
		color: "var(--split-strong)",
		note: `New input ${Z(e.new_input)} + cache writes ${Z(e.cache_write)}, billed at full price or more`
	}, {
		label: "From cache",
		tokens: e.cache_read,
		cost: t.cache_read,
		color: "var(--split-soft)",
		note: "Cache reads, billed at a tenth of the input price and not processed again"
	}];
}
function Rc(e, t) {
	let n = la(t);
	return e.map((e) => `${e.label} ${Zi(e.tokens, n)}`).join(", ");
}
function zc(e, t) {
	return e?.turns ? `median context ${Z(e.median)} per turn (p90 ${Z(e.p90)})` + (t ? ` · compact hint at ${Z(t)}` : "") : null;
}
function Bc(e, t, n, r) {
	let i = e.api_ms_without_retries === null ? null : e.api_ms - e.api_ms_without_retries, a = "no time lost to retries";
	return i === null ? a = "retries are not in the transcripts" : i > 0 && (a = `${Qi(i)} of it retries`), {
		session: `wall-clock, ${t}`,
		api: a,
		tools: r ? "from each call to its result, incl. waiting for permission" : `${Zi(e.tool_ms, e.duration_ms)} of the session time`,
		lines: n === null ? "no lines changed" : `${$(n)} per 100 lines changed`
	};
}
function Vc(e) {
	return `${Q(e)} ${e === 1 ? "session" : "sessions"} that ended in the range`;
}
function Hc(e) {
	return e === "cost_record" ? "from its cost record" : "estimated from the transcripts";
}
function Uc(e) {
	let t = e.runtime.lines_added + e.runtime.lines_removed;
	return e.cost === null || t === 0 ? null : e.cost / t * 100;
}
//#endregion
//#region src/components/InputSplit.svelte
var Wc = /* @__PURE__ */ W([["span"]]), Gc = /* @__PURE__ */ W([[
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
]]), Kc = /* @__PURE__ */ W([[
	"div",
	{ class: "note" },
	" "
]]), qc = /* @__PURE__ */ W([[
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
function Jc(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => la(t.totals)), r = /* @__PURE__ */ k(() => Lc(t.totals)), i = /* @__PURE__ */ k(() => zc(t.context, t.hintTokens));
	var a = qc(), o = P(a), s = I(o, !0), c = L(o, 2), l = I(c, !0), u = L(c, 2);
	Y(u, 21, () => U(r).filter((e) => e.tokens > 0), (e) => e.label, (e, t) => {
		var n = Wc();
		let r;
		R(() => r = Zr(n, "", r, {
			"flex-grow": U(t).tokens,
			background: U(t).color
		})), K(e, n);
	}), T(u);
	var d = L(u, 2);
	Y(d, 17, () => U(r), (e) => e.label, (e, t) => {
		var r = Gc(), i = P(r);
		$o(i, { get fill() {
			return U(t).color;
		} });
		var a = L(i, 2), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = I(l, !0), d = I(L(l, 2), !0);
		T(r), R((e, n, i, a) => {
			X(r, "title", U(t).note), q(o, e), q(c, n), q(u, i), q(d, a);
		}, [
			() => Ho(U(t).label),
			() => Z(U(t).tokens),
			() => Zi(U(t).tokens, U(n)),
			() => $(U(t).cost)
		]), K(e, r);
	});
	var f = L(d, 2), p = (e) => {
		var t = Kc();
		X(t, "title", "The context a main-thread turn reads: new input, cache writes and reads. The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens).");
		var n = I(t, !0);
		R(() => q(n, U(i))), K(e, t);
	};
	J(f, (e) => {
		U(i) !== null && e(p);
	}), T(a), R((e, t, n) => {
		q(s, e), q(l, t), X(u, "aria-label", n);
	}, [
		() => Ho("Input tokens"),
		() => Z(U(n)),
		() => Rc(U(r), t.totals)
	]), K(e, a), D();
}
//#endregion
//#region src/components/StatTile.svelte
var Yc = /* @__PURE__ */ W([[
	"div",
	{ class: "note" },
	" "
]]), Xc = /* @__PURE__ */ W([[
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
function Zc(e, t) {
	E(t, !0);
	let n = mi(t, "note", 3, null), r = mi(t, "themedNote", 3, !1);
	var i = Xc(), a = P(i), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = (e) => {
		var t = Yc(), i = I(t, !0);
		R((e) => q(i, e), [() => r() ? Ho(n()) : n()]), K(e, t);
	};
	J(l, (e) => {
		n() && e(u);
	}), T(i), R((e) => {
		q(o, e), q(c, t.value);
	}, [() => Ho(t.label)]), K(e, i), D();
}
//#endregion
//#region src/components/KpiTiles.svelte
var Qc = /* @__PURE__ */ W([
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
], 1), $c = /* @__PURE__ */ W([[
	"div",
	{ class: "note" },
	,
]]), el = /* @__PURE__ */ W([
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
function tl(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => t.savings ? Ic(t.savings) : null);
	var r = el(), i = F(r), a = P(i), o = P(a), s = I(o, !0), c = L(o);
	T(a);
	var l = L(a, 2), u = I(l, !0), d = L(l, 2), f = I(d, !0), p = L(d, 2), m = (e) => {
		var t = $c(), r = P(t), i = (e) => {
			var t = Qc(), r = F(t), i = I(r, !0), a = I(L(r, 2), !0);
			R(() => {
				Yr(r, 1, Ur(U(n).verdict === "gain" ? "verdict-gain" : "verdict-loss")), q(i, U(n).amount), q(a, U(n).count);
			}), K(e, t);
		}, a = (e) => {
			var t = vr();
			R(() => q(t, U(n).count)), K(e, t);
		};
		J(r, (e) => {
			U(n).verdict ? e(i) : e(a, -1);
		}), T(t), R(() => X(t, "title", U(n).title)), K(e, t);
	};
	J(p, (e) => {
		U(n) && e(m);
	}), T(i);
	var h = L(i, 2);
	Jc(h, {
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
		let e = /* @__PURE__ */ k(() => Q(t.totals.turns));
		Zc(g, {
			label: "Turns",
			get value() {
				return U(e);
			},
			note: "API calls with usage",
			themedNote: !0
		});
	}
	var _ = L(g, 2);
	{
		let e = /* @__PURE__ */ k(() => Z(t.totals.output)), n = /* @__PURE__ */ k(() => $(t.totals.cost_parts.output));
		Zc(_, {
			label: "Output tokens",
			get value() {
				return U(e);
			},
			get note() {
				return U(n);
			}
		});
	}
	R((e, n, r) => {
		q(s, e), q(c, `, ${t.scope ?? ""}`), q(u, n), q(f, r);
	}, [
		() => Ho("Estimated cost"),
		() => $(t.totals.cost),
		() => Pc(t.totals)
	]), K(e, r), D();
}
//#endregion
//#region src/components/RuntimeTiles.svelte
var nl = /* @__PURE__ */ W([
	,
	,
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function rl(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => "source" in t.runtime && t.runtime.source === "transcripts"), r = /* @__PURE__ */ k(() => Bc(t.runtime, t.from, t.costPer100Lines, U(n)));
	var i = nl(), a = F(i);
	{
		let e = /* @__PURE__ */ k(() => Qi(t.runtime.duration_ms));
		Zc(a, {
			label: "Session time",
			get value() {
				return U(e);
			},
			get note() {
				return U(r).session;
			}
		});
	}
	var o = L(a, 2);
	{
		let e = /* @__PURE__ */ k(() => Qi(t.runtime.api_ms));
		Zc(o, {
			label: "Waiting on the API",
			get value() {
				return U(e);
			},
			get note() {
				return U(r).api;
			}
		});
	}
	var s = L(o, 2);
	{
		let e = /* @__PURE__ */ k(() => Qi(t.runtime.tool_ms));
		Zc(s, {
			label: "Running tools",
			get value() {
				return U(e);
			},
			get note() {
				return U(r).tools;
			}
		});
	}
	var c = L(s, 2);
	{
		let e = /* @__PURE__ */ k(() => `+${Q(t.runtime.lines_added)} / −${Q(t.runtime.lines_removed)}`);
		Zc(c, {
			label: "Lines changed",
			get value() {
				return U(e);
			},
			get note() {
				return U(r).lines;
			}
		});
	}
	K(e, i), D();
}
//#endregion
//#region src/components/SummaryTiles.svelte
var il = /* @__PURE__ */ W([[
	"div",
	{ class: "empty" },
	" "
]]);
function al(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => to.summary);
	var r = G(), i = F(r), a = (e) => {
		var r = G(), i = F(r), a = (e) => {
			{
				let t = /* @__PURE__ */ k(() => Nc(U(n)));
				tl(e, {
					get totals() {
						return U(n).totals;
					},
					get scope() {
						return U(t);
					},
					get context() {
						return U(n).context;
					},
					get hintTokens() {
						return U(n).compact_hint_tokens;
					},
					get savings() {
						return U(n).compaction_savings;
					}
				});
			}
		}, o = (e) => {
			{
				let t = /* @__PURE__ */ k(() => Vc(U(n).runtime.sessions));
				rl(e, {
					get runtime() {
						return U(n).runtime;
					},
					get from() {
						return U(t);
					},
					get costPer100Lines() {
						return U(n).runtime.cost_per_100_lines;
					}
				});
			}
		};
		J(i, (e) => {
			t.rows === "kpis" ? e(a) : e(o, -1);
		}), K(e, r);
	}, o = (e) => {
		var t = il(), n = I(t, !0);
		R(() => q(n, to.summaryFailed ? "Could not load the summary." : "Loading…")), K(e, t);
	};
	J(i, (e) => {
		U(n) ? e(a) : t.rows === "kpis" && e(o, 1);
	}), K(e, r), D();
}
//#endregion
//#region src/lib/banner.svelte.ts
var ol = class {
	#e = new es();
	#t = /* @__PURE__ */ k(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return U(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, sl = /* @__PURE__ */ t({
	PAYOFF_WORDS: () => cl,
	compactCallKind: () => pl,
	compactionTotal: () => gl,
	delegateCallShown: () => ml,
	payoffAhead: () => dl,
	payoffText: () => fl,
	payoffTone: () => ul,
	spread: () => ll,
	verdictTone: () => hl
}), cl = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function ll(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function ul(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function dl(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${Q(t.pays_later_in)} replies`;
		return `${cl.later}: growing at its recent pace, the context reaches about ${Z(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = Q(Math.round(t.calls_ahead));
	return `${cl[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function fl(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${$(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${Q(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : Q(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${Q(e.breakeven_low)} replies)` : `would pay off after about ${Q(e.breakeven_calls)} replies` + ll(r(e.breakeven_low), r(e.breakeven_high));
}
function pl(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function ml(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function hl(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function gl(e) {
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
var _l = /* @__PURE__ */ t({
	liveCompactBadge: () => bl,
	liveSecretBadge: () => yl,
	liveStateBadges: () => xl,
	liveWaitBadge: () => vl,
	sessionWaits: () => Sl,
	waitChanged: () => Cl
});
function vl(e) {
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
function yl(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${Q(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${Q(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function bl(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${Z(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = ul(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if (pl({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${$(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${Q(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${cl[l]}: compacting now ${m}, ~${Q(Math.round(f))} ahead on average.`);
}
function xl(e, t) {
	return [yl(e.secrets), bl(e.current, t)].filter((e) => e !== null);
}
function Sl(e, t) {
	let n = vl(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : vl(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function Cl(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/lib/overview.svelte.ts
var wl = /* @__PURE__ */ t({
	mountSessionKpis: () => kl,
	mountSessionRuntime: () => Al,
	releaseDetachedTiles: () => El
}), Tl = /* @__PURE__ */ new Set();
function El() {
	for (let e of [...Tl]) e.holder.isConnected || (Tl.delete(e), kr(e.component));
}
function Dl() {
	let e = document.createElement("div");
	return e.className = "kpis session-kpis", e;
}
function Ol(e, t) {
	return Et(), Tl.add({
		component: e,
		holder: t
	}), queueMicrotask(El), t;
}
function kl(e) {
	let t = Dl();
	return Ol(Tr(tl, {
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
function Al(e) {
	let t = Dl();
	return t.setAttribute("role", "group"), t.setAttribute("aria-label", "Time and lines changed"), Ol(Tr(rl, {
		target: t,
		props: {
			runtime: e.runtime,
			from: Hc(e.runtime.source),
			costPer100Lines: Uc(e)
		}
	}), t);
}
//#endregion
//#region src/lib/secrets.ts
var jl = /* @__PURE__ */ t({
	secretReach: () => Fl,
	secretTone: () => Ml,
	secretVia: () => Nl
});
function Ml(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function Nl(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var Pl = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function Fl(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(Pl, e.reach) ? Pl[e.reach] ?? "" : "no result yet";
}
//#endregion
//#region src/legacy.svelte.ts
var Il = [
	Ui,
	Ti,
	sl,
	jl,
	_l,
	ro,
	ca,
	Oo,
	Io,
	ss,
	ts,
	$a,
	wl
];
function Ll(e) {
	let t = new ol(), n = e.document.getElementById("error");
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
	let a = e.document.getElementById("chart-card");
	if (!a) throw Error("The page has no #chart-card container for the by-model section");
	let o = e.document.getElementById("costly-card");
	if (!o) throw Error("The page has no #costly-card container for the cost-per-session section");
	let s = Tr(gi, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	n.remove();
	let c = r.map(({ id: e, container: t }) => Tr(al, {
		target: t,
		props: { rows: e }
	})), l = Tr(Mc, { target: i }), u = Tr(Hs, { target: a }), d = Tr(sc, { target: o });
	return e.showError = (e, n) => {
		t.show(e, n), Et();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...Il), { stop() {
		kr(s);
		for (let e of c) kr(e);
		kr(l), kr(u), kr(d), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of Il.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
Ll(window);
//#endregion

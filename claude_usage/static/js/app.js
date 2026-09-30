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
		ut(e), t = Qn(e);
	} finally {
		Rn(n);
	}
	return t;
}
function ft(e) {
	var t = dt(e);
	if (!e.equals(t) && (e.wv = Yn(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), gt?.capture(e, t, !0)), e.deps === null))) {
		O(e, x);
		return;
	}
	Pn || (_t === null ? $e(e) : (fn() || A?.is_fork) && _t.set(e, t));
}
function pt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && tt(() => {
		t.ac.abort(xe), t.ac = null;
	}), t.fn !== null && (t.teardown = v), tr(t, 0), Cn(t));
}
function mt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && nr(t);
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
				a ? r.f ^= x : i & 4 ? t.push(r) : Xn(r) && (i & 16 && this.#d.add(r), nr(r));
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
			if (!(r.f & 24576) && Xn(r) && (Ot = /* @__PURE__ */ new Set(), nr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && En(r), Ot?.size > 0)) {
				Pt.clear();
				for (let e of Ot) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ot.has(n) && (Ot.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || nr(n);
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
		e.wv = Yn(), Rt = null, zt = 0, Ut(e, S, n), Rt = null, qe() && V !== null && V.f & 1024 && !(V.f & 96) && (Un === null ? Wn([e]) : Un.push(e)), !r.is_fork && Nt.size > 0 && !Ft && Vt();
	}
	return t;
}
function Vt() {
	Ft = !1;
	for (let e of Nt) {
		e.f & 1024 && O(e, te);
		let t;
		try {
			t = Xn(e);
		} catch {
			t = !0;
		}
		t && nr(e);
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
	var n = /* @__PURE__ */ new Map(), i = s(e), a = /* @__PURE__ */ j(0), o = null, c = qn, l = (e) => {
		if (qn === c) return e();
		var t = B, n = qn;
		Ln(null), Jn(c);
		var r = e();
		return Ln(t), Jn(n), r;
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
			return (i !== void 0 || V !== null && (!a || f(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ j(a ? Wt(e[t]) : r, o)), n.set(t, i)), H(i) === r) ? !1 : a;
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
			H(a);
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
			nr(r);
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
			e(...t.map(H));
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Tn(e.nodes.start, e.nodes.end), n = !0), e.f |= ae, Cn(e, t && !n), tr(e, 0);
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
var Vn = null, Hn = 0, Un = null;
function Wn(e) {
	Un = e;
}
var Gn = 1, Kn = 0, qn = Kn;
function Jn(e) {
	qn = e;
}
function Yn() {
	return ++Gn;
}
function Xn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Xn(a) && ft(a), a.wv > e.wv) return !0;
		}
		t & 512 && _t === null && O(e, x);
	}
	return !1;
}
function Zn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(zn !== null && zn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Zn(a, t, !1) : t === a && (n ? O(a, S) : a.f & 1024 && O(a, te), At(a));
	}
}
function Qn(e) {
	var t = Vn, n = Hn, r = Un, i = B, a = zn, o = We, s = In, c = qn, l = e.f;
	Vn = null, Hn = 0, Un = null, B = l & 96 ? null : e, zn = null, Ge(e.ctx), In = !1, qn = ++Kn, e.ac !== null && (tt(() => {
		e.ac.abort(xe);
	}), e.ac = null);
	try {
		e.f |= ue;
		var u = e.fn, d = u();
		e.f |= ie;
		var f = $n(e);
		if (qe() && Un !== null && !In && f !== null && !(e.f & 6146)) for (var p = 0; p < Un.length; p++) Zn(Un[p], e);
		if (i !== null && i !== e) {
			if (Kn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Kn;
			if (t !== null) for (let e of t) e.rv = Kn;
			Un !== null && (r === null ? r = Un : r.push(...Un));
		}
		return e.f & 8388608 && (e.f ^= fe), d;
	} catch (t) {
		return $n(e), cn(t);
	} finally {
		e.f ^= ue, Vn = t, Hn = n, Un = r, B = i, zn = a, Ge(o), In = s, qn = c;
	}
}
function $n(e) {
	var t = e.deps, n = A?.is_fork;
	if (Vn !== null) {
		var r;
		if (n || tr(e, Hn), t !== null && Hn > 0) for (t.length = Hn + Vn.length, r = 0; r < Vn.length; r++) t[Hn + r] = Vn[r];
		else e.deps = t = Vn;
		if (fn() && e.f & 512) for (r = Hn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Hn < t.length && (tr(e, Hn), t.length = Hn);
	return t;
}
function er(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var i = c.call(n, e);
		if (i !== -1) {
			var a = n.length - 1;
			a === 0 ? n = t.reactions = null : (n[i] = n[a], n.pop());
		}
	}
	if (n === null && t.f & 2 && (Vn === null || !l.call(Vn, t))) {
		var o = t;
		o.f & 512 && (o.f ^= 512), o.v !== r && $e(o), o.ac !== null && tt(() => {
			o.ac.abort(xe), o.ac = null, O(o, S);
		}), pt(o), tr(o, 0);
	}
}
function tr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) er(e, n[r]);
}
function nr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		O(e, x);
		var n = V, r = Nn;
		V = e, Nn = !(t & 96);
		try {
			t & 16777232 ? wn(e) : Cn(e), Sn(e);
			var i = Qn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Gn;
		} finally {
			Nn = r, V = n;
		}
	}
}
function H(e) {
	var t = !!(e.f & 2);
	if (Mn?.add(e), B !== null && !In && !(V !== null && V.f & 16384) && (zn === null || !zn.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < Kn && (e.rv = Kn, Vn === null && n !== null && n[Hn] === e ? Hn++ : Vn === null ? Vn = [e] : Vn.push(e));
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
			return (!(i.f & 1024) && i.reactions !== null || ir(i)) && (a = dt(i)), Pt.set(i, a), a;
		}
		var o = !(i.f & 512) && !In && B !== null && (Nn || !!(B.f & 512)), s = (i.f & ie) === 0;
		Xn(i) && (o && (i.f |= 512), ft(i)), o && !s && (mt(i), rr(i));
	}
	if (_t?.has(e)) return _t.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function rr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (mt(t), rr(t));
}
function ir(e) {
	if (e.v === r) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Pt.has(t) || t.f & 2 && ir(t)) return !0;
	return !1;
}
function ar(e) {
	var t = In;
	try {
		return In = !0, e();
	} finally {
		In = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var or = Symbol("events"), sr = /* @__PURE__ */ new Set(), cr = /* @__PURE__ */ new Set();
function lr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || hr.call(t, e), !e.cancelBubble) return tt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, Xe(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function ur(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = lr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && pn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function dr(e, t, n) {
	(t[or] ??= {})[e] = n;
}
function fr(e) {
	for (var t = 0; t < e.length; t++) sr.add(e[t]);
	for (var n of cr) n(e);
}
var pr = null, mr = !1;
function hr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	pr = e, mr || (mr = !0, setTimeout(() => {
		mr = !1, pr = null;
	}));
	var o = 0, s = pr === e && e[or];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[or] = t;
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
					var h = a[or]?.[r];
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
			e[or] = t, delete e.currentTarget, Ln(u), Rn(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var gr = Se ? "template" : "TEMPLATE";
function _r(e, t) {
	var n = V;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function vr(e, t) {
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
		l.length > 0 && (i.nodeName === gr ? i.content : i).append(vr(l, i.nodeName === "foreignObject" ? void 0 : u)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function U(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (C) return _r(w, null), w;
		i === void 0 && (i = vr(e, t & 4 ? a : t & 8 ? o : void 0), n || (i = /* @__PURE__ */ Qt(i)));
		var s = r || Jt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ Qt(s), l = s.lastChild;
			_r(c, l);
		} else _r(s, s);
		return s;
	};
}
function yr(e = "") {
	if (!C) {
		var t = N(e + "");
		return _r(t, t), t;
	}
	var n = w;
	return n.nodeType === 3 ? sn(n) : (n.before(n = N()), Oe(n)), _r(n, n), n;
}
function W() {
	if (C) return _r(w, null), w;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = N();
	return e.append(t, n), _r(t, n), e;
}
function G(e, t) {
	if (C) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = w), ke();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var br = ["touchstart", "touchmove"];
function xr(e) {
	return br.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Sr(e) {
	let t = 0, n = It(0), r;
	return () => {
		fn() && (H(n), vn(() => (t === 0 && (r = ar(() => e(() => Ht(n)))), t += 1, () => {
			Xe(() => {
				--t, t === 0 && (r?.(), r = void 0, Ht(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Cr = oe | se;
function wr(e, t, n, r) {
	new Tr(e, t, n, r);
}
var Tr = class {
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
	#h = Sr(() => (this.#m = It(this.#l), () => {
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
		}, Cr), C && (this.#e = w);
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
		return this.#h(), H(this.#m);
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
function K(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[be] ??= e.nodeValue) && (e[be] = n, e.nodeValue = `${n}`);
}
function Er(e, t) {
	return Or(e, t);
}
var Dr = /* @__PURE__ */ new Map();
function Or(e, { target: t, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	Zt();
	var l = void 0, d = hn(() => {
		var s = r ?? t.appendChild(N());
		wr(s, { pending: () => {} }, (t) => {
			E({});
			var r = We;
			if (o && (r.c = o), a && (i.$$events = a), C && _r(t, null), l = e(t, i) || Ke(), C && (V.nodes.end = w, w === null || w.nodeType !== 8 || w.data !== "]")) throw we(), n;
			D();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = xr(r);
					for (let e of [t, document]) {
						var a = Dr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Dr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, hr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(u(sr)), cr.add(f), () => {
			for (var e of d) for (let r of [t, document]) {
				var n = Dr.get(r), i = n.get(e);
				--i == 0 ? (r.removeEventListener(e, hr), n.delete(e), n.size === 0 && Dr.delete(r)) : n.set(e, i);
			}
			cr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return kr.set(l, d), l;
}
var kr = /* @__PURE__ */ new WeakMap();
function Ar(e, t) {
	let n = kr.get(e);
	return n ? (kr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var jr = class {
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
function Mr(e, t, ...n) {
	var r = new jr(e);
	yn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, oe);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function q(e, t, n = !1) {
	var r;
	C && (r = w, ke());
	var i = new jr(e), a = n ? oe : 0;
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
function Nr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Dn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Pr(e, u(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
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
		Pr(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Pr(e, t, n = !0) {
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
var Fr;
function J(e, t, n, r, i, a = null) {
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
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Lr(v, p, o, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= le, zr(d, null, o)) : kn(d) : Dn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: yn(() => {
			p = H(f);
			var e = p.length;
			let s = !1;
			C && Me(o) === "[!" != (e === 0) && (o = je(), Oe(o), De(!1), s = !0);
			for (var l = /* @__PURE__ */ new Set(), u = A, v = tn(), y = 0; y < e; y += 1) {
				C && w.nodeType === 8 && w.data === "]" && (o = w, s = !0, De(!1));
				var ee = p[y], b = r(ee, y), x = h ? null : c.get(b);
				x ? (x.v && Bt(x.v, ee), x.i && Bt(x.i, y), v && u.unskip_effect(x.e)) : (x = Rr(c, h ? o : Fr ??= N(), ee, b, y, i, t, n), h || (x.e.f |= le), c.set(b, x)), l.add(b);
			}
			if (e === 0 && a && !d && (h ? d = xn(() => a(o)) : (d = xn(() => a(Fr ??= N())), d.f |= le)), e > l.size && Le("", "", ""), C && e > 0 && Oe(je()), !h) {
				if (m.set(u, l), v) {
					for (let [e, t] of c) l.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			s && De(!0), H(f);
		}),
		flags: t,
		items: c,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, C && (o = w);
}
function Ir(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Lr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = Ir(e.effect.first), l, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (kn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= le, _ === c) zr(_, null, n);
			else {
				var y = d ? d.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Br(e, d, _), Br(e, _, y), zr(_, y, n), d = _, p = [], m = [], c = Ir(d.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var ee = m[0], b;
					d = ee.prev;
					var x = p[0], S = p[p.length - 1];
					for (b = 0; b < p.length; b += 1) zr(p[b], ee, n);
					for (b = 0; b < m.length; b += 1) l.delete(m[b]);
					Br(e, x.prev, S.next), Br(e, d, x), Br(e, S, ee), c = ee, d = S, --v, p = [], m = [];
				} else l.delete(_), zr(_, c, n), Br(e, _.prev, _.next), Br(e, _, d === null ? e.effect.first : d.next), Br(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = Ir(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, c = Ir(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Pr(e, u(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var te = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || te.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && te.push(c), c = Ir(c.next);
		var ne = te.length;
		if (ne > 0) {
			var re = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.measure();
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.fix();
			}
			Nr(e, te, re);
		}
	}
	a && Xe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Rr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? It(n) : /* @__PURE__ */ Lt(n, !1, !1) : null, l = o & 2 ? It(i) : null;
	return {
		v: c,
		i: l,
		e: xn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function zr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ $t(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Br(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Vr(e, t) {
	var n = void 0, r;
	bn(() => {
		n !== (n = t()) && (r &&= (z(r), null), n && (r = xn(() => {
			gn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Hr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Hr(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Ur() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Hr(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function Wr(e) {
	return typeof e == "object" ? Ur(e) : e ?? "";
}
var Gr = [..." 	\n\r\f\xA0\v﻿"];
function Kr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Gr.includes(r[o - 1])) && (s === r.length || Gr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function qr(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Jr(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Yr(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Jr)), i && c.push(...Object.keys(i).map(Jr));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Jr(e.substring(l, u).trim());
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
		return r && (n += qr(r)), i && (n += qr(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Xr(e, t, n, r, i, a) {
	var o = e[ve];
	if (C || o !== n || o === void 0) {
		var s = Kr(n, r, a);
		(!C || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ve] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function Zr(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Qr(e, t, n, r) {
	var i = e[ye];
	if (C || i !== t) {
		var a = Yr(t, r);
		(!C || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ye] = t;
	} else r && (Array.isArray(r) ? (Zr(e, n?.[0], r[0]), Zr(e, n?.[1], r[1], "important")) : Zr(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function $r(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function ei(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || s(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = ri(c);
			$r(c, r ? i.includes(l) : Kt(l, n));
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
function ti(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!s(t)) return Te();
		for (var r of e.options) r.selected = t.includes(ri(r));
		return;
	}
	for (r of e.options) if (Kt(ri(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function ni(e) {
	var t = new MutationObserver((t) => {
		t.every(ii) || ("__defaultValue" in e && ei(e, !1), "__value" in e && ti(e, e.__value));
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
function ri(e) {
	return "__value" in e ? e.__value : e.value;
}
function ii(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ai = Symbol("is custom element"), oi = Symbol("is html"), si = Se ? "link" : "LINK";
function Y(e, t, n, r) {
	var i = ci(e);
	C && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === si) || i[t] !== (i[t] = n) && (t === "loading" && (e[ge] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ui(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function ci(e) {
	return e[_e] ??= {
		[ai]: e.nodeName.includes("-"),
		[oi]: e.namespaceURI === i
	};
}
var li = /* @__PURE__ */ new Map();
function ui(e) {
	var t = e.getAttribute("is") || e.nodeName, n = li.get(t);
	if (n) return n;
	li.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = p(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = g(i);
	}
	return n;
}
var di = /* @__PURE__ */ new class e {
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
function fi(e, t, n) {
	var r = di.observe(e, () => n(e[t]));
	gn(() => (ar(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var pi = !1;
function mi(e) {
	var t = pi;
	try {
		return pi = !1, [e(), pi];
	} finally {
		pi = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function hi(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ ot(r), H(l)) : (c && (c = !1, s = o ? ar(r) : r), s);
	let d;
	if (a) {
		var p = pe in e || he in e;
		d = f(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = mi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = u(), d && (i && ze(t), d(m)));
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
	a && H(y);
	var ee = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && a ? Wt(e) : e;
			return M(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Pn && v || ee.f & 16384 ? y.v : H(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var gi = /* @__PURE__ */ U([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function _i(e, t) {
	E(t, !0);
	var n = gi(), r = I(n, !0);
	R(() => K(r, t.messages.text)), G(e, n), D();
}
var vi = 12;
function yi(e) {
	return Math.max(320, e);
}
function bi(e, t) {
	return e && t ? e / t : 1;
}
function xi(e, t, n, r) {
	return (e - t) * r / (n || r);
}
function Si(e, t, n) {
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
function Ci(e, t, n) {
	return Math.max(0, Math.min(e + vi, n - t));
}
function wi(e, t = 8) {
	let n = Math.max(1, Math.ceil(e / t));
	return Array.from({ length: Math.ceil(e / n) }, (e, t) => t * n);
}
function Ti(e) {
	return Math.round(e) + .5;
}
//#endregion
//#region src/lib/colors.ts
var Ei = /* @__PURE__ */ t({
	BACKGROUND_EFFORT: () => ji,
	EFFORT_ORDER: () => ki,
	EFFORT_SHADES: () => Pi,
	HATCH_SHADES: () => Fi,
	HATCH_TURNS: () => Ii,
	KNOWN_MODELS: () => Di,
	SLOT_COUNT: () => 8,
	effortHatch: () => Vi,
	effortLabel: () => Ni,
	effortName: () => Mi,
	effortRank: () => Ai,
	effortShade: () => Bi,
	hatchTurn: () => Hi,
	modelSlots: () => Oi,
	shade: () => zi,
	slotColor: () => Ri,
	swatchFill: () => Ui
}), Di = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function Oi(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Di.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !Di.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var ki = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function Ai(e) {
	let t = ki.indexOf(e);
	return t === -1 ? ki.length : t;
}
var ji = "background";
function Mi(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function Ni(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var Pi = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, Fi = {
	background: 1,
	ultracode: 4
}, Ii = {
	background: -45,
	ultracode: 45
};
function Li(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function Ri(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function zi(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? Ri(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function Bi(e, t) {
	return zi(e, Li(Pi, t) ?? 0);
}
function Vi(e, t) {
	let n = Li(Fi, t);
	return n ? zi(e, n) : null;
}
function Hi(e) {
	return Li(Ii, e);
}
function Ui(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var Wi = /* @__PURE__ */ t({
	ago: () => ca,
	compact: () => X,
	dayText: () => ta,
	duration: () => $i,
	longDay: () => ra,
	longHour: () => oa,
	money: () => Q,
	parseDay: () => ea,
	parseHour: () => ia,
	percent: () => Qi,
	shortDay: () => na,
	shortHour: () => aa,
	signed: () => Zi,
	when: () => sa,
	whole: () => Z
}), Gi = "–", Ki = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), qi = new Intl.NumberFormat("en"), Ji = {
	month: "short",
	day: "numeric"
}, Yi = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, Xi = {
	hour: "2-digit",
	minute: "2-digit"
};
function X(e) {
	return e == null ? Gi : Ki.format(e);
}
function Zi(e) {
	return e < 0 ? `−${X(-e)}` : `+${X(e)}`;
}
function Z(e) {
	return e == null ? Gi : qi.format(e);
}
function Q(e) {
	return e == null ? Gi : Math.abs(e) >= 1e3 ? "$" + Ki.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function Qi(e, t) {
	if (!t) return Gi;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function $i(e) {
	if (e == null) return Gi;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function ea(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function ta(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function na(e, t) {
	return ea(e).toLocaleDateString(t, Ji);
}
function ra(e, t) {
	return ea(e).toLocaleDateString(t, Yi);
}
function ia(e) {
	let [t = "", n = "0"] = e.split("T"), r = ea(t);
	return r.setHours(Number(n)), r;
}
function aa(e, t) {
	return ia(e).toLocaleTimeString(t, Xi);
}
function oa(e, t) {
	let n = ia(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, Xi);
	return `${n.toLocaleDateString(t, Yi)}, ${i(n)}–${i(r)}`;
}
function sa(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...Ji,
		...Xi
	}) : Gi;
}
function ca(e, t = Date.now(), n) {
	if (!e) return Gi;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : sa(e, n);
}
//#endregion
//#region src/lib/charts.ts
var la = /* @__PURE__ */ t({
	LIMIT_ICON: () => "⚠",
	NO_USAGE: () => Sa,
	RATE_LIMIT: () => Oa,
	bandIndex: () => ga,
	barShare: () => La,
	bucketTotals: () => Ca,
	chartSeries: () => wa,
	columnPath: () => va,
	columnTotals: () => Ea,
	columnWidth: () => _a,
	costSplit: () => Fa,
	costTop: () => Ia,
	errorText: () => ja,
	inputTotal: () => ua,
	limitCounts: () => Ma,
	limitTop: () => pa,
	limitType: () => Aa,
	lineX: () => ma,
	modelGroups: () => Ta,
	nearestIndex: () => ha,
	niceMax: () => da,
	peakIndex: () => ya,
	rangeDays: () => ba,
	stackSegments: () => Da,
	ticks: () => fa,
	timeBuckets: () => xa,
	windowHitAfter: () => Na,
	windowSpan: () => Pa
});
function ua(e) {
	return e.new_input + e.cache_write + e.cache_read;
}
function da(e) {
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
function fa(e, t) {
	return Array.from({ length: t + 1 }, (n, r) => e * r / t);
}
function pa(e) {
	return Math.max(2, Math.ceil(da(e) / 2) * 2);
}
function ma(e, t, n) {
	let r = e - 1;
	return (e) => r > 0 ? t + (n - t) * e / r : (t + n) / 2;
}
function ha(e, t, n) {
	return (r) => n > 1 ? Math.round((r - e) / (t - e) * (n - 1)) : 0;
}
function ga(e, t) {
	return (n) => Math.floor((n - e) / t);
}
function _a(e, t = 24) {
	return Math.max(2, Math.min(t, e * .6));
}
function va(e, t, n, r, i, a = 4) {
	let o = i ? Math.min(a, n / 2, r) : 0;
	return `M${e},${t + r}V${t + o}` + (o ? `Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}` : `H${e + n}`) + `V${t + r}Z`;
}
function ya(e) {
	return e.indexOf(Math.max(...e));
}
function ba(e, t = /* @__PURE__ */ new Date()) {
	let n = [];
	for (let r = ea(e); r <= t; r.setDate(r.getDate() + 1)) n.push(ta(r));
	return n;
}
function xa(e, t = /* @__PURE__ */ new Date()) {
	if (e.days !== 1 || !e.hour_model) return {
		keys: ba(e.since, t),
		unit: "day",
		heading: "Day",
		short: na,
		long: ra,
		keyOf: (e) => e.day ?? ""
	};
	let n = e.since === ta(t) ? t.getHours() : 23, r = [];
	for (let t = 0; t <= n; t += 1) r.push(`${e.since}T${String(t).padStart(2, "0")}`);
	return {
		keys: r,
		unit: "hour",
		heading: "Hour",
		short: aa,
		long: oa,
		keyOf: (e) => e.hour ?? ""
	};
}
var Sa = {
	cost: 0,
	input: 0,
	output: 0
};
function Ca(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			cost: 0,
			input: 0,
			output: 0
		};
		i.cost += r.cost || 0, i.input += ua(r), i.output += r.output, n.set(e, i);
	}
	return n;
}
function wa(e, t, n) {
	let r = Oi([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${Mi(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: Bi(e, a.effort),
			hatch: Vi(e, a.effort),
			turn: Hi(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : Ai(e);
	return [...i.values()].sort((e, t) => (e.slot ?? 8) - (t.slot ?? 8) || e.model.localeCompare(t.model) || a(e.effort) - a(t.effort) || String(e.effort).localeCompare(String(t.effort)));
}
function Ta(e) {
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
function Ea(e, t) {
	return t.map((t) => e.reduce((e, n) => e + (n.values.get(t) ?? 0), 0));
}
function Da(e, t, n, r = 2, i = 4) {
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
var Oa = "rate_limit", ka = {
	five_hour: "5-hour limit",
	seven_day: "weekly limit",
	seven_day_opus: "weekly Opus limit"
};
function Aa(e) {
	return e ? Object.hasOwn(ka, e) ? ka[e] ?? e : e.replaceAll("_", " ") : "–";
}
function ja(e) {
	let t = e.status ? ` (${e.status})` : "";
	return e.error === "rate_limit" ? `⚠ Rate limit${t}` : `${e.error.replaceAll("_", " ")}${t}`;
}
function Ma(e, t) {
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
function Na(e) {
	return Date.parse(e.first_hit) - Date.parse(e.start);
}
function Pa(e, t) {
	let n = new Date(e.start), r = new Date(e.resets_at), i = n.toDateString() === r.toDateString() ? r.toLocaleTimeString(t, {
		hour: "2-digit",
		minute: "2-digit"
	}) : sa(e.resets_at, t);
	return `${sa(e.start, t)} – ${i}`;
}
function Fa(e) {
	let t = e.cost_parts.cache_read;
	return {
		cacheRead: t,
		rest: Math.max(0, (e.cost || 0) - t)
	};
}
function Ia(e) {
	return Math.max(0, ...e.map((e) => e.cost || 0)) || 1;
}
function La(e, t) {
	return 100 * (e || 0) / t;
}
//#endregion
//#region src/lib/bymodel.ts
var Ra = {
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
		value: ua,
		format: X
	}
}, za = Object.keys(Ra);
function Ba(e) {
	return za.find((t) => t === e) ?? "cost";
}
var Va = 248;
function Ha(e, t, n = /* @__PURE__ */ new Date()) {
	let r = Ra[t], i = xa(e, n), a = wa(i.unit === "hour" ? e.hour_model_effort : e.day_model_effort, i.keyOf, r.value);
	return {
		buckets: i,
		series: a,
		totals: Ea(a, i.keys),
		metric: r
	};
}
function Ua(e, t) {
	let n = e - 8, r = (n - 56) / t;
	return {
		right: n,
		band: r,
		barWidth: _a(r, 24)
	};
}
function Wa(e, t) {
	return ga(56, Ua(e, t).band);
}
function Ga(e, t, n) {
	let { band: r, barWidth: i } = Ua(e, t);
	return 56 + r * n + (r - i) / 2;
}
function Ka(e, t, n) {
	let r = e.filter((e) => (e.values.get(t) ?? 0) > 0), i = r.map((e) => 220 * (e.values.get(t) ?? 0) / n);
	return Da(r.map((e) => e.model), i, 220, 2, 4).map((e) => ({
		entry: r[e.position],
		segment: e
	}));
}
function qa(e) {
	let t = e.filter((e) => e.hatch).map((e, t) => ({
		id: `model-hatch-${t}`,
		entry: e
	})), n = new Map(t.map((e) => [e.entry, e.id]));
	return {
		patterns: t,
		fill: (e) => n.has(e) ? `url(#${n.get(e)})` : e.color
	};
}
function Ja(e, t) {
	return `${e.label} per ${t} by model and effort level; table view available`;
}
function Ya(e, t) {
	return `${e.label} per ${t}; arrow keys step through them`;
}
function Xa(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${e.metric.format(e.totals[t] ?? 0)}`;
}
function Za(e) {
	return Ta(e).map((e) => ({
		model: e.model,
		entries: e.entries.map((e) => ({
			entry: e,
			text: Ni(e.effort)
		}))
	}));
}
function Qa(e, t) {
	return Ta(e.filter((e) => e.values.get(t))).map((e) => ({
		model: e.model,
		value: e.entries.reduce((e, n) => e + (n.values.get(t) ?? 0), 0),
		efforts: e.entries.slice().reverse().map((e) => ({
			entry: e,
			text: Ni(e.effort),
			value: e.values.get(t) ?? 0
		}))
	}));
}
function $a(e) {
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
var eo = /* @__PURE__ */ t({
	Payload: () => to,
	payload: () => no,
	setPayload: () => ro
}), to = class {
	#e = /* @__PURE__ */ j(null);
	#t = /* @__PURE__ */ j(!1);
	get summary() {
		return H(this.#e);
	}
	get summaryFailed() {
		return H(this.#t);
	}
	set(e) {
		e.summary !== void 0 && (M(this.#e, e.summary), M(this.#t, !1)), e.summaryFailed !== void 0 && M(this.#t, e.summaryFailed, !0);
	}
	reset() {
		M(this.#e, null), M(this.#t, !1);
	}
}, no = new to();
function ro(e) {
	no.set(e), Et();
}
//#endregion
//#region src/lib/tables.ts
var io = /* @__PURE__ */ t({
	DEFAULT_PAGE_SIZE: () => 25,
	PAGE_SIZES: () => ao,
	TOOL_KINDS: () => mo,
	USAGE_COLUMNS: () => Ao,
	byCost: () => ko,
	chatRows: () => Do,
	detailNoun: () => bo,
	emptyDetail: () => _o,
	entryKey: () => Eo,
	kindLabel: () => go,
	orderedEntries: () => To,
	pageSizeFrom: () => lo,
	pageText: () => co,
	pageUnits: () => oo,
	pageWindow: () => so,
	sessionCount: () => po,
	sessionMatches: () => uo,
	sessionProjects: () => fo,
	toolFolds: () => Co,
	toolRowClass: () => xo,
	toolRowName: () => So,
	toolRowShown: () => wo,
	toolTableRows: () => ho,
	toolsAndChat: () => Oo,
	usageCells: () => jo
}), ao = [
	10,
	25,
	50
];
function oo(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function so(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function co(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function lo(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function uo(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function fo(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
function po(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var mo = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function ho(e) {
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
function go(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function _o(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var vo = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, yo = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function bo(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn(yo, e.tool) && yo[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(vo, n) && vo[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function xo(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function So(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: go(e, mo)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || _o(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function Co(e) {
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
			label: `${Z(a)} ${bo(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function wo(e, t) {
	return e.every((e) => t.has(e));
}
function To(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function Eo(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function Do(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return To(e, t).map((e) => ({
		key: Eo(e, n.get(e) ?? 0),
		entry: e
	}));
}
function Oo(e, t, n) {
	return e ? [n, t] : [t, n];
}
function ko(e, t) {
	return (t.cost ?? -1) - (e.cost ?? -1) || t.turns - e.turns;
}
var Ao = [
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
function jo(e) {
	let t = ua(e);
	return [
		Z(e.turns),
		X(t),
		Qi(e.cache_read, t),
		X(e.output),
		Q(e.cost)
	];
}
//#endregion
//#region src/lib/themes.ts
var Mo = /* @__PURE__ */ t({
	THEMES: () => No,
	themeFooter: () => zo,
	themeLabel: () => Ro,
	themeName: () => Io
}), No = [
	"light",
	"dark",
	"hacker",
	"startup",
	"rgb"
], Po = { techbro: "rgb" }, Fo = {
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
function Io(e) {
	if (e == null) return null;
	let t = (Object.hasOwn(Po, e) ? Po[e] : e) ?? e;
	return No.includes(t) ? t : null;
}
function Lo(e) {
	return e !== null && Object.hasOwn(Fo, e) ? Fo[e] ?? {} : {};
}
function Ro(e, t) {
	let n = Lo(e);
	return Object.hasOwn(n, t) ? n[t] ?? t : t;
}
function zo(e) {
	return Lo(e).footer ?? "";
}
//#endregion
//#region src/lib/prefs.svelte.ts
var Bo = /* @__PURE__ */ t({
	Preferences: () => Wo,
	footerCopy: () => Ko,
	hype: () => $,
	preferences: () => Go,
	readPreference: () => Vo,
	savePreference: () => Ho,
	savedOption: () => Uo
});
function Vo(e) {
	try {
		return localStorage.getItem(`claude-usage.${e}`);
	} catch {
		return null;
	}
}
function Ho(e, t) {
	try {
		localStorage.setItem(`claude-usage.${e}`, String(t));
	} catch {}
}
function Uo(e, t) {
	let n = Vo(e);
	return n !== null && t.includes(n) ? n : null;
}
var Wo = class {
	#e = /* @__PURE__ */ j(Wt(Io(Vo("theme"))));
	#t = /* @__PURE__ */ j(Wt(lo(Vo("page_size"), ao, 25)));
	#n = /* @__PURE__ */ j(Vo("chat-oldest-first") === "true");
	get theme() {
		return H(this.#e);
	}
	set theme(e) {
		let t = Io(e);
		M(this.#e, t, !0), Ho("theme", t ?? "auto");
	}
	get pageSize() {
		return H(this.#t);
	}
	set pageSize(e) {
		ao.includes(e) && (M(this.#t, e, !0), Ho("page_size", String(e)));
	}
	get oldestFirst() {
		return H(this.#n);
	}
	set oldestFirst(e) {
		M(this.#n, e, !0), Ho("chat-oldest-first", String(e));
	}
}, Go = new Wo();
function $(e) {
	return Ro(Go.theme, e);
}
function Ko() {
	return zo(Go.theme);
}
//#endregion
//#region src/components/ChartTooltip.svelte
var qo = /* @__PURE__ */ U([[
	"div",
	{ class: "tooltip" },
	,
]]);
function Jo(e, t) {
	E(t, !0);
	let n = hi(t, "top", 3, 8);
	function r(e) {
		let r = e.parentElement?.clientWidth ?? 0;
		e.style.left = `${Ci(t.anchor, e.offsetWidth, r)}px`, e.style.top = `${n()}px`;
	}
	var i = qo();
	Mr(P(i), () => t.children), T(i), Vr(i, () => r), G(e, i), D();
}
//#endregion
//#region src/components/Chart.svelte
var Yo = /* @__PURE__ */ U([["rect", {
	class: "hit",
	tabindex: "0",
	role: "slider",
	"aria-valuemin": "1"
}]], 4), Xo = /* @__PURE__ */ U([[
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
function Zo(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => (t.cursor?.count ?? 0) - 1), r = /* @__PURE__ */ j(null), i = /* @__PURE__ */ k(() => H(r) === null ? H(n) : Math.min(H(r), H(n))), a = /* @__PURE__ */ j(null), o = /* @__PURE__ */ k(() => H(a) === null || H(n) < 0 ? null : Math.min(H(a), H(n))), s = /* @__PURE__ */ k(() => t.cursor?.area(t.width));
	function c(e) {
		M(r, Math.min(Math.max(0, e), H(n)), !0), M(a, H(r), !0);
	}
	function l(e) {
		let n = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
		t.cursor && n && c(t.cursor.indexAt(t.width)(xi(e.clientX, n.left, n.width, t.width)));
	}
	function u(e) {
		if (!t.cursor) return;
		let n = Si(e.key, H(i), t.cursor.count);
		n !== null && (c(n), e.preventDefault());
	}
	var d = Xo(), f = F(d), p = P(f), m = P(p);
	Mr(m, () => t.plot, () => t.width);
	var h = L(m), g = (e) => {
		var n = W();
		Mr(F(n), () => t.marks ?? v, () => t.width, () => H(o)), G(e, n);
	};
	q(h, (e) => {
		H(o) !== null && e(g);
	}), T(p);
	var _ = L(p), y = (e) => {
		var n = Yo();
		R((e, r) => {
			Y(n, "x", H(s).x), Y(n, "y", H(s).y), Y(n, "width", e), Y(n, "height", H(s).height), Y(n, "aria-label", t.cursor.label), Y(n, "aria-valuemax", t.cursor.count), Y(n, "aria-valuenow", H(i) + 1), Y(n, "aria-valuetext", r);
		}, [() => Math.max(1, H(s).width), () => t.cursor.valueText(H(i))]), dr("pointermove", n, l), ur("focus", n, () => c(H(i))), dr("keydown", n, u), ur("pointerleave", n, () => M(a, null)), ur("blur", n, () => M(a, null)), G(e, n);
	};
	q(_, (e) => {
		t.cursor && H(s) && H(n) >= 0 && e(y);
	}), T(f);
	var ee = L(f), b = (e) => {
		{
			let n = /* @__PURE__ */ k(() => t.cursor.tipX(t.width, H(o)) * bi(t.containerWidth, t.width));
			Jo(e, {
				get anchor() {
					return H(n);
				},
				get top() {
					return t.tipTop;
				},
				children: (e, n) => {
					var r = W();
					Mr(F(r), () => t.tip, () => H(o)), G(e, r);
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
fr(["pointermove", "keydown"]);
//#endregion
//#region src/components/ChartCard.svelte
var Qo = /* @__PURE__ */ U([[
	"span",
	{ class: "muted" },
	" "
]]), $o = /* @__PURE__ */ U([[
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
function es(e, t) {
	let n = /* @__PURE__ */ j(!1);
	var r = $o(), i = P(r), a = P(i), o = I(a, !0), s = L(a, 2), c = (e) => {
		var n = Qo(), r = I(n, !0);
		R(() => K(r, t.note)), G(e, n);
	};
	q(s, (e) => {
		t.note && e(c);
	});
	var l = L(s, 2);
	Mr(l, () => t.controls ?? v);
	var u = L(l, 4);
	T(i);
	var d = L(i, 2);
	Mr(d, () => t.legend ?? v);
	var f = L(d, 2);
	Mr(f, () => t.chart);
	var p = L(f, 2), m = (e) => {
		var n = W();
		Mr(F(n), () => t.table), G(e, n);
	};
	q(p, (e) => {
		H(n) && e(m);
	}), Mr(L(p, 2), () => t.extra ?? v), T(r), R(() => {
		Y(r, "aria-labelledby", `${t.id ?? ""}-title`), Y(a, "id", `${t.id ?? ""}-title`), K(o, t.title), Y(u, "id", `${t.id ?? ""}-table-toggle`), Y(u, "aria-pressed", H(n));
	}), dr("click", u, () => M(n, !H(n))), G(e, r);
}
fr(["click"]);
//#endregion
//#region src/components/Swatch.svelte
var ts = /* @__PURE__ */ U([["span", { class: "swatch" }]]);
function ns(e, t) {
	var n = ts();
	let r;
	R(() => r = Qr(n, "", r, { background: t.fill })), G(e, n);
}
//#endregion
//#region node_modules/svelte/src/reactivity/map.js
var rs = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ j(0);
	#n = /* @__PURE__ */ j(0);
	#r = qn || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return qn === this.#r ? /* @__PURE__ */ j(e) : It(e);
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
}, is = /* @__PURE__ */ t({
	keepScroll: () => os,
	scrollAnchor: () => as
});
function as(e) {
	for (let t of e) {
		let e = t.getBoundingClientRect();
		if (e.bottom > 0) return {
			node: t,
			top: e.top
		};
	}
	return null;
}
function os(e, t) {
	e && t && t.isConnected && window.scrollBy(0, t.getBoundingClientRect().top - e.top);
}
//#endregion
//#region src/components/Pager.svelte
var ss = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), cs = /* @__PURE__ */ U([[
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
function ls(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => (t.units.at(-1) ?? -1) + 1), r = /* @__PURE__ */ k(() => ps(t.key, H(n))), i = /* @__PURE__ */ k(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function a() {
		fs.first(t.key) !== H(r).first && fs.set(t.key, H(r).first);
	}
	a();
	function o(e, r) {
		let i = e.closest(".pager"), a = as(i ? [i] : []);
		fs.set(t.key, so(H(n), Go.pageSize, r).first), Et(), os(a, i);
	}
	function s(e, t) {
		let n = e.closest(".pager"), r = as(n ? [n] : []);
		Go.pageSize = t, Et(), os(r, n);
	}
	function c() {
		let { first: e, last: n } = H(r);
		t.rows?.forEach((r, i) => {
			let a = t.units[i];
			a !== void 0 && r.classList.toggle("off-page", a < e || a >= n);
		});
	}
	var l = cs(), u = P(l);
	J(u, 20, () => ao, (e) => e, (e, n) => {
		var r = ss(), i = I(r), a = {};
		R(() => {
			K(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), G(e, r);
	}), T(u);
	var d;
	ni(u);
	var f = L(u, 2), p = L(f, 2), m = I(p, !0), h = L(p, 2);
	T(l), Vr(l, () => c), R((e) => {
		Y(u, "id", `pager-${t.key ?? ""}-size`), Y(u, "aria-label", `${H(i) ?? ""} per page`), d !== (d = Go.pageSize) && (u.value = (u.__value = d) ?? "", ti(u, d)), Y(f, "id", `pager-${t.key ?? ""}-previous`), f.disabled = H(r).page === 0, K(m, e), Y(h, "id", `pager-${t.key ?? ""}-next`), h.disabled = H(r).page === H(r).pages - 1;
	}, [() => co(H(r), H(n), t.noun)]), dr("change", u, (e) => s(e.currentTarget, Number(e.currentTarget.value))), dr("click", f, (e) => o(e.currentTarget, H(r).page - 1)), dr("click", h, (e) => o(e.currentTarget, H(r).page + 1)), G(e, l), D();
}
fr(["change", "click"]);
//#endregion
//#region src/lib/paging.svelte.ts
var us = /* @__PURE__ */ t({
	TablePages: () => ds,
	mountPager: () => hs,
	releaseDetachedPagers: () => gs,
	shownWindow: () => ps,
	tablePages: () => fs
}), ds = class {
	#e = new rs();
	first(e) {
		return this.#e.get(e) ?? 0;
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	forget(e) {
		this.#e.delete(e);
	}
}, fs = new ds();
function ps(e, t) {
	return so(t, Go.pageSize, Math.floor(fs.first(e) / Go.pageSize));
}
var ms = /* @__PURE__ */ new Set();
function hs(e) {
	let t = document.createElement("div"), n = Er(ls, {
		target: t,
		props: e
	});
	Et();
	let r = t.firstElementChild;
	if (!(r instanceof HTMLElement)) throw Error("The pager drew no element");
	return ms.add({
		component: n,
		root: r
	}), r;
}
function gs() {
	for (let e of [...ms]) e.root.isConnected || (ms.delete(e), Ar(e.component));
}
//#endregion
//#region src/components/TableView.svelte
var _s = /* @__PURE__ */ U([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), vs = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), ys = /* @__PURE__ */ U([[
	"th",
	{ scope: "col" },
	" "
]]), bs = /* @__PURE__ */ U([[
	"tr",
	null,
	,
]]), xs = /* @__PURE__ */ U([[
	"table",
	null,
	[
		"thead",
		null,
		["tr"]
	],
	["tbody"]
]]), Ss = /* @__PURE__ */ U([
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
function Cs(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = W(), o = F(n), s = (e) => {
			ls(e, {
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
			H(a) > ao[0] && e(s);
		}), G(e, n);
	}, r = hi(t, "noun", 3, "rows"), i = /* @__PURE__ */ k(() => oo(t.rows.map((e) => t.sub?.(e) ?? !1))), a = /* @__PURE__ */ k(() => (H(i).at(-1) ?? -1) + 1), o = /* @__PURE__ */ k(() => ps(t.key, H(a))), s = /* @__PURE__ */ k(() => t.rows.filter((e, t) => {
		let n = H(i)[t] ?? 0;
		return n >= H(o).first && n < H(o).last;
	}));
	var c = Ss(), l = F(c), u = (e) => {
		var r = W(), i = F(r), o = (e) => {
			var r = _s(), i = P(r);
			Mr(i, () => t.heading);
			var a = L(i, 2);
			n(a), T(r), G(e, r);
		}, s = (e) => {
			var n = W();
			Mr(F(n), () => t.heading), G(e, n);
		};
		q(i, (e) => {
			H(a) > ao[0] ? e(o) : e(s, -1);
		}), G(e, r);
	};
	q(l, (e) => {
		t.heading && e(u);
	});
	var d = L(l, 2);
	Mr(d, () => t.intro ?? v);
	var f = L(d, 2), p = P(f), m = (e) => {
		n(e);
	};
	q(p, (e) => {
		t.heading || e(m);
	});
	var h = L(p, 2), g = (e) => {
		var n = vs(), r = I(n, !0);
		R(() => K(r, t.empty)), G(e, n);
	}, _ = (e) => {
		var n = xs(), r = P(n), i = P(r);
		J(i, 21, () => t.columns, (e) => e.label, (e, t) => {
			var n = ys(), r = I(n, !0);
			R(() => {
				Xr(n, 1, Wr(H(t).numeric ? "num" : void 0)), K(r, H(t).label);
			}), G(e, n);
		}), T(i), T(r);
		var a = L(r);
		J(a, 21, () => H(s), (e) => t.rowKey(e), (e, n) => {
			var r = bs();
			Mr(P(r), () => t.cells, () => H(n)), T(r), R((e) => Xr(r, 1, e), [() => Wr(t.sub?.(H(n)) ? "sub-row" : t.group?.(H(n)) ? "group-row" : void 0)]), G(e, r);
		}), T(a), T(n), R(() => Y(n, "aria-labelledby", t.labelledby)), G(e, n);
	};
	q(h, (e) => {
		t.rows.length === 0 && t.empty !== void 0 ? e(g) : e(_, -1);
	}), T(f), G(e, c), D();
}
//#endregion
//#region src/components/XLabels.svelte
var ws = /* @__PURE__ */ U([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4);
function Ts(e, t) {
	E(t, !0);
	var n = W();
	J(F(n), 16, () => wi(t.count, t.most), (e) => e, (e, n) => {
		var r = ws(), i = I(r, !0);
		R((e, n) => {
			Y(r, "x", e), Y(r, "y", t.y), K(i, n);
		}, [() => t.xOf(n), () => t.text(n)]), G(e, r);
	}), G(e, n), D();
}
//#endregion
//#region src/components/YAxis.svelte
var Es = /* @__PURE__ */ U([["line", { "stroke-width": "1" }], [
	"text",
	{
		"text-anchor": "end",
		class: "axis-text"
	},
	" "
]], 5);
function Ds(e, t) {
	E(t, !0);
	var n = W();
	J(F(n), 18, () => t.values, (e) => e, (e, n, r) => {
		let i = /* @__PURE__ */ k(() => Ti(t.yOf(n)));
		var a = Es(), o = F(a), s = L(o), c = I(s, !0);
		R((e) => {
			Y(o, "x1", t.left), Y(o, "x2", t.right), Y(o, "y1", H(i)), Y(o, "y2", H(i)), Y(o, "stroke", H(r) === 0 ? "var(--axis)" : "var(--grid)"), Y(s, "x", t.left - 8), Y(s, "y", H(i) + 4), K(c, e);
		}, [() => t.format(n)]), G(e, a);
	}), G(e, n), D();
}
//#endregion
//#region src/components/ByModel.svelte
var Os = /* @__PURE__ */ U([[
	"button",
	{ type: "button" },
	" "
]]), ks = /* @__PURE__ */ U([["div", {
	class: "segmented",
	role: "group",
	"aria-label": "Metric"
}]]), As = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), js = /* @__PURE__ */ U([[
	"span",
	{ class: "legend-group" },
	[
		"strong",
		null,
		" "
	],
	" ",
	,
]]), Ms = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), Ns = /* @__PURE__ */ U([[
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
]], 4), Ps = /* @__PURE__ */ U([["defs"]], 4), Fs = /* @__PURE__ */ U([["path"]], 4), Is = /* @__PURE__ */ U([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), Ls = /* @__PURE__ */ U([
	,
	,
	,
], 5), Rs = /* @__PURE__ */ U([
	,
	,
	,
	,
	,
], 5), zs = /* @__PURE__ */ U([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), Bs = /* @__PURE__ */ U([[
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
]]), Vs = /* @__PURE__ */ U([
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
], 1), Hs = /* @__PURE__ */ U([[
	"div",
	{ class: "name" },
	"No usage"
]]), Us = /* @__PURE__ */ U([[
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
]]), Ws = /* @__PURE__ */ U([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	,
], 1), Gs = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), Ks = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), qs = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function Js(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = ks();
		J(t, 20, () => za, (e) => e, (e, t) => {
			var n = Os(), r = I(n, !0);
			R(() => {
				Y(n, "aria-pressed", H(s) === t), K(r, Ra[t].label);
			}), dr("click", n, () => _(t)), G(e, n);
		}), T(t), G(e, t);
	}, r = (e) => {
		var t = Ms(), n = P(t), r = (e) => {
			var t = W();
			J(F(t), 17, () => Za(H(c).series), (e) => e.model, (e, t) => {
				var n = js(), r = P(n), i = I(r, !0);
				J(L(r, 2), 17, () => H(t).entries, ({ entry: e, text: t }) => e.key, (e, t) => {
					let n = () => H(t).entry, r = () => H(t).text;
					var i = As(), a = P(i);
					{
						let e = /* @__PURE__ */ k(() => Ui(n().color, n().hatch, n().turn));
						ns(a, { get fill() {
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
		var t = Gs(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => Ua(t(), H(a).length)), r = /* @__PURE__ */ k(() => ya(H(c).totals));
				var s = Rs(), l = F(s), d = (e) => {
					var t = Ps();
					J(t, 21, () => H(u).patterns, ({ id: e, entry: t }) => e, (e, t) => {
						let n = () => H(t).id, r = () => H(t).entry;
						var i = Ns(), a = P(i), o = L(a);
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
					let e = /* @__PURE__ */ k(() => fa(H(f), 4));
					Ds(p, {
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
					Ts(m, {
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
					let l = /* @__PURE__ */ k(() => Ga(t(), H(a).length, H(s)));
					var d = Ls(), p = F(d);
					J(p, 17, () => Ka(H(c).series, i, H(f)), ({ entry: e, segment: t }) => e.key, (e, t) => {
						let r = () => H(t).entry, i = () => H(t).segment;
						var a = Fs();
						R((e, t) => {
							Y(a, "d", e), Y(a, "fill", t);
						}, [() => va(H(l), i().y, H(n).barWidth, i().height, i().top), () => H(u).fill(r())]), G(e, a);
					});
					var m = L(p), h = (e) => {
						let t = /* @__PURE__ */ k(() => H(c).totals[H(s)] ?? 0);
						var r = Is(), i = I(r, !0);
						R((e) => {
							Y(r, "x", H(l) + H(n).barWidth / 2), Y(r, "y", 220 - 220 * H(t) / H(f) - 6), K(i, e);
						}, [() => H(o)(H(t))]), G(e, r);
					};
					q(m, (e) => {
						H(s) === H(r) && (H(c).totals[H(s)] ?? 0) > 0 && e(h);
					}), G(e, d);
				}), G(e, s);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ k(() => Ua(t(), H(a).length).band);
				var i = zs();
				R(() => {
					Y(i, "x", 56 + H(r) * n()), Y(i, "width", H(r)), Y(i, "height", 220);
				}), G(e, i);
			}, r = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => H(a)[t()] ?? ""), r = /* @__PURE__ */ k(() => Qa(H(c).series, H(n)));
				var s = Ws(), l = F(s), u = I(l, !0), d = L(l, 2);
				J(d, 17, () => H(r), (e) => e.model, (e, t) => {
					var n = Vs(), r = F(n), i = P(r), a = I(i, !0), s = I(L(i), !0);
					T(r), J(L(r, 2), 17, () => H(t).efforts, ({ entry: e, text: t, value: n }) => e.key, (e, t) => {
						let n = () => H(t).entry, r = () => H(t).text, i = () => H(t).value;
						var a = Bs(), s = P(a), c = P(s);
						{
							let e = /* @__PURE__ */ k(() => Ui(n().color, n().hatch, n().turn));
							ns(c, { get fill() {
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
					G(e, Hs());
				});
				var f = L(d, 2), p = (e) => {
					var n = Us(), r = I(L(P(n)), !0);
					T(n), R((e) => K(r, e), [() => H(o)(H(c).totals[t()] ?? 0)]), G(e, n);
				};
				q(f, (e) => {
					H(r).length > 1 && e(p);
				}), R((e) => K(u, e), [() => H(i).long(H(n))]), G(e, s);
			}, i = /* @__PURE__ */ k(() => H(c).buckets), a = /* @__PURE__ */ k(() => H(i).keys), o = /* @__PURE__ */ k(() => H(c).metric.format);
			{
				let i = /* @__PURE__ */ k(() => Ja(H(c).metric, H(l)));
				Zo(e, {
					get height() {
						return Va;
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
		}), T(t), fi(t, "clientWidth", (e) => M(m, e)), G(e, t);
	}, a = (e) => {
		var t = W(), n = F(t), r = (e) => {
			let t = (e, t = v) => {
				var r = qs(), i = F(r), a = I(i, !0);
				J(L(i, 2), 18, () => H(n).others, (e) => e, (e, n, r) => {
					var i = Ks(), a = I(i, !0);
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
				Cs(e, {
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
	}, o = /* @__PURE__ */ k(() => no.summary), s = /* @__PURE__ */ j(Wt(Ba(Vo("metric")))), c = /* @__PURE__ */ k(() => H(o) ? Ha(H(o), H(s)) : null), l = /* @__PURE__ */ k(() => H(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ k(() => H(c) ? qa(H(c).series) : null), d = /* @__PURE__ */ k(() => H(o) ? H(l) === "hour" ? $("Per hour, by model and effort") : $("Per day, by model and effort") : $("Per day, by model")), f = /* @__PURE__ */ k(() => da(Math.max(...H(c)?.totals ?? [], 0))), p = /* @__PURE__ */ k(() => H(c) ? $a(H(c)) : null), m = /* @__PURE__ */ j(0), h = /* @__PURE__ */ k(() => yi(H(m))), g = /* @__PURE__ */ k(() => H(c) ? {
		count: H(c).buckets.keys.length,
		label: Ya(H(c).metric, H(l)),
		valueText: (e) => Xa(H(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: Ua(e, H(c).buckets.keys.length).right - 56,
			height: 220
		}),
		indexAt: (e) => Wa(e, H(c).buckets.keys.length),
		tipX: (e, t) => 56 + Ua(e, H(c).buckets.keys.length).band * (t + .5)
	} : null);
	function _(e) {
		M(s, e, !0), Ho("metric", e);
	}
	es(e, {
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
fr(["click"]);
//#endregion
//#region src/lib/costly.ts
var Ys = [{
	label: "Cache reads",
	color: "var(--split-soft)",
	value: (e) => Fa(e).cacheRead
}, {
	label: "Everything else",
	color: "var(--split-strong)",
	note: "new input, cache writes, output and web searches",
	value: (e) => Fa(e).rest
}];
function Xs(e) {
	return e.note ? `${e.label} (${e.note})` : e.label;
}
function Zs(e) {
	return e.title || "Untitled session";
}
function Qs(e) {
	return `#session/${encodeURIComponent(e.session_id)}`;
}
function $s(e) {
	let t = Ia(e);
	return e.map((e) => {
		let n = Zs(e), r = Ys.map((t) => ({
			part: t,
			amount: t.value(e)
		})), i = r.map(({ part: e, amount: t }) => `${e.label} ${Q(t)}`).join(", ");
		return {
			session: e,
			title: n,
			href: Qs(e),
			detail: `${e.project} · ${Z(e.turns)} turns · avg context ${X(e.context_avg)}`,
			share: La(e.cost, t),
			cost: Q(e.cost),
			parts: r,
			label: `${n}: ${Q(e.cost)}; ${i}`
		};
	});
}
function ec(e) {
	let { session: t } = e;
	return {
		title: e.title,
		parts: e.parts.map(({ part: e, amount: n }) => ({
			label: e.label,
			color: e.color,
			amount: Q(n),
			share: Qi(n, t.cost || 0)
		})),
		total: e.cost,
		context: `${Z(t.turns)} turns · context avg ${X(t.context_avg)}, peak ${X(t.context_peak)}`
	};
}
function tc(e) {
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
			...Ys.map((e) => ({
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
				...Ys.map((t) => Q(t.value(e))),
				Q(e.cost)
			]
		}))
	};
}
//#endregion
//#region src/components/CostPerSession.svelte
var nc = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), rc = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), ic = /* @__PURE__ */ U([["span"]]), ac = /* @__PURE__ */ U([[
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
]]), oc = /* @__PURE__ */ U([[
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
]]), sc = /* @__PURE__ */ U([
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
], 1), cc = /* @__PURE__ */ U([
	["div", { class: "bars" }],
	" ",
	,
], 1), lc = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	"No sessions in this range."
]]), uc = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), dc = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), fc = /* @__PURE__ */ U([
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
function pc(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = rc(), n = P(t), r = (e) => {
			var t = W();
			J(F(t), 17, () => Ys, (e) => e.label, (e, t) => {
				var n = nc(), r = P(n);
				ns(r, { get fill() {
					return H(t).color;
				} });
				var i = L(r, 1, !0);
				T(n), R((e) => K(i, e), [() => Xs(H(t))]), G(e, n);
			}), G(e, t);
		};
		q(n, (e) => {
			H(a) && e(r);
		}), T(t), G(e, t);
	}, r = (e) => {
		var t = uc(), n = P(t), r = (e) => {
			var t = W(), n = F(t), r = (e) => {
				var t = cc(), n = F(t);
				J(n, 21, () => H(s), (e) => e.session.session_id, (e, t) => {
					var n = ac(), r = P(n), i = P(r), a = I(i, !0), o = I(L(i), !0);
					T(r);
					var s = L(r, 2), c = P(s);
					let l;
					J(c, 21, () => H(t).parts, ({ part: e, amount: t }) => e.label, (e, t) => {
						let n = () => H(t).part, r = () => H(t).amount;
						var i = W(), a = F(i), o = (e) => {
							var t = ic();
							let i;
							R(() => i = Qr(t, "", i, {
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
						Y(n, "href", H(t).href), Y(n, "aria-label", H(t).label), K(a, H(t).title), K(o, H(t).detail), l = Qr(c, "", l, { width: e }), K(u, H(t).cost);
					}, [() => `${H(t).share.toFixed(2) ?? ""}%`]), dr("pointermove", n, (e) => p(e, H(t).session.session_id)), ur("focus", n, (e) => p(e, H(t).session.session_id)), ur("pointerleave", n, m), ur("blur", n, m), G(e, n);
				}), T(n);
				var r = L(n, 2), i = (e) => {
					Jo(e, {
						get anchor() {
							return H(u).anchor;
						},
						get top() {
							return H(u).top;
						},
						children: (e, t) => {
							var n = sc(), r = F(n), i = I(r, !0), a = L(r, 2);
							J(a, 17, () => H(f).parts, (e) => e.label, (e, t) => {
								var n = oc(), r = P(n);
								ns(r, { get fill() {
									return H(t).color;
								} });
								var i = L(r), a = I(i, !0), o = I(L(i));
								T(n), R(() => {
									K(a, H(t).amount), K(o, `${H(t).label ?? ""} · ${H(t).share ?? ""}`);
								}), G(e, n);
							});
							var o = L(a, 2), s = P(o);
							ns(s, { fill: null });
							var c = I(L(s), !0);
							Ae(), T(o);
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
				G(e, lc());
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
				var r = fc(), i = F(r), a = P(i), o = I(a, !0), s = I(L(a), !0);
				T(i), J(L(i, 2), 19, () => H(n), (e) => e.label, (e, n, r) => {
					var i = dc(), a = I(i, !0);
					R(() => K(a, t().cells[H(r)])), G(e, i);
				}), R((e, n) => {
					Y(a, "href", e), K(o, n), K(s, t().session.project);
				}, [() => Qs(t().session), () => Zs(t().session)]), G(e, r);
			}, n = /* @__PURE__ */ k(() => H(c).head.slice(1));
			Cs(e, {
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
	}, a = /* @__PURE__ */ k(() => no.summary), o = /* @__PURE__ */ k(() => H(a)?.costly_sessions ?? []), s = /* @__PURE__ */ k(() => $s(H(o))), c = /* @__PURE__ */ k(() => tc(H(o))), l = /* @__PURE__ */ k(() => $("Cost per session")), u = /* @__PURE__ */ j(null), d = /* @__PURE__ */ k(() => H(u) ? H(s).find((e) => e.session.session_id === H(u)?.id) : void 0), f = /* @__PURE__ */ k(() => H(d) ? ec(H(d)) : null);
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
	es(e, {
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
fr(["pointermove"]);
//#endregion
//#region src/lib/trend.ts
var mc = [
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
function hc(e) {
	let t = e * 116 + 22;
	return {
		top: t,
		bottom: t + 76
	};
}
function gc() {
	return hc(mc.length - 1).bottom + 28;
}
function _c(e, t = /* @__PURE__ */ new Date()) {
	let n = xa(e, t), r = Ca(n.unit === "hour" ? e.hour_model : e.day_model, n.keyOf);
	return {
		buckets: n,
		totals: n.keys.map((e) => r.get(e) ?? Sa)
	};
}
function vc(e, t) {
	return e.totals.map((e) => t.value(e));
}
function yc(e) {
	return `estimated cost, input and output tokens per ${e}`;
}
function bc(e) {
	return `Estimated cost, input tokens and output tokens per ${e}; table view available`;
}
function xc(e) {
	return `Estimated cost, input and output tokens per ${e}; arrow keys step through them`;
}
function Sc(e, t) {
	let n = e.totals[t] ?? Sa, r = mc.map((e) => `${e.label} ${e.format(e.value(n))}`).join(", ");
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${r}`;
}
function Cc(e) {
	let t = e.buckets.keys.map((t, n) => ({
		key: t,
		cells: [e.buckets.short(t), ...mc.map((t) => t.format(t.value(e.totals[n] ?? Sa)))]
	})).reverse();
	return {
		head: [e.buckets.heading, ...mc.map((e) => e.label)],
		rows: t
	};
}
//#endregion
//#region src/components/AreaLine.svelte
var wc = /* @__PURE__ */ U([["path", { "fill-opacity": "0.1" }], ["path", {
	fill: "none",
	"stroke-width": "2",
	"stroke-linejoin": "round",
	"stroke-linecap": "round"
}]], 5);
function Tc(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => t.values.map((e, n) => `${t.xOf(n).toFixed(1)},${t.yOf(e).toFixed(1)}`).join("L")), r = /* @__PURE__ */ k(() => `M${t.xOf(0)},${t.bottom}L${H(n)}L${t.xOf(t.values.length - 1)},${t.bottom}Z`);
	var i = W(), a = F(i), o = (e) => {
		var i = wc(), a = F(i), o = L(a);
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
var Ec = /* @__PURE__ */ U([["circle", {
	r: "4",
	stroke: "var(--surface)",
	"stroke-width": "2"
}]], 4);
function Dc(e, t) {
	var n = Ec();
	R(() => {
		Y(n, "cx", t.x), Y(n, "cy", t.y), Y(n, "fill", t.color);
	}), G(e, n);
}
//#endregion
//#region src/components/OverTime.svelte
var Oc = (e, t = v) => {
	var n = Lc(), r = F(n), i = I(r, !0);
	J(L(r, 2), 19, () => mc, (e) => e.label, (e, n, r) => {
		var i = Ic(), a = I(i, !0);
		R(() => K(a, t().cells[H(r) + 1])), G(e, i);
	}), R(() => K(i, t().cells[0])), G(e, n);
}, kc = /* @__PURE__ */ U([
	,
	,
	[
		"text",
		{ class: "value-text" },
		" "
	]
], 5), Ac = /* @__PURE__ */ U([
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
], 5), jc = /* @__PURE__ */ U([
	,
	,
	,
], 5), Mc = /* @__PURE__ */ U([["line", { class: "crosshair" }], ,], 5), Nc = /* @__PURE__ */ U([[
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
]]), Pc = /* @__PURE__ */ U([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
], 1), Fc = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), Ic = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), Lc = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function Rc(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Fc(), n = P(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ k(() => t() - 64), r = /* @__PURE__ */ k(() => ma(H(s).length, 56, H(n)));
				var a = jc(), o = F(a);
				J(o, 17, () => H(d), ({ panel: e, top: t, bottom: n, color: r, values: i, max: a, yOf: o }) => e.label, (e, t) => {
					let i = () => H(t).panel, a = () => H(t).top, o = () => H(t).bottom, s = () => H(t).color, c = () => H(t).values, l = () => H(t).max, u = () => H(t).yOf;
					var d = Ac(), f = F(d), p = L(f), m = I(p, !0), h = L(p);
					{
						let e = /* @__PURE__ */ k(() => fa(l(), 2));
						Ds(h, {
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
					Tc(g, {
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
						var a = kc(), o = F(a);
						{
							let e = /* @__PURE__ */ k(() => H(r)(H(t))), i = /* @__PURE__ */ k(() => u()(H(n)));
							Dc(o, {
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
					Ts(c, {
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
				let r = /* @__PURE__ */ k(() => ma(H(s).length, 56, t() - 64));
				var i = Mc(), a = F(i);
				J(L(a), 17, () => H(d), ({ panel: e, color: t, values: n, yOf: r }) => e.label, (e, t) => {
					let i = () => H(t).color, a = () => H(t).values, o = () => H(t).yOf;
					{
						let t = /* @__PURE__ */ k(() => H(r)(n())), s = /* @__PURE__ */ k(() => o()(a()[n()] ?? 0));
						Dc(e, {
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
				var n = Pc(), r = F(n), a = I(r, !0);
				J(L(r, 2), 17, () => H(d), ({ panel: e, color: t, values: n }) => e.label, (e, n) => {
					let r = () => H(n).panel, i = () => H(n).color, a = () => H(n).values;
					var o = Nc(), s = P(o);
					let c;
					var l = L(s, 2), u = I(l, !0), d = I(L(l, 2), !0);
					T(o), R((e) => {
						c = Qr(s, "", c, { background: i() }), K(u, e), K(d, r().label);
					}, [() => r().format(a()[t()] ?? 0)]), G(e, o);
				}), R((e) => K(a, e), [() => H(i).long(H(s)[t()] ?? "")]), G(e, n);
			}, i = /* @__PURE__ */ k(() => H(a).buckets), s = /* @__PURE__ */ k(() => H(i).keys);
			{
				let i = /* @__PURE__ */ k(gc), a = /* @__PURE__ */ k(() => bc(H(o)));
				Zo(e, {
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
		}), T(t), fi(t, "clientWidth", (e) => M(c, e)), G(e, t);
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
				Cs(e, {
					key: "trend-table",
					get columns() {
						return H(n);
					},
					get rows() {
						return H(s).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return Oc;
					}
				});
			}
		};
		q(n, (e) => {
			H(s) && e(r);
		}), G(e, t);
	}, i = /* @__PURE__ */ k(() => no.summary), a = /* @__PURE__ */ k(() => H(i) ? _c(H(i)) : null), o = /* @__PURE__ */ k(() => H(a)?.buckets.unit ?? "day"), s = /* @__PURE__ */ k(() => H(a) ? Cc(H(a)) : null), c = /* @__PURE__ */ j(0), l = /* @__PURE__ */ k(() => yi(H(c))), u = hc(mc.length - 1).bottom, d = /* @__PURE__ */ k(() => H(a) ? mc.map((e, t) => {
		let { top: n, bottom: r } = hc(t), i = vc(H(a), e), o = da(Math.max(...i, 0));
		return {
			panel: e,
			top: n,
			bottom: r,
			color: Ri(e.slot),
			values: i,
			max: o,
			yOf: (e) => r - 76 * e / o
		};
	}) : []), f = /* @__PURE__ */ k(() => H(a) ? {
		count: H(a).buckets.keys.length,
		label: xc(H(o)),
		valueText: (e) => Sc(H(a), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: u
		}),
		indexAt: (e) => ha(56, e - 64, H(a).buckets.keys.length),
		tipX: (e, t) => ma(H(a).buckets.keys.length, 56, e - 64)(t)
	} : null);
	{
		let t = /* @__PURE__ */ k(() => $("Over time")), i = /* @__PURE__ */ k(() => yc(H(o)));
		es(e, {
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
var zc = 148, Bc = "var(--status-critical)";
function Vc(e, t = /* @__PURE__ */ new Date()) {
	let n = xa(e, t), r = Ma(n.unit === "hour" ? e.api_errors.hour : e.api_errors.day, n.keyOf), i = n.keys.map((e) => r(e).limits), a = n.keys.map((e) => r(e).other), o = i.reduce((e, t) => e + t, 0), s = ya(i);
	return {
		buckets: n,
		limits: i,
		others: a,
		total: o,
		top: pa(Math.max(...i, 0)),
		peak: i[s] ? s : null,
		empty: !i.some(Boolean) && !a.some(Boolean)
	};
}
function Hc(e, t, n, r, i) {
	let { band: a, barWidth: o } = Ua(e, t), s = 120 * r / i;
	return {
		x: 56 + a * n + (a - o) / 2,
		y: 120 - s,
		width: o,
		height: s
	};
}
function Uc(e) {
	return `rate-limit hits per ${e}; other API errors are in the tooltip, the table view and the list`;
}
function Wc(e, t) {
	return `Rate-limit hits per ${e}: ${Z(t)} in the range; table view available`;
}
function Gc(e) {
	return `Rate-limit hits per ${e}; arrow keys step through them`;
}
function Kc(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${Z(e.limits[t])} rate-limit hits, ${Z(e.others[t])} other API errors`;
}
function qc(e, t) {
	return {
		when: e.buckets.long(e.buckets.keys[t] ?? ""),
		limits: Z(e.limits[t]),
		others: Z(e.others[t])
	};
}
function Jc(e) {
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
var Yc = [
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
function Xc(e, t) {
	return e.flatMap((e) => {
		let n = `${e.limit_type} ${e.resets_at}`;
		return [{
			key: n,
			kind: "window",
			name: Pa(e, t),
			cells: [
				$i(Na(e)),
				Z(e.hits),
				...jo(e.used)
			],
			sub: !1,
			group: e.models.length > 0
		}, ...e.models.slice().sort(ko).map((e) => ({
			key: `${n} ${e.model}`,
			kind: "model",
			name: e.model,
			cells: [
				"",
				"",
				...jo(e)
			],
			sub: !0,
			group: !1
		}))];
	});
}
function Zc(e) {
	return e.map((e) => ({
		key: e.record_id,
		when: sa(e.ts),
		error: ja(e),
		quota: Aa(e.limit_type),
		resets: sa(e.resets_at),
		session: {
			href: Qs(e),
			name: Zs(e),
			project: e.project
		},
		agent: e.agent_type
	}));
}
var Qc = [
	{ label: "When" },
	{ label: "Error" },
	{ label: "Quota" },
	{ label: "Resets" },
	{ label: "Session" },
	{ label: "Agent" }
], $c = (e) => {
	var t = gl(), n = I(t, !0);
	R((e) => K(n, e), [() => $("5-hour windows that hit the limit")]), G(e, t);
}, el = (e) => {
	G(e, _l());
}, tl = (e) => {
	var t = xl(), n = I(t, !0);
	R((e) => K(n, e), [() => $("Latest API errors")]), G(e, t);
}, nl = (e, t = v) => {
	var n = Sl(), r = F(n), i = I(r, !0), a = L(r, 2), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = I(l, !0), d = L(l, 2), f = P(d), p = I(f, !0), m = I(L(f), !0);
	T(d);
	var h = I(L(d, 2), !0);
	R(() => {
		K(i, t().when), K(o, t().error), K(c, t().quota), K(u, t().resets), Y(f, "href", t().session.href), K(p, t().session.name), K(m, t().session.project), K(h, t().agent);
	}), G(e, n);
}, rl = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), il = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), al = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	"No rate limits or API errors in this range."
]]), ol = /* @__PURE__ */ U([["path"]], 4), sl = /* @__PURE__ */ U([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), cl = /* @__PURE__ */ U([
	,
	,
	,
], 5), ll = /* @__PURE__ */ U([
	,
	,
	,
	,
], 5), ul = /* @__PURE__ */ U([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), dl = /* @__PURE__ */ U([
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
], 1), fl = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), pl = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), ml = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1), hl = /* @__PURE__ */ U([
	,
	,
	" ",
	,
], 1), gl = /* @__PURE__ */ U([[
	"h3",
	null,
	" "
]]), _l = /* @__PURE__ */ U([[
	"p",
	{ class: "note" },
	"what each window used from its start (its reset less 5 hours) up to its first hit, as the transcripts here show it;\n    the limit also counts what you use elsewhere"
]]), vl = /* @__PURE__ */ U([[
	"span",
	{ class: "window-model" },
	" "
]]), yl = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), bl = /* @__PURE__ */ U([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1), xl = /* @__PURE__ */ U([[
	"h3",
	null,
	" "
]]), Sl = /* @__PURE__ */ U([
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
function Cl(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = il(), n = P(t), r = (e) => {
			var t = rl(), n = P(t);
			ns(n, { get fill() {
				return Bc;
			} });
			var r = L(n);
			T(t), R(() => K(r, "⚠ Rate-limit hit")), G(e, t);
		};
		q(n, (e) => {
			H(c) && e(r);
		}), T(t), G(e, t);
	}, r = (e) => {
		var t = fl(), n = P(t), r = (e) => {
			var t = W(), n = F(t), r = (e) => {
				G(e, al());
			}, i = (e) => {
				let t = (e, t = v) => {
					let n = /* @__PURE__ */ k(() => Ua(t(), H(a).length));
					var r = ll(), o = F(r);
					{
						let e = /* @__PURE__ */ k(() => fa(H(c).top, 2));
						Ds(o, {
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
						Ts(s, {
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
						let i = /* @__PURE__ */ k(() => H(c).limits[H(r)] ?? 0), o = /* @__PURE__ */ k(() => Hc(t(), H(a).length, H(r), H(i), H(c).top));
						var s = cl(), l = F(s), u = (e) => {
							var t = ol();
							R((e) => {
								Y(t, "d", e), Y(t, "fill", Bc);
							}, [() => va(H(o).x, H(o).y, H(o).width, H(o).height, !0)]), G(e, t);
						};
						q(l, (e) => {
							H(o).height > 0 && e(u);
						});
						var d = L(l), f = (e) => {
							var t = sl(), n = I(t, !0);
							R((e) => {
								Y(t, "x", H(o).x + H(o).width / 2), Y(t, "y", H(o).y - 6), K(n, e);
							}, [() => Z(H(i))]), G(e, t);
						};
						q(d, (e) => {
							H(r) === H(c).peak && e(f);
						}), G(e, s);
					}), G(e, r);
				}, n = (e, t = v, n = v) => {
					let r = /* @__PURE__ */ k(() => Ua(t(), H(a).length).band);
					var i = ul();
					R(() => {
						Y(i, "x", 56 + H(r) * n()), Y(i, "width", H(r)), Y(i, "height", 120);
					}), G(e, i);
				}, r = (e, t = v) => {
					let n = /* @__PURE__ */ k(() => qc(H(c), t()));
					var r = dl(), i = F(r), a = I(i, !0), o = L(i, 2), s = P(o);
					ns(s, { get fill() {
						return Bc;
					} });
					var l = L(s), u = I(l, !0), d = I(L(l));
					T(o);
					var f = L(o, 2), p = P(f);
					ns(p, { fill: null });
					var m = I(L(p), !0);
					Ae(), T(f), R(() => {
						K(a, H(n).when), K(u, H(n).limits), K(d, "⚠ rate-limit hits"), K(m, H(n).others);
					}), G(e, r);
				}, i = /* @__PURE__ */ k(() => H(c).buckets), a = /* @__PURE__ */ k(() => H(i).keys);
				{
					let i = /* @__PURE__ */ k(() => Wc(H(l), H(c).total));
					Zo(e, {
						get height() {
							return zc;
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
		}), T(t), fi(t, "clientWidth", (e) => M(h, e)), G(e, t);
	}, i = (e) => {
		var t = W(), n = F(t), r = (e) => {
			let t = (e, t = v) => {
				var r = ml(), i = F(r), a = I(i, !0);
				J(L(i, 2), 19, () => H(n), (e) => e.label, (e, n, r) => {
					var i = pl(), a = I(i, !0);
					R(() => K(a, t().cells[H(r) + 1])), G(e, i);
				}), R(() => K(a, t().cells[0])), G(e, r);
			}, n = /* @__PURE__ */ k(() => H(d).head.slice(1));
			Cs(e, {
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
			var t = hl(), n = F(t);
			Cs(n, {
				key: "limit-windows",
				get columns() {
					return Yc;
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
					return $c;
				},
				get intro() {
					return el;
				},
				empty: "No 5-hour window hit its limit in this range."
			}), Cs(L(n, 2), {
				key: "limit-events",
				get columns() {
					return Qc;
				},
				get rows() {
					return H(p);
				},
				rowKey: (e) => e.key,
				get cells() {
					return nl;
				},
				get heading() {
					return tl;
				},
				empty: "No API errors in this range."
			}), G(e, t);
		};
		q(n, (e) => {
			H(s) && e(r);
		}), G(e, t);
	}, o = (e, t = v) => {
		var n = bl(), r = F(n), i = P(r), a = (e) => {
			var n = vl(), r = I(n, !0);
			R(() => K(r, t().name)), G(e, n);
		}, o = (e) => {
			var n = yr();
			R(() => K(n, t().name)), G(e, n);
		};
		q(i, (e) => {
			t().kind === "model" ? e(a) : e(o, -1);
		}), T(r), J(L(r, 2), 19, () => m, (e) => e.label, (e, n, r) => {
			var i = yl(), a = I(i, !0);
			R(() => K(a, t().cells[H(r)])), G(e, i);
		}), G(e, n);
	}, s = /* @__PURE__ */ k(() => no.summary), c = /* @__PURE__ */ k(() => H(s) ? Vc(H(s)) : null), l = /* @__PURE__ */ k(() => H(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ k(() => $("Rate limits")), d = /* @__PURE__ */ k(() => H(c) ? Jc(H(c)) : null), f = /* @__PURE__ */ k(() => H(s) ? Xc(H(s).api_errors.windows) : []), p = /* @__PURE__ */ k(() => H(s) ? Zc(H(s).api_errors.events) : []), m = Yc.slice(1), h = /* @__PURE__ */ j(0), g = /* @__PURE__ */ k(() => yi(H(h))), _ = /* @__PURE__ */ k(() => H(c) ? {
		count: H(c).buckets.keys.length,
		label: Gc(H(l)),
		valueText: (e) => Kc(H(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: Ua(e, H(c).buckets.keys.length).right - 56,
			height: 120
		}),
		indexAt: (e) => Wa(e, H(c).buckets.keys.length),
		tipX: (e, t) => 56 + Ua(e, H(c).buckets.keys.length).band * (t + .5)
	} : null);
	{
		let t = /* @__PURE__ */ k(() => H(c) ? Uc(H(l)) : void 0);
		es(e, {
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
//#region src/lib/tiles.ts
function wl(e, t = ta(/* @__PURE__ */ new Date()), n) {
	let r = e.history_since, i = r && r > e.since ? ` (history since ${na(r, n)})` : "";
	return e.days === 1 ? e.until === t ? "today" : ra(e.until, n) : `last ${e.days} days${i}`;
}
function Tl(e) {
	let t = [e.unpriced_turns ? `${Z(e.unpriced_turns)} turns of models without a price are not included` : "at API list prices"];
	return e.web_searches && t.push(`incl. ${Z(e.web_searches)} web searches, ${Q(e.cost_parts.web_search)}`), t.join(" · ");
}
var El = "Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.";
function Dl(e) {
	let t = e.compactions === 1 ? "1 compaction" : `${Z(e.compactions)} compactions`, n = e.unknown ? `${Z(e.unknown)} without an estimate` : null;
	if (!e.compactions) return {
		title: El,
		verdict: null,
		amount: null,
		count: `Compacting: ${n}`
	};
	let r = e.net >= 0;
	return {
		title: El,
		verdict: r ? "gain" : "loss",
		amount: r ? `▲ compacting saved ~${Q(e.net)} so far` : `▼ compacting cost ~${Q(-e.net)} more so far`,
		count: `(${[t, n].filter(Boolean).join(", ")})`
	};
}
function Ol(e) {
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
function kl(e, t) {
	let n = ua(t);
	return e.map((e) => `${e.label} ${Qi(e.tokens, n)}`).join(", ");
}
function Al(e, t) {
	return e?.turns ? `median context ${X(e.median)} per turn (p90 ${X(e.p90)})` + (t ? ` · compact hint at ${X(t)}` : "") : null;
}
function jl(e, t, n, r) {
	let i = e.api_ms_without_retries === null ? null : e.api_ms - e.api_ms_without_retries, a = "no time lost to retries";
	return i === null ? a = "retries are not in the transcripts" : i > 0 && (a = `${$i(i)} of it retries`), {
		session: `wall-clock, ${t}`,
		api: a,
		tools: r ? "from each call to its result, incl. waiting for permission" : `${Qi(e.tool_ms, e.duration_ms)} of the session time`,
		lines: n === null ? "no lines changed" : `${Q(n)} per 100 lines changed`
	};
}
function Ml(e) {
	return `${Z(e)} ${e === 1 ? "session" : "sessions"} that ended in the range`;
}
function Nl(e) {
	return e === "cost_record" ? "from its cost record" : "estimated from the transcripts";
}
function Pl(e) {
	let t = e.runtime.lines_added + e.runtime.lines_removed;
	return e.cost === null || t === 0 ? null : e.cost / t * 100;
}
//#endregion
//#region src/components/InputSplit.svelte
var Fl = /* @__PURE__ */ U([["span"]]), Il = /* @__PURE__ */ U([[
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
]]), Ll = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Rl = /* @__PURE__ */ U([[
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
function zl(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => ua(t.totals)), r = /* @__PURE__ */ k(() => Ol(t.totals)), i = /* @__PURE__ */ k(() => Al(t.context, t.hintTokens));
	var a = Rl(), o = P(a), s = I(o, !0), c = L(o, 2), l = I(c, !0), u = L(c, 2);
	J(u, 21, () => H(r).filter((e) => e.tokens > 0), (e) => e.label, (e, t) => {
		var n = Fl();
		let r;
		R(() => r = Qr(n, "", r, {
			"flex-grow": H(t).tokens,
			background: H(t).color
		})), G(e, n);
	}), T(u);
	var d = L(u, 2);
	J(d, 17, () => H(r), (e) => e.label, (e, t) => {
		var r = Il(), i = P(r);
		ns(i, { get fill() {
			return H(t).color;
		} });
		var a = L(i, 2), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = I(l, !0), d = I(L(l, 2), !0);
		T(r), R((e, n, i, a) => {
			Y(r, "title", H(t).note), K(o, e), K(c, n), K(u, i), K(d, a);
		}, [
			() => $(H(t).label),
			() => X(H(t).tokens),
			() => Qi(H(t).tokens, H(n)),
			() => Q(H(t).cost)
		]), G(e, r);
	});
	var f = L(d, 2), p = (e) => {
		var t = Ll();
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
		() => kl(H(r), t.totals)
	]), G(e, a), D();
}
//#endregion
//#region src/components/StatTile.svelte
var Bl = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Vl = /* @__PURE__ */ U([[
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
function Hl(e, t) {
	E(t, !0);
	let n = hi(t, "note", 3, null), r = hi(t, "themedNote", 3, !1);
	var i = Vl(), a = P(i), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = (e) => {
		var t = Bl(), i = I(t, !0);
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
var Ul = /* @__PURE__ */ U([
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
], 1), Wl = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	,
]]), Gl = /* @__PURE__ */ U([
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
function Kl(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => t.savings ? Dl(t.savings) : null);
	var r = Gl(), i = F(r), a = P(i), o = P(a), s = I(o, !0), c = L(o);
	T(a);
	var l = L(a, 2), u = I(l, !0), d = L(l, 2), f = I(d, !0), p = L(d, 2), m = (e) => {
		var t = Wl(), r = P(t), i = (e) => {
			var t = Ul(), r = F(t), i = I(r, !0), a = I(L(r, 2), !0);
			R(() => {
				Xr(r, 1, Wr(H(n).verdict === "gain" ? "verdict-gain" : "verdict-loss")), K(i, H(n).amount), K(a, H(n).count);
			}), G(e, t);
		}, a = (e) => {
			var t = yr();
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
	zl(h, {
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
		Hl(g, {
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
		Hl(_, {
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
		() => Tl(t.totals)
	]), G(e, r), D();
}
//#endregion
//#region src/components/RuntimeTiles.svelte
var ql = /* @__PURE__ */ U([
	,
	,
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function Jl(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => "source" in t.runtime && t.runtime.source === "transcripts"), r = /* @__PURE__ */ k(() => jl(t.runtime, t.from, t.costPer100Lines, H(n)));
	var i = ql(), a = F(i);
	{
		let e = /* @__PURE__ */ k(() => $i(t.runtime.duration_ms));
		Hl(a, {
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
		let e = /* @__PURE__ */ k(() => $i(t.runtime.api_ms));
		Hl(o, {
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
		let e = /* @__PURE__ */ k(() => $i(t.runtime.tool_ms));
		Hl(s, {
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
		Hl(c, {
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
var Yl = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]);
function Xl(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => no.summary);
	var r = W(), i = F(r), a = (e) => {
		var r = W(), i = F(r), a = (e) => {
			{
				let t = /* @__PURE__ */ k(() => wl(H(n)));
				Kl(e, {
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
				let t = /* @__PURE__ */ k(() => Ml(H(n).runtime.sessions));
				Jl(e, {
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
		var t = Yl(), n = I(t, !0);
		R(() => K(n, no.summaryFailed ? "Could not load the summary." : "Loading…")), G(e, t);
	};
	q(i, (e) => {
		H(n) ? e(a) : t.rows === "kpis" && e(o, 1);
	}), G(e, r), D();
}
//#endregion
//#region src/lib/usage.ts
function Zl(e) {
	return [{ label: e }, ...Ao];
}
function Ql(e, t) {
	return e.slice().sort(ko).map((e) => ({
		key: t(e),
		name: t(e),
		kind: "plain",
		swatch: null,
		cells: jo(e),
		sub: !1,
		group: !1
	}));
}
function $l(e, t, n) {
	return e.slice().sort(ko).flatMap((e) => [{
		key: e.model,
		name: e.model,
		kind: "model",
		swatch: Ri(n.get(e.model) ?? null),
		cells: jo(e),
		sub: !1,
		group: !0
	}, ...t.filter((t) => t.model === e.model && t.effort !== null).sort((e, t) => Ai(e.effort ?? "") - Ai(t.effort ?? "") || (e.effort ?? "").localeCompare(t.effort ?? "")).map((t) => ({
		key: `${e.model}\u0000${t.effort}`,
		name: Mi(t.effort),
		kind: "effort",
		swatch: null,
		cells: jo(t),
		sub: !0,
		group: !1
	}))]);
}
//#endregion
//#region src/components/UsageTable.svelte
var eu = /* @__PURE__ */ U([[
	"h2",
	null,
	" "
]]), tu = /* @__PURE__ */ U([[
	"p",
	{ class: "note" },
	" "
]]), nu = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), ru = /* @__PURE__ */ U([[
	"span",
	{ class: "effort" },
	" "
]]), iu = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), au = /* @__PURE__ */ U([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1), ou = /* @__PURE__ */ U([[
	"section",
	{ class: "card" },
	,
]]);
function su(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = eu(), r = I(n, !0);
		R(() => {
			Y(n, "id", `${t.id ?? ""}-title`), K(r, t.title);
		}), G(e, n);
	}, r = (e) => {
		var n = tu(), r = I(n, !0);
		R(() => K(r, t.note)), G(e, n);
	}, i = (e, t = v) => {
		var n = au(), r = F(n), i = P(r), o = (e) => {
			var n = nu(), r = P(n);
			ns(r, { get fill() {
				return t().swatch;
			} });
			var i = L(r, 1, !0);
			T(n), R(() => K(i, t().name)), G(e, n);
		}, s = (e) => {
			var n = ru(), r = I(n, !0);
			R(() => K(r, t().name)), G(e, n);
		}, c = (e) => {
			var n = yr();
			R(() => K(n, t().name)), G(e, n);
		};
		q(i, (e) => {
			t().kind === "model" ? e(o) : t().kind === "effort" ? e(s, 1) : e(c, -1);
		}), T(r), J(L(r, 2), 19, () => H(a), (e) => e.label, (e, n, r) => {
			var i = iu(), a = I(i, !0);
			R(() => K(a, t().cells[H(r)])), G(e, i);
		}), G(e, n);
	}, a = /* @__PURE__ */ k(() => Zl(t.nameLabel).slice(1));
	var o = ou(), s = P(o), c = (e) => {
		{
			let a = /* @__PURE__ */ k(() => Zl(t.nameLabel)), o = /* @__PURE__ */ k(() => t.note === void 0 ? void 0 : r);
			Cs(e, {
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
var cu = /* @__PURE__ */ U([
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
function lu(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ k(() => no.summary), r = /* @__PURE__ */ k(() => H(n) ? Ql(H(n).agent_type, (e) => e.agent_type) : null), i = /* @__PURE__ */ k(() => H(n) ? Oi([...new Set(H(n).day_model.map((e) => e.model))]) : null), a = /* @__PURE__ */ k(() => H(n) && H(i) ? $l(H(n).model, H(n).model_effort, H(i)) : null), o = /* @__PURE__ */ k(() => H(n) ? Ql(H(n).project, (e) => e.project) : null), s = /* @__PURE__ */ k(() => H(n) ? Ql(H(n).skill, (e) => e.skill) : null), c = /* @__PURE__ */ k(() => H(n) ? Ql(H(n).mcp_server, (e) => e.mcp_server) : null);
	var l = cu(), u = F(l), d = P(u);
	{
		let e = /* @__PURE__ */ k(() => $("By agent type"));
		su(d, {
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
		su(f, {
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
		su(p, {
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
		su(h, {
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
		su(g, {
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
var uu = class {
	#e = new rs();
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
}, du = /* @__PURE__ */ t({
	PAYOFF_WORDS: () => fu,
	compactCallKind: () => _u,
	compactionTotal: () => bu,
	delegateCallShown: () => vu,
	payoffAhead: () => hu,
	payoffText: () => gu,
	payoffTone: () => mu,
	spread: () => pu,
	verdictTone: () => yu
}), fu = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function pu(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function mu(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function hu(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${Z(t.pays_later_in)} replies`;
		return `${fu.later}: growing at its recent pace, the context reaches about ${X(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = Z(Math.round(t.calls_ahead));
	return `${fu[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function gu(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${Q(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${Z(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : Z(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${Z(e.breakeven_low)} replies)` : `would pay off after about ${Z(e.breakeven_calls)} replies` + pu(r(e.breakeven_low), r(e.breakeven_high));
}
function _u(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function vu(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function yu(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function bu(e) {
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
var xu = /* @__PURE__ */ t({
	liveCompactBadge: () => wu,
	liveSecretBadge: () => Cu,
	liveStateBadges: () => Tu,
	liveWaitBadge: () => Su,
	sessionWaits: () => Eu,
	waitChanged: () => Du
});
function Su(e) {
	if (!e) return null;
	let t = ` since ${sa(e.since)}`;
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
function Cu(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${Z(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${Z(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function wu(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${X(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = mu(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if (_u({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${Q(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${Z(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${fu[l]}: compacting now ${m}, ~${Z(Math.round(f))} ahead on average.`);
}
function Tu(e, t) {
	return [Cu(e.secrets), wu(e.current, t)].filter((e) => e !== null);
}
function Eu(e, t) {
	let n = Su(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : Su(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function Du(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/lib/overview.svelte.ts
var Ou = /* @__PURE__ */ t({
	mountSessionKpis: () => Nu,
	mountSessionRuntime: () => Pu,
	releaseDetachedTiles: () => Au
}), ku = /* @__PURE__ */ new Set();
function Au() {
	for (let e of [...ku]) e.holder.isConnected || (ku.delete(e), Ar(e.component));
}
function ju() {
	let e = document.createElement("div");
	return e.className = "kpis session-kpis", e;
}
function Mu(e, t) {
	return Et(), ku.add({
		component: e,
		holder: t
	}), queueMicrotask(Au), t;
}
function Nu(e) {
	let t = ju();
	return Mu(Er(Kl, {
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
function Pu(e) {
	let t = ju();
	return t.setAttribute("role", "group"), t.setAttribute("aria-label", "Time and lines changed"), Mu(Er(Jl, {
		target: t,
		props: {
			runtime: e.runtime,
			from: Nl(e.runtime.source),
			costPer100Lines: Pl(e)
		}
	}), t);
}
//#endregion
//#region src/lib/secrets.ts
var Fu = /* @__PURE__ */ t({
	secretReach: () => zu,
	secretTone: () => Iu,
	secretVia: () => Lu
});
function Iu(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function Lu(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var Ru = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function zu(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(Ru, e.reach) ? Ru[e.reach] ?? "" : "no result yet";
}
//#endregion
//#region src/legacy.svelte.ts
var Bu = [
	Wi,
	Ei,
	du,
	Fu,
	xu,
	io,
	la,
	Mo,
	Bo,
	us,
	is,
	eo,
	Ou
];
function Vu(e) {
	let t = new uu(), n = e.document.getElementById("error");
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
	let s = e.document.getElementById("limits-card");
	if (!s) throw Error("The page has no #limits-card container for the rate-limits section");
	let c = e.document.getElementById("usage-cards");
	if (!c) throw Error("The page has no #usage-cards container for the usage tables");
	let l = Er(_i, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	n.remove();
	let u = r.map(({ id: e, container: t }) => Er(Xl, {
		target: t,
		props: { rows: e }
	})), d = Er(Rc, { target: i }), f = Er(Js, { target: a }), p = Er(pc, { target: o }), m = Er(Cl, { target: s }), h = Er(lu, { target: c });
	return e.showError = (e, n) => {
		t.show(e, n), Et();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...Bu), { stop() {
		Ar(l);
		for (let e of u) Ar(e);
		Ar(d), Ar(f), Ar(p), Ar(m), Ar(h), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of Bu.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
Vu(window);
//#endregion

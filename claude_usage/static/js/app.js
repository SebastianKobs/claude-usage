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
function E(e) {
	if (e === null) throw Ce(), n;
	return T = e;
}
function De() {
	return E(/* @__PURE__ */ Zt(T));
}
function Oe(e) {
	if (w) {
		if (/* @__PURE__ */ Zt(T) !== null) throw Ce(), n;
		T = e;
	}
}
function ke(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ Zt(n);
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
		var i = /* @__PURE__ */ Zt(n);
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
var D = null;
function Ue(e) {
	D = e;
}
function We(e, t = !1, n) {
	D = {
		p: D,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: W,
		l: null
	};
}
function Ge(e) {
	var t = D, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) mn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, D = t.p, Ke(e);
}
function Ke(e = {}) {
	return d(e, pe, { value: !0 }), e;
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
	if (Je.length === 0 && !vt) {
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
var Qe = ~(S | C | x);
function O(e, t) {
	e.f = e.f & Qe | t;
}
function $e(e) {
	e.f & 512 || e.deps === null ? O(e, x) : O(e, C);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function et(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), O(e, x);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function tt(e) {
	var t = V, n = W;
	U(null), Fn(null);
	try {
		return e();
	} finally {
		U(t), Fn(n);
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
	var s = W, c = rt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
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
	var e = W, t = V, n = D, r = A;
	return function(i = !0) {
		Fn(e), U(t), Ue(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function it(e = !0) {
	Fn(null), U(null), Ue(null), e && A?.deactivate();
}
function at() {
	var e = W, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ot(e) {
	var t = 2 | S;
	return W !== null && (W.f |= oe), {
		ctx: D,
		deps: null,
		effects: null,
		equals: Me,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: r,
		wv: 0,
		parent: W,
		ac: null
	};
}
var st = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ct(e, t, n) {
	let i = W;
	i === null && Fe();
	var a = void 0, o = Pt(r), s = !V, c = /* @__PURE__ */ new Set();
	return _n(() => {
		var t = W, n = ee();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== be && n.reject(e);
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
			l?.(), c.delete(n), t !== st && (r.activate(), t ? (o.f |= de, Rt(o, t)) : (o.f & 8388608 && (o.f ^= de), Rt(o, e)), r.deactivate());
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
	return Ln(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function lt(e) {
	let t = /* @__PURE__ */ ot(e);
	return t.equals = Pe, t;
}
function ut(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function dt(e) {
	var t, n = W, i = e.parent;
	if (!Nn && i !== null && e.v !== r && i.f & 24576) return Se(), e.v;
	Fn(i);
	try {
		ut(e), t = Kn(e);
	} finally {
		Fn(n);
	}
	return t;
}
function ft(e) {
	var t = dt(e);
	if (!e.equals(t) && (e.wv = Un(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), gt?.capture(e, t, !0)), e.deps === null))) {
		O(e, x);
		return;
	}
	Nn || (j === null ? $e(e) : (fn() || A?.is_fork) && j.set(e, t));
}
function pt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && tt(() => {
		t.ac.abort(be), t.ac = null;
	}), t.fn !== null && (t.teardown = v), Yn(t, 0), Sn(t));
}
function mt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Xn(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var ht = null, A = null, gt = null, j = null, _t = null, vt = !1, yt = !1, bt = null, xt = null, St = 0, Ct = 1, wt = class e {
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
			for (r of n.m) O(r, C), t(r);
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
		for (let e of this.#d) O(e, C), this.schedule(e);
		this.apply();
		for (var t = bt = [], n = [], r = xt = []; this.#c.length > 0;) {
			St++ > 1e3 && (this.#S(), Et());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw jt(e), this.#h() || this.discard(), t;
			}
		}
		if (A = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (bt = null, xt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) At(e, t);
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
		this.#r.clear(), gt = this, Ot(n), Ot(t), gt = null, this.#s?.resolve();
		var o = A;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (M.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= x;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= x : i & 4 ? t.push(r) : Wn(r) && (i & 16 && this.#d.add(r), Xn(r));
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
			yt = !0, A = this, this.#_();
		} finally {
			St = 0, _t = null, bt = null, xt = null, yt = !1, A = null, j = null, M.clear();
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
			!yt && !vt && Xe(() => {
				t.#e || t.flush();
			});
		}
		return A;
	}
	apply() {
		j = null;
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
			e === null || (e.#n = t), t === null ? ht = e : t.#t = e, this.linked = !1;
		}
	}
};
function Tt(e) {
	var t = vt;
	vt = !0;
	try {
		var n;
		for (e && (A !== null && !A.is_fork && A.flush(), n = e());;) {
			if (Ze(), A === null) return n;
			A.flush();
		}
	} finally {
		vt = t;
	}
}
function Et() {
	try {
		Le();
	} catch (e) {
		ln(e, _t);
	}
}
var Dt = null;
function Ot(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Wn(r) && (Dt = /* @__PURE__ */ new Set(), Xn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Tn(r), Dt?.size > 0)) {
				M.clear();
				for (let e of Dt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Dt.has(n) && (Dt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Xn(n);
					}
				}
				Dt.clear();
			}
		}
		Dt = null;
	}
}
function kt(e) {
	A.schedule(e);
}
function At(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), O(e, x);
		for (var n = e.first; n !== null;) At(n, t), n = n.next;
	}
}
function jt(e) {
	O(e, x);
	for (var t = e.first; t !== null;) jt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Mt = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), Nt = !1;
function Pt(e, t) {
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
function N(e, t) {
	let n = Pt(e, t);
	return Ln(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Ft(e, t = !1, n = !0) {
	let r = Pt(e);
	return t || (r.equals = Pe), r;
}
function P(e, t, n = !1) {
	return V !== null && (!H || V.f & 131072) && qe() && V.f & 4325394 && (In === null || !In.has(e)) && Ve(), Rt(e, n ? Ht(t) : t, xt);
}
var It = null, Lt = 0;
function Rt(e, t, n = null) {
	if (!e.equals(t)) {
		Nn ? M.set(e, t) : M.has(e) || M.set(e, e.v);
		var r = wt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && dt(t), j === null && $e(t);
		}
		e.wv = Un(), It = null, Lt = 0, Vt(e, S, n), It = null, qe() && W !== null && W.f & 1024 && !(W.f & 96) && (q === null ? Rn([e]) : q.push(e)), !r.is_fork && Mt.size > 0 && !Nt && zt();
	}
	return t;
}
function zt() {
	Nt = !1;
	for (let e of Mt) {
		e.f & 1024 && O(e, C);
		let t;
		try {
			t = Wn(e);
		} catch {
			t = !0;
		}
		t && Xn(e);
	}
	Mt.clear();
}
function Bt(e) {
	P(e, e.v + 1);
}
function Vt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = qe(), a = r.length;
		if (Lt += a, Lt > 1e5 && It === null && (It = /* @__PURE__ */ new Set()), It !== null) {
			if (It.has(e)) return;
			It.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== W) {
				var l = (c & S) === 0;
				if (l && O(s, t), c & 131072) Mt.add(s);
				else if (c & 2) {
					var u = s;
					j?.delete(u), Vt(u, C, n);
				} else if (l) {
					var d = s;
					c & 16 && Dt !== null && Dt.add(d), n === null ? kt(d) : n.push(d);
				}
			}
		}
	}
}
function Ht(e) {
	if (typeof e != "object" || !e || fe in e || pe in e) return e;
	let t = g(e);
	if (t !== m && t !== h) return e;
	var n = /* @__PURE__ */ new Map(), i = s(e), a = /* @__PURE__ */ N(0), o = null, c = Vn, l = (e) => {
		if (Vn === c) return e();
		var t = V, n = Vn;
		U(null), Hn(c);
		var r = e();
		return U(t), Hn(n), r;
	};
	return i && n.set("length", /* @__PURE__ */ N(e.length, o)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && ze();
			var i = n.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ N(r.value, o);
				return n.set(t, e), e;
			}) : P(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = n.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ N(r, o));
					n.set(t, e), Bt(a);
				}
			} else P(i, r), Bt(a);
			return !0;
		},
		get(t, i, a) {
			if (i === fe) return e;
			var s = n.get(i), c = i in t;
			if (s === void 0 && (!c || f(t, i)?.writable) && (s = l(() => /* @__PURE__ */ N(Ht(c ? t[i] : r), o)), n.set(i, s)), s !== void 0) {
				var u = J(s);
				return u === r ? void 0 : u;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var i = Reflect.getOwnPropertyDescriptor(e, t), a = n.get(t);
			if (a !== void 0) {
				var o = J(a);
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
			return (i !== void 0 || W !== null && (!a || f(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ N(a ? Ht(e[t]) : r, o)), n.set(t, i)), J(i) === r) ? !1 : a;
		},
		set(e, t, s, c) {
			var u = n.get(t), d = t in e;
			if (i && t === "length") for (var p = s; p < u.v; p += 1) {
				var m = n.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ N(r, o)), n.set(p + "", m)) : P(m, r);
			}
			if (u === void 0) (!d || f(e, t)?.writable) && (u = l(() => /* @__PURE__ */ N(void 0, o)), P(u, Ht(s)), n.set(t, u));
			else {
				d = u.v !== r;
				var h = l(() => Ht(s));
				P(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, s), !d) {
				if (i && typeof t == "string") {
					var _ = n.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				Bt(a);
			}
			return !0;
		},
		ownKeys(e) {
			J(a);
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
function Ut(e) {
	try {
		if (typeof e == "object" && e && fe in e) return e[fe];
	} catch {}
	return e;
}
function Wt(e, t) {
	return Object.is(Ut(e), Ut(t));
}
var Gt, Kt, qt, Jt;
function Yt() {
	if (Gt === void 0) {
		Gt = window, Kt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		qt = f(t, "firstChild").get, Jt = f(t, "nextSibling").get, _(e) && (e[_e] = void 0, e[ge] = null, e[ve] = void 0, e.__e = void 0), _(n) && (n[ye] = void 0);
	}
}
function F(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Xt(e) {
	return qt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Zt(e) {
	return Jt.call(e);
}
function Qt(e, t) {
	if (!w) return /* @__PURE__ */ Xt(e);
	var n = /* @__PURE__ */ Xt(T);
	if (n === null) n = T.appendChild(F());
	else if (t && n.nodeType !== 3) {
		var r = F();
		return n?.before(r), E(r), r;
	}
	return t && sn(n), E(n), n;
}
function $t(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ Xt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Zt(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = F();
			return T?.before(r), E(r), r;
		}
		sn(T);
	}
	return T;
}
function I(e, t = !1) {
	if (!w) return /* @__PURE__ */ Xt(e);
	var n = Qt(e, t);
	return Oe(e), n;
}
function L(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Zt(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
			return r === null ? i?.after(a) : r.before(a), E(a), a;
		}
		sn(r);
	}
	return E(r), r;
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
	var t = W;
	if (t === null) return V.f |= de, e;
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
	var n = W;
	n !== null && n.f & 8192 && (e |= te);
	var r = {
		ctx: D,
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
	if (e & 4) bt === null ? wt.ensure().schedule(r) : bt.push(r);
	else if (t !== null) {
		try {
			Xn(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ae));
	}
	if (i !== null && (i.parent = n, n !== null && un(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function fn() {
	return V !== null && !H;
}
function pn(e) {
	let t = dn(8, null);
	return O(t, x), t.teardown = e, t;
}
function mn(e) {
	return dn(4 | se, e);
}
function hn(e) {
	wt.ensure();
	let t = dn(64 | oe, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? En(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function gn(e) {
	return dn(4, e);
}
function _n(e) {
	return dn(ue | oe, e);
}
function vn(e, t = 0) {
	return dn(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	nt(r, t, n, (t) => {
		dn(8, () => {
			e(...t.map(J));
		});
	});
}
function yn(e, t = 0) {
	return dn(16 | t, e);
}
function bn(e, t = 0) {
	return dn(b | t, e);
}
function z(e) {
	return dn(32 | oe, e);
}
function xn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Nn, r = V;
		Pn(!0), U(null);
		try {
			t.call(null);
		} catch (t) {
			ln(t, e.parent);
		} finally {
			Pn(n), U(r);
		}
	}
}
function Sn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && tt(() => {
			e.abort(be);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function Cn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (wn(e.nodes.start, e.nodes.end), n = !0), e.f |= ie, Sn(e, t && !n), Yn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	xn(e), e.f ^= ie, e.f |= ne;
	var i = e.parent;
	i !== null && i.first !== null && Tn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function wn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Zt(e);
		e.remove(), e = n;
	}
}
function Tn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function En(e, t, n = !0) {
	var r = [];
	e.f |= 256, Dn(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Dn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= te;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Dn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function On(e) {
	e.f &= -257, kn(e, !0);
}
function kn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= te, e.f & 1024 || (O(e, S), wt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			kn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function An(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Zt(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var jn = null, Mn = !1, Nn = !1;
function Pn(e) {
	Nn = e;
}
var V = null, H = !1;
function U(e) {
	V = e;
}
var W = null;
function Fn(e) {
	W = e;
}
var In = null;
function Ln(e) {
	V !== null && (V.f & 2097152 || V.f & 2) && (In ??= /* @__PURE__ */ new Set()).add(e);
}
var G = null, K = 0, q = null;
function Rn(e) {
	q = e;
}
var zn = 1, Bn = 0, Vn = Bn;
function Hn(e) {
	Vn = e;
}
function Un() {
	return ++zn;
}
function Wn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Wn(a) && ft(a), a.wv > e.wv) return !0;
		}
		t & 512 && j === null && O(e, x);
	}
	return !1;
}
function Gn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(In !== null && In.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Gn(a, t, !1) : t === a && (n ? O(a, S) : a.f & 1024 && O(a, C), kt(a));
	}
}
function Kn(e) {
	var t = G, n = K, r = q, i = V, a = In, o = D, s = H, c = Vn, l = e.f;
	G = null, K = 0, q = null, V = l & 96 ? null : e, In = null, Ue(e.ctx), H = !1, Vn = ++Bn, e.ac !== null && (tt(() => {
		e.ac.abort(be);
	}), e.ac = null);
	try {
		e.f |= le;
		var u = e.fn, d = u();
		e.f |= re;
		var f = qn(e);
		if (qe() && q !== null && !H && f !== null && !(e.f & 6146)) for (var p = 0; p < q.length; p++) Gn(q[p], e);
		if (i !== null && i !== e) {
			if (Bn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Bn;
			if (t !== null) for (let e of t) e.rv = Bn;
			q !== null && (r === null ? r = q : r.push(...q));
		}
		return e.f & 8388608 && (e.f ^= de), d;
	} catch (t) {
		return qn(e), cn(t);
	} finally {
		e.f ^= le, G = t, K = n, q = r, V = i, In = a, Ue(o), H = s, Vn = c;
	}
}
function qn(e) {
	var t = e.deps, n = A?.is_fork;
	if (G !== null) {
		var r;
		if (n || Yn(e, K), t !== null && K > 0) for (t.length = K + G.length, r = 0; r < G.length; r++) t[K + r] = G[r];
		else e.deps = t = G;
		if (fn() && e.f & 512) for (r = K; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && K < t.length && (Yn(e, K), t.length = K);
	return t;
}
function Jn(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var i = c.call(n, e);
		if (i !== -1) {
			var a = n.length - 1;
			a === 0 ? n = t.reactions = null : (n[i] = n[a], n.pop());
		}
	}
	if (n === null && t.f & 2 && (G === null || !l.call(G, t))) {
		var o = t;
		o.f & 512 && (o.f ^= 512), o.v !== r && $e(o), o.ac !== null && tt(() => {
			o.ac.abort(be), o.ac = null, O(o, S);
		}), pt(o), Yn(o, 0);
	}
}
function Yn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Jn(e, n[r]);
}
function Xn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		O(e, x);
		var n = W, r = Mn;
		W = e, Mn = !(t & 96);
		try {
			t & 16777232 ? Cn(e) : Sn(e), xn(e);
			var i = Kn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = zn;
		} finally {
			Mn = r, W = n;
		}
	}
}
function J(e) {
	var t = !!(e.f & 2);
	if (jn?.add(e), V !== null && !H && !(W !== null && W.f & 16384) && (In === null || !In.has(e))) {
		var n = V.deps;
		if (V.f & 2097152) e.rv < Bn && (e.rv = Bn, G === null && n !== null && n[K] === e ? K++ : G === null ? G = [e] : G.push(e));
		else {
			V.deps ??= [], l.call(V.deps, e) || V.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [V] : l.call(r, V) || r.push(V);
		}
	}
	if (Nn && M.has(e)) return M.get(e);
	if (t) {
		var i = e;
		if (Nn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Qn(i)) && (a = dt(i)), M.set(i, a), a;
		}
		var o = !(i.f & 512) && !H && V !== null && (Mn || !!(V.f & 512)), s = (i.f & re) === 0;
		Wn(i) && (o && (i.f |= 512), ft(i)), o && !s && (mt(i), Zn(i));
	}
	if (j?.has(e)) return j.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Zn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (mt(t), Zn(t));
}
function Qn(e) {
	if (e.v === r) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (M.has(t) || t.f & 2 && Qn(t)) return !0;
	return !1;
}
function $n(e) {
	var t = H;
	try {
		return H = !0, e();
	} finally {
		H = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var er = Symbol("events"), tr = /* @__PURE__ */ new Set(), nr = /* @__PURE__ */ new Set();
function rr(e, t, n) {
	(t[er] ??= {})[e] = n;
}
function ir(e) {
	for (var t = 0; t < e.length; t++) tr.add(e[t]);
	for (var n of nr) n(e);
}
var ar = null, or = !1;
function sr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	ar = e, or || (or = !0, setTimeout(() => {
		or = !1, ar = null;
	}));
	var o = 0, s = ar === e && e[er];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[er] = t;
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
		var u = V, f = W;
		U(null), Fn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[er]?.[r];
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
			e[er] = t, delete e.currentTarget, U(u), Fn(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var cr = xe ? "template" : "TEMPLATE";
function lr(e, t) {
	var n = W;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function ur(e, t) {
	var n = rn();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(F(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(an(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = r, u = e === "svg" ? a : e === "math" ? o : t;
		var i = nn(e, u, c?.is);
		for (var s in c) on(i, s, c[s]);
		l.length > 0 && (i.nodeName === cr ? i.content : i).append(ur(l, i.nodeName === "foreignObject" ? void 0 : u)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function Y(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (w) return lr(T, null), T;
		i === void 0 && (i = ur(e, t & 4 ? a : t & 8 ? o : void 0), n || (i = /* @__PURE__ */ Xt(i)));
		var s = r || Kt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ Xt(s), l = s.lastChild;
			lr(c, l);
		} else lr(s, s);
		return s;
	};
}
function dr(e = "") {
	if (!w) {
		var t = F(e + "");
		return lr(t, t), t;
	}
	var n = T;
	return n.nodeType === 3 ? sn(n) : (n.before(n = F()), E(n)), lr(n, n), n;
}
function fr() {
	if (w) return lr(T, null), T;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = F();
	return e.append(t, n), lr(t, n), e;
}
function X(e, t) {
	if (w) {
		var n = W;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = T), De();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var pr = ["touchstart", "touchmove"];
function mr(e) {
	return pr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function hr(e) {
	let t = 0, n = Pt(0), r;
	return () => {
		fn() && (J(n), vn(() => (t === 0 && (r = $n(() => e(() => Bt(n)))), t += 1, () => {
			Xe(() => {
				--t, t === 0 && (r?.(), r = void 0, Bt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var gr = ae | oe;
function _r(e, t, n, r) {
	new vr(e, t, n, r);
}
var vr = class {
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
	#h = hr(() => (this.#m = Pt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = yn(() => {
			if (w) {
				let e = this.#t;
				De();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, gr), w && (this.#e = T);
	}
	#g() {
		try {
			this.#a = z(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Xe(r), t && (this.#s = z(() => {
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
			t = !0, n && He(), this.#s !== null && En(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = z(() => e(this.#e)), Xe(() => {
			var e = this.#c = document.createDocumentFragment(), t = F(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return z(() => this.#r(t));
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
			this.#u === 0 && (this.#e.before(e), this.#c = null, En(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = z(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				An(this.#a, e);
				let t = this.#n.pending;
				this.#o = z(() => t(this.#e));
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
		var t = W, n = V, r = D;
		Fn(this.#i), U(this.#i), Ue(this.#i.ctx);
		try {
			return wt.ensure(), e();
		} finally {
			Fn(t), U(n), Ue(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && En(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Xe(() => {
			this.#d = !1, this.#m && Rt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), J(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), w && (E(this.#t), ke(), E(Ae()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return z(() => {
						var r = W;
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
function Z(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ye] ??= e.nodeValue) && (e[ye] = n, e.nodeValue = `${n}`);
}
function yr(e, t) {
	return xr(e, t);
}
var br = /* @__PURE__ */ new Map();
function xr(e, { target: t, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	Yt();
	var l = void 0, d = hn(() => {
		var s = r ?? t.appendChild(F());
		_r(s, { pending: () => {} }, (t) => {
			We({});
			var r = D;
			if (o && (r.c = o), a && (i.$$events = a), w && lr(t, null), l = e(t, i) || Ke(), w && (W.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw Ce(), n;
			Ge();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = mr(r);
					for (let e of [t, document]) {
						var a = br.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), br.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, sr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(u(tr)), nr.add(f), () => {
			for (var e of d) for (let r of [t, document]) {
				var n = br.get(r), i = n.get(e);
				--i == 0 ? (r.removeEventListener(e, sr), n.delete(e), n.size === 0 && br.delete(r)) : n.set(e, i);
			}
			nr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Sr.set(l, d), l;
}
var Sr = /* @__PURE__ */ new WeakMap();
function Cr(e, t) {
	let n = Sr.get(e);
	return n ? (Sr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var wr = class {
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
			if (n) On(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (On(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (B(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						An(r, t), t.append(F()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), En(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = tn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = F();
				i.append(a), this.#n.set(e, {
					effect: z(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, z(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else w && (this.anchor = T), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Tr(e, t, n = !1) {
	var r;
	w && (r = T, De());
	var i = new wr(e), a = n ? ae : 0;
	function o(e, t) {
		if (w) {
			var n = je(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ae();
				E(a), i.anchor = a, Ee(!1), i.ensure(e, t), Ee(!0);
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
function Er(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		En(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Dr(e, u(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
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
		Dr(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Dr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ce, An(a, document.createDocumentFragment())) : B(t[i], n);
	}
}
var Or;
function kr(e, t, n, r, i, a = null) {
	var o = e, c = /* @__PURE__ */ new Map();
	if (t & 4) {
		var l = e;
		o = w ? E(/* @__PURE__ */ Xt(l)) : l.appendChild(F());
	}
	w && De();
	var d = null, f = /* @__PURE__ */ lt(() => {
		var e = n();
		return s(e) ? e : e == null ? [] : u(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, jr(v, p, o, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ce, Nr(d, null, o)) : On(d) : En(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: yn(() => {
			p = J(f);
			var e = p.length;
			let s = !1;
			w && je(o) === "[!" != (e === 0) && (o = Ae(), E(o), Ee(!1), s = !0);
			for (var l = /* @__PURE__ */ new Set(), u = A, v = tn(), y = 0; y < e; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (o = T, s = !0, Ee(!1));
				var ee = p[y], b = r(ee, y), x = h ? null : c.get(b);
				x ? (x.v && Rt(x.v, ee), x.i && Rt(x.i, y), v && u.unskip_effect(x.e)) : (x = Mr(c, h ? o : Or ??= F(), ee, b, y, i, t, n), h || (x.e.f |= ce), c.set(b, x)), l.add(b);
			}
			if (e === 0 && a && !d && (h ? d = z(() => a(o)) : (d = z(() => a(Or ??= F())), d.f |= ce)), e > l.size && Ie("", "", ""), w && e > 0 && E(Ae()), !h) {
				if (m.set(u, l), v) {
					for (let [e, t] of c) l.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			s && Ee(!0), J(f);
		}),
		flags: t,
		items: c,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (o = T);
}
function Ar(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function jr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = Ar(e.effect.first), l, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (On(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ce, _ === c) Nr(_, null, n);
			else {
				var y = d ? d.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Pr(e, d, _), Pr(e, _, y), Nr(_, y, n), d = _, p = [], m = [], c = Ar(d.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var ee = m[0], b;
					d = ee.prev;
					var x = p[0], S = p[p.length - 1];
					for (b = 0; b < p.length; b += 1) Nr(p[b], ee, n);
					for (b = 0; b < m.length; b += 1) l.delete(m[b]);
					Pr(e, x.prev, S.next), Pr(e, d, x), Pr(e, S, ee), c = ee, d = S, --v, p = [], m = [];
				} else l.delete(_), Nr(_, c, n), Pr(e, _.prev, _.next), Pr(e, _, d === null ? e.effect.first : d.next), Pr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = Ar(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, c = Ar(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Dr(e, u(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var C = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || C.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && C.push(c), c = Ar(c.next);
		var te = C.length;
		if (te > 0) {
			var ne = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
			}
			Er(e, C, ne);
		}
	}
	a && Xe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Mr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Pt(n) : /* @__PURE__ */ Ft(n, !1, !1) : null, l = o & 2 ? Pt(i) : null;
	return {
		v: c,
		i: l,
		e: z(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Nr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ Zt(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Pr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Fr(e, t) {
	var n = void 0, r;
	bn(() => {
		n !== (n = t()) && (r &&= (B(r), null), n && (r = z(() => {
			gn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Ir(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Ir(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Lr() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Ir(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function Rr(e) {
	return typeof e == "object" ? Lr(e) : e ?? "";
}
var zr = [..." 	\n\r\f\xA0\v﻿"];
function Br(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || zr.includes(r[o - 1])) && (s === r.length || zr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Vr(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Hr(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Ur(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Hr)), i && c.push(...Object.keys(i).map(Hr));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Hr(e.substring(l, u).trim());
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
		return r && (n += Vr(r)), i && (n += Vr(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Wr(e, t, n, r, i, a) {
	var o = e[_e];
	if (w || o !== n || o === void 0) {
		var s = Br(n, r, a);
		(!w || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[_e] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function Gr(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Kr(e, t, n, r) {
	var i = e[ve];
	if (w || i !== t) {
		var a = Ur(t, r);
		(!w || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ve] = t;
	} else r && (Array.isArray(r) ? (Gr(e, n?.[0], r[0]), Gr(e, n?.[1], r[1], "important")) : Gr(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function qr(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Jr(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || s(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = Zr(c);
			qr(c, r ? i.includes(l) : Wt(l, n));
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
function Yr(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!s(t)) return we();
		for (var r of e.options) r.selected = t.includes(Zr(r));
		return;
	}
	for (r of e.options) if (Wt(Zr(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function Xr(e) {
	var t = new MutationObserver((t) => {
		t.every(Qr) || ("__defaultValue" in e && Jr(e, !1), "__value" in e && Yr(e, e.__value));
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
function Zr(e) {
	return "__value" in e ? e.__value : e.value;
}
function Qr(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var $r = Symbol("is custom element"), ei = Symbol("is html"), ti = xe ? "link" : "LINK";
function ni(e, t, n, r) {
	var i = ri(e);
	w && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ti) || i[t] !== (i[t] = n) && (t === "loading" && (e[he] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ai(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function ri(e) {
	return e[ge] ??= {
		[$r]: e.nodeName.includes("-"),
		[ei]: e.namespaceURI === i
	};
}
var ii = /* @__PURE__ */ new Map();
function ai(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ii.get(t);
	if (n) return n;
	ii.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = p(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = g(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var oi = !1;
function si(e) {
	var t = oi;
	try {
		return oi = !1, [e(), oi];
	} finally {
		oi = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function ci(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ ot(r), J(l)) : (c && (c = !1, s = o ? $n(r) : r), s);
	let d;
	if (a) {
		var p = fe in e || me in e;
		d = f(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = si(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = u(), d && (i && Re(t), d(m)));
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
	a && J(y);
	var ee = W;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? J(y) : i && a ? Ht(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Nn && v || ee.f & 16384 ? y.v : J(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var li = /* @__PURE__ */ Y([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function ui(e, t) {
	We(t, !0);
	var n = li(), r = I(n, !0);
	R(() => Z(r, t.messages.text)), X(e, n), Ge();
}
//#endregion
//#region src/lib/payload.svelte.ts
var di = /* @__PURE__ */ t({
	Payload: () => fi,
	payload: () => pi,
	setPayload: () => mi
}), fi = class {
	#e = /* @__PURE__ */ N(null);
	#t = /* @__PURE__ */ N(!1);
	get summary() {
		return J(this.#e);
	}
	get summaryFailed() {
		return J(this.#t);
	}
	set(e) {
		e.summary !== void 0 && (P(this.#e, e.summary), P(this.#t, !1)), e.summaryFailed !== void 0 && P(this.#t, e.summaryFailed, !0);
	}
	reset() {
		P(this.#e, null), P(this.#t, !1);
	}
}, pi = new fi();
function mi(e) {
	pi.set(e), Tt();
}
//#endregion
//#region src/lib/colors.ts
var hi = /* @__PURE__ */ t({
	BACKGROUND_EFFORT: () => bi,
	EFFORT_ORDER: () => vi,
	EFFORT_SHADES: () => Ci,
	HATCH_SHADES: () => wi,
	HATCH_TURNS: () => Ti,
	KNOWN_MODELS: () => gi,
	SLOT_COUNT: () => 8,
	effortHatch: () => Ai,
	effortLabel: () => Si,
	effortName: () => xi,
	effortRank: () => yi,
	effortShade: () => ki,
	hatchTurn: () => ji,
	modelSlots: () => _i,
	shade: () => Oi,
	slotColor: () => Di,
	swatchFill: () => Mi
}), gi = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function _i(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of gi.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !gi.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var vi = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function yi(e) {
	let t = vi.indexOf(e);
	return t === -1 ? vi.length : t;
}
var bi = "background";
function xi(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function Si(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var Ci = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, wi = {
	background: 1,
	ultracode: 4
}, Ti = {
	background: -45,
	ultracode: 45
};
function Ei(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function Di(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function Oi(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? Di(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function ki(e, t) {
	return Oi(e, Ei(Ci, t) ?? 0);
}
function Ai(e, t) {
	let n = Ei(wi, t);
	return n ? Oi(e, n) : null;
}
function ji(e) {
	return Ei(Ti, e);
}
function Mi(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var Ni = /* @__PURE__ */ t({
	ago: () => Qi,
	compact: () => Q,
	dayText: () => Gi,
	duration: () => Ui,
	longDay: () => qi,
	longHour: () => Xi,
	money: () => Vi,
	parseDay: () => Wi,
	parseHour: () => Ji,
	percent: () => Hi,
	shortDay: () => Ki,
	shortHour: () => Yi,
	signed: () => Bi,
	when: () => Zi,
	whole: () => $
}), Pi = "–", Fi = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), Ii = new Intl.NumberFormat("en"), Li = {
	month: "short",
	day: "numeric"
}, Ri = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, zi = {
	hour: "2-digit",
	minute: "2-digit"
};
function Q(e) {
	return e == null ? Pi : Fi.format(e);
}
function Bi(e) {
	return e < 0 ? `−${Q(-e)}` : `+${Q(e)}`;
}
function $(e) {
	return e == null ? Pi : Ii.format(e);
}
function Vi(e) {
	return e == null ? Pi : Math.abs(e) >= 1e3 ? "$" + Fi.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function Hi(e, t) {
	if (!t) return Pi;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function Ui(e) {
	if (e == null) return Pi;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function Wi(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function Gi(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function Ki(e, t) {
	return Wi(e).toLocaleDateString(t, Li);
}
function qi(e, t) {
	return Wi(e).toLocaleDateString(t, Ri);
}
function Ji(e) {
	let [t = "", n = "0"] = e.split("T"), r = Wi(t);
	return r.setHours(Number(n)), r;
}
function Yi(e, t) {
	return Ji(e).toLocaleTimeString(t, zi);
}
function Xi(e, t) {
	let n = Ji(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, zi);
	return `${n.toLocaleDateString(t, Ri)}, ${i(n)}–${i(r)}`;
}
function Zi(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...Li,
		...zi
	}) : Pi;
}
function Qi(e, t = Date.now(), n) {
	if (!e) return Pi;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : Zi(e, n);
}
//#endregion
//#region src/lib/charts.ts
var $i = /* @__PURE__ */ t({
	LIMIT_ICON: () => "⚠",
	NO_USAGE: () => fa,
	RATE_LIMIT: () => va,
	bandIndex: () => oa,
	barShare: () => Da,
	bucketTotals: () => pa,
	chartSeries: () => ma,
	columnPath: () => ca,
	columnTotals: () => ga,
	columnWidth: () => sa,
	costSplit: () => Ta,
	costTop: () => Ea,
	errorText: () => xa,
	inputTotal: () => ea,
	limitCounts: () => Sa,
	limitTop: () => ra,
	limitType: () => ba,
	lineX: () => ia,
	modelGroups: () => ha,
	nearestIndex: () => aa,
	niceMax: () => ta,
	peakIndex: () => la,
	rangeDays: () => ua,
	stackSegments: () => _a,
	ticks: () => na,
	timeBuckets: () => da,
	windowHitAfter: () => Ca,
	windowSpan: () => wa
});
function ea(e) {
	return e.new_input + e.cache_write + e.cache_read;
}
function ta(e) {
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
function na(e, t) {
	return Array.from({ length: t + 1 }, (n, r) => e * r / t);
}
function ra(e) {
	return Math.max(2, Math.ceil(ta(e) / 2) * 2);
}
function ia(e, t, n) {
	let r = e - 1;
	return (e) => r > 0 ? t + (n - t) * e / r : (t + n) / 2;
}
function aa(e, t, n) {
	return (r) => n > 1 ? Math.round((r - e) / (t - e) * (n - 1)) : 0;
}
function oa(e, t) {
	return (n) => Math.floor((n - e) / t);
}
function sa(e, t = 24) {
	return Math.max(2, Math.min(t, e * .6));
}
function ca(e, t, n, r, i, a = 4) {
	let o = i ? Math.min(a, n / 2, r) : 0;
	return `M${e},${t + r}V${t + o}` + (o ? `Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}` : `H${e + n}`) + `V${t + r}Z`;
}
function la(e) {
	return e.indexOf(Math.max(...e));
}
function ua(e, t = /* @__PURE__ */ new Date()) {
	let n = [];
	for (let r = Wi(e); r <= t; r.setDate(r.getDate() + 1)) n.push(Gi(r));
	return n;
}
function da(e, t = /* @__PURE__ */ new Date()) {
	if (e.days !== 1 || !e.hour_model) return {
		keys: ua(e.since, t),
		unit: "day",
		heading: "Day",
		short: Ki,
		long: qi,
		keyOf: (e) => e.day ?? ""
	};
	let n = e.since === Gi(t) ? t.getHours() : 23, r = [];
	for (let t = 0; t <= n; t += 1) r.push(`${e.since}T${String(t).padStart(2, "0")}`);
	return {
		keys: r,
		unit: "hour",
		heading: "Hour",
		short: Yi,
		long: Xi,
		keyOf: (e) => e.hour ?? ""
	};
}
var fa = {
	cost: 0,
	input: 0,
	output: 0
};
function pa(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			cost: 0,
			input: 0,
			output: 0
		};
		i.cost += r.cost || 0, i.input += ea(r), i.output += r.output, n.set(e, i);
	}
	return n;
}
function ma(e, t, n) {
	let r = _i([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${xi(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: ki(e, a.effort),
			hatch: Ai(e, a.effort),
			turn: ji(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : yi(e);
	return [...i.values()].sort((e, t) => (e.slot ?? 8) - (t.slot ?? 8) || e.model.localeCompare(t.model) || a(e.effort) - a(t.effort) || String(e.effort).localeCompare(String(t.effort)));
}
function ha(e) {
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
function ga(e, t) {
	return t.map((t) => e.reduce((e, n) => e + (n.values.get(t) ?? 0), 0));
}
function _a(e, t, n, r = 2, i = 4) {
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
var va = "rate_limit", ya = {
	five_hour: "5-hour limit",
	seven_day: "weekly limit",
	seven_day_opus: "weekly Opus limit"
};
function ba(e) {
	return e ? Object.hasOwn(ya, e) ? ya[e] ?? e : e.replaceAll("_", " ") : "–";
}
function xa(e) {
	let t = e.status ? ` (${e.status})` : "";
	return e.error === "rate_limit" ? `⚠ Rate limit${t}` : `${e.error.replaceAll("_", " ")}${t}`;
}
function Sa(e, t) {
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
function Ca(e) {
	return Date.parse(e.first_hit) - Date.parse(e.start);
}
function wa(e, t) {
	let n = new Date(e.start), r = new Date(e.resets_at), i = n.toDateString() === r.toDateString() ? r.toLocaleTimeString(t, {
		hour: "2-digit",
		minute: "2-digit"
	}) : Zi(e.resets_at, t);
	return `${Zi(e.start, t)} – ${i}`;
}
function Ta(e) {
	let t = e.cost_parts.cache_read;
	return {
		cacheRead: t,
		rest: Math.max(0, (e.cost || 0) - t)
	};
}
function Ea(e) {
	return Math.max(0, ...e.map((e) => e.cost || 0)) || 1;
}
function Da(e, t) {
	return 100 * (e || 0) / t;
}
//#endregion
//#region src/lib/tiles.ts
function Oa(e, t = Gi(/* @__PURE__ */ new Date()), n) {
	let r = e.history_since, i = r && r > e.since ? ` (history since ${Ki(r, n)})` : "";
	return e.days === 1 ? e.until === t ? "today" : qi(e.until, n) : `last ${e.days} days${i}`;
}
function ka(e) {
	let t = [e.unpriced_turns ? `${$(e.unpriced_turns)} turns of models without a price are not included` : "at API list prices"];
	return e.web_searches && t.push(`incl. ${$(e.web_searches)} web searches, ${Vi(e.cost_parts.web_search)}`), t.join(" · ");
}
var Aa = "Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.";
function ja(e) {
	let t = e.compactions === 1 ? "1 compaction" : `${$(e.compactions)} compactions`, n = e.unknown ? `${$(e.unknown)} without an estimate` : null;
	if (!e.compactions) return {
		title: Aa,
		verdict: null,
		amount: null,
		count: `Compacting: ${n}`
	};
	let r = e.net >= 0;
	return {
		title: Aa,
		verdict: r ? "gain" : "loss",
		amount: r ? `▲ compacting saved ~${Vi(e.net)} so far` : `▼ compacting cost ~${Vi(-e.net)} more so far`,
		count: `(${[t, n].filter(Boolean).join(", ")})`
	};
}
function Ma(e) {
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
function Na(e, t) {
	let n = ea(t);
	return e.map((e) => `${e.label} ${Hi(e.tokens, n)}`).join(", ");
}
function Pa(e, t) {
	return e?.turns ? `median context ${Q(e.median)} per turn (p90 ${Q(e.p90)})` + (t ? ` · compact hint at ${Q(t)}` : "") : null;
}
function Fa(e, t, n, r) {
	let i = e.api_ms_without_retries === null ? null : e.api_ms - e.api_ms_without_retries, a = "no time lost to retries";
	return i === null ? a = "retries are not in the transcripts" : i > 0 && (a = `${Ui(i)} of it retries`), {
		session: `wall-clock, ${t}`,
		api: a,
		tools: r ? "from each call to its result, incl. waiting for permission" : `${Hi(e.tool_ms, e.duration_ms)} of the session time`,
		lines: n === null ? "no lines changed" : `${Vi(n)} per 100 lines changed`
	};
}
function Ia(e) {
	return `${$(e)} ${e === 1 ? "session" : "sessions"} that ended in the range`;
}
function La(e) {
	return e === "cost_record" ? "from its cost record" : "estimated from the transcripts";
}
function Ra(e) {
	let t = e.runtime.lines_added + e.runtime.lines_removed;
	return e.cost === null || t === 0 ? null : e.cost / t * 100;
}
//#endregion
//#region src/lib/tables.ts
var za = /* @__PURE__ */ t({
	DEFAULT_PAGE_SIZE: () => 25,
	PAGE_SIZES: () => Ba,
	TOOL_KINDS: () => Ja,
	chatRows: () => so,
	detailNoun: () => eo,
	emptyDetail: () => Za,
	entryKey: () => oo,
	kindLabel: () => Xa,
	orderedEntries: () => ao,
	pageSizeFrom: () => Wa,
	pageText: () => Ua,
	pageUnits: () => Va,
	pageWindow: () => Ha,
	sessionCount: () => qa,
	sessionMatches: () => Ga,
	sessionProjects: () => Ka,
	toolFolds: () => ro,
	toolRowClass: () => to,
	toolRowName: () => no,
	toolRowShown: () => io,
	toolTableRows: () => Ya,
	toolsAndChat: () => co
}), Ba = [
	10,
	25,
	50
];
function Va(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function Ha(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function Ua(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function Wa(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function Ga(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function Ka(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
function qa(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var Ja = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function Ya(e) {
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
function Xa(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function Za(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var Qa = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, $a = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function eo(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn($a, e.tool) && $a[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(Qa, n) && Qa[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function to(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function no(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: Xa(e, Ja)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || Za(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function ro(e) {
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
			label: `${$(a)} ${eo(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function io(e, t) {
	return e.every((e) => t.has(e));
}
function ao(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function oo(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function so(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return ao(e, t).map((e) => ({
		key: oo(e, n.get(e) ?? 0),
		entry: e
	}));
}
function co(e, t, n) {
	return e ? [n, t] : [t, n];
}
//#endregion
//#region src/lib/themes.ts
var lo = /* @__PURE__ */ t({
	THEMES: () => uo,
	themeFooter: () => _o,
	themeLabel: () => go,
	themeName: () => mo
}), uo = [
	"light",
	"dark",
	"hacker",
	"startup",
	"rgb"
], fo = { techbro: "rgb" }, po = {
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
function mo(e) {
	if (e == null) return null;
	let t = (Object.hasOwn(fo, e) ? fo[e] : e) ?? e;
	return uo.includes(t) ? t : null;
}
function ho(e) {
	return e !== null && Object.hasOwn(po, e) ? po[e] ?? {} : {};
}
function go(e, t) {
	let n = ho(e);
	return Object.hasOwn(n, t) ? n[t] ?? t : t;
}
function _o(e) {
	return ho(e).footer ?? "";
}
//#endregion
//#region src/lib/prefs.svelte.ts
var vo = /* @__PURE__ */ t({
	Preferences: () => So,
	footerCopy: () => To,
	hype: () => wo,
	preferences: () => Co,
	readPreference: () => yo,
	savePreference: () => bo,
	savedOption: () => xo
});
function yo(e) {
	try {
		return localStorage.getItem(`claude-usage.${e}`);
	} catch {
		return null;
	}
}
function bo(e, t) {
	try {
		localStorage.setItem(`claude-usage.${e}`, String(t));
	} catch {}
}
function xo(e, t) {
	let n = yo(e);
	return n !== null && t.includes(n) ? n : null;
}
var So = class {
	#e = /* @__PURE__ */ N(Ht(mo(yo("theme"))));
	#t = /* @__PURE__ */ N(Ht(Wa(yo("page_size"), Ba, 25)));
	#n = /* @__PURE__ */ N(yo("chat-oldest-first") === "true");
	get theme() {
		return J(this.#e);
	}
	set theme(e) {
		let t = mo(e);
		P(this.#e, t, !0), bo("theme", t ?? "auto");
	}
	get pageSize() {
		return J(this.#t);
	}
	set pageSize(e) {
		Ba.includes(e) && (P(this.#t, e, !0), bo("page_size", String(e)));
	}
	get oldestFirst() {
		return J(this.#n);
	}
	set oldestFirst(e) {
		P(this.#n, e, !0), bo("chat-oldest-first", String(e));
	}
}, Co = new So();
function wo(e) {
	return go(Co.theme, e);
}
function To() {
	return _o(Co.theme);
}
//#endregion
//#region src/components/Swatch.svelte
var Eo = /* @__PURE__ */ Y([["span", { class: "swatch" }]]);
function Do(e, t) {
	var n = Eo();
	let r;
	R(() => r = Kr(n, "", r, { background: t.fill })), X(e, n);
}
//#endregion
//#region src/components/InputSplit.svelte
var Oo = /* @__PURE__ */ Y([["span"]]), ko = /* @__PURE__ */ Y([[
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
]]), Ao = /* @__PURE__ */ Y([[
	"div",
	{ class: "note" },
	" "
]]), jo = /* @__PURE__ */ Y([[
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
function Mo(e, t) {
	We(t, !0);
	let n = /* @__PURE__ */ k(() => ea(t.totals)), r = /* @__PURE__ */ k(() => Ma(t.totals)), i = /* @__PURE__ */ k(() => Pa(t.context, t.hintTokens));
	var a = jo(), o = Qt(a), s = I(o, !0), c = L(o, 2), l = I(c, !0), u = L(c, 2);
	kr(u, 21, () => J(r).filter((e) => e.tokens > 0), (e) => e.label, (e, t) => {
		var n = Oo();
		let r;
		R(() => r = Kr(n, "", r, {
			"flex-grow": J(t).tokens,
			background: J(t).color
		})), X(e, n);
	}), Oe(u);
	var d = L(u, 2);
	kr(d, 17, () => J(r), (e) => e.label, (e, t) => {
		var r = ko(), i = Qt(r);
		Do(i, { get fill() {
			return J(t).color;
		} });
		var a = L(i, 2), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = I(l, !0), d = I(L(l, 2), !0);
		Oe(r), R((e, n, i, a) => {
			ni(r, "title", J(t).note), Z(o, e), Z(c, n), Z(u, i), Z(d, a);
		}, [
			() => wo(J(t).label),
			() => Q(J(t).tokens),
			() => Hi(J(t).tokens, J(n)),
			() => Vi(J(t).cost)
		]), X(e, r);
	});
	var f = L(d, 2), p = (e) => {
		var t = Ao();
		ni(t, "title", "The context a main-thread turn reads: new input, cache writes and reads. The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens).");
		var n = I(t, !0);
		R(() => Z(n, J(i))), X(e, t);
	};
	Tr(f, (e) => {
		J(i) !== null && e(p);
	}), Oe(a), R((e, t, n) => {
		Z(s, e), Z(l, t), ni(u, "aria-label", n);
	}, [
		() => wo("Input tokens"),
		() => Q(J(n)),
		() => Na(J(r), t.totals)
	]), X(e, a), Ge();
}
//#endregion
//#region src/components/StatTile.svelte
var No = /* @__PURE__ */ Y([[
	"div",
	{ class: "note" },
	" "
]]), Po = /* @__PURE__ */ Y([[
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
function Fo(e, t) {
	We(t, !0);
	let n = ci(t, "note", 3, null), r = ci(t, "themedNote", 3, !1);
	var i = Po(), a = Qt(i), o = I(a, !0), s = L(a, 2), c = I(s, !0), l = L(s, 2), u = (e) => {
		var t = No(), i = I(t, !0);
		R((e) => Z(i, e), [() => r() ? wo(n()) : n()]), X(e, t);
	};
	Tr(l, (e) => {
		n() && e(u);
	}), Oe(i), R((e) => {
		Z(o, e), Z(c, t.value);
	}, [() => wo(t.label)]), X(e, i), Ge();
}
//#endregion
//#region src/components/KpiTiles.svelte
var Io = /* @__PURE__ */ Y([
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
], 1), Lo = /* @__PURE__ */ Y([[
	"div",
	{ class: "note" },
	,
]]), Ro = /* @__PURE__ */ Y([
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
function zo(e, t) {
	We(t, !0);
	let n = /* @__PURE__ */ k(() => t.savings ? ja(t.savings) : null);
	var r = Ro(), i = $t(r), a = Qt(i), o = Qt(a), s = I(o, !0), c = L(o);
	Oe(a);
	var l = L(a, 2), u = I(l, !0), d = L(l, 2), f = I(d, !0), p = L(d, 2), m = (e) => {
		var t = Lo(), r = Qt(t), i = (e) => {
			var t = Io(), r = $t(t), i = I(r, !0), a = I(L(r, 2), !0);
			R(() => {
				Wr(r, 1, Rr(J(n).verdict === "gain" ? "verdict-gain" : "verdict-loss")), Z(i, J(n).amount), Z(a, J(n).count);
			}), X(e, t);
		}, a = (e) => {
			var t = dr();
			R(() => Z(t, J(n).count)), X(e, t);
		};
		Tr(r, (e) => {
			J(n).verdict ? e(i) : e(a, -1);
		}), Oe(t), R(() => ni(t, "title", J(n).title)), X(e, t);
	};
	Tr(p, (e) => {
		J(n) && e(m);
	}), Oe(i);
	var h = L(i, 2);
	Mo(h, {
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
		let e = /* @__PURE__ */ k(() => $(t.totals.turns));
		Fo(g, {
			label: "Turns",
			get value() {
				return J(e);
			},
			note: "API calls with usage",
			themedNote: !0
		});
	}
	var _ = L(g, 2);
	{
		let e = /* @__PURE__ */ k(() => Q(t.totals.output)), n = /* @__PURE__ */ k(() => Vi(t.totals.cost_parts.output));
		Fo(_, {
			label: "Output tokens",
			get value() {
				return J(e);
			},
			get note() {
				return J(n);
			}
		});
	}
	R((e, n, r) => {
		Z(s, e), Z(c, `, ${t.scope ?? ""}`), Z(u, n), Z(f, r);
	}, [
		() => wo("Estimated cost"),
		() => Vi(t.totals.cost),
		() => ka(t.totals)
	]), X(e, r), Ge();
}
//#endregion
//#region src/components/RuntimeTiles.svelte
var Bo = /* @__PURE__ */ Y([
	,
	,
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function Vo(e, t) {
	We(t, !0);
	let n = /* @__PURE__ */ k(() => "source" in t.runtime && t.runtime.source === "transcripts"), r = /* @__PURE__ */ k(() => Fa(t.runtime, t.from, t.costPer100Lines, J(n)));
	var i = Bo(), a = $t(i);
	{
		let e = /* @__PURE__ */ k(() => Ui(t.runtime.duration_ms));
		Fo(a, {
			label: "Session time",
			get value() {
				return J(e);
			},
			get note() {
				return J(r).session;
			}
		});
	}
	var o = L(a, 2);
	{
		let e = /* @__PURE__ */ k(() => Ui(t.runtime.api_ms));
		Fo(o, {
			label: "Waiting on the API",
			get value() {
				return J(e);
			},
			get note() {
				return J(r).api;
			}
		});
	}
	var s = L(o, 2);
	{
		let e = /* @__PURE__ */ k(() => Ui(t.runtime.tool_ms));
		Fo(s, {
			label: "Running tools",
			get value() {
				return J(e);
			},
			get note() {
				return J(r).tools;
			}
		});
	}
	var c = L(s, 2);
	{
		let e = /* @__PURE__ */ k(() => `+${$(t.runtime.lines_added)} / −${$(t.runtime.lines_removed)}`);
		Fo(c, {
			label: "Lines changed",
			get value() {
				return J(e);
			},
			get note() {
				return J(r).lines;
			}
		});
	}
	X(e, i), Ge();
}
//#endregion
//#region src/components/SummaryTiles.svelte
var Ho = /* @__PURE__ */ Y([[
	"div",
	{ class: "empty" },
	" "
]]);
function Uo(e, t) {
	We(t, !0);
	let n = /* @__PURE__ */ k(() => pi.summary);
	var r = fr(), i = $t(r), a = (e) => {
		var r = fr(), i = $t(r), a = (e) => {
			{
				let t = /* @__PURE__ */ k(() => Oa(J(n)));
				zo(e, {
					get totals() {
						return J(n).totals;
					},
					get scope() {
						return J(t);
					},
					get context() {
						return J(n).context;
					},
					get hintTokens() {
						return J(n).compact_hint_tokens;
					},
					get savings() {
						return J(n).compaction_savings;
					}
				});
			}
		}, o = (e) => {
			{
				let t = /* @__PURE__ */ k(() => Ia(J(n).runtime.sessions));
				Vo(e, {
					get runtime() {
						return J(n).runtime;
					},
					get from() {
						return J(t);
					},
					get costPer100Lines() {
						return J(n).runtime.cost_per_100_lines;
					}
				});
			}
		};
		Tr(i, (e) => {
			t.rows === "kpis" ? e(a) : e(o, -1);
		}), X(e, r);
	}, o = (e) => {
		var t = Ho(), n = I(t, !0);
		R(() => Z(n, pi.summaryFailed ? "Could not load the summary." : "Loading…")), X(e, t);
	};
	Tr(i, (e) => {
		J(n) ? e(a) : t.rows === "kpis" && e(o, 1);
	}), X(e, r), Ge();
}
//#endregion
//#region node_modules/svelte/src/reactivity/map.js
var Wo = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ N(0);
	#n = /* @__PURE__ */ N(0);
	#r = Vn || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return Vn === this.#r ? /* @__PURE__ */ N(e) : Pt(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return J(this.#t), !1;
		}
		return J(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				J(this.#t);
				return;
			}
		}
		return J(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), P(this.#n, super.size), Bt(o);
		else if (i !== t) {
			Bt(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && Bt(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), P(n, -1)), r && (P(this.#n, super.size), Bt(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			P(this.#n, 0);
			for (var t of e.values()) P(t, -1);
			Bt(this.#t), e.clear();
		}
	}
	#a() {
		J(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) J(n);
	}
	keys() {
		return J(this.#t), super.keys();
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
		return J(this.#n), super.size;
	}
}, Go = class {
	#e = new Wo();
	#t = /* @__PURE__ */ k(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return J(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, Ko = /* @__PURE__ */ t({
	PAYOFF_WORDS: () => qo,
	compactCallKind: () => Qo,
	compactionTotal: () => ts,
	delegateCallShown: () => $o,
	payoffAhead: () => Xo,
	payoffText: () => Zo,
	payoffTone: () => Yo,
	spread: () => Jo,
	verdictTone: () => es
}), qo = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function Jo(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function Yo(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function Xo(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${$(t.pays_later_in)} replies`;
		return `${qo.later}: growing at its recent pace, the context reaches about ${Q(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = $(Math.round(t.calls_ahead));
	return `${qo[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function Zo(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${Vi(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${$(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : $(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${$(e.breakeven_low)} replies)` : `would pay off after about ${$(e.breakeven_calls)} replies` + Jo(r(e.breakeven_low), r(e.breakeven_high));
}
function Qo(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function $o(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function es(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function ts(e) {
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
var ns = /* @__PURE__ */ t({
	liveCompactBadge: () => as,
	liveSecretBadge: () => is,
	liveStateBadges: () => os,
	liveWaitBadge: () => rs,
	sessionWaits: () => ss,
	waitChanged: () => cs
});
function rs(e) {
	if (!e) return null;
	let t = ` since ${Zi(e.since)}`;
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
function is(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${$(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${$(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function as(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${Q(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = Yo(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if (Qo({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${Vi(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${$(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${qo[l]}: compacting now ${m}, ~${$(Math.round(f))} ahead on average.`);
}
function os(e, t) {
	return [is(e.secrets), as(e.current, t)].filter((e) => e !== null);
}
function ss(e, t) {
	let n = rs(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : rs(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function cs(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/lib/overview.svelte.ts
var ls = /* @__PURE__ */ t({
	mountSessionKpis: () => ms,
	mountSessionRuntime: () => hs,
	releaseDetachedTiles: () => ds
}), us = /* @__PURE__ */ new Set();
function ds() {
	for (let e of [...us]) e.holder.isConnected || (us.delete(e), Cr(e.component));
}
function fs() {
	let e = document.createElement("div");
	return e.className = "kpis session-kpis", e;
}
function ps(e, t) {
	return Tt(), us.add({
		component: e,
		holder: t
	}), queueMicrotask(ds), t;
}
function ms(e) {
	let t = fs();
	return ps(yr(zo, {
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
function hs(e) {
	let t = fs();
	return t.setAttribute("role", "group"), t.setAttribute("aria-label", "Time and lines changed"), ps(yr(Vo, {
		target: t,
		props: {
			runtime: e.runtime,
			from: La(e.runtime.source),
			costPer100Lines: Ra(e)
		}
	}), t);
}
//#endregion
//#region src/lib/scroll.ts
var gs = /* @__PURE__ */ t({
	keepScroll: () => vs,
	scrollAnchor: () => _s
});
function _s(e) {
	for (let t of e) {
		let e = t.getBoundingClientRect();
		if (e.bottom > 0) return {
			node: t,
			top: e.top
		};
	}
	return null;
}
function vs(e, t) {
	e && t && t.isConnected && window.scrollBy(0, t.getBoundingClientRect().top - e.top);
}
//#endregion
//#region src/components/Pager.svelte
var ys = /* @__PURE__ */ Y([[
	"option",
	null,
	" "
]]), bs = /* @__PURE__ */ Y([[
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
function xs(e, t) {
	We(t, !0);
	let n = /* @__PURE__ */ k(() => (t.units.at(-1) ?? -1) + 1), r = /* @__PURE__ */ k(() => Ha(J(n), Co.pageSize, Math.floor(ws.first(t.key) / Co.pageSize))), i = /* @__PURE__ */ k(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function a() {
		ws.first(t.key) !== J(r).first && ws.set(t.key, J(r).first);
	}
	a();
	function o(e, r) {
		let i = e.closest(".pager"), a = _s(i ? [i] : []);
		ws.set(t.key, Ha(J(n), Co.pageSize, r).first), Tt(), vs(a, i);
	}
	function s(e, t) {
		let n = e.closest(".pager"), r = _s(n ? [n] : []);
		Co.pageSize = t, Tt(), vs(r, n);
	}
	function c() {
		let { first: e, last: n } = J(r);
		t.rows.forEach((r, i) => {
			let a = t.units[i];
			a !== void 0 && r.classList.toggle("off-page", a < e || a >= n);
		});
	}
	var l = bs(), u = Qt(l);
	kr(u, 20, () => Ba, (e) => e, (e, n) => {
		var r = ys(), i = I(r), a = {};
		R(() => {
			Z(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), X(e, r);
	}), Oe(u);
	var d;
	Xr(u);
	var f = L(u, 2), p = L(f, 2), m = I(p, !0), h = L(p, 2);
	Oe(l), Fr(l, () => c), R((e) => {
		ni(u, "id", `pager-${t.key ?? ""}-size`), ni(u, "aria-label", `${J(i) ?? ""} per page`), d !== (d = Co.pageSize) && (u.value = (u.__value = d) ?? "", Yr(u, d)), ni(f, "id", `pager-${t.key ?? ""}-previous`), f.disabled = J(r).page === 0, Z(m, e), ni(h, "id", `pager-${t.key ?? ""}-next`), h.disabled = J(r).page === J(r).pages - 1;
	}, [() => Ua(J(r), J(n), t.noun)]), rr("change", u, (e) => s(e.currentTarget, Number(e.currentTarget.value))), rr("click", f, (e) => o(e.currentTarget, J(r).page - 1)), rr("click", h, (e) => o(e.currentTarget, J(r).page + 1)), X(e, l), Ge();
}
ir(["change", "click"]);
//#endregion
//#region src/lib/paging.svelte.ts
var Ss = /* @__PURE__ */ t({
	TablePages: () => Cs,
	mountPager: () => Es,
	releaseDetachedPagers: () => Ds,
	tablePages: () => ws
}), Cs = class {
	#e = new Wo();
	first(e) {
		return this.#e.get(e) ?? 0;
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	forget(e) {
		this.#e.delete(e);
	}
}, ws = new Cs(), Ts = /* @__PURE__ */ new Set();
function Es(e) {
	let t = document.createElement("div"), n = yr(xs, {
		target: t,
		props: e
	});
	Tt();
	let r = t.firstElementChild;
	if (!(r instanceof HTMLElement)) throw Error("The pager drew no element");
	return Ts.add({
		component: n,
		root: r
	}), r;
}
function Ds() {
	for (let e of [...Ts]) e.root.isConnected || (Ts.delete(e), Cr(e.component));
}
//#endregion
//#region src/lib/secrets.ts
var Os = /* @__PURE__ */ t({
	secretReach: () => Ms,
	secretTone: () => ks,
	secretVia: () => As
});
function ks(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function As(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var js = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function Ms(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(js, e.reach) ? js[e.reach] ?? "" : "no result yet";
}
//#endregion
//#region src/legacy.svelte.ts
var Ns = [
	Ni,
	hi,
	Ko,
	Os,
	ns,
	za,
	$i,
	lo,
	vo,
	Ss,
	gs,
	di,
	ls
];
function Ps(e) {
	let t = new Go(), n = e.document.getElementById("error");
	if (!n?.parentElement) throw Error("The page has no #error placeholder for the banner");
	let r = ["kpis", "runtime"].map((t) => {
		let n = e.document.getElementById(t);
		if (!n) throw Error(`The page has no #${t} container for the tiles`);
		return {
			id: t,
			container: n
		};
	}), i = yr(ui, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	n.remove();
	let a = r.map(({ id: e, container: t }) => yr(Uo, {
		target: t,
		props: { rows: e }
	}));
	return e.showError = (e, n) => {
		t.show(e, n), Tt();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...Ns), { stop() {
		Cr(i);
		for (let e of a) Cr(e);
		Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of Ns.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
Ps(window);
//#endregion

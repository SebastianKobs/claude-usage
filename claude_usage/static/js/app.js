//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, c = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, l = (n, r, o) => (o = n == null ? {} : e(i(n)), c(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), u = {}, d = Symbol("uninitialized"), f = "http://www.w3.org/1999/xhtml", p = "http://www.w3.org/2000/svg", m = "http://www.w3.org/1998/Math/MathML", h = Array.isArray, g = Array.prototype.indexOf, _ = Array.prototype.includes, v = Array.from, y = Object.defineProperty, b = Object.getOwnPropertyDescriptor, x = Object.getOwnPropertyDescriptors, S = Object.prototype, ee = Array.prototype, te = Object.getPrototypeOf, C = Object.isExtensible, w = () => {};
function ne(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function re() {
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
var ie = 1 << 24, T = 1024, ae = 2048, E = 4096, oe = 8192, D = 16384, se = 32768, ce = 1 << 25, le = 65536, ue = 1 << 19, de = 1 << 20, O = 1 << 25, fe = 1 << 21, pe = 1 << 22, me = 1 << 23, he = Symbol("$state"), ge = Symbol("component"), _e = Symbol("legacy props"), ve = Symbol(""), ye = Symbol("attributes"), be = Symbol("class"), xe = Symbol("style"), Se = Symbol("text"), Ce = Symbol("form reset"), we = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Te = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function Ee() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function De(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Oe() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function ke() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var k = !1;
function Ae(e) {
	k = e;
}
var je;
function Me(e) {
	if (e === null) throw De(), u;
	return je = e;
}
function Ne() {
	return Me(/* @__PURE__ */ pn(je));
}
function A(e) {
	if (k) {
		if (/* @__PURE__ */ pn(je) !== null) throw De(), u;
		je = e;
	}
}
function Pe(e = 1) {
	if (k) {
		for (var t = e, n = je; t--;) n = /* @__PURE__ */ pn(n);
		je = n;
	}
}
function Fe(e = !0) {
	for (var t = 0, n = je;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ pn(n);
		e && n.remove(), n = i;
	}
}
function Ie(e) {
	if (!e || e.nodeType !== 8) throw De(), u;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Le(e) {
	return e === this.v;
}
function Re(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function ze(e) {
	return !Re(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Be() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ve(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function He(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ue() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function We(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Ge() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ke(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function qe() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Je() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ye() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Xe() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var Ze = null;
function Qe(e) {
	Ze = e;
}
function j(e, t = !1, n) {
	Ze = {
		p: Ze,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: tr,
		l: null
	};
}
function M(e) {
	var t = Ze, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) kn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ze = t.p, $e(e);
}
function $e(e = {}) {
	return y(e, ge, { value: !0 }), e;
}
function et() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var tt = [];
function nt() {
	var e = tt;
	tt = [], ne(e);
}
function rt(e) {
	if (tt.length === 0 && !At) {
		var t = tt;
		queueMicrotask(() => {
			t === tt && nt();
		});
	}
	tt.push(e);
}
function it() {
	for (; tt.length > 0;) nt();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var at = ~(ae | E | T);
function ot(e, t) {
	e.f = e.f & at | t;
}
function st(e) {
	e.f & 512 || e.deps === null ? ot(e, T) : ot(e, E);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function ct(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), ot(e, T);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
var lt = !1;
function ut() {
	lt || (lt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[Ce]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function dt(e) {
	var t = Qn, n = tr;
	er(null), nr(null);
	try {
		return e();
	} finally {
		er(t), nr(n);
	}
}
function ft(e, t, n, r = n) {
	e.addEventListener(t, () => dt(n));
	let i = e[Ce];
	e[Ce] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ut();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function pt(e, t, n, r) {
	let i = et() ? _t : bt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = tr, c = mt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Sn(e, s);
			}
			ht();
		}
	}
	var d = gt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ yt(e))).then(u).catch((e) => Sn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ht();
	}) : f();
}
function mt() {
	var e = tr, t = Qn, n = Ze, r = P;
	return function(i = !0) {
		nr(e), er(t), Qe(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ht(e = !0) {
	nr(null), er(null), Qe(null), e && P?.deactivate();
}
function gt() {
	var e = tr, t = e.b, n = P, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function _t(e) {
	var t = 2 | ae;
	return tr !== null && (tr.f |= ue), {
		ctx: Ze,
		deps: null,
		effects: null,
		equals: Le,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: d,
		wv: 0,
		parent: tr,
		ac: null
	};
}
var vt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function yt(e, t, n) {
	let r = tr;
	r === null && Be();
	var i = void 0, a = qt(d), o = !Qn, s = /* @__PURE__ */ new Set();
	return Mn(() => {
		var t = tr, n = re();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== we && n.reject(e);
			}).finally(ht);
		} catch (e) {
			n.reject(e), ht();
		}
		var c = P;
		if (o) {
			if (t.f & 32768) var l = gt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(vt);
			else for (let e of s.values()) e.reject(vt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== vt && (c.activate(), t ? (a.f |= me, Zt(a, t)) : (a.f & 8388608 && (a.f ^= me), Zt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Dn(() => {
		for (let e of s) e.reject(vt);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function N(e) {
	let t = /* @__PURE__ */ _t(e);
	return ir(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function bt(e) {
	let t = /* @__PURE__ */ _t(e);
	return t.equals = ze, t;
}
function xt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Bn(t[n]);
	}
}
function St(e) {
	var t, n = tr, r = e.parent;
	if (!Xn && r !== null && e.v !== d && r.f & 24576) return Ee(), e.v;
	nr(r);
	try {
		xt(e), t = gr(e);
	} finally {
		nr(n);
	}
	return t;
}
function Ct(e) {
	var t = St(e);
	if (!e.equals(t) && (e.wv = pr(), (!P?.is_fork || e.deps === null) && (P === null ? e.v = t : (P.capture(e, t, !0), Dt?.capture(e, t, !0)), e.deps === null))) {
		ot(e, T);
		return;
	}
	Xn || (Ot === null ? st(e) : (En() || P?.is_fork) && Ot.set(e, t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && dt(() => {
		t.ac.abort(we), t.ac = null;
	}), t.fn !== null && (t.teardown = w), yr(t, 0), Rn(t));
}
function Tt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && br(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Et = null, P = null, Dt = null, Ot = null, kt = null, At = !1, jt = !1, Mt = null, Nt = null, Pt = 0, Ft = 1, It = class e {
	id = Ft++;
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
		Et === null ? Et = this : (Et.#n = this, this.#t = Et), Et = this;
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
			for (var r of n.d) ot(r, ae), t(r);
			for (r of n.m) ot(r, E), t(r);
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
					t.f ^= T;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), ot(e, ae), this.schedule(e);
		for (let e of this.#d) ot(e, E), this.schedule(e);
		this.apply();
		for (var t = Mt = [], n = [], r = Nt = []; this.#c.length > 0;) {
			Pt++ > 1e3 && (this.#S(), Rt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Ut(e), this.#h() || this.discard(), t;
			}
		}
		if (P = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Mt = null, Nt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Ht(e, t);
			r.length > 0 && P.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Dt = this, Bt(n), Bt(t), Dt = null, this.#s?.resolve();
		var o = P;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (Gt.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= T;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= T : i & 4 ? t.push(r) : mr(r) && (i & 16 && this.#d.add(r), br(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), ot(i, ae), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), P = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) ct(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== d && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Ot?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		P = this;
	}
	deactivate() {
		P = null, Ot = null;
	}
	flush() {
		try {
			jt = !0, P = this, this.#_();
		} finally {
			Pt = 0, kt = null, Mt = null, Nt = null, jt = !1, P = null, Ot = null, Gt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(vt);
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
		this.#m || (this.#m = !0, rt(() => {
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
		return (this.#s ??= re()).promise;
	}
	static ensure() {
		if (P === null) {
			let t = P = new e();
			!jt && !At && rt(() => {
				t.#e || t.flush();
			});
		}
		return P;
	}
	apply() {
		Ot = null;
	}
	schedule(e) {
		if (kt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Et = e : t.#t = e, this.linked = !1;
		}
	}
};
function Lt(e) {
	var t = At;
	At = !0;
	try {
		var n;
		for (e && (P !== null && !P.is_fork && P.flush(), n = e());;) {
			if (it(), P === null) return n;
			P.flush();
		}
	} finally {
		At = t;
	}
}
function Rt() {
	try {
		Ge();
	} catch (e) {
		Sn(e, kt);
	}
}
var zt = null;
function Bt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && mr(r) && (zt = /* @__PURE__ */ new Set(), br(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Hn(r), zt?.size > 0)) {
				Gt.clear();
				for (let e of zt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) zt.has(n) && (zt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || br(n);
					}
				}
				zt.clear();
			}
		}
		zt = null;
	}
}
function Vt(e) {
	P.schedule(e);
}
function Ht(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), ot(e, T);
		for (var n = e.first; n !== null;) Ht(n, t), n = n.next;
	}
}
function Ut(e) {
	ot(e, T);
	for (var t = e.first; t !== null;) Ut(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Wt = /* @__PURE__ */ new Set(), Gt = /* @__PURE__ */ new Map(), Kt = !1;
function qt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Le,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function F(e, t) {
	let n = qt(e, t);
	return ir(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Jt(e, t = !1, n = !0) {
	let r = qt(e);
	return t || (r.equals = ze), r;
}
function I(e, t, n = !1) {
	return Qn !== null && (!$n || Qn.f & 131072) && et() && Qn.f & 4325394 && (rr === null || !rr.has(e)) && Ye(), Zt(e, n ? tn(t) : t, Nt);
}
var Yt = null, Xt = 0;
function Zt(e, t, n = null) {
	if (!e.equals(t)) {
		Xn ? Gt.set(e, t) : Gt.has(e) || Gt.set(e, e.v);
		var r = It.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && St(t), Ot === null && st(t);
		}
		e.wv = pr(), Yt = null, Xt = 0, en(e, ae, n), Yt = null, et() && tr !== null && tr.f & 1024 && !(tr.f & 96) && (sr === null ? cr([e]) : sr.push(e)), !r.is_fork && Wt.size > 0 && !Kt && Qt();
	}
	return t;
}
function Qt() {
	Kt = !1;
	for (let e of Wt) {
		e.f & 1024 && ot(e, E);
		let t;
		try {
			t = mr(e);
		} catch {
			t = !0;
		}
		t && br(e);
	}
	Wt.clear();
}
function $t(e) {
	I(e, e.v + 1);
}
function en(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = et(), a = r.length;
		if (Xt += a, Xt > 1e5 && Yt === null && (Yt = /* @__PURE__ */ new Set()), Yt !== null) {
			if (Yt.has(e)) return;
			Yt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== tr) {
				var l = (c & ae) === 0;
				if (l && ot(s, t), c & 131072) Wt.add(s);
				else if (c & 2) {
					var u = s;
					Ot?.delete(u), en(u, E, n);
				} else if (l) {
					var d = s;
					c & 16 && zt !== null && zt.add(d), n === null ? Vt(d) : n.push(d);
				}
			}
		}
	}
}
function tn(e) {
	if (typeof e != "object" || !e || he in e || ge in e) return e;
	let t = te(e);
	if (t !== S && t !== ee) return e;
	var n = /* @__PURE__ */ new Map(), r = h(e), i = /* @__PURE__ */ F(0), a = null, o = dr, s = (e) => {
		if (dr === o) return e();
		var t = Qn, n = dr;
		er(null), fr(o);
		var r = e();
		return er(t), fr(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ F(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && qe();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ F(r.value, a);
				return n.set(t, e), e;
			}) : I(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ F(d, a));
					n.set(t, e), $t(i);
				}
			} else I(r, d), $t(i);
			return !0;
		},
		get(t, r, i) {
			if (r === he) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || b(t, r)?.writable) && (o = s(() => /* @__PURE__ */ F(tn(c ? t[r] : d), a)), n.set(r, o)), o !== void 0) {
				var l = H(o);
				return l === d ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var r = Reflect.getOwnPropertyDescriptor(e, t), i = n.get(t);
			if (i !== void 0) {
				var a = H(i);
				if (a === d) return;
				if (r && "value" in r) r.value = a;
				else return {
					enumerable: !0,
					configurable: !0,
					value: a,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === he) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== d || Reflect.has(e, t);
			return (r !== void 0 || tr !== null && (!i || b(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ F(i ? tn(e[t]) : d, a)), n.set(t, r)), H(r) === d) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var f = o; f < l.v; f += 1) {
				var p = n.get(f + "");
				p === void 0 ? f in e && (p = s(() => /* @__PURE__ */ F(d, a)), n.set(f + "", p)) : I(p, d);
			}
			if (l === void 0) (!u || b(e, t)?.writable) && (l = s(() => /* @__PURE__ */ F(void 0, a)), I(l, tn(o)), n.set(t, l));
			else {
				u = l.v !== d;
				var m = s(() => tn(o));
				I(l, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var g = n.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && I(g, _ + 1);
				}
				$t(i);
			}
			return !0;
		},
		ownKeys(e) {
			H(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== d;
			});
			for (var [r, a] of n) a.v !== d && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			Je();
		}
	});
}
function nn(e) {
	try {
		if (typeof e == "object" && e && he in e) return e[he];
	} catch {}
	return e;
}
function rn(e, t) {
	return Object.is(nn(e), nn(t));
}
var an, on, sn, cn, ln;
function un() {
	if (an === void 0) {
		an = window, on = document, sn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		cn = b(t, "firstChild").get, ln = b(t, "nextSibling").get, C(e) && (e[be] = void 0, e[ye] = null, e[xe] = void 0, e.__e = void 0), C(n) && (n[Se] = void 0);
	}
}
function dn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function fn(e) {
	return cn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function pn(e) {
	return ln.call(e);
}
function L(e, t) {
	if (!k) return /* @__PURE__ */ fn(e);
	var n = /* @__PURE__ */ fn(je);
	if (n === null) n = je.appendChild(dn());
	else if (t && n.nodeType !== 3) {
		var r = dn();
		return n?.before(r), Me(r), r;
	}
	return t && bn(n), Me(n), n;
}
function R(e, t = !1) {
	if (!k) {
		var n = /* @__PURE__ */ fn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ pn(n) : n;
	}
	if (t) {
		if (je?.nodeType !== 3) {
			var r = dn();
			return je?.before(r), Me(r), r;
		}
		bn(je);
	}
	return je;
}
function z(e, t = !1) {
	if (!k) return /* @__PURE__ */ fn(e);
	var n = L(e, t);
	return A(e), n;
}
function B(e, t = 1, n = !1) {
	let r = k ? je : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ pn(r);
	if (!k) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = dn();
			return r === null ? i?.after(a) : r.before(a), Me(a), a;
		}
		bn(r);
	}
	return Me(r), r;
}
function mn(e) {
	e.textContent = "";
}
function hn() {
	return !1;
}
function gn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function _n() {
	return document.createDocumentFragment();
}
function vn(e = "") {
	return document.createComment(e);
}
function yn(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function bn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function xn(e) {
	var t = tr;
	if (t === null) return Qn.f |= me, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Sn(e, t);
}
function Sn(e, t) {
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
function Cn(e) {
	tr === null && (Qn === null && We(e), Ue()), Xn && He(e);
}
function wn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Tn(e, t) {
	var n = tr;
	n !== null && n.f & 8192 && (e |= oe);
	var r = {
		ctx: Ze,
		deps: null,
		nodes: null,
		f: e | ae | 512,
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
	P?.register_created_effect(r);
	var i = r;
	if (e & 4) Mt === null ? It.ensure().schedule(r) : Mt.push(r);
	else if (t !== null) {
		try {
			br(r);
		} catch (e) {
			throw Bn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= le));
	}
	if (i !== null && (i.parent = n, n !== null && wn(i, n), Qn !== null && Qn.f & 2 && !(e & 64))) {
		var a = Qn;
		(a.effects ??= []).push(i);
	}
	return r;
}
function En() {
	return Qn !== null && !$n;
}
function Dn(e) {
	let t = Tn(8, null);
	return ot(t, T), t.teardown = e, t;
}
function On(e) {
	Cn("$effect");
	var t = tr.f;
	if (!Qn && t & 32 && Ze !== null && !Ze.i) {
		var n = Ze;
		(n.e ??= []).push(e);
	} else return kn(e);
}
function kn(e) {
	return Tn(4 | de, e);
}
function An(e) {
	It.ensure();
	let t = Tn(64 | ue, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Un(t, () => {
			Bn(t), n(void 0);
		}) : (Bn(t), n(void 0));
	});
}
function jn(e) {
	return Tn(4, e);
}
function Mn(e) {
	return Tn(pe | ue, e);
}
function Nn(e, t = 0) {
	return Tn(8 | t, e);
}
function V(e, t = [], n = [], r = []) {
	pt(r, t, n, (t) => {
		Tn(8, () => {
			e(...t.map(H));
		});
	});
}
function Pn(e, t = 0) {
	return Tn(16 | t, e);
}
function Fn(e, t = 0) {
	return Tn(ie | t, e);
}
function In(e) {
	return Tn(32 | ue, e);
}
function Ln(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Xn, r = Qn;
		Zn(!0), er(null);
		try {
			t.call(null);
		} catch (t) {
			Sn(t, e.parent);
		} finally {
			Zn(n), er(r);
		}
	}
}
function Rn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && dt(() => {
			e.abort(we);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Bn(n, t), n = r;
	}
}
function zn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Bn(t), t = n;
	}
}
function Bn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Vn(e.nodes.start, e.nodes.end), n = !0), e.f |= ce, Rn(e, t && !n), yr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Ln(e), e.f ^= ce, e.f |= D;
	var i = e.parent;
	i !== null && i.first !== null && Hn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Vn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ pn(e);
		e.remove(), e = n;
	}
}
function Hn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Un(e, t, n = !0) {
	var r = [];
	e.f |= 256, Wn(e, r, !0);
	var i = () => {
		n && Bn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Wn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= oe;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Wn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Gn(e) {
	e.f &= -257, Kn(e, !0);
}
function Kn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= oe, e.f & 1024 || (ot(e, ae), It.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Kn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function qn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ pn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Jn = null, Yn = !1, Xn = !1;
function Zn(e) {
	Xn = e;
}
var Qn = null, $n = !1;
function er(e) {
	Qn = e;
}
var tr = null;
function nr(e) {
	tr = e;
}
var rr = null;
function ir(e) {
	Qn !== null && (Qn.f & 2097152 || Qn.f & 2) && (rr ??= /* @__PURE__ */ new Set()).add(e);
}
var ar = null, or = 0, sr = null;
function cr(e) {
	sr = e;
}
var lr = 1, ur = 0, dr = ur;
function fr(e) {
	dr = e;
}
function pr() {
	return ++lr;
}
function mr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (mr(a) && Ct(a), a.wv > e.wv) return !0;
		}
		t & 512 && Ot === null && ot(e, T);
	}
	return !1;
}
function hr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(rr !== null && rr.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? hr(a, t, !1) : t === a && (n ? ot(a, ae) : a.f & 1024 && ot(a, E), Vt(a));
	}
}
function gr(e) {
	var t = ar, n = or, r = sr, i = Qn, a = rr, o = Ze, s = $n, c = dr, l = e.f;
	ar = null, or = 0, sr = null, Qn = l & 96 ? null : e, rr = null, Qe(e.ctx), $n = !1, dr = ++ur, e.ac !== null && (dt(() => {
		e.ac.abort(we);
	}), e.ac = null);
	try {
		e.f |= fe;
		var u = e.fn, d = u();
		e.f |= se;
		var f = _r(e);
		if (et() && sr !== null && !$n && f !== null && !(e.f & 6146)) for (var p = 0; p < sr.length; p++) hr(sr[p], e);
		if (i !== null && i !== e) {
			if (ur++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ur;
			if (t !== null) for (let e of t) e.rv = ur;
			sr !== null && (r === null ? r = sr : r.push(...sr));
		}
		return e.f & 8388608 && (e.f ^= me), d;
	} catch (t) {
		return _r(e), xn(t);
	} finally {
		e.f ^= fe, ar = t, or = n, sr = r, Qn = i, rr = a, Qe(o), $n = s, dr = c;
	}
}
function _r(e) {
	var t = e.deps, n = P?.is_fork;
	if (ar !== null) {
		var r;
		if (n || yr(e, or), t !== null && or > 0) for (t.length = or + ar.length, r = 0; r < ar.length; r++) t[or + r] = ar[r];
		else e.deps = t = ar;
		if (En() && e.f & 512) for (r = or; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && or < t.length && (yr(e, or), t.length = or);
	return t;
}
function vr(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = g.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (ar === null || !_.call(ar, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512), a.v !== d && st(a), a.ac !== null && dt(() => {
			a.ac.abort(we), a.ac = null, ot(a, ae);
		}), wt(a), yr(a, 0);
	}
}
function yr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) vr(e, n[r]);
}
function br(e) {
	var t = e.f;
	if (!(t & 16384)) {
		ot(e, T);
		var n = tr, r = Yn;
		tr = e, Yn = !(t & 96);
		try {
			t & 16777232 ? zn(e) : Rn(e), Ln(e);
			var i = gr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = lr;
		} finally {
			Yn = r, tr = n;
		}
	}
}
async function xr() {
	await Promise.resolve(), Lt();
}
function H(e) {
	var t = !!(e.f & 2);
	if (Jn?.add(e), Qn !== null && !$n && !(tr !== null && tr.f & 16384) && (rr === null || !rr.has(e))) {
		var n = Qn.deps;
		if (Qn.f & 2097152) e.rv < ur && (e.rv = ur, ar === null && n !== null && n[or] === e ? or++ : ar === null ? ar = [e] : ar.push(e));
		else {
			Qn.deps ??= [], _.call(Qn.deps, e) || Qn.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [Qn] : _.call(r, Qn) || r.push(Qn);
		}
	}
	if (Xn && Gt.has(e)) return Gt.get(e);
	if (t) {
		var i = e;
		if (Xn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Cr(i)) && (a = St(i)), Gt.set(i, a), a;
		}
		var o = !(i.f & 512) && !$n && Qn !== null && (Yn || !!(Qn.f & 512)), s = (i.f & se) === 0;
		mr(i) && (o && (i.f |= 512), Ct(i)), o && !s && (Tt(i), Sr(i));
	}
	if (Ot?.has(e)) return Ot.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Sr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Tt(t), Sr(t));
}
function Cr(e) {
	if (e.v === d) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Gt.has(t) || t.f & 2 && Cr(t)) return !0;
	return !1;
}
function wr(e) {
	var t = $n;
	try {
		return $n = !0, e();
	} finally {
		$n = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var Tr = Symbol("events"), Er = /* @__PURE__ */ new Set(), Dr = /* @__PURE__ */ new Set();
function Or(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Pr.call(t, e), !e.cancelBubble) return dt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, rt(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function kr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Or(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Dn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Ar(e, t, n) {
	(t[Tr] ??= {})[e] = n;
}
function jr(e) {
	for (var t = 0; t < e.length; t++) Er.add(e[t]);
	for (var n of Dr) n(e);
}
var Mr = null, Nr = !1;
function Pr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Mr = e, Nr || (Nr = !0, setTimeout(() => {
		Nr = !1, Mr = null;
	}));
	var o = 0, s = Mr === e && e[Tr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Tr] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		y(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = Qn, d = tr;
		er(null), nr(null);
		try {
			for (var f, p = []; a !== null && a !== t;) {
				try {
					var m = a[Tr]?.[r];
					m != null && (!a.disabled || e.target === a) && m.call(a, e);
				} catch (e) {
					f ? p.push(e) : f = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (f) {
				for (let e of p) queueMicrotask(() => {
					throw e;
				});
				throw f;
			}
		} finally {
			e[Tr] = t, delete e.currentTarget, er(u), nr(d);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var Fr = Te ? "template" : "TEMPLATE";
function Ir(e, t) {
	var n = tr;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function Lr(e, t) {
	var n = _n();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(dn(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(vn(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, o, ...s] = r, c = e === "svg" ? p : e === "math" ? m : t;
		var i = gn(e, c, o?.is);
		for (var a in o) yn(i, a, o[a]);
		s.length > 0 && (i.nodeName === Fr ? i.content : i).append(Lr(s, i.nodeName === "foreignObject" ? void 0 : c)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function U(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (k) return Ir(je, null), je;
		i === void 0 && (i = Lr(e, t & 4 ? p : t & 8 ? m : void 0), n || (i = /* @__PURE__ */ fn(i)));
		var a = r || sn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ fn(a), s = a.lastChild;
			Ir(o, s);
		} else Ir(a, a);
		return a;
	};
}
function Rr(e = "") {
	if (!k) {
		var t = dn(e + "");
		return Ir(t, t), t;
	}
	var n = je;
	return n.nodeType === 3 ? bn(n) : (n.before(n = dn()), Me(n)), Ir(n, n), n;
}
function W() {
	if (k) return Ir(je, null), je;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = dn();
	return e.append(t, n), Ir(t, n), e;
}
function G(e, t) {
	if (k) {
		var n = tr;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = je), Ne();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var zr = ["touchstart", "touchmove"];
function Br(e) {
	return zr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Vr(e) {
	let t = 0, n = qt(0), r;
	return () => {
		En() && (H(n), Nn(() => (t === 0 && (r = wr(() => e(() => $t(n)))), t += 1, () => {
			rt(() => {
				--t, t === 0 && (r?.(), r = void 0, $t(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Hr = le | ue;
function Ur(e, t, n, r) {
	new Wr(e, t, n, r);
}
var Wr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = k ? je : null;
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
	#h = Vr(() => (this.#m = qt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = tr;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = tr.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Pn(() => {
			if (k) {
				let e = this.#t;
				Ne();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Hr), k && (this.#e = je);
	}
	#g() {
		try {
			this.#a = In(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		rt(r), t && (this.#s = In(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				ke();
				return;
			}
			t = !0, n && Xe(), this.#s !== null && Un(this.#s, () => {
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
					Sn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = In(() => e(this.#e)), rt(() => {
			var e = this.#c = document.createDocumentFragment(), t = dn(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return In(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						Sn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(P);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Un(this.#o, () => {
				this.#o = null;
			}), this.#x(P));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = In(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				qn(this.#a, e);
				let t = this.#n.pending;
				this.#o = In(() => t(this.#e));
			} else this.#x(P);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		ct(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = tr, n = Qn, r = Ze;
		nr(this.#i), er(this.#i), Qe(this.#i.ctx);
		try {
			return It.ensure(), e();
		} finally {
			nr(t), er(n), Qe(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Un(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, rt(() => {
			this.#d = !1, this.#m && Zt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), H(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		P?.is_fork ? (this.#a && P.skip_effect(this.#a), this.#o && P.skip_effect(this.#o), this.#s && P.skip_effect(this.#s), P.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Bn(this.#a), null), this.#o &&= (Bn(this.#o), null), this.#s &&= (Bn(this.#s), null), k && (Me(this.#t), Pe(), Me(Fe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return In(() => {
						var r = tr;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Sn(e, this.#i.parent), null;
				}
			}));
		};
		rt(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				Sn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Sn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function K(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[Se] ??= e.nodeValue) && (e[Se] = n, e.nodeValue = `${n}`);
}
function Gr(e, t) {
	return qr(e, t);
}
var Kr = /* @__PURE__ */ new Map();
function qr(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	un();
	var c = void 0, l = An(() => {
		var o = n ?? t.appendChild(dn());
		Ur(o, { pending: () => {} }, (t) => {
			j({});
			var n = Ze;
			if (a && (n.c = a), i && (r.$$events = i), k && Ir(t, null), c = e(t, r) || $e(), k && (tr.nodes.end = je, je === null || je.nodeType !== 8 || je.data !== "]")) throw De(), u;
			M();
		}, s);
		var l = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!l.has(r)) {
					l.add(r);
					var i = Br(r);
					for (let e of [t, document]) {
						var a = Kr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Kr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Pr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(v(Er)), Dr.add(d), () => {
			for (var e of l) for (let n of [t, document]) {
				var r = Kr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Pr), r.delete(e), r.size === 0 && Kr.delete(n)) : r.set(e, i);
			}
			Dr.delete(d), o !== n && o.parentNode?.removeChild(o);
		};
	});
	return Jr.set(c, l), c;
}
var Jr = /* @__PURE__ */ new WeakMap();
function Yr(e, t) {
	let n = Jr.get(e);
	return n ? (Jr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Xr = class {
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
			if (n) Gn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Gn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Bn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						qn(r, t), t.append(dn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Bn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Un(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Bn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = P, r = hn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = dn();
				i.append(a), this.#n.set(e, {
					effect: In(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, In(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else k && (this.anchor = je), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function Zr(e, t, ...n) {
	var r = new Xr(e);
	Pn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, le);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function q(e, t, n = !1) {
	var r;
	k && (r = je, Ne());
	var i = new Xr(e), a = n ? le : 0;
	function o(e, t) {
		if (k) {
			var n = Ie(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Fe();
				Me(a), i.anchor = a, Ae(!1), i.ensure(e, t), Ae(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Pn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var Qr = Symbol("NaN");
function $r(e, t, n) {
	k && Ne();
	var r = new Xr(e), i = !et();
	Pn(() => {
		var e = t();
		e !== e && (e = Qr), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function ei(e, t) {
	return t;
}
function ti(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Un(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					ni(e, v(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, u = l.parentNode;
			mn(u), u.append(l), e.items.clear();
		}
		ni(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function ni(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= O, qn(a, document.createDocumentFragment())) : Bn(t[i], n);
	}
}
var ri;
function J(e, t, n, r, i, a = null) {
	var o = e, s = /* @__PURE__ */ new Map();
	if (t & 4) {
		var c = e;
		o = k ? Me(/* @__PURE__ */ fn(c)) : c.appendChild(dn());
	}
	k && Ne();
	var l = null, u = /* @__PURE__ */ bt(() => {
		var e = n();
		return h(e) ? e : e == null ? [] : v(e);
	}), d, f = /* @__PURE__ */ new Map(), p = !0;
	function m(e) {
		_.effect.f & 16384 || (_.pending.delete(e), _.fallback = l, ai(_, d, o, t, r), l !== null && (d.length === 0 ? l.f & 33554432 ? (l.f ^= O, si(l, null, o)) : Gn(l) : Un(l, () => {
			l = null;
		})));
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: Pn(() => {
			d = H(u);
			var e = d.length;
			let c = !1;
			k && Ie(o) === "[!" != (e === 0) && (o = Fe(), Me(o), Ae(!1), c = !0);
			for (var h = /* @__PURE__ */ new Set(), _ = P, v = hn(), y = 0; y < e; y += 1) {
				k && je.nodeType === 8 && je.data === "]" && (o = je, c = !0, Ae(!1));
				var b = d[y], x = r(b, y), S = p ? null : s.get(x);
				S ? (S.v && Zt(S.v, b), S.i && Zt(S.i, y), v && _.unskip_effect(S.e)) : (S = oi(s, p ? o : ri ??= dn(), b, x, y, i, t, n), p || (S.e.f |= O), s.set(x, S)), h.add(x);
			}
			if (e === 0 && a && !l && (p ? l = In(() => a(o)) : (l = In(() => a(ri ??= dn())), l.f |= O)), e > h.size && Ve("", "", ""), k && e > 0 && Me(Fe()), !p) {
				if (f.set(_, h), v) {
					for (let [e, t] of s) h.has(e) || _.skip_effect(t.e);
					_.oncommit(m), _.ondiscard(g);
				} else m(_);
			}
			c && Ae(!0), H(u);
		}),
		flags: t,
		items: s,
		pending: f,
		outrogroups: null,
		fallback: l
	};
	p = !1, k && (o = je);
}
function ii(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function ai(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = ii(e.effect.first), l, u = null, d, f = [], p = [], m, h, g, _;
	if (a) for (_ = 0; _ < o; _ += 1) m = t[_], h = i(m, _), g = s.get(h).e, g.f & 33554432 || (g.nodes?.a?.measure(), (d ??= /* @__PURE__ */ new Set()).add(g));
	for (_ = 0; _ < o; _ += 1) {
		if (m = t[_], h = i(m, _), g = s.get(h).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(g), t.done.delete(g);
		if (g.f & 8192 && (Gn(g), a && (g.nodes?.a?.unfix(), (d ??= /* @__PURE__ */ new Set()).delete(g))), g.f & 33554432) {
			if (g.f ^= O, g === c) si(g, null, n);
			else {
				var y = u ? u.next : c;
				g === e.effect.last && (e.effect.last = g.prev), g.prev && (g.prev.next = g.next), g.next && (g.next.prev = g.prev), ci(e, u, g), ci(e, g, y), si(g, y, n), u = g, f = [], p = [], c = ii(u.next);
				continue;
			}
		}
		if (g !== c) {
			if (l !== void 0 && l.has(g)) {
				if (f.length < p.length) {
					var b = p[0], x;
					u = b.prev;
					var S = f[0], ee = f[f.length - 1];
					for (x = 0; x < f.length; x += 1) si(f[x], b, n);
					for (x = 0; x < p.length; x += 1) l.delete(p[x]);
					ci(e, S.prev, ee.next), ci(e, u, S), ci(e, ee, b), c = b, u = ee, --_, f = [], p = [];
				} else l.delete(g), si(g, c, n), ci(e, g.prev, g.next), ci(e, g, u === null ? e.effect.first : u.next), ci(e, u, g), u = g;
				continue;
			}
			for (f = [], p = []; c !== null && c !== g;) (l ??= /* @__PURE__ */ new Set()).add(c), p.push(c), c = ii(c.next);
			if (c === null) continue;
		}
		g.f & 33554432 || f.push(g), u = g, c = ii(g.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (ni(e, v(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var te = [];
		if (l !== void 0) for (g of l) g.f & 8192 || te.push(g);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && te.push(c), c = ii(c.next);
		var C = te.length;
		if (C > 0) {
			var w = r & 4 && o === 0 ? n : null;
			if (a) {
				for (_ = 0; _ < C; _ += 1) te[_].nodes?.a?.measure();
				for (_ = 0; _ < C; _ += 1) te[_].nodes?.a?.fix();
			}
			ti(e, te, w);
		}
	}
	a && rt(() => {
		if (d !== void 0) for (g of d) g.nodes?.a?.apply();
	});
}
function oi(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? qt(n) : /* @__PURE__ */ Jt(n, !1, !1) : null, l = o & 2 ? qt(i) : null;
	return {
		v: c,
		i: l,
		e: In(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function si(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ pn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function ci(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function li(e, t) {
	var n = void 0, r;
	Fn(() => {
		n !== (n = t()) && (r &&= (Bn(r), null), n && (r = In(() => {
			jn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function ui(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = ui(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function di() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = ui(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function fi(e) {
	return typeof e == "object" ? di(e) : e ?? "";
}
var pi = [..." 	\n\r\f\xA0\v﻿"];
function mi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || pi.includes(r[o - 1])) && (s === r.length || pi.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function hi(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function gi(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function _i(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(gi)), i && c.push(...Object.keys(i).map(gi));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = gi(e.substring(l, u).trim());
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
		return r && (n += hi(r)), i && (n += hi(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function vi(e, t, n, r, i, a) {
	var o = e[be];
	if (k || o !== n || o === void 0) {
		var s = mi(n, r, a);
		(!k || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[be] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function yi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function bi(e, t, n, r) {
	var i = e[xe];
	if (k || i !== t) {
		var a = _i(t, r);
		(!k || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[xe] = t;
	} else r && (Array.isArray(r) ? (yi(e, n?.[0], r[0]), yi(e, n?.[1], r[1], "important")) : yi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function xi(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Si(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || h(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var s of e.options) {
			var c = Ei(s);
			xi(s, r ? i.includes(c) : rn(c, n));
		}
		if (t) {
			if (o !== null) for (s of e.options) {
				var l = o.has(s);
				s.selected !== l && (s.selected = l);
			}
			else e.selectedIndex !== a && (e.selectedIndex = a);
		}
	}
}
function Ci(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!h(t)) return Oe();
		for (var r of e.options) r.selected = t.includes(Ei(r));
		return;
	}
	for (r of e.options) if (rn(Ei(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function wi(e) {
	var t = new MutationObserver((t) => {
		t.every(Di) || ("__defaultValue" in e && Si(e, !1), "__value" in e && Ci(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), Dn(() => {
		t.disconnect();
	});
}
function Ti(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ft(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), Ei);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && Ei(o);
		}
		n(a), e.__value = a, P !== null && r.add(P);
	}), jn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = P;
			if (r.has(o)) return;
		}
		if (Ci(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = Ei(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function Ei(e) {
	return "__value" in e ? e.__value : e.value;
}
function Di(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Oi = Symbol("is custom element"), ki = Symbol("is html"), Ai = Te ? "link" : "LINK", ji = Te ? "progress" : "PROGRESS";
function Mi(e) {
	if (k) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Y(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Y(e, "checked", null), e.checked = r;
				}
			}
		};
		e[Ce] = n, rt(n), ut();
	}
}
function Ni(e, t) {
	var n = Pi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ji) && (e.value = t ?? "");
}
function Y(e, t, n, r) {
	var i = Pi(e);
	k && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Ai) || i[t] !== (i[t] = n) && (t === "loading" && (e[ve] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ii(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Pi(e) {
	return e[ye] ??= {
		[Oi]: e.nodeName.includes("-"),
		[ki]: e.namespaceURI === f
	};
}
var Fi = /* @__PURE__ */ new Map();
function Ii(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Fi.get(t);
	if (n) return n;
	Fi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = x(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = te(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Li(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	ft(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Ri(e) ? zi(a) : a, n(a), P !== null && r.add(P), await xr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (k && e.defaultValue !== e.value || wr(t) == null && e.value) && (n(Ri(e) ? zi(e.value) : e.value), P !== null && r.add(P)), Nn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = P;
			if (r.has(i)) return;
		}
		Ri(e) && n === zi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Ri(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function zi(e) {
	return e === "" ? null : +e;
}
var Bi = /* @__PURE__ */ new class e {
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
function Vi(e, t, n) {
	var r = Bi.observe(e, () => n(e[t]));
	jn(() => (wr(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Hi(e, t) {
	return e === t || e?.[he] === t;
}
function Ui(e = $e(), t, n, r) {
	var i = Ze.r, a = tr;
	return jn(() => {
		var o, s;
		return Nn(() => {
			o = s, s = r?.() || [], wr(() => {
				Hi(n(...s), e) || (t(e, ...s), o && Hi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Hi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var Wi = !1;
function Gi(e) {
	var t = Wi;
	try {
		return Wi = !1, [e(), Wi];
	} finally {
		Wi = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Ki(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ _t(r), H(l)) : (c && (c = !1, s = o ? wr(r) : r), s);
	let d;
	if (a) {
		var f = he in e || _e in e;
		d = b(e, t)?.set ?? (f && t in e ? (n) => e[t] = n : void 0);
	}
	var p, m = !1;
	a ? [p, m] = Gi(() => e[t]) : p = e[t], p === void 0 && r !== void 0 && (p = u(), d && (i && Ke(t), d(p)));
	var h = i ? () => {
		var n = e[t];
		return n === void 0 ? u() : (c = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (s = void 0), n === void 0 ? s : n;
	};
	if (i && !(n & 4)) return h;
	if (d) {
		var g = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || g || m) && d(t ? h() : e), e) : h();
		});
	}
	var _ = !1, v = (n & 1 ? _t : bt)(() => (_ = !1, h()));
	a && H(v);
	var y = tr;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(v) : i && a ? tn(e) : e;
			return I(v, n), _ = !0, s !== void 0 && (s = n), e;
		}
		return Xn && _ || y.f & 16384 ? v.v : H(v);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var qi = /* @__PURE__ */ U([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function Ji(e, t) {
	j(t, !0);
	var n = qi(), r = z(n, !0);
	V(() => K(r, t.messages.text)), G(e, n), M();
}
var Yi = 12;
function Xi(e) {
	return Math.max(320, e);
}
function Zi(e, t) {
	return e && t ? e / t : 1;
}
function Qi(e, t, n, r) {
	return (e - t) * r / (n || r);
}
function $i(e, t, n) {
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
function ea(e, t, n) {
	return Math.max(0, Math.min(e + Yi, n - t));
}
function ta(e, t = 8) {
	let n = Math.max(1, Math.ceil(e / t));
	return Array.from({ length: Math.ceil(e / n) }, (e, t) => t * n);
}
function na(e) {
	return Math.round(e) + .5;
}
//#endregion
//#region src/lib/colors.ts
var ra = /* @__PURE__ */ s({
	BACKGROUND_EFFORT: () => ca,
	EFFORT_ORDER: () => oa,
	EFFORT_SHADES: () => da,
	HATCH_SHADES: () => fa,
	HATCH_TURNS: () => pa,
	KNOWN_MODELS: () => ia,
	SLOT_COUNT: () => 8,
	effortHatch: () => va,
	effortLabel: () => ua,
	effortName: () => la,
	effortRank: () => sa,
	effortShade: () => _a,
	hatchTurn: () => ya,
	modelSlots: () => aa,
	shade: () => ga,
	slotColor: () => ha,
	swatchFill: () => ba
}), ia = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function aa(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of ia.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !ia.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var oa = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function sa(e) {
	let t = oa.indexOf(e);
	return t === -1 ? oa.length : t;
}
var ca = "background";
function la(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function ua(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var da = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, fa = {
	background: 1,
	ultracode: 4
}, pa = {
	background: -45,
	ultracode: 45
};
function ma(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function ha(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function ga(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? ha(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function _a(e, t) {
	return ga(e, ma(da, t) ?? 0);
}
function va(e, t) {
	let n = ma(fa, t);
	return n ? ga(e, n) : null;
}
function ya(e) {
	return ma(pa, e);
}
function ba(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var xa = /* @__PURE__ */ s({
	ago: () => za,
	compact: () => X,
	dayText: () => Ma,
	duration: () => Aa,
	longDay: () => Pa,
	longHour: () => La,
	money: () => Q,
	parseDay: () => ja,
	parseHour: () => Fa,
	percent: () => ka,
	shortDay: () => Na,
	shortHour: () => Ia,
	signed: () => Oa,
	when: () => Ra,
	whole: () => Z
}), Sa = "–", Ca = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), wa = new Intl.NumberFormat("en"), Ta = {
	month: "short",
	day: "numeric"
}, Ea = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, Da = {
	hour: "2-digit",
	minute: "2-digit"
};
function X(e) {
	return e == null ? Sa : Ca.format(e);
}
function Oa(e) {
	return e < 0 ? `−${X(-e)}` : `+${X(e)}`;
}
function Z(e) {
	return e == null ? Sa : wa.format(e);
}
function Q(e) {
	return e == null ? Sa : Math.abs(e) >= 1e3 ? "$" + Ca.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function ka(e, t) {
	if (!t) return Sa;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function Aa(e) {
	if (e == null) return Sa;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function ja(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function Ma(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function Na(e, t) {
	return ja(e).toLocaleDateString(t, Ta);
}
function Pa(e, t) {
	return ja(e).toLocaleDateString(t, Ea);
}
function Fa(e) {
	let [t = "", n = "0"] = e.split("T"), r = ja(t);
	return r.setHours(Number(n)), r;
}
function Ia(e, t) {
	return Fa(e).toLocaleTimeString(t, Da);
}
function La(e, t) {
	let n = Fa(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, Da);
	return `${n.toLocaleDateString(t, Ea)}, ${i(n)}–${i(r)}`;
}
function Ra(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...Ta,
		...Da
	}) : Sa;
}
function za(e, t = Date.now(), n) {
	if (!e) return Sa;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : Ra(e, n);
}
//#endregion
//#region src/lib/charts.ts
var Ba = /* @__PURE__ */ s({
	LIMIT_ICON: () => "⚠",
	NO_USAGE: () => $a,
	RATE_LIMIT: () => ao,
	bandIndex: () => qa,
	barShare: () => ho,
	bucketTotals: () => eo,
	chartSeries: () => to,
	columnPath: () => Ya,
	columnTotals: () => ro,
	columnWidth: () => Ja,
	costSplit: () => po,
	costTop: () => mo,
	daysSince: () => Za,
	errorText: () => co,
	inputTotal: () => Va,
	limitCounts: () => lo,
	limitTop: () => Wa,
	limitType: () => so,
	lineX: () => Ga,
	modelGroups: () => no,
	nearestIndex: () => Ka,
	niceMax: () => Ha,
	peakIndex: () => Xa,
	stackSegments: () => io,
	ticks: () => Ua,
	timeBuckets: () => Qa,
	windowHitAfter: () => uo,
	windowSpan: () => fo
});
function Va(e) {
	return e.new_input + e.cache_write + e.cache_read;
}
function Ha(e) {
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
function Ua(e, t) {
	return Array.from({ length: t + 1 }, (n, r) => e * r / t);
}
function Wa(e) {
	return Math.max(2, Math.ceil(Ha(e) / 2) * 2);
}
function Ga(e, t, n) {
	let r = e - 1;
	return (e) => r > 0 ? t + (n - t) * e / r : (t + n) / 2;
}
function Ka(e, t, n) {
	return (r) => n > 1 ? Math.round((r - e) / (t - e) * (n - 1)) : 0;
}
function qa(e, t) {
	return (n) => Math.floor((n - e) / t);
}
function Ja(e, t = 24) {
	return Math.max(2, Math.min(t, e * .6));
}
function Ya(e, t, n, r, i, a = 4) {
	let o = i ? Math.min(a, n / 2, r) : 0;
	return `M${e},${t + r}V${t + o}` + (o ? `Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}` : `H${e + n}`) + `V${t + r}Z`;
}
function Xa(e) {
	return e.indexOf(Math.max(...e));
}
function Za(e, t = /* @__PURE__ */ new Date()) {
	let n = [];
	for (let r = ja(e); r <= t; r.setDate(r.getDate() + 1)) n.push(Ma(r));
	return n;
}
function Qa(e, t = /* @__PURE__ */ new Date()) {
	if (e.days !== 1 || !e.hour_model) return {
		keys: Za(e.since, t),
		unit: "day",
		heading: "Day",
		short: Na,
		long: Pa,
		keyOf: (e) => e.day ?? ""
	};
	let n = e.since === Ma(t) ? t.getHours() : 23, r = [];
	for (let t = 0; t <= n; t += 1) r.push(`${e.since}T${String(t).padStart(2, "0")}`);
	return {
		keys: r,
		unit: "hour",
		heading: "Hour",
		short: Ia,
		long: La,
		keyOf: (e) => e.hour ?? ""
	};
}
var $a = {
	cost: 0,
	input: 0,
	output: 0
};
function eo(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			cost: 0,
			input: 0,
			output: 0
		};
		i.cost += r.cost || 0, i.input += Va(r), i.output += r.output, n.set(e, i);
	}
	return n;
}
function to(e, t, n) {
	let r = aa([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${la(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: _a(e, a.effort),
			hatch: va(e, a.effort),
			turn: ya(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : sa(e);
	return [...i.values()].sort((e, t) => (e.slot ?? 8) - (t.slot ?? 8) || e.model.localeCompare(t.model) || a(e.effort) - a(t.effort) || String(e.effort).localeCompare(String(t.effort)));
}
function no(e) {
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
function ro(e, t) {
	return t.map((t) => e.reduce((e, n) => e + (n.values.get(t) ?? 0), 0));
}
function io(e, t, n, r = 2, i = 4) {
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
var ao = "rate_limit", oo = {
	five_hour: "5-hour limit",
	seven_day: "weekly limit",
	seven_day_opus: "weekly Opus limit"
};
function so(e) {
	return e ? Object.hasOwn(oo, e) ? oo[e] ?? e : e.replaceAll("_", " ") : "–";
}
function co(e) {
	let t = e.status ? ` (${e.status})` : "";
	return e.error === "rate_limit" ? `⚠ Rate limit${t}` : `${e.error.replaceAll("_", " ")}${t}`;
}
function lo(e, t) {
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
function uo(e) {
	return Date.parse(e.first_hit) - Date.parse(e.start);
}
function fo(e, t) {
	let n = new Date(e.start), r = new Date(e.resets_at), i = n.toDateString() === r.toDateString() ? r.toLocaleTimeString(t, {
		hour: "2-digit",
		minute: "2-digit"
	}) : Ra(e.resets_at, t);
	return `${Ra(e.start, t)} – ${i}`;
}
function po(e) {
	let t = e.cost_parts.cache_read;
	return {
		cacheRead: t,
		rest: Math.max(0, (e.cost || 0) - t)
	};
}
function mo(e) {
	return Math.max(0, ...e.map((e) => e.cost || 0)) || 1;
}
function ho(e, t) {
	return 100 * (e || 0) / t;
}
//#endregion
//#region src/lib/bymodel.ts
var go = {
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
		value: Va,
		format: X
	}
}, _o = Object.keys(go);
function vo(e) {
	return _o.find((t) => t === e) ?? "cost";
}
var yo = 248;
function bo(e, t, n = /* @__PURE__ */ new Date()) {
	let r = go[t], i = Qa(e, n), a = to(i.unit === "hour" ? e.hour_model_effort : e.day_model_effort, i.keyOf, r.value);
	return {
		buckets: i,
		series: a,
		totals: ro(a, i.keys),
		metric: r
	};
}
function xo(e, t) {
	let n = e - 8, r = (n - 56) / t;
	return {
		right: n,
		band: r,
		barWidth: Ja(r, 24)
	};
}
function So(e, t) {
	return qa(56, xo(e, t).band);
}
function Co(e, t, n) {
	let { band: r, barWidth: i } = xo(e, t);
	return 56 + r * n + (r - i) / 2;
}
function wo(e, t, n) {
	let r = e.filter((e) => (e.values.get(t) ?? 0) > 0), i = r.map((e) => 220 * (e.values.get(t) ?? 0) / n);
	return io(r.map((e) => e.model), i, 220, 2, 4).map((e) => ({
		entry: r[e.position],
		segment: e
	}));
}
function To(e) {
	let t = e.filter((e) => e.hatch).map((e, t) => ({
		id: `model-hatch-${t}`,
		entry: e
	})), n = new Map(t.map((e) => [e.entry, e.id]));
	return {
		patterns: t,
		fill: (e) => n.has(e) ? `url(#${n.get(e)})` : e.color
	};
}
function Eo(e, t) {
	return `${e.label} per ${t} by model and effort level; table view available`;
}
function Do(e, t) {
	return `${e.label} per ${t}; arrow keys step through them`;
}
function Oo(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${e.metric.format(e.totals[t] ?? 0)}`;
}
function ko(e) {
	return no(e).map((e) => ({
		model: e.model,
		entries: e.entries.map((e) => ({
			entry: e,
			text: ua(e.effort)
		}))
	}));
}
function Ao(e, t) {
	return no(e.filter((e) => e.values.get(t))).map((e) => ({
		model: e.model,
		value: e.entries.reduce((e, n) => e + (n.values.get(t) ?? 0), 0),
		efforts: e.entries.slice().reverse().map((e) => ({
			entry: e,
			text: ua(e.effort),
			value: e.values.get(t) ?? 0
		}))
	}));
}
function jo(e) {
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
var Mo = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ F(0);
	#n = /* @__PURE__ */ F(0);
	#r = dr || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return dr === this.#r ? /* @__PURE__ */ F(e) : qt(e);
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
		if (r === void 0) r = this.#i(0), n.set(e, r), I(this.#n, super.size), $t(o);
		else if (i !== t) {
			$t(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && $t(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), I(n, -1)), r && (I(this.#n, super.size), $t(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			I(this.#n, 0);
			for (var t of e.values()) I(t, -1);
			$t(this.#t), e.clear();
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
}, No = /* @__PURE__ */ s({
	Payload: () => Po,
	payload: () => Fo,
	setPayload: () => Io
}), Po = class {
	#e = /* @__PURE__ */ F(null);
	#t = /* @__PURE__ */ F(!1);
	#n = /* @__PURE__ */ F(null);
	#r = /* @__PURE__ */ F(!1);
	#i = /* @__PURE__ */ F(null);
	#a = /* @__PURE__ */ F(null);
	#o = new Mo();
	get summary() {
		return H(this.#e);
	}
	get summaryFailed() {
		return H(this.#t);
	}
	get live() {
		return H(this.#n);
	}
	get liveFailed() {
		return H(this.#r);
	}
	get liveAt() {
		return H(this.#i);
	}
	get session() {
		return H(this.#a);
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
		e.summary !== void 0 && (I(this.#e, e.summary), I(this.#t, !1)), e.summaryFailed !== void 0 && I(this.#t, e.summaryFailed, !0), e.live !== void 0 && (I(this.#n, e.live), I(this.#r, !1)), e.liveFailed !== void 0 && I(this.#r, e.liveFailed, !0), e.liveAt !== void 0 && I(this.#i, e.liveAt, !0), e.session !== void 0 && I(this.#a, e.session);
	}
	reset() {
		I(this.#e, null), I(this.#t, !1), I(this.#n, null), I(this.#r, !1), I(this.#i, null), I(this.#a, null), this.#o.clear();
	}
}, Fo = new Po();
function Io(e) {
	Fo.set(e), Lt();
}
//#endregion
//#region src/lib/tables.ts
var Lo = /* @__PURE__ */ s({
	DEFAULT_PAGE_SIZE: () => 25,
	PAGE_SIZES: () => Ro,
	SESSION_COLUMNS: () => Go,
	TOOL_KINDS: () => Jo,
	USAGE_COLUMNS: () => ls,
	byCost: () => cs,
	chatRows: () => ss,
	detailNoun: () => es,
	emptyDetail: () => Zo,
	entryKey: () => os,
	kindLabel: () => Xo,
	orderedEntries: () => as,
	pageSizeFrom: () => Ho,
	pageText: () => Vo,
	pageUnits: () => zo,
	pageWindow: () => Bo,
	sessionCells: () => Ko,
	sessionCount: () => qo,
	sessionMatches: () => Uo,
	sessionProjects: () => Wo,
	toolFolds: () => rs,
	toolRowClass: () => ts,
	toolRowName: () => ns,
	toolRowShown: () => is,
	toolTableRows: () => Yo,
	usageCells: () => us
}), Ro = [
	10,
	25,
	50
];
function zo(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function Bo(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function Vo(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function Ho(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function Uo(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function Wo(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
var Go = [
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
function Ko(e) {
	return [
		Ra(e.last_ts),
		Z(e.subagents),
		Z(e.turns),
		X(e.context_avg),
		X(e.context_peak),
		X(e.output),
		Q(e.cost)
	];
}
function qo(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var Jo = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function Yo(e) {
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
function Xo(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function Zo(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var Qo = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, $o = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function es(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn($o, e.tool) && $o[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(Qo, n) && Qo[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function ts(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function ns(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: Xo(e, Jo)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || Zo(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function rs(e) {
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
			label: `${Z(a)} ${es(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function is(e, t) {
	return e.every((e) => t.has(e));
}
function as(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function os(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function ss(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return as(e, t).map((e) => ({
		key: os(e, n.get(e) ?? 0),
		entry: e
	}));
}
function cs(e, t) {
	return (t.cost ?? -1) - (e.cost ?? -1) || t.turns - e.turns;
}
var ls = [
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
function us(e) {
	let t = Va(e);
	return [
		Z(e.turns),
		X(t),
		ka(e.cache_read, t),
		X(e.output),
		Q(e.cost)
	];
}
//#endregion
//#region src/lib/themes.ts
var ds = /* @__PURE__ */ s({
	THEMES: () => fs,
	themeFooter: () => vs,
	themeLabel: () => _s,
	themeName: () => hs
}), fs = [
	"light",
	"dark",
	"hacker",
	"startup",
	"rgb"
], ps = { techbro: "rgb" }, ms = {
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
function hs(e) {
	if (e == null) return null;
	let t = (Object.hasOwn(ps, e) ? ps[e] : e) ?? e;
	return fs.includes(t) ? t : null;
}
function gs(e) {
	return e !== null && Object.hasOwn(ms, e) ? ms[e] ?? {} : {};
}
function _s(e, t) {
	let n = gs(e);
	return Object.hasOwn(n, t) ? n[t] ?? t : t;
}
function vs(e) {
	return gs(e).footer ?? "";
}
//#endregion
//#region src/lib/prefs.svelte.ts
var ys = /* @__PURE__ */ s({
	Preferences: () => Cs,
	footerCopy: () => Es,
	hype: () => Ts,
	preferences: () => ws,
	readPreference: () => bs,
	savePreference: () => xs,
	savedOption: () => Ss
});
function bs(e) {
	try {
		return localStorage.getItem(`claude-usage.${e}`);
	} catch {
		return null;
	}
}
function xs(e, t) {
	try {
		localStorage.setItem(`claude-usage.${e}`, String(t));
	} catch {}
}
function Ss(e, t) {
	let n = bs(e);
	return n !== null && t.includes(n) ? n : null;
}
var Cs = class {
	#e = /* @__PURE__ */ F(tn(hs(bs("theme"))));
	#t = /* @__PURE__ */ F(tn(Ho(bs("page_size"), Ro, 25)));
	#n = /* @__PURE__ */ F(bs("chat-oldest-first") === "true");
	get theme() {
		return H(this.#e);
	}
	set theme(e) {
		let t = hs(e);
		I(this.#e, t, !0), xs("theme", t ?? "auto");
	}
	get pageSize() {
		return H(this.#t);
	}
	set pageSize(e) {
		Ro.includes(e) && (I(this.#t, e, !0), xs("page_size", String(e)));
	}
	get oldestFirst() {
		return H(this.#n);
	}
	set oldestFirst(e) {
		I(this.#n, e, !0), xs("chat-oldest-first", String(e));
	}
}, ws = new Cs();
function Ts(e) {
	return _s(ws.theme, e);
}
function Es() {
	return vs(ws.theme);
}
//#endregion
//#region src/components/ChartTooltip.svelte
var Ds = /* @__PURE__ */ U([[
	"div",
	{ class: "tooltip" },
	,
]]);
function Os(e, t) {
	j(t, !0);
	let n = Ki(t, "top", 3, 8);
	function r(e) {
		let r = e.parentElement?.clientWidth ?? 0;
		e.style.left = `${ea(t.anchor, e.offsetWidth, r)}px`, e.style.top = `${n()}px`;
	}
	var i = Ds();
	Zr(L(i), () => t.children), A(i), li(i, () => r), G(e, i), M();
}
//#endregion
//#region src/components/Chart.svelte
var ks = /* @__PURE__ */ U([["rect", {
	class: "hit",
	tabindex: "0",
	role: "slider",
	"aria-valuemin": "1"
}]], 4), As = /* @__PURE__ */ U([[
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
function js(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => (t.cursor?.count ?? 0) - 1), r = /* @__PURE__ */ F(null), i = /* @__PURE__ */ N(() => H(r) === null ? H(n) : Math.min(H(r), H(n))), a = /* @__PURE__ */ F(null), o = /* @__PURE__ */ N(() => H(a) === null || H(n) < 0 ? null : Math.min(H(a), H(n))), s = /* @__PURE__ */ N(() => t.cursor?.area(t.width));
	function c(e) {
		I(r, Math.min(Math.max(0, e), H(n)), !0), I(a, H(r), !0);
	}
	function l(e) {
		let n = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
		t.cursor && n && c(t.cursor.indexAt(t.width)(Qi(e.clientX, n.left, n.width, t.width)));
	}
	function u(e) {
		if (!t.cursor) return;
		let n = $i(e.key, H(i), t.cursor.count);
		n !== null && (c(n), e.preventDefault());
	}
	var d = As(), f = R(d), p = L(f), m = L(p);
	Zr(m, () => t.plot, () => t.width);
	var h = B(m), g = (e) => {
		var n = W();
		Zr(R(n), () => t.marks ?? w, () => t.width, () => H(o)), G(e, n);
	};
	q(h, (e) => {
		H(o) !== null && e(g);
	}), A(p);
	var _ = B(p), v = (e) => {
		var n = ks();
		V((e, r) => {
			Y(n, "x", H(s).x), Y(n, "y", H(s).y), Y(n, "width", e), Y(n, "height", H(s).height), Y(n, "aria-label", t.cursor.label), Y(n, "aria-valuemax", t.cursor.count), Y(n, "aria-valuenow", H(i) + 1), Y(n, "aria-valuetext", r);
		}, [() => Math.max(1, H(s).width), () => t.cursor.valueText(H(i))]), Ar("pointermove", n, l), kr("focus", n, () => c(H(i))), Ar("keydown", n, u), kr("pointerleave", n, () => I(a, null)), kr("blur", n, () => I(a, null)), G(e, n);
	};
	q(_, (e) => {
		t.cursor && H(s) && H(n) >= 0 && e(v);
	}), A(f);
	var y = B(f), b = (e) => {
		{
			let n = /* @__PURE__ */ N(() => t.cursor.tipX(t.width, H(o)) * Zi(t.containerWidth, t.width));
			Os(e, {
				get anchor() {
					return H(n);
				},
				get top() {
					return t.tipTop;
				},
				children: (e, n) => {
					var r = W();
					Zr(R(r), () => t.tip, () => H(o)), G(e, r);
				},
				$$slots: { default: !0 }
			});
		}
	};
	q(y, (e) => {
		t.cursor && H(o) !== null && t.tip && e(b);
	}), V(() => {
		Y(f, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), Y(f, "height", t.height), Y(p, "aria-label", t.label);
	}), G(e, d), M();
}
jr(["pointermove", "keydown"]);
//#endregion
//#region src/components/ChartCard.svelte
var Ms = /* @__PURE__ */ U([[
	"span",
	{ class: "muted" },
	" "
]]), Ns = /* @__PURE__ */ U([[
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
function Ps(e, t) {
	let n = /* @__PURE__ */ F(!1);
	var r = Ns(), i = L(r), a = L(i), o = z(a, !0), s = B(a, 2), c = (e) => {
		var n = Ms(), r = z(n, !0);
		V(() => K(r, t.note)), G(e, n);
	};
	q(s, (e) => {
		t.note && e(c);
	});
	var l = B(s, 2);
	Zr(l, () => t.controls ?? w);
	var u = B(l, 4);
	A(i);
	var d = B(i, 2);
	Zr(d, () => t.legend ?? w);
	var f = B(d, 2);
	Zr(f, () => t.chart);
	var p = B(f, 2), m = (e) => {
		var n = W();
		Zr(R(n), () => t.table), G(e, n);
	};
	q(p, (e) => {
		H(n) && e(m);
	}), Zr(B(p, 2), () => t.extra ?? w), A(r), V(() => {
		Y(r, "aria-labelledby", `${t.id ?? ""}-title`), Y(a, "id", `${t.id ?? ""}-title`), K(o, t.title), Y(u, "id", `${t.id ?? ""}-table-toggle`), Y(u, "aria-pressed", H(n));
	}), Ar("click", u, () => I(n, !H(n))), G(e, r);
}
jr(["click"]);
//#endregion
//#region src/components/Swatch.svelte
var Fs = /* @__PURE__ */ U([["span", { class: "swatch" }]]);
function Is(e, t) {
	var n = Fs();
	let r;
	V(() => r = bi(n, "", r, { background: t.fill })), G(e, n);
}
//#endregion
//#region src/lib/scroll.ts
var Ls = /* @__PURE__ */ s({
	keepScroll: () => zs,
	scrollAnchor: () => Rs
});
function Rs(e) {
	for (let t of e) {
		let e = t.getBoundingClientRect();
		if (e.bottom > 0) return {
			node: t,
			top: e.top
		};
	}
	return null;
}
function zs(e, t) {
	e && t && t.isConnected && window.scrollBy(0, t.getBoundingClientRect().top - e.top);
}
//#endregion
//#region src/components/Pager.svelte
var Bs = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), Vs = /* @__PURE__ */ U([[
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
function Hs(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => (t.units.at(-1) ?? -1) + 1), r = /* @__PURE__ */ N(() => Ks(t.key, H(n))), i = /* @__PURE__ */ N(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function a() {
		Gs.first(t.key) !== H(r).first && Gs.set(t.key, H(r).first);
	}
	a();
	function o(e, r) {
		let i = e.closest(".pager"), a = Rs(i ? [i] : []);
		Gs.set(t.key, Bo(H(n), ws.pageSize, r).first), Lt(), zs(a, i);
	}
	function s(e, t) {
		let n = e.closest(".pager"), r = Rs(n ? [n] : []);
		ws.pageSize = t, Lt(), zs(r, n);
	}
	function c() {
		let { first: e, last: n } = H(r);
		t.rows?.forEach((r, i) => {
			let a = t.units[i];
			a !== void 0 && r.classList.toggle("off-page", a < e || a >= n);
		});
	}
	var l = Vs(), u = L(l);
	J(u, 20, () => Ro, (e) => e, (e, n) => {
		var r = Bs(), i = z(r), a = {};
		V(() => {
			K(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), G(e, r);
	}), A(u);
	var d;
	wi(u);
	var f = B(u, 2), p = B(f, 2), m = z(p, !0), h = B(p, 2);
	A(l), li(l, () => c), V((e) => {
		Y(u, "id", `pager-${t.key ?? ""}-size`), Y(u, "aria-label", `${H(i) ?? ""} per page`), d !== (d = ws.pageSize) && (u.value = (u.__value = d) ?? "", Ci(u, d)), Y(f, "id", `pager-${t.key ?? ""}-previous`), f.disabled = H(r).page === 0, K(m, e), Y(h, "id", `pager-${t.key ?? ""}-next`), h.disabled = H(r).page === H(r).pages - 1;
	}, [() => Vo(H(r), H(n), t.noun)]), Ar("change", u, (e) => s(e.currentTarget, Number(e.currentTarget.value))), Ar("click", f, (e) => o(e.currentTarget, H(r).page - 1)), Ar("click", h, (e) => o(e.currentTarget, H(r).page + 1)), G(e, l), M();
}
jr(["change", "click"]);
//#endregion
//#region src/lib/paging.svelte.ts
var Us = /* @__PURE__ */ s({
	TablePages: () => Ws,
	mountPager: () => Js,
	releaseDetachedPagers: () => Ys,
	shownWindow: () => Ks,
	tablePages: () => Gs
}), Ws = class {
	#e = new Mo();
	first(e) {
		return this.#e.get(e) ?? 0;
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	forget(e) {
		this.#e.delete(e);
	}
}, Gs = new Ws();
function Ks(e, t) {
	return Bo(t, ws.pageSize, Math.floor(Gs.first(e) / ws.pageSize));
}
var qs = /* @__PURE__ */ new Set();
function Js(e) {
	let t = document.createElement("div"), n = Gr(Hs, {
		target: t,
		props: e
	});
	Lt();
	let r = t.firstElementChild;
	if (!(r instanceof HTMLElement)) throw Error("The pager drew no element");
	return qs.add({
		component: n,
		root: r
	}), r;
}
function Ys() {
	for (let e of [...qs]) e.root.isConnected || (qs.delete(e), Yr(e.component));
}
//#endregion
//#region src/components/TableView.svelte
var Xs = /* @__PURE__ */ U([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), Zs = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), Qs = /* @__PURE__ */ U([[
	"th",
	{ scope: "col" },
	" "
]]), $s = /* @__PURE__ */ U([[
	"tr",
	null,
	,
]]), ec = /* @__PURE__ */ U([[
	"table",
	null,
	[
		"thead",
		null,
		["tr"]
	],
	["tbody"]
]]), tc = /* @__PURE__ */ U([
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
function nc(e, t) {
	j(t, !0);
	let n = (e) => {
		var n = W(), o = R(n), s = (e) => {
			Hs(e, {
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
			H(a) > Ro[0] && e(s);
		}), G(e, n);
	}, r = Ki(t, "noun", 3, "rows"), i = /* @__PURE__ */ N(() => zo(t.rows.map((e) => t.sub?.(e) ?? !1))), a = /* @__PURE__ */ N(() => (H(i).at(-1) ?? -1) + 1), o = /* @__PURE__ */ N(() => Ks(t.key, H(a))), s = /* @__PURE__ */ N(() => t.rows.filter((e, t) => {
		let n = H(i)[t] ?? 0;
		return n >= H(o).first && n < H(o).last;
	}));
	var c = tc(), l = R(c), u = (e) => {
		var r = W(), i = R(r), o = (e) => {
			var r = Xs(), i = L(r);
			Zr(i, () => t.heading);
			var a = B(i, 2);
			n(a), A(r), G(e, r);
		}, s = (e) => {
			var n = W();
			Zr(R(n), () => t.heading), G(e, n);
		};
		q(i, (e) => {
			H(a) > Ro[0] ? e(o) : e(s, -1);
		}), G(e, r);
	};
	q(l, (e) => {
		t.heading && e(u);
	});
	var d = B(l, 2);
	Zr(d, () => t.intro ?? w);
	var f = B(d, 2), p = L(f), m = (e) => {
		n(e);
	};
	q(p, (e) => {
		t.heading || e(m);
	});
	var h = B(p, 2), g = (e) => {
		var n = Zs(), r = z(n, !0);
		V(() => K(r, t.empty)), G(e, n);
	}, _ = (e) => {
		var n = ec(), r = L(n), i = L(r);
		J(i, 21, () => t.columns, (e) => e.label, (e, t) => {
			var n = Qs(), r = z(n, !0);
			V(() => {
				vi(n, 1, fi(H(t).numeric ? "num" : void 0)), Y(n, "title", H(t).title), K(r, H(t).label);
			}), G(e, n);
		}), A(i), A(r);
		var a = B(r);
		J(a, 21, () => H(s), (e) => t.rowKey(e), (e, n) => {
			var r = $s();
			Zr(L(r), () => t.cells, () => H(n)), A(r), V((e) => vi(r, 1, e), [() => fi([t.sub?.(H(n)) ? "sub-row" : t.group?.(H(n)) ? "group-row" : void 0, t.rowClass?.(H(n))])]), G(e, r);
		}), A(a), A(n), V(() => Y(n, "aria-labelledby", t.labelledby)), G(e, n);
	};
	q(h, (e) => {
		t.rows.length === 0 && t.empty !== void 0 ? e(g) : e(_, -1);
	}), A(f), V(() => Y(f, "id", t.id)), G(e, c), M();
}
//#endregion
//#region src/components/XLabels.svelte
var rc = /* @__PURE__ */ U([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4);
function ic(e, t) {
	j(t, !0);
	var n = W();
	J(R(n), 16, () => ta(t.count, t.most), (e) => e, (e, n) => {
		var r = rc(), i = z(r, !0);
		V((e, n) => {
			Y(r, "x", e), Y(r, "y", t.y), K(i, n);
		}, [() => t.xOf(n), () => t.text(n)]), G(e, r);
	}), G(e, n), M();
}
//#endregion
//#region src/components/YAxis.svelte
var ac = /* @__PURE__ */ U([["line", { "stroke-width": "1" }], [
	"text",
	{
		"text-anchor": "end",
		class: "axis-text"
	},
	" "
]], 5);
function oc(e, t) {
	j(t, !0);
	var n = W();
	J(R(n), 18, () => t.values, (e) => e, (e, n, r) => {
		let i = /* @__PURE__ */ N(() => na(t.yOf(n)));
		var a = ac(), o = R(a), s = B(o), c = z(s, !0);
		V((e) => {
			Y(o, "x1", t.left), Y(o, "x2", t.right), Y(o, "y1", H(i)), Y(o, "y2", H(i)), Y(o, "stroke", H(r) === 0 ? "var(--axis)" : "var(--grid)"), Y(s, "x", t.left - 8), Y(s, "y", H(i) + 4), K(c, e);
		}, [() => t.format(n)]), G(e, a);
	}), G(e, n), M();
}
//#endregion
//#region src/components/ByModel.svelte
var sc = /* @__PURE__ */ U([[
	"button",
	{ type: "button" },
	" "
]]), cc = /* @__PURE__ */ U([["div", {
	class: "segmented",
	role: "group",
	"aria-label": "Metric"
}]]), lc = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), uc = /* @__PURE__ */ U([[
	"span",
	{ class: "legend-group" },
	[
		"strong",
		null,
		" "
	],
	" ",
	,
]]), dc = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), fc = /* @__PURE__ */ U([[
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
]], 4), pc = /* @__PURE__ */ U([["defs"]], 4), mc = /* @__PURE__ */ U([["path"]], 4), hc = /* @__PURE__ */ U([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), gc = /* @__PURE__ */ U([
	,
	,
	,
], 5), _c = /* @__PURE__ */ U([
	,
	,
	,
	,
	,
], 5), vc = /* @__PURE__ */ U([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), yc = /* @__PURE__ */ U([[
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
]]), bc = /* @__PURE__ */ U([
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
], 1), xc = /* @__PURE__ */ U([[
	"div",
	{ class: "name" },
	"No usage"
]]), Sc = /* @__PURE__ */ U([[
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
]]), Cc = /* @__PURE__ */ U([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	,
], 1), wc = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), Tc = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), Ec = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function Dc(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = cc();
		J(t, 20, () => _o, (e) => e, (e, t) => {
			var n = sc(), r = z(n, !0);
			V(() => {
				Y(n, "aria-pressed", H(s) === t), K(r, go[t].label);
			}), Ar("click", n, () => _(t)), G(e, n);
		}), A(t), G(e, t);
	}, r = (e) => {
		var t = dc(), n = L(t), r = (e) => {
			var t = W();
			J(R(t), 17, () => ko(H(c).series), (e) => e.model, (e, t) => {
				var n = uc(), r = L(n), i = z(r, !0);
				J(B(r, 2), 17, () => H(t).entries, ({ entry: e, text: t }) => e.key, (e, t) => {
					let n = () => H(t).entry, r = () => H(t).text;
					var i = lc(), a = L(i);
					{
						let e = /* @__PURE__ */ N(() => ba(n().color, n().hatch, n().turn));
						Is(a, { get fill() {
							return H(e);
						} });
					}
					var o = B(a, 1, !0);
					A(i), V(() => K(o, r())), G(e, i);
				}), A(n), V(() => K(i, H(t).model)), G(e, n);
			}), G(e, t);
		};
		q(n, (e) => {
			H(c) && e(r);
		}), A(t), G(e, t);
	}, i = (e) => {
		var t = wc(), n = L(t), r = (e) => {
			let t = (e, t = w) => {
				let n = /* @__PURE__ */ N(() => xo(t(), H(a).length)), r = /* @__PURE__ */ N(() => Xa(H(c).totals));
				var s = _c(), l = R(s), d = (e) => {
					var t = pc();
					J(t, 21, () => H(u).patterns, ({ id: e, entry: t }) => e, (e, t) => {
						let n = () => H(t).id, r = () => H(t).entry;
						var i = fc(), a = L(i), o = B(a);
						A(i), V(() => {
							Y(i, "id", n()), Y(i, "patternTransform", `rotate(${r().turn ?? ""})`), Y(a, "fill", r().color), Y(o, "fill", r().hatch);
						}), G(e, i);
					}), A(t), G(e, t);
				};
				q(l, (e) => {
					H(u).patterns.length && e(d);
				});
				var p = B(l);
				{
					let e = /* @__PURE__ */ N(() => Ua(H(f), 4));
					oc(p, {
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
				var m = B(p);
				{
					let e = /* @__PURE__ */ N(() => 238);
					ic(m, {
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
				J(B(m), 18, () => H(a), (e) => e, (e, i, s) => {
					let l = /* @__PURE__ */ N(() => Co(t(), H(a).length, H(s)));
					var d = gc(), p = R(d);
					J(p, 17, () => wo(H(c).series, i, H(f)), ({ entry: e, segment: t }) => e.key, (e, t) => {
						let r = () => H(t).entry, i = () => H(t).segment;
						var a = mc();
						V((e, t) => {
							Y(a, "d", e), Y(a, "fill", t);
						}, [() => Ya(H(l), i().y, H(n).barWidth, i().height, i().top), () => H(u).fill(r())]), G(e, a);
					});
					var m = B(p), h = (e) => {
						let t = /* @__PURE__ */ N(() => H(c).totals[H(s)] ?? 0);
						var r = hc(), i = z(r, !0);
						V((e) => {
							Y(r, "x", H(l) + H(n).barWidth / 2), Y(r, "y", 220 - 220 * H(t) / H(f) - 6), K(i, e);
						}, [() => H(o)(H(t))]), G(e, r);
					};
					q(m, (e) => {
						H(s) === H(r) && (H(c).totals[H(s)] ?? 0) > 0 && e(h);
					}), G(e, d);
				}), G(e, s);
			}, n = (e, t = w, n = w) => {
				let r = /* @__PURE__ */ N(() => xo(t(), H(a).length).band);
				var i = vc();
				V(() => {
					Y(i, "x", 56 + H(r) * n()), Y(i, "width", H(r)), Y(i, "height", 220);
				}), G(e, i);
			}, r = (e, t = w) => {
				let n = /* @__PURE__ */ N(() => H(a)[t()] ?? ""), r = /* @__PURE__ */ N(() => Ao(H(c).series, H(n)));
				var s = Cc(), l = R(s), u = z(l, !0), d = B(l, 2);
				J(d, 17, () => H(r), (e) => e.model, (e, t) => {
					var n = bc(), r = R(n), i = L(r), a = z(i, !0), s = z(B(i), !0);
					A(r), J(B(r, 2), 17, () => H(t).efforts, ({ entry: e, text: t, value: n }) => e.key, (e, t) => {
						let n = () => H(t).entry, r = () => H(t).text, i = () => H(t).value;
						var a = yc(), s = L(a), c = L(s);
						{
							let e = /* @__PURE__ */ N(() => ba(n().color, n().hatch, n().turn));
							Is(c, { get fill() {
								return H(e);
							} });
						}
						var l = B(c, 1, !0);
						A(s);
						var u = z(B(s, 2), !0);
						A(a), V((e) => {
							K(l, r()), K(u, e);
						}, [() => H(o)(i())]), G(e, a);
					}), V((e) => {
						K(a, H(t).model), K(s, e);
					}, [() => H(o)(H(t).value)]), G(e, n);
				}, (e) => {
					G(e, xc());
				});
				var f = B(d, 2), p = (e) => {
					var n = Sc(), r = z(B(L(n)), !0);
					A(n), V((e) => K(r, e), [() => H(o)(H(c).totals[t()] ?? 0)]), G(e, n);
				};
				q(f, (e) => {
					H(r).length > 1 && e(p);
				}), V((e) => K(u, e), [() => H(i).long(H(n))]), G(e, s);
			}, i = /* @__PURE__ */ N(() => H(c).buckets), a = /* @__PURE__ */ N(() => H(i).keys), o = /* @__PURE__ */ N(() => H(c).metric.format);
			{
				let i = /* @__PURE__ */ N(() => Eo(H(c).metric, H(l)));
				js(e, {
					get height() {
						return yo;
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
		}), A(t), Vi(t, "clientWidth", (e) => I(m, e)), G(e, t);
	}, a = (e) => {
		var t = W(), n = R(t), r = (e) => {
			let t = (e, t = w) => {
				var r = Ec(), i = R(r), a = z(i, !0);
				J(B(i, 2), 18, () => H(n).others, (e) => e, (e, n, r) => {
					var i = Tc(), a = z(i, !0);
					V(() => K(a, t().cells[H(r) + 1])), G(e, i);
				}), V(() => K(a, t().cells[0])), G(e, r);
			}, n = /* @__PURE__ */ N(() => {
				let [e = "", ...t] = H(p).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let r = /* @__PURE__ */ N(() => [{ label: H(n).first }, ...H(n).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				nc(e, {
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
	}, o = /* @__PURE__ */ N(() => Fo.summary), s = /* @__PURE__ */ F(tn(vo(bs("metric")))), c = /* @__PURE__ */ N(() => H(o) ? bo(H(o), H(s)) : null), l = /* @__PURE__ */ N(() => H(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ N(() => H(c) ? To(H(c).series) : null), d = /* @__PURE__ */ N(() => H(o) ? H(l) === "hour" ? Ts("Per hour, by model and effort") : Ts("Per day, by model and effort") : Ts("Per day, by model")), f = /* @__PURE__ */ N(() => Ha(Math.max(...H(c)?.totals ?? [], 0))), p = /* @__PURE__ */ N(() => H(c) ? jo(H(c)) : null), m = /* @__PURE__ */ F(0), h = /* @__PURE__ */ N(() => Xi(H(m))), g = /* @__PURE__ */ N(() => H(c) ? {
		count: H(c).buckets.keys.length,
		label: Do(H(c).metric, H(l)),
		valueText: (e) => Oo(H(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: xo(e, H(c).buckets.keys.length).right - 56,
			height: 220
		}),
		indexAt: (e) => So(e, H(c).buckets.keys.length),
		tipX: (e, t) => 56 + xo(e, H(c).buckets.keys.length).band * (t + .5)
	} : null);
	function _(e) {
		I(s, e, !0), xs("metric", e);
	}
	Ps(e, {
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
	}), M();
}
jr(["click"]);
//#endregion
//#region src/lib/costly.ts
var Oc = [{
	label: "Cache reads",
	color: "var(--split-soft)",
	value: (e) => po(e).cacheRead
}, {
	label: "Everything else",
	color: "var(--split-strong)",
	note: "new input, cache writes, output and web searches",
	value: (e) => po(e).rest
}];
function kc(e) {
	return e.note ? `${e.label} (${e.note})` : e.label;
}
function Ac(e) {
	return e.title || "Untitled session";
}
function jc(e) {
	return `#session/${encodeURIComponent(e.session_id)}`;
}
function Mc(e) {
	let t = mo(e);
	return e.map((e) => {
		let n = Ac(e), r = Oc.map((t) => ({
			part: t,
			amount: t.value(e)
		})), i = r.map(({ part: e, amount: t }) => `${e.label} ${Q(t)}`).join(", ");
		return {
			session: e,
			title: n,
			href: jc(e),
			detail: `${e.project} · ${Z(e.turns)} turns · avg context ${X(e.context_avg)}`,
			share: ho(e.cost, t),
			cost: Q(e.cost),
			parts: r,
			label: `${n}: ${Q(e.cost)}; ${i}`
		};
	});
}
function Nc(e) {
	let { session: t } = e;
	return {
		title: e.title,
		parts: e.parts.map(({ part: e, amount: n }) => ({
			label: e.label,
			color: e.color,
			amount: Q(n),
			share: ka(n, t.cost || 0)
		})),
		total: e.cost,
		context: `${Z(t.turns)} turns · context avg ${X(t.context_avg)}, peak ${X(t.context_peak)}`
	};
}
function Pc(e) {
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
			...Oc.map((e) => ({
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
				...Oc.map((t) => Q(t.value(e))),
				Q(e.cost)
			]
		}))
	};
}
//#endregion
//#region src/components/CostPerSession.svelte
var Fc = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), Ic = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), Lc = /* @__PURE__ */ U([["span"]]), Rc = /* @__PURE__ */ U([[
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
]]), zc = /* @__PURE__ */ U([[
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
]]), Bc = /* @__PURE__ */ U([
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
], 1), Vc = /* @__PURE__ */ U([
	["div", { class: "bars" }],
	" ",
	,
], 1), Hc = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	"No sessions in this range."
]]), Uc = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), Wc = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), Gc = /* @__PURE__ */ U([
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
function Kc(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = Ic(), n = L(t), r = (e) => {
			var t = W();
			J(R(t), 17, () => Oc, (e) => e.label, (e, t) => {
				var n = Fc(), r = L(n);
				Is(r, { get fill() {
					return H(t).color;
				} });
				var i = B(r, 1, !0);
				A(n), V((e) => K(i, e), [() => kc(H(t))]), G(e, n);
			}), G(e, t);
		};
		q(n, (e) => {
			H(a) && e(r);
		}), A(t), G(e, t);
	}, r = (e) => {
		var t = Uc(), n = L(t), r = (e) => {
			var t = W(), n = R(t), r = (e) => {
				var t = Vc(), n = R(t);
				J(n, 21, () => H(s), (e) => e.session.session_id, (e, t) => {
					var n = Rc(), r = L(n), i = L(r), a = z(i, !0), o = z(B(i), !0);
					A(r);
					var s = B(r, 2), c = L(s);
					let l;
					J(c, 21, () => H(t).parts, ({ part: e, amount: t }) => e.label, (e, t) => {
						let n = () => H(t).part, r = () => H(t).amount;
						var i = W(), a = R(i), o = (e) => {
							var t = Lc();
							let i;
							V(() => i = bi(t, "", i, {
								"flex-grow": r(),
								background: n().color
							})), G(e, t);
						};
						q(a, (e) => {
							r() > 0 && e(o);
						}), G(e, i);
					}), A(c), A(s);
					var u = z(B(s, 2), !0);
					A(n), V((e) => {
						Y(n, "href", H(t).href), Y(n, "aria-label", H(t).label), K(a, H(t).title), K(o, H(t).detail), l = bi(c, "", l, { width: e }), K(u, H(t).cost);
					}, [() => `${H(t).share.toFixed(2) ?? ""}%`]), Ar("pointermove", n, (e) => p(e, H(t).session.session_id)), kr("focus", n, (e) => p(e, H(t).session.session_id)), kr("pointerleave", n, m), kr("blur", n, m), G(e, n);
				}), A(n);
				var r = B(n, 2), i = (e) => {
					Os(e, {
						get anchor() {
							return H(u).anchor;
						},
						get top() {
							return H(u).top;
						},
						children: (e, t) => {
							var n = Bc(), r = R(n), i = z(r, !0), a = B(r, 2);
							J(a, 17, () => H(f).parts, (e) => e.label, (e, t) => {
								var n = zc(), r = L(n);
								Is(r, { get fill() {
									return H(t).color;
								} });
								var i = B(r), a = z(i, !0), o = z(B(i));
								A(n), V(() => {
									K(a, H(t).amount), K(o, `${H(t).label ?? ""} · ${H(t).share ?? ""}`);
								}), G(e, n);
							});
							var o = B(a, 2), s = L(o);
							Is(s, { fill: null });
							var c = z(B(s), !0);
							Pe(), A(o);
							var l = z(B(o, 2), !0);
							V(() => {
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
				G(e, Hc());
			};
			q(n, (e) => {
				H(s).length ? e(r) : e(i, -1);
			}), G(e, t);
		};
		q(n, (e) => {
			H(a) && e(r);
		}), A(t), G(e, t);
	}, i = (e) => {
		var t = W(), n = R(t), r = (e) => {
			let t = (e, t = w) => {
				var r = Gc(), i = R(r), a = L(i), o = z(a, !0), s = z(B(a), !0);
				A(i), J(B(i, 2), 19, () => H(n), (e) => e.label, (e, n, r) => {
					var i = Wc(), a = z(i, !0);
					V(() => K(a, t().cells[H(r)])), G(e, i);
				}), V((e, n) => {
					Y(a, "href", e), K(o, n), K(s, t().session.project);
				}, [() => jc(t().session), () => Ac(t().session)]), G(e, r);
			}, n = /* @__PURE__ */ N(() => H(c).head.slice(1));
			nc(e, {
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
	}, a = /* @__PURE__ */ N(() => Fo.summary), o = /* @__PURE__ */ N(() => H(a)?.costly_sessions ?? []), s = /* @__PURE__ */ N(() => Mc(H(o))), c = /* @__PURE__ */ N(() => Pc(H(o))), l = /* @__PURE__ */ N(() => Ts("Cost per session")), u = /* @__PURE__ */ F(null), d = /* @__PURE__ */ N(() => H(u) ? H(s).find((e) => e.session.session_id === H(u)?.id) : void 0), f = /* @__PURE__ */ N(() => H(d) ? Nc(H(d)) : null);
	function p(e, t) {
		let n = e.currentTarget, r = n.closest(".chart")?.getBoundingClientRect();
		if (!r) return;
		let i = n.getBoundingClientRect(), a = "clientX" in e ? e.clientX : 0;
		I(u, {
			id: t,
			anchor: a ? a - r.left : i.left - r.left + i.width / 2,
			top: n.offsetTop + n.offsetHeight + 4
		}, !0);
	}
	function m() {
		I(u, null);
	}
	Ps(e, {
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
	}), M();
}
jr(["pointermove"]);
//#endregion
//#region src/lib/compact.ts
var qc = /* @__PURE__ */ s({
	COMPACTION_VERDICTS: () => il,
	PAYOFF_WORDS: () => Jc,
	REBUILD_CAUSES: () => rl,
	VERSUS_KEEPING_NOTE: () => al,
	breakevenCall: () => cl,
	breakevenText: () => ll,
	compactCallKind: () => $c,
	compactionTotal: () => nl,
	delegateCallShown: () => el,
	oneTimeText: () => ul,
	oneTimeTitle: () => dl,
	payoffAhead: () => Zc,
	payoffText: () => Qc,
	payoffTone: () => Xc,
	spread: () => Yc,
	verdictText: () => ol,
	verdictTitle: () => fl,
	verdictTone: () => tl,
	verdictWords: () => sl
}), Jc = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function Yc(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function Xc(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function Zc(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${Z(t.pays_later_in)} replies`;
		return `${Jc.later}: growing at its recent pace, the context reaches about ${X(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = Z(Math.round(t.calls_ahead));
	return `${Jc[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function Qc(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${Q(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${Z(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : Z(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${Z(e.breakeven_low)} replies)` : `would pay off after about ${Z(e.breakeven_calls)} replies` + Yc(r(e.breakeven_low), r(e.breakeven_high));
}
function $c(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function el(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function tl(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function nl(e) {
	let t = e.map((e) => e.versus_keeping).filter((e) => e !== null && e.verdict !== "forced");
	if (!t.length) return null;
	let n = t.map((e) => e.net).filter((e) => e !== null);
	return {
		net: n.reduce((e, t) => e + t, 0),
		compactions: n.length,
		unknown: t.length - n.length
	};
}
var rl = {
	model: "the model changed",
	idle: "the cache expired while idle",
	prefix: "something early in the context changed"
}, il = {
	saved: "saved",
	cost_more: "cost more",
	even: "about even",
	forced: "forced: keeping would have auto-compacted",
	open: "not paid off by the last call",
	unknown: "unknown without an output speed or duration"
}, al = "Compared with keeping the context: the same later calls, each reading the dropped tokens again from the cache, at API list prices. ~ marks the summary call's output, estimated from its duration at your output speed; ▲ + (saved, green) holds even at your fastest, ▼ − (cost more, red) even without the summary, or so far for the stretch still running. Re-reading files after compacting isn't counted.";
function ol(e) {
	let { verdict: t, net: n, net_high: r } = e;
	return t === "saved" ? `▲ +${Q(n)}` : t === "cost_more" ? n === null ? `▼ −${Q(-r)} or more` : `▼ −${Q(-n)}` : t === "open" && n !== null ? n < 0 ? `▼ −${Q(-n)} so far` : "about even so far" : t === "unknown" && r > 0 ? `saved at most ${Q(r)}, the summary call unknown` : il[t];
}
function sl(e) {
	let t = tl(e);
	return t === "gain" ? "Saved against keeping the context" : e.verdict === "open" ? "Not paid off by the last call: cost more than keeping the context so far" : t === "loss" ? "Cost more than keeping the context" : null;
}
function cl(e) {
	return e.verdict === "forced" ? null : e.breakeven_call === null ? "never" : `${e.breakeven_at_least ? "≥ " : ""}call ${Z(e.breakeven_call)}`;
}
function ll(e) {
	let t = cl(e);
	return t === null ? null : t === "never" ? "never pays off" : e.breakeven_at_least ? `pays off at call ${Z(e.breakeven_call)} or later` : (e.breakeven_call ?? 0) > e.calls_after ? `would pay off at ${t}` : `paid off at ${t}`;
}
function ul(e) {
	return e.one_time === null ? `≥ ${Q(e.call_low + e.rewrite)}` : `~${Q(e.one_time)}`;
}
function dl(e) {
	let t = e.summary_tokens === null ? "its summary unknown" : `a summary of about ${X(e.summary_tokens)} tokens, at most ${X(e.summary_high)}`, n = e.cache_warm ? "warm" : "cold";
	return `The summary call ${e.call_cost === null ? "" : `~${Q(e.call_cost)} `}(${t}; input ${Q(e.call_low)}, cache ${n}) and rewriting the next call's context ` + Q(e.rewrite);
}
function fl(e) {
	let t = [];
	return e.rework_margin !== null && t.push(`Re-reading about ${X(e.rework_margin)} tokens after compacting would cancel the saving`), e.capped_at !== null && t.push(`The kept session would have auto-compacted at call ${Z(e.capped_at)}`), t.join(". ") || null;
}
//#endregion
//#region src/lib/live.ts
var pl = /* @__PURE__ */ s({
	liveCompactBadge: () => yl,
	liveEmpty: () => gl,
	livePastDay: () => ml,
	liveSecretBadge: () => vl,
	liveStateBadges: () => bl,
	liveWaitBadge: () => _l,
	liveWindow: () => hl,
	sessionWaits: () => xl,
	waitChanged: () => Sl
});
function ml(e, t) {
	return e.days === 1 && e.until && e.until !== t ? e.until : null;
}
function hl(e, t) {
	let n = ml(e, t), r = e.agent_minutes > e.minutes ? ` (${e.agent_minutes} min while agents work)` : "", i = e.sessions.some((e) => e.waiting) ? " or waiting for you" : "", a = n ? `, active on ${Pa(n)}` : "";
	return `· changed in the last ${e.minutes} min${r}${i}${a}`;
}
function gl(e, t) {
	let n = ml(e, t);
	return n ? `No live session was active on ${Pa(n)}.` : `No session active in the last ${e.minutes} minutes.`;
}
function _l(e) {
	if (!e) return null;
	let t = ` since ${Ra(e.since)}`;
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
function vl(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${Z(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${Z(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function yl(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${X(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = Xc(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if ($c({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${Q(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${Z(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${Jc[l]}: compacting now ${m}, ~${Z(Math.round(f))} ahead on average.`);
}
function bl(e, t) {
	return [vl(e.secrets), yl(e.current, t)].filter((e) => e !== null);
}
function xl(e, t) {
	let n = _l(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : _l(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function Sl(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/components/LiveIcon.svelte
var Cl = /* @__PURE__ */ U([
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
], 5), wl = /* @__PURE__ */ U([
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
], 5), Tl = /* @__PURE__ */ U([
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
], 5), El = /* @__PURE__ */ U([
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
], 5), Dl = /* @__PURE__ */ U([[
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
function Ol(e, t) {
	j(t, !0);
	var n = Dl(), r = L(n), i = L(r), a = (e) => {
		var t = Cl();
		Pe(3), G(e, t);
	}, o = (e) => {
		var t = wl();
		Pe(2), G(e, t);
	}, s = (e) => {
		var t = Tl();
		Pe(5), G(e, t);
	}, c = (e) => {
		var t = El();
		Pe(3), G(e, t);
	};
	q(i, (e) => {
		t.badge.kind === "permission" ? e(a) : t.badge.kind === "waiting" ? e(o, 1) : t.badge.kind === "secret" ? e(s, 2) : e(c, -1);
	}), A(r), A(n), V(() => {
		vi(n, 1, fi([
			"live-icon",
			`live-icon-${t.badge.kind}`,
			t.badge.tone && `live-icon-${t.badge.tone}`
		])), Y(n, "aria-label", t.badge.text), Y(n, "title", t.badge.text);
	}), G(e, n), M();
}
//#endregion
//#region src/components/LiveCard.svelte
var kl = /* @__PURE__ */ U([[
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
]]), Al = /* @__PURE__ */ U([[
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
]]), jl = /* @__PURE__ */ U([["ul"]]), Ml = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	"No subagent running"
]]), Nl = /* @__PURE__ */ U([[
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
function Pl(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => _l(t.session.waiting)), r = /* @__PURE__ */ N(() => t.sessionState ? bl(t.sessionState, new Date(t.now).toISOString()) : []), i = /* @__PURE__ */ N(() => [
		{
			label: "Turns",
			value: Z(t.session.turns)
		},
		{
			label: "Output",
			value: X(t.session.output)
		},
		{
			label: "Last context",
			value: X(t.session.last_context)
		},
		{
			label: "Cost",
			value: Q(t.session.cost)
		}
	]);
	var a = Nl(), o = L(a), s = L(o), c = B(L(s)), l = z(c, !0);
	A(s);
	var u = B(s, 2), d = (e) => {
		Ol(e, { get badge() {
			return H(n);
		} });
	};
	q(u, (e) => {
		H(n) && e(d);
	});
	var f = B(u, 2);
	J(f, 21, () => H(r), (e) => e.kind, (e, t) => {
		Ol(e, { get badge() {
			return H(t);
		} });
	}), A(f), A(o);
	var p = B(o, 2), m = z(p), h = B(p, 2);
	J(h, 21, () => H(i), (e) => e.label, (e, t) => {
		var n = kl(), r = L(n), i = z(r, !0), a = z(B(r), !0);
		A(n), V(() => {
			K(i, H(t).label), K(a, H(t).value);
		}), G(e, n);
	}), A(h);
	var g = B(h, 2), _ = (e) => {
		var n = jl();
		J(n, 21, () => t.session.subagents, (e) => e.agent_id, (e, n) => {
			var r = Al(), i = L(r), a = z(i, !0), o = B(i, 2), s = z(o, !0), c = z(B(o));
			A(r), V((e, t, r) => {
				K(a, H(n).agent_type), K(s, H(n).description || ""), K(c, `${(H(n).model || "–") ?? ""} · ${e ?? ""} turns · context ${t ?? ""} · ${r ?? ""}`);
			}, [
				() => Z(H(n).turns),
				() => X(H(n).last_context),
				() => za(H(n).last_activity, t.now)
			]), G(e, r);
		}), A(n), G(e, n);
	}, v = (e) => {
		G(e, Ml());
	};
	q(g, (e) => {
		t.session.subagents.length ? e(_) : e(v, -1);
	}), A(a), V((e, n, r) => {
		Y(c, "href", e), K(l, n), K(m, `${t.session.project ?? ""}${t.session.git_branch ? ` · ${t.session.git_branch}` : ""} · ${r ?? ""}`);
	}, [
		() => jc(t.session),
		() => Ac(t.session),
		() => za(t.session.last_activity, t.now)
	]), G(e, a), M();
}
//#endregion
//#region src/components/LiveSessions.svelte
var Fl = /* @__PURE__ */ U([[
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
]]), Il = /* @__PURE__ */ U([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), Ll = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), Rl = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), zl = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Bl = /* @__PURE__ */ U([["div", { class: "live-grid" }]]), Vl = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), Hl = /* @__PURE__ */ U([
	,
	,
	" ",
	,
	" ",
	,
], 1), Ul = /* @__PURE__ */ U([[
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
function Wl(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = Fl(), n = L(t), r = z(n, !0), a = z(B(n, 2), !0);
		A(t), V((e, t) => {
			K(r, e), K(a, t);
		}, [() => Ts("Live sessions"), () => H(i) ? hl(H(i), H(o)) : ""]), G(e, t);
	}, r = "live", i = /* @__PURE__ */ N(() => Fo.live), a = /* @__PURE__ */ N(() => Fo.liveAt ?? Date.now()), o = /* @__PURE__ */ N(() => Ma(new Date(H(a)))), s = /* @__PURE__ */ N(() => H(i)?.sessions ?? []), c = /* @__PURE__ */ N(() => zo(H(s).map(() => !1))), l = /* @__PURE__ */ N(() => H(s).length), u = /* @__PURE__ */ N(() => Ks(r, H(l))), d = /* @__PURE__ */ N(() => H(s).slice(H(u).first, H(u).last)), f = /* @__PURE__ */ N(() => H(l) > Ro[0]);
	var p = Ul(), m = L(p), h = (e) => {
		var t = Il(), i = L(t);
		n(i), Hs(B(i, 2), {
			key: r,
			noun: "sessions",
			get units() {
				return H(c);
			}
		}), A(t), G(e, t);
	}, g = (e) => {
		n(e);
	};
	q(m, (e) => {
		H(f) ? e(h) : e(g, -1);
	});
	var _ = B(m, 2), v = L(_), y = (e) => {
		var t = Ll(), n = z(t, !0);
		V(() => K(n, Fo.liveFailed ? "Could not load the live sessions." : "Loading…")), G(e, t);
	}, b = (e) => {
		var t = Hl(), n = R(t), r = (e) => {
			var t = Rl(), n = z(t);
			V(() => K(n, `Permission prompts can't show here: ${H(i).prompts_unavailable ?? ""}.`)), G(e, t);
		};
		q(n, (e) => {
			H(i).prompts_unavailable && e(r);
		});
		var s = B(n, 2), c = (e) => {
			var t = zl(), n = z(t);
			V(() => K(n, `Desktop notifications can't show: ${H(i).notifications_unavailable ?? ""}.`)), G(e, t);
		};
		q(s, (e) => {
			H(i).notifications_unavailable && e(c);
		});
		var l = B(s, 2), u = (e) => {
			var t = Bl();
			J(t, 21, () => H(d), (e) => e.session_id, (e, t) => {
				{
					let n = /* @__PURE__ */ N(() => Fo.liveState(H(t).session_id));
					Pl(e, {
						get session() {
							return H(t);
						},
						get sessionState() {
							return H(n);
						},
						get now() {
							return H(a);
						}
					});
				}
			}), A(t), G(e, t);
		}, f = (e) => {
			var t = Vl(), n = z(t, !0);
			V((e) => K(n, e), [() => gl(H(i), H(o))]), G(e, t);
		};
		q(l, (e) => {
			H(d).length ? e(u) : e(f, -1);
		}), G(e, t);
	};
	q(v, (e) => {
		H(i) ? e(b, -1) : e(y);
	}), A(_), A(p), G(e, p), M();
}
//#endregion
//#region src/lib/trend.ts
var Gl = [
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
function Kl(e) {
	let t = e * 116 + 22;
	return {
		top: t,
		bottom: t + 76
	};
}
function ql() {
	return Kl(Gl.length - 1).bottom + 28;
}
function Jl(e, t = /* @__PURE__ */ new Date()) {
	let n = Qa(e, t), r = eo(n.unit === "hour" ? e.hour_model : e.day_model, n.keyOf);
	return {
		buckets: n,
		totals: n.keys.map((e) => r.get(e) ?? $a)
	};
}
function Yl(e, t) {
	return e.totals.map((e) => t.value(e));
}
function Xl(e) {
	return `estimated cost, input and output tokens per ${e}`;
}
function Zl(e) {
	return `Estimated cost, input tokens and output tokens per ${e}; table view available`;
}
function Ql(e) {
	return `Estimated cost, input and output tokens per ${e}; arrow keys step through them`;
}
function $l(e, t) {
	let n = e.totals[t] ?? $a, r = Gl.map((e) => `${e.label} ${e.format(e.value(n))}`).join(", ");
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${r}`;
}
function eu(e) {
	let t = e.buckets.keys.map((t, n) => ({
		key: t,
		cells: [e.buckets.short(t), ...Gl.map((t) => t.format(t.value(e.totals[n] ?? $a)))]
	})).reverse();
	return {
		head: [e.buckets.heading, ...Gl.map((e) => e.label)],
		rows: t
	};
}
//#endregion
//#region src/components/AreaLine.svelte
var tu = /* @__PURE__ */ U([["path", { "fill-opacity": "0.1" }], ["path", {
	fill: "none",
	"stroke-width": "2",
	"stroke-linejoin": "round",
	"stroke-linecap": "round"
}]], 5);
function nu(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => t.values.map((e, n) => `${t.xOf(n).toFixed(1)},${t.yOf(e).toFixed(1)}`).join("L")), r = /* @__PURE__ */ N(() => `M${t.xOf(0)},${t.bottom}L${H(n)}L${t.xOf(t.values.length - 1)},${t.bottom}Z`);
	var i = W(), a = R(i), o = (e) => {
		var i = tu(), a = R(i), o = B(a);
		V(() => {
			Y(a, "d", H(r)), Y(a, "fill", t.color), Y(o, "d", `M${H(n) ?? ""}`), Y(o, "stroke", t.color);
		}), G(e, i);
	};
	q(a, (e) => {
		t.values.length && e(o);
	}), G(e, i), M();
}
//#endregion
//#region src/components/PointDot.svelte
var ru = /* @__PURE__ */ U([["circle", {
	r: "4",
	stroke: "var(--surface)",
	"stroke-width": "2"
}]], 4);
function iu(e, t) {
	var n = ru();
	V(() => {
		Y(n, "cx", t.x), Y(n, "cy", t.y), Y(n, "fill", t.color);
	}), G(e, n);
}
//#endregion
//#region src/components/OverTime.svelte
var au = (e, t = w) => {
	var n = mu(), r = R(n), i = z(r, !0);
	J(B(r, 2), 19, () => Gl, (e) => e.label, (e, n, r) => {
		var i = pu(), a = z(i, !0);
		V(() => K(a, t().cells[H(r) + 1])), G(e, i);
	}), V(() => K(i, t().cells[0])), G(e, n);
}, ou = /* @__PURE__ */ U([
	,
	,
	[
		"text",
		{ class: "value-text" },
		" "
	]
], 5), su = /* @__PURE__ */ U([
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
], 5), cu = /* @__PURE__ */ U([
	,
	,
	,
], 5), lu = /* @__PURE__ */ U([["line", { class: "crosshair" }], ,], 5), uu = /* @__PURE__ */ U([[
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
]]), du = /* @__PURE__ */ U([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
], 1), fu = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), pu = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), mu = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function hu(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = fu(), n = L(t), r = (e) => {
			let t = (e, t = w) => {
				let n = /* @__PURE__ */ N(() => t() - 64), r = /* @__PURE__ */ N(() => Ga(H(s).length, 56, H(n)));
				var a = cu(), o = R(a);
				J(o, 17, () => H(d), ({ panel: e, top: t, bottom: n, color: r, values: i, max: a, yOf: o }) => e.label, (e, t) => {
					let i = () => H(t).panel, a = () => H(t).top, o = () => H(t).bottom, s = () => H(t).color, c = () => H(t).values, l = () => H(t).max, u = () => H(t).yOf;
					var d = su(), f = R(d), p = B(f), m = z(p, !0), h = B(p);
					{
						let e = /* @__PURE__ */ N(() => Ua(l(), 2));
						oc(h, {
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
					var g = B(h);
					nu(g, {
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
					var _ = B(g), v = (e) => {
						let t = /* @__PURE__ */ N(() => c().length - 1), n = /* @__PURE__ */ N(() => c()[H(t)] ?? 0);
						var a = ou(), o = R(a);
						{
							let e = /* @__PURE__ */ N(() => H(r)(H(t))), i = /* @__PURE__ */ N(() => u()(H(n)));
							iu(o, {
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
						var l = B(o), d = z(l, !0);
						V((e, t, n) => {
							Y(l, "x", e), Y(l, "y", t), K(d, n);
						}, [
							() => H(r)(H(t)) + 9,
							() => u()(H(n)) + 4,
							() => i().format(H(n))
						]), G(e, a);
					};
					q(_, (e) => {
						c().length && e(v);
					}), V(() => {
						Y(f, "x1", 56), Y(f, "x2", 70), Y(f, "y1", a() - 10), Y(f, "y2", a() - 10), Y(f, "stroke", s()), Y(p, "x", 76), Y(p, "y", a() - 6), K(m, i().label);
					}), G(e, d);
				});
				var c = B(o);
				{
					let e = /* @__PURE__ */ N(() => u + 18);
					ic(c, {
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
			}, n = (e, t = w, n = w) => {
				let r = /* @__PURE__ */ N(() => Ga(H(s).length, 56, t() - 64));
				var i = lu(), a = R(i);
				J(B(a), 17, () => H(d), ({ panel: e, color: t, values: n, yOf: r }) => e.label, (e, t) => {
					let i = () => H(t).color, a = () => H(t).values, o = () => H(t).yOf;
					{
						let t = /* @__PURE__ */ N(() => H(r)(n())), s = /* @__PURE__ */ N(() => o()(a()[n()] ?? 0));
						iu(e, {
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
				}), V((e, t) => {
					Y(a, "x1", e), Y(a, "x2", t), Y(a, "y1", 18), Y(a, "y2", u);
				}, [() => H(r)(n()), () => H(r)(n())]), G(e, i);
			}, r = (e, t = w) => {
				var n = du(), r = R(n), a = z(r, !0);
				J(B(r, 2), 17, () => H(d), ({ panel: e, color: t, values: n }) => e.label, (e, n) => {
					let r = () => H(n).panel, i = () => H(n).color, a = () => H(n).values;
					var o = uu(), s = L(o);
					let c;
					var l = B(s, 2), u = z(l, !0), d = z(B(l, 2), !0);
					A(o), V((e) => {
						c = bi(s, "", c, { background: i() }), K(u, e), K(d, r().label);
					}, [() => r().format(a()[t()] ?? 0)]), G(e, o);
				}), V((e) => K(a, e), [() => H(i).long(H(s)[t()] ?? "")]), G(e, n);
			}, i = /* @__PURE__ */ N(() => H(a).buckets), s = /* @__PURE__ */ N(() => H(i).keys);
			{
				let i = /* @__PURE__ */ N(ql), a = /* @__PURE__ */ N(() => Zl(H(o)));
				js(e, {
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
		}), A(t), Vi(t, "clientWidth", (e) => I(c, e)), G(e, t);
	}, r = (e) => {
		var t = W(), n = R(t), r = (e) => {
			let t = /* @__PURE__ */ N(() => {
				let [e = "", ...t] = H(s).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let n = /* @__PURE__ */ N(() => [{ label: H(t).first }, ...H(t).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				nc(e, {
					key: "trend-table",
					get columns() {
						return H(n);
					},
					get rows() {
						return H(s).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return au;
					}
				});
			}
		};
		q(n, (e) => {
			H(s) && e(r);
		}), G(e, t);
	}, i = /* @__PURE__ */ N(() => Fo.summary), a = /* @__PURE__ */ N(() => H(i) ? Jl(H(i)) : null), o = /* @__PURE__ */ N(() => H(a)?.buckets.unit ?? "day"), s = /* @__PURE__ */ N(() => H(a) ? eu(H(a)) : null), c = /* @__PURE__ */ F(0), l = /* @__PURE__ */ N(() => Xi(H(c))), u = Kl(Gl.length - 1).bottom, d = /* @__PURE__ */ N(() => H(a) ? Gl.map((e, t) => {
		let { top: n, bottom: r } = Kl(t), i = Yl(H(a), e), o = Ha(Math.max(...i, 0));
		return {
			panel: e,
			top: n,
			bottom: r,
			color: ha(e.slot),
			values: i,
			max: o,
			yOf: (e) => r - 76 * e / o
		};
	}) : []), f = /* @__PURE__ */ N(() => H(a) ? {
		count: H(a).buckets.keys.length,
		label: Ql(H(o)),
		valueText: (e) => $l(H(a), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: u
		}),
		indexAt: (e) => Ka(56, e - 64, H(a).buckets.keys.length),
		tipX: (e, t) => Ga(H(a).buckets.keys.length, 56, e - 64)(t)
	} : null);
	{
		let t = /* @__PURE__ */ N(() => Ts("Over time")), i = /* @__PURE__ */ N(() => Xl(H(o)));
		Ps(e, {
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
	M();
}
//#endregion
//#region src/lib/range.ts
var gu = /* @__PURE__ */ s({
	RANGES: () => _u,
	dayLabel: () => Su,
	dayStep: () => Cu,
	rangeDays: () => vu,
	rangeQuery: () => bu,
	shownDay: () => xu,
	visibleRanges: () => yu
}), _u = [
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
function vu(e) {
	return _u.some((t) => t.days === e) ? e : null;
}
function yu(e) {
	return e ? _u.filter((t) => t.days <= e) : _u;
}
function bu(e, t) {
	return `days=${e}` + (e === 1 && t !== null ? `&until=${t}` : "");
}
function xu(e, t, n) {
	let r = t ?? n;
	return e && e.days === 1 && e.until === r ? e : null;
}
function Su(e) {
	return e === null ? "Today" : Pa(e);
}
function Cu(e, t, n) {
	let r = e?.[t];
	if (r) return r === n ? null : r;
}
//#endregion
//#region src/lib/range.svelte.ts
var wu = /* @__PURE__ */ s({
	RangeState: () => Eu,
	range: () => Du
});
function Tu() {
	return vu(Number(bs("days"))) ?? 30;
}
var Eu = class {
	#e = /* @__PURE__ */ F(tn(Tu()));
	#t = /* @__PURE__ */ F(null);
	onchange = null;
	get days() {
		return H(this.#e);
	}
	get day() {
		return H(this.#t);
	}
	select(e) {
		vu(e) !== null && (I(this.#e, e, !0), I(this.#t, null), xs("days", e), this.onchange?.());
	}
	step(e, t) {
		let n = Ma(/* @__PURE__ */ new Date()), r = Cu(xu(t, H(this.#t), n), e, n);
		r !== void 0 && (I(this.#t, r, !0), this.onchange?.());
	}
	fit(e) {
		e.days >= H(this.#e) || (I(this.#e, e.days, !0), xs("days", e.days));
	}
	reset() {
		I(this.#e, Tu(), !0), I(this.#t, null), this.onchange = null;
	}
}, Du = new Eu(), Ou = /* @__PURE__ */ U([[
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
]]), ku = /* @__PURE__ */ U([
	[
		"button",
		{ type: "button" },
		" "
	],
	" ",
	,
], 1), Au = /* @__PURE__ */ U([
	[
		"span",
		{ class: "label" },
		"Range"
	],
	" ",
	["div", { class: "segmented" }]
], 1);
function ju(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => yu(Fo.summary?.retention_days)), r = /* @__PURE__ */ N(() => xu(Fo.summary, Du.day, Ma(/* @__PURE__ */ new Date())));
	var i = Au(), a = B(R(i), 2);
	J(a, 21, () => H(n), (e) => e.days, (e, t) => {
		var n = ku(), i = R(n), a = z(i, !0), o = B(i, 2), s = (e) => {
			var t = Ou(), n = L(t), i = B(n, 2), a = z(i, !0), o = B(i, 2);
			A(t), V((e) => {
				n.disabled = !H(r)?.previous_day, K(a, e), o.disabled = !H(r)?.next_day;
			}, [() => Su(Du.day)]), Ar("click", n, () => Du.step("previous_day", Fo.summary)), Ar("click", o, () => Du.step("next_day", Fo.summary)), G(e, t);
		};
		q(o, (e) => {
			H(t).days === 1 && Du.days === 1 && e(s);
		}), V(() => {
			Y(i, "aria-pressed", Du.days === H(t).days), K(a, H(t).label);
		}), Ar("click", i, () => Du.select(H(t).days)), G(e, n);
	}), A(a), G(e, i), M();
}
jr(["click"]);
var Mu = 148, Nu = "var(--status-critical)";
function Pu(e, t = /* @__PURE__ */ new Date()) {
	let n = Qa(e, t), r = lo(n.unit === "hour" ? e.api_errors.hour : e.api_errors.day, n.keyOf), i = n.keys.map((e) => r(e).limits), a = n.keys.map((e) => r(e).other), o = i.reduce((e, t) => e + t, 0), s = Xa(i);
	return {
		buckets: n,
		limits: i,
		others: a,
		total: o,
		top: Wa(Math.max(...i, 0)),
		peak: i[s] ? s : null,
		empty: !i.some(Boolean) && !a.some(Boolean)
	};
}
function Fu(e, t, n, r, i) {
	let { band: a, barWidth: o } = xo(e, t), s = 120 * r / i;
	return {
		x: 56 + a * n + (a - o) / 2,
		y: 120 - s,
		width: o,
		height: s
	};
}
function Iu(e) {
	return `rate-limit hits per ${e}; other API errors are in the tooltip, the table view and the list`;
}
function Lu(e, t) {
	return `Rate-limit hits per ${e}: ${Z(t)} in the range; table view available`;
}
function Ru(e) {
	return `Rate-limit hits per ${e}; arrow keys step through them`;
}
function zu(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${Z(e.limits[t])} rate-limit hits, ${Z(e.others[t])} other API errors`;
}
function Bu(e, t) {
	return {
		when: e.buckets.long(e.buckets.keys[t] ?? ""),
		limits: Z(e.limits[t]),
		others: Z(e.others[t])
	};
}
function Vu(e) {
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
var Hu = [
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
function Uu(e, t) {
	return e.flatMap((e) => {
		let n = `${e.limit_type} ${e.resets_at}`;
		return [{
			key: n,
			kind: "window",
			name: fo(e, t),
			cells: [
				Aa(uo(e)),
				Z(e.hits),
				...us(e.used)
			],
			sub: !1,
			group: e.models.length > 0
		}, ...e.models.slice().sort(cs).map((e) => ({
			key: `${n} ${e.model}`,
			kind: "model",
			name: e.model,
			cells: [
				"",
				"",
				...us(e)
			],
			sub: !0,
			group: !1
		}))];
	});
}
function Wu(e) {
	return e.map((e) => ({
		key: e.record_id,
		when: Ra(e.ts),
		error: co(e),
		quota: so(e.limit_type),
		resets: Ra(e.resets_at),
		session: {
			href: jc(e),
			name: Ac(e),
			project: e.project
		},
		agent: e.agent_type
	}));
}
function Gu(e) {
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
var Ku = /* @__PURE__ */ U([[
	"h3",
	null,
	" "
]]), qu = /* @__PURE__ */ U([[
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
]]), Ju = /* @__PURE__ */ U([
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
function Yu(e, t) {
	j(t, !0);
	let n = (e) => {
		var n = Ku(), r = z(n, !0);
		V(() => {
			Y(n, "id", `${t.id ?? ""}-title`), K(r, t.title);
		}), G(e, n);
	}, r = (e, t = w) => {
		var n = Ju(), r = R(n), a = z(r, !0), o = B(r, 2), s = z(o, !0), c = B(o, 2), l = z(c, !0), u = B(c, 2), d = z(u, !0), f = B(u, 2), p = (e) => {
			var n = qu(), r = L(n), i = z(r, !0), a = z(B(r), !0);
			A(n), V(() => {
				Y(r, "href", t().session.href), K(i, t().session.name), K(a, t().session.project);
			}), G(e, n);
		};
		q(f, (e) => {
			i() && e(p);
		});
		var m = z(B(f, 2), !0);
		V(() => {
			K(a, t().when), K(s, t().error), K(l, t().quota), K(d, t().resets), K(m, t().agent);
		}), G(e, n);
	}, i = Ki(t, "withSession", 3, !0);
	{
		let a = /* @__PURE__ */ N(() => Gu(i()));
		nc(e, {
			get key() {
				return t.pagerKey;
			},
			get columns() {
				return H(a);
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
	M();
}
//#endregion
//#region src/components/RateLimits.svelte
var Xu = (e) => {
	var t = dd(), n = z(t, !0);
	V((e) => K(n, e), [() => Ts("5-hour windows that hit the limit")]), G(e, t);
}, Zu = (e) => {
	G(e, fd());
}, Qu = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), $u = /* @__PURE__ */ U([[
	"div",
	{ class: "legend" },
	,
]]), ed = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	"No rate limits or API errors in this range."
]]), td = /* @__PURE__ */ U([["path"]], 4), nd = /* @__PURE__ */ U([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), rd = /* @__PURE__ */ U([
	,
	,
	,
], 5), id = /* @__PURE__ */ U([
	,
	,
	,
	,
], 5), ad = /* @__PURE__ */ U([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), od = /* @__PURE__ */ U([
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
], 1), sd = /* @__PURE__ */ U([[
	"div",
	{ class: "chart" },
	,
]]), cd = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), ld = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1), ud = /* @__PURE__ */ U([
	,
	,
	" ",
	,
], 1), dd = /* @__PURE__ */ U([[
	"h3",
	null,
	" "
]]), fd = /* @__PURE__ */ U([[
	"p",
	{ class: "note" },
	"what each window used from its start (its reset less 5 hours) up to its first hit, as the transcripts here show it;\n    the limit also counts what you use elsewhere"
]]), pd = /* @__PURE__ */ U([[
	"span",
	{ class: "window-model" },
	" "
]]), md = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), hd = /* @__PURE__ */ U([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1);
function gd(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = $u(), n = L(t), r = (e) => {
			var t = Qu(), n = L(t);
			Is(n, { get fill() {
				return Nu;
			} });
			var r = B(n);
			A(t), V(() => K(r, "⚠ Rate-limit hit")), G(e, t);
		};
		q(n, (e) => {
			H(c) && e(r);
		}), A(t), G(e, t);
	}, r = (e) => {
		var t = sd(), n = L(t), r = (e) => {
			var t = W(), n = R(t), r = (e) => {
				G(e, ed());
			}, i = (e) => {
				let t = (e, t = w) => {
					let n = /* @__PURE__ */ N(() => xo(t(), H(a).length));
					var r = id(), o = R(r);
					{
						let e = /* @__PURE__ */ N(() => Ua(H(c).top, 2));
						oc(o, {
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
					var s = B(o);
					{
						let e = /* @__PURE__ */ N(() => 138);
						ic(s, {
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
					J(B(s), 18, () => H(a), (e) => e, (e, n, r) => {
						let i = /* @__PURE__ */ N(() => H(c).limits[H(r)] ?? 0), o = /* @__PURE__ */ N(() => Fu(t(), H(a).length, H(r), H(i), H(c).top));
						var s = rd(), l = R(s), u = (e) => {
							var t = td();
							V((e) => {
								Y(t, "d", e), Y(t, "fill", Nu);
							}, [() => Ya(H(o).x, H(o).y, H(o).width, H(o).height, !0)]), G(e, t);
						};
						q(l, (e) => {
							H(o).height > 0 && e(u);
						});
						var d = B(l), f = (e) => {
							var t = nd(), n = z(t, !0);
							V((e) => {
								Y(t, "x", H(o).x + H(o).width / 2), Y(t, "y", H(o).y - 6), K(n, e);
							}, [() => Z(H(i))]), G(e, t);
						};
						q(d, (e) => {
							H(r) === H(c).peak && e(f);
						}), G(e, s);
					}), G(e, r);
				}, n = (e, t = w, n = w) => {
					let r = /* @__PURE__ */ N(() => xo(t(), H(a).length).band);
					var i = ad();
					V(() => {
						Y(i, "x", 56 + H(r) * n()), Y(i, "width", H(r)), Y(i, "height", 120);
					}), G(e, i);
				}, r = (e, t = w) => {
					let n = /* @__PURE__ */ N(() => Bu(H(c), t()));
					var r = od(), i = R(r), a = z(i, !0), o = B(i, 2), s = L(o);
					Is(s, { get fill() {
						return Nu;
					} });
					var l = B(s), u = z(l, !0), d = z(B(l));
					A(o);
					var f = B(o, 2), p = L(f);
					Is(p, { fill: null });
					var m = z(B(p), !0);
					Pe(), A(f), V(() => {
						K(a, H(n).when), K(u, H(n).limits), K(d, "⚠ rate-limit hits"), K(m, H(n).others);
					}), G(e, r);
				}, i = /* @__PURE__ */ N(() => H(c).buckets), a = /* @__PURE__ */ N(() => H(i).keys);
				{
					let i = /* @__PURE__ */ N(() => Lu(H(l), H(c).total));
					js(e, {
						get height() {
							return Mu;
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
		}), A(t), Vi(t, "clientWidth", (e) => I(h, e)), G(e, t);
	}, i = (e) => {
		var t = W(), n = R(t), r = (e) => {
			let t = (e, t = w) => {
				var r = ld(), i = R(r), a = z(i, !0);
				J(B(i, 2), 19, () => H(n), (e) => e.label, (e, n, r) => {
					var i = cd(), a = z(i, !0);
					V(() => K(a, t().cells[H(r) + 1])), G(e, i);
				}), V(() => K(a, t().cells[0])), G(e, r);
			}, n = /* @__PURE__ */ N(() => H(d).head.slice(1));
			nc(e, {
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
		var t = W(), n = R(t), r = (e) => {
			var t = ud(), n = R(t);
			nc(n, {
				key: "limit-windows",
				get columns() {
					return Hu;
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
					return Xu;
				},
				get intro() {
					return Zu;
				},
				empty: "No 5-hour window hit its limit in this range."
			});
			var r = B(n, 2);
			{
				let e = /* @__PURE__ */ N(() => Ts("Latest API errors"));
				Yu(r, {
					id: "limit-events",
					get title() {
						return H(e);
					},
					get rows() {
						return H(p);
					},
					empty: "No API errors in this range.",
					pagerKey: "limit-events"
				});
			}
			G(e, t);
		};
		q(n, (e) => {
			H(s) && e(r);
		}), G(e, t);
	}, o = (e, t = w) => {
		var n = hd(), r = R(n), i = L(r), a = (e) => {
			var n = pd(), r = z(n, !0);
			V(() => K(r, t().name)), G(e, n);
		}, o = (e) => {
			var n = Rr();
			V(() => K(n, t().name)), G(e, n);
		};
		q(i, (e) => {
			t().kind === "model" ? e(a) : e(o, -1);
		}), A(r), J(B(r, 2), 19, () => m, (e) => e.label, (e, n, r) => {
			var i = md(), a = z(i, !0);
			V(() => K(a, t().cells[H(r)])), G(e, i);
		}), G(e, n);
	}, s = /* @__PURE__ */ N(() => Fo.summary), c = /* @__PURE__ */ N(() => H(s) ? Pu(H(s)) : null), l = /* @__PURE__ */ N(() => H(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ N(() => Ts("Rate limits")), d = /* @__PURE__ */ N(() => H(c) ? Vu(H(c)) : null), f = /* @__PURE__ */ N(() => H(s) ? Uu(H(s).api_errors.windows) : []), p = /* @__PURE__ */ N(() => H(s) ? Wu(H(s).api_errors.events) : []), m = Hu.slice(1), h = /* @__PURE__ */ F(0), g = /* @__PURE__ */ N(() => Xi(H(h))), _ = /* @__PURE__ */ N(() => H(c) ? {
		count: H(c).buckets.keys.length,
		label: Ru(H(l)),
		valueText: (e) => zu(H(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: xo(e, H(c).buckets.keys.length).right - 56,
			height: 120
		}),
		indexAt: (e) => So(e, H(c).buckets.keys.length),
		tipX: (e, t) => 56 + xo(e, H(c).buckets.keys.length).band * (t + .5)
	} : null);
	{
		let t = /* @__PURE__ */ N(() => H(c) ? Iu(H(l)) : void 0);
		Ps(e, {
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
	M();
}
//#endregion
//#region src/components/SessionsList.svelte
var _d = (e) => {
	var t = yd(), n = z(L(t), !0);
	Pe(2), A(t), V((e) => K(n, e), [() => Ts("Sessions")]), G(e, t);
}, vd = (e, t = w) => {
	let n = /* @__PURE__ */ N(() => Ko(t()));
	var r = Cd(), i = R(r), a = z(i, !0), o = B(i, 2), s = L(o), c = z(s, !0), l = z(B(s), !0);
	A(o), J(B(o, 2), 17, () => H(n).slice(1), ei, (e, t) => {
		var n = Sd(), r = z(n, !0);
		V(() => K(r, H(t))), G(e, n);
	}), V((e, r) => {
		K(a, H(n)[0]), Y(s, "href", e), K(c, r), K(l, t().project);
	}, [() => jc(t()), () => Ac(t())]), G(e, r);
}, yd = /* @__PURE__ */ U([[
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
]]), bd = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), xd = /* @__PURE__ */ U([[
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
]]), Sd = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), Cd = /* @__PURE__ */ U([
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
], 1), wd = /* @__PURE__ */ U([
	,
	,
	" ",
	,
], 1), Td = /* @__PURE__ */ U([[
	"section",
	{
		class: "card",
		"aria-labelledby": "sessions-title"
	},
	,
]]);
function Ed(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = xd(), n = L(t), o = L(n);
		o.value = o.__value = "", J(B(o), 17, () => H(c), (e) => e.project, (e, t) => {
			var n = bd(), r = z(n), i = {};
			V((e) => {
				K(r, `${H(t).project ?? ""} (${e ?? ""})`), i !== (i = H(t).project) && (n.value = (n.__value = i) ?? "");
			}, [() => Z(H(t).count)]), G(e, n);
		}), A(n), wi(n);
		var s = B(n, 2);
		Mi(s);
		var u = z(B(s, 2), !0);
		A(t), V(() => K(u, H(l))), Ti(n, () => H(i), (e) => {
			I(i, e, !0), Gs.forget(r);
		}), Li(s, () => H(a), (e) => {
			I(a, e, !0), Gs.forget(r);
		}), G(e, t);
	}, r = "sessions", i = /* @__PURE__ */ F(""), a = /* @__PURE__ */ F(""), o = /* @__PURE__ */ N(() => Fo.summary?.sessions ?? null), s = /* @__PURE__ */ N(() => H(o) ? H(o).filter((e) => Uo(e, H(i), H(a))) : []), c = /* @__PURE__ */ N(() => Wo(H(o) ?? [], H(i))), l = /* @__PURE__ */ N(() => H(o) ? qo(H(s).length, H(o).length) : "");
	var u = Td(), d = L(u), f = (e) => {
		{
			let t = /* @__PURE__ */ N(() => H(o).length ? "No sessions match the filter." : "No sessions in this range.");
			nc(e, {
				key: r,
				get columns() {
					return Go;
				},
				get rows() {
					return H(s);
				},
				rowKey: (e) => e.session_id,
				get cells() {
					return vd;
				},
				get heading() {
					return _d;
				},
				get intro() {
					return n;
				},
				get empty() {
					return H(t);
				},
				labelledby: "sessions-title"
			});
		}
	}, p = (e) => {
		var t = wd(), r = R(t);
		_d(r);
		var i = B(r, 2);
		n(i), G(e, t);
	};
	q(d, (e) => {
		H(o) ? e(f) : e(p, -1);
	}), A(u), G(e, u), M();
}
//#endregion
//#region src/lib/opening.ts
function Dd() {
	let e = document.activeElement, t = e && e !== document.body ? e : null;
	return {
		href: t?.getAttribute("href") ?? null,
		element: t,
		scroll: window.scrollY
	};
}
function Od(e) {
	return e.element?.isConnected ? e.element : e.href === null ? null : [...document.querySelectorAll("a[href]")].find((t) => t.getAttribute("href") === e.href) ?? null;
}
function kd(e) {
	return (t) => {
		let n = Dd(), r = [];
		for (let t of e.hide) {
			let e = document.getElementById(t);
			e && (e.hidden = !0, r.push(e));
		}
		return t.scrollIntoView({ block: "start" }), t.querySelector(e.focus)?.focus({ preventScroll: !0 }), () => {
			for (let e of r) e.hidden = !1;
			window.scrollTo(0, n.scroll), Od(n)?.focus({ preventScroll: !0 });
		};
	};
}
//#endregion
//#region src/lib/session.ts
function Ad(e) {
	let t = e.git_branch ? ` · ${e.git_branch}` : "";
	return `${e.project}${t} · ${Ra(e.first_ts)} – ${Ra(e.last_ts)} · ${e.session_id}`;
}
function jd(e) {
	return e.some((e) => e.web_searches);
}
function Md(e) {
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
function Nd(e) {
	return e.models.length ? e.models.map((t) => {
		let n = e.model_efforts.filter((e) => e.model === t).map((e) => e.effort);
		return n.length ? `${t} · ${n.join(", ")}` : t;
	}) : ["–"];
}
function Pd(e, t) {
	return [
		Z(e.turns),
		`${X(e.context_first)} → ${X(e.context_last)}`,
		X(e.input_total),
		ka(e.cache_read, e.input_total),
		X(e.output),
		...t ? [Z(e.web_searches)] : [],
		X(e.returned_chars),
		Q(e.cost)
	];
}
function Fd(e, t, n) {
	let r = e.workflow_phase ? ` · ${e.workflow_phase}` : "";
	return {
		key: e.agent_id ?? "main",
		kind: n,
		name: e.agent_type,
		detail: `${e.description || ""}${r}`,
		models: Nd(e),
		fold: null,
		cells: Pd(e, t)
	};
}
function Id(e, t, n) {
	let r = (e) => t.reduce((t, n) => t + (n[e] || 0), 0), i = t.map((e) => e.cost).filter((e) => e !== null), a = t[0];
	return {
		key: `run:${e}`,
		kind: "run",
		name: `workflow · ${a.workflow_name || e}`,
		detail: "",
		models: [...new Set(t.flatMap((e) => e.models))],
		fold: {
			run: e,
			label: `${Z(t.length)} agents`
		},
		cells: [
			Z(r("turns")),
			"–",
			X(r("input_total")),
			ka(r("cache_read"), r("input_total")),
			X(r("output")),
			...n ? [Z(r("web_searches"))] : [],
			"–",
			i.length ? Q(i.reduce((e, t) => e + t, 0)) : "–"
		]
	};
}
function Ld(e, t) {
	let n = jd(e), r = /* @__PURE__ */ new Map(), i = [];
	for (let t of e) t.workflow_run === null ? i.push(t) : r.has(t.workflow_run) ? r.get(t.workflow_run).push(t) : (r.set(t.workflow_run, [t]), i.push(t.workflow_run));
	return i.flatMap((e) => {
		if (typeof e != "string") return [Fd(e, n, "agent")];
		let i = r.get(e);
		return [Id(e, i, n), ...t.includes(e) ? i.map((e) => Fd(e, n, "member")) : []];
	});
}
function Rd() {
	return [
		{ label: "Agent" },
		{ label: "Tool" },
		{
			label: "Calls",
			numeric: !0
		},
		{
			label: "Errors",
			numeric: !0,
			title: "calls whose result was an error"
		},
		{
			label: "Result characters",
			numeric: !0
		},
		{
			label: "Median",
			numeric: !0,
			title: "a result's characters, the median call"
		},
		{
			label: "p90",
			numeric: !0,
			title: "…and at the 90th percentile"
		},
		{
			label: "Input median",
			numeric: !0,
			title: "the characters of a call's input, which the model wrote"
		},
		{
			label: "Calls after",
			numeric: !0,
			title: "how many later calls carried it in their context, the median call, up to the next compaction"
		},
		{
			label: "~Carried",
			numeric: !0,
			title: "what the later calls paid to have its input and result in their context"
		},
		{
			label: "~Input cost",
			numeric: !0,
			title: "its input at the output price"
		}
	];
}
function zd(e) {
	return e.some((e) => e.tool_kinds?.length) ? "Bash splits by what a command does, MCP by server. A call’s input and result stay in the context, so every later call up to the next compaction reads them again: ~Carried estimates what that cost, taking a token as 2.3 characters (measured on real transcripts, a heuristic)." : null;
}
function Bd(e, t) {
	let n = Yo([...e]), { above: r, folds: i } = rs(n), a = new Set(t), o = new Map(i.map((e) => [e.row, e]));
	return n.flatMap((e, t) => {
		if (!is(r[t] ?? [], a)) return [];
		let i = o.get(t);
		return [{
			key: e.key,
			agent: e.sub ? "" : e.agent,
			name: ns(e),
			fold: i ? {
				fold: i.fold,
				label: i.label,
				open: a.has(i.fold)
			} : null,
			sub: e.sub,
			group: ts(e, n[t + 1]) === "group-row",
			cells: [
				Z(e.calls),
				Z(e.errors),
				X(e.result_chars),
				X(e.result_median),
				X(e.result_p90),
				X(e.input_median),
				Z(e.calls_after_median),
				Q(e.carried),
				Q(e.input_cost)
			]
		}];
	});
}
//#endregion
//#region src/lib/tiles.ts
function Vd(e, t = Ma(/* @__PURE__ */ new Date()), n) {
	let r = e.history_since, i = r && r > e.since ? ` (history since ${Na(r, n)})` : "";
	return e.days === 1 ? e.until === t ? "today" : Pa(e.until, n) : `last ${e.days} days${i}`;
}
function Hd(e) {
	let t = [e.unpriced_turns ? `${Z(e.unpriced_turns)} turns of models without a price are not included` : "at API list prices"];
	return e.web_searches && t.push(`incl. ${Z(e.web_searches)} web searches, ${Q(e.cost_parts.web_search)}`), t.join(" · ");
}
var Ud = "Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.";
function Wd(e) {
	let t = e.compactions === 1 ? "1 compaction" : `${Z(e.compactions)} compactions`, n = e.unknown ? `${Z(e.unknown)} without an estimate` : null;
	if (!e.compactions) return {
		title: Ud,
		verdict: null,
		amount: null,
		count: `Compacting: ${n}`
	};
	let r = e.net >= 0;
	return {
		title: Ud,
		verdict: r ? "gain" : "loss",
		amount: r ? `▲ compacting saved ~${Q(e.net)} so far` : `▼ compacting cost ~${Q(-e.net)} more so far`,
		count: `(${[t, n].filter(Boolean).join(", ")})`
	};
}
function Gd(e) {
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
function Kd(e, t) {
	let n = Va(t);
	return e.map((e) => `${e.label} ${ka(e.tokens, n)}`).join(", ");
}
function qd(e, t) {
	return e?.turns ? `median context ${X(e.median)} per turn (p90 ${X(e.p90)})` + (t ? ` · compact hint at ${X(t)}` : "") : null;
}
function Jd(e, t, n, r) {
	let i = e.api_ms_without_retries === null ? null : e.api_ms - e.api_ms_without_retries, a = "no time lost to retries";
	return i === null ? a = "retries are not in the transcripts" : i > 0 && (a = `${Aa(i)} of it retries`), {
		session: `wall-clock, ${t}`,
		api: a,
		tools: r ? "from each call to its result, incl. waiting for permission" : `${ka(e.tool_ms, e.duration_ms)} of the session time`,
		lines: n === null ? "no lines changed" : `${Q(n)} per 100 lines changed`
	};
}
function Yd(e) {
	return `${Z(e)} ${e === 1 ? "session" : "sessions"} that ended in the range`;
}
function Xd(e) {
	return e === "cost_record" ? "from its cost record" : "estimated from the transcripts";
}
function Zd(e) {
	let t = e.runtime.lines_added + e.runtime.lines_removed;
	return e.cost === null || t === 0 ? null : e.cost / t * 100;
}
//#endregion
//#region src/lib/usage.ts
function Qd(e) {
	return [{ label: e }, ...ls];
}
function $d(e, t) {
	return e.slice().sort(cs).map((e) => ({
		key: t(e),
		name: t(e),
		kind: "plain",
		swatch: null,
		cells: us(e),
		sub: !1,
		group: !1
	}));
}
function ef(e, t, n) {
	return e.slice().sort(cs).flatMap((e) => [{
		key: e.model,
		name: e.model,
		kind: "model",
		swatch: ha(n.get(e.model) ?? null),
		cells: us(e),
		sub: !1,
		group: !0
	}, ...t.filter((t) => t.model === e.model && t.effort !== null).sort((e, t) => sa(e.effort ?? "") - sa(t.effort ?? "") || (e.effort ?? "").localeCompare(t.effort ?? "")).map((t) => ({
		key: `${e.model}\u0000${t.effort}`,
		name: la(t.effort),
		kind: "effort",
		swatch: null,
		cells: us(t),
		sub: !0,
		group: !1
	}))]);
}
//#endregion
//#region src/components/AgentsTable.svelte
var tf = (e) => {
	G(e, nf());
}, nf = /* @__PURE__ */ U([[
	"h3",
	{ id: "session-agents-title" },
	"Main thread and subagents"
]]), rf = /* @__PURE__ */ U([[
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
]]), af = /* @__PURE__ */ U([[
	"span",
	{ class: "sub" },
	" "
]]), of = /* @__PURE__ */ U([[
	"div",
	null,
	" "
]]), sf = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), cf = /* @__PURE__ */ U([
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
function lf(e, t) {
	j(t, !0);
	let n = (e, t = w) => {
		var n = cf(), i = R(n), a = L(i), s = z(a, !0), c = B(a, 2), l = (e) => {
			let n = /* @__PURE__ */ N(() => t().fold), i = /* @__PURE__ */ N(() => H(r).includes(H(n).run));
			var a = rf(), s = L(a), c = z(s, !0);
			A(a), V(() => {
				Y(s, "aria-expanded", H(i)), K(c, H(n).label);
			}), Ar("click", s, () => o(H(n).run)), G(e, a);
		}, u = (e) => {
			var n = af(), r = z(n, !0);
			V(() => K(r, t().detail)), G(e, n);
		};
		q(c, (e) => {
			t().fold ? e(l) : e(u, -1);
		}), A(i);
		var d = B(i, 2);
		J(d, 20, () => t().models, (e) => e, (e, t) => {
			var n = of(), r = z(n, !0);
			V(() => K(r, t)), G(e, n);
		}), A(d), J(B(d, 2), 17, () => t().cells, ei, (e, t) => {
			var n = sf(), r = z(n, !0);
			V(() => K(r, H(t))), G(e, n);
		}), V(() => K(s, t().name)), G(e, n);
	}, r = /* @__PURE__ */ F(tn([])), i = /* @__PURE__ */ N(() => Md(jd(t.agents))), a = /* @__PURE__ */ N(() => Ld(t.agents, H(r)));
	function o(e) {
		I(r, H(r).includes(e) ? H(r).filter((t) => t !== e) : [...H(r), e], !0);
	}
	nc(e, {
		get key() {
			return t.pagerKey;
		},
		get columns() {
			return H(i);
		},
		get rows() {
			return H(a);
		},
		rowKey: (e) => e.key,
		get cells() {
			return n;
		},
		sub: (e) => e.kind === "member",
		group: (e) => e.kind === "run",
		rowClass: (e) => e.kind === "member" ? "workflow-member" : void 0,
		get heading() {
			return tf;
		},
		labelledby: "session-agents-title"
	}), M();
}
jr(["click"]);
//#endregion
//#region src/lib/clock.svelte.ts
var uf = 2 ** 31 - 1, df = 1e3;
function ff(e) {
	let t = (/* @__PURE__ */ new Date()).toISOString(), n = Vr((n) => {
		t = (/* @__PURE__ */ new Date()).toISOString();
		let r = e === null ? NaN : Date.parse(e) - Date.now();
		if (!(r > 0 && r <= uf)) return;
		let i = setTimeout(() => {
			t = (/* @__PURE__ */ new Date()).toISOString(), n();
		}, r + df);
		return () => clearTimeout(i);
	});
	return {
		get expired() {
			return n(), e !== null && Date.parse(e) < Date.now();
		},
		get now() {
			return n(), t;
		}
	};
}
//#endregion
//#region src/lib/gauge.ts
function pf(e) {
	return `Before it, the context was ${X(e.context)} of ${X(e.auto_compact)}. The next reply shows the new one: the summary, with the system prompt, tools and CLAUDE.md sent again.`;
}
function mf(e) {
	return `${(e * 100).toFixed(1)}%`;
}
function hf(e) {
	let t = `Latest context, main thread · ${e.model}`;
	if (e.compacted) return {
		kind: "compacted",
		label: t,
		value: "Compacted",
		secondary: `at ${Ra(e.compacted)}, no reply since`,
		note: pf(e)
	};
	let n = e.hint_tokens < e.auto_compact ? e.hint_tokens / e.auto_compact : null, r = e.last_compaction ? `since the last compaction (${Ra(e.last_compaction)})` : "since the session started", i = e.mean_step === null ? "too few turns for an estimate" : e.turns_left === null ? `${Oa(e.mean_step)} per turn, not growing` : `about ${Z(e.turns_left)} turns left at ${Oa(e.mean_step)} per turn (mean of the last 10)`;
	return {
		kind: "meter",
		label: t,
		value: X(e.context),
		secondary: `of ${X(e.auto_compact)} · ${ka(e.context, e.auto_compact)}`,
		meterLabel: `Latest context ${X(e.context)} of the auto-compact point ${X(e.auto_compact)}`,
		max: e.auto_compact,
		now: e.context,
		fill: mf(Math.min(1, e.context / e.auto_compact)),
		hintAt: n === null ? null : mf(n),
		note: [
			`${X(e.headroom)} until auto-compact`,
			n === null ? null : `the mark is the compact hint at ${X(e.hint_tokens)}, a heuristic`,
			`${Z(e.turns_since_compaction)} turns ${r}`,
			i
		].filter(Boolean).join(" · ")
	};
}
function gf(e, t) {
	let n = e.cache_warm_until, r = n === null ? null : t ? `The cache has likely expired (${Ra(n)}): the next reply sends it all at the full price, ${Q(e.keep_across_break)} more.` : `The cache stays warm until ${Ra(n)} (${e.cache_ttl_minutes} min after the last request); after that, the next reply costs ${Q(e.keep_across_break)} more.`, i = [`Every reply sends the whole conversation again: ${X(e.before)}, ${Q(e.reread_cost)} each time from the cache.`, r].filter(Boolean).join(" "), a = e.estimate;
	if (!a) {
		let t = e.stored_compactions;
		return {
			exact: i,
			missing: `No estimate of compacting now: ${t ? `your ${Z(t)} stored ${t === 1 ? "compaction carries" : "compactions carry"} no duration or output speed to estimate the summary from` : "no stored compaction to learn from yet"}.`,
			estimate: null
		};
	}
	return {
		exact: i,
		missing: null,
		estimate: _f(e, a, t)
	};
}
function _f(e, t, n) {
	let r = e.cache_warm_until, i = `${Z(t.compactions)} stored ${t.compactions === 1 ? "compaction" : "compactions"}`, a = Z(t.calls_after_low), o = Z(t.calls_after_high), s = t.calls_after_low === null ? "" : `, which were followed by ${a === o ? a : `${a}–${o}`} replies until the next one`, c = Xc(t, n), l = [Zc(c, t, n), `Learnt from your ${i}${s}.`];
	return t.before_break !== null && !n && r !== null && l.push(`Compacting before a break past ${Ra(r)} saves about ${Q(t.before_break)} at once.`), {
		lead: `If you compacted now, it would shrink to about ${X(t.after)}${Yc(X(t.after_low), X(t.after_high))}. ` + (n ? "Compacting " : `That costs ~${Q(t.one_time)} once and `),
		tone: c,
		phrase: Qc(t, n),
		rest: `. ${l.filter(Boolean).join(" ")}`
	};
}
function vf(e, t) {
	let n = e.estimate, r = [t ? `The cache has expired, so the next reply sends your whole conversation (${X(e.before)}) again at the full price.` : `Every reply sends your whole conversation again: ${X(e.before)}, ~${Q(e.reread_cost)} each time from the cache.`];
	return n && r.push(`Compacting would shrink it to about ${X(n.after)}` + (t ? ` and ${Qc(n, !0)}.` : `. That costs ~${Q(n.one_time)} once and ${Qc(n, !1)}.`)), r;
}
function yf(e, t, n) {
	let r = e.compact_now;
	if (!r) return null;
	let i = r.estimate, a = r.cache_warm_until;
	if (t === "cold") return i ? {
		title: "⚠ The cache has expired: compacting now saves money",
		lines: [`The cache has expired, so the next reply sends your whole conversation (${X(r.before)}) again at the full price. Compacting would shrink it to about ${X(i.after)}. Doing it now saves about ${Q(i.cold_saving)} at once.`]
	} : null;
	let o = vf(r, n);
	return !n && i && i.before_break !== null && i.before_break > 0 && a !== null && o.push(`Taking a break past ${Ra(a)}? Compact before it: the cache expires then, and compacting first saves about ${Q(i.before_break)} at the next reply.`), o.push("How many replies still follow can't be predicted, so past your own threshold ([chat] compact_hint_tokens) this shows whatever the estimate says."), {
		title: `⚠ Your context is past your ${X(e.hint_tokens)} compact hint`,
		lines: o
	};
}
function bf(e) {
	let t = e.exploration, n = e.compact_now?.estimate;
	if (!t || !n || n.calls_ahead === null) return null;
	let r = Z(Math.round(n.calls_ahead));
	return {
		title: "Explore in a subagent",
		lines: [`Since the last compaction the main thread has read, searched and listed ${X(t.tokens)} tokens in ${Z(t.calls)} calls. They stay in the context: every reply reads them again, ~${Q(t.reread)} each and ~${Q(t.carried)} so far.`, (n.ahead_from === "longer" ? `After your past compactions, a stretch this long went on for about ${r} more replies on average. ` : `After your past compactions you went on for about ${r} replies on average. `) + "A subagent (such as Explore) reads in its own context and hands back only its summary, so the next search costs less delegated."],
		note: "A heuristic ([chat] delegate_hint_tokens and delegate_calls_ahead): replayed on real sessions, delegating was cheaper in 52 of 53 cases with 60 to 150 calls ahead, and about even with 20 to 60."
	};
}
//#endregion
//#region src/components/CompactCall.svelte
var xf = /* @__PURE__ */ U([[
	"p",
	null,
	" "
]]), Sf = /* @__PURE__ */ U(["Copy it from here: ", ["input", {
	type: "text",
	readonly: "",
	"aria-label": "The command to copy",
	class: "compact-call-field"
}]], 1), Cf = /* @__PURE__ */ U([[
	"div",
	{
		class: "card compact-call",
		id: "compact-call",
		role: "region",
		"aria-labelledby": "compact-call-title"
	},
	[
		"strong",
		{ id: "compact-call-title" },
		" "
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "compact-call-actions" },
		[
			"button",
			{
				type: "button",
				id: "compact-copy"
			},
			"Copy /compact"
		],
		" ",
		[
			"span",
			{
				class: "compact-call-status",
				role: "status"
			},
			,
		]
	]
]]);
function wf(e, t) {
	j(t, !0);
	let n = "/compact", r = /* @__PURE__ */ F("no");
	async function i() {
		try {
			await navigator.clipboard.writeText(n), I(r, "yes");
		} catch {
			I(r, "by hand");
		}
	}
	function a(e) {
		e.select();
	}
	var o = Cf(), s = L(o), c = z(s, !0), l = B(s, 2);
	J(l, 16, () => t.call.lines, (e) => e, (e, t) => {
		var n = xf(), r = z(n, !0);
		V(() => K(r, t)), G(e, n);
	});
	var u = B(l, 2), d = L(u), f = B(d, 2), p = L(f), m = (e) => {
		G(e, Rr("Copied: paste it into Claude Code."));
	}, h = (e) => {
		var t = Sf(), r = B(R(t));
		Mi(r), Ni(r, n), li(r, () => a), G(e, t);
	};
	q(p, (e) => {
		H(r) === "yes" ? e(m) : H(r) === "by hand" && e(h, 1);
	}), A(f), A(u), A(o), V(() => K(c, t.call.title)), Ar("click", d, i), G(e, o), M();
}
jr(["click"]);
//#endregion
//#region src/components/DelegateCall.svelte
var Tf = /* @__PURE__ */ U([[
	"p",
	null,
	" "
]]), Ef = /* @__PURE__ */ U([[
	"div",
	{
		class: "card delegate-call",
		id: "delegate-call",
		role: "region",
		"aria-labelledby": "delegate-call-title"
	},
	[
		"strong",
		{ id: "delegate-call-title" },
		" "
	],
	" ",
	,
	" ",
	[
		"p",
		{ class: "muted" },
		" "
	]
]]);
function Df(e, t) {
	j(t, !0);
	var n = Ef(), r = L(n), i = z(r, !0), a = B(r, 2);
	J(a, 16, () => t.call.lines, (e) => e, (e, t) => {
		var n = Tf(), r = z(n, !0);
		V(() => K(r, t)), G(e, n);
	});
	var o = z(B(a, 2), !0);
	A(n), V(() => {
		K(i, t.call.title), K(o, t.call.note);
	}), G(e, n), M();
}
//#endregion
//#region src/components/ContextGauge.svelte
var Of = /* @__PURE__ */ U([["span", { class: "gauge-hint" }]]), kf = /* @__PURE__ */ U([[
	"div",
	{
		class: "gauge",
		role: "meter",
		"aria-valuemin": "0"
	},
	["span", { class: "gauge-fill" }],
	" ",
	,
]]), Af = /* @__PURE__ */ U([["span", { "aria-hidden": "true" }]]), jf = /* @__PURE__ */ U([[
	"p",
	{ class: "compact-estimate" },
	" ",
	,
	[
		"strong",
		null,
		" "
	],
	" "
]]), Mf = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Nf = /* @__PURE__ */ U([
	[
		"div",
		{ class: "note" },
		" "
	],
	" ",
	,
], 1), Pf = /* @__PURE__ */ U([
	,
	,
	" ",
	,
	" ",
	[
		"div",
		{
			class: "card gauge-card",
			id: "current-gauge"
		},
		[
			"div",
			{ class: "label" },
			" "
		],
		" ",
		[
			"div",
			{ class: "tile-value" },
			" ",
			[
				"span",
				{ class: "secondary" },
				" "
			]
		],
		" ",
		,
		" ",
		[
			"div",
			{ class: "note" },
			" "
		],
		" ",
		,
	]
], 1);
function Ff(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => Fo.session), r = /* @__PURE__ */ N(() => H(n)?.current ?? null), i = /* @__PURE__ */ N(() => H(r)?.compact_now?.cache_warm_until ?? null), a = /* @__PURE__ */ N(() => ff(H(i))), o = /* @__PURE__ */ N(() => H(n) ? $c(H(n), H(a).now) : null), s = /* @__PURE__ */ N(() => H(r) && H(o) ? yf(H(r), H(o), H(a).expired) : null), c = /* @__PURE__ */ N(() => H(n) && H(r) && el(H(n)) ? bf(H(r)) : null), l = /* @__PURE__ */ N(() => H(r) ? hf(H(r)) : null), u = /* @__PURE__ */ N(() => H(l)?.kind === "meter" && H(r)?.compact_now ? gf(H(r).compact_now, H(a).expired) : null);
	var d = W(), f = R(d), p = (e) => {
		var t = Pf(), n = R(t), r = (e) => {
			wf(e, { get call() {
				return H(s);
			} });
		};
		q(n, (e) => {
			H(s) && e(r);
		});
		var i = B(n, 2), a = (e) => {
			Df(e, { get call() {
				return H(c);
			} });
		};
		q(i, (e) => {
			H(c) && e(a);
		});
		var o = B(i, 2), d = L(o), f = z(d, !0), p = B(d, 2), m = L(p), h = z(B(m), !0);
		A(p);
		var g = B(p, 2), _ = (e) => {
			var t = kf(), n = L(t);
			let r;
			var i = B(n, 2), a = (e) => {
				var t = Of();
				let n;
				V(() => n = bi(t, "", n, { left: H(l).hintAt })), G(e, t);
			};
			q(i, (e) => {
				H(l).hintAt !== null && e(a);
			}), A(t), V(() => {
				Y(t, "aria-valuemax", H(l).max), Y(t, "aria-valuenow", H(l).now), Y(t, "aria-label", H(l).meterLabel), r = bi(n, "", r, { width: H(l).fill });
			}), G(e, t);
		};
		q(g, (e) => {
			H(l).kind === "meter" && e(_);
		});
		var v = B(g, 2), y = z(v, !0), b = B(v, 2), x = (e) => {
			var t = Nf(), n = R(t), r = z(n, !0), i = B(n, 2), a = (e) => {
				let t = /* @__PURE__ */ N(() => H(u).estimate);
				var n = jf(), r = L(n, !0), i = B(r), a = (e) => {
					var n = Af();
					V(() => vi(n, 1, `payoff-mark payoff-${H(t).tone ?? ""}`)), G(e, n);
				};
				q(i, (e) => {
					H(t).tone && e(a);
				});
				var o = B(i), s = z(o, !0), c = B(o, 1, !0);
				A(n), V(() => {
					K(r, H(t).lead), K(s, H(t).phrase), K(c, H(t).rest);
				}), G(e, n);
			}, o = (e) => {
				var t = Mf(), n = z(t, !0);
				V(() => K(n, H(u).missing)), G(e, t);
			};
			q(i, (e) => {
				H(u).estimate ? e(a) : H(u).missing && e(o, 1);
			}), V(() => K(r, H(u).exact)), G(e, t);
		};
		q(b, (e) => {
			H(u) && e(x);
		}), A(o), V(() => {
			K(f, H(l).label), K(m, `${H(l).value ?? ""} `), K(h, H(l).secondary), K(y, H(l).note);
		}), G(e, t);
	};
	q(f, (e) => {
		H(l) && e(p);
	}), G(e, d), M();
}
var If = [
	{
		field: "cache_read",
		label: "Cache read",
		color: "var(--context-read)"
	},
	{
		field: "cache_write",
		label: "Cache write",
		color: "var(--context-write)"
	},
	{
		field: "new_input",
		label: "New input",
		color: "var(--context-new)"
	}
], Lf = {
	manual: "/compact",
	auto: "auto-compact"
}, Rf = "No turns with usage.", zf = "No turn grew the context.", Bf = "No compactions.", Vf = `${al} Each compaction is compared over its own stretch, up to the next one; the Estimated cost tile adds up the main thread's.`;
function Hf(e) {
	return e.agent_id ?? "main";
}
function Uf(e) {
	return e.agent_id === null ? "main thread" : e.description ? `${e.agent_type} · ${e.description}` : e.agent_type;
}
function Wf(e) {
	return e.filter((e) => e.context_per_turn.length);
}
function Gf(e, t) {
	let n = Wf(e);
	return n.find((e) => Hf(e) === t) ?? n[0] ?? null;
}
function Kf(e) {
	let t = Wf(e);
	if (t.length < 2) return [];
	let n = [], r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = {
			value: Hf(e),
			label: Uf(e)
		};
		if (e.workflow_run === null) {
			n.push({
				kind: "option",
				...t
			});
			continue;
		}
		let i = r.get(e.workflow_run);
		i || (i = {
			kind: "group",
			key: e.workflow_run,
			label: `workflow · ${e.workflow_name || e.workflow_run}`,
			options: []
		}, r.set(e.workflow_run, i), n.push(i)), i.options.push(t);
	}
	return n;
}
function qf(e, t) {
	return `${e}-${t ? Hf(t) : "none"}`;
}
function Jf(e) {
	return e ? `${Uf(e)}: every turn sends its whole context again` : "";
}
function Yf(e, t) {
	let n = t.map((e) => e.context), r = n[n.length - 1] ?? 0;
	return `Context per turn of the ${Uf(e)}, by cache read, cache write and new input: ${t.length} turns, peak ${X(Math.max(...n))}, last ${X(r)}; table view available`;
}
var Xf = 206;
function Zf(e) {
	return Ha(Math.max(0, ...e.map((e) => e.context)));
}
function Qf(e) {
	return (t) => 178 - 160 * t / e;
}
function $f(e, t, n) {
	let r = e.map(() => 0);
	return If.map((i) => {
		let a = r.map((t, n) => t + (e[n]?.[i.field] ?? 0)), o = (e, r) => `${t(r).toFixed(1)},${n(e).toFixed(1)}`, s = a.map(o), c = r.map(o).reverse(), l = r;
		if (r = a, e.length === 1) {
			let e = n(a[0] ?? 0);
			return {
				part: i,
				kind: "column",
				x: t(0) - 6,
				y: e,
				width: 12,
				height: Math.max(0, n(l[0] ?? 0) - e)
			};
		}
		return {
			part: i,
			kind: "area",
			area: `M${s.join("L")}L${c.join("L")}Z`,
			edge: `M${s.join("L")}`
		};
	});
}
function ep(e, t, n) {
	return !e || e > t ? null : {
		y: Math.round(n(e)) + .5,
		text: `hint ${X(e)}`
	};
}
function tp(e, t) {
	if (!t.ts) return -1;
	let n = Date.parse(t.ts);
	return e.findIndex((e) => e.ts && Date.parse(e.ts) > n);
}
function np(e, t, n) {
	let r = [], i = -Infinity;
	return e.forEach((e, a) => {
		let o = tp(t, e);
		if (o < 0) return;
		let s = o > 0 ? (n(o - 1) + n(o)) / 2 : n(0), c = s - i >= 44;
		c && (i = s), r.push({
			key: String(a),
			x: s,
			label: c ? Lf[e.trigger ?? ""] ?? "compaction" : null
		});
	}), r;
}
function rp(e, t, n, r) {
	let i = e.length - 1, a = Xa(e);
	return (a === i ? [i] : [a, i]).map((a) => {
		let o = a === i, s = e[a] ?? 0, c = r.some((e) => e >= t(a) && e - t(a) < 44);
		return {
			key: o ? "last" : "peak",
			x: o ? t(a) + 9 : c ? t(a) - 6 : t(a),
			y: o ? n(s) + 4 : n(s) - 8,
			anchor: o ? "start" : c ? "end" : "middle",
			text: o ? X(s) : `peak ${X(s)}`
		};
	});
}
function ip(e, t) {
	let n = e[t], r = n?.effort ? ` · effort ${n.effort}` : "";
	return `Turn ${Z(t + 1)} of ${Z(e.length)} · ${Ra(n?.ts ?? null)}${r}`;
}
function ap(e) {
	let t = [];
	if (e.growth !== null && t.push(`grew ${Oa(e.growth)} beyond the last reply`), e.rebuild) {
		let n = e.rebuild.extra_cost === null ? "" : `, +${Q(e.rebuild.extra_cost)}`;
		t.push(`cache rebuilt: ${rl[e.rebuild.cause]} (${X(e.rebuild.lost)}${n})`);
	}
	return t;
}
function op(e) {
	return [
		`context ${X(e.context)}`,
		...If.map((t) => `${t.label.toLowerCase()} ${X(e[t.field])}`),
		...ap(e)
	];
}
function sp(e, t) {
	let n = e[t];
	return n ? `${ip(e, t)}: ${op(n).join(", ")}` : "";
}
var cp = [
	{
		label: "Turn",
		numeric: !0
	},
	{ label: "Time" },
	{ label: "Effort" },
	...If.map((e) => ({
		label: e.label,
		numeric: !0
	})),
	{
		label: "Context",
		numeric: !0
	},
	{
		label: "Growth",
		numeric: !0
	},
	{ label: "Cache rebuild" }
];
function lp(e) {
	let t = /* @__PURE__ */ new Map();
	return e.map((e, n) => {
		let r = t.get(e.message_id) ?? 0;
		return t.set(e.message_id, r + 1), {
			key: r ? `${e.message_id}#${r}` : e.message_id,
			cells: [
				Z(n + 1),
				Ra(e.ts),
				e.effort || "–",
				...If.map((t) => Z(e[t.field])),
				Z(e.context),
				e.growth === null ? "–" : Oa(e.growth),
				e.rebuild ? `${e.rebuild.cause} · ${X(e.rebuild.lost)}` : "–"
			]
		};
	});
}
function up(e) {
	let { overhead: t, rebuilds: n } = e, r = Object.entries(Lf).map(([t, n]) => [n, e.compactions.filter((e) => e.trigger === t).length]).filter(([, e]) => e).map(([e, t]) => `${Z(t)} ${e}`), i = e.context_per_turn.map((e) => e.growth).filter((e) => e !== null), a = i.length ? i.reduce((e, t) => e + t, 0) / i.length : null;
	return [
		{
			label: "Fixed overhead",
			value: t ? X(t.tokens) : "–",
			note: t ? `the first call's context (system prompt, tools, CLAUDE.md); reading it again cost ${Q(t.cost)}` : "no turns"
		},
		{
			label: "Cache rebuilds",
			value: Z(n.count),
			note: n.count ? `${X(n.lost)} tokens written again, ${Q(n.cost)} extra` : "every turn read the previous context from the cache"
		},
		{
			label: "Compactions",
			value: Z(e.compactions.length),
			note: r.length ? r.join(", ") : "none"
		},
		{
			label: "Growth per turn",
			value: a === null ? "–" : Oa(Math.round(a)),
			note: "mean of what each turn added beyond the last reply: tool results, prompts, attachments"
		}
	];
}
function dp(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.tool) ?? {
			calls: 0,
			chars: 0
		};
		e.calls += 1, e.chars += n.result_chars, t.set(n.tool, e);
	}
	return [...t].map(([e, t]) => `${e}${t.calls > 1 ? ` ×${t.calls}` : ""} ${X(t.chars)}`).join(", ");
}
var fp = [
	{
		label: "Turn",
		numeric: !0
	},
	{ label: "Time" },
	{
		label: "Growth",
		numeric: !0
	},
	{ label: "Tools the call before ran (result characters)" }
];
function pp(e) {
	let t = new Map(e.context_per_turn.map((e, t) => [e.message_id, t + 1]));
	return e.top_growth.map((e) => ({
		key: e.message_id,
		cells: [
			Z(t.get(e.message_id) ?? null),
			Ra(e.ts),
			X(e.growth),
			e.tools.length ? dp(e.tools) : "none: a prompt or attachments"
		]
	}));
}
function mp(e) {
	if (!e || !e.compactions) return null;
	let t = e.net >= 0;
	return {
		tone: t ? "gain" : "loss",
		title: "Each compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out" + (e.unknown ? `, ${Z(e.unknown)} without an estimate not summed` : "") + ".",
		text: t ? `▲ saved ~${Q(e.net)} so far` : `▼ cost ~${Q(-e.net)} more so far`
	};
}
function hp(e) {
	return mp(nl(e));
}
var gp = [
	{ label: "Time" },
	{ label: "Trigger" },
	{
		label: "Before",
		numeric: !0
	},
	{
		label: "After",
		numeric: !0
	},
	{
		label: "Took",
		numeric: !0
	},
	{
		label: "Each later call",
		numeric: !0
	},
	{
		label: "Cost once",
		numeric: !0
	},
	{
		label: "Pays off at",
		numeric: !0
	},
	{
		label: "Calls after",
		numeric: !0
	},
	{ label: "Versus keeping" }
];
function _p(e) {
	let t = /* @__PURE__ */ new Map();
	return e.map((e) => {
		let n = `${e.ts}|${e.trigger}`, r = t.get(n) ?? 0;
		t.set(n, r + 1);
		let i = e.versus_keeping, a = {
			text: X(e.next_context ?? e.post_tokens),
			title: `Claude Code reports ${X(e.post_tokens)}: without the system prompt, tools and CLAUDE.md the next call sends again`
		};
		return {
			key: r ? `${n}#${r}` : n,
			time: Ra(e.ts),
			trigger: Lf[e.trigger ?? ""] || e.trigger || "–",
			before: X(e.pre_tokens),
			after: a,
			took: Aa(e.duration_ms),
			versus: i ? {
				each: i.difference > 0 ? `−${X(i.difference)} · ${Q(i.saving_per_call)}` : `+${X(Math.abs(i.difference))} · nothing saved`,
				oneTime: {
					text: ul(i),
					title: dl(i)
				},
				paysOff: {
					text: cl(i) ?? "–",
					title: (i.breakeven_call ?? 0) > i.calls_after ? "projected past the last call" : null
				},
				callsAfter: {
					text: Z(i.calls_after),
					title: i.last_stretch ? "up to the last call" : "up to the next compaction"
				},
				verdict: {
					text: ol(i),
					tone: tl(i),
					words: sl(i),
					title: fl(i)
				}
			} : null
		};
	});
}
//#endregion
//#region src/components/ContextChart.svelte
var vp = /* @__PURE__ */ U([["path"], ["path", {
	fill: "none",
	stroke: "var(--surface)",
	"stroke-width": "2",
	"stroke-linejoin": "round"
}]], 5), yp = /* @__PURE__ */ U([["rect"]], 4), bp = /* @__PURE__ */ U([["line", { class: "reference-line" }], [
	"text",
	{ class: "axis-text" },
	" "
]], 5), xp = /* @__PURE__ */ U([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4), Sp = /* @__PURE__ */ U([["line", { class: "compaction-rule" }], ,], 5), Cp = /* @__PURE__ */ U([[
	"text",
	{ class: "value-text" },
	" "
]], 4), wp = /* @__PURE__ */ U([
	,
	,
	,
	["line", { stroke: "var(--axis)" }],
	,
	,
	,
	,
], 5), Tp = /* @__PURE__ */ U([["line", { class: "crosshair" }], ,], 5), Ep = /* @__PURE__ */ U([[
	"div",
	{ class: "row" },
	,
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
]]), Dp = /* @__PURE__ */ U([[
	"div",
	{ class: "name" },
	" "
]]), Op = /* @__PURE__ */ U([
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
			"context"
		]
	],
	" ",
	,
], 1);
function kp(e, t) {
	j(t, !0);
	let n = (e, n = w) => {
		let r = /* @__PURE__ */ N(() => n() - 64), i = /* @__PURE__ */ N(() => Ga(t.turns.length, 56, H(r))), a = /* @__PURE__ */ N(() => ep(t.hintTokens, H(o), H(s))), l = /* @__PURE__ */ N(() => np(t.compactions, t.turns, H(i)));
		var u = wp(), d = R(u);
		{
			let e = /* @__PURE__ */ N(() => Ua(H(o), 4));
			oc(d, {
				get left() {
					return 56;
				},
				get right() {
					return H(r);
				},
				get values() {
					return H(e);
				},
				get yOf() {
					return H(s);
				},
				get format() {
					return X;
				}
			});
		}
		var f = B(d);
		J(f, 17, () => $f(t.turns, H(i), H(s)), (e) => e.part.field, (e, t) => {
			var n = W(), r = R(n), i = (e) => {
				var n = vp(), r = R(n), i = B(r);
				V(() => {
					Y(r, "d", H(t).area), Y(r, "fill", H(t).part.color), Y(i, "d", H(t).edge);
				}), G(e, n);
			}, a = (e) => {
				var n = yp();
				V(() => {
					Y(n, "x", H(t).x), Y(n, "y", H(t).y), Y(n, "width", H(t).width), Y(n, "height", H(t).height), Y(n, "fill", H(t).part.color);
				}), G(e, n);
			};
			q(r, (e) => {
				H(t).kind === "area" ? e(i) : e(a, -1);
			}), G(e, n);
		});
		var p = B(f), m = B(p), h = (e) => {
			var t = bp(), n = R(t), i = B(n), o = z(i, !0);
			V(() => {
				Y(n, "x1", 56), Y(n, "x2", H(r)), Y(n, "y1", H(a).y), Y(n, "y2", H(a).y), Y(i, "x", H(r) + 6), Y(i, "y", H(a).y + 4), K(o, H(a).text);
			}), G(e, t);
		};
		q(m, (e) => {
			H(a) && e(h);
		});
		var g = B(m);
		J(g, 17, () => H(l), (e) => e.key, (e, t) => {
			var n = Sp(), r = R(n), i = B(r), a = (e) => {
				var n = xp(), r = z(n, !0);
				V(() => {
					Y(n, "x", H(t).x), Y(n, "y", 10), K(r, H(t).label);
				}), G(e, n);
			};
			q(i, (e) => {
				H(t).label && e(a);
			}), V(() => {
				Y(r, "x1", H(t).x), Y(r, "x2", H(t).x), Y(r, "y1", 14), Y(r, "y2", 178);
			}), G(e, n);
		});
		var _ = B(g);
		J(_, 17, () => rp(H(c), H(i), H(s), H(l).map((e) => e.x)), (e) => e.key, (e, t) => {
			var n = Cp(), r = z(n, !0);
			V(() => {
				Y(n, "x", H(t).x), Y(n, "y", H(t).y), Y(n, "text-anchor", H(t).anchor), K(r, H(t).text);
			}), G(e, n);
		});
		var v = B(_);
		{
			let e = /* @__PURE__ */ N(() => 196);
			ic(v, {
				get count() {
					return t.turns.length;
				},
				get xOf() {
					return H(i);
				},
				get y() {
					return H(e);
				},
				text: (e) => e === 0 ? "turn 1" : String(e + 1),
				most: 6
			});
		}
		V((e, t) => {
			Y(p, "x1", e), Y(p, "x2", t), Y(p, "y1", 178), Y(p, "y2", 178);
		}, [() => H(i)(0), () => H(i)(t.turns.length - 1)]), G(e, u);
	}, r = (e, n = w, r = w) => {
		let i = /* @__PURE__ */ N(() => Ga(t.turns.length, 56, n() - 64)(r()));
		var a = Tp(), o = R(a), l = B(o);
		{
			let e = /* @__PURE__ */ N(() => H(s)(H(c)[r()] ?? 0));
			iu(l, {
				get x() {
					return H(i);
				},
				get y() {
					return H(e);
				},
				color: "var(--context-new)"
			});
		}
		V(() => {
			Y(o, "x1", H(i)), Y(o, "x2", H(i)), Y(o, "y1", 18), Y(o, "y2", 178);
		}), G(e, a);
	}, i = (e, n = w) => {
		let r = /* @__PURE__ */ N(() => t.turns[n()]);
		var i = W(), a = R(i), o = (e) => {
			var i = Op(), a = R(i), o = z(a, !0), s = B(a, 2);
			J(s, 17, () => If.toReversed(), (e) => e.field, (e, t) => {
				var n = Ep(), i = L(n);
				Is(i, { get fill() {
					return H(t).color;
				} });
				var a = B(i, 2), o = z(a, !0), s = z(B(a, 2), !0);
				A(n), V((e) => {
					K(o, e), K(s, H(t).label);
				}, [() => X(H(r)[H(t).field])]), G(e, n);
			});
			var c = B(s, 2), l = z(B(L(c), 2), !0);
			Pe(2), A(c), J(B(c, 2), 16, () => ap(H(r)), (e) => e, (e, t) => {
				var n = Dp(), r = z(n, !0);
				V(() => K(r, t)), G(e, n);
			}), V((e, t) => {
				K(o, e), K(l, t);
			}, [() => ip(t.turns, n()), () => X(H(r).context)]), G(e, i);
		};
		q(a, (e) => {
			H(r) && e(o);
		}), G(e, i);
	}, a = /* @__PURE__ */ N(() => Xi(t.containerWidth)), o = /* @__PURE__ */ N(() => Zf(t.turns)), s = /* @__PURE__ */ N(() => Qf(H(o))), c = /* @__PURE__ */ N(() => t.turns.map((e) => e.context)), l = /* @__PURE__ */ N(() => ({
		count: t.turns.length,
		label: "Context per turn by part; arrow keys step through the turns",
		valueText: (e) => sp(t.turns, e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: 178
		}),
		indexAt: (e) => Ka(56, e - 64, t.turns.length),
		tipX: (e, n) => Ga(t.turns.length, 56, e - 64)(n)
	}));
	js(e, {
		get height() {
			return Xf;
		},
		get label() {
			return t.label;
		},
		get width() {
			return H(a);
		},
		get containerWidth() {
			return t.containerWidth;
		},
		get cursor() {
			return H(l);
		},
		get plot() {
			return n;
		},
		get marks() {
			return r;
		},
		get tip() {
			return i;
		}
	}), M();
}
//#endregion
//#region src/components/StatTile.svelte
var Ap = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), jp = /* @__PURE__ */ U([[
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
function Mp(e, t) {
	j(t, !0);
	let n = Ki(t, "note", 3, null), r = Ki(t, "themedNote", 3, !1);
	var i = jp(), a = L(i), o = z(a, !0), s = B(a, 2), c = z(s, !0), l = B(s, 2), u = (e) => {
		var t = Ap(), i = z(t, !0);
		V((e) => K(i, e), [() => r() ? Ts(n()) : n()]), G(e, t);
	};
	q(l, (e) => {
		n() && e(u);
	}), A(i), V((e) => {
		K(o, e), K(c, t.value);
	}, [() => Ts(t.label)]), G(e, i), M();
}
//#endregion
//#region src/components/ContextDetails.svelte
var Np = (e) => {
	G(e, Ip());
}, Pp = (e, t = w) => {
	var n = W();
	J(R(n), 19, () => fp, (e) => e.label, (e, n, r) => {
		var i = Lp(), a = z(i, !0);
		V(() => {
			vi(i, 1, fi(H(n).numeric ? "num" : void 0)), K(a, t().cells[H(r)]);
		}), G(e, i);
	}), G(e, n);
}, Fp = (e, t = w) => {
	var n = Hp(), r = R(n), i = z(r, !0), a = B(r, 2), o = z(a, !0), s = B(a, 2), c = z(s, !0), l = B(s, 2), u = z(l, !0), d = B(l, 2), f = z(d, !0), p = B(d, 2), m = (e) => {
		let n = /* @__PURE__ */ N(() => t().versus);
		var r = Bp(), i = R(r), a = z(i, !0), o = B(i, 2), s = z(o, !0), c = B(o, 2), l = z(c, !0), u = B(c, 2), d = z(u, !0), f = B(u, 2), p = L(f), m = z(p, !0);
		A(f), V(() => {
			K(a, H(n).each), Y(o, "title", H(n).oneTime.title), K(s, H(n).oneTime.text), Y(c, "title", H(n).paysOff.title), K(l, H(n).paysOff.text), Y(u, "title", H(n).callsAfter.title), K(d, H(n).callsAfter.text), Y(f, "title", H(n).verdict.title), vi(p, 1, fi(H(n).verdict.tone ? `verdict-${H(n).verdict.tone}` : void 0)), Y(p, "title", H(n).verdict.words), K(m, H(n).verdict.text);
		}), G(e, r);
	}, h = (e) => {
		G(e, Vp());
	};
	q(p, (e) => {
		t().versus ? e(m) : e(h, -1);
	}), V(() => {
		K(i, t().time), K(o, t().trigger), K(c, t().before), Y(l, "title", t().after.title), K(u, t().after.text), K(f, t().took);
	}), G(e, n);
}, Ip = /* @__PURE__ */ U([[
	"h3",
	null,
	"Biggest growth steps"
]]), Lp = /* @__PURE__ */ U([[
	"td",
	null,
	" "
]]), Rp = /* @__PURE__ */ U([[
	"span",
	null,
	" "
]]), zp = /* @__PURE__ */ U([[
	"h3",
	null,
	"Compactions",
	,
]]), Bp = /* @__PURE__ */ U([
	[
		"td",
		{ class: "num" },
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
		{ class: "num" },
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
			"span",
			null,
			" "
		]
	]
], 1), Vp = /* @__PURE__ */ U([[
	"td",
	{
		colspan: "5",
		class: "muted"
	},
	"no call after it, or no price for its model"
]]), Hp = /* @__PURE__ */ U([
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
		{ class: "num" },
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
], 1), Up = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Wp = /* @__PURE__ */ U([
	["div", { class: "kpis session-kpis" }],
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function Gp(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = zp(), n = B(L(t)), r = (e) => {
			var t = Rp(), n = z(t, !0);
			V(() => {
				vi(t, 1, `compaction-total verdict-${H(a).tone ?? ""}`), Y(t, "title", H(a).title), K(n, H(a).text);
			}), G(e, t);
		};
		q(n, (e) => {
			H(a) && e(r);
		}), A(t), G(e, t);
	}, r = /* @__PURE__ */ N(() => pp(t.agent)), i = /* @__PURE__ */ N(() => _p(t.agent.compactions)), a = /* @__PURE__ */ N(() => hp(t.agent.compactions));
	var o = Wp(), s = R(o);
	J(s, 21, () => up(t.agent), (e) => e.label, (e, t) => {
		Mp(e, {
			get label() {
				return H(t).label;
			},
			get value() {
				return H(t).value;
			},
			get note() {
				return H(t).note;
			}
		});
	}), A(s);
	var c = B(s, 2);
	nc(c, {
		get key() {
			return `${t.key ?? ""}-growth`;
		},
		get columns() {
			return fp;
		},
		get rows() {
			return H(r);
		},
		rowKey: (e) => e.key,
		get cells() {
			return Pp;
		},
		get heading() {
			return Np;
		},
		get empty() {
			return zf;
		}
	});
	var l = B(c, 2);
	nc(l, {
		get key() {
			return `${t.key ?? ""}-compactions`;
		},
		get columns() {
			return gp;
		},
		get rows() {
			return H(i);
		},
		rowKey: (e) => e.key,
		get cells() {
			return Fp;
		},
		get heading() {
			return n;
		},
		get empty() {
			return Bf;
		}
	});
	var u = B(l, 2), d = (e) => {
		var t = Up(), n = z(t, !0);
		V(() => K(n, Vf)), G(e, t);
	};
	q(u, (e) => {
		H(i).length && e(d);
	}), G(e, o), M();
}
//#endregion
//#region src/components/ContextPerTurn.svelte
var Kp = (e, t = w) => {
	var n = W();
	J(R(n), 19, () => cp, (e) => e.label, (e, n, r) => {
		var i = qp(), a = z(i, !0);
		V(() => {
			vi(i, 1, fi(H(n).numeric ? "num" : void 0)), K(a, t().cells[H(r)]);
		}), G(e, i);
	}), G(e, n);
}, qp = /* @__PURE__ */ U([[
	"td",
	null,
	" "
]]), Jp = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), Yp = /* @__PURE__ */ U([["optgroup"]]), Xp = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), Zp = /* @__PURE__ */ U([["select", {
	id: "context-agent",
	"aria-label": "Transcript the context section shows"
}]]), Qp = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), $p = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), em = /* @__PURE__ */ U([
	[
		"div",
		{ class: "chart-head" },
		[
			"h3",
			null,
			"Context per turn"
		],
		" ",
		[
			"span",
			{
				id: "context-note",
				class: "muted"
			},
			" "
		],
		" ",
		["span", { class: "spacer" }],
		" ",
		,
		" ",
		[
			"button",
			{
				type: "button",
				id: "context-table-toggle"
			},
			"Table view"
		]
	],
	" ",
	[
		"div",
		{ class: "legend" },
		,
		" ",
		[
			"span",
			null,
			["span", { class: "legend-rule" }],
			"compaction"
		]
	],
	" ",
	[
		"div",
		{
			id: "context-chart",
			class: "chart"
		},
		,
	],
	" ",
	,
	" ",
	[
		"div",
		{ id: "context-details" },
		,
	]
], 1);
function tm(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => Fo.session), r = /* @__PURE__ */ F("main"), i = /* @__PURE__ */ F(!1), a = /* @__PURE__ */ F(0), o = /* @__PURE__ */ N(() => H(n) ? Gf(H(n).agents, H(r)) : null), s = /* @__PURE__ */ N(() => H(o)?.context_per_turn ?? []), c = /* @__PURE__ */ N(() => H(n) ? Kf(H(n).agents) : []), l = /* @__PURE__ */ N(() => H(n) ? qf(H(n).session_id, H(o)) : ""), u = /* @__PURE__ */ N(() => lp(H(s)));
	var d = W(), f = R(d), p = (e) => {
		var t = em(), d = R(t), f = B(L(d), 2), p = z(f, !0), m = B(f, 4), h = (e) => {
			var t = Zp();
			J(t, 21, () => H(c), (e) => e.kind === "group" ? `group:${e.key}` : e.value, (e, t) => {
				var n = W(), r = R(n), i = (e) => {
					var n = Yp();
					J(n, 21, () => H(t).options, (e) => e.value, (e, t) => {
						var n = Jp(), r = z(n, !0), i = {};
						V(() => {
							K(r, H(t).label), i !== (i = H(t).value) && (n.value = (n.__value = i) ?? "");
						}), G(e, n);
					}), A(n), V(() => Y(n, "label", H(t).label)), G(e, n);
				}, a = (e) => {
					var n = Xp(), r = z(n, !0), i = {};
					V(() => {
						K(r, H(t).label), i !== (i = H(t).value) && (n.value = (n.__value = i) ?? "");
					}), G(e, n);
				};
				q(r, (e) => {
					H(t).kind === "group" ? e(i) : e(a, -1);
				}), G(e, n);
			}), A(t), wi(t), Ti(t, () => H(o) ? Hf(H(o)) : H(r), (e) => I(r, e, !0)), G(e, t);
		};
		q(m, (e) => {
			H(c).length && e(h);
		});
		var g = B(m, 2);
		A(d);
		var _ = B(d, 2);
		J(L(_), 17, () => If.toReversed(), (e) => e.field, (e, t) => {
			var n = Qp(), r = L(n);
			Is(r, { get fill() {
				return H(t).color;
			} });
			var i = B(r, 1, !0);
			A(n), V(() => K(i, H(t).label)), G(e, n);
		}), Pe(2), A(_);
		var v = B(_, 2), y = L(v), b = (e) => {
			{
				let t = /* @__PURE__ */ N(() => Yf(H(o), H(s)));
				kp(e, {
					get turns() {
						return H(s);
					},
					get compactions() {
						return H(o).compactions;
					},
					get hintTokens() {
						return H(n).compact_hint_tokens;
					},
					get label() {
						return H(t);
					},
					get containerWidth() {
						return H(a);
					}
				});
			}
		}, x = (e) => {
			var t = $p(), n = z(t, !0);
			V(() => K(n, Rf)), G(e, t);
		};
		q(y, (e) => {
			H(o) && H(s).length ? e(b) : e(x, -1);
		}), A(v);
		var S = B(v, 2), ee = (e) => {
			nc(e, {
				id: "context-table",
				get key() {
					return `${H(l) ?? ""}-turns`;
				},
				get columns() {
					return cp;
				},
				get rows() {
					return H(u);
				},
				rowKey: (e) => e.key,
				get cells() {
					return Kp;
				},
				get empty() {
					return Rf;
				}
			});
		};
		q(S, (e) => {
			H(i) && e(ee);
		});
		var te = B(S, 2), C = L(te), w = (e) => {
			Gp(e, {
				get agent() {
					return H(o);
				},
				get key() {
					return H(l);
				}
			});
		};
		q(C, (e) => {
			H(o) && e(w);
		}), A(te), V((e) => {
			K(p, e), Y(g, "aria-pressed", H(i));
		}, [() => Jf(H(o))]), Ar("click", g, () => I(i, !H(i))), Vi(v, "clientWidth", (e) => I(a, e)), G(e, t);
	};
	q(f, (e) => {
		H(n) && e(p);
	}), G(e, d), M();
}
jr(["click"]);
//#endregion
//#region src/lib/conversation.ts
function nm(e, t) {
	let n = t ? `?agent=${encodeURIComponent(t)}` : "";
	return `/api/session/${encodeURIComponent(e)}/chat${n}`;
}
function rm(e) {
	return e ? "Oldest first: click for newest first" : "Newest first: click for oldest first";
}
function im(e) {
	let t = e.agent_id === null ? "Main thread" : `${e.agent_type}${e.description ? ` · ${e.description}` : ""}`;
	return {
		value: e.agent_id ?? "",
		label: t
	};
}
function am(e) {
	let t = [], n = /* @__PURE__ */ new Map();
	for (let r of e) {
		if (r.agent_type === "(background)") continue;
		if (r.workflow_run === null) {
			t.push(im(r));
			continue;
		}
		let e = n.get(r.workflow_run);
		e || (e = {
			group: `workflow · ${r.workflow_name || r.workflow_run}`,
			options: []
		}, n.set(r.workflow_run, e), t.push(e)), e.options.push(im(r));
	}
	return t;
}
function om(e) {
	return e?.calls ? `Claude Code's token reminder went with ${Z(e.calls)} calls, ${Z(e.chars)} characters in all; each call's badge counts it (hover the badge).` : null;
}
function sm(e) {
	return e.available ? e.entries.length ? null : "No conversation in this transcript yet." : "The transcript is gone: Claude Code deleted it after its cleanup period. The usage history stays.";
}
function cm(e, t) {
	return JSON.stringify(e) === JSON.stringify(t);
}
function lm(e, t) {
	if (!e) return t;
	let n = t.entries.map((t, n) => {
		let r = e.entries[n];
		return r && JSON.stringify(r) === JSON.stringify(t) ? r : t;
	});
	return {
		...t,
		entries: n
	};
}
//#endregion
//#region src/lib/http.ts
async function um(e) {
	let t = await fetch(e, { cache: "no-store" }), n;
	try {
		n = await t.json();
	} catch {
		throw Error(`${e}: HTTP ${t.status}, not JSON`);
	}
	if (t.status === 403) throw Error(n.error || "HTTP 403");
	if (!t.ok) throw Error(`${e}: ${n.error || `HTTP ${t.status}`}`);
	return n;
}
//#endregion
//#region src/lib/entries.ts
var dm = {
	prompt: "You",
	text: "Claude",
	thinking: "Thinking"
};
function fm(e) {
	return dm[e] ?? e;
}
function pm(e) {
	return e.kind === "prompt" ? "" : [e.model, e.effort ? `effort ${e.effort}` : null].filter(Boolean).join(" · ");
}
function mm(e, t) {
	return t > e.length ? ` · first ${Z(e.length)} of ${Z(t)} characters` : "";
}
var hm = /<command-name>([^<]*)<\/command-name>/, gm = /<command-args>([^<]*)<\/command-args>/;
function _m(e) {
	let t = e.match(hm);
	if (t) {
		let n = (e.match(gm) ?? [])[1] ?? "";
		return {
			kind: "command",
			text: `${(t[1] ?? "").trim()} ${n.trim()}`.trim()
		};
	}
	let n = vm(e);
	return n === null ? {
		kind: "markdown",
		text: e
	} : {
		kind: "json",
		code: n
	};
}
function vm(e) {
	let t = e.trim();
	if (!t.startsWith("{") && !t.startsWith("[")) return null;
	try {
		return JSON.stringify(JSON.parse(t), null, 2);
	} catch {
		return null;
	}
}
var ym = {
	py: "python",
	js: "javascript",
	mjs: "javascript",
	cjs: "javascript",
	jsx: "javascript",
	ts: "typescript",
	tsx: "typescript",
	json: "json",
	sh: "bash",
	bash: "bash",
	zsh: "bash",
	php: "php",
	rb: "ruby",
	go: "go",
	rs: "rust",
	java: "java",
	kt: "kotlin",
	swift: "swift",
	c: "c",
	h: "c",
	cpp: "cpp",
	hpp: "cpp",
	cs: "csharp",
	css: "css",
	scss: "scss",
	less: "less",
	html: "xml",
	xml: "xml",
	svg: "xml",
	vue: "xml",
	md: "markdown",
	yml: "yaml",
	yaml: "yaml",
	toml: "ini",
	ini: "ini",
	cfg: "ini",
	sql: "sql",
	lua: "lua",
	pl: "perl",
	r: "r",
	graphql: "graphql",
	diff: "diff",
	patch: "diff",
	mk: "makefile"
}, bm = {
	Makefile: "makefile",
	Dockerfile: "bash",
	".bashrc": "bash",
	".zshrc": "bash"
};
function xm(e) {
	if (!e) return null;
	let t = e.split("/").pop() ?? "", n = bm[t];
	if (n) return n;
	let r = t.lastIndexOf(".");
	return r > 0 ? ym[t.slice(r + 1).toLowerCase()] ?? null : null;
}
function Sm(e) {
	return e ? ym[e] ?? e : null;
}
function Cm(e) {
	return Object.fromEntries((e.tool_fields ?? []).map((e) => [e.name, e]));
}
function wm(e) {
	let t = Cm(e).description;
	return (e.tool === "Bash" && t ? t.value : e.summary) ?? "";
}
function Tm(e) {
	return e.result === null ? " · no result yet" : e.is_error ? " · ⚠ failed" : "";
}
function Em(e, t) {
	let n = (e) => e ? e.split("\n") : [];
	return [...n(e).map((e) => `- ${e}`), ...n(t).map((e) => `+ ${e}`)].join("\n");
}
function Dm(e) {
	return e.map((e) => {
		let t = e.value.includes("\n");
		return {
			name: e.name,
			label: `${e.name}${mm(e.value, e.chars)}`,
			value: e.value,
			shape: e.is_json ? "json" : t ? "block" : "line",
			inline: !t
		};
	});
}
function Om(e) {
	let t = Cm(e), n = e.tool_fields ?? [], r = (e) => Dm(n.filter((t) => !e.includes(t.name))), { command: i, description: a, file_path: o, old_string: s, new_string: c, content: l } = t;
	if (e.tool === "Bash" && i) return {
		kind: "bash",
		description: a ? a.value : null,
		label: `Command${mm(i.value, i.chars)}`,
		command: i.value,
		rest: r(["command", "description"])
	};
	if (e.tool === "Edit" && o && (s || c)) {
		let e = s ?? {
			value: "",
			chars: 0
		}, t = c ?? {
			value: "",
			chars: 0
		}, n = e.chars > e.value.length || t.chars > t.value.length;
		return {
			kind: "edit",
			path: o.value,
			label: `Change${n ? " · cut to the first 4,000 characters of each side" : ""}`,
			diff: Em(e.value, t.value),
			rest: r([
				"file_path",
				"old_string",
				"new_string"
			])
		};
	}
	return e.tool === "Write" && o && l ? {
		kind: "write",
		path: o.value,
		label: `Content${mm(l.value, l.chars)}`,
		content: l.value,
		language: xm(o.value),
		rest: r(["file_path", "content"])
	} : {
		kind: "fields",
		label: "Input",
		rest: Dm(n)
	};
}
function km(e) {
	let t = e.result ?? "";
	if (e.result_chars <= t.length) {
		let e = vm(t);
		if (e !== null) return {
			kind: "code",
			code: e,
			language: "json"
		};
	}
	let n = Cm(e).file_path;
	return e.tool === "Read" && n && !e.is_error ? {
		kind: "code",
		code: t,
		language: xm(n.value)
	} : {
		kind: "text",
		text: t
	};
}
function Am(e) {
	return `Result${mm(e.result ?? "", e.result_chars)}`;
}
var jm = {
	meta: "meta record",
	skill: "skill text",
	summary: "compact summary"
};
function Mm(e) {
	return jm[e] ?? e.replaceAll("_", " ");
}
function Nm(e) {
	let t = e.reduce((e, t) => e + t.chars, 0);
	return `${e.length === 1 ? "1 item" : `${Z(e.length)} items`} · ${Z(t)} characters`;
}
function Pm(e) {
	let t = e.compaction ?? {
		trigger: null,
		pre_tokens: null,
		post_tokens: null,
		duration_ms: null
	}, n = [e.text ?? ""];
	if (t.trigger && n.push(t.trigger), t.pre_tokens !== null) {
		let r = e.versus_keeping ? `next call ${X(e.versus_keeping.after)}` : `${X(t.post_tokens)} tokens`;
		n.push(`${X(t.pre_tokens)} → ${r}`);
	}
	return t.duration_ms && n.push(`took ${Aa(t.duration_ms)}`), n.join(" · ");
}
function Fm(e) {
	return e.kind === "error" ? `⚠ API error: ${e.text ?? ""}` : Pm(e);
}
function Im(e) {
	return [
		ll(e),
		`${Z(e.calls_after)} calls after`,
		`cost ${ul(e)} once`
	].filter(Boolean).join(" · ");
}
function Lm(e) {
	return ` (${Oa(e)})`;
}
function Rm(e) {
	if (e.growth === null || e.growth === void 0) return "";
	if (!e.reply) return Lm(e.growth);
	let t = e.growth < 0 ? Oa(e.growth) : X(e.growth);
	return ` (${Oa(e.reply + e.growth)}: reply ${X(e.reply)}, added ${t})`;
}
function zm(e) {
	let t = [`context ${X(e.context)}${Rm(e)}`, `in ${X(e.new_input)}`];
	return e.cache_write && t.push(`cache write ${X(e.cache_write)}`), e.cache_read && t.push(`cache read ${X(e.cache_read)}`), t.push(`out ${X(e.output)}`), e.web_searches && t.push(`${Z(e.web_searches)} web searches`), e.speed !== "standard" && t.push("fast mode"), t;
}
function Bm(e) {
	return e.cost === null ? "no price" : Q(e.cost);
}
function Vm(e) {
	return e.reminder_chars ? `The context includes Claude Code's token reminder (${Z(e.reminder_chars)} characters)` : null;
}
function Hm(e) {
	return e !== void 0 && e.kind.endsWith("_reminder");
}
function Um(e) {
	return e?.kind === "auto_reminder" ? "chat-usage-remind-auto" : e?.kind === "pays_reminder" ? "chat-usage-remind-pays" : e?.kind === "soft_reminder" ? "chat-usage-remind" : "";
}
function Wm(e) {
	return e.kind === "auto_reminder" ? {
		tone: "compact-chip-auto",
		text: `⚠ ${ka(e.context, e.auto_compact)} of auto-compact (${X(e.auto_compact)})`
	} : e.kind === "pays_reminder" ? {
		tone: "compact-chip-pays",
		text: `⚠ ${X(e.context)} · compacting pays after ~${e.pays_off_in} replies`
	} : e.kind === "soft_reminder" ? {
		tone: "",
		text: `ℹ ${X(e.context)} · ${e.times}× your ${X(e.threshold)} hint`
	} : {
		tone: "",
		text: ""
	};
}
function Gm(e) {
	let t = e.extra_cost === null ? "" : ` · +${Q(e.extra_cost)}`;
	return {
		text: `↻ cache rebuilt (${e.cause}) · ${X(e.lost)}${t}`,
		title: `${X(e.lost)} tokens written to the cache again: ${rl[e.cause]}`
	};
}
function Km(e) {
	if (e === void 0) return null;
	if (e.kind === "pays") {
		let t = e.ahead_from === "longer" ? `After your past compactions, a stretch this long went on for about ${e.calls_ahead} more on average.` : `After your past compactions you went on for about ${e.calls_ahead} replies on average.`;
		return {
			tone: "compact-pays",
			label: "⚠ Compacting pays on average",
			text: `Context ${X(e.context)}, and every reply reads all of it again. /compact would shrink it to about ${X(e.after)}. That costs ~${Q(e.one_time)} once, and the cheaper replies pay it back within about ${e.pays_off_in} replies. ${t}`
		};
	}
	if (e.kind === "auto") return {
		tone: "compact-auto",
		label: "⚠ Compact soon",
		text: `Context ${X(e.context)}: ${ka(e.context, e.auto_compact)} of the ${X(e.auto_compact)} where Claude Code auto-compacts. /compact now to choose what to keep.`
	};
	if (e.kind !== "soft") return null;
	let t = e.reread_cost ? `: this turn cost ${Q(e.reread_cost)} in cache reads` : "";
	return {
		tone: "",
		label: "ℹ Consider compacting",
		text: `Context ${X(e.context)}, over the ${X(e.threshold)} hint (a heuristic, [chat] compact_hint_tokens in config.toml). Every turn re-reads it${t}. /compact, or /clear when the task changes.`
	};
}
//#endregion
//#region src/components/ChatInjected.svelte
var qm = /* @__PURE__ */ U([
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	[
		"pre",
		{ class: "code" },
		" "
	]
], 1), Jm = /* @__PURE__ */ U([[
	"details",
	{ class: "chat-tool chat-injected" },
	[
		"summary",
		null,
		[
			"strong",
			null,
			"Added to the context"
		],
		" ",
		[
			"span",
			{ class: "muted" },
			" "
		]
	],
	" ",
	,
]]);
function Ym(e, t) {
	j(t, !0);
	var n = Jm(), r = L(n), i = B(L(r)), a = z(B(i), !0);
	A(r), J(B(r, 2), 16, () => t.entry.items, (e) => e, (e, t) => {
		var n = qm(), r = R(n), i = z(r), a = z(B(r, 2), !0);
		V((e, n) => {
			K(i, `${e ?? ""}${n ?? ""}`), K(a, t.text);
		}, [() => Mm(t.kind), () => mm(t.text, t.chars)]), G(e, n);
	}), A(n), V((e, t) => {
		K(i, ` ${e ?? ""} `), K(a, t);
	}, [() => Nm(t.entry.items), () => Ra(t.entry.timestamp)]), G(e, n), M();
}
//#endregion
//#region src/components/ChatMarker.svelte
var Xm = /* @__PURE__ */ U([[
	"div",
	{ class: "muted" },
	"vs keeping: ",
	[
		"span",
		null,
		" "
	],
	" "
]]), Zm = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-marker" },
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	],
	" ",
	,
]]);
function Qm(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => t.entry.versus_keeping ?? null), r = /* @__PURE__ */ N(() => H(n) ? tl(H(n)) : null);
	var i = Zm(), a = L(i), o = B(a), s = z(o, !0), c = B(o, 2), l = (e) => {
		var t = Xm(), i = B(L(t)), a = z(i, !0), o = B(i);
		A(t), V((e, n, s) => {
			Y(t, "title", al), vi(i, 1, fi(H(r) ? `verdict-${H(r)}` : void 0)), Y(i, "title", e), K(a, n), K(o, ` · ${s ?? ""}`);
		}, [
			() => sl(H(n)) ?? void 0,
			() => ol(H(n)),
			() => Im(H(n))
		]), G(e, t);
	};
	q(c, (e) => {
		H(n) && e(l);
	}), A(i), V((e, t) => {
		K(a, `${e ?? ""} `), K(s, t);
	}, [() => Fm(t.entry), () => Ra(t.entry.timestamp)]), G(e, i), M();
}
//#endregion
//#region node_modules/dompurify/dist/purify.es.mjs
function $m(e, t) {
	this.v = e, this.k = t;
}
function eh(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function th(e) {
	if (Array.isArray(e)) return e;
}
function nh(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function rh() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ih(e, t) {
	return th(e) || nh(e, t) || ah(e, t) || rh();
}
function ah(e, t) {
	if (e) {
		if (typeof e == "string") return eh(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? eh(e, t) : void 0;
	}
}
function oh(e) {
	var t, n;
	function r(t, n) {
		try {
			var a = e[t](n), o = a.value, s = o instanceof $m;
			Promise.resolve(s ? o.v : o).then(function(n) {
				if (s) {
					var c = t === "return" && o.k ? t : "next";
					if (!o.k || n.done) return r(c, n);
					n = e[c](n).value;
				}
				i(!!a.done, n);
			}, function(e) {
				r("throw", e);
			});
		} catch (e) {
			i(2, e);
		}
	}
	function i(e, i) {
		e === 2 ? t.reject(i) : t.resolve({
			value: i,
			done: e
		}), (t = t.next) ? r(t.key, t.arg) : n = null;
	}
	this._invoke = function(e, i) {
		return new Promise(function(a, o) {
			var s = {
				key: e,
				arg: i,
				resolve: a,
				reject: o,
				next: null
			};
			n ? n = n.next = s : (t = n = s, r(e, i));
		});
	}, typeof e.return != "function" && (this.return = void 0);
}
oh.prototype[typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
	return this;
}, oh.prototype.next = function(e) {
	return this._invoke("next", e);
}, oh.prototype.throw = function(e) {
	return this._invoke("throw", e);
}, oh.prototype.return = function(e) {
	return this._invoke("return", e);
};
var sh = Object.entries, ch = Object.setPrototypeOf, lh = Object.isFrozen, uh = Object.getPrototypeOf, dh = Object.getOwnPropertyDescriptor, fh = Object.freeze, ph = Object.seal, mh = Object.create, hh = typeof Reflect < "u" && Reflect, gh = hh.apply, _h = hh.construct;
fh ||= function(e) {
	return e;
}, ph ||= function(e) {
	return e;
}, gh ||= function(e, t) {
	var n = [...arguments].slice(2);
	return e.apply(t, n);
}, _h ||= function(e) {
	return new e(...[...arguments].slice(1));
};
var vh = Rh(Array.prototype.forEach);
Array.prototype.indexOf;
var yh = Rh(Array.prototype.lastIndexOf), bh = Rh(Array.prototype.pop), xh = Rh(Array.prototype.push);
Array.prototype.slice;
var Sh = Rh(Array.prototype.splice), Ch = Array.isArray, wh = Rh(String.prototype.toLowerCase), Th = Rh(String.prototype.toString), Eh = Rh(String.prototype.match), Dh = Rh(String.prototype.replace), Oh = Rh(String.prototype.indexOf), kh = Rh(String.prototype.trim), Ah = Rh(Number.prototype.toString), jh = Rh(Boolean.prototype.toString), Mh = typeof BigInt > "u" ? null : Rh(BigInt.prototype.toString), Nh = typeof Symbol > "u" ? null : Rh(Symbol.prototype.toString), Ph = Rh(Object.prototype.hasOwnProperty), Fh = Rh(Object.prototype.toString), Ih = Rh(RegExp.prototype.test), Lh = zh(TypeError);
function Rh(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		var n = [...arguments].slice(1);
		return gh(e, t, n);
	};
}
function zh(e) {
	return function() {
		return _h(e, [...arguments]);
	};
}
function Bh(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : wh;
	if (ch && ch(e, null), !Ch(t)) return e;
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			let e = n(i);
			e !== i && (lh(t) || (t[r] = e), i = e);
		}
		e[i] = !0;
	}
	return e;
}
function Vh(e) {
	for (let t = 0; t < e.length; t++) Ph(e, t) || (e[t] = null);
	return e;
}
function Hh(e) {
	let t = mh(null);
	for (let r of sh(e)) {
		var n = ih(r, 2);
		let i = n[0], a = n[1];
		Ph(e, i) && (t[i] = Ch(a) ? Vh(a) : a && typeof a == "object" && a.constructor === Object ? Hh(a) : a);
	}
	return t;
}
function Uh(e) {
	switch (typeof e) {
		case "string": return e;
		case "number": return Ah(e);
		case "boolean": return jh(e);
		case "bigint": return Mh ? Mh(e) : "0";
		case "symbol": return Nh ? Nh(e) : "Symbol()";
		case "undefined": return Fh(e);
		case "function":
		case "object": {
			if (e === null) return Fh(e);
			let t = e, n = Wh(t, "toString");
			if (typeof n == "function") {
				let e = n(t);
				return typeof e == "string" ? e : Fh(e);
			}
			return Fh(e);
		}
		default: return Fh(e);
	}
}
function Wh(e, t) {
	for (; e !== null;) {
		let n = dh(e, t);
		if (n) {
			if (n.get) return Rh(n.get);
			if (typeof n.value == "function") return Rh(n.value);
		}
		e = uh(e);
	}
	function n() {
		return null;
	}
	return n;
}
function Gh(e) {
	try {
		return Ih(e, ""), !0;
	} catch {
		return !1;
	}
}
var Kh = fh(/* @__PURE__ */ "a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr".split(".")), qh = fh(/* @__PURE__ */ "svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern".split(".")), Jh = fh([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]), Yh = fh([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]), Xh = fh(/* @__PURE__ */ "math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts".split(".")), Zh = fh([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]), Qh = fh(["#text"]), $h = fh(/* @__PURE__ */ "accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns".split(".")), eg = fh(/* @__PURE__ */ "accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.pointer-events.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.vector-effect.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan".split(".")), tg = fh(/* @__PURE__ */ "accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns".split(".")), ng = fh([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), rg = ph(/{{[\w\W]*|^[\w\W]*}}/g), ig = ph(/<%[\w\W]*|^[\w\W]*%>/g), ag = ph(/\${[\w\W]*/g), og = ph(/^data-[\-\w.\u00B7-\uFFFF]+$/), sg = ph(/^aria-[\-\w]+$/), cg = ph(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), lg = ph(/^(?:\w+script|data):/i), ug = ph(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), dg = ph(/^html$/i), fg = ph(/^[a-z][.\w]*(-[.\w]+)+$/i), pg = ph(/<[/\w!]/g), mg = ph(/<[/\w]/g), hg = ph(/<\/no(script|embed|frames)/i), gg = ph(/\/>/i), _g = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
}, vg = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
], yg = fh(Bh({}, vg)), bg = function() {
	let e = {};
	return vh(vg, (t) => {
		e[t] = ph(RegExp("</" + t + "(?=[\\t\\n\\f\\r />])", "i"));
	}), fh(e);
}(), xg = function() {
	return typeof window > "u" ? null : window;
}, Sg = function(e, t) {
	if (typeof e != "object" || typeof e.createPolicy != "function") return null;
	let n = null, r = "data-tt-policy-suffix";
	t && t.hasAttribute(r) && (n = t.getAttribute(r));
	let i = "dompurify" + (n ? "#" + n : "");
	try {
		return e.createPolicy(i, {
			createHTML(e) {
				return e;
			},
			createScriptURL(e) {
				return e;
			}
		});
	} catch {
		return console.warn("TrustedTypes policy " + i + " could not be created."), null;
	}
}, Cg = function() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
}, wg = function(e, t, n, r) {
	return Ph(e, t) && Ch(e[t]) ? Bh(r.base ? Hh(r.base) : {}, e[t], r.transform) : n;
}, Tg = function(e, t, n) {
	let r = Ph(e, t) ? e[t] : void 0;
	return r && typeof r == "object" ? Hh(r) : n();
};
function Eg() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : xg(), t = (e) => Eg(e);
	if (t.version = "3.4.16", t.removed = [], !e || !e.document || e.document.nodeType !== _g.document || !e.Element) return t.isSupported = !1, t;
	let n = e.document, r = n, i = r.currentScript;
	e.DocumentFragment;
	let a = e.HTMLTemplateElement, o = e.Node, s = e.Element, c = e.NodeFilter;
	e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
	let l = e.DOMParser, u = e.trustedTypes, d = s.prototype, f = Wh(d, "cloneNode"), p = Wh(d, "remove"), m = Wh(d, "removeAttributeNode"), h = Wh(d, "nextSibling"), g = Wh(d, "childNodes"), _ = Wh(d, "parentNode"), v = Wh(d, "shadowRoot"), y = Wh(d, "attributes"), b = o && o.prototype ? Wh(o.prototype, "nodeType") : null, x = o && o.prototype ? Wh(o.prototype, "nodeName") : null, S = o && o.prototype ? Wh(o.prototype, "ownerDocument") : null, ee = function(e) {
		return b ? b(e) : e.nodeType;
	}, te = function(e) {
		return x ? x(e) : e.nodeName;
	};
	if (typeof a == "function") {
		let e = n.createElement("template");
		e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
	}
	let C, w = "", ne, re = !1, ie = 0, T = function() {
		if (ie > 0) throw Lh("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	}, ae = function(e) {
		T(), ie++;
		try {
			return C.createHTML(e);
		} finally {
			ie--;
		}
	}, E = function(e) {
		T(), ie++;
		try {
			return C.createScriptURL(e);
		} finally {
			ie--;
		}
	}, oe = function() {
		return re ||= (ne = Sg(u, i), !0), ne;
	}, D = n, se = D.implementation, ce = D.createNodeIterator, le = D.createDocumentFragment, ue = D.getElementsByTagName, de = r.importNode, O = Cg();
	t.isSupported = typeof sh == "function" && typeof _ == "function" && se && se.createHTMLDocument !== void 0;
	let fe = rg, pe = ig, me = ag, he = og, ge = sg, _e = lg, ve = ug, ye = fg, be = cg, xe = null, Se = Bh({}, [
		...Kh,
		...qh,
		...Jh,
		...Xh,
		...Qh
	]), Ce = null, we = Bh({}, [
		...$h,
		...eg,
		...tg,
		...ng
	]), Te = Object.seal(mh(null, {
		tagNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: !1
		}
	})), Ee = null, De = null, Oe = Object.seal(mh(null, {
		tagCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		}
	})), ke = !0, k = !0, Ae = !1, je = !0, Me = !1, Ne = !0, A = !1, Pe = !1, Fe = null, Ie = null, Le = !1, Re = !1, ze = !1, Be = !1, Ve = !0, He = !1, Ue = "user-content-", We = !0, Ge = !1, Ke = {}, qe = null, Je = Bh({}, /* @__PURE__ */ "annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp".split(".")), Ye = null, Xe = Bh({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]), Ze = null, Qe = Bh({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]), j = "http://www.w3.org/1998/Math/MathML", M = "http://www.w3.org/2000/svg", $e = "http://www.w3.org/1999/xhtml", et = $e, tt = !1, nt = null, rt = Bh({}, [
		j,
		M,
		$e
	], Th), it = fh([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), at = Bh({}, it), ot = fh(["annotation-xml"]), st = Bh({}, ot), ct = Bh({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]), lt = null, ut = ["application/xhtml+xml", "text/html"], dt = null, ft = null, pt = n.createElement("form"), mt = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, ht = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (ft && ft === e) return;
		(!e || typeof e != "object") && (e = {}), e = Hh(e), lt = ut.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? "text/html" : e.PARSER_MEDIA_TYPE, dt = lt === "application/xhtml+xml" ? Th : wh, xe = wg(e, "ALLOWED_TAGS", Se, { transform: dt }), Ce = wg(e, "ALLOWED_ATTR", we, { transform: dt }), nt = wg(e, "ALLOWED_NAMESPACES", rt, { transform: Th }), Ze = wg(e, "ADD_URI_SAFE_ATTR", Qe, {
			transform: dt,
			base: Qe
		}), Ye = wg(e, "ADD_DATA_URI_TAGS", Xe, {
			transform: dt,
			base: Xe
		}), qe = wg(e, "FORBID_CONTENTS", Je, { transform: dt }), Ee = wg(e, "FORBID_TAGS", Hh({}), { transform: dt }), De = wg(e, "FORBID_ATTR", Hh({}), { transform: dt }), Ke = Ph(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? Hh(e.USE_PROFILES) : e.USE_PROFILES : !1, ke = e.ALLOW_ARIA_ATTR !== !1, k = e.ALLOW_DATA_ATTR !== !1, Ae = e.ALLOW_UNKNOWN_PROTOCOLS || !1, je = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Me = e.SAFE_FOR_TEMPLATES || !1, Ne = e.SAFE_FOR_XML !== !1, A = e.WHOLE_DOCUMENT || !1, Re = e.RETURN_DOM || !1, ze = e.RETURN_DOM_FRAGMENT || !1, Be = e.RETURN_TRUSTED_TYPE || !1, Le = e.FORCE_BODY || !1, Ve = e.SANITIZE_DOM !== !1, He = e.SANITIZE_NAMED_PROPS || !1, We = e.KEEP_CONTENT !== !1, Ge = e.IN_PLACE || !1, be = Gh(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : cg, et = typeof e.NAMESPACE == "string" ? e.NAMESPACE : $e, at = Tg(e, "MATHML_TEXT_INTEGRATION_POINTS", () => Bh({}, it)), st = Tg(e, "HTML_INTEGRATION_POINTS", () => Bh({}, ot));
		let t = Tg(e, "CUSTOM_ELEMENT_HANDLING", () => mh(null));
		if (Te = mh(null), Ph(t, "tagNameCheck") && mt(t.tagNameCheck) && (Te.tagNameCheck = t.tagNameCheck), Ph(t, "attributeNameCheck") && mt(t.attributeNameCheck) && (Te.attributeNameCheck = t.attributeNameCheck), Ph(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (Te.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), ph(Te), Me && (k = !1), ze && (Re = !0), Ke && (xe = Bh({}, Qh), Ce = mh(null), Ke.html === !0 && (Bh(xe, Kh), Bh(Ce, $h)), Ke.svg === !0 && (Bh(xe, qh), Bh(Ce, eg), Bh(Ce, ng)), Ke.svgFilters === !0 && (Bh(xe, Jh), Bh(Ce, eg), Bh(Ce, ng)), Ke.mathMl === !0 && (Bh(xe, Xh), Bh(Ce, tg), Bh(Ce, ng))), Oe.tagCheck = null, Oe.attributeCheck = null, Ph(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? Oe.tagCheck = e.ADD_TAGS : Ch(e.ADD_TAGS) && (xe === Se && (xe = Hh(xe)), Bh(xe, e.ADD_TAGS, dt))), Ph(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? Oe.attributeCheck = e.ADD_ATTR : Ch(e.ADD_ATTR) && (Ce === we && (Ce = Hh(Ce)), Bh(Ce, e.ADD_ATTR, dt))), Ph(e, "ADD_FORBID_CONTENTS") && Ch(e.ADD_FORBID_CONTENTS) && (qe === Je && (qe = Hh(qe)), Bh(qe, e.ADD_FORBID_CONTENTS, dt)), We && (xe["#text"] = !0), A && Bh(xe, [
			"html",
			"head",
			"body"
		]), xe.table && (Bh(xe, ["tbody"]), delete Ee.tbody), e.TRUSTED_TYPES_POLICY) {
			if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw Lh("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Lh("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			let t = C;
			C = e.TRUSTED_TYPES_POLICY;
			try {
				w = ae("");
			} catch (e) {
				throw C = t, e;
			}
		} else e.TRUSTED_TYPES_POLICY === null ? (C = void 0, w = "") : (C === void 0 && (C = oe()), C && typeof w == "string" && (w = ae("")));
		fh && fh(e), ft = e;
	}, gt = Bh({}, [
		...qh,
		...Jh,
		...Yh
	]), _t = Bh({}, [...Xh, ...Zh]), vt = function(e, t, n) {
		return t.namespaceURI === $e ? e === "svg" : t.namespaceURI === j ? e === "svg" && (n === "annotation-xml" || at[n]) : !!gt[e];
	}, yt = function(e, t, n) {
		return t.namespaceURI === $e ? e === "math" : t.namespaceURI === M ? e === "math" && st[n] : !!_t[e];
	}, N = function(e, t, n) {
		return t.namespaceURI === M && !st[n] || t.namespaceURI === j && !at[n] ? !1 : !_t[e] && (ct[e] || !gt[e]);
	}, bt = function(e) {
		let t = _(e);
		(!t || !t.tagName) && (t = {
			namespaceURI: et,
			tagName: "template"
		});
		let n = wh(e.tagName), r = wh(t.tagName);
		return nt[e.namespaceURI] ? e.namespaceURI === M ? vt(n, t, r) : e.namespaceURI === j ? yt(n, t, r) : e.namespaceURI === $e ? N(n, t, r) : !!(lt === "application/xhtml+xml" && nt[e.namespaceURI]) : !1;
	}, xt = function(e) {
		xh(t.removed, { element: e });
		try {
			_(e).removeChild(e);
		} catch {
			if (p(e), !_(e)) throw Lh("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, St = function(e, t, n) {
		try {
			m(e, t);
		} catch {
			try {
				e.removeAttribute(n);
			} catch {}
		}
	}, Ct = function(e) {
		Et(e);
		let t = g(e);
		if (t) {
			let e = [];
			vh(t, (t) => {
				xh(e, t);
			}), vh(e, (e) => {
				try {
					p(e);
				} catch {}
			});
		}
		let n = y(e);
		if (n) for (let t = n.length - 1; t >= 0; --t) {
			let r = n[t], i = r && r.name;
			typeof i == "string" && St(e, r, i);
		}
	}, wt = function(e, n, r) {
		if (!r) try {
			r = n.getAttributeNode(e);
		} catch {
			r = null;
		}
		xh(t.removed, {
			attribute: r || null,
			from: n
		});
		try {
			r ? m(n, r) : n.removeAttribute(e);
		} catch {
			try {
				n.removeAttribute(e);
			} catch {}
		}
		if (e === "is") {
			if (Re || ze) try {
				xt(n);
			} catch {}
			else try {
				n.setAttribute(e, "");
			} catch {}
		}
	}, Tt = function(e) {
		let t = y(e);
		if (t) for (let n = t.length - 1; n >= 0; --n) {
			let r = t[n], i = r && r.name;
			typeof i != "string" || Ce[dt(i)] || St(e, r, i);
		}
	}, Et = function(e) {
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop();
			ee(e) === _g.element && Tt(e);
			let n = g(e);
			if (n) for (let e = n.length - 1; e >= 0; --e) t.push(n[e]);
		}
	}, P = function(e, t) {
		return Ne ? e === "patchsrc" || e === "for" && t !== "label" && t !== "output" : !1;
	}, Dt = function(e) {
		if (!Ne) return;
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop(), n = ee(e);
			if (n === _g.processingInstruction || n === _g.comment && Ih(mg, e.data)) {
				try {
					p(e);
				} catch {}
				continue;
			}
			if (n === _g.element) {
				let t = e, n = dt(te(e));
				try {
					t.hasAttribute && t.hasAttribute("patchsrc") && t.removeAttribute("patchsrc"), t.hasAttribute && t.hasAttribute("for") && P("for", n) && t.removeAttribute("for");
				} catch {}
			}
			let r = g(e);
			if (r) for (let e = r.length - 1; e >= 0; --e) t.push(r[e]);
		}
	}, Ot = function(e) {
		let t = null, r = null;
		if (Le) e = "<remove></remove>" + e;
		else {
			let t = Eh(e, /^[\r\n\t ]+/);
			r = t && t[0];
		}
		lt === "application/xhtml+xml" && et === $e && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		let i = C ? ae(e) : e;
		if (et === $e) try {
			t = new l().parseFromString(i, lt);
		} catch {}
		if (!t || !t.documentElement) {
			t = se.createDocument(et, "template", null);
			try {
				t.documentElement.innerHTML = tt ? w : i;
			} catch {}
		}
		let a = t.body || t.documentElement;
		return e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null), et === $e ? ue.call(t, A ? "html" : "body")[0] : A ? t.documentElement : a;
	}, kt = function(e) {
		let t = S ? S(e) : e.ownerDocument;
		return ce.call(t || e, e, c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION, null);
	}, At = function(e) {
		return e = Dh(e, fe, " "), e = Dh(e, pe, " "), e = Dh(e, me, " "), e;
	}, jt = function(e) {
		e.normalize();
		let t = S ? S(e) : e.ownerDocument, n = ce.call(t || e, e, c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION, null), r = n.nextNode();
		for (; r;) r.data = At(r.data), r = n.nextNode();
		let i = e.querySelectorAll?.call(e, "template");
		i && vh(i, (e) => {
			Nt(e.content) && jt(e.content);
		});
	}, Mt = function(e) {
		let t = x ? x(e) : null;
		return typeof t != "string" || dt(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== y(e) || typeof e.removeAttribute != "function" || typeof e.removeAttributeNode != "function" || typeof e.getAttributeNode != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== b(e) || e.childNodes !== g(e);
	}, Nt = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return b(e) === _g.documentFragment;
		} catch {
			return !1;
		}
	}, Pt = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return typeof b(e) == "number";
		} catch {
			return !1;
		}
	};
	function Ft(e, n, r) {
		e.length !== 0 && vh(e, (e) => {
			e.call(t, n, r, ft);
		});
	}
	let It = function(e, t) {
		return !!(Ne && e.hasChildNodes() && !Pt(e.firstElementChild) && Ih(pg, e.textContent) && Ih(pg, e.innerHTML) || Ne && e.namespaceURI === $e && yg[t] && (Pt(e.firstElementChild) || typeof e.textContent == "string" && Ih(bg[t], e.textContent)) || e.nodeType === _g.processingInstruction || Ne && e.nodeType === _g.comment && Ih(mg, e.data));
	}, Lt = function(e, t) {
		return e instanceof RegExp ? Ih(e, t) : e instanceof Function && !!e(t, ...[...arguments].slice(2));
	}, Rt = function(e, t, n) {
		if (!Ee[t] && Wt(t) && Lt(Te.tagNameCheck, t)) return !1;
		if (We && !qe[t]) {
			let t = _(e), r = g(e);
			if (r && t) {
				let i = r.length;
				for (let a = i - 1; a >= 0; --a) {
					let i = e === n ? f(r[a], !0) : r[a];
					t.insertBefore(i, h(e));
				}
			}
		}
		return xt(e), !0;
	}, zt = function(e, t, n, r) {
		return e.length === 0 ? t : t === n || t === r ? Hh(t) : t;
	}, Bt = function(e, t) {
		return e === t || _(e) !== null ? !1 : (Ge && Et(e), !0);
	}, Vt = function(e, n) {
		if (Ft(O.beforeSanitizeElements, e, null), Bt(e, n)) return !0;
		if (Mt(e)) return xt(e), !0;
		let r = dt(te(e));
		if (xe = zt(O.uponSanitizeElement, xe, Se, Fe), Ft(O.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: xe
		}), Bt(e, n)) return !0;
		if (It(e, r)) return xt(e), !0;
		if (Ee[r] || !(Oe.tagCheck instanceof Function && Oe.tagCheck(r)) && !xe[r]) {
			let t = Rt(e, r, n);
			return t === !1 && (Ft(O.afterSanitizeElements, e, null), Bt(e, n)) ? !0 : t;
		}
		if (ee(e) === _g.element && !bt(e) || (r === "noscript" || r === "noembed" || r === "noframes") && Ih(hg, e.innerHTML)) return xt(e), !0;
		if (Me && e.nodeType === _g.text) {
			let n = At(e.textContent);
			e.textContent !== n && (xh(t.removed, { element: e.cloneNode() }), e.textContent = n);
		}
		return Ft(O.afterSanitizeElements, e, null), Bt(e, n);
	}, Ht = function(e, t, r) {
		if (De[t] || P(t, e) || Ve && (t === "id" || t === "name") && (r in n || r in pt)) return !1;
		let i = Ce[t] || Oe.attributeCheck instanceof Function && Oe.attributeCheck(t, e);
		return k && Ih(he, t) || ke && Ih(ge, t) ? !0 : i ? Ze[t] || Ih(be, Dh(r, ve, "")) || (t === "src" || t === "xlink:href" || t === "href") && e !== "script" && Oh(r, "data:") === 0 && Ye[e] || Ae && !Ih(_e, Dh(r, ve, "")) ? !0 : !r : Wt(e) && Lt(Te.tagNameCheck, e) && Lt(Te.attributeNameCheck, t, e) || t === "is" && Te.allowCustomizedBuiltInElements && Lt(Te.tagNameCheck, r);
	}, Ut = Bh({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), Wt = function(e) {
		return !Ut[wh(e)] && Ih(ye, e);
	}, Gt = function(e, t, n, r) {
		if (C && typeof u == "object" && typeof u.getAttributeType == "function" && !n) switch (u.getAttributeType(e, t)) {
			case "TrustedHTML": return ae(r);
			case "TrustedScriptURL": return E(r);
		}
		return r;
	}, Kt = function(e, t, n, r) {
		try {
			return n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r), !Mt(e) || (xt(e), !1);
		} catch {
			return wt(t, e), !1;
		}
	}, qt = function(e, n) {
		if (Ft(O.beforeSanitizeAttributes, e, null), Bt(e, n)) return;
		let r = e.attributes;
		if (!r || Mt(e)) return;
		Ce = zt(O.uponSanitizeAttribute, Ce, we, Ie);
		let i = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: Ce,
			forceKeepAttr: void 0
		}, a = r.length, o = dt(e.nodeName);
		for (; a--;) {
			let n = r[a], s = n.name, c = n.namespaceURI, l = n.value, u = dt(s), d = l, f = s === "value" ? d : kh(d), p = !1;
			if (i.attrName = u, i.attrValue = f, i.keepAttr = !0, i.forceKeepAttr = void 0, Ft(O.uponSanitizeAttribute, e, i), f = i.attrValue, He && (u === "id" || u === "name") && Oh(f, Ue) !== 0 && (wt(s, e, n), f = Ue + f, p = !0), Ne && Ih(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, f)) {
				wt(s, e, n);
				continue;
			}
			if (u === "attributename" && Eh(f, "href")) {
				wt(s, e, n);
				continue;
			}
			if (!i.forceKeepAttr) {
				if (!i.keepAttr) {
					wt(s, e, n);
					continue;
				}
				if (!je && Ih(gg, f)) {
					wt(s, e, n);
					continue;
				}
				if (Me && (f = At(f)), !Ht(o, u, f)) {
					wt(s, e, n);
					continue;
				}
				f = Gt(o, u, c, f), f !== d && Kt(e, s, c, f) && p && bh(t.removed);
			}
		}
		Ft(O.afterSanitizeAttributes, e, null), Bt(e, n);
	}, F = function(e) {
		let t = null, n = kt(e);
		for (Ft(O.beforeSanitizeShadowDOM, e, null); t = n.nextNode();) if (Ft(O.uponSanitizeShadowNode, t, null), Vt(t, e), qt(t, e), Nt(t.content) && F(t.content), ee(t) === _g.element) {
			let e = v(t);
			Nt(e) && (Jt(e), F(e));
		}
		Ft(O.afterSanitizeShadowDOM, e, null);
	}, Jt = function(e) {
		let t = [{
			node: e,
			shadow: null
		}];
		for (; t.length > 0;) {
			let e = t.pop();
			if (e.shadow) {
				F(e.shadow);
				continue;
			}
			let n = e.node, r = ee(n) === _g.element, i = g(n);
			if (i) for (let e = i.length - 1; e >= 0; --e) t.push({
				node: i[e],
				shadow: null
			});
			if (r) {
				let e = x ? x(n) : null;
				if (typeof e == "string" && dt(e) === "template") {
					let e = n.content;
					Nt(e) && t.push({
						node: e,
						shadow: null
					});
				}
			}
			if (r) {
				let e = v(n);
				Nt(e) && t.push({
					node: null,
					shadow: e
				}, {
					node: e,
					shadow: null
				});
			}
		}
	};
	return t.sanitize = function(e) {
		let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = null, a = null, o = null, s = null;
		if (tt = !e, tt && (e = "<!-->"), typeof e != "string" && !Pt(e) && (e = Uh(e), typeof e != "string")) throw Lh("dirty is not a string, aborting");
		if (!t.isSupported) return e;
		Pe ? (xe = Fe, Ce = Ie) : ht(n), (O.uponSanitizeElement.length > 0 || O.uponSanitizeAttribute.length > 0) && (xe = Hh(xe)), O.uponSanitizeAttribute.length > 0 && (Ce = Hh(Ce)), t.removed = [];
		let c = Ge && typeof e != "string" && Pt(e);
		if (c) {
			Dt(e);
			let t = te(e);
			if (typeof t == "string") {
				let n = dt(t);
				if (!xe[n] || Ee[n]) throw Ct(e), Lh("root node is forbidden and cannot be sanitized in-place");
			}
			if (Mt(e)) throw Ct(e), Lh("root node is clobbered and cannot be sanitized in-place");
			try {
				Jt(e);
			} catch (t) {
				throw Ct(e), t;
			}
		} else if (Pt(e)) i = Ot("<!---->"), a = i.ownerDocument.importNode(e, !0), a.nodeType === _g.element && a.nodeName === "BODY" || a.nodeName === "HTML" ? i = a : i.appendChild(a), Jt(i);
		else {
			if (!Re && !Me && !A && e.indexOf("<") === -1) return C && Be ? ae(e) : e;
			if (i = Ot(e), !i) return Re ? null : Be ? w : "";
		}
		i && Le && xt(i.firstChild);
		let l = c ? e : i;
		try {
			let e = kt(l);
			for (; o = e.nextNode();) Vt(o, l), qt(o, l), Nt(o.content) && F(o.content);
		} catch (n) {
			throw c && (Ct(e), vh(t.removed, (e) => {
				e.element && Et(e.element);
			})), n;
		}
		if (c) {
			let n = !1;
			if (vh(t.removed, (t) => {
				t.element && (t.element === e && (n = !0), Et(t.element));
			}), n) throw Lh("a node selected for removal could not be safely returned; refusing to sanitize in place");
			return Me && jt(e), e;
		}
		if (Re) {
			if (Me && jt(i), ze) for (s = le.call(i.ownerDocument); i.firstChild;) s.appendChild(i.firstChild);
			else s = i;
			return (Ce.shadowroot || Ce.shadowrootmode) && (s = de.call(r, s, !0)), s;
		}
		let u = A ? i.outerHTML : i.innerHTML;
		return A && xe["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && Ih(dg, i.ownerDocument.doctype.name) && (u = "<!DOCTYPE " + i.ownerDocument.doctype.name + ">\n" + u), Me && (u = At(u)), C && Be ? ae(u) : u;
	}, t.setConfig = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		ht(e), Pe = !0, Fe = xe, Ie = Ce;
	}, t.clearConfig = function() {
		ft = null, Pe = !1, Fe = null, Ie = null, C = ne, w = "";
	}, t.isValidAttribute = function(e, t, n) {
		ft || ht({});
		let r = dt(e), i = dt(t);
		return Ht(r, i, n);
	}, t.addHook = function(e, t) {
		typeof t == "function" && Ph(O, e) && xh(O[e], t);
	}, t.removeHook = function(e, t) {
		if (Ph(O, e)) {
			if (t !== void 0) {
				let n = yh(O[e], t);
				return n === -1 ? void 0 : Sh(O[e], n, 1)[0];
			}
			return bh(O[e]);
		}
	}, t.removeHooks = function(e) {
		Ph(O, e) && (O[e] = []);
	}, t.removeAllHooks = function() {
		O = Cg();
	}, t;
}
var Dg = Eg(), Og = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return e instanceof Map ? e.clear = e.delete = e.set = function() {
			throw Error("map is read-only");
		} : e instanceof Set && (e.add = e.clear = e.delete = function() {
			throw Error("set is read-only");
		}), Object.freeze(e), Object.getOwnPropertyNames(e).forEach((t) => {
			let r = e[t], i = typeof r;
			(i === "object" || i === "function") && !Object.isFrozen(r) && n(r);
		}), e;
	}
	var r = class {
		constructor(e) {
			e.data === void 0 && (e.data = {}), this.data = e.data, this.isMatchIgnored = !1;
		}
		ignoreMatch() {
			this.isMatchIgnored = !0;
		}
	};
	function i(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
	}
	function a(e, ...t) {
		let n = Object.create(null);
		for (let t in e) n[t] = e[t];
		return t.forEach(function(e) {
			for (let t in e) n[t] = e[t];
		}), n;
	}
	var o = "</span>", s = (e) => !!e.scope, c = (e, { prefix: t }) => {
		if (e.startsWith("language:")) return e.replace("language:", "language-");
		if (e.includes(".")) {
			let n = e.split(".");
			return [`${t}${n.shift()}`, ...n.map((e, t) => `${e}${"_".repeat(t + 1)}`)].join(" ");
		}
		return `${t}${e}`;
	}, l = class {
		constructor(e, t) {
			this.buffer = "", this.classPrefix = t.classPrefix, e.walk(this);
		}
		addText(e) {
			this.buffer += i(e);
		}
		openNode(e) {
			if (!s(e)) return;
			let t = c(e.scope, { prefix: this.classPrefix });
			this.span(t);
		}
		closeNode(e) {
			s(e) && (this.buffer += o);
		}
		value() {
			return this.buffer;
		}
		span(e) {
			this.buffer += `<span class="${e}">`;
		}
	}, u = (e = {}) => {
		let t = { children: [] };
		return Object.assign(t, e), t;
	}, d = class e {
		constructor() {
			this.rootNode = u(), this.stack = [this.rootNode];
		}
		get top() {
			return this.stack[this.stack.length - 1];
		}
		get root() {
			return this.rootNode;
		}
		add(e) {
			this.top.children.push(e);
		}
		openNode(e) {
			let t = u({ scope: e });
			this.add(t), this.stack.push(t);
		}
		closeNode() {
			if (this.stack.length > 1) return this.stack.pop();
		}
		closeAllNodes() {
			for (; this.closeNode(););
		}
		toJSON() {
			return JSON.stringify(this.rootNode, null, 4);
		}
		walk(e) {
			return this.constructor._walk(e, this.rootNode);
		}
		static _walk(e, t) {
			return typeof t == "string" ? e.addText(t) : t.children && (e.openNode(t), t.children.forEach((t) => this._walk(e, t)), e.closeNode(t)), e;
		}
		static _collapse(t) {
			typeof t != "string" && t.children && (t.children.every((e) => typeof e == "string") ? t.children = [t.children.join("")] : t.children.forEach((t) => {
				e._collapse(t);
			}));
		}
	}, f = class extends d {
		constructor(e) {
			super(), this.options = e;
		}
		addText(e) {
			e !== "" && this.add(e);
		}
		startScope(e) {
			this.openNode(e);
		}
		endScope() {
			this.closeNode();
		}
		__addSublanguage(e, t) {
			let n = e.root;
			t && (n.scope = `language:${t}`), this.add(n);
		}
		toHTML() {
			return new l(this, this.options).value();
		}
		finalize() {
			return this.closeAllNodes(), !0;
		}
	};
	function p(e) {
		return e ? typeof e == "string" ? e : e.source : null;
	}
	function m(e) {
		return _("(?=", e, ")");
	}
	function h(e) {
		return _("(?:", e, ")*");
	}
	function g(e) {
		return _("(?:", e, ")?");
	}
	function _(...e) {
		return e.map((e) => p(e)).join("");
	}
	function v(e) {
		let t = e[e.length - 1];
		return typeof t == "object" && t.constructor === Object ? (e.splice(e.length - 1, 1), t) : {};
	}
	function y(...e) {
		return "(" + (v(e).capture ? "" : "?:") + e.map((e) => p(e)).join("|") + ")";
	}
	function b(e) {
		return RegExp(e.toString() + "|").exec("").length - 1;
	}
	function x(e, t) {
		let n = e && e.exec(t);
		return n && n.index === 0;
	}
	var S = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
	function ee(e, { joinWith: t }) {
		let n = 0;
		return e.map((e) => {
			n += 1;
			let t = n, r = p(e), i = "";
			for (; r.length > 0;) {
				let e = S.exec(r);
				if (!e) {
					i += r;
					break;
				}
				i += r.substring(0, e.index), r = r.substring(e.index + e[0].length), e[0][0] === "\\" && e[1] ? i += "\\" + String(Number(e[1]) + t) : (i += e[0], e[0] === "(" && n++);
			}
			return i;
		}).map((e) => `(${e})`).join(t);
	}
	var te = /\b\B/, C = "[a-zA-Z]\\w*", w = "[a-zA-Z_]\\w*", ne = "\\b\\d+(\\.\\d+)?", re = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ie = "\\b(0b[01]+)", T = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", ae = (e = {}) => {
		let t = /^#![ ]*\//;
		return e.binary && (e.begin = _(t, /.*\b/, e.binary, /\b.*/)), a({
			scope: "meta",
			begin: t,
			end: /$/,
			relevance: 0,
			"on:begin": (e, t) => {
				e.index !== 0 && t.ignoreMatch();
			}
		}, e);
	}, E = {
		begin: "\\\\[\\s\\S]",
		relevance: 0
	}, oe = {
		scope: "string",
		begin: "'",
		end: "'",
		illegal: "\\n",
		contains: [E]
	}, D = {
		scope: "string",
		begin: "\"",
		end: "\"",
		illegal: "\\n",
		contains: [E]
	}, se = { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, ce = function(e, t, n = {}) {
		let r = a({
			scope: "comment",
			begin: e,
			end: t,
			contains: []
		}, n);
		r.contains.push({
			scope: "doctag",
			begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
			end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
			excludeBegin: !0,
			relevance: 0
		});
		let i = y("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
		return r.contains.push({ begin: _(/[ ]+/, "(", i, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), r;
	}, le = ce("//", "$"), ue = ce("/\\*", "\\*/"), de = ce("#", "$"), O = /*#__PURE__*/ Object.freeze({
		__proto__: null,
		APOS_STRING_MODE: oe,
		BACKSLASH_ESCAPE: E,
		BINARY_NUMBER_MODE: {
			scope: "number",
			begin: ie,
			relevance: 0
		},
		BINARY_NUMBER_RE: ie,
		COMMENT: ce,
		C_BLOCK_COMMENT_MODE: ue,
		C_LINE_COMMENT_MODE: le,
		C_NUMBER_MODE: {
			scope: "number",
			begin: re,
			relevance: 0
		},
		C_NUMBER_RE: re,
		END_SAME_AS_BEGIN: function(e) {
			return Object.assign(e, {
				"on:begin": (e, t) => {
					t.data._beginMatch = e[1];
				},
				"on:end": (e, t) => {
					t.data._beginMatch !== e[1] && t.ignoreMatch();
				}
			});
		},
		HASH_COMMENT_MODE: de,
		IDENT_RE: C,
		MATCH_NOTHING_RE: te,
		METHOD_GUARD: {
			begin: "\\.\\s*[a-zA-Z_]\\w*",
			relevance: 0
		},
		NUMBER_MODE: {
			scope: "number",
			begin: ne,
			relevance: 0
		},
		NUMBER_RE: ne,
		PHRASAL_WORDS_MODE: se,
		QUOTE_STRING_MODE: D,
		REGEXP_MODE: {
			scope: "regexp",
			begin: /\/(?=[^/\n]*\/)/,
			end: /\/[gimuy]*/,
			contains: [E, {
				begin: /\[/,
				end: /\]/,
				relevance: 0,
				contains: [E]
			}]
		},
		RE_STARTERS_RE: T,
		SHEBANG: ae,
		TITLE_MODE: {
			scope: "title",
			begin: C,
			relevance: 0
		},
		UNDERSCORE_IDENT_RE: w,
		UNDERSCORE_TITLE_MODE: {
			scope: "title",
			begin: w,
			relevance: 0
		}
	});
	function fe(e, t) {
		e.input[e.index - 1] === "." && t.ignoreMatch();
	}
	function pe(e, t) {
		e.className !== void 0 && (e.scope = e.className, delete e.className);
	}
	function me(e, t) {
		t && e.beginKeywords && (e.begin = "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e.__beforeBegin = fe, e.keywords = e.keywords || e.beginKeywords, delete e.beginKeywords, e.relevance === void 0 && (e.relevance = 0));
	}
	function he(e, t) {
		Array.isArray(e.illegal) && (e.illegal = y(...e.illegal));
	}
	function ge(e, t) {
		if (e.match) {
			if (e.begin || e.end) throw Error("begin & end are not supported with match");
			e.begin = e.match, delete e.match;
		}
	}
	function _e(e, t) {
		e.relevance === void 0 && (e.relevance = 1);
	}
	var ve = (e, t) => {
		if (!e.beforeMatch) return;
		if (e.starts) throw Error("beforeMatch cannot be used with starts");
		let n = Object.assign({}, e);
		Object.keys(e).forEach((t) => {
			delete e[t];
		}), e.keywords = n.keywords, e.begin = _(n.beforeMatch, m(n.begin)), e.starts = {
			relevance: 0,
			contains: [Object.assign(n, { endsParent: !0 })]
		}, e.relevance = 0, delete n.beforeMatch;
	}, ye = [
		"of",
		"and",
		"for",
		"in",
		"not",
		"or",
		"if",
		"then",
		"parent",
		"list",
		"value"
	], be = "keyword";
	function xe(e, t, n = be) {
		let r = Object.create(null);
		return typeof e == "string" ? i(n, e.split(" ")) : Array.isArray(e) ? i(n, e) : Object.keys(e).forEach(function(n) {
			Object.assign(r, xe(e[n], t, n));
		}), r;
		function i(e, n) {
			t && (n = n.map((e) => e.toLowerCase())), n.forEach(function(t) {
				let n = t.split("|");
				r[n[0]] = [e, Se(n[0], n[1])];
			});
		}
	}
	function Se(e, t) {
		return t ? Number(t) : +!Ce(e);
	}
	function Ce(e) {
		return ye.includes(e.toLowerCase());
	}
	var we = {}, Te = (e) => {
		console.error(e);
	}, Ee = (e, ...t) => {
		console.log(`WARN: ${e}`, ...t);
	}, De = (e, t) => {
		we[`${e}/${t}`] || (console.log(`Deprecated as of ${e}. ${t}`), we[`${e}/${t}`] = !0);
	}, Oe = /* @__PURE__ */ Error();
	function ke(e, t, { key: n }) {
		let r = 0, i = e[n], a = {}, o = {};
		for (let e = 1; e <= t.length; e++) o[e + r] = i[e], a[e + r] = !0, r += b(t[e - 1]);
		e[n] = o, e[n]._emit = a, e[n]._multi = !0;
	}
	function k(e) {
		if (Array.isArray(e.begin)) {
			if (e.skip || e.excludeBegin || e.returnBegin) throw Te("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Oe;
			if (typeof e.beginScope != "object" || e.beginScope === null) throw Te("beginScope must be object"), Oe;
			ke(e, e.begin, { key: "beginScope" }), e.begin = ee(e.begin, { joinWith: "" });
		}
	}
	function Ae(e) {
		if (Array.isArray(e.end)) {
			if (e.skip || e.excludeEnd || e.returnEnd) throw Te("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Oe;
			if (typeof e.endScope != "object" || e.endScope === null) throw Te("endScope must be object"), Oe;
			ke(e, e.end, { key: "endScope" }), e.end = ee(e.end, { joinWith: "" });
		}
	}
	function je(e) {
		e.scope && typeof e.scope == "object" && e.scope !== null && (e.beginScope = e.scope, delete e.scope);
	}
	function Me(e) {
		je(e), typeof e.beginScope == "string" && (e.beginScope = { _wrap: e.beginScope }), typeof e.endScope == "string" && (e.endScope = { _wrap: e.endScope }), k(e), Ae(e);
	}
	function Ne(e) {
		function t(t, n) {
			return new RegExp(p(t), "m" + (e.case_insensitive ? "i" : "") + (e.unicodeRegex ? "u" : "") + (n ? "g" : ""));
		}
		class n {
			constructor() {
				this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
			}
			addRule(e, t) {
				t.position = this.position++, this.matchIndexes[this.matchAt] = t, this.regexes.push([t, e]), this.matchAt += b(e) + 1;
			}
			compile() {
				this.regexes.length === 0 && (this.exec = () => null);
				let e = this.regexes.map((e) => e[1]);
				this.matcherRe = t(ee(e, { joinWith: "|" }), !0), this.lastIndex = 0;
			}
			exec(e) {
				this.matcherRe.lastIndex = this.lastIndex;
				let t = this.matcherRe.exec(e);
				if (!t) return null;
				let n = t.findIndex((e, t) => t > 0 && e !== void 0), r = this.matchIndexes[n];
				return t.splice(0, n), Object.assign(t, r);
			}
		}
		class r {
			constructor() {
				this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
			}
			getMatcher(e) {
				if (this.multiRegexes[e]) return this.multiRegexes[e];
				let t = new n();
				return this.rules.slice(e).forEach(([e, n]) => t.addRule(e, n)), t.compile(), this.multiRegexes[e] = t, t;
			}
			resumingScanAtSamePosition() {
				return this.regexIndex !== 0;
			}
			considerAll() {
				this.regexIndex = 0;
			}
			addRule(e, t) {
				this.rules.push([e, t]), t.type === "begin" && this.count++;
			}
			exec(e) {
				let t = this.getMatcher(this.regexIndex);
				t.lastIndex = this.lastIndex;
				let n = t.exec(e);
				if (this.resumingScanAtSamePosition() && !(n && n.index === this.lastIndex)) {
					let t = this.getMatcher(0);
					t.lastIndex = this.lastIndex + 1, n = t.exec(e);
				}
				return n && (this.regexIndex += n.position + 1, this.regexIndex === this.count && this.considerAll()), n;
			}
		}
		function i(e) {
			let t = new r();
			return e.contains.forEach((e) => t.addRule(e.begin, {
				rule: e,
				type: "begin"
			})), e.terminatorEnd && t.addRule(e.terminatorEnd, { type: "end" }), e.illegal && t.addRule(e.illegal, { type: "illegal" }), t;
		}
		function o(n, r) {
			let a = n;
			if (n.isCompiled) return a;
			[
				pe,
				ge,
				Me,
				ve
			].forEach((e) => e(n, r)), e.compilerExtensions.forEach((e) => e(n, r)), n.__beforeBegin = null, [
				me,
				he,
				_e
			].forEach((e) => e(n, r)), n.isCompiled = !0;
			let s = null;
			return typeof n.keywords == "object" && n.keywords.$pattern && (n.keywords = Object.assign({}, n.keywords), s = n.keywords.$pattern, delete n.keywords.$pattern), s ||= /\w+/, n.keywords &&= xe(n.keywords, e.case_insensitive), a.keywordPatternRe = t(s, !0), r && (n.begin ||= /\B|\b/, a.beginRe = t(a.begin), !n.end && !n.endsWithParent && (n.end = /\B|\b/), n.end && (a.endRe = t(a.end)), a.terminatorEnd = p(a.end) || "", n.endsWithParent && r.terminatorEnd && (a.terminatorEnd += (n.end ? "|" : "") + r.terminatorEnd)), n.illegal && (a.illegalRe = t(n.illegal)), n.contains ||= [], n.contains = [].concat(...n.contains.map(function(e) {
				return Pe(e === "self" ? n : e);
			})), n.contains.forEach(function(e) {
				o(e, a);
			}), n.starts && o(n.starts, r), a.matcher = i(a), a;
		}
		if (e.compilerExtensions ||= [], e.contains && e.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
		return e.classNameAliases = a(e.classNameAliases || {}), o(e);
	}
	function A(e) {
		return e ? e.endsWithParent || A(e.starts) : !1;
	}
	function Pe(e) {
		return e.variants && !e.cachedVariants && (e.cachedVariants = e.variants.map(function(t) {
			return a(e, { variants: null }, t);
		})), e.cachedVariants ? e.cachedVariants : A(e) ? a(e, { starts: e.starts ? a(e.starts) : null }) : Object.isFrozen(e) ? a(e) : e;
	}
	var Fe = "11.11.2", Ie = class extends Error {
		constructor(e, t) {
			super(e), this.name = "HTMLInjectionError", this.html = t;
		}
	}, Le = i, Re = a, ze = Symbol("nomatch"), Be = 7, Ve = function(e) {
		let t = Object.create(null), i = Object.create(null), a = [], o = !0, s = "Could not find the language '{}', did you forget to load/include a language module?", c = {
			disableAutodetect: !0,
			name: "Plain text",
			contains: []
		}, l = {
			ignoreUnescapedHTML: !1,
			throwUnescapedHTML: !1,
			noHighlightRe: /^(no-?highlight)$/i,
			languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
			classPrefix: "hljs-",
			cssSelector: "pre code",
			languages: null,
			__emitter: f
		};
		function u(e) {
			return l.noHighlightRe.test(e);
		}
		function d(e) {
			let t = e.className + " ";
			t += e.parentNode ? e.parentNode.className : "";
			let n = l.languageDetectRe.exec(t);
			if (n) {
				let t = oe(n[1]);
				return t || (Ee(s.replace("{}", n[1])), Ee("Falling back to no-highlight mode for this block.", e)), t ? n[1] : "no-highlight";
			}
			return t.split(/\s+/).find((e) => u(e) || oe(e));
		}
		function p(e, t, n) {
			let r = "", i = "";
			typeof t == "object" ? (r = e, n = t.ignoreIllegals, i = t.language) : (De("10.7.0", "highlight(lang, code, ...args) has been deprecated."), De("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"), i = e, r = t), n === void 0 && (n = !0);
			let a = {
				code: r,
				language: i
			};
			de("before:highlight", a);
			let o = a.result ? a.result : v(a.language, a.code, n);
			return o.code = a.code, de("after:highlight", o), o;
		}
		function v(e, n, i, a) {
			let c = Object.create(null);
			function u(e, t) {
				return e.keywords[t];
			}
			function d() {
				if (!T.keywords) {
					E.addText(D);
					return;
				}
				let e = 0;
				T.keywordPatternRe.lastIndex = 0;
				let t = T.keywordPatternRe.exec(D), n = "";
				for (; t;) {
					n += D.substring(e, t.index);
					let r = ne.case_insensitive ? t[0].toLowerCase() : t[0], i = u(T, r);
					if (i) {
						let [e, a] = i;
						if (E.addText(n), n = "", c[r] = (c[r] || 0) + 1, c[r] <= Be && (se += a), e.startsWith("_")) n += t[0];
						else {
							let n = ne.classNameAliases[e] || e;
							m(t[0], n);
						}
					} else n += t[0];
					e = T.keywordPatternRe.lastIndex, t = T.keywordPatternRe.exec(D);
				}
				n += D.substring(e), E.addText(n);
			}
			function f() {
				if (D === "") return;
				let e = null;
				if (typeof T.subLanguage == "string") {
					if (!t[T.subLanguage]) {
						E.addText(D);
						return;
					}
					e = v(T.subLanguage, D, !0, ae[T.subLanguage]), ae[T.subLanguage] = e._top;
				} else e = S(D, T.subLanguage.length ? T.subLanguage : null);
				T.relevance > 0 && (se += e.relevance), E.__addSublanguage(e._emitter, e.language);
			}
			function p() {
				T.subLanguage == null ? d() : f(), D = "";
			}
			function m(e, t) {
				e !== "" && (E.startScope(t), E.addText(e), E.endScope());
			}
			function h(e, t) {
				let n = 1, r = t.length - 1;
				for (; n <= r;) {
					if (!e._emit[n]) {
						n++;
						continue;
					}
					let r = ne.classNameAliases[e[n]] || e[n], i = t[n];
					r ? m(i, r) : (D = i, d(), D = ""), n++;
				}
			}
			function g(e, t) {
				return e.scope && typeof e.scope == "string" && E.openNode(ne.classNameAliases[e.scope] || e.scope), e.beginScope && (e.beginScope._wrap ? (m(D, ne.classNameAliases[e.beginScope._wrap] || e.beginScope._wrap), D = "") : e.beginScope._multi && (h(e.beginScope, t), D = "")), T = Object.create(e, { parent: { value: T } }), T;
			}
			function _(e, t, n) {
				let i = x(e.endRe, n);
				if (i) {
					if (e["on:end"]) {
						let n = new r(e);
						e["on:end"](t, n), n.isMatchIgnored && (i = !1);
					}
					if (i) {
						for (; e.endsParent && e.parent;) e = e.parent;
						return e;
					}
				}
				if (e.endsWithParent) return _(e.parent, t, n);
			}
			function y(e) {
				return T.matcher.regexIndex === 0 ? (D += e[0], 1) : (ue = !0, 0);
			}
			function b(e) {
				let t = e[0], n = e.rule, i = new r(n), a = [n.__beforeBegin, n["on:begin"]];
				for (let n of a) if (n && (n(e, i), i.isMatchIgnored)) return y(t);
				return n.skip ? D += t : (n.excludeBegin && (D += t), p(), !n.returnBegin && !n.excludeBegin && (D = t)), g(n, e), n.returnBegin ? 0 : t.length;
			}
			function ee(e) {
				let t = e[0], r = n.substring(e.index), i = _(T, e, r);
				if (!i) return ze;
				let a = T;
				T.endScope && T.endScope._wrap ? (p(), m(t, T.endScope._wrap)) : T.endScope && T.endScope._multi ? (p(), h(T.endScope, e)) : a.skip ? D += t : (a.returnEnd || a.excludeEnd || (D += t), p(), a.excludeEnd && (D = t));
				do
					T.scope && E.closeNode(), !T.skip && !T.subLanguage && (se += T.relevance), T = T.parent;
				while (T !== i.parent);
				return i.starts && g(i.starts, e), a.returnEnd ? 0 : t.length;
			}
			function te() {
				let e = [];
				for (let t = T; t !== ne; t = t.parent) t.scope && e.unshift(t.scope);
				e.forEach((e) => E.openNode(e));
			}
			let C = {};
			function w(t, r) {
				let a = r && r[0];
				if (D += t, a == null) return p(), 0;
				if (C.type === "begin" && r.type === "end" && C.index === r.index && a === "") {
					if (D += n.slice(r.index, r.index + 1), !o) {
						let t = /* @__PURE__ */ Error(`0 width match regex (${e})`);
						throw t.languageName = e, t.badRule = C.rule, t;
					}
					return 1;
				}
				if (C = r, r.type === "begin") return b(r);
				if (r.type === "illegal" && !i) {
					let e = /* @__PURE__ */ Error("Illegal lexeme \"" + a + "\" for mode \"" + (T.scope || "<unnamed>") + "\"");
					throw e.mode = T, e;
				}
				if (r.type === "end") {
					let e = ee(r);
					if (e !== ze) return e;
				}
				if (r.type === "illegal" && a === "") return r.index === n.length || (D += "\n"), 1;
				if (le > 1e5 && le > r.index * 3) throw /* @__PURE__ */ Error("potential infinite loop, way more iterations than matches");
				return D += a, a.length;
			}
			let ne = oe(e);
			if (!ne) throw Te(s.replace("{}", e)), Error("Unknown language: \"" + e + "\"");
			let re = Ne(ne), ie = "", T = a || re, ae = {}, E = new l.__emitter(l);
			te();
			let D = "", se = 0, ce = 0, le = 0, ue = !1;
			try {
				if (ne.__emitTokens) ne.__emitTokens(n, E);
				else {
					for (T.matcher.considerAll();;) {
						le++, ue ? ue = !1 : T.matcher.considerAll(), T.matcher.lastIndex = ce;
						let e = T.matcher.exec(n);
						if (!e) break;
						let t = w(n.substring(ce, e.index), e);
						ce = e.index + t;
					}
					w(n.substring(ce));
				}
				return E.finalize(), ie = E.toHTML(), {
					language: e,
					value: ie,
					relevance: se,
					illegal: !1,
					_emitter: E,
					_top: T
				};
			} catch (t) {
				if (t.message && t.message.includes("Illegal")) return {
					language: e,
					value: Le(n),
					illegal: !0,
					relevance: 0,
					_illegalBy: {
						message: t.message,
						index: ce,
						context: n.slice(ce - 100, ce + 100),
						mode: t.mode,
						resultSoFar: ie
					},
					_emitter: E
				};
				if (o) return {
					language: e,
					value: Le(n),
					illegal: !1,
					relevance: 0,
					errorRaised: t,
					_emitter: E,
					_top: T
				};
				throw t;
			}
		}
		function b(e) {
			let t = {
				value: Le(e),
				illegal: !1,
				relevance: 0,
				_top: c,
				_emitter: new l.__emitter(l)
			};
			return t._emitter.addText(e), t;
		}
		function S(e, n) {
			n = n || l.languages || Object.keys(t);
			let r = b(e), i = n.filter(oe).filter(se).map((t) => v(t, e, !1));
			i.unshift(r);
			let [a, o] = i.sort((e, t) => {
				if (e.relevance !== t.relevance) return t.relevance - e.relevance;
				if (e.language && t.language) {
					if (oe(e.language).supersetOf === t.language) return 1;
					if (oe(t.language).supersetOf === e.language) return -1;
				}
				return 0;
			}), s = a;
			return s.secondBest = o, s;
		}
		function ee(e, t, n) {
			let r = t && i[t] || n;
			e.classList.add("hljs"), e.classList.add(`language-${r}`);
		}
		function te(e) {
			let t = null, n = d(e);
			if (u(n)) return;
			if (de("before:highlightElement", {
				el: e,
				language: n
			}), e.dataset.highlighted) {
				console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", e);
				return;
			}
			if (e.children.length > 0 && (l.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(e)), l.throwUnescapedHTML)) throw new Ie("One of your code blocks includes unescaped HTML.", e.innerHTML);
			t = e;
			let r = t.textContent, i = n ? p(r, {
				language: n,
				ignoreIllegals: !0
			}) : S(r);
			e.innerHTML = i.value, e.dataset.highlighted = "yes", ee(e, n, i.language), e.result = {
				language: i.language,
				re: i.relevance,
				relevance: i.relevance
			}, i.secondBest && (e.secondBest = {
				language: i.secondBest.language,
				relevance: i.secondBest.relevance
			}), de("after:highlightElement", {
				el: e,
				result: i,
				text: r
			});
		}
		function C(e) {
			l = Re(l, e);
		}
		let w = () => {
			ie(), De("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
		};
		function ne() {
			ie(), De("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
		}
		let re = !1;
		function ie() {
			function e() {
				ie();
			}
			if (document.readyState === "loading") {
				re || window.addEventListener("DOMContentLoaded", e, !1), re = !0;
				return;
			}
			document.querySelectorAll(l.cssSelector).forEach(te);
		}
		function T(n, r) {
			let i = null;
			try {
				i = r(e);
			} catch (e) {
				if (Te("Language definition for '{}' could not be registered.".replace("{}", n)), o) Te(e);
				else throw e;
				i = c;
			}
			i.name || (i.name = n), t[n] = i, i.rawDefinition = r.bind(null, e), i.aliases && D(i.aliases, { languageName: n });
		}
		function ae(e) {
			delete t[e];
			for (let t of Object.keys(i)) i[t] === e && delete i[t];
		}
		function E() {
			return Object.keys(t);
		}
		function oe(e) {
			return e = (e || "").toLowerCase(), t[e] || t[i[e]];
		}
		function D(e, { languageName: t }) {
			typeof e == "string" && (e = [e]), e.forEach((e) => {
				i[e.toLowerCase()] = t;
			});
		}
		function se(e) {
			let t = oe(e);
			return t && !t.disableAutodetect;
		}
		function ce(e) {
			e["before:highlightBlock"] && !e["before:highlightElement"] && (e["before:highlightElement"] = (t) => {
				e["before:highlightBlock"](Object.assign({ block: t.el }, t));
			}), e["after:highlightBlock"] && !e["after:highlightElement"] && (e["after:highlightElement"] = (t) => {
				e["after:highlightBlock"](Object.assign({ block: t.el }, t));
			});
		}
		function le(e) {
			ce(e), a.push(e);
		}
		function ue(e) {
			let t = a.indexOf(e);
			t !== -1 && a.splice(t, 1);
		}
		function de(e, t) {
			let n = e;
			a.forEach(function(e) {
				e[n] && e[n](t);
			});
		}
		function fe(e) {
			return De("10.7.0", "highlightBlock will be removed entirely in v12.0"), De("10.7.0", "Please use highlightElement now."), te(e);
		}
		Object.assign(e, {
			highlight: p,
			highlightAuto: S,
			highlightAll: ie,
			highlightElement: te,
			highlightBlock: fe,
			configure: C,
			initHighlighting: w,
			initHighlightingOnLoad: ne,
			registerLanguage: T,
			unregisterLanguage: ae,
			listLanguages: E,
			getLanguage: oe,
			registerAliases: D,
			autoDetection: se,
			inherit: Re,
			addPlugin: le,
			removePlugin: ue
		}), e.debugMode = function() {
			o = !1;
		}, e.safeMode = function() {
			o = !0;
		}, e.versionString = Fe, e.regex = {
			concat: _,
			lookahead: m,
			either: y,
			optional: g,
			anyNumberOfTimes: h
		};
		for (let e in O) typeof O[e] == "object" && n(O[e]);
		return Object.assign(e, O), e;
	}, He = Ve({});
	He.newInstance = () => Ve({}), t.exports = He, He.HighlightJS = He, He.default = He;
})), kg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = t.concat(/[\p{L}_]/u, t.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), r = /[\p{L}0-9._:-]+/u, i = {
			className: "symbol",
			begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
		}, a = {
			begin: /\s/,
			contains: [{
				className: "keyword",
				begin: /#?[a-z_][a-z1-9_-]+/,
				illegal: /\n/
			}]
		}, o = e.inherit(a, {
			begin: /\(/,
			end: /\)/
		}), s = e.inherit(e.APOS_STRING_MODE, { className: "string" }), c = e.inherit(e.QUOTE_STRING_MODE, { className: "string" }), l = {
			endsWithParent: !0,
			illegal: /</,
			relevance: 0,
			contains: [{
				className: "attr",
				begin: r,
				relevance: 0
			}, {
				begin: /=\s*/,
				relevance: 0,
				contains: [{
					className: "string",
					endsParent: !0,
					variants: [
						{
							begin: /"/,
							end: /"/,
							contains: [i]
						},
						{
							begin: /'/,
							end: /'/,
							contains: [i]
						},
						{ begin: /[^\s"'=<>`]+/ }
					]
				}]
			}]
		};
		return {
			name: "HTML, XML",
			aliases: [
				"html",
				"xhtml",
				"rss",
				"atom",
				"xjb",
				"xsd",
				"xsl",
				"plist",
				"wsf",
				"svg"
			],
			case_insensitive: !0,
			unicodeRegex: !0,
			contains: [
				{
					className: "meta",
					begin: /<![a-z]/,
					end: />/,
					relevance: 10,
					contains: [
						a,
						c,
						s,
						o,
						{
							begin: /\[/,
							end: /\]/,
							contains: [{
								className: "meta",
								begin: /<![a-z]/,
								end: />/,
								contains: [
									a,
									o,
									c,
									s
								]
							}]
						}
					]
				},
				e.COMMENT(/<!--/, /-->/, { relevance: 10 }),
				{
					begin: /<!\[CDATA\[/,
					end: /\]\]>/,
					relevance: 10
				},
				i,
				{
					className: "meta",
					end: /\?>/,
					variants: [{
						begin: /<\?xml/,
						relevance: 10,
						contains: [c]
					}, { begin: /<\?[a-z][a-z0-9]+/ }]
				},
				{
					className: "tag",
					begin: /<style(?=\s|>)/,
					end: />/,
					keywords: { name: "style" },
					contains: [l],
					starts: {
						end: /<\/style>/,
						returnEnd: !0,
						subLanguage: ["css", "xml"]
					}
				},
				{
					className: "tag",
					begin: /<script(?=\s|>)/,
					end: />/,
					keywords: { name: "script" },
					contains: [l],
					starts: {
						end: /<\/script>/,
						returnEnd: !0,
						subLanguage: [
							"javascript",
							"handlebars",
							"xml"
						]
					}
				},
				{
					className: "tag",
					begin: /<>|<\/>/
				},
				{
					className: "tag",
					begin: t.concat(/</, t.lookahead(t.concat(n, t.either(/\/>/, />/, /\s/)))),
					end: /\/?>/,
					contains: [{
						className: "name",
						begin: n,
						relevance: 0,
						starts: l
					}]
				},
				{
					className: "tag",
					begin: t.concat(/<\//, t.lookahead(t.concat(n, />/))),
					contains: [{
						className: "name",
						begin: n,
						relevance: 0
					}, {
						begin: />/,
						relevance: 0,
						endsParent: !0
					}]
				}
			]
		};
	}
	t.exports = n;
})), Ag = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = {}, r = {
			begin: /\$\{/,
			end: /\}/,
			contains: ["self", {
				begin: /:-/,
				contains: [n]
			}]
		};
		Object.assign(n, {
			className: "variable",
			variants: [{ begin: t.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])") }, r]
		});
		let i = {
			className: "subst",
			begin: /\$\(/,
			end: /\)/,
			contains: [e.BACKSLASH_ESCAPE]
		}, a = e.inherit(e.COMMENT(), {
			match: [/(^|\s)/, /#.*$/],
			scope: { 2: "comment" }
		}), o = {
			begin: /<<-?\s*(?=\w+)/,
			starts: { contains: [e.END_SAME_AS_BEGIN({
				begin: /(\w+)/,
				end: /(\w+)/,
				className: "string"
			})] }
		}, s = {
			className: "string",
			begin: /"/,
			end: /"/,
			contains: [
				e.BACKSLASH_ESCAPE,
				n,
				i
			]
		};
		i.contains.push(s);
		let c = { match: /\\"/ }, l = {
			className: "string",
			begin: /'/,
			end: /'/
		}, u = { match: /\\'/ }, d = {
			begin: /\$?\(\(/,
			end: /\)\)/,
			contains: [
				{
					begin: /\d+#[0-9a-f]+/,
					className: "number"
				},
				e.NUMBER_MODE,
				n
			]
		}, f = e.SHEBANG({
			binary: `(${[
				"fish",
				"bash",
				"zsh",
				"sh",
				"csh",
				"ksh",
				"tcsh",
				"dash",
				"scsh"
			].join("|")})`,
			relevance: 10
		}), p = {
			className: "function",
			begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
			returnBegin: !0,
			contains: [e.inherit(e.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
			relevance: 0
		}, m = [
			"if",
			"then",
			"else",
			"elif",
			"fi",
			"time",
			"for",
			"while",
			"until",
			"in",
			"do",
			"done",
			"case",
			"esac",
			"coproc",
			"function",
			"select"
		], h = ["true", "false"], g = { match: /(\/[a-z._-]+)+/ }, _ = [
			"break",
			"cd",
			"continue",
			"eval",
			"exec",
			"exit",
			"export",
			"getopts",
			"hash",
			"pwd",
			"readonly",
			"return",
			"shift",
			"test",
			"times",
			"trap",
			"umask",
			"unset"
		], v = [
			"alias",
			"bind",
			"builtin",
			"caller",
			"command",
			"declare",
			"echo",
			"enable",
			"help",
			"let",
			"local",
			"logout",
			"mapfile",
			"printf",
			"read",
			"readarray",
			"source",
			"sudo",
			"type",
			"typeset",
			"ulimit",
			"unalias"
		], y = /* @__PURE__ */ "autoload.bg.bindkey.bye.cap.chdir.clone.comparguments.compcall.compctl.compdescribe.compfiles.compgroups.compquote.comptags.comptry.compvalues.dirs.disable.disown.echotc.echoti.emulate.fc.fg.float.functions.getcap.getln.history.integer.jobs.kill.limit.log.noglob.popd.print.pushd.pushln.rehash.sched.setcap.setopt.stat.suspend.ttyctl.unfunction.unhash.unlimit.unsetopt.vared.wait.whence.where.which.zcompile.zformat.zftp.zle.zmodload.zparseopts.zprof.zpty.zregexparse.zsocket.zstyle.ztcp".split("."), b = /* @__PURE__ */ "chcon.chgrp.chown.chmod.cp.dd.df.dir.dircolors.ln.ls.mkdir.mkfifo.mknod.mktemp.mv.realpath.rm.rmdir.shred.sync.touch.truncate.vdir.b2sum.base32.base64.cat.cksum.comm.csplit.cut.expand.fmt.fold.head.join.md5sum.nl.numfmt.od.paste.ptx.pr.sha1sum.sha224sum.sha256sum.sha384sum.sha512sum.shuf.sort.split.sum.tac.tail.tr.tsort.unexpand.uniq.wc.arch.basename.chroot.date.dirname.du.echo.env.expr.factor.groups.hostid.id.link.logname.nice.nohup.nproc.pathchk.pinky.printenv.printf.pwd.readlink.runcon.seq.sleep.stat.stdbuf.stty.tee.test.timeout.tty.uname.unlink.uptime.users.who.whoami.yes".split(".");
		return {
			name: "Bash",
			aliases: ["sh", "zsh"],
			keywords: {
				$pattern: /\b[a-z][a-z0-9._-]+\b/,
				keyword: m,
				literal: h,
				built_in: [
					..._,
					...v,
					"set",
					"shopt",
					...y,
					...b
				]
			},
			contains: [
				f,
				e.SHEBANG(),
				p,
				d,
				a,
				o,
				g,
				s,
				c,
				l,
				u,
				n
			]
		};
	}
	t.exports = n;
})), jg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = e.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] }), r = "[a-zA-Z_]\\w*::", i = "(decltype\\(auto\\)|" + t.optional(r) + "[a-zA-Z_]\\w*" + t.optional("<[^<>]+>") + ")", a = {
			className: "type",
			variants: [{ begin: "\\b[a-z\\d_]*_t\\b" }, { match: /\batomic_[a-z]{3,6}\b/ }]
		}, o = {
			className: "string",
			variants: [
				{
					begin: "(u8?|U|L)?\"",
					end: "\"",
					illegal: "\\n",
					contains: [e.BACKSLASH_ESCAPE]
				},
				{
					begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
					end: "'",
					illegal: "."
				},
				e.END_SAME_AS_BEGIN({
					begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
					end: /\)([^()\\ ]{0,16})"/
				})
			]
		}, s = {
			className: "number",
			variants: [
				{ match: /\b(0b[01']+)/ },
				{ match: /(-?)\b([\d']+(\.[\d']*)?|\.[\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)/ },
				{ match: /(-?)\b(0[xX][a-fA-F0-9]+(?:'[a-fA-F0-9]+)*(?:\.[a-fA-F0-9]*(?:'[a-fA-F0-9]*)*)?(?:[pP][-+]?[0-9]+)?(l|L)?(u|U)?)/ },
				{ match: /(-?)\b\d+(?:'\d+)*(?:\.\d*(?:'\d*)*)?(?:[eE][-+]?\d+)?/ }
			],
			relevance: 0
		}, c = {
			className: "meta",
			begin: /#\s*[a-z]+\b/,
			end: /$/,
			keywords: { keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef elifdef elifndef include" },
			contains: [
				{
					begin: /\\\n/,
					relevance: 0
				},
				e.inherit(o, { className: "string" }),
				{
					className: "string",
					begin: /<.*?>/
				},
				n,
				e.C_BLOCK_COMMENT_MODE
			]
		}, l = {
			className: "title",
			begin: t.optional(r) + e.IDENT_RE,
			relevance: 0
		}, u = t.optional(r) + e.IDENT_RE + "\\s*\\(", d = {
			keyword: /* @__PURE__ */ "asm.auto.break.case.continue.default.do.else.enum.extern.for.fortran.goto.if.inline.register.restrict.return.sizeof.typeof.typeof_unqual.struct.switch.typedef.union.volatile.while._Alignas._Alignof._Atomic._Generic._Noreturn._Static_assert._Thread_local.alignas.alignof.noreturn.static_assert.thread_local._Pragma".split("."),
			type: /* @__PURE__ */ "float.double.signed.unsigned.int.short.long.char.void._Bool._BitInt._Complex._Imaginary._Decimal32._Decimal64._Decimal96._Decimal128._Decimal64x._Decimal128x._Float16._Float32._Float64._Float128._Float32x._Float64x._Float128x.const.static.constexpr.complex.bool.imaginary".split("."),
			literal: "true false NULL",
			built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"
		}, f = [
			c,
			a,
			n,
			e.C_BLOCK_COMMENT_MODE,
			s,
			o
		], p = {
			variants: [
				{
					begin: /=/,
					end: /;/
				},
				{
					begin: /\(/,
					end: /\)/
				},
				{
					beginKeywords: "new throw return else",
					end: /;/
				}
			],
			keywords: d,
			contains: f.concat([{
				begin: /\(/,
				end: /\)/,
				keywords: d,
				contains: f.concat(["self"]),
				relevance: 0
			}]),
			relevance: 0
		}, m = {
			begin: "(" + i + "[\\*&\\s]+)+" + u,
			returnBegin: !0,
			end: /[{;=]/,
			excludeEnd: !0,
			keywords: d,
			illegal: /[^\w\s\*&:<>.]/,
			contains: [
				{
					begin: "decltype\\(auto\\)",
					keywords: d,
					relevance: 0
				},
				{
					begin: u,
					returnBegin: !0,
					contains: [e.inherit(l, { className: "title.function" })],
					relevance: 0
				},
				{
					relevance: 0,
					match: /,/
				},
				{
					className: "params",
					begin: /\(/,
					end: /\)/,
					keywords: d,
					relevance: 0,
					contains: [
						n,
						e.C_BLOCK_COMMENT_MODE,
						o,
						s,
						a,
						{
							begin: /\(/,
							end: /\)/,
							keywords: d,
							relevance: 0,
							contains: [
								"self",
								n,
								e.C_BLOCK_COMMENT_MODE,
								o,
								s,
								a
							]
						}
					]
				},
				a,
				n,
				e.C_BLOCK_COMMENT_MODE,
				c
			]
		};
		return {
			name: "C",
			aliases: ["h"],
			keywords: d,
			disableAutodetect: !0,
			illegal: "</",
			contains: [].concat(p, m, f, [
				c,
				{
					begin: e.IDENT_RE + "::",
					keywords: d
				},
				{
					className: "class",
					beginKeywords: "enum class struct union",
					end: /[{;:<>=]/,
					contains: [{ beginKeywords: "final class struct" }, e.TITLE_MODE]
				}
			]),
			exports: {
				preprocessor: c,
				strings: o,
				keywords: d
			}
		};
	}
	t.exports = n;
})), Mg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = e.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] }), r = "[a-zA-Z_]\\w*::", i = "(?!struct)(decltype\\(auto\\)|" + t.optional(r) + "[a-zA-Z_]\\w*" + t.optional("<[^<>]+>") + ")", a = {
			className: "type",
			begin: "\\b[a-z\\d_]*_t\\b"
		}, o = {
			className: "string",
			variants: [
				{
					begin: "(u8?|U|L)?\"",
					end: "\"",
					illegal: "\\n",
					contains: [e.BACKSLASH_ESCAPE]
				},
				{
					begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
					end: "'",
					illegal: "."
				},
				e.END_SAME_AS_BEGIN({
					begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
					end: /\)([^()\\ ]{0,16})"/
				})
			]
		}, s = {
			className: "number",
			variants: [{ begin: "[+-]?(?:(?:[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)" }, { begin: "[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)" }],
			relevance: 0
		}, c = {
			className: "meta",
			begin: /#\s*[a-z]+\b/,
			end: /$/,
			keywords: { keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include" },
			contains: [
				{
					begin: /\\\n/,
					relevance: 0
				},
				e.inherit(o, { className: "string" }),
				{
					className: "string",
					begin: /<.*?>/
				},
				n,
				e.C_BLOCK_COMMENT_MODE
			]
		}, l = {
			className: "title",
			begin: t.optional(r) + e.IDENT_RE,
			relevance: 0
		}, u = t.optional(r) + e.IDENT_RE + "\\s*\\(", d = /* @__PURE__ */ "alignas.alignof.and.and_eq.asm.atomic_cancel.atomic_commit.atomic_noexcept.auto.bitand.bitor.break.case.catch.class.co_await.co_return.co_yield.compl.concept.const_cast|10.consteval.constexpr.constinit.continue.decltype.default.delete.do.dynamic_cast|10.else.enum.explicit.export.extern.false.final.for.friend.goto.if.import.inline.module.mutable.namespace.new.noexcept.not.not_eq.nullptr.operator.or.or_eq.override.private.protected.public.reflexpr.register.reinterpret_cast|10.requires.return.sizeof.static_assert.static_cast|10.struct.switch.synchronized.template.this.thread_local.throw.transaction_safe.transaction_safe_dynamic.true.try.typedef.typeid.typename.union.using.virtual.volatile.while.xor.xor_eq".split("."), f = [
			"bool",
			"char",
			"char16_t",
			"char32_t",
			"char8_t",
			"double",
			"float",
			"int",
			"long",
			"short",
			"void",
			"wchar_t",
			"unsigned",
			"signed",
			"const",
			"static"
		], p = /* @__PURE__ */ "any.auto_ptr.barrier.binary_semaphore.bitset.complex.condition_variable.condition_variable_any.counting_semaphore.deque.false_type.flat_map.flat_set.future.imaginary.initializer_list.istringstream.jthread.latch.lock_guard.multimap.multiset.mutex.optional.ostringstream.packaged_task.pair.promise.priority_queue.queue.recursive_mutex.recursive_timed_mutex.scoped_lock.set.shared_future.shared_lock.shared_mutex.shared_timed_mutex.shared_ptr.stack.string_view.stringstream.timed_mutex.thread.true_type.tuple.unique_lock.unique_ptr.unordered_map.unordered_multimap.unordered_multiset.unordered_set.variant.vector.weak_ptr.wstring.wstring_view".split("."), m = /* @__PURE__ */ "abort.abs.acos.apply.as_const.asin.atan.atan2.calloc.ceil.cerr.cin.clog.cos.cosh.cout.declval.endl.exchange.exit.exp.fabs.floor.fmod.forward.fprintf.fputs.free.frexp.fscanf.future.invoke.isalnum.isalpha.iscntrl.isdigit.isgraph.islower.isprint.ispunct.isspace.isupper.isxdigit.labs.launder.ldexp.log.log10.make_pair.make_shared.make_shared_for_overwrite.make_tuple.make_unique.malloc.memchr.memcmp.memcpy.memset.modf.move.pow.printf.putchar.puts.realloc.scanf.sin.sinh.snprintf.sprintf.sqrt.sscanf.std.stderr.stdin.stdout.strcat.strchr.strcmp.strcpy.strcspn.strlen.strncat.strncmp.strncpy.strpbrk.strrchr.strspn.strstr.swap.tan.tanh.terminate.to_underlying.tolower.toupper.vfprintf.visit.vprintf.vsprintf".split("."), h = {
			type: f,
			keyword: d,
			literal: [
				"NULL",
				"false",
				"nullopt",
				"nullptr",
				"true"
			],
			built_in: ["_Pragma"],
			_type_hints: p
		}, g = {
			className: "function.dispatch",
			relevance: 0,
			keywords: { _hint: m },
			begin: t.concat(/\b/, `(?!${d.join("|")})`, e.IDENT_RE, t.lookahead(/(<[^<>]+>|)\s*\(/))
		}, _ = [
			g,
			c,
			a,
			n,
			e.C_BLOCK_COMMENT_MODE,
			s,
			o
		], v = {
			variants: [
				{
					begin: /=/,
					end: /;/
				},
				{
					begin: /\(/,
					end: /\)/
				},
				{
					beginKeywords: "new throw return else",
					end: /;/
				}
			],
			keywords: h,
			contains: _.concat([{
				begin: /\(/,
				end: /\)/,
				keywords: h,
				contains: _.concat(["self"]),
				relevance: 0
			}]),
			relevance: 0
		}, y = {
			className: "function",
			begin: "(" + i + "[\\*&\\s]+)+" + u,
			returnBegin: !0,
			end: /[{;=]/,
			excludeEnd: !0,
			keywords: h,
			illegal: /[^\w\s\*&:<>.]/,
			contains: [
				{
					begin: "decltype\\(auto\\)",
					keywords: h,
					relevance: 0
				},
				{
					begin: u,
					returnBegin: !0,
					contains: [l],
					relevance: 0
				},
				{
					begin: /::/,
					relevance: 0
				},
				{
					begin: /:/,
					endsWithParent: !0,
					contains: [o, s]
				},
				{
					relevance: 0,
					match: /,/
				},
				{
					className: "params",
					begin: /\(/,
					end: /\)/,
					keywords: h,
					relevance: 0,
					contains: [
						n,
						e.C_BLOCK_COMMENT_MODE,
						o,
						s,
						a,
						{
							begin: /\(/,
							end: /\)/,
							keywords: h,
							relevance: 0,
							contains: [
								"self",
								n,
								e.C_BLOCK_COMMENT_MODE,
								o,
								s,
								a
							]
						}
					]
				},
				a,
				n,
				e.C_BLOCK_COMMENT_MODE,
				c
			]
		};
		return {
			name: "C++",
			aliases: [
				"cc",
				"c++",
				"h++",
				"hpp",
				"hh",
				"hxx",
				"cxx"
			],
			keywords: h,
			illegal: "</",
			classNameAliases: { "function.dispatch": "built_in" },
			contains: [].concat(v, y, g, _, [
				c,
				{
					begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)",
					end: ">",
					keywords: h,
					contains: ["self", a]
				},
				{
					begin: e.IDENT_RE + "::",
					keywords: h
				},
				{
					match: [
						/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
						/\s+/,
						/\w+/
					],
					className: {
						1: "keyword",
						3: "title.class"
					}
				}
			])
		};
	}
	t.exports = n;
})), Ng = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = [
			"bool",
			"byte",
			"char",
			"decimal",
			"delegate",
			"double",
			"dynamic",
			"enum",
			"float",
			"int",
			"long",
			"nint",
			"nuint",
			"object",
			"sbyte",
			"short",
			"string",
			"ulong",
			"uint",
			"ushort"
		], n = [
			"public",
			"private",
			"protected",
			"static",
			"internal",
			"protected",
			"abstract",
			"async",
			"extern",
			"override",
			"unsafe",
			"virtual",
			"new",
			"sealed",
			"partial"
		], r = {
			keyword: (/* @__PURE__ */ "abstract.as.base.break.case.catch.class.const.continue.do.else.event.explicit.extern.finally.fixed.for.foreach.goto.if.implicit.in.interface.internal.is.lock.namespace.new.operator.out.override.params.private.protected.public.readonly.record.ref.return.scoped.sealed.sizeof.stackalloc.static.struct.switch.this.throw.try.typeof.unchecked.unsafe.using.virtual.void.volatile.while".split(".")).concat(/* @__PURE__ */ "add.alias.and.ascending.args.async.await.by.descending.dynamic.equals.file.from.get.global.group.init.into.join.let.nameof.not.notnull.on.or.orderby.partial.record.remove.required.scoped.select.set.unmanaged.value|0.var.when.where.with.yield".split(".")),
			built_in: t,
			literal: [
				"default",
				"false",
				"null",
				"true"
			]
		}, i = e.inherit(e.TITLE_MODE, { begin: "[a-zA-Z](\\.?\\w)*" }), a = {
			className: "number",
			variants: [
				{ begin: "\\b(0b[01']+)" },
				{ begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)" },
				{ begin: "(-?)(\\b0[xX][a-fA-F0-9'_]+|(\\b[\\d'_]+(\\.[\\d'_]*)?|\\.[\\d'_]+)([eE][-+]?[\\d'_]+)?)" }
			],
			relevance: 0
		}, o = {
			className: "string",
			begin: /"""("*)(?!")(.|\n)*?"""\1/,
			relevance: 1
		}, s = {
			className: "string",
			begin: "@\"",
			end: "\"",
			contains: [{ begin: "\"\"" }]
		}, c = e.inherit(s, { illegal: /\n/ }), l = {
			className: "subst",
			begin: /\{/,
			end: /\}/,
			keywords: r
		}, u = e.inherit(l, { illegal: /\n/ }), d = {
			className: "string",
			begin: /\$"/,
			end: "\"",
			illegal: /\n/,
			contains: [
				{ begin: /\{\{/ },
				{ begin: /\}\}/ },
				e.BACKSLASH_ESCAPE,
				u
			]
		}, f = {
			className: "string",
			begin: /\$@"/,
			end: "\"",
			contains: [
				{ begin: /\{\{/ },
				{ begin: /\}\}/ },
				{ begin: "\"\"" },
				l
			]
		}, p = e.inherit(f, {
			illegal: /\n/,
			contains: [
				{ begin: /\{\{/ },
				{ begin: /\}\}/ },
				{ begin: "\"\"" },
				u
			]
		});
		l.contains = [
			f,
			d,
			s,
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			a,
			e.C_BLOCK_COMMENT_MODE
		], u.contains = [
			p,
			d,
			c,
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			a,
			e.inherit(e.C_BLOCK_COMMENT_MODE, { illegal: /\n/ })
		];
		let m = { variants: [
			o,
			f,
			d,
			s,
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE
		] }, h = {
			begin: "<",
			end: ">",
			contains: [{ beginKeywords: "in out" }, i]
		}, g = e.IDENT_RE + "(<" + e.IDENT_RE + "(\\s*,\\s*" + e.IDENT_RE + ")*>)?(\\[\\])?", _ = {
			begin: "@" + e.IDENT_RE,
			relevance: 0
		};
		return {
			name: "C#",
			aliases: ["cs", "c#"],
			keywords: r,
			illegal: /::/,
			contains: [
				e.COMMENT("///", "$", {
					returnBegin: !0,
					contains: [{
						className: "doctag",
						variants: [
							{
								begin: "///",
								relevance: 0
							},
							{ begin: "<!--|-->" },
							{
								begin: "</?",
								end: ">"
							}
						]
					}]
				}),
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				{
					className: "meta",
					begin: "#",
					end: "$",
					keywords: { keyword: "if else elif endif define undef warning error line region endregion pragma checksum" }
				},
				m,
				a,
				{
					beginKeywords: "class interface",
					relevance: 0,
					end: /[{;=]/,
					illegal: /[^\s:,]/,
					contains: [
						{ beginKeywords: "where class" },
						i,
						h,
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				{
					beginKeywords: "namespace",
					relevance: 0,
					end: /[{;=]/,
					illegal: /[^\s:]/,
					contains: [
						i,
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				{
					beginKeywords: "record",
					relevance: 0,
					end: /[{;=]/,
					illegal: /[^\s:]/,
					contains: [
						i,
						h,
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				{
					className: "meta",
					begin: "^\\s*\\[(?=[\\w])",
					excludeBegin: !0,
					end: "\\]",
					excludeEnd: !0,
					contains: [{
						className: "string",
						begin: /"/,
						end: /"/
					}]
				},
				{
					beginKeywords: "new return throw await else",
					relevance: 0
				},
				{
					className: "function",
					begin: "(" + g + "\\s+)+" + e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
					returnBegin: !0,
					end: /\s*[{;=]/,
					excludeEnd: !0,
					keywords: r,
					contains: [
						{
							beginKeywords: n.join(" "),
							relevance: 0
						},
						{
							begin: e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
							returnBegin: !0,
							contains: [e.TITLE_MODE, h],
							relevance: 0
						},
						{ match: /\(\)/ },
						{
							className: "params",
							begin: /\(/,
							end: /\)/,
							excludeBegin: !0,
							excludeEnd: !0,
							keywords: r,
							relevance: 0,
							contains: [
								m,
								a,
								e.C_BLOCK_COMMENT_MODE
							]
						},
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				_
			]
		};
	}
	t.exports = n;
})), Pg = /* @__PURE__ */ o(((e, t) => {
	var n = (e) => ({
		IMPORTANT: {
			scope: "meta",
			begin: "!important"
		},
		BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
		HEXCOLOR: {
			scope: "number",
			begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
		},
		UNICODE_RANGE: {
			scope: "number",
			begin: /\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,4}(-[0-9A-Fa-f][0-9A-Fa-f]{0,4})?/
		},
		FUNCTION_DISPATCH: {
			className: "built_in",
			begin: /[\w-]+(?=\()/
		},
		ATTRIBUTE_SELECTOR_MODE: {
			scope: "selector-attr",
			begin: /\[/,
			end: /\]/,
			illegal: "$",
			contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
		},
		CSS_NUMBER_MODE: {
			scope: "number",
			begin: e.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
			relevance: 0
		},
		CSS_VARIABLE: {
			className: "attr",
			begin: /--[A-Za-z_][A-Za-z0-9_-]*/
		}
	}), r = /* @__PURE__ */ "a.abbr.address.article.aside.audio.b.blockquote.body.button.canvas.caption.cite.code.dd.del.details.dfn.div.dl.dt.em.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.hgroup.html.i.iframe.img.input.ins.kbd.label.legend.li.main.mark.menu.nav.object.ol.optgroup.option.p.picture.q.quote.samp.section.select.source.span.strong.summary.sup.table.tbody.td.textarea.tfoot.th.thead.time.tr.ul.var.video".split("."), i = /* @__PURE__ */ "defs.g.marker.mask.pattern.svg.switch.symbol.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feFlood.feGaussianBlur.feImage.feMerge.feMorphology.feOffset.feSpecularLighting.feTile.feTurbulence.linearGradient.radialGradient.stop.circle.ellipse.image.line.path.polygon.polyline.rect.text.use.textPath.tspan.foreignObject.clipPath".split("."), a = [...r, ...i], o = (/* @__PURE__ */ "any-hover.any-pointer.aspect-ratio.color.color-gamut.color-index.device-aspect-ratio.device-height.device-width.display-mode.forced-colors.grid.height.hover.inverted-colors.monochrome.orientation.overflow-block.overflow-inline.pointer.prefers-color-scheme.prefers-contrast.prefers-reduced-motion.prefers-reduced-transparency.resolution.scan.scripting.update.width.min-width.max-width.min-height.max-height".split(".")).sort().reverse(), s = (/* @__PURE__ */ "active.any-link.blank.checked.current.default.defined.dir.disabled.drop.empty.enabled.first.first-child.first-of-type.fullscreen.future.focus.focus-visible.focus-within.has.host.host-context.hover.indeterminate.in-range.invalid.is.lang.last-child.last-of-type.left.link.local-link.not.nth-child.nth-col.nth-last-child.nth-last-col.nth-last-of-type.nth-of-type.only-child.only-of-type.optional.out-of-range.past.placeholder-shown.read-only.read-write.required.right.root.scope.target.target-within.user-invalid.valid.visited.where".split(".")).sort().reverse(), c = [
		"after",
		"backdrop",
		"before",
		"cue",
		"cue-region",
		"first-letter",
		"first-line",
		"grammar-error",
		"marker",
		"part",
		"placeholder",
		"selection",
		"slotted",
		"spelling-error"
	].sort().reverse(), l = (/* @__PURE__ */ "accent-color.align-content.align-items.align-self.alignment-baseline.all.anchor-name.animation.animation-composition.animation-delay.animation-direction.animation-duration.animation-fill-mode.animation-iteration-count.animation-name.animation-play-state.animation-range.animation-range-end.animation-range-start.animation-timeline.animation-timing-function.appearance.aspect-ratio.backdrop-filter.backface-visibility.background.background-attachment.background-blend-mode.background-clip.background-color.background-image.background-origin.background-position.background-position-x.background-position-y.background-repeat.background-size.baseline-shift.block-size.border.border-block.border-block-color.border-block-end.border-block-end-color.border-block-end-style.border-block-end-width.border-block-start.border-block-start-color.border-block-start-style.border-block-start-width.border-block-style.border-block-width.border-bottom.border-bottom-color.border-bottom-left-radius.border-bottom-right-radius.border-bottom-style.border-bottom-width.border-collapse.border-color.border-end-end-radius.border-end-start-radius.border-image.border-image-outset.border-image-repeat.border-image-slice.border-image-source.border-image-width.border-inline.border-inline-color.border-inline-end.border-inline-end-color.border-inline-end-style.border-inline-end-width.border-inline-start.border-inline-start-color.border-inline-start-style.border-inline-start-width.border-inline-style.border-inline-width.border-left.border-left-color.border-left-style.border-left-width.border-radius.border-right.border-right-color.border-right-style.border-right-width.border-spacing.border-start-end-radius.border-start-start-radius.border-style.border-top.border-top-color.border-top-left-radius.border-top-right-radius.border-top-style.border-top-width.border-width.bottom.box-align.box-decoration-break.box-direction.box-flex.box-flex-group.box-lines.box-ordinal-group.box-orient.box-pack.box-shadow.box-sizing.break-after.break-before.break-inside.caption-side.caret-color.clear.clip.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.color-scheme.column-count.column-fill.column-gap.column-rule.column-rule-color.column-rule-style.column-rule-width.column-span.column-width.columns.contain.contain-intrinsic-block-size.contain-intrinsic-height.contain-intrinsic-inline-size.contain-intrinsic-size.contain-intrinsic-width.container.container-name.container-type.content.content-visibility.counter-increment.counter-reset.counter-set.cue.cue-after.cue-before.cursor.cx.cy.direction.display.dominant-baseline.empty-cells.enable-background.field-sizing.fill.fill-opacity.fill-rule.filter.flex.flex-basis.flex-direction.flex-flow.flex-grow.flex-shrink.flex-wrap.float.flood-color.flood-opacity.flow.font.font-display.font-family.font-feature-settings.font-kerning.font-language-override.font-optical-sizing.font-palette.font-size.font-size-adjust.font-smooth.font-smoothing.font-stretch.font-style.font-synthesis.font-synthesis-position.font-synthesis-small-caps.font-synthesis-style.font-synthesis-weight.font-variant.font-variant-alternates.font-variant-caps.font-variant-east-asian.font-variant-emoji.font-variant-ligatures.font-variant-numeric.font-variant-position.font-variation-settings.font-weight.forced-color-adjust.gap.glyph-orientation-horizontal.glyph-orientation-vertical.grid.grid-area.grid-auto-columns.grid-auto-flow.grid-auto-rows.grid-column.grid-column-end.grid-column-start.grid-gap.grid-row.grid-row-end.grid-row-start.grid-template.grid-template-areas.grid-template-columns.grid-template-rows.hanging-punctuation.height.hyphenate-character.hyphenate-limit-chars.hyphens.icon.image-orientation.image-rendering.image-resolution.ime-mode.initial-letter.initial-letter-align.inline-size.inset.inset-area.inset-block.inset-block-end.inset-block-start.inset-inline.inset-inline-end.inset-inline-start.isolation.justify-content.justify-items.justify-self.kerning.left.letter-spacing.lighting-color.line-break.line-height.line-height-step.list-style.list-style-image.list-style-position.list-style-type.margin.margin-block.margin-block-end.margin-block-start.margin-bottom.margin-inline.margin-inline-end.margin-inline-start.margin-left.margin-right.margin-top.margin-trim.marker.marker-end.marker-mid.marker-start.marks.mask.mask-border.mask-border-mode.mask-border-outset.mask-border-repeat.mask-border-slice.mask-border-source.mask-border-width.mask-clip.mask-composite.mask-image.mask-mode.mask-origin.mask-position.mask-repeat.mask-size.mask-type.masonry-auto-flow.math-depth.math-shift.math-style.max-block-size.max-height.max-inline-size.max-width.min-block-size.min-height.min-inline-size.min-width.mix-blend-mode.nav-down.nav-index.nav-left.nav-right.nav-up.none.normal.object-fit.object-position.offset.offset-anchor.offset-distance.offset-path.offset-position.offset-rotate.opacity.order.orphans.outline.outline-color.outline-offset.outline-style.outline-width.overflow.overflow-anchor.overflow-block.overflow-clip-margin.overflow-inline.overflow-wrap.overflow-x.overflow-y.overlay.overscroll-behavior.overscroll-behavior-block.overscroll-behavior-inline.overscroll-behavior-x.overscroll-behavior-y.padding.padding-block.padding-block-end.padding-block-start.padding-bottom.padding-inline.padding-inline-end.padding-inline-start.padding-left.padding-right.padding-top.page.page-break-after.page-break-before.page-break-inside.paint-order.pause.pause-after.pause-before.perspective.perspective-origin.place-content.place-items.place-self.pointer-events.position.position-anchor.position-visibility.print-color-adjust.quotes.r.resize.rest.rest-after.rest-before.right.rotate.row-gap.ruby-align.ruby-position.scale.scroll-behavior.scroll-margin.scroll-margin-block.scroll-margin-block-end.scroll-margin-block-start.scroll-margin-bottom.scroll-margin-inline.scroll-margin-inline-end.scroll-margin-inline-start.scroll-margin-left.scroll-margin-right.scroll-margin-top.scroll-padding.scroll-padding-block.scroll-padding-block-end.scroll-padding-block-start.scroll-padding-bottom.scroll-padding-inline.scroll-padding-inline-end.scroll-padding-inline-start.scroll-padding-left.scroll-padding-right.scroll-padding-top.scroll-snap-align.scroll-snap-stop.scroll-snap-type.scroll-timeline.scroll-timeline-axis.scroll-timeline-name.scrollbar-color.scrollbar-gutter.scrollbar-width.shape-image-threshold.shape-margin.shape-outside.shape-rendering.speak.speak-as.src.stop-color.stop-opacity.stroke.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke-width.tab-size.table-layout.text-align.text-align-all.text-align-last.text-anchor.text-combine-upright.text-decoration.text-decoration-color.text-decoration-line.text-decoration-skip.text-decoration-skip-ink.text-decoration-style.text-decoration-thickness.text-emphasis.text-emphasis-color.text-emphasis-position.text-emphasis-style.text-indent.text-justify.text-orientation.text-overflow.text-rendering.text-shadow.text-size-adjust.text-transform.text-underline-offset.text-underline-position.text-wrap.text-wrap-mode.text-wrap-style.timeline-scope.top.touch-action.transform.transform-box.transform-origin.transform-style.transition.transition-behavior.transition-delay.transition-duration.transition-property.transition-timing-function.translate.unicode-bidi.unicode-range.user-modify.user-select.vector-effect.vertical-align.view-timeline.view-timeline-axis.view-timeline-inset.view-timeline-name.view-transition-name.visibility.voice-balance.voice-duration.voice-family.voice-pitch.voice-range.voice-rate.voice-stress.voice-volume.white-space.white-space-collapse.widows.width.will-change.word-break.word-spacing.word-wrap.writing-mode.x.y.z-index.zoom".split(".")).sort().reverse();
	function u(e) {
		let t = e.regex, r = n(e), i = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ }, u = /@-?\w[\w]*(-\w+)*/, d = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE];
		return {
			name: "CSS",
			case_insensitive: !0,
			illegal: /[=|'\$]/,
			keywords: { keyframePosition: "from to" },
			classNameAliases: { keyframePosition: "selector-tag" },
			contains: [
				r.BLOCK_COMMENT,
				i,
				r.CSS_NUMBER_MODE,
				{
					className: "selector-id",
					begin: /#[A-Za-z0-9_-]+/,
					relevance: 0
				},
				{
					className: "selector-class",
					begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*",
					relevance: 0
				},
				r.ATTRIBUTE_SELECTOR_MODE,
				{
					className: "selector-pseudo",
					variants: [{ begin: ":(" + s.join("|") + ")" }, { begin: ":(:)?(" + c.join("|") + ")" }]
				},
				r.CSS_VARIABLE,
				{
					className: "attribute",
					begin: "\\b(" + l.join("|") + ")\\b"
				},
				{
					begin: /:/,
					end: /[;}{]/,
					contains: [
						r.BLOCK_COMMENT,
						r.HEXCOLOR,
						r.IMPORTANT,
						r.CSS_NUMBER_MODE,
						r.UNICODE_RANGE,
						...d,
						{
							begin: /(url|data-uri)\(/,
							end: /\)/,
							relevance: 0,
							keywords: { built_in: "url data-uri" },
							contains: [...d, {
								className: "string",
								begin: /[^)]/,
								endsWithParent: !0,
								excludeEnd: !0
							}]
						},
						r.FUNCTION_DISPATCH
					]
				},
				{
					begin: t.lookahead(/@/),
					end: "[{;]",
					relevance: 0,
					illegal: /:/,
					contains: [{
						className: "keyword",
						begin: u
					}, {
						begin: /\s/,
						endsWithParent: !0,
						excludeEnd: !0,
						relevance: 0,
						keywords: {
							$pattern: /[a-z-]+/,
							keyword: "and or not only",
							attribute: o.join(" ")
						},
						contains: [
							{
								begin: /[a-z-]+(?=:)/,
								className: "attribute"
							},
							...d,
							r.CSS_NUMBER_MODE
						]
					}]
				},
				{
					className: "selector-tag",
					begin: "\\b(" + a.join("|") + ")\\b"
				}
			]
		};
	}
	t.exports = u;
})), Fg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = {
			begin: /<\/?[A-Za-z_]/,
			end: ">",
			subLanguage: "xml",
			relevance: 0
		}, r = {
			begin: "^[-\\*]{3,}",
			end: "$"
		}, i = {
			className: "code",
			variants: [
				{ begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
				{ begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*" },
				{
					begin: "```",
					end: "```+[ ]*$"
				},
				{
					begin: "~~~",
					end: "~~~+[ ]*$"
				},
				{ begin: "`.+?`" },
				{
					begin: "(?=^( {4}|\\t))",
					contains: [{
						begin: "^( {4}|\\t)",
						end: "(\\n)$"
					}],
					relevance: 0
				}
			]
		}, a = {
			className: "bullet",
			begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
			end: "\\s+",
			excludeEnd: !0
		}, o = {
			begin: /^\[[^\n]+\]:/,
			returnBegin: !0,
			contains: [{
				className: "symbol",
				begin: /\[/,
				end: /\]/,
				excludeBegin: !0,
				excludeEnd: !0
			}, {
				className: "link",
				begin: /:\s*/,
				end: /$/,
				excludeBegin: !0
			}]
		}, s = {
			variants: [
				{
					begin: /\[.+?\]\[.*?\]/,
					relevance: 0
				},
				{
					begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
					relevance: 2
				},
				{
					begin: t.concat(/\[.+?\]\(/, /[A-Za-z][A-Za-z0-9+.-]*/, /:\/\/.*?\)/),
					relevance: 2
				},
				{
					begin: /\[.+?\]\([./?&#].*?\)/,
					relevance: 1
				},
				{
					begin: /\[.*?\]\(.*?\)/,
					relevance: 0
				}
			],
			returnBegin: !0,
			contains: [
				{ match: /\[(?=\])/ },
				{
					className: "string",
					relevance: 0,
					begin: "\\[",
					end: "\\]",
					excludeBegin: !0,
					returnEnd: !0
				},
				{
					className: "link",
					relevance: 0,
					begin: "\\]\\(",
					end: "\\)",
					excludeBegin: !0,
					excludeEnd: !0
				},
				{
					className: "symbol",
					relevance: 0,
					begin: "\\]\\[",
					end: "\\]",
					excludeBegin: !0,
					excludeEnd: !0
				}
			]
		}, c = {
			className: "strong",
			contains: [],
			variants: [{
				begin: /_{2}(?!\s)/,
				end: /_{2}/
			}, {
				begin: /\*{2}(?!\s)/,
				end: /\*{2}/
			}]
		}, l = {
			className: "emphasis",
			contains: [],
			variants: [{
				begin: /\*(?![*\s])/,
				end: /\*/
			}, {
				begin: /_(?![_\s])/,
				end: /_/,
				relevance: 0
			}]
		}, u = e.inherit(c, { contains: [] }), d = e.inherit(l, { contains: [] });
		c.contains.push(d), l.contains.push(u);
		let f = [n, s];
		return [
			c,
			l,
			u,
			d
		].forEach((e) => {
			e.contains = e.contains.concat(f);
		}), f = f.concat(c, l), {
			name: "Markdown",
			aliases: [
				"md",
				"mkdown",
				"mkd"
			],
			contains: [
				{
					className: "section",
					variants: [{
						begin: "^#{1,6}",
						end: "$",
						contains: f
					}, {
						begin: "(?=^.+?\\n[=-]{2,}$)",
						contains: [{ begin: "^[=-]*$" }, {
							begin: "^",
							end: "\\n",
							contains: f
						}]
					}]
				},
				n,
				a,
				c,
				l,
				{
					className: "quote",
					begin: "^>\\s+",
					contains: f,
					end: "$"
				},
				i,
				r,
				s,
				o,
				{
					scope: "literal",
					match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/
				}
			]
		};
	}
	t.exports = n;
})), Ig = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex;
		return {
			name: "Diff",
			aliases: ["patch"],
			contains: [
				{
					className: "meta",
					relevance: 10,
					match: t.either(/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/, /^@@ +-\d+ +\+\d+,\d+ +@@/, /^@@ +-\d+,\d+ +\+\d+ +@@/, /^@@ +-\d+ +\+\d+ +@@/, /^\*\*\* +\d+,\d+ +\*\*\*\*$/, /^--- +\d+,\d+ +----$/)
				},
				{
					className: "comment",
					variants: [{
						begin: t.either(/Index: /, /^index/, /={3,}/, /^-{3}/, /^\*{3} /, /^\+{3}/, /^diff --git/),
						end: /$/
					}, { match: /^\*{15}$/ }]
				},
				{
					className: "addition",
					begin: /^\+/,
					end: /$/
				},
				{
					className: "deletion",
					begin: /^-/,
					end: /$/
				},
				{
					className: "addition",
					begin: /^!/,
					end: /$/
				}
			]
		};
	}
	t.exports = n;
})), Lg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)", r = t.either(/\b([A-Z]+[a-z0-9]+)+/, /\b([A-Z]+[a-z0-9]+)+[A-Z]+/), i = t.concat(r, /(::\w+)*/), a = {
			"variable.constant": [
				"__FILE__",
				"__LINE__",
				"__ENCODING__"
			],
			"variable.language": ["self", "super"],
			keyword: /* @__PURE__ */ "alias.and.begin.BEGIN.break.case.class.defined.do.else.elsif.end.END.ensure.for.if.in.module.next.not.or.redo.require.rescue.retry.return.then.undef.unless.until.when.while.yield.include.extend.prepend.public.private.protected.raise.throw".split("."),
			built_in: [
				"proc",
				"lambda",
				"attr_accessor",
				"attr_reader",
				"attr_writer",
				"define_method",
				"private_constant",
				"module_function"
			],
			literal: [
				"true",
				"false",
				"nil"
			]
		}, o = {
			className: "doctag",
			begin: "@[A-Za-z]+"
		}, s = {
			begin: "#<",
			end: ">"
		}, c = [
			e.COMMENT("#", "$", { contains: [o] }),
			e.COMMENT("^=begin", "^=end", {
				contains: [o],
				relevance: 10
			}),
			e.COMMENT("^__END__", e.MATCH_NOTHING_RE)
		], l = {
			className: "subst",
			begin: /#\{/,
			end: /\}/,
			keywords: a
		}, u = {
			className: "string",
			contains: [e.BACKSLASH_ESCAPE, l],
			variants: [
				{
					begin: /'/,
					end: /'/
				},
				{
					begin: /"/,
					end: /"/
				},
				{
					begin: /`/,
					end: /`/
				},
				{
					begin: /%[qQwWx]?\(/,
					end: /\)/
				},
				{
					begin: /%[qQwWx]?\[/,
					end: /\]/
				},
				{
					begin: /%[qQwWx]?\{/,
					end: /\}/
				},
				{
					begin: /%[qQwWx]?</,
					end: />/
				},
				{
					begin: /%[qQwWx]?\//,
					end: /\//
				},
				{
					begin: /%[qQwWx]?%/,
					end: /%/
				},
				{
					begin: /%[qQwWx]?-/,
					end: /-/
				},
				{
					begin: /%[qQwWx]?\|/,
					end: /\|/
				},
				{ begin: /\B\?(\\\d{1,3})/ },
				{ begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/ },
				{ begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/ },
				{ begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/ },
				{ begin: /\B\?\\(c|C-)[\x20-\x7e]/ },
				{ begin: /\B\?\\?\S/ },
				{
					begin: t.concat(/<<[-~]?'?/, t.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)),
					contains: [e.END_SAME_AS_BEGIN({
						begin: /(\w+)/,
						end: /(\w+)/,
						contains: [e.BACKSLASH_ESCAPE, l]
					})]
				}
			]
		}, d = "[0-9](_?[0-9])*", f = {
			className: "number",
			relevance: 0,
			variants: [
				{ begin: `\\b([1-9](_?[0-9])*|0)(\\.(${d}))?([eE][+-]?(${d})|r)?i?\\b` },
				{ begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b" },
				{ begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b" },
				{ begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b" },
				{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b" },
				{ begin: "\\b0(_?[0-7])+r?i?\\b" }
			]
		}, p = { variants: [{ match: /\(\)/ }, {
			className: "params",
			begin: /\(/,
			end: /(?=\))/,
			excludeBegin: !0,
			endsParent: !0,
			keywords: a
		}] }, m = [
			u,
			{
				variants: [{ match: [
					/class\s+/,
					i,
					/\s+<\s+/,
					i
				] }, { match: [/\b(class|module)\s+/, i] }],
				scope: {
					2: "title.class",
					4: "title.class.inherited"
				},
				keywords: a
			},
			{
				match: [/(include|extend)\s+/, i],
				scope: { 2: "title.class" },
				keywords: a
			},
			{
				relevance: 0,
				match: [i, /\.new[. (]/],
				scope: { 1: "title.class" }
			},
			{
				relevance: 0,
				match: /\b[A-Z][A-Z_0-9]+\b/,
				className: "variable.constant"
			},
			{
				relevance: 0,
				match: r,
				scope: "title.class"
			},
			{
				match: [
					/def/,
					/\s+/,
					n
				],
				scope: {
					1: "keyword",
					3: "title.function"
				},
				contains: [p]
			},
			{ begin: e.IDENT_RE + "::" },
			{
				className: "symbol",
				begin: e.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
				relevance: 0
			},
			{
				className: "symbol",
				begin: ":(?!\\s)",
				contains: [u, { begin: n }],
				relevance: 0
			},
			f,
			{
				className: "variable",
				begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"
			},
			{
				className: "params",
				begin: /\|(?!=)/,
				end: /\|/,
				excludeBegin: !0,
				excludeEnd: !0,
				relevance: 0,
				keywords: a
			},
			{
				begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
				keywords: "unless",
				contains: [{
					className: "regexp",
					contains: [e.BACKSLASH_ESCAPE, l],
					illegal: /\n/,
					variants: [
						{
							begin: "/",
							end: "/[a-z]*"
						},
						{
							begin: /%r\{/,
							end: /\}[a-z]*/
						},
						{
							begin: "%r\\(",
							end: "\\)[a-z]*"
						},
						{
							begin: "%r!",
							end: "![a-z]*"
						},
						{
							begin: "%r\\[",
							end: "\\][a-z]*"
						}
					]
				}].concat(s, c),
				relevance: 0
			}
		].concat(s, c);
		l.contains = m, p.contains = m;
		let h = [{
			begin: /^\s*=>/,
			starts: {
				end: "$",
				contains: m
			}
		}, {
			className: "meta.prompt",
			begin: "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",
			starts: {
				end: "$",
				keywords: a,
				contains: m
			}
		}];
		return c.unshift(s), {
			name: "Ruby",
			aliases: [
				"rb",
				"gemspec",
				"podspec",
				"thor",
				"irb"
			],
			keywords: a,
			illegal: /\/\*/,
			contains: [e.SHEBANG({ binary: "ruby" })].concat(h, c, m)
		};
	}
	t.exports = n;
})), Rg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = {
			keyword: [
				"break",
				"case",
				"chan",
				"const",
				"continue",
				"default",
				"defer",
				"else",
				"fallthrough",
				"for",
				"func",
				"go",
				"goto",
				"if",
				"import",
				"interface",
				"map",
				"package",
				"range",
				"return",
				"select",
				"struct",
				"switch",
				"type",
				"var"
			],
			type: [
				"bool",
				"byte",
				"complex64",
				"complex128",
				"error",
				"float32",
				"float64",
				"int8",
				"int16",
				"int32",
				"int64",
				"string",
				"uint8",
				"uint16",
				"uint32",
				"uint64",
				"int",
				"uint",
				"uintptr",
				"rune"
			],
			literal: [
				"true",
				"false",
				"iota",
				"nil"
			],
			built_in: [
				"append",
				"cap",
				"close",
				"complex",
				"copy",
				"imag",
				"len",
				"make",
				"new",
				"panic",
				"print",
				"println",
				"real",
				"recover",
				"delete"
			]
		};
		return {
			name: "Go",
			aliases: ["golang"],
			keywords: t,
			illegal: "</",
			contains: [
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				{
					className: "string",
					variants: [
						e.QUOTE_STRING_MODE,
						e.APOS_STRING_MODE,
						{
							begin: "`",
							end: "`"
						}
					]
				},
				{
					className: "number",
					variants: [
						{
							match: /-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,
							relevance: 0
						},
						{
							match: /-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,
							relevance: 0
						},
						{
							match: /-?\b0[oO](_?[0-7])*i?/,
							relevance: 0
						},
						{
							match: /-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,
							relevance: 0
						},
						{
							match: /-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,
							relevance: 0
						}
					]
				},
				{ begin: /:=/ },
				{
					className: "function",
					beginKeywords: "func",
					end: "\\s*(\\{|$)",
					excludeEnd: !0,
					contains: [e.TITLE_MODE, {
						className: "params",
						begin: /\(/,
						end: /\)/,
						endsParent: !0,
						keywords: t,
						illegal: /["']/
					}]
				}
			]
		};
	}
	t.exports = n;
})), zg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex;
		return {
			name: "GraphQL",
			aliases: ["gql"],
			case_insensitive: !0,
			disableAutodetect: !1,
			keywords: {
				keyword: [
					"query",
					"mutation",
					"subscription",
					"type",
					"input",
					"schema",
					"directive",
					"interface",
					"union",
					"scalar",
					"fragment",
					"enum",
					"on"
				],
				literal: [
					"true",
					"false",
					"null"
				]
			},
			contains: [
				e.HASH_COMMENT_MODE,
				e.QUOTE_STRING_MODE,
				e.NUMBER_MODE,
				{
					scope: "punctuation",
					match: /[.]{3}/,
					relevance: 0
				},
				{
					scope: "punctuation",
					begin: /[\!\(\)\:\=\[\]\{\|\}]{1}/,
					relevance: 0
				},
				{
					scope: "variable",
					begin: /\$/,
					end: /\W/,
					excludeEnd: !0,
					relevance: 0
				},
				{
					scope: "meta",
					match: /@\w+/,
					excludeEnd: !0
				},
				{
					scope: "symbol",
					begin: t.concat(/[_A-Za-z][_0-9A-Za-z]*/, t.lookahead(/\s*:/)),
					relevance: 0
				}
			],
			illegal: [/[;<']/, /BEGIN/]
		};
	}
	t.exports = n;
})), Bg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = {
			className: "number",
			relevance: 0,
			variants: [{ begin: /([+-]+)?[\d]+_[\d_]+/ }, { begin: e.NUMBER_RE }]
		}, r = e.COMMENT();
		r.variants = [{
			begin: /;/,
			end: /$/
		}, {
			begin: /#/,
			end: /$/
		}];
		let i = {
			className: "variable",
			variants: [{ begin: /\$[\w\d"][\w\d_]*/ }, { begin: /\$\{(.*?)\}/ }]
		}, a = {
			className: "literal",
			begin: /\bon|off|true|false|yes|no\b/
		}, o = {
			className: "string",
			contains: [e.BACKSLASH_ESCAPE],
			variants: [
				{
					begin: "'''",
					end: "'''",
					relevance: 10
				},
				{
					begin: "\"\"\"",
					end: "\"\"\"",
					relevance: 10
				},
				{
					begin: "\"",
					end: "\""
				},
				{
					begin: "'",
					end: "'"
				}
			]
		}, s = {
			begin: /\[/,
			end: /\]/,
			contains: [
				r,
				a,
				i,
				o,
				n,
				"self"
			],
			relevance: 0
		}, c = t.either(/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/);
		return {
			name: "TOML, also INI",
			aliases: ["toml"],
			case_insensitive: !0,
			illegal: /\S/,
			contains: [
				r,
				{
					className: "section",
					begin: /\[+/,
					end: /\]+/
				},
				{
					begin: t.concat(c, "(\\s*\\.\\s*", c, ")*", t.lookahead(/\s*=\s*[^#\s]/)),
					className: "attr",
					starts: {
						end: /$/,
						contains: [
							r,
							s,
							a,
							i,
							o,
							n
						]
					}
				}
			]
		};
	}
	t.exports = n;
})), Vg = /* @__PURE__ */ o(((e, t) => {
	var n = "[0-9](_*[0-9])*", r = `\\.(${n})`, i = "[0-9a-fA-F](_*[0-9a-fA-F])*", a = {
		className: "number",
		variants: [
			{ begin: `(\\b(${n})((${r})|\\.)?|(${r}))[eE][+-]?(${n})[fFdD]?\\b` },
			{ begin: `\\b(${n})((${r})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
			{ begin: `(${r})[fFdD]?\\b` },
			{ begin: `\\b(${n})[fFdD]\\b` },
			{ begin: `\\b0[xX]((${i})\\.?|(${i})?\\.(${i}))[pP][+-]?(${n})[fFdD]?\\b` },
			{ begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
			{ begin: `\\b0[xX](${i})[lL]?\\b` },
			{ begin: "\\b0(_*[0-7])*[lL]?\\b" },
			{ begin: "\\b0[bB][01](_*[01])*[lL]?\\b" }
		],
		relevance: 0
	};
	function o(e, t, n) {
		return n === -1 ? "" : e.replace(t, (r) => o(e, t, n - 1));
	}
	function s(e) {
		let t = e.regex, n = "[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*", r = n + o("(?:<" + n + "~~~(?:\\s*,\\s*" + n + "~~~)*>)?", /~~~/g, 2), i = {
			keyword: /* @__PURE__ */ "synchronized.abstract.private.var.static.if.const .for.while.strictfp.finally.protected.import.native.final.void.enum.else.break.transient.catch.instanceof.volatile.case.assert.package.default.public.try.switch.continue.throws.protected.public.private.module.requires.exports.do.sealed.yield.permits.goto.when".split("."),
			literal: [
				"false",
				"true",
				"null"
			],
			type: [
				"char",
				"boolean",
				"long",
				"float",
				"int",
				"byte",
				"short",
				"double"
			],
			built_in: ["super", "this"]
		}, s = {
			className: "meta",
			begin: "@" + n,
			contains: [{
				begin: /\(/,
				end: /\)/,
				contains: ["self"]
			}]
		}, c = {
			className: "params",
			begin: /\(/,
			end: /\)/,
			keywords: i,
			relevance: 0,
			contains: [e.C_BLOCK_COMMENT_MODE],
			endsParent: !0
		};
		return {
			name: "Java",
			aliases: ["jsp"],
			keywords: i,
			illegal: /<\/|#/,
			contains: [
				e.COMMENT("/\\*\\*", "\\*/", {
					relevance: 0,
					contains: [{
						begin: /\w+@/,
						relevance: 0
					}, {
						className: "doctag",
						begin: "@[A-Za-z]+"
					}]
				}),
				{
					begin: /import java\.[a-z]+\./,
					keywords: "import",
					relevance: 2
				},
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				{
					begin: /"""/,
					end: /"""/,
					className: "string",
					contains: [e.BACKSLASH_ESCAPE]
				},
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE,
				{
					match: [
						/\b(?:class|interface|enum|extends|implements|new)/,
						/\s+/,
						n
					],
					className: {
						1: "keyword",
						3: "title.class"
					}
				},
				{
					match: /non-sealed/,
					scope: "keyword"
				},
				{
					begin: [
						t.concat(/(?!else)/, n),
						/\s+/,
						n,
						/\s+/,
						/=(?!=)/
					],
					className: {
						1: "type",
						3: "variable",
						5: "operator"
					}
				},
				{
					begin: [
						/record/,
						/\s+/,
						n
					],
					className: {
						1: "keyword",
						3: "title.class"
					},
					contains: [
						c,
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				{
					beginKeywords: "new throw return else",
					relevance: 0
				},
				{
					begin: [
						"(?:" + r + "\\s+)",
						e.UNDERSCORE_IDENT_RE,
						/\s*(?=\()/
					],
					className: { 2: "title.function" },
					keywords: i,
					contains: [
						{
							className: "params",
							begin: /\(/,
							end: /\)/,
							keywords: i,
							relevance: 0,
							contains: [
								s,
								e.APOS_STRING_MODE,
								e.QUOTE_STRING_MODE,
								a,
								e.C_BLOCK_COMMENT_MODE
							]
						},
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				a,
				s
			]
		};
	}
	t.exports = s;
})), Hg = /* @__PURE__ */ o(((e, t) => {
	var n = "[A-Za-z$_][0-9A-Za-z$_]*", r = /* @__PURE__ */ "as.in.of.if.for.while.finally.var.new.function.do.return.void.else.break.catch.instanceof.with.throw.case.default.try.switch.continue.typeof.delete.let.yield.const.class.debugger.async.await.static.import.from.export.extends.using".split("."), i = [
		"true",
		"false",
		"null",
		"undefined",
		"NaN",
		"Infinity"
	], a = /* @__PURE__ */ "Object.Function.Boolean.Symbol.Math.Date.Number.BigInt.String.RegExp.Array.Float32Array.Float64Array.Int8Array.Uint8Array.Uint8ClampedArray.Int16Array.Int32Array.Uint16Array.Uint32Array.BigInt64Array.BigUint64Array.Set.Map.WeakSet.WeakMap.ArrayBuffer.SharedArrayBuffer.Atomics.DataView.JSON.Promise.Generator.GeneratorFunction.AsyncFunction.Reflect.Proxy.Intl.WebAssembly".split("."), o = [
		"Error",
		"EvalError",
		"InternalError",
		"RangeError",
		"ReferenceError",
		"SyntaxError",
		"TypeError",
		"URIError"
	], s = [
		"setInterval",
		"setTimeout",
		"clearInterval",
		"clearTimeout",
		"require",
		"exports",
		"eval",
		"isFinite",
		"isNaN",
		"parseFloat",
		"parseInt",
		"decodeURI",
		"decodeURIComponent",
		"encodeURI",
		"encodeURIComponent",
		"escape",
		"unescape"
	], c = [
		"arguments",
		"this",
		"super",
		"console",
		"window",
		"document",
		"localStorage",
		"sessionStorage",
		"module",
		"global"
	], l = [].concat(s, a, o);
	function u(e) {
		let t = e.regex, u = (e, { after: t }) => {
			let n = "</" + e[0].slice(1);
			return e.input.indexOf(n, t) !== -1;
		}, d = n, f = {
			begin: "<>",
			end: "</>"
		}, p = /<[A-Za-z0-9\\._:-]+\s*\/>/, m = {
			begin: /<[A-Za-z0-9\\._:-]+/,
			end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
			isTrulyOpeningTag: (e, t) => {
				let n = e[0].length + e.index, r = e.input[n];
				if (r === "<" || r === ",") {
					t.ignoreMatch();
					return;
				}
				r === ">" && (u(e, { after: n }) || t.ignoreMatch());
				let i, a = e.input.substring(n);
				if (i = a.match(/^\s*=/)) {
					t.ignoreMatch();
					return;
				}
				if ((i = a.match(/^\s+extends\s+/)) && i.index === 0) {
					t.ignoreMatch();
					return;
				}
			}
		}, h = {
			$pattern: n,
			keyword: r,
			literal: i,
			built_in: l,
			"variable.language": c
		}, g = "[0-9](_?[0-9])*", _ = `\\.(${g})`, v = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", y = {
			className: "number",
			variants: [
				{ begin: `(\\b(${v})((${_})|\\.)?|(${_}))[eE][+-]?(${g})\\b` },
				{ begin: `\\b(${v})\\b((${_})\\b|\\.)?|(${_})\\b` },
				{ begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
				{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
				{ begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
				{ begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
				{ begin: "\\b0[0-7]+n?\\b" }
			],
			relevance: 0
		}, b = {
			className: "subst",
			begin: "\\$\\{",
			end: "\\}",
			keywords: h,
			contains: []
		}, x = {
			begin: ".?html`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "xml"
			}
		}, S = {
			begin: ".?css`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "css"
			}
		}, ee = {
			begin: ".?gql`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "graphql"
			}
		}, te = {
			className: "string",
			begin: "`",
			end: "`",
			contains: [e.BACKSLASH_ESCAPE, b]
		}, C = {
			className: "comment",
			variants: [
				e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
					relevance: 0,
					contains: [{
						begin: "(?=@[A-Za-z]+)",
						relevance: 0,
						contains: [
							{
								className: "doctag",
								begin: "@[A-Za-z]+"
							},
							{
								className: "type",
								begin: "\\{",
								end: "\\}",
								excludeEnd: !0,
								excludeBegin: !0,
								relevance: 0
							},
							{
								className: "variable",
								begin: d + "(?=\\s*(-)|$)",
								endsParent: !0,
								relevance: 0
							},
							{
								begin: /(?=[^\n])\s/,
								relevance: 0
							}
						]
					}]
				}),
				e.C_BLOCK_COMMENT_MODE,
				e.C_LINE_COMMENT_MODE
			]
		}, w = [
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			x,
			S,
			ee,
			te,
			{ match: /\$\d+/ },
			y
		];
		b.contains = w.concat({
			begin: /\{/,
			end: /\}/,
			keywords: h,
			contains: ["self"].concat(w)
		});
		let ne = [].concat(C, b.contains), re = ne.concat([{
			begin: /(\s*)\(/,
			end: /\)/,
			keywords: h,
			contains: ["self"].concat(ne)
		}]), ie = {
			className: "params",
			begin: /(\s*)\(/,
			end: /\)/,
			excludeBegin: !0,
			excludeEnd: !0,
			keywords: h,
			contains: re
		}, T = { variants: [{
			match: [
				/class/,
				/\s+/,
				d,
				/\s+/,
				/extends/,
				/\s+/,
				t.concat(d, "(", t.concat(/\./, d), ")*")
			],
			scope: {
				1: "keyword",
				3: "title.class",
				5: "keyword",
				7: "title.class.inherited"
			}
		}, {
			match: [
				/class/,
				/\s+/,
				d
			],
			scope: {
				1: "keyword",
				3: "title.class"
			}
		}] }, ae = {
			relevance: 0,
			match: t.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
			className: "title.class",
			keywords: { _: [...a, ...o] }
		}, E = {
			label: "use_strict",
			className: "meta",
			relevance: 10,
			begin: /^\s*['"]use (strict|asm)['"]/
		}, oe = {
			variants: [{ match: [
				/function/,
				/\s+/,
				d,
				/(?=\s*\()/
			] }, { match: [/function/, /\s*(?=\()/] }],
			className: {
				1: "keyword",
				3: "title.function"
			},
			label: "func.def",
			contains: [ie],
			illegal: /%/
		}, D = {
			relevance: 0,
			match: /\b[A-Z][A-Z_0-9]+\b/,
			className: "variable.constant"
		};
		function se(e) {
			return t.concat("(?!", e.join("|"), ")");
		}
		let ce = {
			match: t.concat(/\b/, se([
				...s,
				"super",
				"import",
				"await"
			].map((e) => `${e}\\s*\\(`)), d, t.lookahead(/\s*\(/)),
			className: "title.function",
			relevance: 0
		}, le = {
			begin: t.concat(/\./, t.lookahead(t.concat(d, /(?![0-9A-Za-z$_(])/))),
			end: d,
			excludeBegin: !0,
			keywords: "prototype",
			className: "property",
			relevance: 0
		}, ue = {
			match: [
				/get|set/,
				/\s+/,
				d,
				/(?=\()/
			],
			className: {
				1: "keyword",
				3: "title.function"
			},
			contains: [{ begin: /\(\)/ }, ie]
		}, de = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", O = {
			match: [
				/const|var|let/,
				/\s+/,
				d,
				/\s*/,
				/=\s*/,
				/(async\s*)?/,
				t.lookahead(de)
			],
			keywords: "async",
			className: {
				1: "keyword",
				3: "title.function"
			},
			contains: [ie]
		};
		return {
			name: "JavaScript",
			aliases: [
				"js",
				"jsx",
				"mjs",
				"cjs"
			],
			keywords: h,
			exports: {
				PARAMS_CONTAINS: re,
				CLASS_REFERENCE: ae
			},
			illegal: /#(?![$_A-Za-z])/,
			contains: [
				e.SHEBANG({
					label: "shebang",
					binary: "node",
					relevance: 5
				}),
				E,
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE,
				x,
				S,
				ee,
				te,
				C,
				{ match: /\$\d+/ },
				y,
				ae,
				{
					scope: "attr",
					match: d + t.lookahead(":"),
					relevance: 0
				},
				O,
				{
					begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
					keywords: "return throw case",
					relevance: 0,
					contains: [
						C,
						e.REGEXP_MODE,
						{
							className: "function",
							begin: de,
							returnBegin: !0,
							end: "\\s*=>",
							contains: [{
								className: "params",
								variants: [
									{
										begin: e.UNDERSCORE_IDENT_RE,
										relevance: 0
									},
									{
										className: null,
										begin: /\(\s*\)/,
										skip: !0
									},
									{
										begin: /(\s*)\(/,
										end: /\)/,
										excludeBegin: !0,
										excludeEnd: !0,
										keywords: h,
										contains: re
									}
								]
							}]
						},
						{
							begin: /,/,
							relevance: 0
						},
						{
							match: /\s+/,
							relevance: 0
						},
						{
							variants: [
								{
									begin: f.begin,
									end: f.end
								},
								{ match: p },
								{
									begin: m.begin,
									"on:begin": m.isTrulyOpeningTag,
									end: m.end
								}
							],
							subLanguage: "xml",
							contains: [{
								begin: m.begin,
								end: m.end,
								skip: !0,
								contains: ["self"]
							}]
						}
					]
				},
				oe,
				{ beginKeywords: "while if switch catch for" },
				{
					begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
					returnBegin: !0,
					label: "func.def",
					contains: [ie, e.inherit(e.TITLE_MODE, {
						begin: d,
						className: "title.function"
					})]
				},
				{
					match: /\.\.\./,
					relevance: 0
				},
				le,
				{
					match: "\\$" + d,
					relevance: 0
				},
				{
					match: [/\bconstructor(?=\s*\()/],
					className: { 1: "title.function" },
					contains: [ie]
				},
				ce,
				D,
				T,
				ue,
				{ match: /\$[(.]/ }
			]
		};
	}
	t.exports = u;
})), Ug = /* @__PURE__ */ o(((e, t) => {
	var n = {
		scope: "number",
		match: "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity",
		relevance: 0
	};
	function r(e) {
		let t = {
			className: "attr",
			begin: /(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,
			relevance: 1.01
		}, r = {
			match: /[{}[\],:]/,
			className: "punctuation",
			relevance: 0
		}, i = [
			"true",
			"false",
			"null"
		], a = {
			scope: "literal",
			beginKeywords: i.join(" ")
		};
		return {
			name: "JSON",
			aliases: ["jsonc", "json5"],
			keywords: { literal: i },
			contains: [
				t,
				r,
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE,
				a,
				n,
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE
			],
			illegal: "\\S"
		};
	}
	t.exports = r;
})), Wg = /* @__PURE__ */ o(((e, t) => {
	var n = "[0-9](_*[0-9])*", r = `\\.(${n})`, i = "[0-9a-fA-F](_*[0-9a-fA-F])*", a = {
		className: "number",
		variants: [
			{ begin: `(\\b(${n})((${r})|\\.)?|(${r}))[eE][+-]?(${n})[fFdD]?\\b` },
			{ begin: `\\b(${n})((${r})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
			{ begin: `(${r})[fFdD]?\\b` },
			{ begin: `\\b(${n})[fFdD]\\b` },
			{ begin: `\\b0[xX]((${i})\\.?|(${i})?\\.(${i}))[pP][+-]?(${n})[fFdD]?\\b` },
			{ begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
			{ begin: `\\b0[xX](${i})[lL]?\\b` },
			{ begin: "\\b0(_*[0-7])*[lL]?\\b" },
			{ begin: "\\b0[bB][01](_*[01])*[lL]?\\b" }
		],
		relevance: 0
	};
	function o(e) {
		let t = {
			keyword: "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
			built_in: "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
			literal: "true false null"
		}, n = {
			className: "keyword",
			begin: /\b(break|continue|return|this)\b/,
			starts: { contains: [{
				className: "symbol",
				begin: /@\w+/
			}] }
		}, r = {
			className: "symbol",
			begin: e.UNDERSCORE_IDENT_RE + "@"
		}, i = {
			className: "subst",
			begin: /\$\{/,
			end: /\}/,
			contains: [e.C_NUMBER_MODE]
		}, o = {
			className: "variable",
			begin: "\\$" + e.UNDERSCORE_IDENT_RE
		}, s = {
			className: "string",
			variants: [
				{
					begin: "\"\"\"",
					end: "\"\"\"(?=[^\"])",
					contains: [o, i]
				},
				{
					begin: "'",
					end: "'",
					illegal: /\n/,
					contains: [e.BACKSLASH_ESCAPE]
				},
				{
					begin: "\"",
					end: "\"",
					illegal: /\n/,
					contains: [
						e.BACKSLASH_ESCAPE,
						o,
						i
					]
				}
			]
		};
		i.contains.push(s);
		let c = {
			className: "meta",
			begin: "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" + e.UNDERSCORE_IDENT_RE + ")?"
		}, l = {
			className: "meta",
			begin: "@" + e.UNDERSCORE_IDENT_RE,
			contains: [{
				begin: /\(/,
				end: /\)/,
				contains: [e.inherit(s, { className: "string" }), "self"]
			}]
		}, u = a, d = e.COMMENT("/\\*", "\\*/", { contains: [e.C_BLOCK_COMMENT_MODE] }), f = { variants: [{
			className: "type",
			begin: e.UNDERSCORE_IDENT_RE
		}, {
			begin: /\(/,
			end: /\)/,
			contains: []
		}] }, p = f;
		return p.variants[1].contains = [f], f.variants[1].contains = [p], {
			name: "Kotlin",
			aliases: ["kt", "kts"],
			keywords: t,
			contains: [
				e.COMMENT("/\\*\\*", "\\*/", {
					relevance: 0,
					contains: [{
						className: "doctag",
						begin: "@[A-Za-z]+"
					}]
				}),
				e.C_LINE_COMMENT_MODE,
				d,
				n,
				r,
				c,
				l,
				{
					className: "function",
					beginKeywords: "fun",
					end: "[(]|$",
					returnBegin: !0,
					excludeEnd: !0,
					keywords: t,
					relevance: 5,
					contains: [
						{
							begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
							returnBegin: !0,
							relevance: 0,
							contains: [e.UNDERSCORE_TITLE_MODE]
						},
						{
							className: "type",
							begin: /</,
							end: />/,
							keywords: "reified",
							relevance: 0
						},
						{
							className: "params",
							begin: /\(/,
							end: /\)/,
							endsParent: !0,
							keywords: t,
							relevance: 0,
							contains: [
								{
									begin: /:/,
									end: /[=,\/]/,
									endsWithParent: !0,
									contains: [
										f,
										e.C_LINE_COMMENT_MODE,
										d
									],
									relevance: 0
								},
								e.C_LINE_COMMENT_MODE,
								d,
								c,
								l,
								s,
								e.C_NUMBER_MODE
							]
						},
						d
					]
				},
				{
					begin: [
						/class|interface|trait/,
						/\s+/,
						e.UNDERSCORE_IDENT_RE
					],
					beginScope: { 3: "title.class" },
					keywords: "class interface trait",
					end: /[:\{(]|$/,
					excludeEnd: !0,
					illegal: "extends implements",
					contains: [
						{ beginKeywords: "public protected internal private constructor" },
						e.UNDERSCORE_TITLE_MODE,
						{
							className: "type",
							begin: /</,
							end: />/,
							excludeBegin: !0,
							excludeEnd: !0,
							relevance: 0
						},
						{
							className: "type",
							begin: /[,:]\s*/,
							end: /[<\(,){\s]|$/,
							excludeBegin: !0,
							returnEnd: !0
						},
						c,
						l
					]
				},
				s,
				{
					className: "meta",
					begin: "^#!/usr/bin/env",
					end: "$",
					illegal: "\n"
				},
				u
			]
		};
	}
	t.exports = o;
})), Gg = /* @__PURE__ */ o(((e, t) => {
	var n = (e) => ({
		IMPORTANT: {
			scope: "meta",
			begin: "!important"
		},
		BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
		HEXCOLOR: {
			scope: "number",
			begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
		},
		UNICODE_RANGE: {
			scope: "number",
			begin: /\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,4}(-[0-9A-Fa-f][0-9A-Fa-f]{0,4})?/
		},
		FUNCTION_DISPATCH: {
			className: "built_in",
			begin: /[\w-]+(?=\()/
		},
		ATTRIBUTE_SELECTOR_MODE: {
			scope: "selector-attr",
			begin: /\[/,
			end: /\]/,
			illegal: "$",
			contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
		},
		CSS_NUMBER_MODE: {
			scope: "number",
			begin: e.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
			relevance: 0
		},
		CSS_VARIABLE: {
			className: "attr",
			begin: /--[A-Za-z_][A-Za-z0-9_-]*/
		}
	}), r = /* @__PURE__ */ "a.abbr.address.article.aside.audio.b.blockquote.body.button.canvas.caption.cite.code.dd.del.details.dfn.div.dl.dt.em.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.hgroup.html.i.iframe.img.input.ins.kbd.label.legend.li.main.mark.menu.nav.object.ol.optgroup.option.p.picture.q.quote.samp.section.select.source.span.strong.summary.sup.table.tbody.td.textarea.tfoot.th.thead.time.tr.ul.var.video".split("."), i = /* @__PURE__ */ "defs.g.marker.mask.pattern.svg.switch.symbol.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feFlood.feGaussianBlur.feImage.feMerge.feMorphology.feOffset.feSpecularLighting.feTile.feTurbulence.linearGradient.radialGradient.stop.circle.ellipse.image.line.path.polygon.polyline.rect.text.use.textPath.tspan.foreignObject.clipPath".split("."), a = [...r, ...i], o = (/* @__PURE__ */ "any-hover.any-pointer.aspect-ratio.color.color-gamut.color-index.device-aspect-ratio.device-height.device-width.display-mode.forced-colors.grid.height.hover.inverted-colors.monochrome.orientation.overflow-block.overflow-inline.pointer.prefers-color-scheme.prefers-contrast.prefers-reduced-motion.prefers-reduced-transparency.resolution.scan.scripting.update.width.min-width.max-width.min-height.max-height".split(".")).sort().reverse(), s = (/* @__PURE__ */ "active.any-link.blank.checked.current.default.defined.dir.disabled.drop.empty.enabled.first.first-child.first-of-type.fullscreen.future.focus.focus-visible.focus-within.has.host.host-context.hover.indeterminate.in-range.invalid.is.lang.last-child.last-of-type.left.link.local-link.not.nth-child.nth-col.nth-last-child.nth-last-col.nth-last-of-type.nth-of-type.only-child.only-of-type.optional.out-of-range.past.placeholder-shown.read-only.read-write.required.right.root.scope.target.target-within.user-invalid.valid.visited.where".split(".")).sort().reverse(), c = [
		"after",
		"backdrop",
		"before",
		"cue",
		"cue-region",
		"first-letter",
		"first-line",
		"grammar-error",
		"marker",
		"part",
		"placeholder",
		"selection",
		"slotted",
		"spelling-error"
	].sort().reverse(), l = (/* @__PURE__ */ "accent-color.align-content.align-items.align-self.alignment-baseline.all.anchor-name.animation.animation-composition.animation-delay.animation-direction.animation-duration.animation-fill-mode.animation-iteration-count.animation-name.animation-play-state.animation-range.animation-range-end.animation-range-start.animation-timeline.animation-timing-function.appearance.aspect-ratio.backdrop-filter.backface-visibility.background.background-attachment.background-blend-mode.background-clip.background-color.background-image.background-origin.background-position.background-position-x.background-position-y.background-repeat.background-size.baseline-shift.block-size.border.border-block.border-block-color.border-block-end.border-block-end-color.border-block-end-style.border-block-end-width.border-block-start.border-block-start-color.border-block-start-style.border-block-start-width.border-block-style.border-block-width.border-bottom.border-bottom-color.border-bottom-left-radius.border-bottom-right-radius.border-bottom-style.border-bottom-width.border-collapse.border-color.border-end-end-radius.border-end-start-radius.border-image.border-image-outset.border-image-repeat.border-image-slice.border-image-source.border-image-width.border-inline.border-inline-color.border-inline-end.border-inline-end-color.border-inline-end-style.border-inline-end-width.border-inline-start.border-inline-start-color.border-inline-start-style.border-inline-start-width.border-inline-style.border-inline-width.border-left.border-left-color.border-left-style.border-left-width.border-radius.border-right.border-right-color.border-right-style.border-right-width.border-spacing.border-start-end-radius.border-start-start-radius.border-style.border-top.border-top-color.border-top-left-radius.border-top-right-radius.border-top-style.border-top-width.border-width.bottom.box-align.box-decoration-break.box-direction.box-flex.box-flex-group.box-lines.box-ordinal-group.box-orient.box-pack.box-shadow.box-sizing.break-after.break-before.break-inside.caption-side.caret-color.clear.clip.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.color-scheme.column-count.column-fill.column-gap.column-rule.column-rule-color.column-rule-style.column-rule-width.column-span.column-width.columns.contain.contain-intrinsic-block-size.contain-intrinsic-height.contain-intrinsic-inline-size.contain-intrinsic-size.contain-intrinsic-width.container.container-name.container-type.content.content-visibility.counter-increment.counter-reset.counter-set.cue.cue-after.cue-before.cursor.cx.cy.direction.display.dominant-baseline.empty-cells.enable-background.field-sizing.fill.fill-opacity.fill-rule.filter.flex.flex-basis.flex-direction.flex-flow.flex-grow.flex-shrink.flex-wrap.float.flood-color.flood-opacity.flow.font.font-display.font-family.font-feature-settings.font-kerning.font-language-override.font-optical-sizing.font-palette.font-size.font-size-adjust.font-smooth.font-smoothing.font-stretch.font-style.font-synthesis.font-synthesis-position.font-synthesis-small-caps.font-synthesis-style.font-synthesis-weight.font-variant.font-variant-alternates.font-variant-caps.font-variant-east-asian.font-variant-emoji.font-variant-ligatures.font-variant-numeric.font-variant-position.font-variation-settings.font-weight.forced-color-adjust.gap.glyph-orientation-horizontal.glyph-orientation-vertical.grid.grid-area.grid-auto-columns.grid-auto-flow.grid-auto-rows.grid-column.grid-column-end.grid-column-start.grid-gap.grid-row.grid-row-end.grid-row-start.grid-template.grid-template-areas.grid-template-columns.grid-template-rows.hanging-punctuation.height.hyphenate-character.hyphenate-limit-chars.hyphens.icon.image-orientation.image-rendering.image-resolution.ime-mode.initial-letter.initial-letter-align.inline-size.inset.inset-area.inset-block.inset-block-end.inset-block-start.inset-inline.inset-inline-end.inset-inline-start.isolation.justify-content.justify-items.justify-self.kerning.left.letter-spacing.lighting-color.line-break.line-height.line-height-step.list-style.list-style-image.list-style-position.list-style-type.margin.margin-block.margin-block-end.margin-block-start.margin-bottom.margin-inline.margin-inline-end.margin-inline-start.margin-left.margin-right.margin-top.margin-trim.marker.marker-end.marker-mid.marker-start.marks.mask.mask-border.mask-border-mode.mask-border-outset.mask-border-repeat.mask-border-slice.mask-border-source.mask-border-width.mask-clip.mask-composite.mask-image.mask-mode.mask-origin.mask-position.mask-repeat.mask-size.mask-type.masonry-auto-flow.math-depth.math-shift.math-style.max-block-size.max-height.max-inline-size.max-width.min-block-size.min-height.min-inline-size.min-width.mix-blend-mode.nav-down.nav-index.nav-left.nav-right.nav-up.none.normal.object-fit.object-position.offset.offset-anchor.offset-distance.offset-path.offset-position.offset-rotate.opacity.order.orphans.outline.outline-color.outline-offset.outline-style.outline-width.overflow.overflow-anchor.overflow-block.overflow-clip-margin.overflow-inline.overflow-wrap.overflow-x.overflow-y.overlay.overscroll-behavior.overscroll-behavior-block.overscroll-behavior-inline.overscroll-behavior-x.overscroll-behavior-y.padding.padding-block.padding-block-end.padding-block-start.padding-bottom.padding-inline.padding-inline-end.padding-inline-start.padding-left.padding-right.padding-top.page.page-break-after.page-break-before.page-break-inside.paint-order.pause.pause-after.pause-before.perspective.perspective-origin.place-content.place-items.place-self.pointer-events.position.position-anchor.position-visibility.print-color-adjust.quotes.r.resize.rest.rest-after.rest-before.right.rotate.row-gap.ruby-align.ruby-position.scale.scroll-behavior.scroll-margin.scroll-margin-block.scroll-margin-block-end.scroll-margin-block-start.scroll-margin-bottom.scroll-margin-inline.scroll-margin-inline-end.scroll-margin-inline-start.scroll-margin-left.scroll-margin-right.scroll-margin-top.scroll-padding.scroll-padding-block.scroll-padding-block-end.scroll-padding-block-start.scroll-padding-bottom.scroll-padding-inline.scroll-padding-inline-end.scroll-padding-inline-start.scroll-padding-left.scroll-padding-right.scroll-padding-top.scroll-snap-align.scroll-snap-stop.scroll-snap-type.scroll-timeline.scroll-timeline-axis.scroll-timeline-name.scrollbar-color.scrollbar-gutter.scrollbar-width.shape-image-threshold.shape-margin.shape-outside.shape-rendering.speak.speak-as.src.stop-color.stop-opacity.stroke.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke-width.tab-size.table-layout.text-align.text-align-all.text-align-last.text-anchor.text-combine-upright.text-decoration.text-decoration-color.text-decoration-line.text-decoration-skip.text-decoration-skip-ink.text-decoration-style.text-decoration-thickness.text-emphasis.text-emphasis-color.text-emphasis-position.text-emphasis-style.text-indent.text-justify.text-orientation.text-overflow.text-rendering.text-shadow.text-size-adjust.text-transform.text-underline-offset.text-underline-position.text-wrap.text-wrap-mode.text-wrap-style.timeline-scope.top.touch-action.transform.transform-box.transform-origin.transform-style.transition.transition-behavior.transition-delay.transition-duration.transition-property.transition-timing-function.translate.unicode-bidi.unicode-range.user-modify.user-select.vector-effect.vertical-align.view-timeline.view-timeline-axis.view-timeline-inset.view-timeline-name.view-transition-name.visibility.voice-balance.voice-duration.voice-family.voice-pitch.voice-range.voice-rate.voice-stress.voice-volume.white-space.white-space-collapse.widows.width.will-change.word-break.word-spacing.word-wrap.writing-mode.x.y.z-index.zoom".split(".")).sort().reverse(), u = s.concat(c).sort().reverse();
	function d(e) {
		let t = n(e), r = u, i = "([\\w-]+|@\\{[\\w-]+\\})", d = [], f = [], p = function(e) {
			return {
				className: "string",
				begin: "~?" + e + ".*?" + e
			};
		}, m = function(e, t, n) {
			return {
				className: e,
				begin: t,
				relevance: n
			};
		}, h = {
			$pattern: /[a-z-]+/,
			keyword: "and or not only",
			attribute: o.join(" ")
		}, g = {
			begin: "\\(",
			end: "\\)",
			contains: f,
			keywords: h,
			relevance: 0
		};
		f.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, p("'"), p("\""), t.CSS_NUMBER_MODE, {
			begin: "(url|data-uri)\\(",
			starts: {
				className: "string",
				end: "[\\)\\n]",
				excludeEnd: !0
			}
		}, t.UNICODE_RANGE, t.HEXCOLOR, g, m("variable", "@@?[\\w-]+", 10), m("variable", "@\\{[\\w-]+\\}"), m("built_in", "~?`[^`]*?`"), {
			className: "attribute",
			begin: "[\\w-]+\\s*:",
			end: ":",
			returnBegin: !0,
			excludeEnd: !0
		}, t.IMPORTANT, { beginKeywords: "and not" }, t.FUNCTION_DISPATCH);
		let _ = f.concat({
			begin: /\{/,
			end: /\}/,
			contains: d
		}), v = {
			beginKeywords: "when",
			endsWithParent: !0,
			contains: [{ beginKeywords: "and not" }].concat(f)
		}, y = {
			begin: i + "\\s*:",
			returnBegin: !0,
			end: /[;}]/,
			relevance: 0,
			contains: [
				{ begin: /-(webkit|moz|ms|o)-/ },
				t.CSS_VARIABLE,
				{
					className: "attribute",
					begin: "\\b(" + l.join("|") + ")\\b",
					end: /(?=:)/,
					starts: {
						endsWithParent: !0,
						illegal: "[<=$]",
						relevance: 0,
						contains: f
					}
				}
			]
		}, b = {
			className: "keyword",
			begin: "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
			starts: {
				end: "[;{}]",
				keywords: h,
				returnEnd: !0,
				contains: f,
				relevance: 0
			}
		}, x = {
			className: "variable",
			variants: [{
				begin: "@[\\w-]+\\s*:",
				relevance: 15
			}, { begin: "@[\\w-]+" }],
			starts: {
				end: "[;}]",
				returnEnd: !0,
				contains: _
			}
		}, S = {
			variants: [{
				begin: "[\\.#:&\\[>]",
				end: "[;{}]"
			}, {
				begin: i,
				end: /\{/
			}],
			returnBegin: !0,
			returnEnd: !0,
			illegal: "[<='$\"]",
			relevance: 0,
			contains: [
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				v,
				m("keyword", "all\\b"),
				m("variable", "@\\{[\\w-]+\\}"),
				{
					begin: "\\b(" + a.join("|") + ")\\b",
					className: "selector-tag"
				},
				t.CSS_NUMBER_MODE,
				m("selector-tag", i, 0),
				m("selector-id", "#" + i),
				m("selector-class", "\\." + i, 0),
				m("selector-tag", "&", 0),
				t.ATTRIBUTE_SELECTOR_MODE,
				{
					className: "selector-pseudo",
					begin: ":(" + s.join("|") + ")"
				},
				{
					className: "selector-pseudo",
					begin: ":(:)?(" + c.join("|") + ")"
				},
				{
					begin: /\(/,
					end: /\)/,
					relevance: 0,
					contains: _
				},
				{ begin: "!important" },
				t.FUNCTION_DISPATCH
			]
		}, ee = {
			begin: `[\\w-]+:(:)?(${r.join("|")})`,
			returnBegin: !0,
			contains: [S]
		};
		return d.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, b, x, ee, y, S, v, t.FUNCTION_DISPATCH), {
			name: "Less",
			case_insensitive: !0,
			illegal: "[=>'/<($\"]",
			contains: d
		};
	}
	t.exports = d;
})), Kg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = "\\[=*\\[", n = "\\]=*\\]", r = {
			begin: t,
			end: n,
			contains: ["self"]
		}, i = [e.COMMENT("--(?!\\[=*\\[)", "$"), e.COMMENT("--\\[=*\\[", n, {
			contains: [r],
			relevance: 10
		})];
		return {
			name: "Lua",
			aliases: ["pluto"],
			keywords: {
				$pattern: e.UNDERSCORE_IDENT_RE,
				literal: "true false nil",
				keyword: "and break do else elseif end for goto if in local not or repeat return then until while",
				built_in: "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"
			},
			contains: i.concat([
				{
					className: "function",
					beginKeywords: "function",
					end: "\\)",
					contains: [e.inherit(e.TITLE_MODE, { begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*" }), {
						className: "params",
						begin: "\\(",
						endsWithParent: !0,
						contains: i
					}].concat(i)
				},
				e.C_NUMBER_MODE,
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE,
				{
					className: "string",
					begin: t,
					end: n,
					contains: [r],
					relevance: 5
				}
			])
		};
	}
	t.exports = n;
})), qg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = {
			className: "variable",
			variants: [{
				begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)",
				contains: [e.BACKSLASH_ESCAPE]
			}, { begin: /\$[@%<?\^\+\*]/ }]
		}, n = {
			className: "string",
			begin: /"/,
			end: /"/,
			contains: [e.BACKSLASH_ESCAPE, t]
		}, r = {
			className: "variable",
			begin: /\$\([\w-]+\s/,
			end: /\)/,
			keywords: { built_in: "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value" },
			contains: [t, n]
		}, i = { begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)" }, a = {
			className: "meta",
			begin: /^\.PHONY:/,
			end: /$/,
			keywords: {
				$pattern: /[\.\w]+/,
				keyword: ".PHONY"
			}
		}, o = {
			className: "section",
			begin: /^[^\s]+:/,
			end: /$/,
			contains: [t]
		};
		return {
			name: "Makefile",
			aliases: [
				"mk",
				"mak",
				"make"
			],
			keywords: {
				$pattern: /[\w-]+/,
				keyword: "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"
			},
			contains: [
				e.HASH_COMMENT_MODE,
				t,
				n,
				r,
				i,
				a,
				o
			]
		};
	}
	t.exports = n;
})), Jg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = /* @__PURE__ */ "abs.accept.alarm.and.atan2.bind.binmode.bless.break.caller.chdir.chmod.chomp.chop.chown.chr.chroot.class.close.closedir.connect.continue.cos.crypt.dbmclose.dbmopen.defined.delete.die.do.dump.each.else.elsif.endgrent.endhostent.endnetent.endprotoent.endpwent.endservent.eof.eval.exec.exists.exit.exp.fcntl.field.fileno.flock.for.foreach.fork.format.formline.getc.getgrent.getgrgid.getgrnam.gethostbyaddr.gethostbyname.gethostent.getlogin.getnetbyaddr.getnetbyname.getnetent.getpeername.getpgrp.getpriority.getprotobyname.getprotobynumber.getprotoent.getpwent.getpwnam.getpwuid.getservbyname.getservbyport.getservent.getsockname.getsockopt.given.glob.gmtime.goto.grep.gt.hex.if.index.int.ioctl.join.keys.kill.last.lc.lcfirst.length.link.listen.local.localtime.log.lstat.lt.ma.map.method.mkdir.msgctl.msgget.msgrcv.msgsnd.my.ne.next.no.not.oct.open.opendir.or.ord.our.pack.package.pipe.pop.pos.print.printf.prototype.push.q|0.qq.quotemeta.qw.qx.rand.read.readdir.readline.readlink.readpipe.recv.redo.ref.rename.require.reset.return.reverse.rewinddir.rindex.rmdir.say.scalar.seek.seekdir.select.semctl.semget.semop.send.setgrent.sethostent.setnetent.setpgrp.setpriority.setprotoent.setpwent.setservent.setsockopt.shift.shmctl.shmget.shmread.shmwrite.shutdown.sin.sleep.socket.socketpair.sort.splice.split.sprintf.sqrt.srand.stat.state.study.sub.substr.symlink.syscall.sysopen.sysread.sysseek.system.syswrite.tell.telldir.tie.tied.time.times.tr.truncate.uc.ucfirst.umask.undef.unless.unlink.unpack.unshift.untie.until.use.utime.values.vec.wait.waitpid.wantarray.warn.when.while.write.x|0.xor.y|0".split("."), r = /[dualxmsipngr]{0,12}/, i = {
			$pattern: /[\w.]+/,
			keyword: n.join(" ")
		}, a = {
			className: "subst",
			begin: "[$@]\\{",
			end: "\\}",
			keywords: i
		}, o = {
			begin: /->\{/,
			end: /\}/
		}, s = {
			scope: "attr",
			match: /\s+:\s*\w+(\s*\(.*?\))?/
		}, c = {
			scope: "variable",
			variants: [
				{ begin: /\$\d/ },
				{ begin: t.concat(/[$%@](?!")(\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/, "(?![A-Za-z])(?![@$%])") },
				{
					begin: /[$%@](?!")[^\s\w{=]|\$=/,
					relevance: 0
				}
			],
			contains: [s]
		}, l = {
			className: "number",
			variants: [
				{ match: /0?\.[0-9][0-9_]+\b/ },
				{ match: /\bv?(0|[1-9][0-9_]*(\.[0-9_]+)?|[1-9][0-9_]*)\b/ },
				{ match: /\b0[0-7][0-7_]*\b/ },
				{ match: /\b0x[0-9a-fA-F][0-9a-fA-F_]*\b/ },
				{ match: /\b0b[0-1][0-1_]*\b/ }
			],
			relevance: 0
		}, u = [
			e.BACKSLASH_ESCAPE,
			a,
			c
		], d = [
			/!/,
			/\//,
			/\|/,
			/\?/,
			/'/,
			/"/,
			/#/
		], f = (e, n, i = "\\1") => {
			let a = i === "\\1" ? i : t.concat(i, n);
			return t.concat(t.concat("(?:", e, ")"), n, /(?:\\.|[^\\\/])*?/, a, /(?:\\.|[^\\\/])*?/, i, r);
		}, p = (e, n, i) => t.concat(t.concat("(?:", e, ")"), n, /(?:\\.|[^\\\/])*?/, i, r), m = [
			c,
			e.HASH_COMMENT_MODE,
			e.COMMENT(/^=\w/, /=cut/, { endsWithParent: !0 }),
			o,
			{
				className: "string",
				contains: u,
				variants: [
					{
						begin: "q[qwxr]?\\s*\\(",
						end: "\\)",
						relevance: 5
					},
					{
						begin: "q[qwxr]?\\s*\\[",
						end: "\\]",
						relevance: 5
					},
					{
						begin: "q[qwxr]?\\s*\\{",
						end: "\\}",
						relevance: 5
					},
					{
						begin: "q[qwxr]?\\s*\\|",
						end: "\\|",
						relevance: 5
					},
					{
						begin: "q[qwxr]?\\s*<",
						end: ">",
						relevance: 5
					},
					{
						begin: "qw\\s+q",
						end: "q",
						relevance: 5
					},
					{
						begin: "'",
						end: "'",
						contains: [e.BACKSLASH_ESCAPE]
					},
					{
						begin: "\"",
						end: "\""
					},
					{
						begin: "`",
						end: "`",
						contains: [e.BACKSLASH_ESCAPE]
					},
					{
						begin: /\{\w+\}/,
						relevance: 0
					},
					{
						begin: "-?\\w+\\s*=>",
						relevance: 0
					}
				]
			},
			l,
			{
				begin: "(\\/\\/|" + e.RE_STARTERS_RE + "|\\b(split|return|print|reverse|grep)\\b)\\s*",
				keywords: "split return print reverse grep",
				relevance: 0,
				contains: [
					e.HASH_COMMENT_MODE,
					{
						className: "regexp",
						variants: [
							{ begin: f("s|tr|y", t.either(...d, { capture: !0 })) },
							{ begin: f("s|tr|y", "\\(", "\\)") },
							{ begin: f("s|tr|y", "\\[", "\\]") },
							{ begin: f("s|tr|y", "\\{", "\\}") }
						],
						relevance: 2
					},
					{
						className: "regexp",
						variants: [
							{
								begin: /(m|qr)\/\//,
								relevance: 0
							},
							{ begin: p("(?:m|qr)?", /\//, /\//) },
							{ begin: p("m|qr", t.either(...d, { capture: !0 }), /\1/) },
							{ begin: p("m|qr", /\(/, /\)/) },
							{ begin: p("m|qr", /\[/, /\]/) },
							{ begin: p("m|qr", /\{/, /\}/) }
						]
					}
				]
			},
			{
				className: "function",
				beginKeywords: "sub method",
				end: "(\\s*\\(.*?\\))?[;{]",
				excludeEnd: !0,
				relevance: 5,
				contains: [e.TITLE_MODE, s]
			},
			{
				className: "class",
				beginKeywords: "class",
				end: "[;{]",
				excludeEnd: !0,
				relevance: 5,
				contains: [
					e.TITLE_MODE,
					s,
					l
				]
			},
			{
				begin: "-\\w\\b",
				relevance: 0
			},
			{
				begin: "^__DATA__$",
				end: "^__END__$",
				subLanguage: "mojolicious",
				contains: [{
					begin: "^@@.*",
					end: "$",
					className: "comment"
				}]
			}
		];
		return a.contains = m, o.contains = m, {
			name: "Perl",
			aliases: ["pl", "pm"],
			keywords: i,
			contains: m
		};
	}
	t.exports = n;
})), Yg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = {
			className: "built_in",
			begin: "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"
		}, n = /[a-zA-Z@][a-zA-Z0-9_]*/, r = {
			"variable.language": ["this", "super"],
			$pattern: n,
			keyword: /* @__PURE__ */ "while.export.sizeof.typedef.const.struct.for.union.volatile.static.mutable.if.do.return.goto.enum.else.break.extern.asm.case.default.register.explicit.typename.switch.continue.inline.readonly.assign.readwrite.self.@synchronized.id.typeof.nonatomic.IBOutlet.IBAction.strong.weak.copy.in.out.inout.bycopy.byref.oneway.__strong.__weak.__block.__autoreleasing.@private.@protected.@public.@try.@property.@end.@throw.@catch.@finally.@autoreleasepool.@synthesize.@dynamic.@selector.@optional.@required.@encode.@package.@import.@defs.@compatibility_alias.__bridge.__bridge_transfer.__bridge_retained.__bridge_retain.__covariant.__contravariant.__kindof._Nonnull._Nullable._Null_unspecified.__FUNCTION__.__PRETTY_FUNCTION__.__attribute__.getter.setter.retain.unsafe_unretained.nonnull.nullable.null_unspecified.null_resettable.class.instancetype.NS_DESIGNATED_INITIALIZER.NS_UNAVAILABLE.NS_REQUIRES_SUPER.NS_RETURNS_INNER_POINTER.NS_INLINE.NS_AVAILABLE.NS_DEPRECATED.NS_ENUM.NS_OPTIONS.NS_SWIFT_UNAVAILABLE.NS_ASSUME_NONNULL_BEGIN.NS_ASSUME_NONNULL_END.NS_REFINED_FOR_SWIFT.NS_SWIFT_NAME.NS_SWIFT_NOTHROW.NS_DURING.NS_HANDLER.NS_ENDHANDLER.NS_VALUERETURN.NS_VOIDRETURN".split("."),
			literal: [
				"false",
				"true",
				"FALSE",
				"TRUE",
				"nil",
				"YES",
				"NO",
				"NULL"
			],
			built_in: [
				"dispatch_once_t",
				"dispatch_queue_t",
				"dispatch_sync",
				"dispatch_async",
				"dispatch_once"
			],
			type: [
				"int",
				"float",
				"char",
				"unsigned",
				"signed",
				"short",
				"long",
				"double",
				"wchar_t",
				"unichar",
				"void",
				"bool",
				"BOOL",
				"id|0",
				"_Bool"
			]
		}, i = {
			$pattern: n,
			keyword: [
				"@interface",
				"@class",
				"@protocol",
				"@implementation"
			]
		};
		return {
			name: "Objective-C",
			aliases: [
				"mm",
				"objc",
				"obj-c",
				"obj-c++",
				"objective-c++"
			],
			keywords: r,
			illegal: "</",
			contains: [
				t,
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				e.C_NUMBER_MODE,
				e.QUOTE_STRING_MODE,
				e.APOS_STRING_MODE,
				{
					className: "string",
					variants: [{
						begin: "@\"",
						end: "\"",
						illegal: "\\n",
						contains: [e.BACKSLASH_ESCAPE]
					}]
				},
				{
					className: "meta",
					begin: /#\s*[a-z]+\b/,
					end: /$/,
					keywords: { keyword: "if else elif endif define undef warning error line pragma ifdef ifndef include" },
					contains: [
						{
							begin: /\\\n/,
							relevance: 0
						},
						e.inherit(e.QUOTE_STRING_MODE, { className: "string" }),
						{
							className: "string",
							begin: /<.*?>/,
							end: /$/,
							illegal: "\\n"
						},
						e.C_LINE_COMMENT_MODE,
						e.C_BLOCK_COMMENT_MODE
					]
				},
				{
					className: "class",
					begin: "(" + i.keyword.join("|") + ")\\b",
					end: /(\{|$)/,
					excludeEnd: !0,
					keywords: i,
					contains: [e.UNDERSCORE_TITLE_MODE]
				},
				{
					begin: "\\." + e.UNDERSCORE_IDENT_RE,
					relevance: 0
				}
			]
		};
	}
	t.exports = n;
})), Xg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = /(?![A-Za-z0-9])(?![$])/, r = t.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/, n), i = t.concat(/(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/, n), a = t.concat(/[A-Z]+/, n), o = {
			scope: "variable",
			match: "\\$+" + r
		}, s = {
			scope: "meta",
			variants: [
				{
					begin: /<\?php/,
					relevance: 10
				},
				{ begin: /<\?=/ },
				{
					begin: /<\?/,
					relevance: .1
				},
				{ begin: /\?>/ }
			]
		}, c = {
			scope: "subst",
			variants: [{ begin: /\$\w+/ }, {
				begin: /\{\$/,
				end: /\}/
			}]
		}, l = e.inherit(e.APOS_STRING_MODE, { illegal: null }), u = e.inherit(e.QUOTE_STRING_MODE, {
			illegal: null,
			contains: e.QUOTE_STRING_MODE.contains.concat(c)
		}), d = {
			begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
			end: /[ \t]*(\w+)\b/,
			contains: e.QUOTE_STRING_MODE.contains.concat(c),
			"on:begin": (e, t) => {
				t.data._beginMatch = e[1] || e[2];
			},
			"on:end": (e, t) => {
				t.data._beginMatch !== e[1] && t.ignoreMatch();
			}
		}, f = e.END_SAME_AS_BEGIN({
			begin: /<<<[ \t]*'(\w+)'\n/,
			end: /[ \t]*(\w+)\b/
		}), p = "[ 	\n]", m = {
			scope: "string",
			variants: [
				u,
				l,
				d,
				f
			]
		}, h = {
			scope: "number",
			variants: [
				{ begin: "\\b0[bB][01]+(?:_[01]+)*\\b" },
				{ begin: "\\b0[oO][0-7]+(?:_[0-7]+)*\\b" },
				{ begin: "\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b" },
				{ begin: "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?" }
			],
			relevance: 0
		}, g = [
			"false",
			"null",
			"true"
		], _ = /* @__PURE__ */ "__CLASS__.__DIR__.__FILE__.__FUNCTION__.__COMPILER_HALT_OFFSET__.__LINE__.__METHOD__.__NAMESPACE__.__TRAIT__.die.echo.exit.include.include_once.print.require.require_once.array.abstract.and.as.binary.bool.boolean.break.callable.case.catch.class.clone.const.continue.declare.default.do.double.else.elseif.empty.enddeclare.endfor.endforeach.endif.endswitch.endwhile.enum.eval.extends.final.finally.float.for.foreach.from.global.goto.if.implements.instanceof.insteadof.int.integer.interface.isset.iterable.list.match|0.mixed.new.never.object.or.private.protected.public.readonly.real.return.string.switch.throw.trait.try.unset.use.var.void.while.xor.yield".split("."), v = /* @__PURE__ */ "Error|0.AppendIterator.ArgumentCountError.ArithmeticError.ArrayIterator.ArrayObject.AssertionError.BadFunctionCallException.BadMethodCallException.CachingIterator.CallbackFilterIterator.CompileError.Countable.DirectoryIterator.DivisionByZeroError.DomainException.EmptyIterator.ErrorException.Exception.FilesystemIterator.FilterIterator.GlobIterator.InfiniteIterator.InvalidArgumentException.IteratorIterator.LengthException.LimitIterator.LogicException.MultipleIterator.NoRewindIterator.OutOfBoundsException.OutOfRangeException.OuterIterator.OverflowException.ParentIterator.ParseError.RangeException.RecursiveArrayIterator.RecursiveCachingIterator.RecursiveCallbackFilterIterator.RecursiveDirectoryIterator.RecursiveFilterIterator.RecursiveIterator.RecursiveIteratorIterator.RecursiveRegexIterator.RecursiveTreeIterator.RegexIterator.RuntimeException.SeekableIterator.SplDoublyLinkedList.SplFileInfo.SplFileObject.SplFixedArray.SplHeap.SplMaxHeap.SplMinHeap.SplObjectStorage.SplObserver.SplPriorityQueue.SplQueue.SplStack.SplSubject.SplTempFileObject.TypeError.UnderflowException.UnexpectedValueException.UnhandledMatchError.ArrayAccess.BackedEnum.Closure.Fiber.Generator.Iterator.IteratorAggregate.Serializable.Stringable.Throwable.Traversable.UnitEnum.WeakReference.WeakMap.Directory.__PHP_Incomplete_Class.parent.php_user_filter.self.static.stdClass".split("."), y = {
			keyword: _,
			literal: ((e) => {
				let t = [];
				return e.forEach((e) => {
					t.push(e), e.toLowerCase() === e ? t.push(e.toUpperCase()) : t.push(e.toLowerCase());
				}), t;
			})(g),
			built_in: v
		}, b = (e) => e.map((e) => e.replace(/\|\d+$/, "")), x = { variants: [{
			match: [
				/new/,
				t.concat(p, "+"),
				t.concat("(?!", b(v).join("\\b|"), "\\b)"),
				i
			],
			scope: {
				1: "keyword",
				4: "title.class"
			}
		}] }, S = t.concat(r, "\\b(?!\\()"), ee = { variants: [
			{
				match: [t.concat(/::/, t.lookahead(/(?!class\b)/)), S],
				scope: { 2: "variable.constant" }
			},
			{
				match: [/::/, /class/],
				scope: { 2: "variable.language" }
			},
			{
				match: [
					i,
					t.concat(/::/, t.lookahead(/(?!class\b)/)),
					S
				],
				scope: {
					1: "title.class",
					3: "variable.constant"
				}
			},
			{
				match: [i, t.concat("::", t.lookahead(/(?!class\b)/))],
				scope: { 1: "title.class" }
			},
			{
				match: [
					i,
					/::/,
					/class/
				],
				scope: {
					1: "title.class",
					3: "variable.language"
				}
			}
		] }, te = {
			scope: "attr",
			match: t.concat(r, t.lookahead(":"), t.lookahead(/(?!::)/))
		}, C = {
			relevance: 0,
			begin: /\(/,
			end: /\)/,
			keywords: y,
			contains: [
				te,
				o,
				ee,
				e.C_BLOCK_COMMENT_MODE,
				e.C_LINE_COMMENT_MODE,
				e.HASH_COMMENT_MODE,
				m,
				h,
				x
			]
		}, w = {
			relevance: 0,
			match: [
				/\b/,
				t.concat("(?!fn\\b|function\\b|", b(_).join("\\b|"), "|", b(v).join("\\b|"), "\\b)"),
				r,
				t.concat(p, "*"),
				t.lookahead(/(?=\()/)
			],
			scope: { 3: "title.function.invoke" },
			contains: [C]
		};
		C.contains.push(w);
		let ne = [
			te,
			ee,
			e.C_BLOCK_COMMENT_MODE,
			e.C_LINE_COMMENT_MODE,
			e.HASH_COMMENT_MODE,
			m,
			h,
			x
		], re = {
			begin: t.concat(/#\[\s*\\?/, t.either(i, a)),
			beginScope: "meta",
			end: /]/,
			endScope: "meta",
			keywords: {
				literal: g,
				keyword: ["new", "array"]
			},
			contains: [
				{
					begin: /\[/,
					end: /]/,
					keywords: {
						literal: g,
						keyword: ["new", "array"]
					},
					contains: ["self", ...ne]
				},
				...ne,
				{
					scope: "meta",
					variants: [{ match: i }, { match: a }]
				}
			]
		};
		return {
			case_insensitive: !1,
			keywords: y,
			contains: [
				re,
				e.HASH_COMMENT_MODE,
				e.COMMENT("//", "$"),
				e.COMMENT("/\\*", "\\*/", { contains: [{
					scope: "doctag",
					match: "@[A-Za-z]+"
				}] }),
				{
					match: /__halt_compiler\(\);/,
					keywords: "__halt_compiler",
					starts: {
						scope: "comment",
						end: e.MATCH_NOTHING_RE,
						contains: [{
							match: /\?>/,
							scope: "meta",
							endsParent: !0
						}]
					}
				},
				s,
				{
					scope: "variable.language",
					match: /\$this\b/
				},
				o,
				w,
				ee,
				{
					match: [
						/const/,
						/\s/,
						r
					],
					scope: {
						1: "keyword",
						3: "variable.constant"
					}
				},
				x,
				{
					scope: "function",
					relevance: 0,
					beginKeywords: "fn function",
					end: /[;{]/,
					excludeEnd: !0,
					illegal: "[$%\\[]",
					contains: [
						{ beginKeywords: "use" },
						e.UNDERSCORE_TITLE_MODE,
						{
							begin: "=>",
							endsParent: !0
						},
						{
							scope: "params",
							begin: "\\(",
							end: "\\)",
							excludeBegin: !0,
							excludeEnd: !0,
							keywords: y,
							contains: [
								"self",
								re,
								o,
								ee,
								e.C_BLOCK_COMMENT_MODE,
								e.C_LINE_COMMENT_MODE,
								e.HASH_COMMENT_MODE,
								m,
								h
							]
						}
					]
				},
				{
					scope: "class",
					variants: [{
						beginKeywords: "enum",
						illegal: /[($"]/
					}, {
						beginKeywords: "class interface trait",
						illegal: /[:($"]/
					}],
					relevance: 0,
					end: /\{/,
					excludeEnd: !0,
					contains: [{ beginKeywords: "extends implements" }, e.UNDERSCORE_TITLE_MODE]
				},
				{
					beginKeywords: "namespace",
					relevance: 0,
					end: ";",
					illegal: /[.']/,
					contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
				},
				{
					beginKeywords: "use",
					relevance: 0,
					end: ";",
					contains: [{
						match: /\b(as|const|function)\b/,
						scope: "keyword"
					}, e.UNDERSCORE_TITLE_MODE]
				},
				m,
				h
			]
		};
	}
	t.exports = n;
})), Zg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return {
			name: "PHP template",
			subLanguage: "xml",
			contains: [{
				begin: /<\?(php|=)?/,
				end: /\?>/,
				subLanguage: "php",
				contains: [
					{
						begin: "/\\*",
						end: "\\*/",
						skip: !0
					},
					{
						begin: "b\"",
						end: "\"",
						skip: !0
					},
					{
						begin: "b'",
						end: "'",
						skip: !0
					},
					e.inherit(e.APOS_STRING_MODE, {
						illegal: null,
						className: null,
						contains: null,
						skip: !0
					}),
					e.inherit(e.QUOTE_STRING_MODE, {
						illegal: null,
						className: null,
						contains: null,
						skip: !0
					})
				]
			}]
		};
	}
	t.exports = n;
})), Qg = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return {
			name: "Plain text",
			aliases: ["text", "txt"],
			disableAutodetect: !0
		};
	}
	t.exports = n;
})), $g = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = /[\p{XID_Start}_]\p{XID_Continue}*/u, r = /* @__PURE__ */ "and.as.assert.async.await.break.case.class.continue.def.del.elif.else.except.finally.for.from.global.if.import.in.is.lambda.match.nonlocal|10.not.or.pass.raise.return.try.while.with.yield".split("."), i = {
			$pattern: /[A-Za-z]\w+|__\w+__/,
			keyword: r,
			built_in: /* @__PURE__ */ "__import__.abs.all.any.ascii.bin.bool.breakpoint.bytearray.bytes.callable.chr.classmethod.compile.complex.delattr.dict.dir.divmod.enumerate.eval.exec.filter.float.format.frozenset.getattr.globals.hasattr.hash.help.hex.id.input.int.isinstance.issubclass.iter.len.list.locals.map.max.memoryview.min.next.object.oct.open.ord.pow.print.property.range.repr.reversed.round.set.setattr.slice.sorted.staticmethod.str.sum.super.tuple.type.vars.zip".split("."),
			literal: [
				"__debug__",
				"Ellipsis",
				"False",
				"None",
				"NotImplemented",
				"True"
			],
			type: [
				"Any",
				"Callable",
				"Coroutine",
				"Dict",
				"List",
				"Literal",
				"Generic",
				"Optional",
				"Sequence",
				"Set",
				"Tuple",
				"Type",
				"Union"
			]
		}, a = {
			className: "meta",
			begin: /^(>>>|\.\.\.) /
		}, o = {
			className: "subst",
			begin: /\{/,
			end: /\}/,
			keywords: i,
			illegal: /#/
		}, s = {
			begin: /\{\{/,
			relevance: 0
		}, c = {
			className: "string",
			contains: [e.BACKSLASH_ESCAPE],
			variants: [
				{
					begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
					end: /'''/,
					contains: [e.BACKSLASH_ESCAPE, a],
					relevance: 10
				},
				{
					begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
					end: /"""/,
					contains: [e.BACKSLASH_ESCAPE, a],
					relevance: 10
				},
				{
					begin: /([fF][rR]|[rR][fF]|[fF])'''/,
					end: /'''/,
					contains: [
						e.BACKSLASH_ESCAPE,
						a,
						s,
						o
					]
				},
				{
					begin: /([fF][rR]|[rR][fF]|[fF])"""/,
					end: /"""/,
					contains: [
						e.BACKSLASH_ESCAPE,
						a,
						s,
						o
					]
				},
				{
					begin: /([uU]|[rR])'/,
					end: /'/,
					relevance: 10
				},
				{
					begin: /([uU]|[rR])"/,
					end: /"/,
					relevance: 10
				},
				{
					begin: /([bB]|[bB][rR]|[rR][bB])'/,
					end: /'/
				},
				{
					begin: /([bB]|[bB][rR]|[rR][bB])"/,
					end: /"/
				},
				{
					begin: /([fF][rR]|[rR][fF]|[fF])'/,
					end: /'/,
					contains: [
						e.BACKSLASH_ESCAPE,
						s,
						o
					]
				},
				{
					begin: /([fF][rR]|[rR][fF]|[fF])"/,
					end: /"/,
					contains: [
						e.BACKSLASH_ESCAPE,
						s,
						o
					]
				},
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE
			]
		}, l = "[0-9](_?[0-9])*", u = `(\\b(${l}))?\\.(${l})|\\b(${l})\\.`, d = `\\b|${r.join("|")}`, f = {
			className: "number",
			relevance: 0,
			variants: [
				{ begin: `(\\b(${l})|(${u}))[eE][+-]?(${l})[jJ]?(?=${d})` },
				{ begin: `(${u})[jJ]?` },
				{ begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${d})` },
				{ begin: `\\b0[bB](_?[01])+[lL]?(?=${d})` },
				{ begin: `\\b0[oO](_?[0-7])+[lL]?(?=${d})` },
				{ begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${d})` },
				{ begin: `\\b(${l})[jJ](?=${d})` }
			]
		}, p = {
			className: "comment",
			begin: t.lookahead(/# type:/),
			end: /$/,
			keywords: i,
			contains: [{ begin: /# type:/ }, {
				begin: /#/,
				end: /\b\B/,
				endsWithParent: !0
			}]
		}, m = {
			className: "params",
			variants: [{
				className: "",
				begin: /\(\s*\)/,
				skip: !0
			}, {
				begin: /\(/,
				end: /\)/,
				excludeBegin: !0,
				excludeEnd: !0,
				keywords: i,
				contains: [
					"self",
					a,
					f,
					c,
					e.HASH_COMMENT_MODE
				]
			}]
		};
		return o.contains = [
			c,
			f,
			a
		], {
			name: "Python",
			aliases: [
				"py",
				"gyp",
				"ipython"
			],
			unicodeRegex: !0,
			keywords: i,
			illegal: /(<\/|\?)|=>/,
			contains: [
				a,
				f,
				{
					scope: "variable.language",
					match: /\bself\b/
				},
				{
					beginKeywords: "if",
					relevance: 0
				},
				{
					match: /\bor\b/,
					scope: "keyword"
				},
				c,
				p,
				e.HASH_COMMENT_MODE,
				{
					match: [
						/\bdef/,
						/\s+/,
						n
					],
					scope: {
						1: "keyword",
						3: "title.function"
					},
					contains: [m]
				},
				{
					variants: [{ match: [
						/\bclass/,
						/\s+/,
						n,
						/\s*/,
						/\(\s*/,
						n,
						/\s*\)/
					] }, { match: [
						/\bclass/,
						/\s+/,
						n
					] }],
					scope: {
						1: "keyword",
						3: "title.class",
						6: "title.class.inherited"
					}
				},
				{
					className: "meta",
					begin: /^[\t ]*@/,
					end: /(?=#)|$/,
					contains: [
						f,
						m,
						c
					]
				}
			]
		};
	}
	t.exports = n;
})), e_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return {
			aliases: ["pycon"],
			contains: [{
				className: "meta.prompt",
				starts: {
					end: / |$/,
					starts: {
						end: "$",
						subLanguage: "python"
					}
				},
				variants: [{ begin: /^>>>(?=[ ]|$)/ }, { begin: /^\.\.\.(?=[ ]|$)/ }]
			}]
		};
	}
	t.exports = n;
})), t_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/, r = t.either(/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/, /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/, /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/), i = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/, a = t.either(/[()]/, /[{}]/, /\[\[/, /[[\]]/, /\\/, /,/);
		return {
			name: "R",
			keywords: {
				$pattern: n,
				keyword: "function if in break next repeat else for while",
				literal: "NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
				built_in: "LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"
			},
			contains: [
				e.COMMENT(/#'/, /$/, { contains: [
					{
						scope: "doctag",
						match: /@examples/,
						starts: {
							end: t.lookahead(t.either(/\n^#'\s*(?=@[a-zA-Z]+)/, /\n^(?!#')/)),
							endsParent: !0
						}
					},
					{
						scope: "doctag",
						begin: "@param",
						end: /$/,
						contains: [{
							scope: "variable",
							variants: [{ match: n }, { match: /`(?:\\.|[^`\\])+`/ }],
							endsParent: !0
						}]
					},
					{
						scope: "doctag",
						match: /@[a-zA-Z]+/
					},
					{
						scope: "keyword",
						match: /\\[a-zA-Z]+/
					}
				] }),
				e.HASH_COMMENT_MODE,
				{
					scope: "string",
					contains: [e.BACKSLASH_ESCAPE],
					variants: [
						e.END_SAME_AS_BEGIN({
							begin: /[rR]"(-*)\(/,
							end: /\)(-*)"/
						}),
						e.END_SAME_AS_BEGIN({
							begin: /[rR]"(-*)\{/,
							end: /\}(-*)"/
						}),
						e.END_SAME_AS_BEGIN({
							begin: /[rR]"(-*)\[/,
							end: /\](-*)"/
						}),
						e.END_SAME_AS_BEGIN({
							begin: /[rR]'(-*)\(/,
							end: /\)(-*)'/
						}),
						e.END_SAME_AS_BEGIN({
							begin: /[rR]'(-*)\{/,
							end: /\}(-*)'/
						}),
						e.END_SAME_AS_BEGIN({
							begin: /[rR]'(-*)\[/,
							end: /\](-*)'/
						}),
						{
							begin: "\"",
							end: "\"",
							relevance: 0
						},
						{
							begin: "'",
							end: "'",
							relevance: 0
						}
					]
				},
				{
					relevance: 0,
					variants: [
						{
							scope: {
								1: "operator",
								2: "number"
							},
							match: [i, r]
						},
						{
							scope: {
								1: "operator",
								2: "number"
							},
							match: [/%[^%]*%/, r]
						},
						{
							scope: {
								1: "punctuation",
								2: "number"
							},
							match: [a, r]
						},
						{
							scope: { 2: "number" },
							match: [/[^a-zA-Z0-9._]|^/, r]
						}
					]
				},
				{
					scope: { 3: "operator" },
					match: [
						n,
						/\s+/,
						/<-/,
						/\s+/
					]
				},
				{
					scope: "operator",
					relevance: 0,
					variants: [{ match: i }, { match: /%[^%]*%/ }]
				},
				{
					scope: "punctuation",
					relevance: 0,
					match: a
				},
				{
					begin: "`",
					end: "`",
					contains: [{ begin: /\\./ }]
				}
			]
		};
	}
	t.exports = n;
})), n_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = /(r#)?/, r = t.concat(n, e.UNDERSCORE_IDENT_RE), i = t.concat(n, e.IDENT_RE), a = {
			className: "title.function.invoke",
			relevance: 0,
			begin: t.concat(/\b/, /(?!let|for|while|if|else|match\b)/, i, t.lookahead(/\s*\(/))
		}, o = "([ui](8|16|32|64|128|size)|f(32|64))?", s = /* @__PURE__ */ "abstract.as.async.await.become.box.break.const.continue.crate.do.dyn.else.enum.extern.false.final.fn.for.if.impl.in.let.loop.macro.match.mod.move.mut.override.priv.pub.ref.return.self.Self.static.struct.super.trait.true.try.type.typeof.union.unsafe.unsized.use.virtual.where.while.yield".split("."), c = [
			"true",
			"false",
			"Some",
			"None",
			"Ok",
			"Err"
		], l = /* @__PURE__ */ "drop .Copy.Send.Sized.Sync.Drop.Fn.FnMut.FnOnce.ToOwned.Clone.Debug.PartialEq.PartialOrd.Eq.Ord.AsRef.AsMut.Into.From.Default.Iterator.Extend.IntoIterator.DoubleEndedIterator.ExactSizeIterator.SliceConcatExt.ToString.assert!.assert_eq!.bitflags!.bytes!.cfg!.col!.concat!.concat_idents!.debug_assert!.debug_assert_eq!.env!.eprintln!.panic!.file!.format!.format_args!.include_bytes!.include_str!.line!.local_data_key!.module_path!.option_env!.print!.println!.select!.stringify!.try!.unimplemented!.unreachable!.vec!.write!.writeln!.macro_rules!.assert_ne!.debug_assert_ne!".split("."), u = [
			"i8",
			"i16",
			"i32",
			"i64",
			"i128",
			"isize",
			"u8",
			"u16",
			"u32",
			"u64",
			"u128",
			"usize",
			"f32",
			"f64",
			"str",
			"char",
			"bool",
			"Box",
			"Option",
			"Result",
			"String",
			"Vec"
		];
		return {
			name: "Rust",
			aliases: ["rs"],
			keywords: {
				$pattern: e.IDENT_RE + "!?",
				type: u,
				keyword: s,
				literal: c,
				built_in: l
			},
			illegal: "</",
			contains: [
				e.C_LINE_COMMENT_MODE,
				e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
				e.inherit(e.QUOTE_STRING_MODE, {
					begin: /b?"/,
					illegal: null
				}),
				{
					className: "symbol",
					begin: /'[a-zA-Z_][a-zA-Z0-9_]*(?!')/
				},
				{
					scope: "string",
					variants: [{ begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ }, {
						begin: /b?'/,
						end: /'/,
						contains: [{
							scope: "char.escape",
							match: /\\('|\w|x\w{2}|u\w{4}|U\w{8})/
						}]
					}]
				},
				{
					className: "number",
					variants: [
						{ begin: "\\b0b([01_]+)" + o },
						{ begin: "\\b0o([0-7_]+)" + o },
						{ begin: "\\b0x([A-Fa-f0-9_]+)" + o },
						{ begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + o }
					],
					relevance: 0
				},
				{
					begin: [
						/fn/,
						/\s+/,
						r
					],
					className: {
						1: "keyword",
						3: "title.function"
					}
				},
				{
					className: "meta",
					begin: "#!?\\[",
					end: "\\]",
					contains: [{
						className: "string",
						begin: /"/,
						end: /"/,
						contains: [e.BACKSLASH_ESCAPE]
					}]
				},
				{
					begin: [
						/let/,
						/\s+/,
						/(?:mut\s+)?/,
						r
					],
					className: {
						1: "keyword",
						3: "keyword",
						4: "variable"
					}
				},
				{
					begin: [
						/for/,
						/\s+/,
						r,
						/\s+/,
						/in/
					],
					className: {
						1: "keyword",
						3: "variable",
						5: "keyword"
					}
				},
				{
					begin: [
						/type/,
						/\s+/,
						r
					],
					className: {
						1: "keyword",
						3: "title.class"
					}
				},
				{
					begin: [
						/(?:trait|enum|struct|union|impl|for)/,
						/\s+/,
						r
					],
					className: {
						1: "keyword",
						3: "title.class"
					}
				},
				{
					begin: e.IDENT_RE + "::",
					keywords: {
						keyword: "Self",
						built_in: l,
						type: u
					}
				},
				{
					className: "punctuation",
					begin: "->"
				},
				a
			]
		};
	}
	t.exports = n;
})), r_ = /* @__PURE__ */ o(((e, t) => {
	var n = (e) => ({
		IMPORTANT: {
			scope: "meta",
			begin: "!important"
		},
		BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
		HEXCOLOR: {
			scope: "number",
			begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
		},
		UNICODE_RANGE: {
			scope: "number",
			begin: /\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,4}(-[0-9A-Fa-f][0-9A-Fa-f]{0,4})?/
		},
		FUNCTION_DISPATCH: {
			className: "built_in",
			begin: /[\w-]+(?=\()/
		},
		ATTRIBUTE_SELECTOR_MODE: {
			scope: "selector-attr",
			begin: /\[/,
			end: /\]/,
			illegal: "$",
			contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
		},
		CSS_NUMBER_MODE: {
			scope: "number",
			begin: e.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
			relevance: 0
		},
		CSS_VARIABLE: {
			className: "attr",
			begin: /--[A-Za-z_][A-Za-z0-9_-]*/
		}
	}), r = /* @__PURE__ */ "a.abbr.address.article.aside.audio.b.blockquote.body.button.canvas.caption.cite.code.dd.del.details.dfn.div.dl.dt.em.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.hgroup.html.i.iframe.img.input.ins.kbd.label.legend.li.main.mark.menu.nav.object.ol.optgroup.option.p.picture.q.quote.samp.section.select.source.span.strong.summary.sup.table.tbody.td.textarea.tfoot.th.thead.time.tr.ul.var.video".split("."), i = /* @__PURE__ */ "defs.g.marker.mask.pattern.svg.switch.symbol.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feFlood.feGaussianBlur.feImage.feMerge.feMorphology.feOffset.feSpecularLighting.feTile.feTurbulence.linearGradient.radialGradient.stop.circle.ellipse.image.line.path.polygon.polyline.rect.text.use.textPath.tspan.foreignObject.clipPath".split("."), a = [...r, ...i], o = (/* @__PURE__ */ "any-hover.any-pointer.aspect-ratio.color.color-gamut.color-index.device-aspect-ratio.device-height.device-width.display-mode.forced-colors.grid.height.hover.inverted-colors.monochrome.orientation.overflow-block.overflow-inline.pointer.prefers-color-scheme.prefers-contrast.prefers-reduced-motion.prefers-reduced-transparency.resolution.scan.scripting.update.width.min-width.max-width.min-height.max-height".split(".")).sort().reverse(), s = (/* @__PURE__ */ "active.any-link.blank.checked.current.default.defined.dir.disabled.drop.empty.enabled.first.first-child.first-of-type.fullscreen.future.focus.focus-visible.focus-within.has.host.host-context.hover.indeterminate.in-range.invalid.is.lang.last-child.last-of-type.left.link.local-link.not.nth-child.nth-col.nth-last-child.nth-last-col.nth-last-of-type.nth-of-type.only-child.only-of-type.optional.out-of-range.past.placeholder-shown.read-only.read-write.required.right.root.scope.target.target-within.user-invalid.valid.visited.where".split(".")).sort().reverse(), c = [
		"after",
		"backdrop",
		"before",
		"cue",
		"cue-region",
		"first-letter",
		"first-line",
		"grammar-error",
		"marker",
		"part",
		"placeholder",
		"selection",
		"slotted",
		"spelling-error"
	].sort().reverse(), l = (/* @__PURE__ */ "accent-color.align-content.align-items.align-self.alignment-baseline.all.anchor-name.animation.animation-composition.animation-delay.animation-direction.animation-duration.animation-fill-mode.animation-iteration-count.animation-name.animation-play-state.animation-range.animation-range-end.animation-range-start.animation-timeline.animation-timing-function.appearance.aspect-ratio.backdrop-filter.backface-visibility.background.background-attachment.background-blend-mode.background-clip.background-color.background-image.background-origin.background-position.background-position-x.background-position-y.background-repeat.background-size.baseline-shift.block-size.border.border-block.border-block-color.border-block-end.border-block-end-color.border-block-end-style.border-block-end-width.border-block-start.border-block-start-color.border-block-start-style.border-block-start-width.border-block-style.border-block-width.border-bottom.border-bottom-color.border-bottom-left-radius.border-bottom-right-radius.border-bottom-style.border-bottom-width.border-collapse.border-color.border-end-end-radius.border-end-start-radius.border-image.border-image-outset.border-image-repeat.border-image-slice.border-image-source.border-image-width.border-inline.border-inline-color.border-inline-end.border-inline-end-color.border-inline-end-style.border-inline-end-width.border-inline-start.border-inline-start-color.border-inline-start-style.border-inline-start-width.border-inline-style.border-inline-width.border-left.border-left-color.border-left-style.border-left-width.border-radius.border-right.border-right-color.border-right-style.border-right-width.border-spacing.border-start-end-radius.border-start-start-radius.border-style.border-top.border-top-color.border-top-left-radius.border-top-right-radius.border-top-style.border-top-width.border-width.bottom.box-align.box-decoration-break.box-direction.box-flex.box-flex-group.box-lines.box-ordinal-group.box-orient.box-pack.box-shadow.box-sizing.break-after.break-before.break-inside.caption-side.caret-color.clear.clip.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.color-scheme.column-count.column-fill.column-gap.column-rule.column-rule-color.column-rule-style.column-rule-width.column-span.column-width.columns.contain.contain-intrinsic-block-size.contain-intrinsic-height.contain-intrinsic-inline-size.contain-intrinsic-size.contain-intrinsic-width.container.container-name.container-type.content.content-visibility.counter-increment.counter-reset.counter-set.cue.cue-after.cue-before.cursor.cx.cy.direction.display.dominant-baseline.empty-cells.enable-background.field-sizing.fill.fill-opacity.fill-rule.filter.flex.flex-basis.flex-direction.flex-flow.flex-grow.flex-shrink.flex-wrap.float.flood-color.flood-opacity.flow.font.font-display.font-family.font-feature-settings.font-kerning.font-language-override.font-optical-sizing.font-palette.font-size.font-size-adjust.font-smooth.font-smoothing.font-stretch.font-style.font-synthesis.font-synthesis-position.font-synthesis-small-caps.font-synthesis-style.font-synthesis-weight.font-variant.font-variant-alternates.font-variant-caps.font-variant-east-asian.font-variant-emoji.font-variant-ligatures.font-variant-numeric.font-variant-position.font-variation-settings.font-weight.forced-color-adjust.gap.glyph-orientation-horizontal.glyph-orientation-vertical.grid.grid-area.grid-auto-columns.grid-auto-flow.grid-auto-rows.grid-column.grid-column-end.grid-column-start.grid-gap.grid-row.grid-row-end.grid-row-start.grid-template.grid-template-areas.grid-template-columns.grid-template-rows.hanging-punctuation.height.hyphenate-character.hyphenate-limit-chars.hyphens.icon.image-orientation.image-rendering.image-resolution.ime-mode.initial-letter.initial-letter-align.inline-size.inset.inset-area.inset-block.inset-block-end.inset-block-start.inset-inline.inset-inline-end.inset-inline-start.isolation.justify-content.justify-items.justify-self.kerning.left.letter-spacing.lighting-color.line-break.line-height.line-height-step.list-style.list-style-image.list-style-position.list-style-type.margin.margin-block.margin-block-end.margin-block-start.margin-bottom.margin-inline.margin-inline-end.margin-inline-start.margin-left.margin-right.margin-top.margin-trim.marker.marker-end.marker-mid.marker-start.marks.mask.mask-border.mask-border-mode.mask-border-outset.mask-border-repeat.mask-border-slice.mask-border-source.mask-border-width.mask-clip.mask-composite.mask-image.mask-mode.mask-origin.mask-position.mask-repeat.mask-size.mask-type.masonry-auto-flow.math-depth.math-shift.math-style.max-block-size.max-height.max-inline-size.max-width.min-block-size.min-height.min-inline-size.min-width.mix-blend-mode.nav-down.nav-index.nav-left.nav-right.nav-up.none.normal.object-fit.object-position.offset.offset-anchor.offset-distance.offset-path.offset-position.offset-rotate.opacity.order.orphans.outline.outline-color.outline-offset.outline-style.outline-width.overflow.overflow-anchor.overflow-block.overflow-clip-margin.overflow-inline.overflow-wrap.overflow-x.overflow-y.overlay.overscroll-behavior.overscroll-behavior-block.overscroll-behavior-inline.overscroll-behavior-x.overscroll-behavior-y.padding.padding-block.padding-block-end.padding-block-start.padding-bottom.padding-inline.padding-inline-end.padding-inline-start.padding-left.padding-right.padding-top.page.page-break-after.page-break-before.page-break-inside.paint-order.pause.pause-after.pause-before.perspective.perspective-origin.place-content.place-items.place-self.pointer-events.position.position-anchor.position-visibility.print-color-adjust.quotes.r.resize.rest.rest-after.rest-before.right.rotate.row-gap.ruby-align.ruby-position.scale.scroll-behavior.scroll-margin.scroll-margin-block.scroll-margin-block-end.scroll-margin-block-start.scroll-margin-bottom.scroll-margin-inline.scroll-margin-inline-end.scroll-margin-inline-start.scroll-margin-left.scroll-margin-right.scroll-margin-top.scroll-padding.scroll-padding-block.scroll-padding-block-end.scroll-padding-block-start.scroll-padding-bottom.scroll-padding-inline.scroll-padding-inline-end.scroll-padding-inline-start.scroll-padding-left.scroll-padding-right.scroll-padding-top.scroll-snap-align.scroll-snap-stop.scroll-snap-type.scroll-timeline.scroll-timeline-axis.scroll-timeline-name.scrollbar-color.scrollbar-gutter.scrollbar-width.shape-image-threshold.shape-margin.shape-outside.shape-rendering.speak.speak-as.src.stop-color.stop-opacity.stroke.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke-width.tab-size.table-layout.text-align.text-align-all.text-align-last.text-anchor.text-combine-upright.text-decoration.text-decoration-color.text-decoration-line.text-decoration-skip.text-decoration-skip-ink.text-decoration-style.text-decoration-thickness.text-emphasis.text-emphasis-color.text-emphasis-position.text-emphasis-style.text-indent.text-justify.text-orientation.text-overflow.text-rendering.text-shadow.text-size-adjust.text-transform.text-underline-offset.text-underline-position.text-wrap.text-wrap-mode.text-wrap-style.timeline-scope.top.touch-action.transform.transform-box.transform-origin.transform-style.transition.transition-behavior.transition-delay.transition-duration.transition-property.transition-timing-function.translate.unicode-bidi.unicode-range.user-modify.user-select.vector-effect.vertical-align.view-timeline.view-timeline-axis.view-timeline-inset.view-timeline-name.view-transition-name.visibility.voice-balance.voice-duration.voice-family.voice-pitch.voice-range.voice-rate.voice-stress.voice-volume.white-space.white-space-collapse.widows.width.will-change.word-break.word-spacing.word-wrap.writing-mode.x.y.z-index.zoom".split(".")).sort().reverse();
	function u(e) {
		let t = n(e), r = c, i = s, u = "@[a-z-]+", d = {
			className: "variable",
			begin: "(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b",
			relevance: 0
		};
		return {
			name: "SCSS",
			case_insensitive: !0,
			illegal: "[=/|']",
			contains: [
				e.C_LINE_COMMENT_MODE,
				e.C_BLOCK_COMMENT_MODE,
				t.CSS_NUMBER_MODE,
				{
					className: "selector-id",
					begin: "#[A-Za-z0-9_-]+",
					relevance: 0
				},
				{
					className: "selector-class",
					begin: "\\.[A-Za-z0-9_-]+",
					relevance: 0
				},
				t.ATTRIBUTE_SELECTOR_MODE,
				{
					className: "selector-tag",
					begin: "\\b(" + a.join("|") + ")\\b",
					relevance: 0
				},
				{
					className: "selector-pseudo",
					begin: ":(" + i.join("|") + ")"
				},
				{
					className: "selector-pseudo",
					begin: ":(:)?(" + r.join("|") + ")"
				},
				d,
				{
					begin: /\(/,
					end: /\)/,
					contains: [t.CSS_NUMBER_MODE]
				},
				t.CSS_VARIABLE,
				{
					className: "attribute",
					begin: "\\b(" + l.join("|") + ")\\b"
				},
				{ begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b" },
				{
					begin: /:/,
					end: /[;}{]/,
					relevance: 0,
					contains: [
						t.BLOCK_COMMENT,
						d,
						t.HEXCOLOR,
						t.CSS_NUMBER_MODE,
						t.UNICODE_RANGE,
						e.QUOTE_STRING_MODE,
						e.APOS_STRING_MODE,
						t.IMPORTANT,
						t.FUNCTION_DISPATCH
					]
				},
				{
					begin: "@(page|font-face)",
					keywords: {
						$pattern: u,
						keyword: "@page @font-face"
					}
				},
				{
					begin: "@",
					end: "[{;]",
					returnBegin: !0,
					keywords: {
						$pattern: /[a-z-]+/,
						keyword: "and or not only",
						attribute: o.join(" ")
					},
					contains: [
						{
							begin: u,
							className: "keyword"
						},
						{
							begin: /[a-z-]+(?=:)/,
							className: "attribute"
						},
						d,
						e.QUOTE_STRING_MODE,
						e.APOS_STRING_MODE,
						t.HEXCOLOR,
						t.CSS_NUMBER_MODE
					]
				},
				t.FUNCTION_DISPATCH
			]
		};
	}
	t.exports = u;
})), i_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return {
			name: "Shell Session",
			aliases: ["console", "shellsession"],
			contains: [{
				className: "meta.prompt",
				begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
				starts: {
					end: /[^\\](?=\s*$)/,
					subLanguage: "bash"
				}
			}]
		};
	}
	t.exports = n;
})), a_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = e.COMMENT("--", "$"), r = {
			scope: "string",
			variants: [{
				begin: /'/,
				end: /'/,
				contains: [{ match: /''/ }]
			}]
		}, i = {
			begin: /"/,
			end: /"/,
			contains: [{ match: /""/ }]
		}, a = [
			"true",
			"false",
			"unknown"
		], o = [
			"double precision",
			"large object",
			"with timezone",
			"without timezone"
		], s = /* @__PURE__ */ "bigint.binary.blob.boolean.char.character.clob.date.dec.decfloat.decimal.float.int.integer.interval.nchar.nclob.national.numeric.real.row.smallint.time.timestamp.varchar.varying.varbinary".split("."), c = [
			"add",
			"asc",
			"collation",
			"desc",
			"final",
			"first",
			"last",
			"view"
		], l = /* @__PURE__ */ "abs.acos.all.allocate.alter.and.any.are.array.array_agg.array_max_cardinality.as.asensitive.asin.asymmetric.at.atan.atomic.authorization.avg.begin.begin_frame.begin_partition.between.bigint.binary.blob.boolean.both.by.call.called.cardinality.cascaded.case.cast.ceil.ceiling.char.char_length.character.character_length.check.classifier.clob.close.coalesce.collate.collect.column.commit.condition.connect.constraint.contains.convert.copy.corr.corresponding.cos.cosh.count.covar_pop.covar_samp.create.cross.cube.cume_dist.current.current_catalog.current_date.current_default_transform_group.current_path.current_role.current_row.current_schema.current_time.current_timestamp.current_path.current_role.current_transform_group_for_type.current_user.cursor.cycle.date.day.deallocate.dec.decimal.decfloat.declare.default.define.delete.dense_rank.deref.describe.deterministic.disconnect.distinct.double.drop.dynamic.each.element.else.empty.end.end_frame.end_partition.end-exec.equals.escape.every.except.exec.execute.exists.exp.external.extract.false.fetch.filter.first_value.float.floor.for.foreign.frame_row.free.from.full.function.fusion.get.global.grant.group.grouping.groups.having.hold.hour.identity.in.indicator.initial.inner.inout.insensitive.insert.int.integer.intersect.intersection.interval.into.is.join.json_array.json_arrayagg.json_exists.json_object.json_objectagg.json_query.json_table.json_table_primitive.json_value.lag.language.large.last_value.lateral.lead.leading.left.like.like_regex.listagg.ln.local.localtime.localtimestamp.log.log10.lower.match.match_number.match_recognize.matches.max.member.merge.method.min.minute.mod.modifies.module.month.multiset.national.natural.nchar.nclob.new.no.none.normalize.not.nth_value.ntile.null.nullif.numeric.octet_length.occurrences_regex.of.offset.old.omit.on.one.only.open.or.order.out.outer.over.overlaps.overlay.parameter.partition.pattern.per.percent.percent_rank.percentile_cont.percentile_disc.period.portion.position.position_regex.power.precedes.precision.prepare.primary.procedure.ptf.range.rank.reads.real.recursive.ref.references.referencing.regr_avgx.regr_avgy.regr_count.regr_intercept.regr_r2.regr_slope.regr_sxx.regr_sxy.regr_syy.release.result.return.returns.revoke.right.rollback.rollup.row.row_number.rows.running.savepoint.scope.scroll.search.second.seek.select.sensitive.session_user.set.show.similar.sin.sinh.skip.smallint.some.specific.specifictype.sql.sqlexception.sqlstate.sqlwarning.sqrt.start.static.stddev_pop.stddev_samp.submultiset.subset.substring.substring_regex.succeeds.sum.symmetric.system.system_time.system_user.table.tablesample.tan.tanh.then.time.timestamp.timezone_hour.timezone_minute.to.trailing.translate.translate_regex.translation.treat.trigger.trim.trim_array.true.truncate.uescape.union.unique.unknown.unnest.update.upper.user.using.value.values.value_of.var_pop.var_samp.varbinary.varchar.varying.versioning.when.whenever.where.width_bucket.window.with.within.without.year".split("."), u = /* @__PURE__ */ "abs.acos.array_agg.asin.atan.avg.cast.ceil.ceiling.coalesce.corr.cos.cosh.count.covar_pop.covar_samp.cume_dist.dense_rank.deref.element.exp.extract.first_value.floor.json_array.json_arrayagg.json_exists.json_object.json_objectagg.json_query.json_table.json_table_primitive.json_value.lag.last_value.lead.listagg.ln.log.log10.lower.max.min.mod.nth_value.ntile.nullif.percent_rank.percentile_cont.percentile_disc.position.position_regex.power.rank.regr_avgx.regr_avgy.regr_count.regr_intercept.regr_r2.regr_slope.regr_sxx.regr_sxy.regr_syy.row_number.sin.sinh.sqrt.stddev_pop.stddev_samp.substring.substring_regex.sum.tan.tanh.translate.translate_regex.treat.trim.trim_array.unnest.upper.value_of.var_pop.var_samp.width_bucket".split("."), d = [
			"current_catalog",
			"current_date",
			"current_default_transform_group",
			"current_path",
			"current_role",
			"current_schema",
			"current_transform_group_for_type",
			"current_user",
			"session_user",
			"system_time",
			"system_user",
			"current_time",
			"localtime",
			"current_timestamp",
			"localtimestamp"
		], f = [
			"create table",
			"insert into",
			"primary key",
			"foreign key",
			"not null",
			"alter table",
			"add constraint",
			"grouping sets",
			"on overflow",
			"character set",
			"respect nulls",
			"ignore nulls",
			"nulls first",
			"nulls last",
			"depth first",
			"breadth first"
		], p = u, m = [...l, ...c].filter((e) => !u.includes(e)), h = {
			scope: "variable",
			match: /@[a-z0-9][a-z0-9_]*/
		}, g = {
			scope: "operator",
			match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
			relevance: 0
		}, _ = {
			match: t.concat(/\b/, t.either(...p), /\s*\(/),
			relevance: 0,
			keywords: { built_in: p }
		};
		function v(e) {
			return t.concat(/\b/, t.either(...e.map((e) => e.replace(/\s+/, "\\s+"))), /\b/);
		}
		let y = {
			scope: "keyword",
			match: v(f),
			relevance: 0
		};
		function b(e, { exceptions: t, when: n } = {}) {
			let r = n;
			return t ||= [], e.map((e) => e.match(/\|\d+$/) || t.includes(e) ? e : r(e) ? `${e}|0` : e);
		}
		return {
			name: "SQL",
			case_insensitive: !0,
			illegal: /[{}]|<\//,
			keywords: {
				$pattern: /\b[\w\.]+/,
				keyword: b(m, { when: (e) => e.length < 3 }),
				literal: a,
				type: s,
				built_in: d
			},
			contains: [
				{
					scope: "type",
					match: v(o)
				},
				y,
				_,
				h,
				r,
				i,
				e.C_NUMBER_MODE,
				e.C_BLOCK_COMMENT_MODE,
				n,
				g
			]
		};
	}
	t.exports = n;
})), o_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return e ? typeof e == "string" ? e : e.source : null;
	}
	function r(e) {
		return i("(?=", e, ")");
	}
	function i(...e) {
		return e.map((e) => n(e)).join("");
	}
	function a(e) {
		let t = e[e.length - 1];
		return typeof t == "object" && t.constructor === Object ? (e.splice(e.length - 1, 1), t) : {};
	}
	function o(...e) {
		return "(" + (a(e).capture ? "" : "?:") + e.map((e) => n(e)).join("|") + ")";
	}
	var s = (e) => i(/\b/, e, /\w$/.test(e) ? /\b/ : /\B/), c = ["Protocol", "Type"].map(s), l = ["init", "self"].map(s), u = ["Any", "Self"], d = [
		"actor",
		"any",
		"associatedtype",
		"async",
		"await",
		/as\?/,
		/as!/,
		"as",
		"borrowing",
		"break",
		"case",
		"catch",
		"class",
		"consume",
		"consuming",
		"continue",
		"convenience",
		"copy",
		"default",
		"defer",
		"deinit",
		"didSet",
		"distributed",
		"do",
		"dynamic",
		"each",
		"else",
		"enum",
		"extension",
		"fallthrough",
		/fileprivate\(set\)/,
		"fileprivate",
		"final",
		"for",
		"func",
		"get",
		"guard",
		"if",
		"import",
		"indirect",
		"infix",
		/init\?/,
		/init!/,
		"inout",
		/internal\(set\)/,
		"internal",
		"in",
		"is",
		"isolated",
		"nonisolated",
		"lazy",
		"let",
		"macro",
		"mutating",
		"nonmutating",
		/open\(set\)/,
		"open",
		"operator",
		"optional",
		"override",
		"package",
		"postfix",
		"precedencegroup",
		"prefix",
		/private\(set\)/,
		"private",
		"protocol",
		/public\(set\)/,
		"public",
		"repeat",
		"required",
		"rethrows",
		"return",
		"set",
		"some",
		"static",
		"struct",
		"subscript",
		"super",
		"switch",
		"throws",
		"throw",
		/try\?/,
		/try!/,
		"try",
		"typealias",
		/unowned\(safe\)/,
		/unowned\(unsafe\)/,
		"unowned",
		"var",
		"weak",
		"where",
		"while",
		"willSet"
	], f = [
		"false",
		"nil",
		"true"
	], p = [
		"assignment",
		"associativity",
		"higherThan",
		"left",
		"lowerThan",
		"none",
		"right"
	], m = [
		"#colorLiteral",
		"#column",
		"#dsohandle",
		"#else",
		"#elseif",
		"#endif",
		"#error",
		"#file",
		"#fileID",
		"#fileLiteral",
		"#filePath",
		"#function",
		"#if",
		"#imageLiteral",
		"#keyPath",
		"#line",
		"#selector",
		"#sourceLocation",
		"#warning"
	], h = /* @__PURE__ */ "abs.all.any.assert.assertionFailure.debugPrint.dump.fatalError.getVaList.isKnownUniquelyReferenced.max.min.numericCast.pointwiseMax.pointwiseMin.precondition.preconditionFailure.print.readLine.repeatElement.sequence.stride.swap.swift_unboxFromSwiftValueWithType.transcode.type.unsafeBitCast.unsafeDowncast.withExtendedLifetime.withUnsafeMutablePointer.withUnsafePointer.withVaList.withoutActuallyEscaping.zip".split("."), g = o(/[/=\-+!*%<>&|^~?]/, /[\u00A1-\u00A7]/, /[\u00A9\u00AB]/, /[\u00AC\u00AE]/, /[\u00B0\u00B1]/, /[\u00B6\u00BB\u00BF\u00D7\u00F7]/, /[\u2016-\u2017]/, /[\u2020-\u2027]/, /[\u2030-\u203E]/, /[\u2041-\u2053]/, /[\u2055-\u205E]/, /[\u2190-\u23FF]/, /[\u2500-\u2775]/, /[\u2794-\u2BFF]/, /[\u2E00-\u2E7F]/, /[\u3001-\u3003]/, /[\u3008-\u3020]/, /[\u3030]/), _ = o(g, /[\u0300-\u036F]/, /[\u1DC0-\u1DFF]/, /[\u20D0-\u20FF]/, /[\uFE00-\uFE0F]/, /[\uFE20-\uFE2F]/), v = i(g, _, "*"), y = o(/[a-zA-Z_]/, /[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/, /[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, /[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/, /[\u1E00-\u1FFF]/, /[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/, /[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/, /[\u2C00-\u2DFF\u2E80-\u2FFF]/, /[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/, /[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/, /[\uFE47-\uFEFE\uFF00-\uFFFD]/), b = o(y, /\d/, /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/), x = i(y, b, "*"), S = i(/[A-Z]/, b, "*"), ee = [
		"attached",
		"autoclosure",
		i(/convention\(/, o("swift", "block", "c"), /\)/),
		"discardableResult",
		"dynamicCallable",
		"dynamicMemberLookup",
		"escaping",
		"freestanding",
		"frozen",
		"GKInspectable",
		"IBAction",
		"IBDesignable",
		"IBInspectable",
		"IBOutlet",
		"IBSegueAction",
		"inlinable",
		"main",
		"nonobjc",
		"NSApplicationMain",
		"NSCopying",
		"NSManaged",
		i(/objc\(/, x, /\)/),
		"objc",
		"objcMembers",
		"propertyWrapper",
		"requires_stored_property_inits",
		"resultBuilder",
		"Sendable",
		"testable",
		"UIApplicationMain",
		"unchecked",
		"unknown",
		"usableFromInline",
		"warn_unqualified_access"
	], te = [
		"iOS",
		"iOSApplicationExtension",
		"macOS",
		"macOSApplicationExtension",
		"macCatalyst",
		"macCatalystApplicationExtension",
		"watchOS",
		"watchOSApplicationExtension",
		"tvOS",
		"tvOSApplicationExtension",
		"swift"
	];
	function C(e) {
		let t = {
			match: /\s+/,
			relevance: 0
		}, n = e.COMMENT("/\\*", "\\*/", { contains: ["self"] }), a = [e.C_LINE_COMMENT_MODE, n], g = {
			match: [/\./, o(...c, ...l)],
			className: { 2: "keyword" }
		}, y = {
			match: i(/\./, o(...d)),
			relevance: 0
		}, C = d.filter((e) => typeof e == "string").concat(["_|0"]), w = { variants: [{
			className: "keyword",
			match: o(...d.filter((e) => typeof e != "string").concat(u).map(s), ...l)
		}] }, ne = {
			$pattern: o(/\b\w+/, /#\w+/),
			keyword: C.concat(m),
			literal: f
		}, re = [
			g,
			y,
			w
		], ie = [{
			match: i(/\./, o(...h)),
			relevance: 0
		}, {
			className: "built_in",
			match: i(/\b/, o(...h), /(?=\()/)
		}], T = {
			match: /->/,
			relevance: 0
		}, ae = [T, {
			className: "operator",
			relevance: 0,
			variants: [{ match: v }, { match: `\\.(\\.|${_})+` }]
		}], E = "([0-9]_*)+", oe = "([0-9a-fA-F]_*)+", D = {
			className: "number",
			relevance: 0,
			variants: [
				{ match: `\\b(${E})(\\.(${E}))?([eE][+-]?(${E}))?\\b` },
				{ match: `\\b0x(${oe})(\\.(${oe}))?([pP][+-]?(${E}))?\\b` },
				{ match: /\b0o([0-7]_*)+\b/ },
				{ match: /\b0b([01]_*)+\b/ }
			]
		}, se = (e = "") => ({
			className: "subst",
			variants: [{ match: i(/\\/, e, /[0\\tnr"']/) }, { match: i(/\\/, e, /u\{[0-9a-fA-F]{1,8}\}/) }]
		}), ce = (e = "") => ({
			className: "subst",
			match: i(/\\/, e, /[\t ]*(?:[\r\n]|\r\n)/)
		}), le = (e = "") => ({
			className: "subst",
			label: "interpol",
			begin: i(/\\/, e, /\(/),
			end: /\)/
		}), ue = (e = "") => ({
			begin: i(e, /"""/),
			end: i(/"""/, e),
			contains: [
				se(e),
				ce(e),
				le(e)
			]
		}), de = (e = "") => ({
			begin: i(e, /"/),
			end: i(/"/, e),
			contains: [se(e), le(e)]
		}), O = {
			className: "string",
			variants: [
				ue(),
				ue("#"),
				ue("##"),
				ue("###"),
				de(),
				de("#"),
				de("##"),
				de("###")
			]
		}, fe = [e.BACKSLASH_ESCAPE, {
			begin: /\[/,
			end: /\]/,
			relevance: 0,
			contains: [e.BACKSLASH_ESCAPE]
		}], pe = {
			begin: /\/[^\s](?=[^/\n]*\/)/,
			end: /\//,
			contains: fe
		}, me = (e) => {
			let t = i(e, /\//), n = i(/\//, e);
			return {
				begin: t,
				end: n,
				contains: [...fe, {
					scope: "comment",
					begin: `#(?!.*${n})`,
					end: /$/
				}]
			};
		}, he = {
			scope: "regexp",
			variants: [
				me("###"),
				me("##"),
				me("#"),
				pe
			]
		}, ge = { match: i(/`/, x, /`/) }, _e = [
			ge,
			{
				className: "variable",
				match: /\$\d+/
			},
			{
				className: "variable",
				match: `\\$${b}+`
			}
		], ve = [
			{
				match: /(@|#(un)?)available/,
				scope: "keyword",
				starts: { contains: [{
					begin: /\(/,
					end: /\)/,
					keywords: te,
					contains: [
						...ae,
						D,
						O
					]
				}] }
			},
			{
				scope: "keyword",
				match: i(/@/, o(...ee), r(o(/\(/, /\s+/)))
			},
			{
				scope: "meta",
				match: i(/@/, x)
			}
		], ye = {
			match: r(/\b[A-Z]/),
			relevance: 0,
			contains: [
				{
					className: "type",
					match: i(/(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/, b, "+")
				},
				{
					className: "type",
					match: S,
					relevance: 0
				},
				{
					match: /[?!]+/,
					relevance: 0
				},
				{
					match: /\.\.\./,
					relevance: 0
				},
				{
					match: i(/\s+&\s+/, r(S)),
					relevance: 0
				}
			]
		}, be = {
			begin: /</,
			end: />/,
			keywords: ne,
			contains: [
				...a,
				...re,
				...ve,
				T,
				ye
			]
		};
		ye.contains.push(be);
		let xe = {
			begin: /\(/,
			end: /\)/,
			relevance: 0,
			keywords: ne,
			contains: [
				"self",
				{
					match: i(x, /\s*:/),
					keywords: "_|0",
					relevance: 0
				},
				...a,
				he,
				...re,
				...ie,
				...ae,
				D,
				O,
				..._e,
				...ve,
				ye
			]
		}, Se = {
			begin: /</,
			end: />/,
			keywords: "repeat each",
			contains: [...a, ye]
		}, Ce = {
			begin: /\(/,
			end: /\)/,
			keywords: ne,
			contains: [
				{
					begin: o(r(i(x, /\s*:/)), r(i(x, /\s+/, x, /\s*:/))),
					end: /:/,
					relevance: 0,
					contains: [{
						className: "keyword",
						match: /\b_\b/
					}, {
						className: "params",
						match: x
					}]
				},
				...a,
				...re,
				...ae,
				D,
				O,
				...ve,
				ye,
				xe
			],
			endsParent: !0,
			illegal: /["']/
		}, we = {
			match: [
				/(func|macro)/,
				/\s+/,
				o(ge.match, x, v)
			],
			className: {
				1: "keyword",
				3: "title.function"
			},
			contains: [
				Se,
				Ce,
				t
			],
			illegal: [/\[/, /%/]
		}, Te = {
			match: [/\b(?:subscript|init[?!]?)/, /\s*(?=[<(])/],
			className: { 1: "keyword" },
			contains: [
				Se,
				Ce,
				t
			],
			illegal: /\[|%/
		}, Ee = {
			match: [
				/operator/,
				/\s+/,
				v
			],
			className: {
				1: "keyword",
				3: "title"
			}
		}, De = {
			begin: [
				/precedencegroup/,
				/\s+/,
				S
			],
			className: {
				1: "keyword",
				3: "title"
			},
			contains: [ye],
			keywords: [...p, ...f],
			end: /}/
		}, Oe = {
			match: [
				/class\b/,
				/\s+/,
				/func\b/,
				/\s+/,
				/\b[A-Za-z_][A-Za-z0-9_]*\b/
			],
			scope: {
				1: "keyword",
				3: "keyword",
				5: "title.function"
			}
		}, ke = {
			match: [
				/class\b/,
				/\s+/,
				/var\b/
			],
			scope: {
				1: "keyword",
				3: "keyword"
			}
		}, k = {
			begin: [
				/(struct|protocol|class|extension|enum|actor)/,
				/\s+/,
				x,
				/\s*/
			],
			beginScope: {
				1: "keyword",
				3: "title.class"
			},
			keywords: ne,
			contains: [
				Se,
				...re,
				{
					begin: /:/,
					end: /\{/,
					keywords: ne,
					contains: [{
						scope: "title.class.inherited",
						match: S
					}, ...re],
					relevance: 0
				}
			]
		};
		for (let e of O.variants) {
			let t = e.contains.find((e) => e.label === "interpol");
			t.keywords = ne;
			let n = [
				...re,
				...ie,
				...ae,
				D,
				O,
				..._e
			];
			t.contains = [...n, {
				begin: /\(/,
				end: /\)/,
				contains: ["self", ...n]
			}];
		}
		return {
			name: "Swift",
			keywords: ne,
			contains: [
				...a,
				we,
				Te,
				Oe,
				ke,
				k,
				Ee,
				De,
				{
					beginKeywords: "import",
					end: /$/,
					contains: [...a],
					relevance: 0
				},
				he,
				...re,
				...ie,
				...ae,
				D,
				O,
				..._e,
				...ve,
				ye,
				xe
			]
		};
	}
	t.exports = C;
})), s_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = "true false yes no null", n = "[\\w#;/?:@&=+$,.~*'()[\\]]+", r = {
			className: "attr",
			variants: [
				{ begin: /[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/ },
				{ begin: /"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/ },
				{ begin: /'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/ }
			]
		}, i = {
			className: "template-variable",
			variants: [{
				begin: /\{\{/,
				end: /\}\}/
			}, {
				begin: /%\{/,
				end: /\}/
			}]
		}, a = {
			className: "string",
			relevance: 0,
			begin: /'/,
			end: /'/,
			contains: [{
				match: /''/,
				scope: "char.escape",
				relevance: 0
			}]
		}, o = {
			className: "string",
			relevance: 0,
			variants: [{
				begin: /"/,
				end: /"/
			}, { begin: /\S+/ }],
			contains: [e.BACKSLASH_ESCAPE, i]
		}, s = e.inherit(o, { variants: [
			{
				begin: /'/,
				end: /'/,
				contains: [{
					begin: /''/,
					relevance: 0
				}]
			},
			{
				begin: /"/,
				end: /"/
			},
			{ begin: /[^\s,{}[\]]+/ }
		] }), c = {
			className: "number",
			begin: "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b"
		}, l = {
			end: ",",
			endsWithParent: !0,
			excludeEnd: !0,
			keywords: t,
			relevance: 0
		}, u = {
			begin: /\{/,
			end: /\}/,
			contains: [l],
			illegal: "\\n",
			relevance: 0
		}, d = {
			begin: "\\[",
			end: "\\]",
			contains: [l],
			illegal: "\\n",
			relevance: 0
		}, f = [
			r,
			{
				className: "meta",
				begin: "^---\\s*$",
				relevance: 10
			},
			{
				className: "string",
				begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
			},
			{
				begin: "<%[%=-]?",
				end: "[%-]?%>",
				subLanguage: "ruby",
				excludeBegin: !0,
				excludeEnd: !0,
				relevance: 0
			},
			{
				className: "type",
				begin: "!\\w+!" + n
			},
			{
				className: "type",
				begin: "!<" + n + ">"
			},
			{
				className: "type",
				begin: "!" + n
			},
			{
				className: "type",
				begin: "!!" + n
			},
			{
				className: "meta",
				begin: "&" + e.UNDERSCORE_IDENT_RE + "$"
			},
			{
				className: "meta",
				begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$"
			},
			{
				className: "bullet",
				begin: "-(?=[ ]|$)",
				relevance: 0
			},
			e.HASH_COMMENT_MODE,
			{
				beginKeywords: t,
				keywords: { literal: t }
			},
			c,
			{
				className: "number",
				begin: e.C_NUMBER_RE + "\\b",
				relevance: 0
			},
			u,
			d,
			a,
			o
		], p = [...f];
		return p.pop(), p.push(s), l.contains = p, {
			name: "YAML",
			case_insensitive: !0,
			aliases: ["yml"],
			contains: f
		};
	}
	t.exports = n;
})), c_ = /* @__PURE__ */ o(((e, t) => {
	var n = "[A-Za-z$_][0-9A-Za-z$_]*", r = /* @__PURE__ */ "as.in.of.if.for.while.finally.var.new.function.do.return.void.else.break.catch.instanceof.with.throw.case.default.try.switch.continue.typeof.delete.let.yield.const.class.debugger.async.await.static.import.from.export.extends.using".split("."), i = [
		"true",
		"false",
		"null",
		"undefined",
		"NaN",
		"Infinity"
	], a = /* @__PURE__ */ "Object.Function.Boolean.Symbol.Math.Date.Number.BigInt.String.RegExp.Array.Float32Array.Float64Array.Int8Array.Uint8Array.Uint8ClampedArray.Int16Array.Int32Array.Uint16Array.Uint32Array.BigInt64Array.BigUint64Array.Set.Map.WeakSet.WeakMap.ArrayBuffer.SharedArrayBuffer.Atomics.DataView.JSON.Promise.Generator.GeneratorFunction.AsyncFunction.Reflect.Proxy.Intl.WebAssembly".split("."), o = [
		"Error",
		"EvalError",
		"InternalError",
		"RangeError",
		"ReferenceError",
		"SyntaxError",
		"TypeError",
		"URIError"
	], s = [
		"setInterval",
		"setTimeout",
		"clearInterval",
		"clearTimeout",
		"require",
		"exports",
		"eval",
		"isFinite",
		"isNaN",
		"parseFloat",
		"parseInt",
		"decodeURI",
		"decodeURIComponent",
		"encodeURI",
		"encodeURIComponent",
		"escape",
		"unescape"
	], c = [
		"arguments",
		"this",
		"super",
		"console",
		"window",
		"document",
		"localStorage",
		"sessionStorage",
		"module",
		"global"
	], l = [].concat(s, a, o);
	function u(e) {
		let t = e.regex, u = (e, { after: t }) => {
			let n = "</" + e[0].slice(1);
			return e.input.indexOf(n, t) !== -1;
		}, d = n, f = {
			begin: "<>",
			end: "</>"
		}, p = /<[A-Za-z0-9\\._:-]+\s*\/>/, m = {
			begin: /<[A-Za-z0-9\\._:-]+/,
			end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
			isTrulyOpeningTag: (e, t) => {
				let n = e[0].length + e.index, r = e.input[n];
				if (r === "<" || r === ",") {
					t.ignoreMatch();
					return;
				}
				r === ">" && (u(e, { after: n }) || t.ignoreMatch());
				let i, a = e.input.substring(n);
				if (i = a.match(/^\s*=/)) {
					t.ignoreMatch();
					return;
				}
				if ((i = a.match(/^\s+extends\s+/)) && i.index === 0) {
					t.ignoreMatch();
					return;
				}
			}
		}, h = {
			$pattern: n,
			keyword: r,
			literal: i,
			built_in: l,
			"variable.language": c
		}, g = "[0-9](_?[0-9])*", _ = `\\.(${g})`, v = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", y = {
			className: "number",
			variants: [
				{ begin: `(\\b(${v})((${_})|\\.)?|(${_}))[eE][+-]?(${g})\\b` },
				{ begin: `\\b(${v})\\b((${_})\\b|\\.)?|(${_})\\b` },
				{ begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
				{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
				{ begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
				{ begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
				{ begin: "\\b0[0-7]+n?\\b" }
			],
			relevance: 0
		}, b = {
			className: "subst",
			begin: "\\$\\{",
			end: "\\}",
			keywords: h,
			contains: []
		}, x = {
			begin: ".?html`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "xml"
			}
		}, S = {
			begin: ".?css`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "css"
			}
		}, ee = {
			begin: ".?gql`",
			end: "",
			starts: {
				end: "`",
				returnEnd: !1,
				contains: [e.BACKSLASH_ESCAPE, b],
				subLanguage: "graphql"
			}
		}, te = {
			className: "string",
			begin: "`",
			end: "`",
			contains: [e.BACKSLASH_ESCAPE, b]
		}, C = {
			className: "comment",
			variants: [
				e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
					relevance: 0,
					contains: [{
						begin: "(?=@[A-Za-z]+)",
						relevance: 0,
						contains: [
							{
								className: "doctag",
								begin: "@[A-Za-z]+"
							},
							{
								className: "type",
								begin: "\\{",
								end: "\\}",
								excludeEnd: !0,
								excludeBegin: !0,
								relevance: 0
							},
							{
								className: "variable",
								begin: d + "(?=\\s*(-)|$)",
								endsParent: !0,
								relevance: 0
							},
							{
								begin: /(?=[^\n])\s/,
								relevance: 0
							}
						]
					}]
				}),
				e.C_BLOCK_COMMENT_MODE,
				e.C_LINE_COMMENT_MODE
			]
		}, w = [
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			x,
			S,
			ee,
			te,
			{ match: /\$\d+/ },
			y
		];
		b.contains = w.concat({
			begin: /\{/,
			end: /\}/,
			keywords: h,
			contains: ["self"].concat(w)
		});
		let ne = [].concat(C, b.contains), re = ne.concat([{
			begin: /(\s*)\(/,
			end: /\)/,
			keywords: h,
			contains: ["self"].concat(ne)
		}]), ie = {
			className: "params",
			begin: /(\s*)\(/,
			end: /\)/,
			excludeBegin: !0,
			excludeEnd: !0,
			keywords: h,
			contains: re
		}, T = { variants: [{
			match: [
				/class/,
				/\s+/,
				d,
				/\s+/,
				/extends/,
				/\s+/,
				t.concat(d, "(", t.concat(/\./, d), ")*")
			],
			scope: {
				1: "keyword",
				3: "title.class",
				5: "keyword",
				7: "title.class.inherited"
			}
		}, {
			match: [
				/class/,
				/\s+/,
				d
			],
			scope: {
				1: "keyword",
				3: "title.class"
			}
		}] }, ae = {
			relevance: 0,
			match: t.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
			className: "title.class",
			keywords: { _: [...a, ...o] }
		}, E = {
			label: "use_strict",
			className: "meta",
			relevance: 10,
			begin: /^\s*['"]use (strict|asm)['"]/
		}, oe = {
			variants: [{ match: [
				/function/,
				/\s+/,
				d,
				/(?=\s*\()/
			] }, { match: [/function/, /\s*(?=\()/] }],
			className: {
				1: "keyword",
				3: "title.function"
			},
			label: "func.def",
			contains: [ie],
			illegal: /%/
		}, D = {
			relevance: 0,
			match: /\b[A-Z][A-Z_0-9]+\b/,
			className: "variable.constant"
		};
		function se(e) {
			return t.concat("(?!", e.join("|"), ")");
		}
		let ce = {
			match: t.concat(/\b/, se([
				...s,
				"super",
				"import",
				"await"
			].map((e) => `${e}\\s*\\(`)), d, t.lookahead(/\s*\(/)),
			className: "title.function",
			relevance: 0
		}, le = {
			begin: t.concat(/\./, t.lookahead(t.concat(d, /(?![0-9A-Za-z$_(])/))),
			end: d,
			excludeBegin: !0,
			keywords: "prototype",
			className: "property",
			relevance: 0
		}, ue = {
			match: [
				/get|set/,
				/\s+/,
				d,
				/(?=\()/
			],
			className: {
				1: "keyword",
				3: "title.function"
			},
			contains: [{ begin: /\(\)/ }, ie]
		}, de = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", O = {
			match: [
				/const|var|let/,
				/\s+/,
				d,
				/\s*/,
				/=\s*/,
				/(async\s*)?/,
				t.lookahead(de)
			],
			keywords: "async",
			className: {
				1: "keyword",
				3: "title.function"
			},
			contains: [ie]
		};
		return {
			name: "JavaScript",
			aliases: [
				"js",
				"jsx",
				"mjs",
				"cjs"
			],
			keywords: h,
			exports: {
				PARAMS_CONTAINS: re,
				CLASS_REFERENCE: ae
			},
			illegal: /#(?![$_A-Za-z])/,
			contains: [
				e.SHEBANG({
					label: "shebang",
					binary: "node",
					relevance: 5
				}),
				E,
				e.APOS_STRING_MODE,
				e.QUOTE_STRING_MODE,
				x,
				S,
				ee,
				te,
				C,
				{ match: /\$\d+/ },
				y,
				ae,
				{
					scope: "attr",
					match: d + t.lookahead(":"),
					relevance: 0
				},
				O,
				{
					begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
					keywords: "return throw case",
					relevance: 0,
					contains: [
						C,
						e.REGEXP_MODE,
						{
							className: "function",
							begin: de,
							returnBegin: !0,
							end: "\\s*=>",
							contains: [{
								className: "params",
								variants: [
									{
										begin: e.UNDERSCORE_IDENT_RE,
										relevance: 0
									},
									{
										className: null,
										begin: /\(\s*\)/,
										skip: !0
									},
									{
										begin: /(\s*)\(/,
										end: /\)/,
										excludeBegin: !0,
										excludeEnd: !0,
										keywords: h,
										contains: re
									}
								]
							}]
						},
						{
							begin: /,/,
							relevance: 0
						},
						{
							match: /\s+/,
							relevance: 0
						},
						{
							variants: [
								{
									begin: f.begin,
									end: f.end
								},
								{ match: p },
								{
									begin: m.begin,
									"on:begin": m.isTrulyOpeningTag,
									end: m.end
								}
							],
							subLanguage: "xml",
							contains: [{
								begin: m.begin,
								end: m.end,
								skip: !0,
								contains: ["self"]
							}]
						}
					]
				},
				oe,
				{ beginKeywords: "while if switch catch for" },
				{
					begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
					returnBegin: !0,
					label: "func.def",
					contains: [ie, e.inherit(e.TITLE_MODE, {
						begin: d,
						className: "title.function"
					})]
				},
				{
					match: /\.\.\./,
					relevance: 0
				},
				le,
				{
					match: "\\$" + d,
					relevance: 0
				},
				{
					match: [/\bconstructor(?=\s*\()/],
					className: { 1: "title.function" },
					contains: [ie]
				},
				ce,
				D,
				T,
				ue,
				{ match: /\$[(.]/ }
			]
		};
	}
	function d(e) {
		let t = e.regex, a = u(e), o = n, s = [
			"any",
			"void",
			"number",
			"boolean",
			"string",
			"object",
			"never",
			"symbol",
			"bigint",
			"unknown"
		], d = {
			begin: [
				/namespace/,
				/\s+/,
				e.IDENT_RE
			],
			beginScope: {
				1: "keyword",
				3: "title.class"
			}
		}, f = {
			beginKeywords: "interface",
			end: /\{/,
			excludeEnd: !0,
			keywords: {
				keyword: "interface extends",
				built_in: s
			},
			contains: [a.exports.CLASS_REFERENCE]
		}, p = {
			className: "meta",
			relevance: 10,
			begin: /^\s*['"]use strict['"]/
		}, m = {
			$pattern: n,
			keyword: r.concat([
				"type",
				"interface",
				"public",
				"private",
				"protected",
				"implements",
				"declare",
				"abstract",
				"readonly",
				"enum",
				"override",
				"satisfies"
			]),
			literal: i,
			built_in: l.concat(s),
			"variable.language": c
		}, h = {
			className: "meta",
			begin: "@" + o
		}, g = (e, t, n) => {
			let r = e.contains.findIndex((e) => e.label === t);
			if (r === -1) throw Error("can not find mode to replace");
			e.contains.splice(r, 1, n);
		};
		Object.assign(a.keywords, m), a.exports.PARAMS_CONTAINS.push(h);
		let _ = a.contains.find((e) => e.scope === "attr"), v = Object.assign({}, _, { match: t.concat(o, t.lookahead(/\s*\?:/)) });
		a.exports.PARAMS_CONTAINS.push([
			a.exports.CLASS_REFERENCE,
			_,
			v
		]), a.contains = a.contains.concat([
			h,
			d,
			f,
			v
		]), g(a, "shebang", e.SHEBANG()), g(a, "use_strict", p);
		let y = a.contains.find((e) => e.label === "func.def");
		return y.relevance = 0, Object.assign(a, {
			name: "TypeScript",
			aliases: [
				"ts",
				"tsx",
				"mts",
				"cts"
			]
		}), a;
	}
	t.exports = d;
})), l_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		let t = e.regex, n = {
			className: "string",
			begin: /"(""|[^/n])"C\b/
		}, r = {
			className: "string",
			begin: /"/,
			end: /"/,
			illegal: /\n/,
			contains: [{ begin: /""/ }]
		}, i = /\d{1,2}\/\d{1,2}\/\d{4}/, a = /\d{4}-\d{1,2}-\d{1,2}/, o = /(\d|1[012])(:\d+){0,2} *(AM|PM)/, s = /\d{1,2}(:\d{1,2}){1,2}/, c = {
			className: "literal",
			variants: [
				{ begin: t.concat(/# */, t.either(a, i), / *#/) },
				{ begin: t.concat(/# */, s, / *#/) },
				{ begin: t.concat(/# */, o, / *#/) },
				{ begin: t.concat(/# */, t.either(a, i), / +/, t.either(o, s), / *#/) }
			]
		}, l = {
			className: "number",
			relevance: 0,
			variants: [
				{ begin: /\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/ },
				{ begin: /\b\d[\d_]*((U?[SIL])|[%&])?/ },
				{ begin: /&H[\dA-F_]+((U?[SIL])|[%&])?/ },
				{ begin: /&O[0-7_]+((U?[SIL])|[%&])?/ },
				{ begin: /&B[01_]+((U?[SIL])|[%&])?/ }
			]
		}, u = {
			className: "label",
			begin: /^\w+:/
		}, d = e.COMMENT(/'''/, /$/, { contains: [{
			className: "doctag",
			begin: /<\/?/,
			end: />/
		}] }), f = e.COMMENT(null, /$/, { variants: [{ begin: /'/ }, { begin: /([\t ]|^)REM(?=\s)/ }] });
		return {
			name: "Visual Basic .NET",
			aliases: ["vb"],
			case_insensitive: !0,
			classNameAliases: { label: "symbol" },
			keywords: {
				keyword: "addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",
				built_in: "addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort",
				type: "boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort",
				literal: "true false nothing"
			},
			illegal: "//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",
			contains: [
				n,
				r,
				c,
				l,
				u,
				d,
				f,
				{
					className: "meta",
					begin: /[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,
					end: /$/,
					keywords: { keyword: "const disable else elseif enable end externalsource if region then" },
					contains: [f]
				}
			]
		};
	}
	t.exports = n;
})), u_ = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		e.regex;
		let t = e.COMMENT(/\(;/, /;\)/);
		return t.contains.push("self"), {
			name: "WebAssembly",
			keywords: {
				$pattern: /[\w.]+/,
				keyword: /* @__PURE__ */ "anyfunc,block,br,br_if,br_table,call,call_indirect,data,drop,elem,else,end,export,func,global.get,global.set,local.get,local.set,local.tee,get_global,get_local,global,if,import,local,loop,memory,memory.grow,memory.size,module,mut,nop,offset,param,result,return,select,set_global,set_local,start,table,tee_local,then,type,unreachable".split(",")
			},
			contains: [
				e.COMMENT(/;;/, /$/),
				t,
				{
					match: [
						/(?:offset|align)/,
						/\s*/,
						/=/
					],
					className: {
						1: "keyword",
						3: "operator"
					}
				},
				{
					className: "variable",
					begin: /\$[\w_]+/
				},
				{
					match: /(\((?!;)|\))+/,
					className: "punctuation",
					relevance: 0
				},
				{
					begin: [
						/(?:func|call|call_indirect)/,
						/\s+/,
						/\$[^\s)]+/
					],
					className: {
						1: "keyword",
						3: "title.function"
					}
				},
				e.QUOTE_STRING_MODE,
				{
					match: /(i32|i64|f32|f64)(?!\.)/,
					className: "type"
				},
				{
					className: "keyword",
					match: /\b(f32|f64|i32|i64)(?:\.(?:abs|add|and|ceil|clz|const|convert_[su]\/i(?:32|64)|copysign|ctz|demote\/f64|div(?:_[su])?|eqz?|extend_[su]\/i32|floor|ge(?:_[su])?|gt(?:_[su])?|le(?:_[su])?|load(?:(?:8|16|32)_[su])?|lt(?:_[su])?|max|min|mul|nearest|neg?|or|popcnt|promote\/f32|reinterpret\/[fi](?:32|64)|rem_[su]|rot[lr]|shl|shr_[su]|store(?:8|16|32)?|sqrt|sub|trunc(?:_[su]\/f(?:32|64))?|wrap\/i64|xor))\b/
				},
				{
					className: "number",
					relevance: 0,
					match: /[+-]?\b(?:\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?|0x[\da-fA-F](?:_?[\da-fA-F])*(?:\.[\da-fA-F](?:_?[\da-fA-D])*)?(?:[pP][+-]?\d(?:_?\d)*)?)\b|\binf\b|\bnan(?::0x[\da-fA-F](?:_?[\da-fA-D])*)?\b/
				}
			]
		};
	}
	t.exports = n;
})), d_ = (/* @__PURE__ */ l((/* @__PURE__ */ o(((e, t) => {
	var n = Og();
	n.registerLanguage("xml", kg()), n.registerLanguage("bash", Ag()), n.registerLanguage("c", jg()), n.registerLanguage("cpp", Mg()), n.registerLanguage("csharp", Ng()), n.registerLanguage("css", Pg()), n.registerLanguage("markdown", Fg()), n.registerLanguage("diff", Ig()), n.registerLanguage("ruby", Lg()), n.registerLanguage("go", Rg()), n.registerLanguage("graphql", zg()), n.registerLanguage("ini", Bg()), n.registerLanguage("java", Vg()), n.registerLanguage("javascript", Hg()), n.registerLanguage("json", Ug()), n.registerLanguage("kotlin", Wg()), n.registerLanguage("less", Gg()), n.registerLanguage("lua", Kg()), n.registerLanguage("makefile", qg()), n.registerLanguage("perl", Jg()), n.registerLanguage("objectivec", Yg()), n.registerLanguage("php", Xg()), n.registerLanguage("php-template", Zg()), n.registerLanguage("plaintext", Qg()), n.registerLanguage("python", $g()), n.registerLanguage("python-repl", e_()), n.registerLanguage("r", t_()), n.registerLanguage("rust", n_()), n.registerLanguage("scss", r_()), n.registerLanguage("shell", i_()), n.registerLanguage("sql", a_()), n.registerLanguage("swift", o_()), n.registerLanguage("yaml", s_()), n.registerLanguage("typescript", c_()), n.registerLanguage("vbnet", l_()), n.registerLanguage("wasm", u_()), n.HighlightJS = n, n.default = n, t.exports = n;
})))())).default;
//#endregion
//#region node_modules/marked/lib/marked.esm.js
function f_() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var p_ = f_();
function m_(e) {
	p_ = e;
}
var h_ = { exec: () => null };
function g_(e) {
	let t = [];
	return (n) => {
		let r = Math.max(0, Math.min(3, n - 1)), i = t[r];
		return i || (i = e(r), t[r] = i), i;
	};
}
function $(e, t = "") {
	let n = typeof e == "string" ? e : e.source, r = {
		replace: (e, t) => {
			let i = typeof t == "string" ? t : t.source;
			return i = i.replace(v_.caret, "$1"), n = n.replace(e, i), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
var __ = ((e = "") => {
	try {
		return !!RegExp("(?<=1)(?<!1)" + e);
	} catch {
		return !1;
	}
})(), v_ = {
	codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm,
	outputLinkReplace: /\\([\[\]])/g,
	indentCodeCompensation: /^(\s+)(?:```)/,
	beginningSpace: /^\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	endingSpaceTabChar: /[ \t]$/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\n/g,
	tabCharGlobal: /\t/g,
	leadingSpaceTab: /^[ \t]+/,
	multipleSpaceGlobal: /\s+/g,
	blankLine: /^[ \t]*$/,
	doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\[[ xX]\] +\S/,
	listReplaceTask: /^\[[ xX]\] +/,
	listTaskCheckbox: /\[[ xX]\]/,
	anyLine: /\n.*\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\||\| *$/g,
	tableRowBlankLine: /\n[ \t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
	endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
	unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
	numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	caret: /(^|[^\[])\^/g,
	percentDecode: /%25/g,
	findPipe: /\|/g,
	splitPipe: / \|/,
	slashPipe: /\\\|/g,
	carriageReturn: /\r\n|\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\S*/,
	endingNewline: /\n$/,
	listItemRegex: (e) => RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
	nextBulletRegex: g_((e) => RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),
	hrRegex: g_((e) => RegExp(`^ {0,${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),
	fencesBeginRegex: g_((e) => RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
	headingBeginRegex: g_((e) => RegExp(`^ {0,${e}}#`)),
	htmlBeginRegex: g_((e) => RegExp(`^ {0,${e}}(?:</?(?:${N_})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")),
	blockquoteBeginRegex: g_((e) => RegExp(`^ {0,${e}}>`))
}, y_ = /^(?:[ \t]*(?:\n|$))+/, b_ = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, x_ = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, S_ = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, C_ = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, w_ = / {0,3}(?:[*+-]|\d{1,9}[.)])/, T_ = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, E_ = $(T_).replace(/bull/g, w_).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), D_ = $(T_).replace(/bull/g, w_).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), O_ = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, k_ = /^[^\n]+/, A_ = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, j_ = $(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", A_).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), M_ = $(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, w_).getRegex(), N_ = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", P_ = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, F_ = $("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", P_).replace("tag", N_).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), I_ = (e) => $(O_).replace("hr", S_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", e).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N_).getRegex(), L_ = I_(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), R_ = I_(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), z_ = {
	blockquote: $(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", R_).getRegex(),
	code: b_,
	def: j_,
	fences: x_,
	heading: C_,
	hr: S_,
	html: F_,
	lheading: E_,
	list: M_,
	newline: y_,
	paragraph: L_,
	table: h_,
	text: k_
}, B_ = $("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", S_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N_).getRegex(), V_ = {
	...z_,
	lheading: D_,
	table: B_,
	paragraph: $(O_).replace("hr", S_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", B_).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N_).getRegex()
}, H_ = {
	...z_,
	html: $("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", P_).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: h_,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: $(O_).replace("hr", S_).replace("heading", " *#{1,6} *[^\n]").replace("lheading", E_).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, U_ = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, W_ = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, G_ = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, K_ = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, q_ = /[\p{P}\p{S}]/u, J_ = /[\s\p{P}\p{S}]/u, Y_ = /[^\s\p{P}\p{S}]/u, X_ = $(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, J_).getRegex(), Z_ = /[\p{Pi}\p{Ps}"']/u, Q_ = /(?!~)[\p{P}\p{S}]/u, $_ = /(?!~)[\s\p{P}\p{S}]/u, ev = /(?:[^\s\p{P}\p{S}]|~)/u, tv = $(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", __ ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), nv = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, rv = $(nv, "u").replace(/punct/g, q_).getRegex(), iv = $(nv, "u").replace(/punct/g, Q_).getRegex(), av = $(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, Z_).replace(/punct/g, q_).getRegex(), ov = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", sv = $(ov, "gu").replace(/notPunctSpace/g, Y_).replace(/punctSpace/g, J_).replace(/punct/g, q_).getRegex(), cv = $(ov, "gu").replace(/notPunctSpace/g, ev).replace(/punctSpace/g, $_).replace(/punct/g, Q_).getRegex(), lv = $("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, Y_).replace(/punctSpace/g, J_).replace(/punct/g, q_).getRegex(), uv = $("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Y_).replace(/punctSpace/g, J_).replace(/punct/g, q_).getRegex(), dv = $("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, Y_).replace(/punctSpace/g, J_).replace(/punct/g, q_).getRegex(), fv = $(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, q_).getRegex(), pv = $("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, Y_).replace(/punctSpace/g, J_).replace(/punct/g, q_).getRegex(), mv = $(/\\(punct)/, "gu").replace(/punct/g, q_).getRegex(), hv = $(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), gv = $(P_).replace("(?:-->|$)", "-->").getRegex(), _v = $("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", gv).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), vv = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, yv = $(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", vv).getRegex(), bv = $(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", yv).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), xv = $(/^!?\[(label)\]\[(ref)\]/).replace("label", yv).replace("ref", A_).getRegex(), Sv = $(/^!?\[(ref)\](?:\[\])?/).replace("ref", A_).getRegex(), Cv = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, wv = $(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", vv).getRegex(), Tv = $("reflink|nolink(?!\\()", "g").replace("reflink", $(/^!?\[(label)\]\[(ref)\]/).replace("label", wv).replace("ref", Cv).getRegex()).replace("nolink", $(/^!?\[(ref)\](?:\[\])?/).replace("ref", Cv).getRegex()).getRegex(), Ev = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Dv = $(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), Ov = {
	_backpedal: h_,
	anyPunctuation: mv,
	autolink: hv,
	blockSkip: tv,
	br: G_,
	code: W_,
	del: h_,
	delLDelim: h_,
	delRDelim: h_,
	emStrongLDelim: rv,
	emStrongRDelimAst: sv,
	emStrongRDelimUnd: uv,
	escape: U_,
	link: bv,
	nolink: Sv,
	punctuation: X_,
	reflink: xv,
	reflinkSearch: Tv,
	tag: _v,
	text: K_,
	url: h_
}, kv = {
	...Ov,
	emStrongLDelim: av,
	emStrongRDelimAst: lv,
	emStrongRDelimUnd: dv,
	link: $(/^!?\[(label)\]\((.*?)\)/).replace("label", yv).getRegex(),
	reflink: $(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", yv).getRegex()
}, Av = {
	...Ov,
	emStrongRDelimAst: cv,
	emStrongLDelim: iv,
	delLDelim: fv,
	delRDelim: pv,
	url: $(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", Dv).replace("protocol", Ev).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: $(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", Ev).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex()
}, jv = {
	...Av,
	br: $(G_).replace("{2,}", "*").getRegex(),
	text: $(Av.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Mv = {
	normal: z_,
	gfm: V_,
	pedantic: H_
}, Nv = {
	normal: Ov,
	gfm: Av,
	breaks: jv,
	pedantic: kv
}, Pv = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, Fv = (e) => Pv[e];
function Iv(e, t) {
	if (t) {
		if (v_.escapeTest.test(e)) return e.replace(v_.escapeReplace, Fv);
	} else if (v_.escapeTestNoEncode.test(e)) return e.replace(v_.escapeReplaceNoEncode, Fv);
	return e;
}
function Lv(e) {
	return e.replace(v_.numericCharacterReference, (e, t, n) => {
		let r = t === void 0 ? Number.parseInt(n, 16) : Number.parseInt(t, 10);
		return r === 0 || r > 1114111 || r >= 55296 && r <= 57343 ? "�" : String.fromCodePoint(r);
	});
}
function Rv(e) {
	try {
		e = encodeURI(e).replace(v_.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function zv(e, t) {
	let n = e.replace(v_.findPipe, (e, t, n) => {
		let r = !1, i = t;
		for (; --i >= 0 && n[i] === "\\";) r = !r;
		return r ? "|" : " |";
	}).split(v_.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) {
		if (n.length > t) n.splice(t);
		else for (; n.length < t;) n.push("");
	}
	for (; r < n.length; r++) n[r] = n[r].trim().replace(v_.slashPipe, "|");
	return n;
}
function Bv(e, t, n) {
	let r = e.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let a = e.charAt(r - i - 1);
		if (a === t && !n) i++;
		else if (a !== t && n) i++;
		else break;
	}
	return e.slice(0, r - i);
}
function Vv(e) {
	let t = e.split("\n"), n = t.length - 1;
	for (; n >= 0 && v_.blankLine.test(t[n]);) n--;
	return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
}
function Hv(e) {
	return e.trim().toLowerCase().toUpperCase().toLowerCase();
}
function Uv(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function Wv(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function Gv(e, t, n, r, i) {
	let a = t.href, o = t.title || null, s = e[1].replace(i.other.outputLinkReplace, "$1"), c = e[0].charAt(0) === "!";
	r.state.inLink = !0;
	let l = r.state.linkEmitted, u = r.state.inRawBlock;
	r.state.linkEmitted = !1;
	let d = r.inlineTokens(s), f = r.state.linkEmitted;
	if (r.state.linkEmitted = l, r.state.inLink = !1, !c) {
		if (f) {
			r.state.inRawBlock = u;
			return;
		}
		r.state.linkEmitted = !0;
	}
	return {
		type: c ? "image" : "link",
		raw: n,
		href: a,
		title: o,
		text: s,
		tokens: d
	};
}
function Kv(e, t, n) {
	let r = e.match(n.other.indentCodeCompensation);
	if (r === null) return t;
	let i = r[1];
	return t.split("\n").map((e) => {
		let t = e.match(n.other.beginningSpace);
		if (t === null) return e;
		let [r] = t;
		return e.slice(Math.min(r.length, i.length));
	}).join("\n");
}
function qv(e, t, n, r) {
	if (!t.includes("<")) return !1;
	for (let i = 0; i < t.length; i++) {
		if (t[i] === "\\") {
			i++;
			continue;
		}
		if (t[i] === "`") {
			let e = r.inline.code.exec(t.slice(i));
			if (e) {
				i += e[0].length - 1;
				continue;
			}
		}
		if (t[i] !== "<") continue;
		let a = e.slice(n + i), o = r.inline.tag.exec(a) || r.inline.autolink.exec(a);
		if (o) {
			if (o[0].length > t.length - i) return !0;
			i += o[0].length - 1;
		}
	}
	return !1;
}
var Jv = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || p_;
	}
	space(e) {
		let t = this.rules.block.newline.exec(e);
		if (t && t[0].length > 0) return {
			type: "space",
			raw: t[0]
		};
	}
	code(e) {
		let t = this.rules.block.code.exec(e);
		if (t) {
			let e = this.options.pedantic ? t[0] : Vv(t[0]);
			return {
				type: "code",
				raw: e,
				codeBlockStyle: "indented",
				text: e.replace(this.rules.other.codeRemoveIndent, "")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let e = t[0], n = Kv(e, t[3] || "", this.rules);
			return {
				type: "code",
				raw: e,
				lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
				text: n
			};
		}
	}
	heading(e) {
		let t = this.rules.block.heading.exec(e);
		if (t) {
			let e = t[2].trim();
			if (this.rules.other.endingHash.test(e)) {
				let t = Bv(e, "#");
				(this.options.pedantic || !t || this.rules.other.endingSpaceTabChar.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: Bv(t[0], "\n"),
				depth: t[1].length,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	hr(e) {
		let t = this.rules.block.hr.exec(e);
		if (t) return {
			type: "hr",
			raw: Bv(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = Bv(t[0], "\n").split("\n"), n = "", r = "", i = [];
			for (; e.length > 0;) {
				let t = !1, a = [], o = 0;
				for (; o < e.length; o++) if (this.rules.other.blockquoteStart.test(e[o])) a.push(e[o]), t = !0;
				else if (!t) a.push(e[o]);
				else break;
				e = e.slice(o);
				let s = a.join("\n"), c = s.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
				n = n ? `${n}
${s}` : s, r = r ? `${r}
${c}` : c;
				let l = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = l, e.length === 0) break;
				let u = i.at(-1);
				if (u?.type === "code") break;
				if (u?.type === "blockquote") {
					let t = u, a = e.join("\n"), o = t.raw + "\n" + a.replace(this.rules.other.blockquoteSetextReplace2, ""), s = this.blockquote(o);
					i[i.length - 1] = s;
					let c = o.substring(s.raw.length).replace(/^\n/, ""), l = c ? c.split("\n").length : 0, d = l ? e.slice(0, -l) : e;
					d.length > 0 && (n = `${n}
${d.join("\n")}`), r = r.substring(0, r.length - t.text.length) + s.text;
					break;
				}
				if (u?.type === "list") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.list(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - u.raw.length) + o.raw, r = r.substring(0, r.length - t.raw.length) + o.raw, e = a.substring(i.at(-1).raw.length).split("\n");
					continue;
				}
			}
			return {
				type: "blockquote",
				raw: n,
				tokens: i,
				text: r
			};
		}
	}
	list(e) {
		let t = this.rules.block.list.exec(e);
		if (t) {
			let n = t[1].trim(), r = n.length > 1, i = {
				type: "list",
				raw: "",
				ordered: r,
				start: r ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
			let a = this.rules.other.listItemRegex(n), o = !1;
			for (; e;) {
				let n = !1, r = "", s = "";
				if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
				r = t[0], e = e.substring(r.length);
				let c = t[2].split("\n", 1)[0], l = t[1].length, u = this.options.pedantic ? Wv(c, l) : c.replace(this.rules.other.leadingSpaceTab, (e) => Wv(e, l)), d = e.split("\n", 1)[0], f = !u.trim(), p = 0;
				if (this.options.pedantic ? (p = 2, s = u.trimStart()) : f ? p = l + 1 : (p = u.search(this.rules.other.nonSpaceChar), p = p > 4 ? 1 : p, s = u.slice(p), p += l), f && this.rules.other.blankLine.test(d) && (r += d + "\n", e = e.substring(d.length + 1), n = !0), !n) {
					let t = this.rules.other.nextBulletRegex(p), n = this.rules.other.hrRegex(p), i = this.rules.other.fencesBeginRegex(p), a = this.rules.other.headingBeginRegex(p), o = this.rules.other.htmlBeginRegex(p), c = this.rules.other.blockquoteBeginRegex(p);
					for (; e;) {
						let l = e.split("\n", 1)[0], m;
						if (d = l, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), m = d) : m = d.replace(this.rules.other.leadingSpaceTab, (e) => e.replace(this.rules.other.tabCharGlobal, "    ")), i.test(d) || a.test(d) || o.test(d) || c.test(d) || t.test(d) || n.test(d)) break;
						if (m.search(this.rules.other.nonSpaceChar) >= p || !d.trim()) s += "\n" + m.slice(p);
						else {
							if (f || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || i.test(u) || a.test(u) || n.test(u)) break;
							s += "\n" + d;
						}
						f = !d.trim(), r += l + "\n", e = e.substring(l.length + 1), u = m.slice(p);
					}
				}
				i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(r) && (o = !0)), i.items.push({
					type: "list_item",
					raw: r,
					task: !!this.options.gfm && this.rules.other.listIsTask.test(s),
					loose: !1,
					text: s,
					tokens: []
				}), i.raw += r;
			}
			let s = i.items.at(-1);
			if (s) s.raw = s.raw.trimEnd(), s.text = s.text.trimEnd();
			else return;
			i.raw = i.raw.trimEnd();
			for (let e of i.items) if (this.lexer.state.top = !1, e.tokens = this.lexer.blockTokens(e.text, []), !i.loose) {
				let t = e.tokens.filter((e) => e.type === "space");
				i.loose = t.length > 0 && t.some((e) => this.rules.other.anyLine.test(e.raw));
			}
			for (let e of i.items) {
				let t = e.tokens[0];
				if (e.task && (t?.type === "text" || t?.type === "paragraph")) {
					e.text = e.text.replace(this.rules.other.listReplaceTask, ""), t.raw = t.raw.replace(this.rules.other.listReplaceTask, ""), t.text = t.text.replace(this.rules.other.listReplaceTask, "");
					for (let e = this.lexer.inlineQueue.length - 1; e >= 0; e--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)) {
						this.lexer.inlineQueue[e].src = this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask, "");
						break;
					}
					let n = this.rules.other.listTaskCheckbox.exec(e.raw);
					if (n) {
						let t = {
							type: "checkbox",
							raw: n[0] + " ",
							checked: n[0] !== "[ ]"
						};
						e.checked = t.checked, i.loose ? e.tokens[0] && ["paragraph", "text"].includes(e.tokens[0].type) && "tokens" in e.tokens[0] && e.tokens[0].tokens ? (e.tokens[0].raw = t.raw + e.tokens[0].raw, e.tokens[0].text = t.raw + e.tokens[0].text, e.tokens[0].tokens.unshift(t)) : e.tokens.unshift({
							type: "paragraph",
							raw: t.raw,
							text: t.raw,
							tokens: [t]
						}) : e.tokens.unshift(t);
					}
				} else e.task &&= !1;
			}
			if (i.loose) for (let e of i.items) {
				e.loose = !0;
				for (let t of e.tokens) t.type === "text" && (t.type = "paragraph");
			}
			return i;
		}
	}
	html(e) {
		let t = this.rules.block.html.exec(e);
		if (t) {
			let e = Vv(t[0]);
			return {
				type: "html",
				block: !0,
				raw: e,
				pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
				text: e
			};
		}
	}
	def(e) {
		let t = this.rules.block.def.exec(e);
		if (t) {
			let e = Hv(t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), n = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
			return {
				type: "def",
				tag: e,
				raw: Bv(t[0], "\n"),
				href: n,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = zv(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
			type: "table",
			raw: Bv(t[0], "\n"),
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let e of r) this.rules.other.tableAlignRight.test(e) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(e) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(e) ? a.align.push("left") : a.align.push(null);
			for (let e = 0; e < n.length; e++) a.header.push({
				text: n[e],
				tokens: this.lexer.inline(n[e]),
				header: !0,
				align: a.align[e]
			});
			for (let e of i) a.rows.push(zv(e, a.header.length).map((e, t) => ({
				text: e,
				tokens: this.lexer.inline(e),
				header: !1,
				align: a.align[t]
			})));
			return a;
		}
	}
	lheading(e) {
		let t = this.rules.block.lheading.exec(e);
		if (t) {
			let e = t[1].trim();
			return {
				type: "heading",
				raw: Bv(t[0], "\n"),
				depth: t[2].charAt(0) === "=" ? 1 : 2,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	paragraph(e) {
		let t = this.rules.block.paragraph.exec(e);
		if (t) {
			let e = t[1].charAt(t[1].length - 1) === "\n" ? t[1].slice(0, -1) : t[1];
			return {
				type: "paragraph",
				raw: t[0],
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	text(e) {
		let t = this.rules.block.text.exec(e);
		if (t) return {
			type: "text",
			raw: t[0],
			text: t[0],
			tokens: this.lexer.inline(t[0])
		};
	}
	escape(e) {
		let t = this.rules.inline.escape.exec(e);
		if (t) return {
			type: "escape",
			raw: t[0],
			text: t[1]
		};
	}
	tag(e) {
		let t = this.rules.inline.tag.exec(e);
		if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: t[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: t[0]
		};
	}
	link(e) {
		let t = this.rules.inline.link.exec(e);
		if (t) {
			let n = t[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && qv(e, t[1], n, this.rules)) return;
			let r = t[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
				if (!this.rules.other.endAngleBracket.test(r)) return;
				let e = Bv(r.slice(0, -1), "\\");
				if ((r.length - e.length) % 2 == 0) return;
			} else {
				let e = Uv(t[2], "()");
				if (e === -2) return;
				if (e > -1) {
					let n = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + e;
					t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, n).trim(), t[3] = "";
				}
			}
			let i = t[2], a = "";
			if (this.options.pedantic) {
				let e = this.rules.other.pedanticHrefTitle.exec(i);
				e && (i = e[1], a = e[3]);
			} else a = t[3] ? t[3].slice(1, -1) : "";
			return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (i = this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i.slice(1) : i.slice(1, -1)), Gv(t, {
				href: i && i.replace(this.rules.inline.anyPunctuation, "$1"),
				title: a && a.replace(this.rules.inline.anyPunctuation, "$1")
			}, t[0], this.lexer, this.rules);
		}
	}
	reflink(e, t) {
		let n;
		if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
			let r = n[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && qv(e, n[1], r, this.rules)) return;
			let i = t[Hv((n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "))];
			if (!i) {
				let e = n[0].charAt(0);
				return {
					type: "text",
					raw: e,
					text: e
				};
			}
			return Gv(n, i, n[0], this.lexer, this.rules);
		}
	}
	emStrong(e, t, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(e);
		if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))) {
			let i = [...r[0]].length - 1, a, o, s = i, c = 0, l = r[0][0], u = n === l, d = l === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (d.lastIndex = 0, t = t.slice(-1 * e.length + i); (r = d.exec(t)) !== null;) {
				if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
				if (o = [...a].length, r[3] || r[4]) {
					s += o;
					continue;
				}
				if (r[5] || r[6]) {
					if (i % 3 && !((i + o) % 3)) {
						c += o;
						continue;
					}
					if (u) break;
				}
				if (s -= o, s > 0) continue;
				o = Math.min(o, o + s + c);
				let t = [...r[0]][0].length, n = e.slice(0, i + r.index + t + o);
				if (Math.min(i, o) % 2) {
					let e = n.slice(1, -1);
					return {
						type: "em",
						raw: n,
						text: e,
						tokens: this.lexer.inlineTokens(e)
					};
				}
				let l = n.slice(2, -2);
				return {
					type: "strong",
					raw: n,
					text: l,
					tokens: this.lexer.inlineTokens(l)
				};
			}
		}
	}
	codespan(e) {
		let t = this.rules.inline.code.exec(e);
		if (t) {
			let e = t[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(e), r = this.rules.other.startingSpaceChar.test(e) && this.rules.other.endingSpaceChar.test(e);
			return n && r && (e = e.substring(1, e.length - 1)), {
				type: "codespan",
				raw: t[0],
				text: e
			};
		}
	}
	br(e) {
		let t = this.rules.inline.br.exec(e);
		if (t) return {
			type: "br",
			raw: t[0]
		};
	}
	del(e, t, n = "") {
		let r = this.rules.inline.delLDelim.exec(e);
		if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = this.rules.inline.delRDelim;
			for (s.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = s.exec(t)) !== null;) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (a = [...i].length, a !== n)) continue;
				if (r[3] || r[4]) {
					o += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o);
				let t = [...r[0]][0].length, s = e.slice(0, n + r.index + t + a), c = s.slice(n, -n);
				return {
					type: "del",
					raw: s,
					text: c,
					tokens: this.lexer.inlineTokens(c)
				};
			}
		}
	}
	autolink(e) {
		let t = this.rules.inline.autolink.exec(e);
		if (t) {
			let e, n;
			return t[2] === "@" ? (e = t[1], n = "mailto:" + e) : (e = t[1], n = e), {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	url(e) {
		let t;
		if (t = this.rules.inline.url.exec(e)) {
			let e, n;
			if (t[2] === "@") e = t[0], n = "mailto:" + e;
			else {
				let r;
				do
					r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
				while (r !== t[0]);
				e = t[0], n = t[1] === "www." ? "http://" + t[0] : t[0];
			}
			return {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	inlineText(e) {
		let t = this.rules.inline.text.exec(e);
		if (t) {
			let e = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: t[0],
				text: e ? t[0] : Lv(t[0]),
				escaped: e
			};
		}
	}
}, Yv = class e {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || p_, this.options.tokenizer = this.options.tokenizer || new Jv(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			top: !0
		};
		let t = {
			other: v_,
			block: Mv.normal,
			inline: Nv.normal
		};
		this.options.pedantic ? (t.block = Mv.pedantic, t.inline = Nv.pedantic) : this.options.gfm && (t.block = Mv.gfm, t.inline = this.options.breaks ? Nv.breaks : Nv.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: Mv,
			inline: Nv
		};
	}
	static lex(t, n) {
		return new e(n).lex(t);
	}
	static lexInline(t, n) {
		return new e(n).inlineTokens(t);
	}
	lex(e) {
		e = e.replace(v_.carriageReturn, "\n"), this.blockTokens(e, this.tokens);
		for (let e = 0; e < this.inlineQueue.length; e++) {
			let t = this.inlineQueue[e];
			this.inlineTokens(t.src, t.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(v_.tabCharGlobal, "    ").replace(v_.spaceLine, ""));
		let r = 1 / 0;
		for (; e;) {
			if (e.length < r) r = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			let i;
			if (this.options.extensions?.block?.some((n) => (i = n.call({ lexer: this }, e, t)) ? (e = e.substring(i.raw.length), t.push(i), !0) : !1)) continue;
			if (i = this.tokenizer.space(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				i.raw.length === 1 && n !== void 0 ? n.raw += "\n" : t.push(i);
				continue;
			}
			if (i = this.tokenizer.code(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.text, this.inlineQueue.at(-1).src = n.text) : t.push(i);
				continue;
			}
			if (i = this.tokenizer.fences(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.heading(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.hr(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.blockquote(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.list(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.html(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.def(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.raw, this.inlineQueue.at(-1).src = n.text) : this.tokens.links[i.tag] || (this.tokens.links[i.tag] = {
					href: i.href,
					title: i.title
				}, t.push(i));
				continue;
			}
			if (i = this.tokenizer.table(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.lheading(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			let a = e;
			if (this.options.extensions?.startBlock) {
				let t = 1 / 0, n = e.slice(1), r;
				this.options.extensions.startBlock.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < 1 / 0 && t >= 0 && (a = e.substring(0, t + 1));
			}
			if (this.state.top && (i = this.tokenizer.paragraph(a))) {
				let r = t.at(-1);
				n && r?.type === "paragraph" ? (r.raw += (r.raw.endsWith("\n") ? "" : "\n") + i.raw, r.text += "\n" + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = r.text) : t.push(i), n = a.length !== e.length, e = e.substring(i.raw.length);
				continue;
			}
			if (i = this.tokenizer.text(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = n.text) : t.push(i);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return this.state.top = !0, t;
	}
	inline(e, t = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: t
		}), t;
	}
	linkInText(e) {
		if (!e.includes("[")) return !1;
		let t = this.tokenizer.rules.inline.link;
		for (let n of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (t.test(n[0]) && e.charAt(n.index - 1) !== "!") return !0;
		for (let t of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
			let e = t[0], n = e.lastIndexOf("[");
			if (e.charAt(0) !== "!" && Object.hasOwn(this.tokens.links, Hv(e.slice(n + 1, -1))) && !(n > 1 && this.linkInText(e.slice(1, n - 1)))) return !0;
		}
		return !1;
	}
	inlineTokens(e, t = []) {
		this.tokenizer.lexer = this;
		let n = e;
		if (this.tokens.links && e.includes("[")) {
			let e = this.tokenizer.rules.inline.reflinkSearch, t = (n) => {
				let r = n.lastIndexOf("[");
				if (!Object.hasOwn(this.tokens.links, Hv(n.slice(r + 1, -1)))) return n;
				if (r > 1 && n.charAt(0) !== "!") {
					let i = n.slice(1, r - 1);
					if (this.linkInText(i)) return "[" + i.replace(e, t) + "][" + "a".repeat(n.length - r - 2) + "]";
				}
				return "[" + "a".repeat(n.length - 2) + "]";
			};
			n = n.replace(e, t);
		}
		n = n.replace(this.tokenizer.rules.inline.anyPunctuation, (e) => "+".repeat(e.length)), n = n.replace(this.tokenizer.rules.inline.blockSkip, (e, t, n) => {
			let r = n ? n.length : 0;
			return e.slice(0, r) + "[" + "a".repeat(e.length - r - 2) + "]";
		}), n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
		let r = !1, i = "", a = 1 / 0;
		for (; e;) {
			if (e.length < a) a = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			r || (i = ""), r = !1;
			let o;
			if (this.options.extensions?.inline?.some((n) => (o = n.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1)) continue;
			if (o = this.tokenizer.escape(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.tag(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.link(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(o.raw.length);
				let n = t.at(-1);
				o.type === "text" && n?.type === "text" ? (n.raw += o.raw, n.text += o.text) : t.push(o);
				continue;
			}
			if (o = this.tokenizer.emStrong(e, n, i)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.codespan(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.br(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.del(e, n, i)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.autolink(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (!this.state.inLink && (o = this.tokenizer.url(e))) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			let s = e;
			if (this.options.extensions?.startInline) {
				let t = 1 / 0, n = e.slice(1), r;
				this.options.extensions.startInline.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < 1 / 0 && t >= 0 && (s = e.substring(0, t + 1));
			}
			if (o = this.tokenizer.inlineText(s)) {
				e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (i = o.raw.slice(-1)), r = !0;
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += o.raw, n.text += o.text) : t.push(o);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return t;
	}
	infiniteLoopError(e) {
		let t = "Infinite loop on byte: " + e;
		if (this.options.silent) console.error(t);
		else throw Error(t);
	}
}, Xv = class {
	options;
	parser;
	constructor(e) {
		this.options = e || p_;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(v_.notSpaceStart)?.[0], i = e ? e.replace(v_.endingNewline, "") + "\n" : "";
		return r ? "<pre><code class=\"language-" + Iv(r) + "\">" + (n ? i : Iv(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : Iv(i, !0)) + "</code></pre>\n";
	}
	blockquote({ tokens: e }) {
		return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
	}
	html({ text: e }) {
		return e;
	}
	def(e) {
		return "";
	}
	heading({ tokens: e, depth: t }) {
		return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
	}
	hr(e) {
		return "<hr>\n";
	}
	list(e) {
		let t = e.ordered, n = e.start, r = "";
		for (let t = 0; t < e.items.length; t++) {
			let n = e.items[t];
			r += this.listitem(n);
		}
		let i = t ? "ol" : "ul", a = t && n !== 1 ? " start=\"" + n + "\"" : "";
		return "<" + i + a + ">\n" + r + "</" + i + ">\n";
	}
	listitem(e) {
		return `<li>${this.parser.parse(e.tokens)}</li>
`;
	}
	checkbox({ checked: e }) {
		return "<input " + (e ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\"> ";
	}
	paragraph({ tokens: e }) {
		return `<p>${this.parser.parseInline(e)}</p>
`;
	}
	table(e) {
		let t = "", n = "";
		for (let t = 0; t < e.header.length; t++) n += this.tablecell(e.header[t]);
		t += this.tablerow({ text: n });
		let r = "";
		for (let t = 0; t < e.rows.length; t++) {
			let i = e.rows[t];
			n = "";
			for (let e = 0; e < i.length; e++) n += this.tablecell(i[e]);
			r += this.tablerow({ text: n });
		}
		return r &&= `<tbody>${r}</tbody>`, "<table>\n<thead>\n" + t + "</thead>\n" + r + "</table>\n";
	}
	tablerow({ text: e }) {
		return `<tr>
${e}</tr>
`;
	}
	tablecell(e) {
		let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
		return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
	}
	strong({ tokens: e }) {
		return `<strong>${this.parser.parseInline(e)}</strong>`;
	}
	em({ tokens: e }) {
		return `<em>${this.parser.parseInline(e)}</em>`;
	}
	codespan({ text: e }) {
		return `<code>${Iv(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, text: n, tokens: r, autolink: i }) {
		let a = i ? Iv(n, !0) : this.parser.parseInline(r), o = Rv(e);
		if (o === null) return a;
		e = Iv(o, i);
		let s = "<a href=\"" + e + "\"";
		return t && (s += " title=\"" + Iv(t) + "\""), s += ">" + a + "</a>", s;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = Rv(e);
		if (i === null) return Iv(n);
		e = i;
		let a = `<img src="${Iv(e)}" alt="${Iv(n)}"`;
		return t && (a += ` title="${Iv(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : Iv(e.text);
	}
}, Zv = class {
	strong({ text: e }) {
		return e;
	}
	em({ text: e }) {
		return e;
	}
	codespan({ text: e }) {
		return e;
	}
	del({ text: e }) {
		return e;
	}
	html({ text: e }) {
		return e;
	}
	text({ text: e }) {
		return e;
	}
	link({ text: e }) {
		return "" + e;
	}
	image({ text: e }) {
		return "" + e;
	}
	br() {
		return "";
	}
	checkbox({ raw: e }) {
		return e;
	}
}, Qv = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || p_, this.options.renderer = this.options.renderer || new Xv(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Zv();
	}
	static parse(t, n) {
		return new e(n).parse(t);
	}
	static parseInline(t, n) {
		return new e(n).parseInline(t);
	}
	parse(e) {
		this.renderer.parser = this;
		let t = "";
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (this.options.extensions?.renderers?.[r.type]) {
				let e = r, n = this.options.extensions.renderers[e.type].call({ parser: this }, e);
				if (n !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"checkbox",
					"html",
					"def",
					"paragraph",
					"text"
				].includes(e.type)) {
					t += n || "";
					continue;
				}
			}
			let i = r;
			switch (i.type) {
				case "space":
					t += this.renderer.space(i);
					break;
				case "hr":
					t += this.renderer.hr(i);
					break;
				case "heading":
					t += this.renderer.heading(i);
					break;
				case "code":
					t += this.renderer.code(i);
					break;
				case "table":
					t += this.renderer.table(i);
					break;
				case "blockquote":
					t += this.renderer.blockquote(i);
					break;
				case "list":
					t += this.renderer.list(i);
					break;
				case "checkbox":
					t += this.renderer.checkbox(i);
					break;
				case "html":
					t += this.renderer.html(i);
					break;
				case "def":
					t += this.renderer.def(i);
					break;
				case "paragraph":
					t += this.renderer.paragraph(i);
					break;
				case "text":
					t += this.renderer.text(i);
					break;
				default: {
					let e = "Token with \"" + i.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return t;
	}
	parseInline(e, t = this.renderer) {
		this.renderer.parser = this;
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let e = this.options.extensions.renderers[i.type].call({ parser: this }, i);
				if (e !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"checkbox",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(i.type)) {
					n += e || "";
					continue;
				}
			}
			let a = i;
			switch (a.type) {
				case "escape":
					n += t.text(a);
					break;
				case "html":
					n += t.html(a);
					break;
				case "link":
					n += t.link(a);
					break;
				case "image":
					n += t.image(a);
					break;
				case "checkbox":
					n += t.checkbox(a);
					break;
				case "strong":
					n += t.strong(a);
					break;
				case "em":
					n += t.em(a);
					break;
				case "codespan":
					n += t.codespan(a);
					break;
				case "br":
					n += t.br(a);
					break;
				case "del":
					n += t.del(a);
					break;
				case "text":
					n += t.text(a);
					break;
				default: {
					let e = "Token with \"" + a.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return n;
	}
}, $v = class {
	options;
	block;
	constructor(e) {
		this.options = e || p_;
	}
	static passThroughHooks = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens",
		"emStrongMask"
	]);
	static passThroughHooksRespectAsync = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	preprocess(e) {
		return e;
	}
	postprocess(e) {
		return e;
	}
	processAllTokens(e) {
		return e;
	}
	emStrongMask(e) {
		return e;
	}
	provideLexer(e = this.block) {
		return e ? Yv.lex : Yv.lexInline;
	}
	provideParser(e = this.block) {
		return e ? Qv.parse : Qv.parseInline;
	}
}, ey = new class {
	defaults = f_();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = Qv;
	Renderer = Xv;
	TextRenderer = Zv;
	Lexer = Yv;
	Tokenizer = Jv;
	Hooks = $v;
	constructor(...e) {
		this.use(...e);
	}
	walkTokens(e, t) {
		let n = [];
		for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
			case "table": {
				let e = r;
				for (let r of e.header) n = n.concat(this.walkTokens(r.tokens, t));
				for (let r of e.rows) for (let e of r) n = n.concat(this.walkTokens(e.tokens, t));
				break;
			}
			case "list": {
				let e = r;
				n = n.concat(this.walkTokens(e.items, t));
				break;
			}
			default: {
				let e = r;
				this.defaults.extensions?.childTokens?.[e.type] ? this.defaults.extensions.childTokens[e.type].forEach((r) => {
					let i = e[r].flat(1 / 0);
					n = n.concat(this.walkTokens(i, t));
				}) : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)));
			}
		}
		return n;
	}
	use(...e) {
		let t = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return e.forEach((e) => {
			let n = { ...e };
			if (n.async = this.defaults.async || n.async || !1, e.extensions && (e.extensions.forEach((e) => {
				if (!e.name) throw Error("extension name required");
				if ("renderer" in e) {
					let n = t.renderers[e.name];
					n ? t.renderers[e.name] = function(...t) {
						let r = e.renderer.apply(this, t);
						return r === !1 && (r = n.apply(this, t)), r;
					} : t.renderers[e.name] = e.renderer;
				}
				if ("tokenizer" in e) {
					if (!e.level || e.level !== "block" && e.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
					let n = t[e.level];
					n ? n.unshift(e.tokenizer) : t[e.level] = [e.tokenizer], e.start && (e.level === "block" ? t.startBlock ? t.startBlock.push(e.start) : t.startBlock = [e.start] : e.level === "inline" && (t.startInline ? t.startInline.push(e.start) : t.startInline = [e.start]));
				}
				"childTokens" in e && e.childTokens && (t.childTokens[e.name] = e.childTokens);
			}), n.extensions = t), e.renderer) {
				let t = this.defaults.renderer || new Xv(this.defaults);
				for (let n in e.renderer) {
					if (!(n in t)) throw Error(`renderer '${n}' does not exist`);
					if (["options", "parser"].includes(n)) continue;
					let r = n, i = e.renderer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n || "";
					};
				}
				n.renderer = t;
			}
			if (e.tokenizer) {
				let t = this.defaults.tokenizer || new Jv(this.defaults);
				for (let n in e.tokenizer) {
					if (!(n in t)) throw Error(`tokenizer '${n}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(n)) continue;
					let r = n, i = e.tokenizer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.tokenizer = t;
			}
			if (e.hooks) {
				let t = this.defaults.hooks || new $v();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					t[r] = $v.passThroughHooks.has(n) ? (e) => {
						if (this.defaults.async && $v.passThroughHooksRespectAsync.has(n)) return (async () => {
							let n = await i.call(t, e);
							return a.call(t, n);
						})();
						let r = i.call(t, e);
						return a.call(t, r);
					} : (...e) => {
						if (this.defaults.async) return (async () => {
							let n = await i.apply(t, e);
							return n === !1 && (n = await a.apply(t, e)), n;
						})();
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.hooks = t;
			}
			if (e.walkTokens) {
				let t = this.defaults.walkTokens, r = e.walkTokens;
				n.walkTokens = function(e) {
					let n = [];
					return n.push(r.call(this, e)), t && (n = n.concat(t.call(this, e))), n;
				};
			}
			this.defaults = {
				...this.defaults,
				...n
			};
		}), this;
	}
	setOptions(e) {
		return this.defaults = {
			...this.defaults,
			...e
		}, this;
	}
	lexer(e, t) {
		return Yv.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return Qv.parse(e, t ?? this.defaults);
	}
	parseMarkdown(e) {
		return (t, n) => {
			let r = { ...n }, i = {
				...this.defaults,
				...r
			}, a = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return a(/* @__PURE__ */ Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof t > "u" || t === null) return a(/* @__PURE__ */ Error("marked(): input parameter is undefined or null"));
			if (typeof t != "string") return a(/* @__PURE__ */ Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer(e) : e ? Yv.lex : Yv.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser(e) : e ? Qv.parse : Qv.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer(e) : e ? Yv.lex : Yv.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser(e) : e ? Qv.parse : Qv.parseInline)(n, i);
				return i.hooks && (r = i.hooks.postprocess(r)), r;
			} catch (e) {
				return a(e);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + Iv(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}();
function ty(e, t) {
	return ey.parse(e, t);
}
ty.options = ty.setOptions = function(e) {
	return ey.setOptions(e), ty.defaults = ey.defaults, m_(ty.defaults), ty;
}, ty.getDefaults = f_, ty.defaults = p_;
function ny(...e) {
	return ey.use(...e), ty.defaults = ey.defaults, m_(ty.defaults), ty;
}
ty.use = ny, ty.walkTokens = function(e, t) {
	return ey.walkTokens(e, t);
}, ty.parseInline = ey.parseInline, ty.Parser = Qv, ty.parser = Qv.parse, ty.Renderer = Xv, ty.TextRenderer = Zv, ty.Lexer = Yv, ty.lexer = Yv.lex, ty.Tokenizer = Jv, ty.Hooks = $v, ty.parse = ty, ty.options, ty.setOptions, ty.walkTokens, ty.parseInline, Qv.parse, Yv.lex;
//#endregion
//#region src/lib/markup.ts
function ry(e) {
	return !!(e && d_.getLanguage(e));
}
function iy(e, t, n) {
	ry(n) ? e.innerHTML = d_.highlight(t, {
		language: n,
		ignoreIllegals: !0
	}).value : e.textContent = t;
}
function ay(e, t) {
	return (n) => {
		iy(n, e, t);
	};
}
var oy = [
	"p",
	"br",
	"strong",
	"em",
	"del",
	"code",
	"pre",
	"ul",
	"ol",
	"li",
	"blockquote",
	"hr",
	"a",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"table",
	"thead",
	"tbody",
	"tr",
	"th",
	"td"
], sy = [
	"href",
	"title",
	"class",
	"align",
	"start"
], cy = /^language-[\w+-]+$/, ly = /^(?:https?|mailto):/i, uy = !1;
function dy() {
	return Dg.isSupported ? uy ? !0 : (Dg.addHook("uponSanitizeElement", (e) => {
		e instanceof HTMLInputElement && e.getAttribute("type") === "checkbox" && e.replaceWith(document.createTextNode(e.hasAttribute("checked") ? "☑" : "☐"));
	}), Dg.addHook("afterSanitizeAttributes", (e) => {
		let t = e.getAttribute("class");
		t !== null && !(e.tagName === "CODE" && cy.test(t)) && e.removeAttribute("class"), e.tagName === "A" && (e.setAttribute("target", "_blank"), e.setAttribute("rel", "noopener noreferrer"));
	}), uy = !0, !0) : !1;
}
function fy() {
	return dy();
}
function py(e, t) {
	if (!dy()) return null;
	let n = document.createElement("div");
	n.innerHTML = Dg.sanitize(ty.parse(e, {
		gfm: !0,
		breaks: t,
		async: !1
	}), {
		ALLOWED_TAGS: oy,
		ALLOWED_ATTR: sy,
		ALLOWED_URI_REGEXP: ly
	});
	for (let e of n.querySelectorAll("pre > code")) {
		let t = e.className.match(/\blanguage-([\w+-]+)/)?.[1], n = document.createElement("code");
		n.className = "hljs", iy(n, e.textContent ?? "", Sm(t));
		let r = document.createElement("pre");
		r.className = "code", r.append(n), e.parentElement?.replaceWith(r);
	}
	return [...n.childNodes];
}
function my(e, t = !1) {
	return (n) => {
		n.replaceChildren(...py(e, t) ?? []);
	};
}
//#endregion
//#region src/components/Code.svelte
var hy = /* @__PURE__ */ U([["code", { class: "hljs" }]]), gy = /* @__PURE__ */ U([[
	"pre",
	{ class: "code" },
	,
]]);
function _y(e, t) {
	j(t, !0);
	let n = (e) => {
		var n = hy();
		li(n, () => ay(t.code, r())), G(e, n);
	}, r = Ki(t, "language", 3, null), i = Ki(t, "inline", 3, !1);
	var a = W(), o = R(a), s = (e) => {
		n(e);
	}, c = (e) => {
		var t = gy(), r = L(t);
		n(r), A(t), G(e, t);
	};
	q(o, (e) => {
		i() ? e(s) : e(c, -1);
	}), G(e, a), M();
}
//#endregion
//#region src/components/Markdown.svelte
var vy = /* @__PURE__ */ U([["div", { class: "chat-markdown" }]]), yy = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-markdown chat-text" },
	" "
]]);
function by(e, t) {
	j(t, !0);
	let n = Ki(t, "breaks", 3, !1);
	var r = W(), i = R(r), a = (e) => {
		var r = vy();
		li(r, () => my(t.text, n())), G(e, r);
	}, o = /* @__PURE__ */ N(() => fy()), s = (e) => {
		var n = yy(), r = z(n, !0);
		V(() => K(r, t.text)), G(e, n);
	};
	q(i, (e) => {
		H(o) ? e(a) : e(s, -1);
	}), G(e, r), M();
}
//#endregion
//#region src/components/ChatMessage.svelte
var xy = /* @__PURE__ */ U([
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	]
], 1), Sy = /* @__PURE__ */ U([
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	]
], 1), Cy = /* @__PURE__ */ U([[
	"details",
	{ class: "chat-entry chat-thinking" },
	[
		"summary",
		null,
		[
			"span",
			{ class: "chat-head" },
			,
		]
	],
	" ",
	[
		"div",
		{ class: "chat-text" },
		" "
	]
]]), wy = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-command" },
	[
		"code",
		null,
		" "
	]
]]), Ty = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-text" },
	" "
]]), Ey = /* @__PURE__ */ U([[
	"div",
	null,
	[
		"div",
		{ class: "chat-head" },
		,
	],
	" ",
	,
]]);
function Dy(e, t) {
	j(t, !0);
	let n = (e) => {
		var n = W(), r = R(n), a = (e) => {
			var n = xy(), r = R(n), a = z(r, !0), o = B(r, 2), s = z(o, !0), c = z(B(o, 2), !0);
			V((e, t) => {
				K(a, e), K(s, H(i)), K(c, t);
			}, [() => fm(t.entry.kind), () => Ra(t.entry.timestamp)]), G(e, n);
		}, o = (e) => {
			var n = Sy(), r = R(n), i = z(r, !0), a = z(B(r, 2), !0);
			V((e, t) => {
				K(i, e), K(a, t);
			}, [() => fm(t.entry.kind), () => Ra(t.entry.timestamp)]), G(e, n);
		};
		q(r, (e) => {
			H(i) ? e(a) : e(o, -1);
		}), G(e, n);
	}, r = /* @__PURE__ */ N(() => t.entry.text ?? ""), i = /* @__PURE__ */ N(() => pm(t.entry)), a = /* @__PURE__ */ N(() => t.entry.kind === "prompt" ? _m(H(r)) : null);
	var o = W(), s = R(o), c = (e) => {
		var t = Cy(), i = L(t), a = L(i), o = L(a);
		n(o), A(a), A(i);
		var s = z(B(i, 2), !0);
		A(t), V(() => K(s, H(r))), G(e, t);
	}, l = (e) => {
		var i = Ey(), o = L(i), s = L(o);
		n(s), A(o);
		var c = B(o, 2), l = (e) => {
			var t = wy(), n = z(L(t), !0);
			A(t), V(() => K(n, H(a).text)), G(e, t);
		}, u = (e) => {
			_y(e, {
				get code() {
					return H(a).code;
				},
				language: "json"
			});
		}, d = (e) => {
			by(e, {
				get text() {
					return H(a).text;
				},
				breaks: !0
			});
		}, f = (e) => {
			by(e, { get text() {
				return H(r);
			} });
		}, p = (e) => {
			var t = Ty(), n = z(t, !0);
			V(() => K(n, H(r))), G(e, t);
		};
		q(c, (e) => {
			H(a)?.kind === "command" ? e(l) : H(a)?.kind === "json" ? e(u, 1) : H(a) ? e(d, 2) : t.entry.kind === "text" ? e(f, 3) : e(p, -1);
		}), A(i), V(() => vi(i, 1, `chat-entry ${t.entry.kind === "prompt" ? "chat-user" : "chat-assistant"}`)), G(e, i);
	};
	q(s, (e) => {
		t.entry.kind === "thinking" ? e(c) : e(l, -1);
	}), G(e, o), M();
}
//#endregion
//#region src/components/ChatToolCall.svelte
var Oy = (e, t = w) => {
	var n = W(), r = R(n), i = (e) => {
		var n = jy();
		J(n, 20, t, (e) => e, (e, t, n, r) => {
			var i = Ay(), a = R(i), o = z(a, !0), s = B(a, 2), c = L(s), l = (e) => {
				_y(e, {
					get code() {
						return t.value;
					},
					language: "json",
					get inline() {
						return t.inline;
					}
				});
			}, u = (e) => {
				var n = ky(), r = z(n, !0);
				V(() => K(r, t.value)), G(e, n);
			}, d = (e) => {
				var n = Rr();
				V(() => K(n, t.value)), G(e, n);
			};
			q(c, (e) => {
				t.shape === "json" ? e(l) : t.shape === "block" ? e(u, 1) : e(d, -1);
			}), A(s), V(() => K(o, t.label)), G(e, i);
		}), A(n), G(e, n);
	};
	q(r, (e) => {
		t().length > 0 && e(i);
	}), G(e, n);
}, ky = /* @__PURE__ */ U([[
	"pre",
	{ class: "code" },
	" "
]]), Ay = /* @__PURE__ */ U([
	[
		"dt",
		null,
		" "
	],
	" ",
	[
		"dd",
		null,
		,
	]
], 1), jy = /* @__PURE__ */ U([["dl", { class: "tool-fields" }]]), My = /* @__PURE__ */ U([[
	"div",
	{ class: "tool-description" },
	" "
]]), Ny = /* @__PURE__ */ U([
	,
	,
	" ",
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), Py = /* @__PURE__ */ U([
	[
		"div",
		{ class: "tool-description" },
		" "
	],
	" ",
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), Fy = /* @__PURE__ */ U([
	[
		"div",
		{ class: "tool-description" },
		" "
	],
	" ",
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), Iy = /* @__PURE__ */ U([[
	"div",
	{ class: "label" },
	" "
]]), Ly = /* @__PURE__ */ U([[
	"pre",
	{ class: "code" },
	" "
]]), Ry = /* @__PURE__ */ U([
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), zy = /* @__PURE__ */ U([[
	"details",
	{ class: "chat-tool" },
	[
		"summary",
		null,
		[
			"strong",
			null,
			" "
		],
		" ",
		[
			"span",
			{ class: "muted" },
			" "
		]
	],
	" ",
	[
		"div",
		null,
		,
		" ",
		,
	],
	" ",
	,
]]);
function By(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => `${wm(t.entry) ? ` ${wm(t.entry)}` : ""}${Tm(t.entry)}`), r = /* @__PURE__ */ N(() => Om(t.entry)), i = /* @__PURE__ */ N(() => t.entry.result === null ? null : km(t.entry));
	var a = zy(), o = L(a), s = L(o), c = z(s, !0), l = B(s), u = z(B(l), !0);
	A(o);
	var d = B(o, 2), f = L(d), p = (e) => {
		var t = Ny(), n = R(t), i = (e) => {
			var t = My(), n = z(t, !0);
			V(() => K(n, H(r).description)), G(e, t);
		};
		q(n, (e) => {
			H(r).description && e(i);
		});
		var a = B(n, 2), o = z(a, !0);
		_y(B(a, 2), {
			get code() {
				return H(r).command;
			},
			language: "bash"
		}), V(() => K(o, H(r).label)), G(e, t);
	}, m = (e) => {
		var t = Py(), n = R(t), i = z(n, !0), a = B(n, 2), o = z(a, !0);
		_y(B(a, 2), {
			get code() {
				return H(r).diff;
			},
			language: "diff"
		}), V(() => {
			K(i, H(r).path), K(o, H(r).label);
		}), G(e, t);
	}, h = (e) => {
		var t = Fy(), n = R(t), i = z(n, !0), a = B(n, 2), o = z(a, !0);
		_y(B(a, 2), {
			get code() {
				return H(r).content;
			},
			get language() {
				return H(r).language;
			}
		}), V(() => {
			K(i, H(r).path), K(o, H(r).label);
		}), G(e, t);
	}, g = (e) => {
		var t = Iy(), n = z(t, !0);
		V(() => K(n, H(r).label)), G(e, t);
	};
	q(f, (e) => {
		H(r).kind === "bash" ? e(p) : H(r).kind === "edit" ? e(m, 1) : H(r).kind === "write" ? e(h, 2) : e(g, -1);
	}), Oy(B(f, 2), () => H(r).rest), A(d);
	var _ = B(d, 2), v = (e) => {
		var n = Ry(), r = R(n), a = z(r, !0), o = B(r, 2), s = (e) => {
			_y(e, {
				get code() {
					return H(i).code;
				},
				get language() {
					return H(i).language;
				}
			});
		}, c = (e) => {
			var t = Ly(), n = z(t, !0);
			V(() => K(n, H(i).text)), G(e, t);
		};
		q(o, (e) => {
			H(i).kind === "code" ? e(s) : e(c, -1);
		}), V((e) => K(a, e), [() => Am(t.entry)]), G(e, n);
	};
	q(_, (e) => {
		H(i) && e(v);
	}), A(a), V((e) => {
		K(c, t.entry.tool), K(l, `${H(n) ?? ""} `), K(u, e);
	}, [() => Ra(t.entry.timestamp)]), G(e, a), M();
}
//#endregion
//#region src/components/ChatUsage.svelte
var Vy = /* @__PURE__ */ U([" ", [
	"span",
	{ role: "note" },
	" "
]], 1), Hy = /* @__PURE__ */ U([" ", [
	"span",
	{
		class: "rebuild-chip",
		role: "note"
	},
	" "
]], 1), Uy = /* @__PURE__ */ U([[
	"div",
	{ role: "note" },
	[
		"strong",
		null,
		" "
	],
	" "
]]), Wy = /* @__PURE__ */ U([
	[
		"div",
		null,
		[
			"strong",
			null,
			" "
		],
		[
			"span",
			null,
			" "
		],
		,
		,
	],
	" ",
	,
], 1);
function Gy(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => t.hint && Hm(t.hint) ? Wm(t.hint) : null), r = /* @__PURE__ */ N(() => t.usage.rebuild ? Gm(t.usage.rebuild) : null), i = /* @__PURE__ */ N(() => Km(t.hint));
	var a = Wy(), o = R(a), s = L(o), c = z(s, !0), l = B(s), u = z(l, !0), d = B(l), f = (e) => {
		var t = Vy(), r = R(t, !0);
		r.nodeValue = " ";
		var i = B(r), a = z(i, !0);
		V(() => {
			vi(i, 1, fi(["compact-chip", H(n).tone])), K(a, H(n).text);
		}), G(e, t);
	};
	q(d, (e) => {
		H(n) && e(f);
	});
	var p = B(d), m = (e) => {
		var t = Hy(), n = R(t, !0);
		n.nodeValue = " ";
		var i = B(n), a = z(i, !0);
		V(() => {
			Y(i, "title", H(r).title), K(a, H(r).text);
		}), G(e, t);
	};
	q(p, (e) => {
		H(r) && e(m);
	}), A(o);
	var h = B(o, 2), g = (e) => {
		var t = Uy(), n = L(t), r = z(n, !0), a = B(n);
		A(t), V(() => {
			vi(t, 1, fi(["compact-hint", H(i).tone])), K(r, H(i).label), K(a, ` ${H(i).text ?? ""}`);
		}), G(e, t);
	};
	q(h, (e) => {
		H(i) && e(g);
	}), V((e, t, n, r) => {
		vi(o, 1, e), Y(o, "title", t), K(c, n), K(u, r);
	}, [
		() => fi(["chat-usage", Um(t.hint)]),
		() => Vm(t.usage) ?? void 0,
		() => Bm(t.usage),
		() => ` · ${zm(t.usage).join(" · ")}`
	]), G(e, a), M();
}
//#endregion
//#region src/components/ConversationEntry.svelte
var Ky = /* @__PURE__ */ U([
	,
	,
	" ",
	,
], 1);
function qy(e, t) {
	j(t, !0);
	var n = Ky(), r = R(n), i = (e) => {
		Qm(e, { get entry() {
			return t.entry;
		} });
	}, a = (e) => {
		Ym(e, { get entry() {
			return t.entry;
		} });
	}, o = (e) => {
		By(e, { get entry() {
			return t.entry;
		} });
	}, s = (e) => {
		Dy(e, { get entry() {
			return t.entry;
		} });
	};
	q(r, (e) => {
		t.entry.kind === "compaction" || t.entry.kind === "error" ? e(i) : t.entry.kind === "injected" ? e(a, 1) : t.entry.kind === "tool" ? e(o, 2) : e(s, -1);
	});
	var c = B(r, 2), l = (e) => {
		Gy(e, {
			get usage() {
				return t.entry.usage;
			},
			get hint() {
				return t.entry.compact_hint;
			}
		});
	};
	q(c, (e) => {
		t.entry.usage && e(l);
	}), G(e, n), M();
}
//#endregion
//#region src/components/Conversation.svelte
var Jy = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), Yy = /* @__PURE__ */ U([["optgroup"]]), Xy = /* @__PURE__ */ U([[
	"option",
	null,
	" "
]]), Zy = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), Qy = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]), $y = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-reminders muted" },
	" "
]]), eb = /* @__PURE__ */ U([[
	"div",
	{ class: "chat-row" },
	,
]]), tb = /* @__PURE__ */ U([
	[
		"button",
		{
			type: "button",
			class: "skip-link"
		},
		"Skip the conversation"
	],
	" ",
	,
	" ",
	["div", { class: "chat" }]
], 1), nb = /* @__PURE__ */ U([
	[
		"section",
		{
			class: "chat-section",
			id: "chat-section",
			"aria-labelledby": "chat-heading"
		},
		[
			"div",
			{ class: "chart-head chat-section-head" },
			[
				"h3",
				{ id: "chat-heading" },
				" "
			],
			" ",
			[
				"span",
				{ class: "muted" },
				"read from the transcript when you ask, never stored"
			],
			" ",
			["span", { class: "spacer" }],
			" ",
			["select", {
				id: "chat-agent",
				"aria-label": "Conversation of"
			}],
			" ",
			[
				"button",
				{
					type: "button",
					id: "chat-order",
					"aria-label": "Oldest first"
				},
				[
					"span",
					{
						class: "chat-order-arrow",
						"aria-hidden": "true"
					},
					"↓"
				]
			],
			" ",
			[
				"button",
				{
					type: "button",
					id: "chat-load"
				},
				" "
			],
			" ",
			[
				"button",
				{
					type: "button",
					id: "chat-close"
				},
				"Close"
			]
		],
		" ",
		[
			"div",
			{ id: "chat" },
			,
		]
	],
	" ",
	["div", {
		id: "chat-end",
		class: "chat-end",
		tabindex: "-1",
		role: "note",
		"aria-label": "End of the conversation"
	}]
], 1);
function rb(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ F(""), r = /* @__PURE__ */ F(!1), i = /* @__PURE__ */ F(null), a = /* @__PURE__ */ F(null), o = /* @__PURE__ */ F(void 0), s = /* @__PURE__ */ F(void 0), c = /* @__PURE__ */ F(void 0), l = 0, u = /* @__PURE__ */ N(() => am(Fo.session?.agents ?? [])), d = /* @__PURE__ */ N(() => H(i) ? sm(H(i)) : null), f = /* @__PURE__ */ N(() => H(i) ? om(H(i).reminders) : null), p = /* @__PURE__ */ new WeakMap(), m = /* @__PURE__ */ N(() => H(i) ? ss(H(i).entries, ws.oldestFirst).map((e) => {
		let t = p.get(e.entry);
		return t?.key === e.key ? t : (p.set(e.entry, e), e);
	}) : []);
	async function h() {
		let e = Fo.session;
		if (!e) return;
		let t = ++l;
		I(i, null), I(a, "Loading…");
		try {
			let r = await um(nm(e.session_id, H(n) || null));
			if (t !== l) return;
			I(i, r), I(a, null);
		} catch (e) {
			t === l && I(a, e instanceof Error ? e.message : String(e), !0);
		}
	}
	function g() {
		I(r, !0), h();
	}
	function _(e) {
		I(n, e.currentTarget.value, !0), H(r) && h();
	}
	function v() {
		l++, I(i, null), I(a, null), I(r, !1), H(o)?.focus();
	}
	async function y() {
		let e = Fo.session;
		if (!H(r) || !H(i) || !e) return;
		let t = ++l, a;
		try {
			a = await um(nm(e.session_id, H(n) || null));
		} catch {
			return;
		}
		if (t !== l || !H(i) || cm(H(i), a)) return;
		let o = H(s) && H(s).getBoundingClientRect().top < 0 ? Rs(H(s).querySelectorAll("[data-key]")) : null;
		I(i, lm(H(i), a)), await xr(), zs(o, o?.node);
	}
	On(() => {
		Fo.session, wr(() => {
			y();
		});
	}), On(() => () => {
		l++;
	});
	var b = nb(), x = R(b), S = L(x), ee = L(S), te = z(ee, !0), C = B(ee, 6);
	J(C, 21, () => H(u), (e) => "group" in e ? `group ${e.group}` : `option ${e.value}`, (e, t) => {
		var n = W(), r = R(n), i = (e) => {
			var n = Yy();
			J(n, 21, () => H(t).options, (e) => e.value, (e, t) => {
				var n = Jy(), r = z(n, !0), i = {};
				V(() => {
					K(r, H(t).label), i !== (i = H(t).value) && (n.value = (n.__value = i) ?? "");
				}), G(e, n);
			}), A(n), V(() => Y(n, "label", H(t).group)), G(e, n);
		}, a = (e) => {
			var n = Xy(), r = z(n, !0), i = {};
			V(() => {
				K(r, H(t).label), i !== (i = H(t).value) && (n.value = (n.__value = i) ?? "");
			}), G(e, n);
		};
		q(r, (e) => {
			"group" in H(t) ? e(i) : e(a, -1);
		}), G(e, n);
	}), A(C), wi(C);
	var w = B(C, 2), ne = B(w, 2), re = z(ne, !0);
	Ui(ne, (e) => I(o, e), () => H(o));
	var ie = B(ne, 2);
	A(S);
	var T = B(S, 2), ae = L(T), E = (e) => {
		var t = Zy(), n = z(t, !0);
		V(() => K(n, H(a))), G(e, t);
	}, oe = (e) => {
		var t = Qy(), n = z(t, !0);
		V(() => K(n, H(d))), G(e, t);
	}, D = (e) => {
		var t = tb(), n = R(t), r = B(n, 2), i = (e) => {
			var t = $y(), n = z(t, !0);
			V(() => K(n, H(f))), G(e, t);
		};
		q(r, (e) => {
			H(f) !== null && e(i);
		});
		var a = B(r, 2);
		J(a, 21, () => H(m), (e) => e.key, (e, t) => {
			var n = eb();
			qy(L(n), { get entry() {
				return H(t).entry;
			} }), A(n), V(() => Y(n, "data-key", H(t).key)), G(e, n);
		}), A(a), Ar("click", n, () => H(c)?.focus()), G(e, t);
	};
	q(ae, (e) => {
		H(a) === null ? H(d) === null ? H(i) && e(D, 2) : e(oe, 1) : e(E);
	}), A(T), Ui(T, (e) => I(s, e), () => H(s)), A(x), Ui(B(x, 2), (e) => I(c, e), () => H(c)), V((e, t) => {
		K(te, e), Y(w, "aria-pressed", ws.oldestFirst), Y(w, "title", t), K(re, H(i) ? "Reload" : "Show conversation"), Y(ie, "hidden", !H(r));
	}, [() => Ts("Conversation"), () => rm(ws.oldestFirst)]), Ar("change", C, _), Ti(C, () => H(n), (e) => I(n, e)), Ar("click", w, () => ws.oldestFirst = !ws.oldestFirst), Ar("click", ne, g), Ar("click", ie, v), G(e, b), M();
}
jr(["change", "click"]);
//#endregion
//#region src/components/InputSplit.svelte
var ib = /* @__PURE__ */ U([["span"]]), ab = /* @__PURE__ */ U([[
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
]]), ob = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), sb = /* @__PURE__ */ U([[
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
function cb(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => Va(t.totals)), r = /* @__PURE__ */ N(() => Gd(t.totals)), i = /* @__PURE__ */ N(() => qd(t.context, t.hintTokens));
	var a = sb(), o = L(a), s = z(o, !0), c = B(o, 2), l = z(c, !0), u = B(c, 2);
	J(u, 21, () => H(r).filter((e) => e.tokens > 0), (e) => e.label, (e, t) => {
		var n = ib();
		let r;
		V(() => r = bi(n, "", r, {
			"flex-grow": H(t).tokens,
			background: H(t).color
		})), G(e, n);
	}), A(u);
	var d = B(u, 2);
	J(d, 17, () => H(r), (e) => e.label, (e, t) => {
		var r = ab(), i = L(r);
		Is(i, { get fill() {
			return H(t).color;
		} });
		var a = B(i, 2), o = z(a, !0), s = B(a, 2), c = z(s, !0), l = B(s, 2), u = z(l, !0), d = z(B(l, 2), !0);
		A(r), V((e, n, i, a) => {
			Y(r, "title", H(t).note), K(o, e), K(c, n), K(u, i), K(d, a);
		}, [
			() => Ts(H(t).label),
			() => X(H(t).tokens),
			() => ka(H(t).tokens, H(n)),
			() => Q(H(t).cost)
		]), G(e, r);
	});
	var f = B(d, 2), p = (e) => {
		var t = ob();
		Y(t, "title", "The context a main-thread turn reads: new input, cache writes and reads. The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens).");
		var n = z(t, !0);
		V(() => K(n, H(i))), G(e, t);
	};
	q(f, (e) => {
		H(i) !== null && e(p);
	}), A(a), V((e, t, n) => {
		K(s, e), K(l, t), Y(u, "aria-label", n);
	}, [
		() => Ts("Input tokens"),
		() => X(H(n)),
		() => Kd(H(r), t.totals)
	]), G(e, a), M();
}
//#endregion
//#region src/components/KpiTiles.svelte
var lb = /* @__PURE__ */ U([
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
], 1), ub = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	,
]]), db = /* @__PURE__ */ U([
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
function fb(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => t.savings ? Wd(t.savings) : null);
	var r = db(), i = R(r), a = L(i), o = L(a), s = z(o, !0), c = B(o);
	A(a);
	var l = B(a, 2), u = z(l, !0), d = B(l, 2), f = z(d, !0), p = B(d, 2), m = (e) => {
		var t = ub(), r = L(t), i = (e) => {
			var t = lb(), r = R(t), i = z(r, !0), a = z(B(r, 2), !0);
			V(() => {
				vi(r, 1, fi(H(n).verdict === "gain" ? "verdict-gain" : "verdict-loss")), K(i, H(n).amount), K(a, H(n).count);
			}), G(e, t);
		}, a = (e) => {
			var t = Rr();
			V(() => K(t, H(n).count)), G(e, t);
		};
		q(r, (e) => {
			H(n).verdict ? e(i) : e(a, -1);
		}), A(t), V(() => Y(t, "title", H(n).title)), G(e, t);
	};
	q(p, (e) => {
		H(n) && e(m);
	}), A(i);
	var h = B(i, 2);
	cb(h, {
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
	var g = B(h, 2);
	{
		let e = /* @__PURE__ */ N(() => Z(t.totals.turns));
		Mp(g, {
			label: "Turns",
			get value() {
				return H(e);
			},
			note: "API calls with usage",
			themedNote: !0
		});
	}
	var _ = B(g, 2);
	{
		let e = /* @__PURE__ */ N(() => X(t.totals.output)), n = /* @__PURE__ */ N(() => Q(t.totals.cost_parts.output));
		Mp(_, {
			label: "Output tokens",
			get value() {
				return H(e);
			},
			get note() {
				return H(n);
			}
		});
	}
	V((e, n, r) => {
		K(s, e), K(c, `, ${t.scope ?? ""}`), K(u, n), K(f, r);
	}, [
		() => Ts("Estimated cost"),
		() => Q(t.totals.cost),
		() => Hd(t.totals)
	]), G(e, r), M();
}
//#endregion
//#region src/components/RuntimeTiles.svelte
var pb = /* @__PURE__ */ U([
	,
	,
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function mb(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => "source" in t.runtime && t.runtime.source === "transcripts"), r = /* @__PURE__ */ N(() => Jd(t.runtime, t.from, t.costPer100Lines, H(n)));
	var i = pb(), a = R(i);
	{
		let e = /* @__PURE__ */ N(() => Aa(t.runtime.duration_ms));
		Mp(a, {
			label: "Session time",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).session;
			}
		});
	}
	var o = B(a, 2);
	{
		let e = /* @__PURE__ */ N(() => Aa(t.runtime.api_ms));
		Mp(o, {
			label: "Waiting on the API",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).api;
			}
		});
	}
	var s = B(o, 2);
	{
		let e = /* @__PURE__ */ N(() => Aa(t.runtime.tool_ms));
		Mp(s, {
			label: "Running tools",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).tools;
			}
		});
	}
	var c = B(s, 2);
	{
		let e = /* @__PURE__ */ N(() => `+${Z(t.runtime.lines_added)} / −${Z(t.runtime.lines_removed)}`);
		Mp(c, {
			label: "Lines changed",
			get value() {
				return H(e);
			},
			get note() {
				return H(r).lines;
			}
		});
	}
	G(e, i), M();
}
//#endregion
//#region src/lib/secrets.ts
function hb(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function gb(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var _b = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function vb(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(_b, e.reach) ? _b[e.reach] ?? "" : "no result yet";
}
var yb = [
	{ label: "Time" },
	{ label: "Agent" },
	{ label: "Tool" },
	{ label: "Path" },
	{
		label: "Matched",
		title: "the [secrets] pattern it matched"
	},
	{ label: "Reached" }
];
function bb(e) {
	let t = /* @__PURE__ */ new Map();
	return e.map((e) => {
		let n = [
			e.time,
			e.agent_id,
			e.tool,
			e.path,
			e.pattern
		].join("\0"), r = t.get(n) ?? 0;
		return t.set(n, r + 1), {
			key: r ? `${n}\u0000${r}` : n,
			time: Ra(e.time),
			agent: e.agent_type,
			tool: e.tool,
			path: e.path,
			via: gb(e),
			pattern: e.pattern,
			severity: e.severity || "medium",
			reach: vb(e)
		};
	});
}
function xb(e) {
	return e.length === 1 ? "1 call" : `${Z(e.length)} calls`;
}
function Sb(e, t) {
	return e.filter((e) => e.severity === t).length;
}
function Cb(e) {
	return `Possible secret access: ${xb(e)} (${Z(Sb(e, "high"))} sent out)`;
}
function wb(e, t) {
	let n = `${xb(e)} named a possible secret location`;
	if (t === "warning") return `${n}, ${Z(Sb(e, "medium"))} of them returned a result or may still`;
	let r = Sb(e, "low-medium");
	return r ? `${n}, ${Z(r)} returned a result only in a likely test` : `${n}, none reached anything`;
}
//#endregion
//#region src/components/SecretAccesses.svelte
var Tb = (e, t = w) => {
	var n = Ob(), r = R(n), i = z(r, !0), a = B(r, 2), o = z(a, !0), s = B(a, 2), c = z(s, !0), l = B(s, 2), u = L(l), d = z(u, !0), f = B(u), p = (e) => {
		var n = Db(), r = z(n, !0);
		V(() => K(r, t().via)), G(e, n);
	};
	q(f, (e) => {
		t().via && e(p);
	}), A(l);
	var m = B(l, 2), h = z(m, !0), g = B(m, 2), _ = L(g), v = B(_, 1, !0);
	A(g), V(() => {
		K(i, t().time), K(o, t().agent), K(c, t().tool), K(d, t().path), K(h, t().pattern), vi(_, 1, `secret-severity secret-severity-${t().severity ?? ""}`), K(v, t().reach);
	}), G(e, n);
}, Eb = /* @__PURE__ */ U([[
	"div",
	null,
	[
		"p",
		null,
		"These tool calls named a path that matches a possible secret location. Most severe first: sent to an MCP server or\n      a network program, then returned into the conversation (and so to the API), then blocked, failed or empty. Check\n      that each was meant."
	],
	" ",
	,
	" ",
	[
		"p",
		{ class: "muted" },
		"Matched against [secrets] patterns in the config: file tools by their path, commands by their words with the\n      variables they set (quoted text only where it holds a path), and scripts this transcript wrote and then ran by\n      their text. Variables from earlier calls and other scripts are unknown. A result counts whatever it held: a test\n      that only mentions a path returns output too."
	]
]]), Db = /* @__PURE__ */ U([[
	"span",
	{ class: "secret-via" },
	" "
]]), Ob = /* @__PURE__ */ U([
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
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		[
			"span",
			{ class: "secret-path" },
			" "
		],
		,
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
		["span", { "aria-hidden": "true" }],
		" "
	]
], 1), kb = /* @__PURE__ */ U([[
	"div",
	{
		id: "secret-alert",
		class: "card secret-alert",
		role: "region",
		"aria-labelledby": "secret-alert-title"
	},
	[
		"h3",
		{
			class: "secret-alert-head",
			id: "secret-alert-title"
		},
		[
			"span",
			{
				class: "secret-alert-icon",
				"aria-hidden": "true"
			},
			"!"
		],
		" "
	],
	" ",
	,
]]), Ab = /* @__PURE__ */ U([[
	"div",
	{
		id: "secret-alert",
		role: "region",
		"aria-labelledby": "secret-alert-title"
	},
	[
		"div",
		{ class: "secret-folded-line" },
		[
			"h3",
			{
				class: "secret-folded-head",
				id: "secret-alert-title"
			},
			" "
		],
		" ",
		[
			"button",
			{
				type: "button",
				class: "link-button"
			},
			" "
		]
	],
	" ",
	,
]]);
function jb(e, t) {
	j(t, !0);
	let n = (e, t = w, n = w) => {
		var r = Eb(), i = B(L(r), 2);
		{
			let e = /* @__PURE__ */ N(() => `${t()}-secrets`);
			nc(i, {
				get key() {
					return H(e);
				},
				get columns() {
					return yb;
				},
				get rows() {
					return H(s);
				},
				rowKey: (e) => e.key,
				get cells() {
					return Tb;
				},
				labelledby: "secret-alert-title"
			});
		}
		Pe(2), A(r), V(() => Y(r, "hidden", n())), G(e, r);
	}, r = /* @__PURE__ */ N(() => Fo.session), i = /* @__PURE__ */ N(() => H(r)?.secret_accesses ?? []), a = /* @__PURE__ */ N(() => H(r) ? hb(H(r)) : null), o = /* @__PURE__ */ N(() => H(a) === "warning" || H(a) === "quiet" ? H(a) : null), s = /* @__PURE__ */ N(() => bb(H(i))), c = /* @__PURE__ */ F(!1);
	var l = W(), u = R(l), d = (e) => {
		var t = kb(), a = L(t), o = B(L(a), 1, !0);
		A(a);
		var s = B(a, 2);
		n(s, () => H(r).session_id, () => !1), A(t), V((e) => K(o, e), [() => Cb(H(i))]), G(e, t);
	}, f = (e) => {
		var t = Ab(), a = L(t), s = L(a), l = z(s, !0), u = B(s, 2), d = z(u, !0);
		A(a);
		var f = B(a, 2);
		n(f, () => H(r).session_id, () => !H(c)), A(t), V((e) => {
			vi(t, 1, fi([
				"card",
				"secret-folded",
				H(o) === "warning" && "secret-warning"
			])), K(l, e), Y(u, "aria-expanded", H(c)), K(d, H(c) ? "Hide them" : "Show them");
		}, [() => wb(H(i), H(o))]), Ar("click", u, () => I(c, !H(c))), G(e, t);
	};
	q(u, (e) => {
		H(r) && H(a) === "alert" ? e(d) : H(r) && H(o) && e(f, 1);
	}), G(e, l), M();
}
jr(["click"]);
//#endregion
//#region src/components/SessionWaits.svelte
var Mb = /* @__PURE__ */ U([[
	"strong",
	null,
	" "
]]), Nb = /* @__PURE__ */ U([[
	"span",
	null,
	[
		"a",
		null,
		" "
	],
	" "
]]), Pb = /* @__PURE__ */ U([[
	"p",
	{ class: "wait-line" },
	[
		"span",
		{ class: "wait-icon" },
		,
	],
	" ",
	,
]]), Fb = /* @__PURE__ */ U([["div", {
	class: "card wait-notice",
	role: "status"
}]]);
function Ib(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => Fo.session), r = /* @__PURE__ */ N(() => H(n) ? xl(H(n), Fo.live?.sessions ?? []) : []);
	var i = Fb();
	J(i, 21, () => H(r), (e) => e.session_id, (e, t) => {
		var n = Pb(), r = L(n);
		Ol(L(r), { get badge() {
			return H(t);
		} }), A(r);
		var i = B(r, 2), a = (e) => {
			var n = Mb(), r = z(n);
			V((e, t) => K(r, `This session is ${e ?? ""}${t ?? ""}`), [() => H(t).text.charAt(0).toLowerCase(), () => H(t).text.slice(1)]), G(e, n);
		}, o = (e) => {
			var n = Nb(), r = L(n), i = z(r, !0), a = B(r);
			A(n), V((e) => {
				Y(r, "href", e), K(i, H(t).title), K(a, `: ${H(t).text ?? ""}`);
			}, [() => jc(H(t))]), G(e, n);
		};
		q(i, (e) => {
			H(t).title === null ? e(a) : e(o, -1);
		}), A(n), G(e, n);
	}), A(i), V(() => Y(i, "hidden", H(r).length === 0)), G(e, i), M();
}
//#endregion
//#region src/components/ToolsTable.svelte
var Lb = (e) => {
	G(e, Rb());
}, Rb = /* @__PURE__ */ U([[
	"h3",
	{ id: "session-tools-title" },
	"Tools"
]]), zb = /* @__PURE__ */ U([[
	"div",
	{ class: "note" },
	" "
]]), Bb = /* @__PURE__ */ U([[
	"button",
	{
		type: "button",
		class: "link-button"
	},
	" "
], ")"], 1), Vb = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), Hb = /* @__PURE__ */ U([
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		[
			"span",
			null,
			" ",
			,
		]
	],
	" ",
	,
], 1);
function Ub(e, t) {
	j(t, !0);
	let n = (e) => {
		var t = zb(), n = z(t, !0);
		V(() => K(n, H(s))), G(e, t);
	}, r = (e, t = w) => {
		var n = Hb(), r = R(n), i = z(r, !0), a = B(r, 2), o = L(a), s = L(o, !0), l = B(s), u = (e) => {
			let n = /* @__PURE__ */ N(() => t().fold);
			var r = Bb(), i = R(r), a = z(i, !0);
			Pe(), V(() => {
				Y(i, "aria-expanded", H(n).open), K(a, H(n).label);
			}), Ar("click", i, () => c(H(n).fold)), G(e, r);
		};
		q(l, (e) => {
			t().fold && e(u);
		}), A(o), A(a), J(B(a, 2), 17, () => t().cells, ei, (e, t) => {
			var n = Vb(), r = z(n, !0);
			V(() => K(r, H(t))), G(e, n);
		}), V(() => {
			K(i, t().agent), vi(o, 1, fi(t().name.className)), K(s, t().fold ? `${t().name.text} (` : t().name.text);
		}), G(e, n);
	}, i = /* @__PURE__ */ F(tn([])), a = Rd(), o = /* @__PURE__ */ N(() => Bd(t.agents, H(i))), s = /* @__PURE__ */ N(() => zd(t.agents));
	function c(e) {
		I(i, H(i).includes(e) ? H(i).filter((t) => t !== e) : [...H(i), e], !0);
	}
	{
		let i = /* @__PURE__ */ N(() => H(s) === null ? void 0 : n);
		nc(e, {
			get key() {
				return t.pagerKey;
			},
			get columns() {
				return a;
			},
			get rows() {
				return H(o);
			},
			rowKey: (e) => e.key,
			get cells() {
				return r;
			},
			sub: (e) => e.sub,
			group: (e) => e.group,
			get heading() {
				return Lb;
			},
			get intro() {
				return H(i);
			},
			empty: "No tool calls.",
			labelledby: "session-tools-title"
		});
	}
	M();
}
jr(["click"]);
//#endregion
//#region src/components/UsageTable.svelte
var Wb = /* @__PURE__ */ U([[
	"h3",
	null,
	" "
]]), Gb = /* @__PURE__ */ U([[
	"h2",
	null,
	" "
]]), Kb = /* @__PURE__ */ U([[
	"p",
	{ class: "note" },
	" "
]]), qb = /* @__PURE__ */ U([[
	"span",
	null,
	,
	" "
]]), Jb = /* @__PURE__ */ U([[
	"span",
	{ class: "effort" },
	" "
]]), Yb = /* @__PURE__ */ U([[
	"td",
	{ class: "num" },
	" "
]]), Xb = /* @__PURE__ */ U([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1), Zb = /* @__PURE__ */ U([[
	"section",
	{ class: "card" },
	,
]]);
function Qb(e, t) {
	j(t, !0);
	let n = (e) => {
		var n = W(), o = R(n), c = (e) => {
			{
				let n = /* @__PURE__ */ N(() => Qd(t.nameLabel)), o = /* @__PURE__ */ N(() => t.note === void 0 ? void 0 : i);
				nc(e, {
					get key() {
						return s();
					},
					get columns() {
						return H(n);
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
			r(e);
		};
		q(o, (e) => {
			t.rows ? e(c) : e(l, -1);
		}), G(e, n);
	}, r = (e) => {
		var n = W(), r = R(n), i = (e) => {
			var n = Wb(), r = z(n, !0);
			V(() => {
				Y(n, "id", `${t.id ?? ""}-title`), K(r, t.title);
			}), G(e, n);
		}, a = (e) => {
			var n = Gb(), r = z(n, !0);
			V(() => {
				Y(n, "id", `${t.id ?? ""}-title`), K(r, t.title);
			}), G(e, n);
		};
		q(r, (e) => {
			o() ? e(i) : e(a, -1);
		}), G(e, n);
	}, i = (e) => {
		var n = Kb(), r = z(n, !0);
		V(() => K(r, t.note)), G(e, n);
	}, a = (e, t = w) => {
		var n = Xb(), r = R(n), i = L(r), a = (e) => {
			var n = qb(), r = L(n);
			Is(r, { get fill() {
				return t().swatch;
			} });
			var i = B(r, 1, !0);
			A(n), V(() => K(i, t().name)), G(e, n);
		}, o = (e) => {
			var n = Jb(), r = z(n, !0);
			V(() => K(r, t().name)), G(e, n);
		}, s = (e) => {
			var n = Rr();
			V(() => K(n, t().name)), G(e, n);
		};
		q(i, (e) => {
			t().kind === "model" ? e(a) : t().kind === "effort" ? e(o, 1) : e(s, -1);
		}), A(r), J(B(r, 2), 19, () => H(c), (e) => e.label, (e, n, r) => {
			var i = Yb(), a = z(i, !0);
			V(() => K(a, t().cells[H(r)])), G(e, i);
		}), G(e, n);
	}, o = Ki(t, "inline", 3, !1), s = Ki(t, "pagerKey", 19, () => t.id), c = /* @__PURE__ */ N(() => Qd(t.nameLabel).slice(1));
	var l = W(), u = R(l), d = (e) => {
		n(e);
	}, f = (e) => {
		var r = Zb(), i = L(r);
		n(i), A(r), V(() => Y(r, "aria-labelledby", `${t.id ?? ""}-title`)), G(e, r);
	};
	q(u, (e) => {
		o() ? e(d) : e(f, -1);
	}), G(e, l), M();
}
//#endregion
//#region src/components/SessionView.svelte
var $b = /* @__PURE__ */ U([[
	"div",
	{ class: "prompt" },
	" "
]]), ex = /* @__PURE__ */ U([[
	"div",
	{
		class: "kpis session-kpis",
		role: "group",
		"aria-label": "Time and lines changed"
	},
	,
]]), tx = /* @__PURE__ */ U([[
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
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
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
	,
	" ",
	,
]]);
function nx(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => Fo.session), r = /* @__PURE__ */ N(() => H(n) ? ef(H(n).models, H(n).model_effort, aa(H(n).models.map((e) => e.model))) : []), i = /* @__PURE__ */ N(() => H(n) ? $d(H(n).skills, (e) => e.skill) : []), a = /* @__PURE__ */ N(() => H(n) ? $d(H(n).mcp_servers, (e) => e.mcp_server) : []), o = /* @__PURE__ */ N(() => H(n) ? Wu(H(n).api_errors) : []);
	function s(e) {
		H(n) && e.key === "Escape" && !e.defaultPrevented && (location.hash = "");
	}
	var c = W();
	kr("keydown", on, s);
	var l = R(c), u = (e) => {
		let t = /* @__PURE__ */ N(() => H(n).session_id), s = /* @__PURE__ */ N(() => H(n).runtime);
		var c = W();
		$r(R(c), () => H(t), (e) => {
			var c = tx(), l = L(c), u = z(L(l), !0);
			Pe(4), A(l);
			var d = B(l, 2), f = (e) => {
				var t = $b(), r = z(t, !0);
				V(() => K(r, H(n).prompt)), G(e, t);
			};
			q(d, (e) => {
				H(n).prompt && e(f);
			});
			var p = B(d, 2), m = z(p, !0), h = B(p, 2);
			Ib(h, {});
			var g = B(h, 2);
			fb(L(g), {
				get totals() {
					return H(n);
				},
				scope: "this session",
				get context() {
					return H(n).context;
				},
				get hintTokens() {
					return H(n).compact_hint_tokens;
				},
				get savings() {
					return H(n).compaction_savings;
				}
			}), A(g);
			var _ = B(g, 2), v = (e) => {
				var t = ex(), r = L(t);
				{
					let e = /* @__PURE__ */ N(() => Xd(H(s).source)), t = /* @__PURE__ */ N(() => Zd({
						cost: H(n).cost,
						runtime: H(s)
					}));
					mb(r, {
						get runtime() {
							return H(s);
						},
						get from() {
							return H(e);
						},
						get costPer100Lines() {
							return H(t);
						}
					});
				}
				A(t), G(e, t);
			};
			q(_, (e) => {
				H(s) && e(v);
			});
			var y = B(_, 2);
			jb(y, {});
			var b = B(y, 2);
			Ff(b, {});
			var x = B(b, 2);
			tm(x, {});
			var S = B(x, 2);
			{
				let e = /* @__PURE__ */ N(() => Ts("By model"));
				Qb(S, {
					inline: !0,
					id: "session-models",
					get title() {
						return H(e);
					},
					nameLabel: "Model",
					get rows() {
						return H(r);
					},
					empty: "No usage in this range.",
					get pagerKey() {
						return `${H(t) ?? ""}-models`;
					}
				});
			}
			var ee = B(S, 2);
			lf(ee, {
				get agents() {
					return H(n).agents;
				},
				get pagerKey() {
					return `${H(t) ?? ""}-agents`;
				}
			});
			var te = B(ee, 2), C = (e) => {
				Ub(e, {
					get agents() {
						return H(n).agents;
					},
					get pagerKey() {
						return `${H(t) ?? ""}-tools`;
					}
				});
			};
			q(te, (e) => {
				H(n).transcript || e(C);
			});
			var w = B(te, 2), ne = (e) => {
				rb(e, {});
			};
			q(w, (e) => {
				H(n).transcript && e(ne);
			});
			var re = B(w, 2), ie = L(re), T = L(ie);
			{
				let e = /* @__PURE__ */ N(() => Ts("By skill"));
				Qb(T, {
					inline: !0,
					id: "session-skills",
					get title() {
						return H(e);
					},
					nameLabel: "Skill",
					get rows() {
						return H(i);
					},
					empty: "No turns attributed to a skill.",
					get pagerKey() {
						return `${H(t) ?? ""}-skills`;
					}
				});
			}
			A(ie);
			var ae = B(ie, 2), E = L(ae);
			{
				let e = /* @__PURE__ */ N(() => Ts("By MCP server"));
				Qb(E, {
					inline: !0,
					id: "session-mcp-servers",
					get title() {
						return H(e);
					},
					nameLabel: "MCP server",
					get rows() {
						return H(a);
					},
					empty: "No turns attributed to an MCP server.",
					get pagerKey() {
						return `${H(t) ?? ""}-mcp-servers`;
					}
				});
			}
			A(ae), A(re);
			var oe = B(re, 2);
			{
				let e = /* @__PURE__ */ N(() => Ts("Rate limits and API errors"));
				Yu(oe, {
					id: "session-api-errors",
					get title() {
						return H(e);
					},
					get rows() {
						return H(o);
					},
					empty: "No API errors in this session.",
					get pagerKey() {
						return `${H(t) ?? ""}-api-errors`;
					},
					withSession: !1
				});
			}
			var D = B(oe, 2), se = (e) => {
				Ub(e, {
					get agents() {
						return H(n).agents;
					},
					get pagerKey() {
						return `${H(t) ?? ""}-tools`;
					}
				});
			};
			q(D, (e) => {
				H(n).transcript && e(se);
			});
			var ce = B(D, 2), le = (e) => {
				rb(e, {});
			};
			q(ce, (e) => {
				H(n).transcript || e(le);
			}), A(c), li(c, () => kd({
				hide: ["filters", "summary"],
				focus: "#drilldown-title"
			})), V((e, t) => {
				K(u, e), K(m, t);
			}, [() => Ac(H(n)), () => Ad(H(n))]), G(e, c);
		}), G(e, c);
	};
	q(l, (e) => {
		H(n) && e(u);
	}), G(e, c), M();
}
//#endregion
//#region src/components/SummaryTiles.svelte
var rx = /* @__PURE__ */ U([[
	"div",
	{ class: "empty" },
	" "
]]);
function ix(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => Fo.summary);
	var r = W(), i = R(r), a = (e) => {
		var r = W(), i = R(r), a = (e) => {
			{
				let t = /* @__PURE__ */ N(() => Vd(H(n)));
				fb(e, {
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
				let t = /* @__PURE__ */ N(() => Yd(H(n).runtime.sessions));
				mb(e, {
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
		var t = rx(), n = z(t, !0);
		V(() => K(n, Fo.summaryFailed ? "Could not load the summary." : "Loading…")), G(e, t);
	};
	q(i, (e) => {
		H(n) ? e(a) : t.rows === "kpis" && e(o, 1);
	}), G(e, r), M();
}
//#endregion
//#region src/components/UsageTables.svelte
var ax = /* @__PURE__ */ U([
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
function ox(e, t) {
	j(t, !0);
	let n = /* @__PURE__ */ N(() => Fo.summary), r = /* @__PURE__ */ N(() => H(n) ? $d(H(n).agent_type, (e) => e.agent_type) : null), i = /* @__PURE__ */ N(() => H(n) ? aa([...new Set(H(n).day_model.map((e) => e.model))]) : null), a = /* @__PURE__ */ N(() => H(n) && H(i) ? ef(H(n).model, H(n).model_effort, H(i)) : null), o = /* @__PURE__ */ N(() => H(n) ? $d(H(n).project, (e) => e.project) : null), s = /* @__PURE__ */ N(() => H(n) ? $d(H(n).skill, (e) => e.skill) : null), c = /* @__PURE__ */ N(() => H(n) ? $d(H(n).mcp_server, (e) => e.mcp_server) : null);
	var l = ax(), u = R(l), d = L(u);
	{
		let e = /* @__PURE__ */ N(() => Ts("By agent type"));
		Qb(d, {
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
	var f = B(d, 2);
	{
		let e = /* @__PURE__ */ N(() => Ts("By model"));
		Qb(f, {
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
	A(u);
	var p = B(u, 2);
	{
		let e = /* @__PURE__ */ N(() => Ts("By project"));
		Qb(p, {
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
	var m = B(p, 2), h = L(m);
	{
		let e = /* @__PURE__ */ N(() => Ts("By skill"));
		Qb(h, {
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
	var g = B(h, 2);
	{
		let e = /* @__PURE__ */ N(() => Ts("By MCP server"));
		Qb(g, {
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
	A(m), G(e, l), M();
}
//#endregion
//#region src/lib/banner.svelte.ts
var sx = class {
	#e = new Mo();
	#t = /* @__PURE__ */ N(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return H(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, cx = [
	xa,
	ra,
	qc,
	pl,
	Lo,
	Ba,
	ds,
	ys,
	Us,
	Ls,
	No,
	gu,
	wu
];
function lx(e) {
	let t = new sx(), n = e.document.getElementById("error");
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
	let p = Gr(Ji, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	n.remove();
	let m = r.map(({ id: e, container: t }) => Gr(ix, {
		target: t,
		props: { rows: e }
	})), h = Gr(Wl, { target: i }), g = Gr(hu, { target: a }), _ = Gr(Dc, { target: o }), v = Gr(Kc, { target: s }), y = Gr(gd, { target: c }), b = Gr(ox, { target: l }), x = Gr(Ed, { target: u }), S = Gr(ju, { target: d }), ee = Gr(nx, { target: f });
	return e.showError = (e, n) => {
		t.show(e, n), Lt();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...cx), { stop() {
		Yr(p);
		for (let e of m) Yr(e);
		Yr(h), Yr(g), Yr(_), Yr(v), Yr(y), Yr(b), Yr(x), Yr(S), Yr(ee), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of cx.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
lx(window);
//#endregion

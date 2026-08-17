// tabs/analytics.js — Analytics tab. Renders as TWO pieces (Analytics inline block
// + AnalyticsSummary, originally renderInsightSummary()), matching the original
// app exactly: both are shown when activeTab === "analytics".
(function () {
  function Analytics(props) {
    const { avgMonthlyNet, bestMonth, biggestExpenseThisMonth, cardCls, categoryBreakdown, currentMonthLabel, darkMode, emergencyRunwayMonths, fmt, maxMonthlyVal, monthlyExpenseAED, monthlyHistory, monthlyIncomeAED, monthlySavingsAED, runwayStatus, savingsRate, totalLiquidAED, totalLoansBorrowedAED, totalLoansLentAED, totalPhysicalAED } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "space-y-4 max-w-xl mx-auto w-full"
  }, /* @__PURE__ */React.createElement("h2", {
    className: "text-sm font-bold uppercase tracking-wider text-blue-500 px-1"
  }, "Financial Health & Insights"), /* @__PURE__ */React.createElement("div", {
    className: `p-6 ${cardCls} space-y-4`
  }, /* @__PURE__ */React.createElement("div", {
    className: "space-y-3 text-xs md:text-sm"
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between"
  }, /* @__PURE__ */React.createElement("span", null, "Monthly Income"), /* @__PURE__ */React.createElement("span", {
    className: "font-bold text-emerald-500"
  }, fmt(monthlyIncomeAED))), /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between"
  }, /* @__PURE__ */React.createElement("span", null, "Monthly Expenses"), /* @__PURE__ */React.createElement("span", {
    className: "font-bold text-rose-500"
  }, fmt(monthlyExpenseAED))), /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between border-t pt-3 font-bold text-base"
  }, /* @__PURE__ */React.createElement("span", null, "Monthly Net Delta"), /* @__PURE__ */React.createElement("span", {
    className: monthlySavingsAED < 0 ? "text-rose-500" : "text-blue-500"
  }, fmt(monthlySavingsAED)))), /* @__PURE__ */React.createElement("div", {
    className: "pt-3 border-t text-xs text-zinc-400 space-y-2"
  }, /* @__PURE__ */React.createElement("p", null, "Emergency fund covers ", /* @__PURE__ */React.createElement("strong", {
    className: darkMode ? "text-zinc-100" : "text-zinc-800"
  }, "~", emergencyRunwayMonths, " months"), " of current monthly essential spend (", runwayStatus.label.toLowerCase(), ")."), /* @__PURE__ */React.createElement("p", null, "Savings rate this month is ", /* @__PURE__ */React.createElement("strong", {
    className: darkMode ? "text-zinc-100" : "text-zinc-800"
  }, savingsRate === null ? "N/A (no income logged this month)" : `${savingsRate}%`), "."), biggestExpenseThisMonth && /* @__PURE__ */React.createElement("p", null, "Biggest expense this month: ", /* @__PURE__ */React.createElement("strong", {
    className: darkMode ? "text-zinc-100" : "text-zinc-800"
  }, biggestExpenseThisMonth.title), " \\u2014 ", fmt(biggestExpenseThisMonth.aed), " (", biggestExpenseThisMonth.category, ")."))), /* @__PURE__ */React.createElement("div", {
    className: `p-6 ${cardCls} space-y-4`
  }, /* @__PURE__ */React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-wider text-zinc-500"
  }, "6-Month Income vs Expense Trend"), /* @__PURE__ */React.createElement("div", {
    className: "flex items-end justify-between gap-1 h-36 px-1"
  }, monthlyHistory.map(m => /* @__PURE__ */React.createElement("div", {
    key: m.key,
    className: "flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
  }, /* @__PURE__ */React.createElement("div", {
    className: "w-full flex items-end justify-center gap-1 flex-1"
  }, /* @__PURE__ */React.createElement("div", {
    className: "w-2.5 sm:w-3 rounded-t bg-emerald-500 transition-all",
    style: {
      height: `${Math.max(3, m.inc / maxMonthlyVal * 100)}%`
    },
    title: `Income ${fmt(m.inc)}`
  }), /* @__PURE__ */React.createElement("div", {
    className: "w-2.5 sm:w-3 rounded-t bg-rose-500 transition-all",
    style: {
      height: `${Math.max(3, m.exp / maxMonthlyVal * 100)}%`
    },
    title: `Expense ${fmt(m.exp)}`
  })), /* @__PURE__ */React.createElement("span", {
    className: "text-[9px] text-zinc-400"
  }, m.label)))), /* @__PURE__ */React.createElement("div", {
    className: "flex items-center justify-center gap-4 text-[10px] text-zinc-400"
  }, /* @__PURE__ */React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /* @__PURE__ */React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-emerald-500 inline-block"
  }), " Income"), /* @__PURE__ */React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /* @__PURE__ */React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-rose-500 inline-block"
  }), " Expense")), /* @__PURE__ */React.createElement("div", {
    className: "grid grid-cols-2 gap-3 pt-2 border-t text-xs"
  }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("span", {
    className: "text-zinc-400 block mb-0.5"
  }, "Avg. Monthly Net (6mo)"), /* @__PURE__ */React.createElement("strong", {
    className: avgMonthlyNet < 0 ? "text-rose-500" : "text-blue-500"
  }, fmt(avgMonthlyNet))), /* @__PURE__ */React.createElement("div", {
    className: "text-right"
  }, /* @__PURE__ */React.createElement("span", {
    className: "text-zinc-400 block mb-0.5"
  }, "Best Month"), /* @__PURE__ */React.createElement("strong", {
    className: "text-emerald-500"
  }, bestMonth && bestMonth.net !== 0 ? `${bestMonth.label} (${fmt(bestMonth.net)})` : "N/A")))), /* @__PURE__ */React.createElement("div", {
    className: `p-6 ${cardCls} space-y-3`
  }, /* @__PURE__ */React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-wider text-zinc-500"
  }, currentMonthLabel, " Spend by Category"), categoryBreakdown.length === 0 && /* @__PURE__ */React.createElement("p", {
    className: "text-xs text-zinc-400"
  }, "No expenses logged this month yet."), /* @__PURE__ */React.createElement("div", {
    className: "space-y-2.5"
  }, categoryBreakdown.map(([cat, amtAED]) => {
    const pct = monthlyExpenseAED > 0 ? Math.round(amtAED / monthlyExpenseAED * 100) : 0;
    return /* @__PURE__ */React.createElement("div", {
      key: cat,
      className: "space-y-1"
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex justify-between text-xs"
    }, /* @__PURE__ */React.createElement("span", {
      className: "font-semibold"
    }, cat), /* @__PURE__ */React.createElement("span", {
      className: "text-zinc-400"
    }, fmt(amtAED), " (", pct, "%)")), /* @__PURE__ */React.createElement("div", {
      className: "w-full bg-zinc-800/20 h-1.5 rounded-full overflow-hidden"
    }, /* @__PURE__ */React.createElement("div", {
      className: "bg-rose-500 h-full",
      style: {
        width: `${pct}%`
      }
    })));
  }))), /* @__PURE__ */React.createElement("div", {
    className: `p-6 ${cardCls} space-y-3`
  }, /* @__PURE__ */React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-wider text-zinc-500"
  }, "Net Worth Composition"), /* @__PURE__ */React.createElement("div", {
    className: "space-y-2.5"
  }, [{
    label: "Liquid (Accounts)",
    val: totalLiquidAED,
    cls: "bg-teal-500"
  }, {
    label: "Physical Assets",
    val: totalPhysicalAED,
    cls: "bg-amber-500"
  }, {
    label: "Lent Out",
    val: totalLoansLentAED,
    cls: "bg-emerald-500"
  }, {
    label: "Borrowed (deducted)",
    val: -totalLoansBorrowedAED,
    cls: "bg-rose-500"
  }].map(row => {
    const base = Math.max(1, totalLiquidAED + totalPhysicalAED + totalLoansLentAED + totalLoansBorrowedAED);
    const pct = Math.min(100, Math.round(Math.abs(row.val) / base * 100));
    return /* @__PURE__ */React.createElement("div", {
      key: row.label,
      className: "space-y-1"
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex justify-between text-xs"
    }, /* @__PURE__ */React.createElement("span", {
      className: "font-semibold"
    }, row.label), /* @__PURE__ */React.createElement("span", {
      className: "text-zinc-400"
    }, fmt(row.val))), /* @__PURE__ */React.createElement("div", {
      className: "w-full bg-zinc-800/20 h-1.5 rounded-full overflow-hidden"
    }, /* @__PURE__ */React.createElement("div", {
      className: `${row.cls} h-full`,
      style: {
        width: `${pct}%`
      }
    })));
  }))));
  }

  function AnalyticsSummary(props) {
    const { accent, biggestExpenseThisMonth, cardCls, categoryBreakdown, darkMode, fmt, insightTrendPeriod, insightTrendStyle, monthlyHistory, setInsightTrendPeriod, setInsightTrendStyle, yearlyHistory } = props;
    const h = React.createElement;
    const topCategory = categoryBreakdown[0];
    const trendData = insightTrendPeriod === "yearly" ? yearlyHistory : monthlyHistory;
    const chartMax = Math.max(1, ...trendData.map(item => Math.max(item.inc, item.exp)));
    const chartWidth = 300;
    const chartHeight = 136;
    const chartPad = 12;
    const chartPoints = field => trendData.map((item, index) => {
    const x = chartPad + index * (chartWidth - chartPad * 2) / Math.max(1, trendData.length - 1);
    const y = chartHeight - chartPad - item[field] / chartMax * (chartHeight - chartPad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
    const tabButton = (id, label) => h("button", {
    type: "button",
    onClick: () => setInsightTrendPeriod(id),
    className: `px-3 py-1.5 rounded-lg text-[11px] font-bold ${insightTrendPeriod === id ? `${accent.activeBg} ${accent.textStrong}` : "text-zinc-400"}`
  }, label);
    const styleButton = (id, label) => h("button", {
    type: "button",
    onClick: () => setInsightTrendStyle(id),
    className: `px-3 py-1.5 rounded-lg text-[11px] font-bold ${insightTrendStyle === id ? `${accent.activeBg10} ${accent.textStrong}` : "text-zinc-400"}`
  }, label);
    const trendChart = insightTrendStyle === "line" ? h("div", null, h("svg", {
    viewBox: `0 0 ${chartWidth} ${chartHeight}`,
    className: "w-full h-36",
    role: "img",
    "aria-label": `${insightTrendPeriod} income and expense trend`
  }, h("line", {
    x1: chartPad,
    y1: chartHeight - chartPad,
    x2: chartWidth - chartPad,
    y2: chartHeight - chartPad,
    stroke: darkMode ? "#3f3f46" : "#e4e4e7",
    strokeWidth: "1"
  }), h("polyline", {
    points: chartPoints("inc"),
    fill: "none",
    stroke: "#10b981",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), h("polyline", {
    points: chartPoints("exp"),
    fill: "none",
    stroke: "#f43f5e",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), h("div", {
    className: "grid gap-1 text-center text-[9px] text-zinc-400 -mt-1",
    style: {
      gridTemplateColumns: `repeat(${trendData.length}, minmax(0, 1fr))`
    }
  }, trendData.map(item => h("span", {
    key: item.key
  }, insightTrendPeriod === "yearly" ? item.label.slice(2) : item.label)))) : h("div", {
    className: "flex items-end justify-between gap-1 h-36 px-1"
  }, trendData.map(item => h("div", {
    key: item.key,
    className: "flex-1 h-full flex flex-col items-center justify-end gap-1.5"
  }, h("div", {
    className: "w-full flex items-end justify-center gap-1 flex-1"
  }, h("div", {
    className: "w-2.5 rounded-t bg-emerald-500",
    style: {
      height: `${Math.max(3, item.inc / chartMax * 100)}%`
    },
    title: `Income ${fmt(item.inc)}`
  }), h("div", {
    className: "w-2.5 rounded-t bg-rose-500",
    style: {
      height: `${Math.max(3, item.exp / chartMax * 100)}%`
    },
    title: `Expense ${fmt(item.exp)}`
  })), h("span", {
    className: "text-[9px] text-zinc-400"
  }, insightTrendPeriod === "yearly" ? item.label.slice(2) : item.label))));
    return h(React.Fragment, null, h("section", {
    className: `p-5 ${cardCls} max-w-xl mx-auto w-full space-y-4`
  }, h("div", {
    className: "flex items-start justify-between gap-3"
  }, h("div", null, h("p", {
    className: "text-xs font-bold uppercase tracking-wider text-zinc-500"
  }, "Trend explorer"), h("p", {
    className: "text-[10px] text-zinc-400 mt-1"
  }, "Recorded income and expenses only.")), h("div", {
    className: `flex p-1 rounded-xl ${darkMode ? "bg-zinc-950" : "bg-zinc-100"}`
  }, tabButton("monthly", "Monthly"), tabButton("yearly", "Yearly"))), h("div", {
    className: `flex gap-1 p-1 rounded-xl w-max ${darkMode ? "bg-zinc-950" : "bg-zinc-100"}`
  }, styleButton("line", "Line"), styleButton("bars", "Bars")), trendChart, h("div", {
    className: "flex items-center justify-center gap-4 text-[10px] text-zinc-400"
  }, h("span", {
    className: "flex items-center gap-1.5"
  }, h("span", {
    className: "w-2 h-2 rounded-full bg-emerald-500 inline-block"
  }), "Income"), h("span", {
    className: "flex items-center gap-1.5"
  }, h("span", {
    className: "w-2 h-2 rounded-full bg-rose-500 inline-block"
  }), "Expenses"))), h("div", {
    className: `p-4 ${cardCls} max-w-xl mx-auto w-full`
  }, h("div", {
    className: "grid grid-cols-2 gap-3 text-xs"
  }, h("div", null, h("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500"
  }, "Top category"), h("p", {
    className: "font-bold mt-1"
  }, topCategory ? topCategory[0] : "No expenses yet"), topCategory && h("p", {
    className: "text-[10px] text-rose-500 mt-0.5"
  }, fmt(topCategory[1]))), h("div", null, h("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500"
  }, "Biggest expense"), h("p", {
    className: "font-bold mt-1"
  }, biggestExpenseThisMonth ? biggestExpenseThisMonth.title : "No expenses yet"), biggestExpenseThisMonth && h("p", {
    className: "text-[10px] text-rose-500 mt-0.5"
  }, fmt(biggestExpenseThisMonth.aed))))));
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Analytics = Analytics;
  window.Tabs.AnalyticsSummary = AnalyticsSummary;
})();

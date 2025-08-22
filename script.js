document.getElementById("calcForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let on_demand_hourly = 0.0461;
    let reserved_discount_pct = parseFloat(document.getElementById("reserved_discount_pct").value);
    let instances_total = parseInt(document.getElementById("instances_total").value);
    let hours_per_month = 730;
    let reserved_upfront_monthly = parseFloat(document.getElementById("reserved_upfront_monthly").value);

    // Pega o valor informado pelo usuário
    let reserved_share_pct_user = parseFloat(document.getElementById("reserved_share_pct").value);

    // Lista de percentuais fixos + o do usuário (evita duplicidade)
    let reserved_share_pcts = [50, 80, 100];
    if (!reserved_share_pcts.includes(reserved_share_pct_user)) {
        reserved_share_pcts.push(reserved_share_pct_user);
    }

    // Limpa resultados anteriores
    let resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<hr>";

    reserved_share_pcts.forEach(function(reserved_share_pct) {
        let price_reserved_hourly = on_demand_hourly * (1 - reserved_discount_pct / 100);
        let inst_reserved = Math.round(instances_total * reserved_share_pct / 100);
        let inst_ondemand = instances_total - inst_reserved;

        let cost_reserved = inst_reserved * (price_reserved_hourly * hours_per_month + reserved_upfront_monthly);
        let cost_ondemand = inst_ondemand * (on_demand_hourly * hours_per_month);

        let cost_total = cost_reserved + cost_ondemand;
        let baseline = instances_total * on_demand_hourly * hours_per_month;

        let saving_abs = baseline - cost_total;
        let saving_pct = (saving_abs / baseline) * 100;
        let ondemand_pct = 100 - reserved_share_pct;

        // Cria um bloco de resultado para cada percentual
        let resultBlock = document.createElement("div");
        resultBlock.innerHTML = `
            <strong>Distribuição: ${reserved_share_pct}% reservada / ${ondemand_pct}% on-demand</strong><br>
            Custo total: <span>$${cost_total.toFixed(2)}</span><br>
            Baseline (100% on-demand): <span>$${baseline.toFixed(2)}</span><br>
            Economia absoluta: <span>$${saving_abs.toFixed(2)}</span><br>
            Economia percentual: <span>${saving_pct.toFixed(2)}%</span>
            <hr>
        `;
        resultsDiv.appendChild(resultBlock);
    });

    resultsDiv.style.display = "";
});
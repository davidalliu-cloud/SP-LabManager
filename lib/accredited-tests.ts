export interface AccreditedTest {
  id: string;
  sampleType: string;
  testName: string;
  standard: string;
  measurementRange?: string;
  samplingStandard?: string;
}

const sampleTypeDisplayNames: Record<string, string> = {
  "Sand": "Rërë / Sand",
  "Gravel 1": "Zhavorr 1 / Gravel 1",
  "Gravel 2": "Zhavorr 2 / Gravel 2",
  "Filler": "Filer / Filler",
  "Soil": "Dhe / Soil",
  "Kubike Betoni": "Kubike Betoni / Concrete Cubes",
  "Lesh Guri": "Lesh Guri / Rock Wool",
  "XPS": "XPS / Extruded Polystyrene",
  "EPS": "EPS / Expanded Polystyrene",
  "Çimento": "Çimento / Cement",
  "Rebar / Shufër Çeliku": "Shufër Çeliku / Rebar"
};

const sampleTypeAliases: Record<string, string> = {
  "Sand": "Rërë / Sand",
  "Gravel 1": "Zhavorr 1 / Gravel 1",
  "Gravel 2": "Zhavorr 2 / Gravel 2",
  "Filler": "Filer / Filler",
  "Soil": "Dhe / Soil",
  "Kubike Betoni": "Kubike Betoni / Concrete Cubes",
  "Concrete cube": "Kubike Betoni / Concrete Cubes",
  "Concrete Cubes": "Kubike Betoni / Concrete Cubes",
  "Cement": "Çimento / Cement",
  "Çimento": "Çimento / Cement",
  "Lesh Guri": "Lesh Guri / Rock Wool",
  "XPS": "XPS / Extruded Polystyrene",
  "EPS": "EPS / Expanded Polystyrene",
  "Rebar / Shufër Çeliku": "Shufër Çeliku / Rebar",
  "Shufër Çeliku / Rebar": "Shufër Çeliku / Rebar"
};

function displaySampleType(sampleType: string) {
  return sampleTypeDisplayNames[sampleType] ?? sampleType;
}

function normalizeSampleType(sampleType: string) {
  return sampleTypeAliases[sampleType] ?? sampleType;
}

const accreditedTestRows: Array<[string, string, string, string, string?, string?]> = [
  ["AT-GRA-SAND", "Sand", "Granulometri sipas BS EN", "BS EN 933-1:2012", "0.063÷4 mm"],
  ["AT-GRA-GRAVEL-1", "Gravel 1", "Granulometri sipas BS EN", "BS EN 933-1:2012", "0.063÷31.5 mm"],
  ["AT-GRA-GRAVEL-2", "Gravel 2", "Granulometri sipas BS EN", "BS EN 933-1:2012", "0.063÷63 mm"],
  ["AT-GRA-FILLER", "Filler", "Granulometri sipas BS EN", "BS EN 933-1:2012", "0.063÷2 mm"],
  ["AT-GRA-SOIL", "Soil", "Granulometri sipas BS EN", "BS EN 933-1:2012", "0.063÷125 mm"],
  ["AT-CHEM-SAND", "Sand", "Klorure dhe sulfate në agregate", "BS EN 1744-1:2009+A1:2012", "Chlorides and sulfates"],
  ["AT-CHEM-GRAVEL-1", "Gravel 1", "Klorure dhe sulfate në agregate", "BS EN 1744-1:2009+A1:2012", "Chlorides and sulfates"],
  ["AT-CHEM-GRAVEL-2", "Gravel 2", "Klorure dhe sulfate në agregate", "BS EN 1744-1:2009+A1:2012", "Chlorides and sulfates"],
  ["AT-CHEM-FILLER", "Filler", "Klorure dhe sulfate në agregate", "BS EN 1744-1:2009+A1:2012", "Chlorides and sulfates"],
  ["AT-CHEM-SOIL", "Soil", "Klorure dhe sulfate në agregate", "BS EN 1744-1:2009+A1:2012", "Chlorides and sulfates"],
  ["AT-LA-SAND", "Sand", "Përcaktimi i rezistencës në fragmentim (Los Angeles)", "BS EN 1097-2:2020", "1÷100%"],
  ["AT-LA-GRAVEL-1", "Gravel 1", "Përcaktimi i rezistencës në fragmentim (Los Angeles)", "BS EN 1097-2:2020", "1÷100%"],
  ["AT-LA-GRAVEL-2", "Gravel 2", "Përcaktimi i rezistencës në fragmentim (Los Angeles)", "BS EN 1097-2:2020", "1÷100%"],
  ["AT-LA-FILLER", "Filler", "Përcaktimi i rezistencës në fragmentim (Los Angeles)", "BS EN 1097-2:2020", "1÷100%"],
  ["AT-LA-SOIL", "Soil", "Përcaktimi i rezistencës në fragmentim (Los Angeles)", "BS EN 1097-2:2020", "1÷100%"],
  ["AT-FT-SAND", "Sand", "Përcaktimi i rezistencës ndaj cikleve ngrirje-shkrirje", "BS EN 1367-1:2007", "≥ 0.05 %"],
  ["AT-FT-GRAVEL-1", "Gravel 1", "Përcaktimi i rezistencës ndaj cikleve ngrirje-shkrirje", "BS EN 1367-1:2007", "≥ 0.05 %"],
  ["AT-FT-GRAVEL-2", "Gravel 2", "Përcaktimi i rezistencës ndaj cikleve ngrirje-shkrirje", "BS EN 1367-1:2007", "≥ 0.05 %"],
  ["AT-FT-FILLER", "Filler", "Përcaktimi i rezistencës ndaj cikleve ngrirje-shkrirje", "BS EN 1367-1:2007", "≥ 0.05 %"],
  ["AT-FT-SOIL", "Soil", "Përcaktimi i rezistencës ndaj cikleve ngrirje-shkrirje", "BS EN 1367-1:2007", "≥ 0.05 %"],
  ["AT-ACV-SAND", "Sand", "Përcaktimi i rezistencës në thërrmim (ACV)", "BS EN 1097-2:2020", "1÷100%"],
  ["AT-ACV-GRAVEL-1", "Gravel 1", "Përcaktimi i rezistencës në thërrmim (ACV)", "BS EN 1097-2:2020", "1÷100%"],
  ["AT-ACV-GRAVEL-2", "Gravel 2", "Përcaktimi i rezistencës në thërrmim (ACV)", "BS EN 1097-2:2020", "1÷100%"],
  ["AT-ACV-FILLER", "Filler", "Përcaktimi i rezistencës në thërrmim (ACV)", "BS EN 1097-2:2020", "1÷100%"],
  ["AT-ACV-SOIL", "Soil", "Përcaktimi i rezistencës në thërrmim (ACV)", "BS EN 1097-2:2020", "1÷100%"],
  ["AT-DENS-SAND", "Sand", "Përcaktimi i peshës specifike dhe absorbimit", "BS EN 1097-6:2022", "Densiteti 2.1÷3.0 g/cm3; Absorbimi 0.1÷10%"],
  ["AT-DENS-GRAVEL-1", "Gravel 1", "Përcaktimi i peshës specifike dhe absorbimit", "BS EN 1097-6:2022", "Densiteti 2.1÷3.0 g/cm3; Absorbimi 0.1÷10%"],
  ["AT-DENS-GRAVEL-2", "Gravel 2", "Përcaktimi i peshës specifike dhe absorbimit", "BS EN 1097-6:2022", "Densiteti 2.1÷3.0 g/cm3; Absorbimi 0.1÷10%"],
  ["AT-DENS-FILLER", "Filler", "Përcaktimi i peshës specifike dhe absorbimit", "BS EN 1097-6:2022", "Densiteti 2.1÷3.0 g/cm3; Absorbimi 0.1÷10%"],
  ["AT-DENS-SOIL", "Soil", "Përcaktimi i peshës specifike dhe absorbimit", "BS EN 1097-6:2022", "Densiteti 2.1÷3.0 g/cm3; Absorbimi 0.1÷10%"],
  ["AT-FILLER-DENS", "Filler", "Përcaktimi i densitetit specifik të filerit", "BS EN 1097-7:2022", "Specific density of filler"],
  ["AT-SHAPE-SAND", "Sand", "Përcaktimi i indeksit të formës", "BS EN 933-4:2008", "0÷100 %"],
  ["AT-SHAPE-GRAVEL-1", "Gravel 1", "Përcaktimi i indeksit të formës", "BS EN 933-4:2008", "0÷100 %"],
  ["AT-SHAPE-GRAVEL-2", "Gravel 2", "Përcaktimi i indeksit të formës", "BS EN 933-4:2008", "0÷100 %"],
  ["AT-SHAPE-FILLER", "Filler", "Përcaktimi i indeksit të formës", "BS EN 933-4:2008", "0÷100 %"],
  ["AT-SHAPE-SOIL", "Soil", "Përcaktimi i indeksit të formës", "BS EN 933-4:2008", "0÷100 %"],
  ["AT-FLAKE-SAND", "Sand", "Përcaktimi i indeksit të ciflosjes", "BS EN 933-3:2012", "0÷100 %"],
  ["AT-FLAKE-GRAVEL-1", "Gravel 1", "Përcaktimi i indeksit të ciflosjes", "BS EN 933-3:2012", "0÷100 %"],
  ["AT-FLAKE-GRAVEL-2", "Gravel 2", "Përcaktimi i indeksit të ciflosjes", "BS EN 933-3:2012", "0÷100 %"],
  ["AT-FLAKE-FILLER", "Filler", "Përcaktimi i indeksit të ciflosjes", "BS EN 933-3:2012", "0÷100 %"],
  ["AT-FLAKE-SOIL", "Soil", "Përcaktimi i indeksit të ciflosjes", "BS EN 933-3:2012", "0÷100 %"],
  ["AT-CONC-FLEX-KUBIKE", "Kubike Betoni", "Përcaktimi i rezistencës në përkulje", "BS EN 12390-5:2019", "0.5÷15 MPa", "BS EN 12390-1:2021; BS EN 12390-2:2019"],
  ["AT-CONC-COMP-KUBIKE", "Kubike Betoni", "Përcaktimi i rezistencës në shtypje", "BS EN 12390-3:2019", "1÷88 MPa", "BS EN 12390-1:2021; BS EN 12390-2:2019"],
  ["AT-CONC-WATER-KUBIKE", "Kubike Betoni", "Përcaktimi i nivelit të depërtimit të ujit në betonin e ngurtësuar", "BS EN 12390-8:2019", "0.5÷60 mm", "BS EN 12390-1:2021; BS EN 12390-2:2019"],
  ["AT-CONC-DENS-KUBIKE", "Kubike Betoni", "Përcaktimi i densitetit (pesha volumore), në betonin e ngurtësuar", "BS EN 12390-7:2019", "800÷2600 kg/m3", "BS EN 12390-1:2021; BS EN 12390-2:2019"],
  ["AT-CONC-SPLIT-KUBIKE", "Kubike Betoni", "Përcaktimi i rezistencës në tërheqje indirekte", "BS EN 12390-6:2009", "< 15 MPa", "BS EN 12390-1:2021; BS EN 12390-2:2019"],
  ["AT-THERM-LESH-GURI", "Lesh Guri", "Përcaktimi i karakteristikave fiziko-mekanike të produkteve termoizoluese", "BS EN ISO 29465:2022; BS EN ISO 29466:2022; BS EN 826:2013; BS EN 1602:2013; BS EN ISO 29767:2019", "Dimensions, density, absorption, compression"],
  ["AT-THERM-XPS", "XPS", "Përcaktimi i karakteristikave fiziko-mekanike të produkteve termoizoluese", "BS EN ISO 29465:2022; BS EN ISO 29466:2022; BS EN 826:2013; BS EN 1602:2013; BS EN ISO 29767:2019", "Dimensions, density, absorption, compression"],
  ["AT-THERM-EPS", "EPS", "Përcaktimi i karakteristikave fiziko-mekanike të produkteve termoizoluese", "BS EN ISO 29465:2022; BS EN ISO 29466:2022; BS EN 826:2013; BS EN 1602:2013; BS EN ISO 29767:2019", "Dimensions, density, absorption, compression"],
  ["AT-CEM-CONS-SETTING-EXP", "Çimento", "Konsistenca, koha e prezës dhe ekspansioni", "BS EN 196-3:2016", "Water demand, setting time, expansion"],
  ["AT-CEM-STRENGTH", "Çimento", "Rezistenca në shtypje dhe përkulje e çimentos", "BS EN 196-1:2016", "Flexural and compressive strength"],
  ["AT-CEM-BLAINE-BSEN", "Çimento", "Sipërfaqja specifike Blaine sipas BS EN", "BS EN 196-6:2018", "Specific surface up to 5000 cm2/g"],
  ["AT-CEM-BLAINE-ASTM", "Çimento", "Sipërfaqja specifike Blaine sipas ASTM", "ASTM C204 - 18e1", "Specific surface up to 5000 cm2/g"],
  ["AT-ELONG-SAND", "Sand", "Përcaktimi i indeksit të zgjatimit", "BS 812-105.2:1980", "0÷100 %"],
  ["AT-ELONG-GRAVEL-1", "Gravel 1", "Përcaktimi i indeksit të zgjatimit", "BS 812-105.2:1980", "0÷100 %"],
  ["AT-ELONG-GRAVEL-2", "Gravel 2", "Përcaktimi i indeksit të zgjatimit", "BS 812-105.2:1980", "0÷100 %"],
  ["AT-ELONG-FILLER", "Filler", "Përcaktimi i indeksit të zgjatimit", "BS 812-105.2:1980", "0÷100 %"],
  ["AT-ELONG-SOIL", "Soil", "Përcaktimi i indeksit të zgjatimit", "BS 812-105.2:1980", "0÷100 %"],
  ["AT-BULK-SAND", "Sand", "Përcaktimi i peshës volumore të agregateve", "BS EN 1097-3:1998", "1.1÷1.9 g/cm3"],
  ["AT-BULK-GRAVEL-1", "Gravel 1", "Përcaktimi i peshës volumore të agregateve", "BS EN 1097-3:1998", "1.1÷1.9 g/cm3"],
  ["AT-BULK-GRAVEL-2", "Gravel 2", "Përcaktimi i peshës volumore të agregateve", "BS EN 1097-3:1998", "1.1÷1.9 g/cm3"],
  ["AT-BULK-FILLER", "Filler", "Përcaktimi i peshës volumore të agregateve", "BS EN 1097-3:1998", "1.1÷1.9 g/cm3"],
  ["AT-BULK-SOIL", "Soil", "Përcaktimi i peshës volumore të agregateve", "BS EN 1097-3:1998", "1.1÷1.9 g/cm3"],
  ["AT-SE-SAND", "Sand", "Vlerësimi i imtesisë. Përcaktimi ekuivalentit të rërës", "BS EN 933-8:2012+A1:2015", "1÷98%"],
  ["AT-SE-GRAVEL-1", "Gravel 1", "Vlerësimi i imtesisë. Përcaktimi ekuivalentit të rërës", "BS EN 933-8:2012+A1:2015", "1÷98%"],
  ["AT-SE-GRAVEL-2", "Gravel 2", "Vlerësimi i imtesisë. Përcaktimi ekuivalentit të rërës", "BS EN 933-8:2012+A1:2015", "1÷98%"],
  ["AT-SE-FILLER", "Filler", "Vlerësimi i imtesisë. Përcaktimi ekuivalentit të rërës", "BS EN 933-8:2012+A1:2015", "1÷98%"],
  ["AT-SE-SOIL", "Soil", "Vlerësimi i imtesisë. Përcaktimi ekuivalentit të rërës", "BS EN 933-8:2012+A1:2015", "1÷98%"],
  ["AT-SOUND-SAND", "Sand", "Përcaktimi i humbjes në peshë me sulfat magnezi (Soundness)", "BS EN 1367-2:2009", "0.5-30%"],
  ["AT-SOUND-GRAVEL-1", "Gravel 1", "Përcaktimi i humbjes në peshë me sulfat magnezi (Soundness)", "BS EN 1367-2:2009", "0.5-30%"],
  ["AT-SOUND-GRAVEL-2", "Gravel 2", "Përcaktimi i humbjes në peshë me sulfat magnezi (Soundness)", "BS EN 1367-2:2009", "0.5-30%"],
  ["AT-SOUND-FILLER", "Filler", "Përcaktimi i humbjes në peshë me sulfat magnezi (Soundness)", "BS EN 1367-2:2009", "0.5-30%"],
  ["AT-SOUND-SOIL", "Soil", "Përcaktimi i humbjes në peshë me sulfat magnezi (Soundness)", "BS EN 1367-2:2009", "0.5-30%"],
  ["AT-001", "AGREGATE", "Përcaktimi i shpërndarjes së madhësisë së grimcës. (Analiza granulometrike me sita)", "BS EN 933-1:2012; AASHTO T27:22; ASTM C 136/C136M-19", "0.063÷150 mm"],
  ["AT-002", "AGREGATE", "Përcaktimi i peshës specifike dhe absorbimit", "BS EN 1097-6:2022; ASTM C128-22; ASTM C127-15; BS EN 1097-7:2022", "Densiteti 2.1÷3.0 g/cm3; Absorbimi 0.1÷10%"],
  ["AT-003", "AGREGATE", "Përcaktimi i indeksit të formës", "BS EN 933-4:2008", "0÷100 %"],
  ["AT-004", "AGREGATE", "Përcaktimi i indeksit të ciflosjes", "BS EN 933-3:2012", "0÷100 %"],
  ["AT-005", "AGREGATE", "Përcaktimi i indeksit të zgjatimit", "BS 812-105.2:1980", "0÷100 %"],
  ["AT-006", "AGREGATE", "Përcaktimi i peshës volumore të agregateve", "BS EN 1097-3:1998", "1.1÷1.9 g/cm3"],
  ["AT-007", "AGREGATE", "Vlerësimi i imtesisë. Përcaktimi ekuivalentit të rërës", "BS EN 933-8:2012+A1:2015; ASTM D2419-22", "1÷98%"],
  ["AT-008", "AGREGATE", "Përcaktimi i humbjes në peshë me sulfat magnezi i agregateve me madhesi grimce 10/14 mm (Soundness)", "BS EN 1367-2:2009", "0.5-30%"],
  ["AT-009", "AGREGATE", "Përcaktimi i rezistencës në fragmentim (Los Angeles)", "EN 1097-2:2020; ASTM C131 / C131M - 20", "1÷100%"],
  ["AT-010", "AGREGATE", "Përcaktimi i rezistencës në thërmim (ACV)", "BS EN 1097-2:2020", "1÷100%"],
  ["AT-011", "AGREGATE", "Percaktimi i rezistences se agregateve ndaj cikleve ngrirje -shkrirje", "BS EN 1367-1:2007", "≥ 0.05 %"],
  ["AT-012", "PËRZIERJE BITUMINOZE", "Përcaktimi i përqindjes së bitumit me ekstraktim", "BS EN 12697-1:2020; ASTM D2172 / D2172M - 17e1", "3.0÷6.0%", "BS EN 12697-27:2017"],
  ["AT-013", "PËRZIERJE BITUMINOZE", "Përcaktimi i shpërndarjes së kokrrizave të agregatit nga ekstraktimi. (Analiza granulometrike)", "BS EN 12697-2:2015+A1:2019", "0.063÷50 mm", "BS EN 12697-27:2017"],
  ["AT-014", "PËRZIERJE BITUMINOZE", "Përcaktimi i Densitetit Marshall (Pesha Volumore) në përzierjen asfaltike", "BS EN 12697-6:2020", "2.0÷2.7 g/cm3", "BS EN 12697-27:2017"],
  ["AT-015", "PËRZIERJE BITUMINOZE", "Përcaktimi i përqindjes së boshllëqeve të ajrit në përzierjen asfaltike", "ASTM D3203-22; BS EN 12697-8:2018", "0.1÷9.0%", "BS EN 12697-27:2017"],
  ["AT-016", "PËRZIERJE BITUMINOZE", "Përcaktimi i Stabilitetit Marshall", "BS EN 12697-34:2020; ASTM D6927-22", "0.1÷50 kN; 0.05÷10 mm", "BS EN 12697-27:2017"],
  ["AT-017", "PËRZIERJE BITUMINOZE", "Formulimi i recetës së prodhimit të përzierjes së asfalto betoneve", "BS EN 13108-1:2016; BS EN 13108-4:2016; BS EN 13108-20:2016", "", "BS EN 12697-27:2017"],
  ["AT-018", "BETON I FRESKET", "Formulimi i recetës së prodhimit të betoneve të ndryshme (Beton normal, Vetenivelues, Shotcrete, Porobeton, etj)", "BS EN 206:2013+A2:2021", "8÷70 MPa", "BS EN 12350-1:2019"],
  ["AT-019", "BETON I FRESKET", "Matja e konsistencës (slump, Koni Abraham's)", "BS EN 12350-2:2019; ASTM C143 / C143M - 20", "0÷250 mm", "BS EN 12350-1:2019"],
  ["AT-020", "BETON I FRESKET", "Përcaktimi i densitetit në betonin e freskët", "BS EN 12350-6:2019; ASTM C138 / C138M - 17a", "800÷2600 kg/m3", "BS EN 12350-1:2019"],
  ["AT-021", "BETON I FRESKET", "Përcaktimi i përmbajtjes së ajrit në betonin e freskët (Poroziteti)", "BS EN 12350-7:2019/AC:2022; ASTM C231 / C231M - 22", "< 10%", "BS EN 12350-1:2019"],
  ["AT-022", "BETON I NGURTËSUAR", "Përcaktimi i rezistencës në shtypje", "BS EN 12390-3:2019", "1÷88 MPa", "BS EN 12390-1:2021; BS EN 12390-2:2019"],
  ["AT-023", "BETON I NGURTËSUAR", "Përcaktimi i rezistencës në përkulje", "BS EN 12390-5:2019", "0.5÷15 MPa", "BS EN 12390-1:2021; BS EN 12390-2:2019"],
  ["AT-024", "BETON I NGURTËSUAR", "Përcaktimi i rezistencës në tërheqje indirekte", "BS EN 12390-6:2009; ASTM C496/C496M:2017", "< 15 MPa", "BS EN 12390-1:2021; BS EN 12390-2:2019"],
  ["AT-025", "BETON I NGURTËSUAR", "Përcaktimi i përmbajtjes së çimentos", "UNI 6505:1973", "1÷20%"],
  ["AT-026", "BETON I NGURTËSUAR", "Përcaktimi i densitetit (pesha volumore), në betonin e ngurtësuar", "BS EN 12390-7:2019", "800÷2600 kg/m3", "BS EN 12390-1:2021; BS EN 12390-2:2019"],
  ["AT-027", "BETON I NGURTËSUAR", "Përcaktimi i nivelit të depërtimit të ujit në betonin e ngurtësuar", "BS EN 12390-8:2019", "0.5÷60 mm", "BS EN 12390-1:2021; BS EN 12390-2:2019"],
  ["AT-028", "BITUME", "Përcaktimi i pikës së zbutjes te materialeve bituminoze", "BS EN 1427:2015; BS 2000-58:2015; ASTM D36 / D36M - 14(2020)", "0.1÷130 C"],
  ["AT-029", "BITUME", "Përcaktimi i penetrimit te materialeve bituminoze", "BS EN 1426:2015; BS 2000-49:2015", "5÷330 dmm"],
  ["AT-030", "ÇIMENTO", "Përcaktimi i konsistencës standarte dhe kohës së prezës", "BS EN 196-3:2016", "Konsistenca 0.1÷35%; Koha e prezes ≥ 45 min"],
  ["AT-031", "ÇIMENTO", "Përcaktimi i rezistencës në shtypje dhe përkulje", "BS EN 196-1:2016", "Përkulje 0.5÷15 MPa; Shtypje 1÷88 MPa"],
  ["AT-032", "ÇIMENTO", "Përcaktimi i sipërfaqes specifike dhe densitetit të çimentos", "BS EN 196-6:2018; ASTM C204 - 23", "≤ 5000 cm2/g; 3÷3.5 g/cm3"],
  ["AT-033", "ÇIMENTO", "Përcaktimi i ndryshimit të njëtrajtshëm të vëllimit (Ekspansion)", "BS EN 196-3:2016", "≤ 10mm"],
  ["AT-034", "ELEMENT MURATURE 1. TULLA QERAMIKE, SILIKATE, BETONI, 2. BLLOK BETONI", "Përcaktimi i dimensioneve", "BS EN 772-16:2011", "0.1÷500 mm"],
  ["AT-035", "ELEMENT MURATURE 1. TULLA QERAMIKE, SILIKATE, BETONI, 2. BLLOK BETONI", "Përcaktimi i densitetit volumor, specifik dhe aparent", "BS EN 772-13:2000", "500÷2500 kg/m3"],
  ["AT-036", "ELEMENT MURATURE 1. TULLA QERAMIKE, SILIKATE, BETONI, 2. BLLOK BETONI", "Përcaktimi i ujëthithjes (absorbimi)", "BS EN 772-21:2011", "0.1÷30%"],
  ["AT-037", "ELEMENT MURATURE 1. TULLA QERAMIKE, SILIKATE, BETONI, 2. BLLOK BETONI", "Përcaktimi i rezistencës në shtypje", "BS EN 772-1:2011+A1:2015", "1÷88 MPa"],
  ["AT-038", "ELEMENT MURATURE -LLAÇE", "Përcaktimi i madhësisë së grimcës (Analiza granulometrike)", "BS EN 1015-1:1999", "< 4.75 mm"],
  ["AT-039", "ELEMENT MURATURE -LLAÇE", "Përcaktimi i densiteti të llaçit të ngurtësuar", "BS EN 1015-10:1999", "< 3000 kg/m3"],
  ["AT-040", "ELEMENT MURATURE -LLAÇE", "Përcaktimi i rezistencës në shtypje dhe përkulje e llaçit të ngurtësuar", "BS EN 1015-11:2019", "2.5÷25 MPa"],
  ["AT-041", "ELEMENT TROTUARËSH FLETE DHE BLLOK BETONI", "Përcaktimi i dimensioneve", "BS EN 1338:2003 Aneks C", "0.1÷500 mm"],
  ["AT-042", "ELEMENT TROTUARËSH FLETE DHE BLLOK BETONI", "Përcaktimi i absorbimit të ujit", "BS EN 1338:2003 Aneks E", "0.1÷10%"],
  ["AT-043", "ELEMENT TROTUARËSH FLETE DHE BLLOK BETONI", "Përcaktimi i rezistencës në tërheqje indirekte (Prova braziliane)", "BS EN 1338:2003 Aneks F, K", "0.1÷5 MPa"],
  ["AT-044", "ELEMENT TROTUARËSH BORDURA BETONI", "Përcaktimi i dimensioneve", "BS EN 1340:2003 Aneks C", "> 50 mm"],
  ["AT-045", "ELEMENT TROTUARËSH BORDURA BETONI", "Përcaktimi i absorbimit të ujit", "BS EN 1340:2003 Aneks E", "0.1÷10%"],
  ["AT-046", "ELEMENT TROTUARËSH BORDURA BETONI", "Përcaktimi i rezistencës në përkulje", "BS EN 1340:2003 Aneks F", "0.1÷10 MPa"],
  ["AT-047", "ELEMENT TROTUARËSH PLLAKA BETONI", "Përcaktimi i dimensioneve", "BS EN 1339:2003 Aneks C", "0.1÷500 mm"],
  ["AT-048", "ELEMENT TROTUARËSH PLLAKA BETONI", "Përcaktimi i absorbimit të ujit", "BS EN 1339:2003 Aneks E", "0.1÷10 %"],
  ["AT-049", "ELEMENT TROTUARËSH PLLAKA BETONI", "Përcaktimi i rezistencës në përkulje", "BS EN 1339:2003 Aneks F", "1÷45 MPa"],
  ["AT-050", "GJEOTEKNIKE - DHERA", "Përcaktimi i densitetit dhe peshës së njehsuar të shtresës së ngjeshur (Koni i rërës)", "ASTM D1556 / D1556M - 24e1; AASHTO T 191-14 (2022)", "1.1÷2.4 g/cm3"],
  ["AT-051", "GJEOTEKNIKE - DHERA", "Përcaktimi peshës volumore të dheut", "BS EN ISO 17892-2:2014", "1.1-1.8 gr/cm3"],
  ["AT-052", "GJEOTEKNIKE - DHERA", "Përcaktimi i lagështisë natyrale e dheut", "BS EN ISO 17892-1:2014+A1:2022", "≥ 0.05%"],
  ["AT-053", "GJEOTEKNIKE - DHERA", "Përcaktimi i densitetit maksimal në varësi të lagështisë optimale (Proktor)", "AASHTO T 99-22; AASHTO T 180-22; ASTM D1557 - 12(2021); ASTM D698 - 12(2021); BS EN 13286-2:2010", "1.4÷2.35 g/cm3"],
  ["AT-054", "GJEOTEKNIKE - DHERA", "Përcaktimi i aftësisë mbajtëse kaliforniane (CBR)", "AASHTO 193-22; ASTM D 1883-21; BS EN 13286-47:2021", "0.1÷120%"],
  ["AT-055", "GJEOTEKNIKE - DHERA", "Përcaktimi i madhësisë së grimcës (metoda hidrometër)", "BS 1377-2:2022; ASTM D7928-21e1", "≤ 2 mm"],
  ["AT-056", "GJEOTEKNIKE - DHERA", "Përcaktimi i modulit të deformimit të një shtrese mbushje toke (Piastra statike)", "CNR B.U 146", "< 300 MN/m2"],
  ["AT-057", "GJEOTEKNIKE - DHERA", "Përcaktimi i modulit të deformimit të një shtrese mbushje toke (Piastra dinamike)", "TP BF-StB Pjesa B 8.3", "< 150 MN/m2"],
  ["AT-058", "GJEOTEKNIKE - DHERA", "Përcaktimi i rezistencës në prerje e dherave (Direct shear)", "BS EN ISO 17892-8:2018; BS EN ISO 17892-9:2018", "0.1÷5 kN"],
  ["AT-059", "GJEOTEKNIKE - DHERA", "Përcaktimi i limitit të rrjedhshmërisë dhe plasticitetit (kufijtë e Atteberg)", "ASTM D 4318 - 17e1; AASHTO T89-2022; BS EN ISO 17892-12:2018+A2:2022", "LI=(1÷90%); PL=(1÷40%); IP=(1÷60%)"],
  ["AT-060", "GJEOTEKNIKE - DHERA", "Përcaktimi i rezistencës në tërheqje indirekte (Prova braziliane)", "BS EN 13286-42:2003", "< 15 MPa"],
  ["AT-061", "GJEOTEKNIKE - DHERA", "Dynamic Con Penetration (DCP)", "ASTM D6951 / D6951M - 18", "0.1÷120%"],
  ["AT-062", "GJEOTEKNIKE - DHERA", "Përcaktimi i konsolidimit një dimensional (Oedometer)", "ASTM D2435 / D2435M - 11(2020); BS EN ISO 17892-5:2017", "Uljet vertikale 0.1÷10 mm"],
  ["AT-063", "GJEOTEKNIKE - DHERA", "Përcaktimi i rezistencës në prerje të dherave koheziv natyral (Shizometer-Vane portabël)", "BS EN ISO 17892-8:2018", "0.1÷25 N/cm2"],
  ["AT-064", "GJEOTEKNIKE - DHERA", "Përcaktimi i madhësisë së grimacave (Analiza granulometrike)", "ASTM D6913 / D6913M - 17", "0.063÷150 mm"],
  ["AT-065", "PROVA JO-DESTRUKTIVE NË STRUKTURA BETONI", "Përcaktimi i integritetit të pilotave", "ASTM D 5882-16", "1÷30 m"],
  ["AT-066", "PROVA JO-DESTRUKTIVE NË STRUKTURA BETONI", "Përcaktimi i vendodhjes së shufrave të çelikut në strukturë", "BS 1881:204:1988", "0.5÷80 mm"],
  ["AT-067", "PROVA JO-DESTRUKTIVE NË STRUKTURA BETONI", "Përcaktimi i diametrit të shufrave të çelikut në strukturë", "", "Φ (8÷40) mm"],
  ["AT-068", "PROVA JO-DESTRUKTIVE NË STRUKTURA BETONI", "Përcaktimi i trashësis së betonit që mbulon armaturën", "", "Φ8=8÷80 mm; Φ40=5÷60 mm"],
  ["AT-069", "PROVA JO-DESTRUKTIVE NË STRUKTURA BETONI", "Përcaktimi i rezistencës mekanike në shtypje me sklerometër", "BS EN 12504-2:2021", "10÷70 MPa"],
  ["AT-070", "PROVA JO-DESTRUKTIVE NË STRUKTURA BETONI", "Përcaktimi i shpejtësisë së valës në beton", "BS EN 12504-4:2021; ASTM C 597-22", "10÷6000 m/s"],
  ["AT-071", "Rebar / Shufër Çeliku", "Përcaktimi i peshës nominale", "BS EN ISO 15630-1:2019; BS EN ISO 6892-1:2019", "0.4÷6.3 kg/ml"],
  ["AT-072", "Rebar / Shufër Çeliku", "Përcaktimi i diametrit nominal", "BS EN ISO 15630-1:2019; BS EN ISO 6892-1:2019", "4÷30 mm"],
  ["AT-073", "Rebar / Shufër Çeliku", "Përcaktimi i qëndrueshmërisë në tërheqje", "BS EN ISO 15630-1:2019; BS EN ISO 6892-1:2019", "5÷1000 kN"],
  ["AT-074", "Rebar / Shufër Çeliku", "Përcaktimi i zgjatimit total", "BS EN ISO 15630-1:2019; BS EN ISO 6892-1:2019", "1÷25%"],
  ["AT-075", "SHKËMBINJ/GURE NATYRALE", "Përcaktimi i dimensioneve te shkembinjve/gureve natyrore ne forme flete, kubike ose bllok", "BS EN 772-15:2011", "0.1÷500 mm"],
  ["AT-076", "SHKËMBINJ/GURE NATYRALE", "Përcaktimi i densitetit volumor, specifik dhe aparent", "BS EN 1936:2006; BS EN 772-4:1998; ASTM D 6473-15", "500÷3200 kg/m3"],
  ["AT-077", "SHKËMBINJ/GURE NATYRALE", "Përcaktimi i ujëthithjes në presion normal (absorbimi në presion atmosferik)", "BS EN 13755:2008", "0.1÷10 %"],
  ["AT-078", "SHKËMBINJ/GURE NATYRALE", "Përcaktimi i lagështirës natyrale", "ASTM D2216 - 19", "0.1÷10%"],
  ["AT-079", "SHKËMBINJ/GURE NATYRALE", "Përcaktimi i rezistencës në shtypje", "BS EN 1926:2006; ASTM D5873-2014; ASTM D6032 / D6032M - 17", "1÷88 MPa"],
  ["AT-080", "SHKËMBINJ/GURE NATYRALE", "Përcaktimi i rezistencës në përkulje", "BS EN 12372:2022; BS EN 13161:2008", "0.05÷15 MPa"],
  ["AT-081", "PRODUKTE TERMOIZOLUESE", "Përcaktimi i dimensioneve", "BS EN ISO 29465:2022; BS EN ISO 29466:2022; BS EN 824:2013; BS EN ISO 29468:2022", "(L x W x H) mm"],
  ["AT-082", "PRODUKTE TERMOIZOLUESE", "Përcaktimi i densitetit volumor aparent", "BS EN 1602:2013", "10÷40 kg/m3"],
  ["AT-083", "PRODUKTE TERMOIZOLUESE", "Përcaktimi i absorbimit", "BS EN ISO 29767:2019", "≥ 0.05 kg/m2"],
  ["AT-084", "PRODUKTE TERMOIZOLUESE", "Percaktimi i rezistencës në shtypje pas 10 % deformim", "BS EN ISO 29469:2022", "30÷500 kPa"],
  ["AT-085", "BETON I NGURTËSUAR", "Mostrat e marra nga struktura - Marrja, ekzaminimi dhe testimi në shtypje", "BS EN 12504-1:2019", "< 2000 kN", "BS EN 12504-1:2019"],
  ["AT-086", "NGJITËS PËR PLLAKA QERAMIKE (KOLLA)", "Përcaktimi i rezistencës së ngjitjes", "BS EN 12004-2:2017", "≤ 4 MPa"],
  ["AT-087", "SHTESA PËR BETON (ADITIVË)", "Përcaktimi i lëndës së thatë", "BS EN 480-8:2012", "0-100 %"],
  ["AT-088", "SHTESA PËR BETON (ADITIVË)", "Përcaktimi i reduktimit të ujit", "BS EN 480-1:2023", "≤ 50 %"]
];

export const accreditedTests: AccreditedTest[] = accreditedTestRows.map(([id, sampleType, testName, standard, measurementRange, samplingStandard]) => ({
  id,
  sampleType: displaySampleType(sampleType),
  testName,
  standard,
  measurementRange,
  samplingStandard
}));

function isAllUppercaseSampleType(sampleType: string) {
  return sampleType === sampleType.toLocaleUpperCase("sq-AL") && sampleType !== sampleType.toLocaleLowerCase("sq-AL");
}

export const accreditedSampleTypes = Array.from(new Set(accreditedTests.map((test) => test.sampleType))).filter((sampleType) => !isAllUppercaseSampleType(sampleType));

export function getAccreditedTestsForSampleType(sampleType: string) {
  const normalizedSampleType = normalizeSampleType(sampleType);
  return accreditedTests.filter((test) => test.sampleType === normalizedSampleType);
}

export function getAccreditedTestById(id: string) {
  return accreditedTests.find((test) => test.id === id);
}

export function isConcreteCompressiveAccreditedTest(test?: AccreditedTest) {
  return test?.id === "AT-022" || test?.id === "AT-CONC-COMP-KUBIKE";
}

export function isConcreteFlexuralAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType === "AT-CONC-FLEX-KUBIKE" || testIdOrType === "AT-023" || testIdOrType === "Përcaktimi i rezistencës në përkulje");
}

export function isConcreteWaterPenetrationAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType === "AT-CONC-WATER-KUBIKE" || testIdOrType === "AT-027" || testIdOrType === "Përcaktimi i nivelit të depërtimit të ujit në betonin e ngurtësuar");
}

export function isConcreteDensityAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType === "AT-CONC-DENS-KUBIKE" || testIdOrType === "AT-026" || testIdOrType === "Përcaktimi i densitetit (pesha volumore), në betonin e ngurtësuar");
}

export function isConcreteIndirectTensileAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType === "AT-CONC-SPLIT-KUBIKE" || testIdOrType === "AT-024" || testIdOrType === "Përcaktimi i rezistencës në tërheqje indirekte");
}

export function isThermalInsulationAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-THERM-") || testIdOrType === "Përcaktimi i karakteristikave fiziko-mekanike të produkteve termoizoluese");
}

export function isCementConsistencyAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType === "AT-CEM-CONS-SETTING-EXP" || testIdOrType === "Konsistenca, koha e prezës dhe ekspansioni");
}

export function isCementStrengthAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType === "AT-CEM-STRENGTH" || testIdOrType === "Rezistenca në shtypje dhe përkulje e çimentos");
}

export function isCementBlaineBsEnAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType === "AT-CEM-BLAINE-BSEN" || testIdOrType === "Sipërfaqja specifike Blaine sipas BS EN");
}

export function isCementBlaineAstmAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType === "AT-CEM-BLAINE-ASTM" || testIdOrType === "Sipërfaqja specifike Blaine sipas ASTM");
}

export function isSteelTensileAccreditedTest(test?: AccreditedTest) {
  return test?.id === "AT-073";
}

export function isSteelSampleType(sampleType: string) {
  return normalizeSampleType(sampleType) === "Shufër Çeliku / Rebar";
}

export function isAggregateGranulometryAccreditedTest(test?: AccreditedTest) {
  return Boolean(test?.id.startsWith("AT-GRA-") || test?.id === "AT-001");
}

export function isAggregateGranulometrySampleType(sampleType: string) {
  return ["Rërë / Sand", "Zhavorr 1 / Gravel 1", "Zhavorr 2 / Gravel 2", "Filer / Filler", "Dhe / Soil"].includes(normalizeSampleType(sampleType));
}

export function isAggregateChemicalAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-CHEM-") || testIdOrType === "Klorure dhe sulfate në agregate");
}

export function isAggregateLosAngelesAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-LA-") || testIdOrType === "Përcaktimi i rezistencës në fragmentim (Los Angeles)");
}

export function isAggregateFreezeThawAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-FT-") || testIdOrType === "Përcaktimi i rezistencës ndaj cikleve ngrirje-shkrirje");
}

export function isAggregateAcvAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-ACV-") || testIdOrType === "Përcaktimi i rezistencës në thërrmim (ACV)");
}

export function isAggregateDensityAbsorptionAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-DENS-") || testIdOrType === "Përcaktimi i peshës specifike dhe absorbimit");
}

export function isAggregateFillerDensityAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType === "AT-FILLER-DENS" || testIdOrType === "Përcaktimi i densitetit specifik të filerit");
}

export function isAggregateShapeIndexAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-SHAPE-") || testIdOrType === "Përcaktimi i indeksit të formës");
}

export function isAggregateFlakinessIndexAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-FLAKE-") || testIdOrType === "Përcaktimi i indeksit të ciflosjes");
}

export function isAggregateElongationIndexAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-ELONG-") || testIdOrType === "Përcaktimi i indeksit të zgjatimit");
}

export function isAggregateBulkDensityAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-BULK-") || testIdOrType === "Përcaktimi i peshës volumore të agregateve");
}

export function isAggregateSandEquivalentAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-SE-") || testIdOrType === "Vlerësimi i imtesisë. Përcaktimi ekuivalentit të rërës");
}

export function isAggregateSoundnessAccreditedTest(testIdOrType?: string) {
  return Boolean(testIdOrType?.startsWith("AT-SOUND-") || testIdOrType === "Përcaktimi i humbjes në peshë me sulfat magnezi (Soundness)");
}

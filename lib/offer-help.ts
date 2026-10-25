/**
 * What each offer field actually does to the document.
 *
 * A label says what a field is called; it does not say where the value lands
 * or what it commits the lab to. Several of these are easy to read backwards —
 * "Zbritja mbi prag" changes no price on the offer, it promises one if the
 * client's monthly volume reaches a threshold later — so the explanation is
 * written out here and shown beside the field.
 *
 * Keyed by field key, shared by both templates. Where a term sits in a
 * different numbered section in each, the text names both rather than
 * pretending there is one.
 */
export const OFFER_FIELD_INFO: Record<string, string> = {
  /* ----------------------------------------------------------- the offer */
  offerNumber:
    "Numri i referencës së ofertës. Shkruhet si SL-OF-<nr>/2026 në kopertinë, në Kontrollin e Dokumentit dhe në paragrafin e pranimit në fund. Caktohet vetë, vijim i numrit më të lartë të vitit në regjistër, dhe nuk ripërdoret.",
  offerDate:
    "Data e lëshimit. Shkruhet në kopertinë, në tabelën «Informacioni i ofertës», në historinë e rishikimeve dhe mbi letrën shoqëruese («Durrës, data»).",
  priceValidity:
    "Afati i vlefshmërisë së çmimeve të Seksionit 9. Shkruhet në tabelën e ofertës dhe në pikën 10.1. Pas kësaj date klienti duhet të kërkojë ofertë të re.",

  /* ---------------------------------------------------------- the client */
  clientName:
    "Emri ligjor i klientit. Shkruhet në kopertinë, në tabelën e klientit, në adresën e letrës shoqëruese, në tekstin e ofertës dhe në formularin e porosisë.",
  clientAddress: "Adresa e klientit. Shkruhet në tabelën e klientit dhe mbi letrën shoqëruese.",
  contactPerson:
    "Personi që merr ofertën. Shkruhet si «Në vëmendje të:» mbi letrën shoqëruese dhe në tabelën e klientit.",
  clientContact:
    "Emri, telefoni dhe e-maili i personit të kontaktit, të ndarë me presje. Shkruhet në rreshtin «Personi i kontaktit» të tabelës së klientit.",
  clientRequest:
    "Si dhe kur erdhi kërkesa, p.sh. «e-mail i datës 12.03.2026». Shkruhet në rreshtin «Kërkesa e klientit» — është gjurma që lidh ofertën me kërkesën, sipas ISO/IEC 17025 §7.1.",
  projectName:
    "Emërtimi i objektit. Shkruhet në kopertinë, në tabelën e ofertës, në temën e letrës shoqëruese, në tekst dhe në formularin e porosisë.",

  /* ---------------------------------------------------- the site (geotech) */
  location:
    "Vendndodhja e objektit. Shkruhet nën titullin e kopertinës, në rreshtin «Projekti» dhe në temën e letrës shoqëruese.",
  siteZone: "Zona dhe bashkia. Hap pikën 1.1: «Sheshi i ndërtimit ndodhet në …».",
  siteDetails:
    "Adresa ose njësia strukturore, sipërfaqja e truallit dhe koordinatat. Vijon në pikën 1.1 pas zonës.",
  buildingDescription:
    "Numri i kateve mbi tokë dhe nëntokë, funksioni dhe lloji i themelit. Shkruhet në pikën 1.1 si «Objekti i parashikuar: …» — përcakton thellësinë e investigimit, prandaj duhet i saktë.",
  expectedGround:
    "Kushtet që pritet të hasen. Shkruhet në përmbledhjen ekzekutive, pas «kushtet e pritshme të truallit në zonë:». Vlerësim paraprak, që verifikohet me investigimin.",
  includedForGround:
    "Çfarë mbulon oferta pikërisht për kushtet e mësipërme. Vijon në të njëjtin paragraf: «Për këtë arsye, oferta përfshin …».",

  /* ------------------------------------------------- the scope (geotech) */
  boreholeCount:
    "Numri i shpimeve. Shkruhet në përmbledhjen ekzekutive dhe në pikën 2.1, dhe nxjerr sasitë e rreshtave A3, B1 dhe B2 të preventivit.",
  boreholeDepth:
    "Thellësia e një shpimi. Shumëzohet me numrin e shpimeve për metrat e përgjithshëm (rreshti B1) dhe për mbushjen (B6) e piezometrat (C1).",
  sptCount: "Numri i provave SPT. Shkruhet në përmbledhjen ekzekutive dhe bëhet sasia e rreshtit B3.",
  undisturbedSamples:
    "Kampione U100 ose me mure të holla. Sasia e rreshtit B4, dhe bazë për sasitë orientuese të Tabelës 2.1.",
  disturbedSamples:
    "Kampione në qese ose kavanoz. Sasia e rreshtit B5, dhe bazë për granulometrinë dhe Atterbergun në Tabelën 2.1.",
  piezometerCount:
    "Numri i piezometrave. Shkruhet në pikën 2.4 dhe nxjerr rreshtat C1 dhe C2; shpimet me piezometër nuk mbushen, prandaj zvogëlon edhe B6.",
  monitoringVisits: "Vizitat për matjen e nivelit të ujit. Shkruhet në pikën 2.4 dhe bëhet sasia e rreshtit C3.",
  monitoringLastDay:
    "Dita e vizitës së fundit të monitorimit, në pikën 2.4: «pas 24 orësh, pas 7 ditësh dhe pas X ditësh».",
  maswProfiles:
    "Numri i profileve sizmike MASW. Shkruhet në pikën 2.6 dhe bëhet sasia e rreshtit D1. Numër, se rreshti çmimohet për profil.",
  durationWeeks: "Kohëzgjatja e parashikuar, në përmbledhjen ekzekutive: «X javë nga miratimi».",
  drillRate: "Ritmi orientues i shpimit, në pikën 5: «rreth X m në ditë për sondë». Mund të jepet si interval.",
  rigModel:
    "Modeli i sondës, në listën e pajisjeve të pikës 4. Lëre bosh dhe fjalia lexohet pa të, pa mbetur presje bosh.",
  waterSupply:
    "Kush sigurohet uji i shpimit, në kushtet e pikës 7. «Përfshihet në çmim» e shton në fjali; përndryshe mbetet detyrim i klientit.",

  /* ------------------------------------------------------------ the team */
  qualityManager: "Emri në rreshtin «Menaxheri i cilësisë» të tabelës së ekipit, pika 1.2.",
  clientCoordinator: "Emri në rreshtin «Koordinatori i klientit» të tabelës së ekipit, pika 1.2.",
  technicianCount:
    "Sa inxhinierë dhe teknikë laboratori ka ekipi. Shkruhet si numër në rreshtin e fundit të tabelës së ekipit, pika 1.2.",
  projectCoordinator: "Emri në rreshtin «Koordinator i projektit» të tabelës së ekipit, pika 4.",
  geologist: "Emri në rreshtin «Inxhinier gjeolog» të tabelës së ekipit, pika 4.",
  surveyor: "Emri në rreshtin «Topograf / hartograf» të tabelës së ekipit, pika 4.",

  /* ----------------------------------------------------------- the price */
  discountPercent:
    "Zbritja e KËSAJ oferte. Ndryshon çmimet e shtypura: me 15% çmimi 1,667 del 1,417, në të dyja kolonat e Seksionit 9 dhe në formularin e porosisë, dhe oferta e shkruan zbritjen me fjalë. Nuk ngatërrohet me «Zbritje për volum» te Kushtet tregtare, që është premtim për të ardhmen dhe nuk prek asnjë çmim. Çmimi i shkruar me dorë mbi një rresht nuk preket nga kjo zbritje.",

  /* ----------------------------------------------------- the credentials */
  certifications:
    "Lista e certifikatave në fuqi, në rreshtin «Sistemi i menaxhimit të kompanisë». Është deklaratë ndaj klientit: shkruaj vetëm ato që mbahen realisht dhe janë të vlefshme.",

  /* -------------------------------------------------- the commercial terms */
  coreRepair:
    "Seksioni 8, Detyrimet e klientit: nëse riparimi i vrimave të karrotave përfshihet në çmim apo jo. Kur nuk përfshihet, mbetet punë e klientit.",
  specialOrderPayment:
    "Pika 10.2: si paguhet një porosi e veçantë — 100% paraprakisht, apo me dorëzimin e raportit.",
  paymentDays:
    "Brenda sa ditëve nga lëshimi paguhet fatura, me transfertë bankare. Pika 10.2 e ofertës laboratorike, pika 11.1 e ofertës gjeoteknike.",
  frameworkThreshold:
    "Pika 10.3, Zbritje për volum: vlera mujore mbi të cilën klienti fiton zbritje. PREMTIM për të ardhmen — nuk ndryshon asnjë çmim të Seksionit 9.",
  frameworkDiscount:
    "Pika 10.3: zbritja që fiton klienti kur kalon pragun mujor. Shkruhet si kusht në tabelë, nuk zbatohet mbi çmimet e kësaj oferte.",
  longTermMonths:
    "Pika 10.3: kohëzgjatja e kontratës kuadër mbi të cilën fitohet zbritja e dytë, në muaj.",
  longTermDiscount:
    "Pika 10.3: zbritja për kontratë kuadër të gjatë. Edhe kjo kusht, jo çmim: për të ulur çmimet e kësaj oferte përdor «Zbritje mbi çmimet standarde» te Çmimet.",
  urgentWindow:
    "Pika 10.4: afati brenda të cilit jepen rezultatet me kërkesë urgjente, kur metoda e lejon.",
  urgentSurcharge: "Pika 10.4: shtesa mbi çmimin e testimit për shërbimin urgjent.",
  cancellationCharge:
    "Pika 10.5: sa faturohet një vizitë në kantier e anuluar me më pak se 12 orë njoftim, ose kur teknikët presin mbi 2 orë për vonesë të betonimit.",
  sampleRetentionDays:
    "Sa ditë ruhen mostrat pas lëshimit të raportit, para asgjësimit. Pika 10.6 e ofertës laboratorike, pika 2.7 e gjeoteknikes. Mostrat e provave shkatërruese asgjësohen menjëherë.",
  transportZone:
    "Zona brenda të cilës transporti faturohet me çmimin standard. Shkruhet në rreshtin P1 të Seksionit 9 dhe në rreshtat R3 dhe R4, që i referohen daljes jashtë kësaj zone.",
  advancePercent: "Pika 11.1: pjesa e vlerës që paguhet paradhënie, me nënshkrimin e kontratës.",
  interimPercent: "Pika 11.1: pjesa e vlerës që paguhet pas përfundimit të punimeve në terren.",
  finalPercent:
    "Pika 11.1: pjesa e vlerës që paguhet pas dorëzimit të raporteve. Të tria bashkë duhet të bëjnë 100%.",
  variationThreshold:
    "Pika 11.2: mbi këtë përqindje të vlerës së ofertës, punimet shtesë kryhen vetëm pas miratimit me shkrim të klientit. Mbrojtja e të dyja palëve kur truall i paparashikuar e zgjeron punën."
};

/**
 * The tables, which sit inside a horizontal scroller and so cannot carry a
 * hint on their own cells — the panel would be clipped. These explain the
 * table from its heading, which is outside the scroller.
 */
export const OFFER_TABLE_INFO: Record<string, string> = {
  catalogue:
    "Katalogu i plotë i Seksionit 9: 108 testime në 13 grupe. Shëno testimet që përfshihen; të pazgjedhurat hiqen nga dokumenti dhe grupi pa asnjë të zgjedhur humb tabelën e kreun. Pa shënuar asgjë, klientit i shkon katalogu i plotë si listë çmimesh. Çdo çmim shkruhet pa TVSH; vlera me TVSH 20% shfaqet nën kutinë dhe shkruhet vetë në kolonën e dytë të ofertës. Sasia bosh do të thotë 1.",
  quantityMode:
    "«Vetëm çmimet njësi» e lë kolonën e sasisë dhe formularin e porosisë bosh, që klienti t’i plotësojë — e duhura kur puna nuk është përcaktuar. «Me sasi» shkruan sasitë në Seksionin 9 dhe mbush Tabelën 12.1 rresht për rresht, me nëntotal, TVSH dhe total.",
  bill:
    "Preventivi i Seksionit 10.1. A1, A2, E1, F1 dhe F2 janë shuma të plota me sasi 1; të tjerat matën dhe sasitë e tyre nxirren nga Fusha e punës, por shkruhen me dorë kur terreni e kërkon — fshij kutinë dhe kthehet sasia e nxjerrë. Çmimet nisin nga lista 2026, me zbritjen e grupit Çmimet, dhe shkruhen me dorë mbi rresht. Të gjitha pa TVSH; TVSH 20% shtohet në fund.",
  programme:
    "Tabela 2.1, programi orientues i testimeve laboratorike. Sasitë nxirren nga numri i kampioneve dhe shërbejnë si tregues për klientin; çmimi i tyre është i përfshirë në rreshtin E1 të preventivit, prandaj këto numra nuk shtojnë vlerë më vete."
};

/**
 * What each section of the form is for.
 *
 * Shown beside the group heading. Kushtet tregtare is the one that needs it
 * most: it is the contractual small print under the prices, and none of it
 * changes what this offer charges.
 */
export const OFFER_GROUP_INFO: Record<string, string> = {
  Oferta: "Identiteti i dokumentit: numri, data dhe vlefshmëria. Numri caktohet vetë dhe ruhet në regjistër.",
  Klienti:
    "Kujt i drejtohet oferta. Zgjidh klientin nga regjistri më sipër dhe mbushen vetë; i shkruar me dorë, klienti ruhet në regjistër kur gjenerohet oferta.",
  Objekti: "Objekti për të cilin jepet oferta, si shkruhet në kopertinë, në temë dhe në tekst.",
  "Fusha e punës":
    "Sa punë përmban oferta. Këto numra shkruhen në përshkrimin teknik dhe nxjerrin vetë sasitë e preventivit më poshtë.",
  Ekipi: "Emrat që shfaqen në tabelën e ekipit të projektit. Pa emër, rreshti del bosh.",
  Çmimet:
    "Çmimi i KËSAJ oferte. Zbritja e vendosur këtu ndryshon çmimet e shtypura në dokument. Çmimi i një rreshti të veçantë shkruhet drejtpërdrejt mbi rreshtin, në tabelat më poshtë.",
  Kredencialet: "Deklaratat për akreditimin dhe certifikimet. Shkruhen në tekst si fakte — mbaji të sakta.",
  "Kushtet tregtare":
    "Kushtet kontraktuale nën çmimet: afatet e pagesës, shërbimi urgjent, anulimet, ruajtja e mostrave dhe zbritjet për volum. Asnjëra prej tyre nuk ndryshon çmimet e kësaj oferte — ato vetëm shkruajnë kushtet që i shoqërojnë. Për të ulur çmimet, shih grupin Çmimet."
};

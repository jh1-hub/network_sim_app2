import { isConnected, findPath, isValidIP, isInSameSubnet, isPrivateIP } from '../utils.js';

export const MISSION_SETS = [
  {
    id: 'basic_course',
    title: "基礎マスターコース",
    description: "ネットワーク機器の役割、IPアドレス、Ping、暗号化など、ネットワークの基礎を順番に学びます。",
    level: "★☆☆",
    missions: [
      {
          id: 1,
          title: "基本の機器配置",
          description: "左のパネルから「パソコン」と「ルーター」を1台ずつキャンバスに配置してください。",
          hint: "機器リストからアイコンをドラッグ＆ドロップして配置します。まずはこの2つだけでOKです。",
          explanation: "ネットワークは「端末（PC）」と「通信機器」で構成されます。ルーターは異なるネットワーク同士をつなぐ重要な機器です。",
          check: (state) => {
              const hasPC = state.devices.some(d => d.type === 'PC');
              const hasRouter = state.devices.some(d => d.type === 'ROUTER');
              return hasPC && hasRouter;
          }
      },
      {
          id: 2,
          title: "スイッチを使った接続",
          description: "「スイッチ」を追加し、パソコンとルーターをスイッチ経由で接続してください。",
          hint: "構成: [パソコン] ↔ [スイッチ] ↔ [ルーター]。PCとルーターを直接つながないように注意してください。間違ってつないだ場合は、右パネルのリストからゴミ箱アイコンで削除できます。",
          explanation: "通常、PCはルーターに直結せず「スイッチ」につなぎます。スイッチはLAN内のポートを増やし、効率的にデータを転送する役割を持ちます。",
          check: (state) => {
              const switchDevice = state.devices.find(d => d.type === 'SWITCH');
              if (!switchDevice) return false;
              
              const pc = state.devices.find(d => d.type === 'PC');
              const router = state.devices.find(d => d.type === 'ROUTER');
              if(!pc || !router) return false;

              // 厳格なチェック: PCとルーターが直接つながっていないこと
              const directConnection = isConnected(state.connections, pc.id, router.id);
              if (directConnection) return false;

              // スイッチ経由でつながっているか
              const pcToSwitch = isConnected(state.connections, pc.id, switchDevice.id);
              const routerToSwitch = isConnected(state.connections, router.id, switchDevice.id);

              return pcToSwitch && routerToSwitch;
          }
      },
      {
          id: 3,
          title: "IPアドレスの設定",
          description: "パソコンとルーターに正しいIPアドレスを設定してください。",
          hint: "機器をクリックし、右パネルでIPを入力します。例: ルーター(192.168.1.1), パソコン(192.168.1.2)。",
          explanation: "IPアドレスはネットワーク上の「住所」です。同じLAN内にある機器同士は、ネットワーク部（例：192.168.1）を揃える必要があります。",
          check: (state) => {
              const pc = state.devices.find(d => d.type === 'PC');
              const router = state.devices.find(d => d.type === 'ROUTER');
              if(!pc || !router) return false;
              
              return isValidIP(pc.ip) && isValidIP(router.ip) && pc.ip !== router.ip;
          }
      },
      {
          id: 4,
          title: "通信テスト (Ping)",
          description: "パソコンからルーターへ実際に「Ping」を実行し、通信を成功させてください。",
          hint: "設定だけでは不十分です。PCを選択→Pingテスト欄にルーターのIPを入力→「実行」を押し、青いパケットが往復して「応答あり」とログに出るのを確認してください。",
          explanation: "Ping（ピング）は疎通確認の基本コマンドです。設定が正しくても、ファイアウォールや物理的な断線があれば通りません。「実際に通ったこと」を確認するのがネットワークエンジニアの仕事です。",
          check: (state) => {
              return state.missionFlags.pingSuccess;
          }
      },
      {
          id: 5,
          title: "暗号化通信の体験",
          description: "「通信の暗号化」をONにして、再度Pingを実行するか、鍵交換のアニメーションを確認してください。",
          hint: "暗号化スイッチをONにするだけではクリアになりません。ONにした状態で通信（Pingなど）を行い、南京錠アイコンや鍵交換が表示されるのを確認してください。",
          explanation: "インターネットなどの公共のネットワークを通るデータは、盗聴のリスクがあります。TLSなどを用いて暗号化することで、内容を秘密に保つことができます。",
          check: (state) => {
              return state.missionFlags.encryptedSuccess;
          }
      }
    ]
  },
  {
    id: 'ip_master_course',
    title: "IPアドレスマスターコース",
    description: "プライベートIPとグローバルIPの違いを理解し、インターネット通信の仕組みを学びます。",
    level: "★★★",
    missions: [
      {
        id: 1,
        title: "プライベートIPの世界",
        description: "LAN内では「プライベートIPアドレス」を使います。PCとルーターを置き、それぞれに `192.168` から始まるアドレスを設定して接続してください。",
        hint: "PC(192.168.1.10), ルーター(192.168.1.1) のように設定します。間にスイッチを挟むのが理想的です。",
        explanation: "192.168.x.x などのプライベートIPは、家庭や学校内で自由に使えるアドレスです。世界中で同じ番号が使われていますが、LANの外には出られないため問題になりません。",
        check: (state) => {
            const pc = state.devices.find(d => d.type === 'PC');
            const router = state.devices.find(d => d.type === 'ROUTER');
            if(!pc || !router) return false;
            
            const connected = !!findPath(state.devices, state.connections, pc.id, router.id);
            const pcIsPrivate = isPrivateIP(pc.ip);
            const routerIsPrivate = isPrivateIP(router.ip);
            
            return connected && pcIsPrivate && routerIsPrivate;
        }
      },
      {
        id: 2,
        title: "グローバルIPの世界",
        description: "インターネット上のサーバーは「グローバルIPアドレス」を持っています。サーバーを配置し、プライベートIP以外のアドレス(例: 8.8.8.8)を設定してください。",
        hint: "10.x.x.x, 172.16-31.x.x, 192.168.x.x 以外のアドレスを入力してください。",
        explanation: "グローバルIPアドレスは、世界中で重複しない唯一のアドレスです。インターネット上のサーバーやWebサイトは必ずこのアドレスを持っています。",
        check: (state) => {
            const server = state.devices.find(d => d.type === 'SERVER');
            if(!server) return false;
            return isValidIP(server.ip) && !isPrivateIP(server.ip);
        }
      },
      {
        id: 3,
        title: "ルーターによる中継",
        description: "プライベートIPのPCから、グローバルIPのサーバーへ通信します。ルーターを介してすべてを接続してください。",
        hint: "構成: PC(プライベート) ↔ スイッチ ↔ ルーター ↔ サーバー(グローバル)。ルーターが中継役になります。",
        explanation: "プライベートIPを持つPCがインターネット（グローバルIP）に接続するには、ルーターの「NAT（アドレス変換）」機能が不可欠です。ルーターがIPを書き換えることで、外との通信が可能になります。",
        check: (state) => {
            const pc = state.devices.find(d => d.type === 'PC' && isPrivateIP(d.ip));
            const server = state.devices.find(d => d.type === 'SERVER' && !isPrivateIP(d.ip));
            const router = state.devices.find(d => d.type === 'ROUTER');
            
            if (!pc || !server || !router) return false;
            
            const path = findPath(state.devices, state.connections, pc.id, server.id);
            if (!path) return false;
            
            return path.includes(router.id);
        }
      }
    ]
  },
  {
    id: 'soho_course',
    title: "小規模オフィス構築コース",
    description: "複数の端末やプリンタをつなぐLANの構築から、インターネットへの接続までを段階的に学びます。",
    level: "★★☆",
    missions: [
      {
          id: 1,
          title: "社内LANの配線 (スター型)",
          description: "社内ネットワークを作ります。パソコン2台、プリンタ1台、スイッチ1台を配置し、すべてをスイッチに接続してください。",
          hint: "機器同士を直接つながず、すべてスイッチに集めるのがポイントです。これを「スター型トポロジー」と呼びます。",
          explanation: "現在のLAN配線は、スイッチを中心に放射状に広がる「スター型」が主流です。1本のケーブルが切れても、他の機器には影響が出ないため、障害に強い構成です。",
          check: (state) => {
              const pcs = state.devices.filter(d => d.type === 'PC');
              const printers = state.devices.filter(d => d.type === 'PRINTER');
              const switches = state.devices.filter(d => d.type === 'SWITCH');

              if (pcs.length < 2 || printers.length < 1 || switches.length < 1) return false;
              
              const sw = switches[0];
              const allConnected = [...pcs, ...printers].every(dev => isConnected(state.connections, dev.id, sw.id));
              
              return allConnected;
          }
      },
      {
          id: 2,
          title: "サブネットの統一",
          description: "配置した全機器に、同じネットワークのIPアドレス(例: 192.168.1.x)を設定し、パソコンからプリンタへPingを成功させてください。",
          hint: "192.168.1.10, 192.168.1.11, 192.168.1.20 のように第3オクテットまで揃えます。",
          explanation: "ルーターを使わずに通信できるのは、同じ「サブネット（ネットワーク）」にいる機器だけです。部署ごとにサブネットを分けるのが一般的です。",
          check: (state) => {
              const pcs = state.devices.filter(d => d.type === 'PC');
              const printers = state.devices.filter(d => d.type === 'PRINTER');
              
              const allValid = [...pcs, ...printers].every(d => isValidIP(d.ip));
              if (!allValid || pcs.length === 0 || printers.length === 0) return false;

              const baseIp = pcs[0].ip;
              const sameSubnet = [...pcs, ...printers].every(d => isInSameSubnet(d.ip, baseIp));
              if (!sameSubnet) return false;

              return !!findPath(state.devices, state.connections, pcs[0].id, printers[0].id);
          }
      },
      {
          id: 3,
          title: "インターネット接続機器の設置",
          description: "インターネットに接続するために、「ルーター」と「ONU」を追加配置し、スイッチ ↔ ルーター ↔ ONU の順に接続してください。",
          hint: "ONUは回線の終端装置です。[スイッチ] - [ルーター] - [ONU] の順で一列につなぎます。",
          explanation: "「ONU」が光信号を電気信号に変え、「ルーター」がインターネットへの経路を制御します。この2つが揃って初めてインターネットにつながります。",
          check: (state) => {
              const router = state.devices.find(d => d.type === 'ROUTER');
              const onu = state.devices.find(d => d.type === 'ONU');
              const sw = state.devices.find(d => d.type === 'SWITCH');

              if (!router || !onu || !sw) return false;

              if (isConnected(state.connections, sw.id, onu.id)) return false;

              const swToRouter = isConnected(state.connections, sw.id, router.id);
              const routerToOnu = isConnected(state.connections, router.id, onu.id);

              return swToRouter && routerToOnu;
          }
      },
      {
          id: 4,
          title: "デフォルトゲートウェイの役割",
          description: "ルーターのIPアドレスを設定し、パソコンからルーターへPingを通してください。",
          hint: "ルーターのIPは、PCと同じサブネット(例: 192.168.1.254)にします。PCにとってこのルーターが「外への出口（ゲートウェイ）」になります。",
          explanation: "PCが自分以外のネットワーク（インターネットなど）と通信する際、データを送る相手を「デフォルトゲートウェイ」と呼びます。通常はルーターのLAN側IPアドレスを指定します。",
          check: (state) => {
               const router = state.devices.find(d => d.type === 'ROUTER');
               const pc = state.devices.find(d => d.type === 'PC');
               
               if (!router || !pc) return false;
               if (!isValidIP(router.ip) || !isInSameSubnet(router.ip, pc.ip)) return false;

               return !!findPath(state.devices, state.connections, pc.id, router.id);
          }
      }
    ]
  },
  {
    id: 'server_course',
    title: "サーバー構築入門コース",
    description: "Webサーバーなどを想定し、サービスを提供する側（サーバー）と利用する側（クライアント）の関係を構築します。",
    level: "★★☆",
    missions: [
      {
          id: 1,
          title: "サーバーのセットアップ",
          description: "「サーバー」を1台配置し、固定IPアドレス(例: 10.0.0.1)を設定してください。",
          hint: "サーバーは住所（IP）が変わると困るため、手動で設定するのが一般的です。",
          explanation: "Webサーバーやファイルサーバーは、クライアントがアクセスする「目的地」です。IPアドレスがコロコロ変わると接続できなくなるため、固定IPアドレスを割り当てます。",
          check: (state) => {
              const server = state.devices.find(d => d.type === 'SERVER');
              return server && isValidIP(server.ip);
          }
      },
      {
          id: 2,
          title: "クライアント接続構成",
          description: "「スイッチ」と「パソコン」を追加し、PC ↔ Switch ↔ Server となるように接続・設定してください。",
          hint: "PCとサーバーを直結しないでください。必ずスイッチを経由させます。",
          explanation: "サーバーとクライアント（PC）の関係は「リクエスト（要求）」と「レスポンス（応答）」で成り立っています。スイッチを経由することで、将来的にPCが増えても対応できます。",
          check: (state) => {
              const pc = state.devices.find(d => d.type === 'PC');
              const server = state.devices.find(d => d.type === 'SERVER');
              const sw = state.devices.find(d => d.type === 'SWITCH');
              
              if (!pc || !server || !sw) return false;

              if (isConnected(state.connections, pc.id, server.id)) return false;

              const validIPs = isValidIP(pc.ip) && isValidIP(server.ip) && isInSameSubnet(pc.ip, server.ip);
              const path = findPath(state.devices, state.connections, pc.id, server.id);
              
              return validIPs && !!path;
          }
      },
      {
          id: 3,
          title: "複数クライアントの収容",
          description: "利用者が増えました。パソコンをもう1台追加し、2台のパソコン両方からサーバーへ通信経路が確保されている状態にしてください。",
          hint: "スイッチの空いているポートにもう1台つなぎます。IPアドレスの重複に注意してください。",
          explanation: "スイッチの利点は、ポートがある限り機器を増やせることです。サーバーは1台でも、同時に複数のクライアントからの要求をさばくことができます。",
          check: (state) => {
              const pcs = state.devices.filter(d => d.type === 'PC');
              const server = state.devices.find(d => d.type === 'SERVER');

              if (pcs.length < 2 || !server) return false;
              
              const allConnected = pcs.every(pc => {
                  return isValidIP(pc.ip) && 
                         isInSameSubnet(pc.ip, server.ip) && 
                         !!findPath(state.devices, state.connections, pc.id, server.id);
              });
              
              return allConnected;
          }
      }
    ]
  }
];
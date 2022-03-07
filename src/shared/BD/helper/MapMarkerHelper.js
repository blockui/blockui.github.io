import PinMarkerIcon from "assets/img/marker/dot_pinlet-2-medium1.png";
import GreenMarkerIcon from "assets/img/marker/dot_pinlet-2-medium.png";
import ShoppingMarkerIcon from "assets/img/marker/shoppingbag_pinlet-2-medium.png";
import MountainMarkerIcon from "assets/img/marker/mountain_pinlet-2-medium.png";
import RestaurantMarkerIcon from "assets/img/marker/restaurant_pinlet-2-medium.png";

const {L} = window

export default class MapMarkerHelper {
  static setLatLng(marker, {lat, lng}) {
    marker.setLatLng({lat, lng})
  }

  static getIcon(icon) {
    let iconUrl;
    let iconSize = [25, 41];
    switch (icon) {
      case "mountain":
        iconUrl = MountainMarkerIcon;
        iconSize = [28, 41];
        break
      case "restaurant":
        iconUrl = RestaurantMarkerIcon;
        iconSize = [28, 41];
        break
      case "shopping":
        iconUrl = ShoppingMarkerIcon;
        iconSize = [28, 41];
        break
      case "gray":
        iconUrl = PinMarkerIcon;
        iconSize = [28, 41];
        break
      case "green":
        iconUrl = GreenMarkerIcon;
        iconSize = [28, 41];
        break
      case "blue":
        iconUrl = MapMarkerHelper.ICON_MARKER_ICON;
        break
      case "red":
        iconUrl = MapMarkerHelper.ICON_MARKER_RED_PIN;
        break
      case "pin":
        iconUrl = MapMarkerHelper.ICON_CURRENT_POSITION;
        break
      default:
        iconUrl = PinMarkerIcon
        break;

    }
    return L.icon({
      ...MapMarkerHelper.iconOptions,
      iconUrl,
      iconSize
    })
  }
}


MapMarkerHelper.ICON_CURRENT_POSITION = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAEzUlEQVR42mL8//8/A60BQAAxMdABAAQQXSwBCCAWbIIv2NkZ/oEYzMwMP/7/FwW6xJeRmdkPGLT6f//+Ffz958/373//3vjJwLDjGwPD2i8MDHf+ApXzALErluAHCCBGbHECtgQozsjCYv6Xnb2Dk43NgZUF4p6///4x/Pz1i+Hbt28MX37+ZPj8///ddwwMzb8ZGBbxMjD8x2YJQABh9QkDUOFfRkZ7Di6uRfy8vHLsXFwMTEAMlgIa/OvLFwaQpYyfPzP8//FD+ef//7O/MjDwAY2fjM04gADCbgkjoyQLJ+ckLh4eOS4hIQYGSUkGBhDNyAg2mOPZMwaGN28Y/vz9ywAMOgbu379Z/zAwtAOD7DJQ9wF04wACCKslf5iYwjk5OPQ4QK6XkGBgUFZmYJCVZWAABRnIAqBP2b9/Z+AA4h+srAxsv38zMDIwcAN9k4rNEoAAwm4JI6MvCxMTAyPQAAZubogvNDQYGNjYGBiABjK8eMHACIw3ZmDCYASqAyVRZlBQMjDYYTMPIICwWgL0tho4+oCRDDYU6GJQ8DCALAVGOAMw4v8DgwrkI0akiAaypLGZBxBA2H0CDGNQCgImVAY2kOEg34AsArqa4cMHBoZXrxj+fv3K8AvogF/AOPkN0gPBjNjMAwggrJb8+PPn8fcfP8TZgK5mBBrICg0isCVAw/++f8/wHUh/A8UJ0DHA/ALGQFXvsZkHEEDYLWFg2Mf8/bsJEzjE/jFwAg1jAcUHMHX9BVr4A5iMv4LyCdCir8DgAgYgw3eIvtPYzAMIIKyW/GJgWPL/379EYPiLgpLod6AFLLDMCIyLn0BLvgN9ALLgM1DsC9QSoKMWYzMPIICwWgKM7stAf7cAi5Qenp8/WdmABjIzQoL7L9Dg30D8A2owyIJPQAy0bCHQr2uxmQcQQFgtYYSE8RRgMDACw7mK6f9/MRZQSoJG8F9oHADzBSiofgItXAoUL2OH2IsBAAKIBVfJyQj2EMNEoEsvAA1IBCZeK2AmVQaWXUzAfAQq214AHXACaNkqBgj+i8ssgABiwVdEQ9PjQSA+dFNb21g2JGSFmqys8tHz57/fO3y4WPfSpQ3AePj2j0BRDxBAWC35D3Tpf0jmYgApOOXs/P+lmtolZTOzz+Lm5gyM//79uvP8+dVngoLfHI4cYWACpkCYemwAIICwWrIqNhZFw09QEfL3LycwtTH9AyZbxh8/GFn+/eP4zMfHsNfFBZbbwT5Pw2IeQABhtQRkKEqwAV3KiFQNQCsikMUMv0D5hwAACCDsqQut4sHX1GAkoiECEEB0qeMBAogulgAEEF0sAQggulgCEEB0sQQggOhiCUAA0cUSgACiiyUAAUQXSwACiC6WAAQQXSwBCCC6WAIQQHSxBCCAsFda6KUwkI8uBmoqgVouxHQHAQIIqyWsoOYomiXAJtE3RkZQdwZiKAcHx3d2YL3DxEQ4MAACCKslMjIy6EKcb9++9QJaIAZqZIP4vLy8PsbGxs85OTlfg3yFDwAEEFZLHj58iC7kfeHChdXa2toMINf/+fOHFchvBYpz8/Hx1QAtwRtmAAGE1ZLbt2+jC90CunzLlStX7H/8+MELdMRvERGR83fv3j0BCkJCwQUQQIz06McDBBgAqrTXPzMSdEoAAAAASUVORK5CYII="
MapMarkerHelper.ICON_MARKER_RED_PIN = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABSCAMAAAA2N+cQAAAACXBIWXMAAAAcAAAAHAAPAbmPAAAAP1BMVEUAAAAAAADqQzXqQzXqQzUAAADqQzXqQzXqQzXmPzHqQzXvRzXqPzXqQzXqQzUAAADqQzXqQzW2GRnKKSGmDQ2VGcUeAAAAEXRSTlMABuqmfw3ezmA1Qw0ZwpoZUwX6ArEAAAHgSURBVHja7f3LmoMgDEYBcPeuRX3/Zx1FrQoBEmbTzdnN5XxJfmywO/YjNEpWwm6ISqoGa7Wjc27E2OYtXlcWoKp5ppqxEUyqaidtAtnFvMbYJCYS08dm+UBebRHURfV2gpqNReLN2QmsKN7ZSotGPr3WEng8CZ2hiOZutrYk7jMxNNEkJ1zmdWNeoL+18UiX9QugnsHy8Azn9cEc/FnwSKcvDzKPXpX/62X1CLpV8IhrgP8fx5BVrmBYsnKin80civ6UwoneL4FOw15/RJyxYnE4xccRPABztlP5v0cu3KhLxju3a2/TJvCB7BmYzob4zgntgCMbYEinLvPGAq4OdYq9JXJ2StrjO8Pl0Rb5a5UPFK+6Pfwlt/N6iyi9rViPvx/7l4i9yYG3AGSzg+8h70i/0R1UsuB7GeJ6VQxkzHkS9liXeYBM9C0wfZpQMBfJgJKvyYmAFEsSDUimPcYjAcWDuYgEhPgOAa6DmiEAlp7EeMCY+QEPgnXZMiRes4qhGUoa3WmKGt15PEADxXvmQyr42F20go8pPzSP8/O2FR2nefo8y1Fzism1PntttSaIW0E9uV7FpCklneh6HQtE12tTIE5KWDXRxD2czdzRpHBcyQtOPEh+aSTvUB3sZ/gDGXWq2M/ECdAAAAAASUVORK5CYII="
MapMarkerHelper.ICON_MARKER_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII="
MapMarkerHelper.ICON_MARKER_SHADOW = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC"


MapMarkerHelper.iconOptions = {
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  tooltipAnchor: [0, -36],
  popupAnchor: [1, -34],
  shadowUrl: MapMarkerHelper.ICON_MARKER_SHADOW
}


